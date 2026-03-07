-- Migration: 001_create_content_items
-- Creates the content_items table for storing user-created affirmations, meditations, and rituals
-- Apply via: Supabase dashboard → SQL Editor, or `supabase db push`

-- Enable UUID extension if not already enabled
create extension if not exists "pgcrypto";

-- Content items table
create table if not exists public.content_items (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,

  type          text not null check (type in ('affirmation', 'meditation', 'ritual')),
  title         text not null,
  description   text not null default '',
  script        text,
  duration      text not null default '',
  frequency     text,

  status        text not null default 'draft' check (status in ('draft', 'complete')),

  last_played_at  timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Index for fast per-user queries (the primary query pattern)
create index if not exists content_items_user_id_idx
  on public.content_items (user_id, created_at desc);

-- Index for filtering by type
create index if not exists content_items_user_type_idx
  on public.content_items (user_id, type, created_at desc);

-- Auto-update updated_at on row modification
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists content_items_updated_at on public.content_items;
create trigger content_items_updated_at
  before update on public.content_items
  for each row execute function public.set_updated_at();

-- Row Level Security: users can only access their own content
alter table public.content_items enable row level security;

-- Users can read their own content
create policy "Users can view own content"
  on public.content_items for select
  using (auth.uid() = user_id);

-- Users can create their own content
create policy "Users can create own content"
  on public.content_items for insert
  with check (auth.uid() = user_id);

-- Users can update their own content
create policy "Users can update own content"
  on public.content_items for update
  using (auth.uid() = user_id);

-- Users can delete their own content
create policy "Users can delete own content"
  on public.content_items for delete
  using (auth.uid() = user_id);
