-- Migration: creator_proposals
-- Stores creator marketplace proposals from users who haven't unlocked the Creator Marketplace.
-- Used by /api/marketplace/proposals (POST and GET).

create table if not exists public.creator_proposals (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  name             text not null,
  email            text not null,
  content_types    text[] not null default '{}',
  bio              text,
  instagram_handle text,
  tiktok_handle    text,
  status           text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at       timestamptz not null default now()
);

create index if not exists creator_proposals_created_at_idx
  on public.creator_proposals (created_at desc);

alter table public.creator_proposals enable row level security;

-- Admins can read all; authenticated users can insert (own or anonymous proposals)
drop policy if exists "Admins can view all proposals" on public.creator_proposals;
create policy "Admins can view all proposals"
  on public.creator_proposals for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'superadmin')
    )
  );

drop policy if exists "Authenticated and anonymous can insert" on public.creator_proposals;
create policy "Authenticated and anonymous can insert"
  on public.creator_proposals for insert
  with check (true);
