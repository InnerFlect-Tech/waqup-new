-- Migration: get_user_practice_level
-- Returns the user's practice level based on total XP from practice_sessions.
-- Used for server-side gating (future RLS, API middleware).

create or replace function public.get_user_practice_level()
returns text
language plpgsql
security definer
as $$
declare
  v_total_xp int;
  v_affirmation_xp int;
  v_meditation_xp int;
  v_ritual_xp int;
begin
  select
    coalesce(sum(case when content_type = 'affirmation' then 5 else 0 end), 0),
    coalesce(sum(case when content_type = 'meditation' then 10 else 0 end), 0),
    coalesce(sum(case when content_type = 'ritual' then 15 else 0 end), 0)
  into v_affirmation_xp, v_meditation_xp, v_ritual_xp
  from public.practice_sessions
  where user_id = auth.uid();

  v_total_xp := v_affirmation_xp + v_meditation_xp + v_ritual_xp;

  if v_total_xp >= 1000 then
    return 'master';
  elsif v_total_xp >= 600 then
    return 'sage';
  elsif v_total_xp >= 400 then
    return 'alchemist';
  elsif v_total_xp >= 200 then
    return 'adept';
  elsif v_total_xp >= 100 then
    return 'practitioner';
  elsif v_total_xp >= 50 then
    return 'explorer';
  elsif v_total_xp >= 25 then
    return 'initiate';
  else
    return 'seeker';
  end if;
end;
$$;

grant execute on function public.get_user_practice_level() to authenticated;
