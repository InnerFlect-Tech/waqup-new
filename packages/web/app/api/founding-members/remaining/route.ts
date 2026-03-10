import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const FOUNDING_MEMBER_CAP = 500;

/**
 * GET /api/founding-members/remaining
 * Public — no auth. Returns founding member spots remaining for join page and modal.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = createSupabaseAdminClient();
    const { count, error } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true })
      .eq('is_founding_member', true);

    if (error) {
      console.error('[founding-members/remaining]', error);
      return NextResponse.json(
        { remaining: null, error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const claimed = count ?? 0;
    const remaining = Math.max(0, FOUNDING_MEMBER_CAP - claimed);

    return NextResponse.json({ remaining });
  } catch (err) {
    console.error('[founding-members/remaining] unexpected error:', err);
    return NextResponse.json(
      { remaining: null, error: 'Service temporarily unavailable' },
      { status: 503 }
    );
  }
}
