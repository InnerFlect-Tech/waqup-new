-- Fix: PostgreSQL disallows FOR UPDATE with aggregate functions (SUM).
-- Use advisory lock per user instead — serializes credit operations without schema changes.

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
  v_lock_key bigint;
begin
  if p_user_id is distinct from auth.uid() then
    raise exception 'unauthorized'
      using hint = 'p_user_id must match the calling user',
            errcode = 'P0001';
  end if;

  -- Advisory lock per user: serializes all credit operations for this user.
  -- hashtext gives int4; use bigint to avoid overflow in lock key.
  v_lock_key := hashtext(p_user_id::text)::bigint;
  perform pg_advisory_xact_lock(v_lock_key);

  -- Now safe to read balance (lock prevents concurrent modifications).
  select coalesce(sum(amount), 0)::integer
    into v_balance
    from public.credit_transactions
   where user_id = p_user_id;

  if v_balance < p_amount then
    raise exception 'insufficient_credits'
      using hint = 'User does not have enough Qs',
            errcode = 'P0002';
  end if;

  insert into public.credit_transactions (user_id, amount, description)
  values (p_user_id, -p_amount, p_description);
end;
$$;
