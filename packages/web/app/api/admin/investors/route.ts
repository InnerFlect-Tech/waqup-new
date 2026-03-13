import { createSupabaseAdminClient } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/investors
 * Admin-only. Requires valid Supabase session and profile.role === 'superadmin'.
 * Returns all founding partner inquiries ordered by created_at desc.
 */
export async function GET(): Promise<NextResponse> {
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

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch (err) {
    console.error('[admin/investors] Supabase admin client init failed:', err);
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 },
    );
  }

  try {
    const { data, error } = await supabase
      .from('investor_inquiries')
      .select('id, name, email, phone, company, interest, referral_source, message, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[admin/investors] fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
    }

    return NextResponse.json({ inquiries: data ?? [] });
  } catch (err) {
    console.error('[admin/investors] unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
