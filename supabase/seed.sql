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
    status
  ) values
    (v_user_id, 'affirmation', 'Morning confidence', 'Start each day with intention', 'I am capable and ready for today.', '2 min', 'daily', 'complete'),
    (v_user_id, 'meditation', 'Calm breath', 'A short breathing exercise', null, '5 min', 'daily', 'draft'),
    (v_user_id, 'ritual', 'Evening wind-down', 'Transition from day to rest', null, '10 min', 'daily', 'draft');
end $$;
