import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const VALID_INTERESTS = [
  'seed',
  'production',
  'marketing',
  'promotion',
  'influencer',
  'content-creator',
  'other',
] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const interest = typeof body?.interest === 'string' ? body.interest.trim() : null;
    const phone = typeof body?.phone === 'string' ? body.phone.trim() : null;
    const company = typeof body?.company === 'string' ? body.company.trim() : null;
    const referral_source = typeof body?.referral_source === 'string' ? body.referral_source.trim() : null;
    const message = typeof body?.message === 'string' ? body.message.trim().slice(0, 2000) : null;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    if (email.length < 3 || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email' },
        { status: 400 }
      );
    }

    if (interest && !VALID_INTERESTS.includes(interest as (typeof VALID_INTERESTS)[number])) {
      return NextResponse.json(
        { error: 'Invalid interest selection' },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('investor_inquiries').insert({
      name,
      email,
      interest: interest || null,
      phone: phone || null,
      company: company || null,
      referral_source: referral_source || null,
      message: message || null,
    });

    if (error) {
      console.error('Investor inquiry insert error:', error);
      return NextResponse.json(
        { error: 'Failed to submit. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Bad request' },
      { status: 400 }
    );
  }
}
