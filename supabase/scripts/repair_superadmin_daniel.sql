-- =============================================================================
-- Repair superadmin access for daniel.indias@gmail.com
-- =============================================================================
-- Run this in Supabase SQL Editor if the superuser sees the "coming soon" page
-- instead of full app access.
--
-- This ensures the profile exists and has role='superadmin', access_granted=true.
-- If the profile was never created (e.g. signup before trigger), it inserts it.
-- =============================================================================

-- Upsert: create profile if missing, always set superadmin
INSERT INTO public.profiles (id, role, access_granted)
SELECT u.id, 'superadmin', true
FROM auth.users u
WHERE u.email = 'daniel.indias@gmail.com'
ON CONFLICT (id) DO UPDATE
SET role = 'superadmin', access_granted = true;
