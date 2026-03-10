-- Migration: marketplace_audio
-- Adds three-layer audio columns, per-user volume preferences, marketplace tables,
-- and share tracking with credit-earning mechanics.

-- ─── 1. Three-layer audio URLs + default volumes on content_items ─────────────

alter table public.content_items
  add column if not exists voice_url          text,
  add column if not exists ambient_url        text,
  add column if not exists binaural_url       text,
  add column if not exists default_vol_voice  integer not null default 80 check (default_vol_voice between 0 and 100),
  add column if not exists default_vol_ambient integer not null default 40 check (default_vol_ambient between 0 and 100),
  add column if not exists default_vol_binaural integer not null default 30 check (default_vol_binaural between 0 and 100);

-- ─── 2. Per-user volume preferences on profiles ───────────────────────────────

alter table public.profiles
  add column if not exists pref_vol_voice    integer not null default 80 check (pref_vol_voice between 0 and 100),
  add column if not exists pref_vol_ambient  integer not null default 40 check (pref_vol_ambient between 0 and 100),
  add column if not exists pref_vol_binaural integer not null default 30 check (pref_vol_binaural between 0 and 100),
  add column if not exists pref_vol_master   integer not null default 100 check (pref_vol_master between 0 and 100);

-- ─── 3. Marketplace items ─────────────────────────────────────────────────────

create table if not exists public.marketplace_items (
  id              uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  creator_id      uuid not null references auth.users(id) on delete cascade,

  -- Visibility & curation
  is_elevated     boolean not null default false,
  is_listed       boolean not null default true,

  -- Engagement counters (denormalized for fast reads)
  play_count      integer not null default 0,
  share_count     integer not null default 0,

  -- Timestamps
  listed_at       timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists marketplace_items_creator_idx
  on public.marketplace_items (creator_id, listed_at desc);

create index if not exists marketplace_items_elevated_idx
  on public.marketplace_items (is_elevated, listed_at desc) where is_listed = true;

create index if not exists marketplace_items_listed_idx
  on public.marketplace_items (listed_at desc) where is_listed = true;

drop trigger if exists marketplace_items_updated_at on public.marketplace_items;
create trigger marketplace_items_updated_at
  before update on public.marketplace_items
  for each row execute function public.set_updated_at();

alter table public.marketplace_items enable row level security;

-- Anyone can view listed marketplace items
drop policy if exists "Public can view listed marketplace items" on public.marketplace_items;
create policy "Public can view listed marketplace items"
  on public.marketplace_items for select
  using (is_listed = true);

-- Creators can manage their own listings
drop policy if exists "Creators can insert own marketplace items" on public.marketplace_items;
create policy "Creators can insert own marketplace items"
  on public.marketplace_items for insert
  with check (auth.uid() = creator_id);

drop policy if exists "Creators can update own marketplace items" on public.marketplace_items;
create policy "Creators can update own marketplace items"
  on public.marketplace_items for update
  using (auth.uid() = creator_id);

drop policy if exists "Creators can delete own marketplace items" on public.marketplace_items;
create policy "Creators can delete own marketplace items"
  on public.marketplace_items for delete
  using (auth.uid() = creator_id);

-- ─── 4. Marketplace shares (drives credit awards) ────────────────────────────

create table if not exists public.marketplace_shares (
  id              uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  sharer_user_id  uuid references auth.users(id) on delete set null,
  platform        text not null check (platform in ('instagram', 'whatsapp', 'x', 'copy', 'other')),
  shared_at       timestamptz not null default now()
);

create index if not exists marketplace_shares_content_idx
  on public.marketplace_shares (content_item_id, shared_at desc);

create index if not exists marketplace_shares_creator_lookup_idx
  on public.marketplace_shares (content_item_id);

alter table public.marketplace_shares enable row level security;

-- Anyone (including anonymous) can insert a share event
drop policy if exists "Anyone can record a share" on public.marketplace_shares;
create policy "Anyone can record a share"
  on public.marketplace_shares for insert
  with check (true);

-- Creators can view shares of their content (via join); users can view own shares
drop policy if exists "Users can view own shares" on public.marketplace_shares;
create policy "Users can view own shares"
  on public.marketplace_shares for select
  using (auth.uid() = sharer_user_id);

-- ─── 5. Function: record share + award credit to creator ─────────────────────

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
  v_mi_id      uuid;
begin
  -- Insert the share event
  insert into public.marketplace_shares (content_item_id, sharer_user_id, platform)
  values (p_content_item_id, p_sharer_user_id, p_platform);

  -- Increment the share counter on marketplace_items
  update public.marketplace_items
    set share_count = share_count + 1
  where content_item_id = p_content_item_id
  returning id, creator_id into v_mi_id, v_creator_id;

  -- Award +1 Q to the creator via credit_transactions
  if v_creator_id is not null then
    insert into public.credit_transactions (user_id, amount, description)
    values (v_creator_id, 1, 'share_reward')
    on conflict do nothing;
  end if;
end;
$$;

-- ─── 6. Function: increment play count ──────────────────────────────────────

create or replace function public.increment_play_count(p_content_item_id uuid)
returns void
language sql
security definer
as $$
  update public.marketplace_items
    set play_count = play_count + 1
  where content_item_id = p_content_item_id
    and is_listed = true;
$$;

-- ─── 7. Creator profiles view (public-safe read) ─────────────────────────────

create or replace view public.creator_profiles_view as
  select
    p.id                              as creator_id,
    count(mi.id)                      as published_count,
    coalesce(sum(mi.play_count), 0)   as total_plays,
    coalesce(sum(mi.share_count), 0)  as total_shares
  from public.profiles p
  left join public.marketplace_items mi on mi.creator_id = p.id and mi.is_listed = true
  group by p.id;
