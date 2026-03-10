-- =============================================================================
-- Ensure E2E test user has access_granted for Playwright authenticated specs
-- =============================================================================
-- Run in Supabase Dashboard → SQL Editor.
-- Required for: test:e2e:critical, test:e2e (authenticated projects).
-- Without this, the test user lands on /coming-soon and sanctuary/credits/create
-- specs fail.
--
-- Default email: test@waqup.app (matches OVERRIDE_LOGIN_EMAIL in CI/docs)
-- Change the email below if your test user differs.
-- =============================================================================

do $$
declare
  v_email text := 'test@waqup.app';
  v_user_id uuid;
  v_updated int;
begin
  select id into v_user_id from auth.users where email = v_email;

  if v_user_id is null then
    raise notice 'User % not found. Create the test user first (sign up via app or Supabase Auth), then re-run.', v_email;
    return;
  end if;

  update public.profiles
  set access_granted = true
  where id = v_user_id
    and (access_granted is null or access_granted = false);

  get diagnostics v_updated = row_count;

  if v_updated > 0 then
    raise notice 'Granted access to % (id: %). E2E authenticated specs should now pass.', v_email, v_user_id;
  else
    raise notice 'User % already has access_granted. No change needed.', v_email;
  end if;
end $$;
