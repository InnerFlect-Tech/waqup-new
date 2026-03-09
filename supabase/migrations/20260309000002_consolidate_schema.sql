-- Migration: consolidate_schema
-- Fixes schema gaps discovered in the audit:
--   1. marketplace_shares: add UNIQUE constraint to prevent share-reward farming
--   2. record_share_and_award_credit: rewrite to honour the new unique constraint
--   3. Ensure get_credit_balance() is the canonical parameterless form
--      (removes the p_user_id variant that causes RPC signature mismatches)
--   4. Ensure credit_transactions INSERT policy allows service_role inserts
--      (deduct_credits runs as security definer so needs no policy bypass,
--       but add_credits / admin seeding need service_role access)

-- ─── 1. marketplace_shares: unique share per user per content item ─────────────────

-- Prevent the same user from triggering multiple share-reward events for the
-- same content item (the earlier "on conflict do nothing" had no unique target
-- to conflict on, so it was always a no-op).
create unique index if not exists marketplace_shares_unique_user_content
  on public.marketplace_shares (content_item_id, sharer_user_id)
  where sharer_user_id is not null;

-- ─── 2. record_share_and_award_credit: use unique constraint properly ─────────────

create or replace function public.record_share_and_award_credit(
  p_content_item_id uuid,
  p_platform        text,
  p_sharer_user_id  uuid default null
)
returns void
language plpgsql
security definer
as $$
declare
  v_creator_id uuid;
begin
  -- Insert share event. For authenticated sharers, use ON CONFLICT DO NOTHING
  -- so duplicate shares for the same user + content never award double credits.
  insert into public.marketplace_shares (content_item_id, sharer_user_id, platform)
  values (p_content_item_id, p_sharer_user_id, p_platform)
  on conflict (content_item_id, sharer_user_id)
  where sharer_user_id is not null
  do nothing;

  -- If the insert was a no-op (duplicate), the creator does not get a credit.
  if not found then
    return;
  end if;

  -- Increment share counter and get creator id.
  update public.marketplace_items
     set share_count = share_count + 1
   where content_item_id = p_content_item_id
  returning creator_id into v_creator_id;

  -- Award +1 Q to the creator only if the creator exists and is not the sharer
  -- (prevents self-share farming).
  if v_creator_id is not null and v_creator_id is distinct from p_sharer_user_id then
    insert into public.credit_transactions (user_id, amount, description)
    values (v_creator_id, 1, 'share_reward');
  end if;
end;
$$;

-- ─── 3. Canonical get_credit_balance() ────────────────────────────────────────────
-- Ensure only the parameterless version exists (uses auth.uid() internally).
-- Drop any p_user_id variant that may have been created by 002_orb_system.sql.

drop function if exists public.get_credit_balance(uuid);

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

-- ─── 4. service_role INSERT policy on credit_transactions ────────────────────────
-- deduct_credits() and add_credits() run as security definer so they bypass RLS.
-- But explicit service_role policy ensures direct service-role inserts (admin seeding)
-- also work without bypassing RLS globally.

drop policy if exists "Service role can insert credits" on public.credit_transactions;

create policy "Service role can insert credits"
  on public.credit_transactions for insert
  with check (
    auth.jwt() ->> 'role' = 'service_role'
    or (auth.uid() = user_id and amount < 0)
  );
