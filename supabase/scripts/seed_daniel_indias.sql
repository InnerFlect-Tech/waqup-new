-- =============================================================================
-- Seed examples for daniel.indias@gmail.com
-- =============================================================================
-- Run in Supabase Dashboard → SQL Editor.
-- The account must already exist (signed up via the app).
-- Seeds: content_items, credit_transactions, practice_sessions, reflection_entries,
-- marketplace_items (so example cards appear in /marketplace).
-- =============================================================================

do $$
declare
  v_user_id uuid;
begin
  select id into v_user_id from auth.users where email = 'daniel.indias@gmail.com';

  if v_user_id is null then
    raise exception 'User daniel.indias@gmail.com not found in auth.users. Sign up first, then run this script.';
  end if;

  -- ── Credits: 500 Qs ─────────────────────────────────────────────────────────
  delete from public.credit_transactions where user_id = v_user_id;
  insert into public.credit_transactions (user_id, amount, description)
  values (v_user_id, 500, 'Example seed for daniel.indias@gmail.com');

  -- ── Content items: affirmations, meditations, rituals ─────────────────────────
  delete from public.content_items where user_id = v_user_id;
  insert into public.content_items (
    user_id, type, title, description, script, duration, frequency, status, audio_url, voice_type
  ) values
    (v_user_id, 'affirmation', 'Morning confidence', 'Start each day with intention', 'I am capable and ready for today.', '2 min', 'daily', 'complete', null, 'elevenlabs'),
    (v_user_id, 'affirmation', 'Abundance mindset', 'Shift into prosperity consciousness', 'I attract abundance in all areas of my life.', '1 min', 'daily', 'complete', null, 'elevenlabs'),
    (v_user_id, 'affirmation', 'Self-worth', 'Affirm your inherent value', 'I am worthy of love, respect, and success.', '2 min', 'twice daily', 'draft', null, null),
    (v_user_id, 'affirmation', 'Gratitude anchor', 'Ground in appreciation', 'I am grateful for this moment and all it brings.', '1 min', 'daily', 'complete', null, 'elevenlabs'),
    (v_user_id, 'affirmation', 'Inner calm', 'Steady presence in any storm', 'I choose peace over reactivity. I respond, not react.', '2 min', 'daily', 'complete', null, 'elevenlabs'),
    (v_user_id, 'meditation', 'Calm breath', 'A short breathing exercise', 'Breathe in for four counts, hold for four, breathe out for six.', '5 min', 'daily', 'draft', null, null),
    (v_user_id, 'meditation', 'Body scan', 'Progressive relaxation from head to toe', null, '15 min', 'weekly', 'complete', null, 'elevenlabs'),
    (v_user_id, 'meditation', 'Loving kindness', 'Metta practice for self and others', 'May I be well. May I be at peace. May all beings be free from suffering.', '10 min', 'daily', 'complete', null, 'elevenlabs'),
    (v_user_id, 'meditation', 'Morning clarity', 'Set intention for the day ahead', null, '7 min', 'daily', 'draft', null, null),
    (v_user_id, 'meditation', 'Release tension', 'Let go of physical and mental holding', null, '8 min', 'daily', 'complete', null, 'elevenlabs'),
    (v_user_id, 'ritual', 'Evening wind-down', 'Transition from day to rest', null, '10 min', 'daily', 'draft', null, null),
    (v_user_id, 'ritual', 'New moon intention', 'Monthly ritual for setting intentions', 'I release what no longer serves me. I welcome new possibilities.', '20 min', 'monthly', 'complete', null, 'elevenlabs'),
    (v_user_id, 'ritual', 'Sunday reset', 'Weekly reflection and planning', null, '30 min', 'weekly', 'draft', null, null),
    (v_user_id, 'ritual', 'Morning anchor', 'Ground yourself before the day begins', 'I begin with intention. I move with purpose.', '12 min', 'daily', 'complete', null, 'elevenlabs');

  -- ── Practice sessions: ~20 sessions for streak and Progress page ─────────────
  delete from public.practice_sessions where user_id = v_user_id;
  insert into public.practice_sessions (user_id, content_item_id, content_type, duration_seconds, played_at) values
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

  -- ── Reflection entries: for Progress page insights ───────────────────────────
  delete from public.reflection_entries where user_id = v_user_id;
  insert into public.reflection_entries (user_id, energy_level, notes, messages, ai_summary, created_at, updated_at) values
    (
      v_user_id, 4,
      'Felt really focused during the body scan today. Noticed how quickly I drop into a calm state now.',
      '[{"role":"user","content":"I just finished my practice."},{"role":"assistant","content":"Wonderful! How did today''s body scan feel?"},{"role":"user","content":"Much easier to let go. My mind barely wandered."}]'::jsonb,
      'User is noticing measurable progress in their ability to enter calm states quickly.',
      now() - interval '2 days',
      now() - interval '2 days'
    ),
    (
      v_user_id, 5,
      'Morning affirmations hit differently today. Said them out loud and felt a real shift.',
      '[{"role":"user","content":"I just finished my practice."},{"role":"assistant","content":"Something feels different today — what happened?"},{"role":"user","content":"I said them out loud. It felt more real."}]'::jsonb,
      'User experimented with vocalising affirmations and experienced a stronger emotional response.',
      now() - interval '5 days',
      now() - interval '5 days'
    ),
    (
      v_user_id, 4,
      'Two weeks in and the morning routine feels automatic. No motivation needed — just happens.',
      '[{"role":"user","content":"I just finished my practice."},{"role":"assistant","content":"Two weeks of consistency. What does that feel like?"},{"role":"user","content":"Natural. Like brushing teeth."}]'::jsonb,
      'User has reached a habituation threshold — the practice now feels automatic rather than effortful.',
      now() - interval '14 days',
      now() - interval '14 days'
    );

  -- ── Marketplace: publish complete content items so they appear in /marketplace ─
  -- (marketplace_items are cascade-deleted when content_items are deleted above)
  insert into public.marketplace_items (content_item_id, creator_id, is_listed, is_unlisted, is_elevated, play_count, share_count)
  select ci.id, v_user_id, true, false,
    -- First 2 items get elevated badge (Curated by waQup)
    row_number() over (order by ci.created_at) <= 2,
    -- Vary play/share counts for testing trending/top sorts (12–340 plays, 2–48 shares)
    (floor(random() * 330) + 12)::integer,
    (floor(random() * 46) + 2)::integer
  from public.content_items ci
  where ci.user_id = v_user_id and ci.status = 'complete'
  on conflict (content_item_id) do update set
    is_listed = true,
    is_unlisted = false,
    play_count = excluded.play_count,
    share_count = excluded.share_count;

  raise notice 'Seeded daniel.indias@gmail.com: 14 content items, 500 Qs, 14 practice sessions, 3 reflection entries, 10 marketplace listings.';
end $$;
