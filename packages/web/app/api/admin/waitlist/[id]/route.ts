import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';

type Action = 'approve' | 'reject';

/**
 * PATCH /api/admin/waitlist/[id]
 * Body: { action: 'approve' | 'reject' }
 *
 * Approve: sets waitlist_signups.status = 'approved' and grants access to
 *          the matching user account (profiles.access_granted = true).
 * Reject:  sets waitlist_signups.status = 'rejected' only.
 *
 * Requires the caller to be authenticated with role = 'superadmin'.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Verify the caller is a superadmin using their session cookie.
  try {
    const serverClient = await createSupabaseServerClient();
    const {
      data: { session },
    } = await serverClient.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await serverClient
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Auth check failed' }, { status: 500 });
  }

  // Parse action from body.
  let action: Action;
  try {
    const body = await request.json();
    if (body.action !== 'approve' && body.action !== 'reject') {
      return NextResponse.json(
        { error: 'action must be "approve" or "reject"' },
        { status: 400 }
      );
    }
    action = body.action as Action;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  // Fetch the waitlist signup to get the email.
  const { data: signup, error: fetchError } = await admin
    .from('waitlist_signups')
    .select('id, email, status')
    .eq('id', id)
    .single();

  if (fetchError || !signup) {
    return NextResponse.json({ error: 'Signup not found' }, { status: 404 });
  }

  const newStatus = action === 'approve' ? 'approved' : 'rejected';

  // Update waitlist status.
  const { error: updateError } = await admin
    .from('waitlist_signups')
    .update({ status: newStatus })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update waitlist status' }, { status: 500 });
  }

  // On approval: grant access to the user profile (if the account exists).
  if (action === 'approve') {
    // Look up the auth user by email to find their profile id.
    const { data: authUsers } = await admin.auth.admin.listUsers();
    const matchedUser = authUsers?.users?.find(
      (u) => u.email?.toLowerCase() === signup.email.toLowerCase()
    );

    if (matchedUser) {
      await admin
        .from('profiles')
        .update({ access_granted: true })
        .eq('id', matchedUser.id);
    }
    // If no account exists yet (email-only waitlist entry), access will be
    // granted when the user signs up and the admin approves them again.
  }

  return NextResponse.json({ ok: true, status: newStatus });
}
