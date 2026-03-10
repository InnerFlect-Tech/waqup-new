-- Add is_founding_member to waitlist_signups to track founding membership claims.
-- Used for displaying "X spots remaining" (500 - count where is_founding_member).

alter table public.waitlist_signups
  add column if not exists is_founding_member boolean not null default false;

create index if not exists idx_waitlist_signups_is_founding_member
  on public.waitlist_signups (is_founding_member)
  where is_founding_member = true;
