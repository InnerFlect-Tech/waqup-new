-- Migration: add_elevenlabs_voice_to_profiles
-- Adds ElevenLabs Professional Voice Cloning fields to profiles for user voice setup

-- Ensure profiles table exists (Supabase auth often creates it)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade
);

-- Add ElevenLabs voice columns
alter table public.profiles
  add column if not exists elevenlabs_voice_id text,
  add column if not exists elevenlabs_voice_name text,
  add column if not exists elevenlabs_voice_language text default 'en';
