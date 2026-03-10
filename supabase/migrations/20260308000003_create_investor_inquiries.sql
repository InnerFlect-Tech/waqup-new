-- Migration: create_investor_inquiries
-- Stores investor/partner contact form submissions from the website

create table if not exists public.investor_inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  interest   text,
  message    text,
  created_at timestamptz not null default now()
);

-- Allow public (anon) to insert — contact form from unauthenticated visitors
alter table public.investor_inquiries enable row level security;

drop policy if exists "Anyone can submit inquiry" on public.investor_inquiries;
create policy "Anyone can submit inquiry"
  on public.investor_inquiries for insert
  to anon
  with check (true);

-- Only authenticated users with service role can read (handled server-side)
-- No select policy for anon — keeps submissions private
