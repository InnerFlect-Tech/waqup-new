import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * Superadmin-only: resets onboarding_completed_at to NULL for the current user.
 * Use to re-run onboarding flow for testing.
 *
 * Flow: POST → update profiles → return success
 * Client should navigate to /onboarding on success.
 */
export async function POST(): Promise<NextResponse> {
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
    return NextResponse.json({ error: 'Forbidden — superadmin only' }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from('profiles')
    .update({ onboarding_completed_at: null })
    .eq('id', session.user.id);

  if (error) {
    console.error('Onboarding reset failed:', error);
    return NextResponse.json({ error: 'Failed to reset onboarding' }, { status: 500 });
  }

  return NextResponse.json({ success: true, redirectTo: '/onboarding' });
}
