-- Waitlist signups table
-- Allows anonymous inserts; SELECT restricted to service_role.

create table if not exists public.waitlist_signups (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  intentions      text[] not null default '{}',
  is_beta_tester  boolean not null default false,
  referral_source text,
  message         text,
  status          text not null default 'pending'
                    check (status in ('pending', 'approved', 'rejected')),
  created_at      timestamptz not null default now()
);

-- Unique email constraint (deduplication)
alter table public.waitlist_signups
  drop constraint if exists waitlist_signups_email_unique;
alter table public.waitlist_signups
  add constraint waitlist_signups_email_unique unique (email);

-- Row-level security
alter table public.waitlist_signups enable row level security;

-- Anyone (including anonymous) can submit their details
drop policy if exists "Anyone can join the waitlist" on public.waitlist_signups;
create policy "Anyone can join the waitlist"
  on public.waitlist_signups
  for insert
  to anon, authenticated
  with check (true);

-- Only service-role can read (used by admin API routes)
-- No SELECT policy for anon/authenticated intentionally limits reads to server.
