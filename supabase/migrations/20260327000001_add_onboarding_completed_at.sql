-- Add onboarding_completed_at to profiles.
-- Set when user completes the onboarding guide step (mobile and web).
alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;
