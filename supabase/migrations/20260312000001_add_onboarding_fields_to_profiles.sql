-- Migration: add_onboarding_fields_to_profiles
-- Adds preferred_name and onboarding_intention for onboarding flow

alter table public.profiles
  add column if not exists preferred_name text,
  add column if not exists onboarding_intention text;
