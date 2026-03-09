import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/** Example content items for seeding the library */
const EXAMPLE_ITEMS = [
  { type: 'affirmation' as const, title: 'Morning confidence', description: 'Start each day with intention', script: 'I am capable and ready for today.', duration: '2 min', frequency: 'daily', status: 'complete' as const },
  { type: 'affirmation' as const, title: 'Abundance mindset', description: 'Shift into prosperity consciousness', script: 'I attract abundance in all areas of my life.', duration: '1 min', frequency: 'daily', status: 'complete' as const },
  { type: 'affirmation' as const, title: 'Self-worth', description: 'Affirm your inherent value', script: 'I am worthy of love, respect, and success.', duration: '2 min', frequency: 'twice daily', status: 'draft' as const },
  { type: 'affirmation' as const, title: 'Gratitude anchor', description: 'Ground in appreciation', script: 'I am grateful for this moment and all it brings.', duration: '1 min', frequency: 'daily', status: 'complete' as const },
  { type: 'meditation' as const, title: 'Calm breath', description: 'A short breathing exercise', script: 'Breathe in for four counts, hold for four, breathe out for six.', duration: '5 min', frequency: 'daily', status: 'draft' as const },
  { type: 'meditation' as const, title: 'Body scan', description: 'Progressive relaxation from head to toe', script: null, duration: '15 min', frequency: 'weekly', status: 'complete' as const },
  { type: 'meditation' as const, title: 'Loving kindness', description: 'Metta practice for self and others', script: 'May I be well. May I be at peace. May all beings be free from suffering.', duration: '10 min', frequency: 'daily', status: 'complete' as const },
  { type: 'meditation' as const, title: 'Morning clarity', description: 'Set intention for the day ahead', script: null, duration: '7 min', frequency: 'daily', status: 'draft' as const },
  { type: 'ritual' as const, title: 'Evening wind-down', description: 'Transition from day to rest', script: null, duration: '10 min', frequency: 'daily', status: 'draft' as const },
  { type: 'ritual' as const, title: 'New moon intention', description: 'Monthly ritual for setting intentions', script: 'I release what no longer serves me. I welcome new possibilities.', duration: '20 min', frequency: 'monthly', status: 'complete' as const },
  { type: 'ritual' as const, title: 'Sunday reset', description: 'Weekly reflection and planning', script: null, duration: '30 min', frequency: 'weekly', status: 'draft' as const },
];

export async function POST() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 404 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Sign in with Supabase (not Test login) to seed your library' },
        { status: 401 }
      );
    }

    const rows = EXAMPLE_ITEMS.map((item) => ({
      user_id: user.id,
      type: item.type,
      title: item.title,
      description: item.description,
      script: item.script,
      duration: item.duration,
      frequency: item.frequency,
      status: item.status,
    }));

    const { error } = await supabase.from('content_items').insert(rows);

    if (error) {
      console.error('Seed insert error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to seed' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, count: rows.length });
  } catch {
    return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
  }
}
