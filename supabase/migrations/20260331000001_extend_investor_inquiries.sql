-- Migration: extend_investor_inquiries
-- Add columns for comprehensive founding partner form

alter table public.investor_inquiries
  add column if not exists phone text,
  add column if not exists company text,
  add column if not exists referral_source text;

-- Add status with default for existing rows
alter table public.investor_inquiries
  add column if not exists status text default 'pending';

alter table public.investor_inquiries
  alter column status set not null,
  alter column status set default 'pending';

-- Add check constraint (drop first if exists from partial run)
alter table public.investor_inquiries drop constraint if exists investor_inquiries_status_check;
alter table public.investor_inquiries
  add constraint investor_inquiries_status_check check (status in ('pending', 'contacted', 'qualified', 'rejected'));
