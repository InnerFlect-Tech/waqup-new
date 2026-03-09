-- Seed data for local development
-- Run: supabase db reset (applies migrations + seed)
-- Dev user: dev@local.test / password123

create extension if not exists "pgcrypto";

do $$
declare
  v_user_id uuid := '11111111-1111-1111-1111-111111111111';
  v_encrypted_pw text := crypt('password123', gen_salt('bf'));
begin
  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) values (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'dev@local.test',
    v_encrypted_pw,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  )
  on conflict (id) do nothing;

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    v_user_id,
    v_user_id,
    format('{"sub": "%s", "email": "dev@local.test"}', v_user_id)::jsonb,
    'email',
    v_user_id::text,
    now(),
    now(),
    now()
  )
  on conflict (id) do nothing;

  insert into public.profiles (id, role) values (v_user_id, 'superadmin')
  on conflict (id) do update set role = 'superadmin';

  -- Seed 1000 Qs for the dev user (clear any existing balance first)
  delete from public.credit_transactions where user_id = v_user_id;
  insert into public.credit_transactions (user_id, amount, description)
  values (v_user_id, 1000, 'Welcome bonus (dev seed)');

  insert into public.content_items (
    user_id,
    type,
    title,
    description,
    script,
    duration,
    frequency,
    status,
    audio_url,
    voice_type
  ) values
    (v_user_id, 'affirmation', 'Morning confidence', 'Start each day with intention', 'I am capable and ready for today.', '2 min', 'daily', 'complete', null, 'elevenlabs'),
    (v_user_id, 'affirmation', 'Abundance mindset', 'Shift into prosperity consciousness', 'I attract abundance in all areas of my life.', '1 min', 'daily', 'complete', 'https://example.com/audio/abundance.mp3', 'elevenlabs'),
    (v_user_id, 'affirmation', 'Self-worth', 'Affirm your inherent value', 'I am worthy of love, respect, and success.', '2 min', 'twice daily', 'draft', null, null),
    (v_user_id, 'affirmation', 'Gratitude anchor', 'Ground in appreciation', 'I am grateful for this moment and all it brings.', '1 min', 'daily', 'complete', null, 'elevenlabs'),
    (v_user_id, 'meditation', 'Calm breath', 'A short breathing exercise', 'Breathe in for four counts, hold for four, breathe out for six.', '5 min', 'daily', 'draft', null, null),
    (v_user_id, 'meditation', 'Body scan', 'Progressive relaxation from head to toe', null, '15 min', 'weekly', 'complete', 'https://example.com/audio/body-scan.mp3', 'elevenlabs'),
    (v_user_id, 'meditation', 'Loving kindness', 'Metta practice for self and others', 'May I be well. May I be at peace. May all beings be free from suffering.', '10 min', 'daily', 'complete', null, null),
    (v_user_id, 'meditation', 'Morning clarity', 'Set intention for the day ahead', null, '7 min', 'daily', 'draft', null, null),
    (v_user_id, 'ritual', 'Evening wind-down', 'Transition from day to rest', null, '10 min', 'daily', 'draft', null, null),
    (v_user_id, 'ritual', 'New moon intention', 'Monthly ritual for setting intentions', 'I release what no longer serves me. I welcome new possibilities.', '20 min', 'monthly', 'complete', null, 'elevenlabs'),
    (v_user_id, 'ritual', 'Sunday reset', 'Weekly reflection and planning', null, '30 min', 'weekly', 'draft', null, null);

  -- ── Practice sessions ────────────────────────────────────────────────────────
  -- ~100 sessions over 16 weeks. Mix: affirmation(50%) meditation(30%) ritual(20%).
  -- Gives ~350 XP → practitioner level. Gaps on 2-3 random days/week.
  delete from public.practice_sessions where user_id = v_user_id;
  insert into public.practice_sessions (user_id, content_item_id, content_type, duration_seconds, played_at) values
    -- Week 16 ago
    (v_user_id, null, 'affirmation', 150, now() - interval '112 days'),
    (v_user_id, null, 'meditation',  480, now() - interval '112 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '111 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '110 days'),
    (v_user_id, null, 'meditation',  600, now() - interval '109 days'),
    (v_user_id, null, 'ritual',      900, now() - interval '108 days'),
    -- Week 15 ago
    (v_user_id, null, 'affirmation', 120, now() - interval '104 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '103 days'),
    (v_user_id, null, 'meditation',  420, now() - interval '103 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '102 days'),
    (v_user_id, null, 'ritual',      720, now() - interval '101 days'),
    (v_user_id, null, 'meditation',  540, now() - interval '100 days'),
    -- Week 14 ago
    (v_user_id, null, 'affirmation', 150, now() - interval '97 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '96 days'),
    (v_user_id, null, 'meditation',  480, now() - interval '95 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '95 days'),
    (v_user_id, null, 'ritual',     1200, now() - interval '94 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '93 days'),
    -- Week 13 ago
    (v_user_id, null, 'affirmation', 150, now() - interval '90 days'),
    (v_user_id, null, 'meditation',  600, now() - interval '89 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '88 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '88 days'),
    (v_user_id, null, 'ritual',      900, now() - interval '87 days'),
    -- Week 12 ago
    (v_user_id, null, 'affirmation', 120, now() - interval '83 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '82 days'),
    (v_user_id, null, 'meditation',  720, now() - interval '82 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '81 days'),
    (v_user_id, null, 'meditation',  480, now() - interval '80 days'),
    (v_user_id, null, 'ritual',     1080, now() - interval '79 days'),
    -- Week 11 ago
    (v_user_id, null, 'affirmation', 150, now() - interval '76 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '75 days'),
    (v_user_id, null, 'meditation',  600, now() - interval '75 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '74 days'),
    (v_user_id, null, 'ritual',      900, now() - interval '73 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '72 days'),
    (v_user_id, null, 'meditation',  540, now() - interval '72 days'),
    -- Week 10 ago
    (v_user_id, null, 'affirmation', 150, now() - interval '69 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '68 days'),
    (v_user_id, null, 'meditation',  480, now() - interval '67 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '67 days'),
    (v_user_id, null, 'ritual',     1200, now() - interval '66 days'),
    -- Week 9 ago
    (v_user_id, null, 'affirmation', 120, now() - interval '62 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '61 days'),
    (v_user_id, null, 'meditation',  600, now() - interval '61 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '60 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '59 days'),
    (v_user_id, null, 'ritual',      900, now() - interval '58 days'),
    (v_user_id, null, 'meditation',  420, now() - interval '57 days'),
    -- Week 8 ago
    (v_user_id, null, 'affirmation', 120, now() - interval '55 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '54 days'),
    (v_user_id, null, 'meditation',  720, now() - interval '54 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '53 days'),
    (v_user_id, null, 'ritual',     1080, now() - interval '52 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '51 days'),
    -- Week 7 ago
    (v_user_id, null, 'affirmation', 120, now() - interval '48 days'),
    (v_user_id, null, 'meditation',  480, now() - interval '47 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '47 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '46 days'),
    (v_user_id, null, 'ritual',      900, now() - interval '45 days'),
    (v_user_id, null, 'meditation',  600, now() - interval '44 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '43 days'),
    -- Week 6 ago
    (v_user_id, null, 'affirmation', 120, now() - interval '41 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '40 days'),
    (v_user_id, null, 'meditation',  540, now() - interval '40 days'),
    (v_user_id, null, 'ritual',     1200, now() - interval '39 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '38 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '37 days'),
    (v_user_id, null, 'meditation',  480, now() - interval '36 days'),
    -- Week 5 ago
    (v_user_id, null, 'affirmation', 150, now() - interval '34 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '33 days'),
    (v_user_id, null, 'meditation',  600, now() - interval '33 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '32 days'),
    (v_user_id, null, 'ritual',      900, now() - interval '31 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '30 days'),
    -- Week 4 ago
    (v_user_id, null, 'affirmation', 150, now() - interval '27 days'),
    (v_user_id, null, 'meditation',  720, now() - interval '26 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '26 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '25 days'),
    (v_user_id, null, 'ritual',     1080, now() - interval '24 days'),
    (v_user_id, null, 'meditation',  540, now() - interval '23 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '22 days'),
    -- Week 3 ago
    (v_user_id, null, 'affirmation', 120, now() - interval '20 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '19 days'),
    (v_user_id, null, 'meditation',  600, now() - interval '19 days'),
    (v_user_id, null, 'ritual',      900, now() - interval '18 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '17 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '16 days'),
    (v_user_id, null, 'meditation',  480, now() - interval '15 days'),
    -- Week 2 ago
    (v_user_id, null, 'affirmation', 150, now() - interval '13 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '12 days'),
    (v_user_id, null, 'meditation',  720, now() - interval '12 days'),
    (v_user_id, null, 'ritual',     1200, now() - interval '11 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '10 days'),
    (v_user_id, null, 'meditation',  480, now() - interval '10 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '9 days'),
    -- Last week + this week (dense streak)
    (v_user_id, null, 'affirmation', 150, now() - interval '7 days'),
    (v_user_id, null, 'meditation',  600, now() - interval '7 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '6 days'),
    (v_user_id, null, 'ritual',      900, now() - interval '6 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '5 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '4 days'),
    (v_user_id, null, 'meditation',  540, now() - interval '4 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '3 days'),
    (v_user_id, null, 'ritual',     1080, now() - interval '3 days'),
    (v_user_id, null, 'affirmation', 120, now() - interval '2 days'),
    (v_user_id, null, 'meditation',  480, now() - interval '2 days'),
    (v_user_id, null, 'affirmation', 150, now() - interval '1 day'),
    (v_user_id, null, 'affirmation', 120, now() - interval '1 day'),
    (v_user_id, null, 'meditation',  600, now());

  -- ── Reflection entries ───────────────────────────────────────────────────────
  delete from public.reflection_entries where user_id = v_user_id;
  insert into public.reflection_entries (user_id, energy_level, notes, messages, ai_summary, created_at, updated_at) values
    (
      v_user_id, 4,
      'Felt really focused during the body scan today. Noticed how quickly I drop into a calm state now compared to a month ago.',
      '[{"role":"user","content":"I just finished my practice."},{"role":"assistant","content":"Wonderful! How did today''s body scan feel compared to before?"},{"role":"user","content":"Much easier to let go. My mind barely wandered."}]'::jsonb,
      'User is noticing measurable progress in their ability to enter calm states quickly. Attention control is improving.',
      now() - interval '2 days',
      now() - interval '2 days'
    ),
    (
      v_user_id, 5,
      'Morning affirmations hit differently today. Said them out loud instead of in my head and felt a real shift.',
      '[{"role":"user","content":"I just finished my practice."},{"role":"assistant","content":"Something feels different today — what happened?"},{"role":"user","content":"I said them out loud. It felt more real."}]'::jsonb,
      'User experimented with vocalising affirmations and experienced a stronger emotional response. Key insight: embodied practice.',
      now() - interval '5 days',
      now() - interval '5 days'
    ),
    (
      v_user_id, 3,
      'Distracted today. Work stress crept in during the ritual. Still finished it though.',
      '[{"role":"user","content":"I just finished my practice."},{"role":"assistant","content":"How are you feeling after it?"},{"role":"user","content":"Okay. It was hard to focus but I showed up anyway."}]'::jsonb,
      'User navigated a difficult practice session with persistent distractions but completed the ritual. Showing up despite resistance is the practice.',
      now() - interval '10 days',
      now() - interval '10 days'
    ),
    (
      v_user_id, 4,
      'Two weeks in and the morning routine feels automatic. No motivation needed — just happens.',
      '[{"role":"user","content":"I just finished my practice."},{"role":"assistant","content":"Two weeks of consistency. What does that feel like?"},{"role":"user","content":"Natural. Like brushing teeth."}]'::jsonb,
      'User has reached a habituation threshold — the practice now feels automatic rather than effortful. Identity-level integration is occurring.',
      now() - interval '18 days',
      now() - interval '18 days'
    ),
    (
      v_user_id, 2,
      'Rough week. Only managed 2 sessions. But I didn''t quit, which feels important.',
      '[{"role":"user","content":"I just finished my practice."},{"role":"assistant","content":"You showed up during a hard week. That''s everything. What kept you going?"},{"role":"user","content":"Didn''t want to break the chain completely."}]'::jsonb,
      'User maintained practice through a difficult period, showing resilience. The motivation to protect consistency indicates deep commitment.',
      now() - interval '30 days',
      now() - interval '30 days'
    );

end $$;
