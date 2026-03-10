import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createSupabaseAdminClient } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

/** Example content items for seeding the library */
const EXAMPLE_ITEMS = [
  { type: 'affirmation' as const, title: 'Morning confidence', description: 'Start each day with intention', script: 'I am capable and ready for today.', duration: '2 min', frequency: 'daily', status: 'complete' as const },
  { type: 'affirmation' as const, title: 'Abundance mindset', description: 'Shift into prosperity consciousness', script: 'I attract abundance in all areas of my life.', duration: '1 min', frequency: 'daily', status: 'complete' as const },
  { type: 'affirmation' as const, title: 'Self-worth', description: 'Affirm your inherent value', script: 'I am worthy of love, respect, and success.', duration: '2 min', frequency: 'twice daily', status: 'draft' as const },
  { type: 'affirmation' as const, title: 'Gratitude anchor', description: 'Ground in appreciation', script: 'I am grateful for this moment and all it brings.', duration: '1 min', frequency: 'daily', status: 'complete' as const },
  { type: 'affirmation' as const, title: 'Inner calm', description: 'Steady presence in any storm', script: 'I choose peace over reactivity. I respond, not react.', duration: '2 min', frequency: 'daily', status: 'complete' as const },
  { type: 'meditation' as const, title: 'Calm breath', description: 'A short breathing exercise', script: 'Breathe in for four counts, hold for four, breathe out for six.', duration: '5 min', frequency: 'daily', status: 'draft' as const },
  { type: 'meditation' as const, title: 'Body scan', description: 'Progressive relaxation from head to toe', script: null, duration: '15 min', frequency: 'weekly', status: 'complete' as const },
  { type: 'meditation' as const, title: 'Loving kindness', description: 'Metta practice for self and others', script: 'May I be well. May I be at peace. May all beings be free from suffering.', duration: '10 min', frequency: 'daily', status: 'complete' as const },
  { type: 'meditation' as const, title: 'Morning clarity', description: 'Set intention for the day ahead', script: null, duration: '7 min', frequency: 'daily', status: 'draft' as const },
  { type: 'meditation' as const, title: 'Release tension', description: 'Let go of physical and mental holding', script: null, duration: '8 min', frequency: 'daily', status: 'complete' as const },
  { type: 'ritual' as const, title: 'Evening wind-down', description: 'Transition from day to rest', script: null, duration: '10 min', frequency: 'daily', status: 'draft' as const },
  { type: 'ritual' as const, title: 'New moon intention', description: 'Monthly ritual for setting intentions', script: 'I release what no longer serves me. I welcome new possibilities.', duration: '20 min', frequency: 'monthly', status: 'complete' as const },
  { type: 'ritual' as const, title: 'Sunday reset', description: 'Weekly reflection and planning', script: null, duration: '30 min', frequency: 'weekly', status: 'draft' as const },
  { type: 'ritual' as const, title: 'Morning anchor', description: 'Ground yourself before the day begins', script: 'I begin with intention. I move with purpose.', duration: '12 min', frequency: 'daily', status: 'complete' as const },
];

const PRACTICE_SESSIONS = [
  { content_type: 'affirmation' as const, duration_seconds: 150, days_ago: 7 },
  { content_type: 'meditation' as const, duration_seconds: 600, days_ago: 7 },
  { content_type: 'affirmation' as const, duration_seconds: 120, days_ago: 6 },
  { content_type: 'ritual' as const, duration_seconds: 900, days_ago: 6 },
  { content_type: 'affirmation' as const, duration_seconds: 150, days_ago: 5 },
  { content_type: 'affirmation' as const, duration_seconds: 120, days_ago: 4 },
  { content_type: 'meditation' as const, duration_seconds: 540, days_ago: 4 },
  { content_type: 'affirmation' as const, duration_seconds: 150, days_ago: 3 },
  { content_type: 'ritual' as const, duration_seconds: 1080, days_ago: 3 },
  { content_type: 'affirmation' as const, duration_seconds: 120, days_ago: 2 },
  { content_type: 'meditation' as const, duration_seconds: 480, days_ago: 2 },
  { content_type: 'affirmation' as const, duration_seconds: 150, days_ago: 1 },
  { content_type: 'affirmation' as const, duration_seconds: 120, days_ago: 1 },
  { content_type: 'meditation' as const, duration_seconds: 600, days_ago: 0 },
];

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 404 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const targetEmail = searchParams.get('email');

    if (targetEmail) {
      // Seed for another user by email — requires superadmin
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: 'Sign in required' }, { status: 401 });
      }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role !== 'superadmin') {
        return NextResponse.json({ error: 'Superadmin only — use ?email= to seed for another user' }, { status: 403 });
      }

      const admin = createSupabaseAdminClient();
      const { data: { users } } = await admin.auth.admin.listUsers({ perPage: 1000 });
      const targetUser = users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());
      if (!targetUser) {
        return NextResponse.json(
          { error: `User ${targetEmail} not found. Sign up first, then run seed.` },
          { status: 404 }
        );
      }

      const userId = targetUser.id;

      // Credits
      await admin.from('credit_transactions').delete().eq('user_id', userId);
      await admin.from('credit_transactions').insert({
        user_id: userId,
        amount: 500,
        description: `Example seed for ${targetEmail}`,
      });

      // Content
      await admin.from('content_items').delete().eq('user_id', userId);
      const contentRows = EXAMPLE_ITEMS.map((item) => ({
        user_id: userId,
        type: item.type,
        title: item.title,
        description: item.description,
        script: item.script,
        duration: item.duration,
        frequency: item.frequency,
        status: item.status,
      }));
      await admin.from('content_items').insert(contentRows);

      // Practice sessions
      await admin.from('practice_sessions').delete().eq('user_id', userId);
      const now = new Date();
      const sessionRows = PRACTICE_SESSIONS.map((s) => ({
        user_id: userId,
        content_item_id: null,
        content_type: s.content_type,
        duration_seconds: s.duration_seconds,
        played_at: new Date(now.getTime() - s.days_ago * 24 * 60 * 60 * 1000).toISOString(),
      }));
      await admin.from('practice_sessions').insert(sessionRows);

      // Reflection entries
      await admin.from('reflection_entries').delete().eq('user_id', userId);
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
      await admin.from('reflection_entries').insert([
        { user_id: userId, energy_level: 4, notes: 'Felt really focused during the body scan today.', messages: [], ai_summary: 'Progress in calm states.', created_at: twoDaysAgo, updated_at: twoDaysAgo },
        { user_id: userId, energy_level: 5, notes: 'Morning affirmations hit differently today. Said them out loud.', messages: [], ai_summary: 'Vocalising affirmations had stronger impact.', created_at: fiveDaysAgo, updated_at: fiveDaysAgo },
        { user_id: userId, energy_level: 4, notes: 'Morning routine feels automatic now. No motivation needed.', messages: [], ai_summary: 'Practice feels automatic — habituation reached.', created_at: fourteenDaysAgo, updated_at: fourteenDaysAgo },
      ]);

      return NextResponse.json({
        ok: true,
        email: targetEmail,
        content: contentRows.length,
        credits: 500,
        practiceSessions: sessionRows.length,
        reflections: 3,
      });
    }

    // Default: seed for the logged-in user (content only)
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
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
  }
}
