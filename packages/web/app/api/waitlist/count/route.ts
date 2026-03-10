import { NextResponse } from 'next/server';
import { createSupabaseAdminClientOrNull } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/waitlist/count
 * Public — no auth. Returns waitlist signup count for social proof on landing.
 * Returns 0 when Supabase env vars are missing (CI E2E).
 */
export async function GET(): Promise<NextResponse> {
  try {
    const supabase = createSupabaseAdminClientOrNull();
    if (!supabase) {
      return NextResponse.json({ count: 0 });
    }
    const { count, error } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('[waitlist/count]', error);
      return NextResponse.json({ count: null, error: 'Service temporarily unavailable' }, { status: 503 });
    }

    return NextResponse.json({ count: count ?? 0 });
  } catch (err) {
    console.error('[waitlist/count] unexpected error:', err);
    return NextResponse.json({ count: null, error: 'Service temporarily unavailable' }, { status: 503 });
  }
}
