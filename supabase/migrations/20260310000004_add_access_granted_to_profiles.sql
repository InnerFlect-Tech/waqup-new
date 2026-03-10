-- Add access_granted flag to profiles.
-- Default false for all new users; existing admins/superadmins are auto-approved.
alter table public.profiles
  add column if not exists access_granted boolean not null default false;

-- Auto-approve existing admins and superadmins.
update public.profiles
  set access_granted = true
  where role in ('admin', 'superadmin');

-- Allow authenticated users to read their own waitlist signup (by matching email).
-- This lets the /coming-soon page show the user's current waitlist status.
drop policy if exists "Users can view own waitlist signup" on public.waitlist_signups;
create policy "Users can view own waitlist signup"
  on public.waitlist_signups for select
  using (email = auth.email());
