-- Migration: fix_schema_gaps
-- Fixes two issues found during schema audit:
-- 1. credit_transactions missing reference_id column (referenced in record_share_and_award_credit)
-- 2. profiles table missing RLS policies (any anon user could read all profiles)

-- ─── 1. Add reference_id to credit_transactions ──────────────────────────────
-- The record_share_and_award_credit function (migration 000005) inserts with
-- reference_id to trace which content_item triggered the credit award.

alter table public.credit_transactions
  add column if not exists reference_id text;

-- ─── 2. Enable RLS and add policies on profiles ──────────────────────────────
-- profiles was created in migration 000002 without RLS, allowing anonymous reads.

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Service role (API routes) needs to insert profiles for new users.
drop policy if exists "Service role can insert profiles" on public.profiles;
create policy "Service role can insert profiles"
  on public.profiles for insert
  with check (true);
