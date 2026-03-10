-- Migration: orb_tables
-- Creates tables for the Speak/Orb AI feature: orb add-on config, user orb settings,
-- and user_profiles (Orb personalization context). Speak page requires these.
-- credit_transactions and get_credit_balance already exist from prior migrations.

-- ─── orb_config: admin-managed global add-on toggles ────────────────────────
create table if not exists public.orb_config (
  id                uuid primary key default gen_random_uuid(),
  addon_key         text not null unique,
  enabled           boolean not null default true,
  user_configurable boolean not null default false,
  label             text not null,
  description       text not null default '',
  cost_qs           integer not null default 1,
  updated_at        timestamptz not null default now()
);

insert into public.orb_config (addon_key, enabled, user_configurable, label, description, cost_qs)
values
  ('base_llm',         true,  false, 'Orb responds',                   'Core LLM response — always active', 1),
  ('user_context',     true,  true,  'Access your personal journey',   'Orb reads your past content and preferences to personalise its response', 1),
  ('collective_wisdom',true,  true,  'Draw from the collective',       'Orb accesses patterns across the waQup community for deeper guidance', 1)
on conflict (addon_key) do nothing;

alter table public.orb_config enable row level security;

drop policy if exists "Public read orb_config" on public.orb_config;
create policy "Public read orb_config"
  on public.orb_config for select
  using (true);

-- ─── user_orb_settings: per-user add-on preferences ───────────────────────
create table if not exists public.user_orb_settings (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  addon_key   text not null,
  enabled     boolean not null default true,
  updated_at  timestamptz not null default now(),
  unique (user_id, addon_key)
);

create index if not exists user_orb_settings_user_idx
  on public.user_orb_settings (user_id);

alter table public.user_orb_settings enable row level security;

drop policy if exists "Users manage own orb settings" on public.user_orb_settings;
create policy "Users manage own orb settings"
  on public.user_orb_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── user_profiles: Orb personalization context (distinct from profiles) ───
create table if not exists public.user_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null unique references auth.users(id) on delete cascade,
  display_name    text,
  goals           text[],
  focus_areas     text[],
  preferred_voice text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_updated_at on public.user_profiles;
create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;

drop policy if exists "Users view own profile" on public.user_profiles;
create policy "Users view own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Users upsert own profile" on public.user_profiles;
create policy "Users upsert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own profile" on public.user_profiles;
create policy "Users update own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id);
