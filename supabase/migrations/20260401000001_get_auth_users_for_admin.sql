-- Admin users fallback: direct read from auth.users when auth.admin.listUsers fails.
-- Used by /api/admin/users when GoTrue returns "Database error finding users".
-- Callable only by service_role (Supabase admin client).

create or replace function public.get_auth_users_for_admin(p_limit int default 200)
returns table (
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language sql
security definer
set search_path = auth, public
as $$
  select au.id, coalesce(au.email, '')::text, au.created_at, au.last_sign_in_at
  from auth.users au
  order by au.last_sign_in_at desc nulls last, au.created_at desc
  limit least(p_limit, 500);
$$;

comment on function public.get_auth_users_for_admin(int) is
  'Admin-only: returns auth.users rows for admin dashboard. Fallback when auth.admin.listUsers fails.';

-- Restrict to service_role
revoke all on function public.get_auth_users_for_admin(int) from public;
grant execute on function public.get_auth_users_for_admin(int) to service_role;
