-- Migration: user_voices_library
-- Creates the voice library table — a multi-slot voice collection per user.
-- Each slot holds an ElevenLabs Instant Voice Clone for a person who matters to the user.

-- Relationship enum
create type public.voice_relationship as enum (
  'self',
  'family',
  'friend',
  'teacher',
  'mentor',
  'partner',
  'other'
);

-- Voice library table
create table if not exists public.user_voices (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  elevenlabs_voice_id text not null,
  name          text not null,
  relationship  public.voice_relationship not null default 'other',
  description   text,
  avatar_color  text default '#7c3aed',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index for fast user queries
create index if not exists user_voices_user_id_idx on public.user_voices (user_id);

create trigger user_voices_updated_at
  before update on public.user_voices
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.user_voices enable row level security;

create policy "Users can view their own voices"
  on public.user_voices for select
  using (auth.uid() = user_id);

create policy "Users can insert their own voices"
  on public.user_voices for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own voices"
  on public.user_voices for update
  using (auth.uid() = user_id);

create policy "Users can delete their own voices"
  on public.user_voices for delete
  using (auth.uid() = user_id);
