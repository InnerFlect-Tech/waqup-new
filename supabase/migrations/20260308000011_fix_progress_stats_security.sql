-- Fix: Rewrite get_progress_stats and get_streak to use auth.uid() internally.
-- Previously accepted p_user_id param — any authenticated user could query any other user's data.

create or replace function public.get_streak()
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
      where user_id = auth.uid()
        and played_at::date = v_check_day
    ) into v_has_day;

    exit when not v_has_day;

    v_streak    := v_streak + 1;
    v_check_day := v_check_day - interval '1 day';
  end loop;

  return v_streak;
end;
$$;

grant execute on function public.get_streak() to authenticated;

create or replace function public.get_progress_stats()
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
  v_streak := public.get_streak();

  select count(*), coalesce(sum(duration_seconds) / 60.0, 0)
  into v_total_sessions, v_total_minutes
  from public.practice_sessions
  where user_id = auth.uid();

  select count(*)
  into v_content_created
  from public.content_items
  where user_id = auth.uid();

  select
    coalesce(sum(case when content_type = 'affirmation' then 5 else 0 end), 0),
    coalesce(sum(case when content_type = 'meditation'  then 10 else 0 end), 0),
    coalesce(sum(case when content_type = 'ritual'      then 15 else 0 end), 0)
  into v_affirmation_xp, v_meditation_xp, v_ritual_xp
  from public.practice_sessions
  where user_id = auth.uid();

  v_total_xp := v_affirmation_xp + v_meditation_xp + v_ritual_xp;

  return json_build_object(
    'streak',           v_streak,
    'totalSessions',    v_total_sessions,
    'minutesPracticed', round(v_total_minutes),
    'contentCreated',   v_content_created,
    'totalXp',          v_total_xp,
    'affirmationXp',    v_affirmation_xp,
    'meditationXp',     v_meditation_xp,
    'ritualXp',         v_ritual_xp
  );
end;
$$;

grant execute on function public.get_progress_stats() to authenticated;
