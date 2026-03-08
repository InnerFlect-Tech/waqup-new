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
end $$;
