-- Migration: add_onboarding_applications_to_profiles
-- Stores selected "Where does this apply?" options (teachers, coaches, creators, studios)
-- for personalization and product insights.

alter table public.profiles
  add column if not exists onboarding_applications text[];
