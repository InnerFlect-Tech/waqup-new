import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const VALID_INTENTIONS = [
  'create',
  'practice',
  'share',
  'monetise',
  'gift',
  'research',
  'reflect',
  'curious',
] as const;

/**
 * POST /api/waitlist
 * Public — no authentication required.
 * Accepts name, email, intentions, is_beta_tester, referral_source, message.
 * Upserts on email (idempotent re-submit updates details).
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const intentions: string[] = Array.isArray(body?.intentions)
      ? body.intentions.filter((i: unknown) => typeof i === 'string' && VALID_INTENTIONS.includes(i as never))
      : [];
    const is_beta_tester = body?.is_beta_tester === true;
    const referral_source = typeof body?.referral_source === 'string' ? body.referral_source.trim() : null;
    const message = typeof body?.message === 'string' ? body.message.trim().slice(0, 1000) : null;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || !email.includes('@') || email.length < 3) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.from('waitlist_signups').upsert(
      {
        name,
        email,
        intentions,
        is_beta_tester,
        referral_source: referral_source || null,
        message: message || null,
      },
      { onConflict: 'email' },
    );

    if (error) {
      console.error('[waitlist] insert error:', error);
      return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

/**
 * GET /api/waitlist
 * Admin-only. Requires valid Supabase session and profile.role === 'superadmin'.
 * Returns all signups ordered by created_at desc.
 */
export async function GET(): Promise<NextResponse> {
  const serverClient = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await serverClient.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await serverClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let supabase;
  try {
    supabase = createSupabaseAdminClient();
  } catch (err) {
    console.error('[waitlist] Supabase admin client init failed:', err);
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 },
    );
  }

  try {
    const { data, error } = await supabase
      .from('waitlist_signups')
      .select('id, name, email, intentions, is_beta_tester, referral_source, message, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[waitlist] fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
    }

    return NextResponse.json({ signups: data ?? [] });
  } catch (err) {
    console.error('[waitlist] unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
