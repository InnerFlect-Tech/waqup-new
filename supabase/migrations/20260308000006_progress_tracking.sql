-- Migration: progress_tracking
-- Creates practice_sessions and reflection_entries tables for the gamified Progress page

-- ─── practice_sessions ──────────────────────────────────────────────────────
-- One row per listen session. Powers streak calc, heatmap, minutes practiced, and XP.

create table if not exists public.practice_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  content_item_id  uuid references public.content_items(id) on delete set null,
  content_type     text not null check (content_type in ('affirmation', 'meditation', 'ritual')),
  duration_seconds int not null default 0,
  played_at        timestamptz not null default now()
);

create index if not exists practice_sessions_user_id_idx
  on public.practice_sessions (user_id);

create index if not exists practice_sessions_user_played_at_idx
  on public.practice_sessions (user_id, played_at desc);

alter table public.practice_sessions enable row level security;

drop policy if exists "Users can view own practice sessions" on public.practice_sessions;
create policy "Users can view own practice sessions"
  on public.practice_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own practice sessions" on public.practice_sessions;
create policy "Users can create own practice sessions"
  on public.practice_sessions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own practice sessions" on public.practice_sessions;
create policy "Users can update own practice sessions"
  on public.practice_sessions for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own practice sessions" on public.practice_sessions;
create policy "Users can delete own practice sessions"
  on public.practice_sessions for delete
  using (auth.uid() = user_id);


-- ─── reflection_entries ─────────────────────────────────────────────────────
-- Stores AI dialogue history + journal notes + energy level per session.

create table if not exists public.reflection_entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  energy_level smallint check (energy_level between 1 and 5),
  notes        text,
  messages     jsonb not null default '[]'::jsonb,
  ai_summary   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists reflection_entries_user_id_idx
  on public.reflection_entries (user_id);

create index if not exists reflection_entries_user_created_at_idx
  on public.reflection_entries (user_id, created_at desc);

drop trigger if exists reflection_entries_updated_at on public.reflection_entries;
create trigger reflection_entries_updated_at
  before update on public.reflection_entries
  for each row execute function public.set_updated_at();

alter table public.reflection_entries enable row level security;

drop policy if exists "Users can view own reflection entries" on public.reflection_entries;
create policy "Users can view own reflection entries"
  on public.reflection_entries for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own reflection entries" on public.reflection_entries;
create policy "Users can create own reflection entries"
  on public.reflection_entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own reflection entries" on public.reflection_entries;
create policy "Users can update own reflection entries"
  on public.reflection_entries for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own reflection entries" on public.reflection_entries;
create policy "Users can delete own reflection entries"
  on public.reflection_entries for delete
  using (auth.uid() = user_id);


-- ─── get_streak RPC ──────────────────────────────────────────────────────────
-- Returns the current consecutive-day practice streak for a given user.
-- A "day" is counted if at least one session exists with played_at on that date (UTC).

create or replace function public.get_streak(p_user_id uuid)
returns int
language plpgsql
security definer
as $$
declare
  v_streak    int := 0;
  v_check_day date := current_date;
  v_has_day   bool;
begin
  loop
    select exists (
      select 1
      from public.practice_sessions
      where user_id = p_user_id
        and played_at::date = v_check_day
    ) into v_has_day;

    exit when not v_has_day;

    v_streak    := v_streak + 1;
    v_check_day := v_check_day - interval '1 day';
  end loop;

  return v_streak;
end;
$$;

grant execute on function public.get_streak(uuid) to authenticated;


-- ─── get_progress_stats RPC ──────────────────────────────────────────────────
-- Returns aggregated progress stats for the Progress page in a single query.

create or replace function public.get_progress_stats(p_user_id uuid)
returns json
language plpgsql
security definer
as $$
declare
  v_streak           int;
  v_total_sessions   int;
  v_total_minutes    numeric;
  v_content_created  int;
  v_affirmation_xp   int;
  v_meditation_xp    int;
  v_ritual_xp        int;
  v_total_xp         int;
begin
  v_streak := public.get_streak(p_user_id);

  select count(*), coalesce(sum(duration_seconds) / 60.0, 0)
  into v_total_sessions, v_total_minutes
  from public.practice_sessions
  where user_id = p_user_id;

  select count(*)
  into v_content_created
  from public.content_items
  where user_id = p_user_id;

  -- XP: affirmation=5, meditation=10, ritual=15 per session
  select
    coalesce(sum(case when content_type = 'affirmation' then 5 else 0 end), 0),
    coalesce(sum(case when content_type = 'meditation'  then 10 else 0 end), 0),
    coalesce(sum(case when content_type = 'ritual'      then 15 else 0 end), 0)
  into v_affirmation_xp, v_meditation_xp, v_ritual_xp
  from public.practice_sessions
  where user_id = p_user_id;

  v_total_xp := v_affirmation_xp + v_meditation_xp + v_ritual_xp;

  return json_build_object(
    'streak',          v_streak,
    'totalSessions',   v_total_sessions,
    'minutesPracticed', round(v_total_minutes),
    'contentCreated',  v_content_created,
    'totalXp',         v_total_xp,
    'affirmationXp',   v_affirmation_xp,
    'meditationXp',    v_meditation_xp,
    'ritualXp',        v_ritual_xp
  );
end;
$$;

grant execute on function public.get_progress_stats(uuid) to authenticated;
