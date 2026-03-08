-- Migration: add_audio_columns
-- Adds audio_url, voice_type, and audio_settings columns used by content service

alter table public.content_items
  add column if not exists audio_url text,
  add column if not exists voice_type text,
  add column if not exists audio_settings jsonb;
