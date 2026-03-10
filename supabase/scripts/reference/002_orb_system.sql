-- Migration: 002_orb_system
-- Creates tables for the Orb AI engine: orb add-on config, user orb settings,
-- user profiles (personalization), and credit transactions (Qs economy).
-- Apply via: Supabase dashboard → SQL Editor, or `supabase db push`
-- NOTE: Canonical migrations live in supabase/migrations/. This file is reference only.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- orb_config: admin-managed global add-on toggles
-- ─────────────────────────────────────────────────────────────
create table if not exists public.orb_config (
  id          uuid primary key default gen_random_uuid(),
  addon_key   text not null unique,           -- 'base_llm' | 'user_context' | 'collective_wisdom'
  enabled     boolean not null default true,
  user_configurable boolean not null default false,
  label       text not null,                 -- display label in UI
  description text not null default '',
  cost_qs     integer not null default 1,    -- Q cost per use
  updated_at  timestamptz not null default now()
);

-- Seed default add-ons
insert into public.orb_config (addon_key, enabled, user_configurable, label, description, cost_qs)
values
  ('base_llm',         true,  false, 'Orb responds',                   'Core LLM response — always active', 1),
  ('user_context',     true,  true,  'Access your personal journey',   'Orb reads your past content and preferences to personalise its response', 1),
  ('collective_wisdom',true,  true,  'Draw from the collective',       'Orb accesses patterns across the waQup community for deeper guidance', 1)
on conflict (addon_key) do nothing;

-- Admins can read/write; everyone else read-only (publicly readable config)
alter table public.orb_config enable row level security;

create policy "Public read orb_config"
  on public.orb_config for select
  using (true);

-- ─────────────────────────────────────────────────────────────
-- user_orb_settings: per-user add-on preferences
-- ─────────────────────────────────────────────────────────────
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

create policy "Users manage own orb settings"
  on public.user_orb_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- user_profiles: personalization data for Orb context
-- ─────────────────────────────────────────────────────────────
create table if not exists public.user_profiles (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null unique references auth.users(id) on delete cascade,

  display_name    text,
  goals           text[],          -- e.g. ['confidence', 'sleep', 'abundance']
  focus_areas     text[],
  preferred_voice text,            -- 'own_voice' | 'ai_voice'
  notes           text,            -- freeform personalization notes from onboarding

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

create policy "Users view own profile"
  on public.user_profiles for select
  using (auth.uid() = user_id);

create policy "Users upsert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users update own profile"
  on public.user_profiles for update
  using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- credit_transactions: Q economy ledger
-- ─────────────────────────────────────────────────────────────
create table if not exists public.credit_transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,

  amount      integer not null,             -- positive = credit, negative = debit
  reason      text not null,                -- e.g. 'orb_base_llm', 'orb_user_context', 'content_creation'
  metadata    jsonb,                        -- arbitrary context (content_id, addon_key, etc.)

  created_at  timestamptz not null default now()
);

create index if not exists credit_transactions_user_idx
  on public.credit_transactions (user_id, created_at desc);

drop trigger if exists credit_transactions_updated_at on public.credit_transactions;

alter table public.credit_transactions enable row level security;

create policy "Users view own transactions"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

create policy "Users insert own transactions"
  on public.credit_transactions for insert
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- Helper: get current credit balance for a user
-- ─────────────────────────────────────────────────────────────
create or replace function public.get_credit_balance(p_user_id uuid)
returns integer language sql stable security definer as $$
  select coalesce(sum(amount), 0)::integer
  from public.credit_transactions
  where user_id = p_user_id;
$$;
