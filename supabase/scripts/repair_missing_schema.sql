-- =============================================================================
-- waQup Database Repair Script
-- =============================================================================
-- Apply this in Supabase SQL Editor to add missing tables, columns, and functions
-- that failed verification. Run verify_database.sql again after to confirm.
--
-- Based on: 20260309000001, 20260309000004, 20260310000003
-- =============================================================================

-- ─── 1. atomic_credit_deduct: deduct_credits() + oracle_sessions ───────────────

create or replace function public.deduct_credits(
  p_user_id    uuid,
  p_amount     integer,
  p_description text default ''
)
returns void
language plpgsql
security definer
as $$
declare
  v_balance integer;
begin
  if p_user_id is distinct from auth.uid() then
    raise exception 'unauthorized'
      using hint = 'p_user_id must match the calling user',
            errcode = 'P0001';
  end if;

  select coalesce(sum(amount), 0)::integer
    into v_balance
    from public.credit_transactions
   where user_id = p_user_id
  for update;

  if v_balance < p_amount then
    raise exception 'insufficient_credits'
      using hint = 'User does not have enough Qs',
            errcode = 'P0002';
  end if;

  insert into public.credit_transactions (user_id, amount, description)
  values (p_user_id, -p_amount, p_description);
end;
$$;

grant execute on function public.deduct_credits(uuid, integer, text) to authenticated;

-- oracle_sessions table
create table if not exists public.oracle_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  replies_total integer not null check (replies_total > 0),
  replies_used  integer not null default 0,
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null default now() + interval '2 hours'
);

create index if not exists oracle_sessions_user_active_idx
  on public.oracle_sessions (user_id, expires_at)
  where replies_used < replies_total;

alter table public.oracle_sessions enable row level security;

drop policy if exists "Users can view own oracle sessions" on public.oracle_sessions;
create policy "Users can view own oracle sessions"
  on public.oracle_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own oracle sessions" on public.oracle_sessions;
create policy "Users can create own oracle sessions"
  on public.oracle_sessions for insert
  with check (auth.uid() = user_id);

-- consume_oracle_reply()
create or replace function public.consume_oracle_reply(p_session_id uuid, p_user_id uuid)
returns integer
language plpgsql
security definer
as $$
declare
  v_replies_used  integer;
  v_replies_total integer;
  v_expires_at    timestamptz;
begin
  if p_user_id is distinct from auth.uid() then
    raise exception 'unauthorized'
      using errcode = 'P0001';
  end if;

  select replies_used, replies_total, expires_at
    into v_replies_used, v_replies_total, v_expires_at
    from public.oracle_sessions
   where id = p_session_id
     and user_id = p_user_id
  for update;

  if not found then
    raise exception 'session_not_found'
      using errcode = 'P0002';
  end if;

  if v_expires_at < now() then
    raise exception 'session_expired'
      using errcode = 'P0003';
  end if;

  if v_replies_used >= v_replies_total then
    raise exception 'session_exhausted'
      using errcode = 'P0004';
  end if;

  update public.oracle_sessions
     set replies_used = replies_used + 1
   where id = p_session_id;

  return v_replies_used + 1;
end;
$$;

grant execute on function public.consume_oracle_reply(uuid, uuid) to authenticated;

-- ─── 2. Stripe billing: profiles.stripe_customer_id, subscriptions, webhook, get_user_subscription ─

alter table public.profiles
  add column if not exists stripe_customer_id text unique;

create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users (id) on delete cascade,
  stripe_subscription_id  text not null unique,
  stripe_customer_id      text not null,
  plan_id                 text not null,
  status                  text not null,
  trial_end               timestamptz,
  current_period_start    timestamptz not null,
  current_period_end      timestamptz not null,
  cancel_at_period_end    boolean not null default false,
  last_credited_invoice_id text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_stripe_customer_id_idx on public.subscriptions (stripe_customer_id);

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

alter table public.subscriptions enable row level security;

drop policy if exists "Users can view own subscription" on public.subscriptions;
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

drop policy if exists "Service role manages subscriptions" on public.subscriptions;
create policy "Service role manages subscriptions"
  on public.subscriptions for all
  using (true)
  with check (true);

alter table public.credit_transactions add column if not exists source text not null default 'manual';
alter table public.credit_transactions add column if not exists metadata jsonb;
create index if not exists credit_transactions_source_idx on public.credit_transactions (source);

create table if not exists public.stripe_webhook_events (
  id           text primary key,
  processed_at timestamptz not null default now()
);

alter table public.stripe_webhook_events enable row level security;

drop policy if exists "Service role manages webhook events" on public.stripe_webhook_events;
create policy "Service role manages webhook events"
  on public.stripe_webhook_events for all
  using (true)
  with check (true);

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

-- ─── 3. Waitlist signups ───────────────────────────────────────────────────

create table if not exists public.waitlist_signups (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  intentions      text[] not null default '{}',
  is_beta_tester  boolean not null default false,
  referral_source text,
  message         text,
  status          text not null default 'pending'
                    check (status in ('pending', 'approved', 'rejected')),
  created_at      timestamptz not null default now()
);

alter table public.waitlist_signups drop constraint if exists waitlist_signups_email_unique;
alter table public.waitlist_signups add constraint waitlist_signups_email_unique unique (email);

alter table public.waitlist_signups enable row level security;

drop policy if exists "Anyone can join the waitlist" on public.waitlist_signups;
create policy "Anyone can join the waitlist"
  on public.waitlist_signups for insert
  to anon, authenticated
  with check (true);

-- ─── 4. (Optional) Audio storage bucket — run separately if Storage bucket: audio was WARN ─
-- Uncomment and run to create the audio bucket:
/*
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'audio',
  'audio',
  false,
  52428800,
  array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
*/
