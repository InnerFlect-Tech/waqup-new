-- Migration: add_role_to_profiles
-- Adds a role column to profiles for superadmin / admin / creator / user access control.

alter table public.profiles
  add column if not exists role text not null default 'user'
    check (role in ('user', 'creator', 'admin', 'superadmin'));

-- Drop legacy "Users can view own profile" policy (created in fix_schema_gaps migration)
-- and replace with a version that also exposes the role column for the same user.
-- Policy logic is identical — select own row — but this makes intent explicit.
drop policy if exists "Users can view own profile" on public.profiles;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);
