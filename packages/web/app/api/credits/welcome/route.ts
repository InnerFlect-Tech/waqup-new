import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createSupabaseAdminClient } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

const WELCOME_CREDITS = 20;
const WELCOME_DESCRIPTION = 'welcome_bonus';

/**
 * POST /api/credits/welcome
 *
 * Grants 20 free Qs to a new user on their first sign-up.
 * Idempotent — checks if a welcome_bonus transaction already exists
 * before inserting, so calling this multiple times is safe.
 *
 * Called from the onboarding flow on first page load after auth.
 */
export async function POST(_req: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createSupabaseAdminClient();

    // Idempotency check — only grant once per account
    const { data: existing } = await admin
      .from('credit_transactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('description', WELCOME_DESCRIPTION)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ granted: false, reason: 'already_granted' });
    }

    const { error } = await admin.rpc('add_credits', {
      p_user_id: user.id,
      p_amount: WELCOME_CREDITS,
      p_description: WELCOME_DESCRIPTION,
    });

    if (error) {
      console.error('[credits/welcome] add_credits failed:', error);
      return NextResponse.json({ error: 'Failed to grant credits' }, { status: 500 });
    }

    return NextResponse.json({ granted: true, amount: WELCOME_CREDITS });
  } catch (err) {
    console.error('[credits/welcome] unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
