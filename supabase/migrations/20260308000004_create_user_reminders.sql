-- Migration: create_user_reminders
-- Depends on: set_updated_at() function (created in 000000, repeated here for safety)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Creates the user_reminders table for scheduling practice sessions
-- Per docs: "Daily Reminders" - notifications at preferred times, schedule for affirmations/meditations/rituals

create table if not exists public.user_reminders (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,

  label         text not null default 'Practice reminder',
  time          time not null,
  days_of_week  smallint[] not null default '{1,2,3,4,5}' check (
    array_length(days_of_week, 1) > 0 and
    days_of_week <@ ARRAY[0,1,2,3,4,5,6]::smallint[]
  ),
  enabled       boolean not null default true,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 0 = Sunday, 1 = Monday, ... 6 = Saturday

create index if not exists user_reminders_user_id_idx
  on public.user_reminders (user_id);

create index if not exists user_reminders_enabled_idx
  on public.user_reminders (user_id, enabled) where enabled = true;

drop trigger if exists user_reminders_updated_at on public.user_reminders;
create trigger user_reminders_updated_at
  before update on public.user_reminders
  for each row execute function public.set_updated_at();

alter table public.user_reminders enable row level security;

drop policy if exists "Users can view own reminders" on public.user_reminders;
create policy "Users can view own reminders"
  on public.user_reminders for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own reminders" on public.user_reminders;
create policy "Users can create own reminders"
  on public.user_reminders for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own reminders" on public.user_reminders;
create policy "Users can update own reminders"
  on public.user_reminders for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own reminders" on public.user_reminders;
create policy "Users can delete own reminders"
  on public.user_reminders for delete
  using (auth.uid() = user_id);
