-- Migration: add_is_beta_tester_to_profiles
-- Beta users are normal users (role = 'user') with is_beta_tester = true.
-- Set when promoting from waitlist or when user signs up via beta path.

alter table public.profiles
  add column if not exists is_beta_tester boolean not null default false;
