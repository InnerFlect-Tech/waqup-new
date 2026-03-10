-- Migration: atomic_credit_deduct
-- Adds deduct_credits() — a single atomic RPC that checks balance AND inserts the debit
-- inside one transaction, eliminating the TOCTOU race condition present in all API routes
-- that previously did: check balance → call external API → insert debit.
--
-- Also adds the oracle_sessions table so the server can enforce reply counts rather than
-- trusting the client.

-- ─── 1. deduct_credits() — atomic balance-check + debit ──────────────────────────────
-- Callable by authenticated users (server-side routes use user JWT). The function
-- enforces that you can only deduct from your own account (p_user_id = auth.uid()).
-- The FOR UPDATE lock prevents concurrent deductions from both seeing a sufficient balance.

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
  -- Callers may only deduct from their own account.
  if p_user_id is distinct from auth.uid() then
    raise exception 'unauthorized'
      using hint = 'p_user_id must match the calling user',
            errcode = 'P0001';
  end if;

  -- Lock the user's ledger rows to prevent concurrent deductions from both passing
  -- the balance check before either deduction commits.
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

-- ─── 2. oracle_sessions — server-side reply counter ──────────────────────────────────

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

-- Users can read their own sessions (for balance display).
drop policy if exists "Users can view own oracle sessions" on public.oracle_sessions;
create policy "Users can view own oracle sessions"
  on public.oracle_sessions for select
  using (auth.uid() = user_id);

-- Sessions are inserted by API routes (server-side, authenticated user context).
drop policy if exists "Users can create own oracle sessions" on public.oracle_sessions;
create policy "Users can create own oracle sessions"
  on public.oracle_sessions for insert
  with check (auth.uid() = user_id);

-- ─── 3. consume_oracle_reply() — atomic reply decrement ──────────────────────────────
-- Atomically increments replies_used. Returns the new replies_used count.
-- Raises if the session is not found, expired, or exhausted.
-- Callable by authenticated users; enforces p_user_id = auth.uid().

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
