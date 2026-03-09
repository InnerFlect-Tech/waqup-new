-- Fix content_items.status check constraint to match the TypeScript ContentStatus type.
-- The original migration only allowed ('draft', 'complete').
-- The TypeScript type and render route expect: 'draft', 'processing', 'ready', 'failed'.
-- We keep 'complete' for backward compatibility with any existing rows.

alter table public.content_items
  drop constraint if exists content_items_status_check;

alter table public.content_items
  add constraint content_items_status_check
    check (status in ('draft', 'processing', 'ready', 'failed', 'complete'));

-- Ensure the audio_settings JSONB column exists (added in 000001, but guard anyway)
alter table public.content_items
  add column if not exists audio_settings jsonb;

-- Ensure the three-layer audio URL columns exist (added in 000005, but guard anyway)
alter table public.content_items
  add column if not exists voice_url text,
  add column if not exists ambient_url text,
  add column if not exists binaural_url text;

-- Ensure per-content default volume columns exist (added in 000005)
alter table public.content_items
  add column if not exists default_vol_voice   integer not null default 80,
  add column if not exists default_vol_ambient  integer not null default 40,
  add column if not exists default_vol_binaural integer not null default 30;
