import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';

const VALID_STATUSES = ['pending', 'contacted', 'qualified', 'rejected'] as const;

/**
 * PATCH /api/admin/investors/[id]
 * Body: { status: 'pending' | 'contacted' | 'qualified' | 'rejected' }
 *
 * Requires the caller to be authenticated with role = 'superadmin'.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const serverClient = await createSupabaseServerClient();
    const { data: { session } } = await serverClient.auth.getSession();

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

  let status: string;
  try {
    const body = await request.json();
    if (typeof body?.status !== 'string' || !VALID_STATUSES.includes(body.status as (typeof VALID_STATUSES)[number])) {
      return NextResponse.json(
        { error: 'status must be one of: pending, contacted, qualified, rejected' },
        { status: 400 },
      );
    }
    status = body.status;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const admin = createSupabaseAdminClient();

  const { error } = await admin
    .from('investor_inquiries')
    .update({ status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Failed to update inquiry status' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status });
}
