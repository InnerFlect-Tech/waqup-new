-- Credit system: credit_transactions table + get_credit_balance RPC
-- Each row is a single ledger entry (positive = earned, negative = spent).

create table if not exists public.credit_transactions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  amount       integer not null,            -- positive = credit, negative = debit
  description  text not null default '',
  created_at   timestamptz not null default now()
);

-- Index for fast per-user lookups
create index if not exists credit_transactions_user_id_idx on public.credit_transactions(user_id);
create index if not exists credit_transactions_user_created_idx on public.credit_transactions(user_id, created_at desc);

-- RLS
alter table public.credit_transactions enable row level security;

drop policy if exists "Users can view own transactions" on public.credit_transactions;
create policy "Users can view own transactions"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Service role can insert transactions" on public.credit_transactions;
create policy "Service role can insert transactions"
  on public.credit_transactions for insert
  with check (true);

-- get_credit_balance() — sums all ledger entries for the calling user.
-- Returns 0 for unauthenticated callers (no auth.uid()).
create or replace function public.get_credit_balance()
returns integer
language sql
security definer
stable
as $$
  select coalesce(sum(amount), 0)::integer
  from public.credit_transactions
  where user_id = auth.uid();
$$;

-- add_credits(user_id, amount, description) — server-side helper
-- Called from API routes (service role) to deduct or credit Qs.
create or replace function public.add_credits(
  p_user_id   uuid,
  p_amount    integer,
  p_description text default ''
)
returns void
language sql
security definer
as $$
  insert into public.credit_transactions(user_id, amount, description)
  values (p_user_id, p_amount, p_description);
$$;
