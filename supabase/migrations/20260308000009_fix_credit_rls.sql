-- Fix: Restrict credit_transactions INSERT policy to prevent self-injection of credits.
-- Previously 'with check (true)' allowed any authenticated user to insert arbitrary amounts.
-- New policy only allows negative-amount (debit) inserts scoped to the calling user.

drop policy if exists "Service role can insert transactions" on public.credit_transactions;
drop policy if exists "Users can deduct own credits" on public.credit_transactions;

create policy "Users can deduct own credits"
  on public.credit_transactions for insert
  with check (auth.uid() = user_id and amount < 0);
