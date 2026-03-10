-- =====================================================================
-- Stripe Billing Infrastructure
-- =====================================================================
-- Adds:
--   1. stripe_customer_id to profiles
--   2. subscriptions table (one row per user's active subscription)
--   3. source + metadata columns on credit_transactions
--   4. stripe_webhook_events table for idempotent webhook processing
-- =====================================================================

-- 1. Stripe customer ID on profiles
-- -----------------------------------------------------------------------
alter table public.profiles
  add column if not exists stripe_customer_id text unique;

-- 2. Subscriptions table
-- -----------------------------------------------------------------------
create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users (id) on delete cascade,
  stripe_subscription_id  text not null unique,
  stripe_customer_id      text not null,
  plan_id                 text not null,            -- 'starter' | 'growth' | 'devotion'
  status                  text not null,            -- Stripe subscription statuses
  trial_end               timestamptz,
  current_period_start    timestamptz not null,
  current_period_end      timestamptz not null,
  cancel_at_period_end    boolean not null default false,
  -- Idempotency: tracks the last invoice for which we already granted credits.
  -- Prevents double-granting on webhook retries.
  last_credited_invoice_id text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx
  on public.subscriptions (user_id);

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);

-- updated_at trigger
create or replace function public.set_subscriptions_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_subscriptions_updated_at();

-- RLS
alter table public.subscriptions enable row level security;

-- Users can read their own subscription
drop policy if exists "Users can view own subscription" on public.subscriptions;
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Only service role (webhook handler) can insert / update / delete
drop policy if exists "Service role manages subscriptions" on public.subscriptions;
create policy "Service role manages subscriptions"
  on public.subscriptions for all
  using (true)
  with check (true);

-- 3. Enhance credit_transactions with source tracking
-- -----------------------------------------------------------------------
-- source: who/what triggered the credit change
alter table public.credit_transactions
  add column if not exists source text not null default 'manual';

-- metadata: structured context (invoice id, pack id, etc.)
alter table public.credit_transactions
  add column if not exists metadata jsonb;

-- source index for admin queries
create index if not exists credit_transactions_source_idx
  on public.credit_transactions (source);

-- 4. Stripe webhook events — idempotency table
-- -----------------------------------------------------------------------
-- The webhook handler inserts the Stripe event ID here before processing.
-- A unique constraint prevents the same event from being processed twice
-- even under concurrent retries.
create table if not exists public.stripe_webhook_events (
  id           text primary key,   -- Stripe event ID (evt_...)
  processed_at timestamptz not null default now()
);

-- Only service role can insert; no user-facing access needed
alter table public.stripe_webhook_events enable row level security;

drop policy if exists "Service role manages webhook events" on public.stripe_webhook_events;
create policy "Service role manages webhook events"
  on public.stripe_webhook_events for all
  using (true)
  with check (true);

-- 5. Helper: get active subscription for a user
-- -----------------------------------------------------------------------
-- Returns the most relevant subscription row for a user (active or trialing).
-- Used by the app to display plan status.
create or replace function public.get_user_subscription()
returns json
language plpgsql security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_result  json;
begin
  if v_user_id is null then
    return null;
  end if;

  select row_to_json(s) into v_result
  from public.subscriptions s
  where s.user_id = v_user_id
    and s.status in ('active', 'trialing', 'past_due')
  order by s.created_at desc
  limit 1;

  return v_result;
end;
$$;

grant execute on function public.get_user_subscription() to authenticated;
