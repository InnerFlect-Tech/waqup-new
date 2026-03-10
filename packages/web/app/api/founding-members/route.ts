import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

const FOUNDING_MEMBER_CAP = 500;

/**
 * POST /api/founding-members
 * Public — no auth. Claim a founding member spot (join page form).
 * Upserts into waitlist_signups with is_founding_member=true.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || !email.includes('@') || email.length < 3) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();

    // Check remaining before claiming
    const { count } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true })
      .eq('is_founding_member', true);

    const claimed = count ?? 0;
    if (claimed >= FOUNDING_MEMBER_CAP) {
      return NextResponse.json(
        { error: 'All founding member spots have been claimed.' },
        { status: 409 }
      );
    }

    const { error } = await supabase
      .from('waitlist_signups')
      .upsert(
        { name, email, is_founding_member: true },
        { onConflict: 'email', ignoreDuplicates: false }
      );

    if (error) {
      console.error('[founding-members] insert error:', error);
      return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
