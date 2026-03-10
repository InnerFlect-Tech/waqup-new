-- Migration: sanctuary_saves
-- Stores user saves of marketplace content for "Add to Sanctuary" feature.

create table if not exists public.sanctuary_saves (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  created_at      timestamptz not null default now(),

  unique (user_id, content_item_id)
);

create index if not exists sanctuary_saves_user_id_idx
  on public.sanctuary_saves (user_id);

create index if not exists sanctuary_saves_content_item_id_idx
  on public.sanctuary_saves (content_item_id);

alter table public.sanctuary_saves enable row level security;

create policy "Users can view own sanctuary saves"
  on public.sanctuary_saves for select
  using (auth.uid() = user_id);

create policy "Users can insert own sanctuary saves"
  on public.sanctuary_saves for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sanctuary saves"
  on public.sanctuary_saves for update
  using (auth.uid() = user_id);

create policy "Users can delete own sanctuary saves"
  on public.sanctuary_saves for delete
  using (auth.uid() = user_id);
