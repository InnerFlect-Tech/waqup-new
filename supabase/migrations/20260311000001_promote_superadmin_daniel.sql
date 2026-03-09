-- Promote daniel.indias@gmail.com to superadmin.
-- Run: supabase db push (or apply via Supabase Dashboard SQL Editor)

update public.profiles
set role = 'superadmin', access_granted = true
where id in (select id from auth.users where email = 'daniel.indias@gmail.com');
