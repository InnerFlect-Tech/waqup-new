-- Migration: Tighten profiles INSERT policy
-- The "Service role can insert profiles" policy used with check (true), allowing
-- any authenticated user to insert arbitrary profile rows (including for other users).
-- Drop it; "Users can insert own profile" (auth.uid() = id) from 20260308000010
-- already exists and properly restricts inserts to own profile.
-- Service role (Supabase service_role key) bypasses RLS and does not need a policy.

drop policy if exists "Service role can insert profiles" on public.profiles;
