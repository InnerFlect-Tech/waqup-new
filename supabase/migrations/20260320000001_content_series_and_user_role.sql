-- Migration: content_series_and_user_role
-- Adds user_role to profiles (product persona) and content series tables.

-- ─── 1. User role (product persona) ──────────────────────────────────────────

alter table public.profiles
  add column if not exists user_role text
    check (user_role in ('personal', 'teacher', 'coach', 'studio', 'creator'));

-- ─── 2. Creator tier (for tiered promoter programme) ─────────────────────────

alter table public.profiles
  add column if not exists creator_tier text not null default 'micro'
    check (creator_tier in ('micro', 'creator', 'partner'));

-- ─── 3. Content series ───────────────────────────────────────────────────────

create table if not exists public.content_series (
  id           uuid primary key default gen_random_uuid(),
  creator_id   uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  description  text,
  cover_emoji  text,
  is_published boolean not null default false,
  is_listed    boolean not null default false,
  play_count   integer not null default 0,
  share_count  integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.content_series_items (
  id           uuid primary key default gen_random_uuid(),
  series_id    uuid not null references public.content_series(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  order_index  integer not null default 0,
  created_at   timestamptz not null default now(),
  unique (series_id, content_item_id)
);

-- ─── 4. Indexes ───────────────────────────────────────────────────────────────

create index if not exists idx_content_series_creator on public.content_series(creator_id);
create index if not exists idx_content_series_listed on public.content_series(is_listed, is_published);
create index if not exists idx_content_series_items_series on public.content_series_items(series_id, order_index);

-- ─── 5. RLS ───────────────────────────────────────────────────────────────────

alter table public.content_series enable row level security;
alter table public.content_series_items enable row level security;

-- Series: owners can CRUD their own; everyone can read listed series
create policy "Creators can manage own series"
  on public.content_series for all
  using (auth.uid() = creator_id);

create policy "Anyone can view published series"
  on public.content_series for select
  using (is_listed = true and is_published = true);

-- Series items: owners can CRUD; everyone can read items of listed series
create policy "Creators can manage own series items"
  on public.content_series_items for all
  using (
    exists (
      select 1 from public.content_series s
      where s.id = series_id and s.creator_id = auth.uid()
    )
  );

create policy "Anyone can view items of listed series"
  on public.content_series_items for select
  using (
    exists (
      select 1 from public.content_series s
      where s.id = series_id and s.is_listed = true and s.is_published = true
    )
  );

-- ─── 6. Updated_at trigger ───────────────────────────────────────────────────

create or replace function public.update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_content_series_updated_at on public.content_series;
create trigger trg_content_series_updated_at
  before update on public.content_series
  for each row execute function public.update_updated_at_column();

-- ─── 7. Tiered share award function ──────────────────────────────────────────
-- Replaces the flat 1Q award with a tier-based award.

create or replace function public.record_share_and_award_credit(
  p_content_item_id uuid,
  p_platform        text,
  p_sharer_user_id  uuid
) returns void language plpgsql security definer as $$
declare
  v_creator_id   uuid;
  v_creator_tier text;
  v_award_amount integer;
begin
  -- Get the creator of this content item
  select user_id into v_creator_id
  from public.content_items
  where id = p_content_item_id;

  if v_creator_id is null then return; end if;

  -- Get the creator's tier
  select coalesce(creator_tier, 'micro') into v_creator_tier
  from public.profiles
  where id = v_creator_id;

  -- Determine award based on tier
  v_award_amount := case v_creator_tier
    when 'partner'  then 3
    when 'creator'  then 2
    else             1   -- micro (default)
  end;

  -- Record the share event
  insert into public.marketplace_shares (content_item_id, sharer_user_id, platform, shared_at)
  values (p_content_item_id, p_sharer_user_id, p_platform, now())
  on conflict do nothing;

  -- Increment share_count on marketplace listing
  update public.marketplace_items
  set share_count = share_count + 1
  where content_item_id = p_content_item_id;

  -- Award Q credits to creator
  insert into public.credit_transactions (user_id, amount, description, transaction_type)
  values (v_creator_id, v_award_amount, 'Share reward (' || p_platform || ')', 'credit');

  -- Update creator tier based on total plays (auto-promotion)
  update public.profiles
  set creator_tier = (
    select case
      when coalesce(sum(mi.play_count), 0) >= 5000 then 'partner'
      when coalesce(sum(mi.play_count), 0) >= 500  then 'creator'
      else 'micro'
    end
    from public.marketplace_items mi
    join public.content_items ci on ci.id = mi.content_item_id
    where ci.user_id = v_creator_id
  )
  where id = v_creator_id;
end;
$$;
