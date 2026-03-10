-- Migration: create_feedback
-- Feedback table for beta/user feedback submitted via Help page.
-- Syncs to ClickUp via API route.

create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete set null,
  message    text not null,
  category   text not null default 'general' check (category in ('bug', 'feature', 'content', 'billing', 'general')),
  context    jsonb,
  created_at timestamptz not null default now()
);

create index if not exists feedback_user_id_idx on public.feedback (user_id);
create index if not exists feedback_created_at_idx on public.feedback (created_at desc);

alter table public.feedback enable row level security;

create policy "Users can insert own feedback"
  on public.feedback for insert
  to authenticated, anon
  with check (auth.uid() is not distinct from user_id);
