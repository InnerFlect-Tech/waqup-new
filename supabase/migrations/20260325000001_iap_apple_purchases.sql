-- =============================================================================
-- Apple IAP (RevenueCat) support
-- =============================================================================
-- Tables and function for crediting Qs when users purchase via Apple In-App
-- Purchase. RevenueCat webhook calls grant_iap_credits() via the API.
-- =============================================================================

-- 1. iap_purchases — idempotent receipt tracking
-- -----------------------------------------------------------------------
create table if not exists public.iap_purchases (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  product_id     text not null,
  transaction_id text not null unique,
  amount_qs      integer not null default 0,
  environment    text not null default 'production',
  purchased_at   timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

alter table public.iap_purchases enable row level security;

create policy "Users can view their own IAP purchases"
  on public.iap_purchases for select
  using (auth.uid() = user_id);

create policy "Service role can insert IAP purchases"
  on public.iap_purchases for insert
  with check (true);

create index if not exists iap_purchases_user_idx on public.iap_purchases(user_id);
create index if not exists iap_purchases_transaction_idx on public.iap_purchases(transaction_id);

-- 2. iap_products — product ID → Qs mapping
-- -----------------------------------------------------------------------
create table if not exists public.iap_products (
  product_id   text primary key,
  qs_amount    integer not null,
  display_name text not null,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.iap_products enable row level security;

create policy "Anyone can view IAP products"
  on public.iap_products for select using (true);

insert into public.iap_products (product_id, qs_amount, display_name)
values
  ('com.waqup.credits.50',  50,  'Starter — 50 Qs'),
  ('com.waqup.credits.200', 200, 'Growth — 200 Qs'),
  ('com.waqup.credits.500', 500, 'Devotion — 500 Qs')
on conflict (product_id) do nothing;

-- 3. grant_iap_credits() — atomic credit grant from webhook
-- -----------------------------------------------------------------------
create or replace function public.grant_iap_credits(
  p_user_id        uuid,
  p_product_id     text,
  p_transaction_id text,
  p_environment    text default 'production'
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_qs_amount integer;
  v_existing  integer;
begin
  select 1 into v_existing from public.iap_purchases where transaction_id = p_transaction_id;
  if v_existing is not null then
    return jsonb_build_object('status', 'already_processed');
  end if;

  select qs_amount into v_qs_amount from public.iap_products
  where product_id = p_product_id and active = true;

  if v_qs_amount is null then
    raise exception 'Unknown product: %', p_product_id;
  end if;

  insert into public.iap_purchases (user_id, product_id, transaction_id, amount_qs, environment)
  values (p_user_id, p_product_id, p_transaction_id, v_qs_amount, p_environment);

  insert into public.credit_transactions (user_id, amount, description, source)
  values (p_user_id, v_qs_amount, 'IAP purchase: ' || p_product_id, 'iap');

  return jsonb_build_object(
    'status', 'granted',
    'qs_granted', v_qs_amount,
    'product_id', p_product_id
  );
end;
$$;

grant execute on function public.grant_iap_credits to service_role;
