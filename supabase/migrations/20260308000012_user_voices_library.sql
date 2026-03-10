-- Migration: user_voices_library
-- Creates the voice library table — a multi-slot voice collection per user.
-- Each slot holds an ElevenLabs Instant Voice Clone for a person who matters to the user.

-- Relationship enum (idempotent: create only if not exists)
do $$
begin
  if not exists (select 1 from pg_type t join pg_namespace n on n.oid = t.typnamespace where t.typname = 'voice_relationship' and n.nspname = 'public') then
    create type public.voice_relationship as enum (
      'self', 'family', 'friend', 'teacher', 'mentor', 'partner', 'other'
    );
  end if;
end $$;

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

drop trigger if exists user_voices_updated_at on public.user_voices;
create trigger user_voices_updated_at
  before update on public.user_voices
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.user_voices enable row level security;

drop policy if exists "Users can view their own voices" on public.user_voices;
create policy "Users can view their own voices"
  on public.user_voices for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own voices" on public.user_voices;
create policy "Users can insert their own voices"
  on public.user_voices for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own voices" on public.user_voices;
create policy "Users can update their own voices"
  on public.user_voices for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their own voices" on public.user_voices;
create policy "Users can delete their own voices"
  on public.user_voices for delete
  using (auth.uid() = user_id);
