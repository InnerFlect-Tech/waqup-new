-- =============================================================================
-- waQup Database Verification Script
-- =============================================================================
-- Run this in Supabase SQL Editor to verify your database matches the expected
-- schema from supabase/migrations/.
--
-- Expected: All checks should show 'PASS'. Any 'FAIL' needs attention.
-- =============================================================================

-- Use a temp table to collect results, then return as a single report
create temp table if not exists _verify (check_name text, status text, detail text);

truncate _verify;

-- ─── 1. Core tables exist ───────────────────────────────────────────────────
insert into _verify (check_name, status, detail)
select 'profiles table', case when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'profiles') then 'PASS' else 'FAIL' end, 'public.profiles';

insert into _verify (check_name, status, detail)
select 'content_items table', case when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'content_items') then 'PASS' else 'FAIL' end, 'public.content_items';

insert into _verify (check_name, status, detail)
select 'credit_transactions table', case when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'credit_transactions') then 'PASS' else 'FAIL' end, 'public.credit_transactions';

insert into _verify (check_name, status, detail)
select 'subscriptions table', case when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'subscriptions') then 'PASS' else 'FAIL' end, 'public.subscriptions';

insert into _verify (check_name, status, detail)
select 'marketplace_items table', case when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'marketplace_items') then 'PASS' else 'FAIL' end, 'public.marketplace_items';

insert into _verify (check_name, status, detail)
select 'marketplace_shares table', case when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'marketplace_shares') then 'PASS' else 'FAIL' end, 'public.marketplace_shares';

insert into _verify (check_name, status, detail)
select 'sanctuary_saves table', case when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'sanctuary_saves') then 'PASS' else 'FAIL' end, 'public.sanctuary_saves';

insert into _verify (check_name, status, detail)
select 'waitlist_signups table', case when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'waitlist_signups') then 'PASS' else 'FAIL' end, 'public.waitlist_signups';

insert into _verify (check_name, status, detail)
select 'stripe_webhook_events table', case when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'stripe_webhook_events') then 'PASS' else 'FAIL' end, 'public.stripe_webhook_events';

insert into _verify (check_name, status, detail)
select 'user_voices table', case when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'user_voices') then 'PASS' else 'FAIL' end, 'public.user_voices';

insert into _verify (check_name, status, detail)
select 'oracle_sessions table', case when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'oracle_sessions') then 'PASS' else 'FAIL' end, 'Conversation/oracle session tracking';

insert into _verify (check_name, status, detail)
select 'feedback table', case when exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'feedback') then 'PASS' else 'FAIL' end, 'User feedback from Help page';

-- ─── 2. profiles: role and access_granted columns (required for superadmin) ───
insert into _verify (check_name, status, detail)
select 'profiles.role column',
  case when exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'role') then 'PASS' else 'FAIL' end,
  'Required for useSuperAdmin / superadmin access';

insert into _verify (check_name, status, detail)
select 'profiles.access_granted column',
  case when exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'access_granted') then 'PASS' else 'FAIL' end,
  'Required for access control';

insert into _verify (check_name, status, detail)
select 'profiles.elevenlabs_voice_id column',
  case when exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'elevenlabs_voice_id') then 'PASS' else 'FAIL' end,
  'Required for voice cloning';

insert into _verify (check_name, status, detail)
select 'profiles.stripe_customer_id column',
  case when exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'stripe_customer_id') then 'PASS' else 'FAIL' end,
  'Required for Stripe billing';

insert into _verify (check_name, status, detail)
select 'profiles.is_beta_tester column',
  case when exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'is_beta_tester') then 'PASS' else 'FAIL' end,
  'Beta user flag for feedback prioritisation';

-- ─── 3. content_items: expected columns ───────────────────────────────────
insert into _verify (check_name, status, detail)
select 'content_items.audio_url', case when exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'content_items' and column_name = 'audio_url') then 'PASS' else 'FAIL' end, null;

insert into _verify (check_name, status, detail)
select 'content_items.voice_url', case when exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'content_items' and column_name = 'voice_url') then 'PASS' else 'FAIL' end, null;

insert into _verify (check_name, status, detail)
select 'content_items.status column', case when exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'content_items' and column_name = 'status') then 'PASS' else 'FAIL' end, 'Expects draft|processing|ready|failed|complete';

-- ─── 4. RLS enabled on critical tables ─────────────────────────────────────
insert into _verify (check_name, status, detail)
select 'RLS on profiles', case when (select c.relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'profiles') then 'PASS' else 'FAIL' end, null;

insert into _verify (check_name, status, detail)
select 'RLS on content_items', case when (select c.relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'content_items') then 'PASS' else 'FAIL' end, null;

insert into _verify (check_name, status, detail)
select 'RLS on credit_transactions', case when (select c.relrowsecurity from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relname = 'credit_transactions') then 'PASS' else 'FAIL' end, null;

-- ─── 5. Required functions exist ──────────────────────────────────────────
insert into _verify (check_name, status, detail)
select 'get_credit_balance()', case when exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'get_credit_balance') then 'PASS' else 'FAIL' end, 'Used by credits API';

insert into _verify (check_name, status, detail)
select 'add_credits()', case when exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'add_credits') then 'PASS' else 'FAIL' end, 'Used for credit grants';

insert into _verify (check_name, status, detail)
select 'get_user_subscription()', case when exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'get_user_subscription') then 'PASS' else 'FAIL' end, 'Used by Stripe/billing';

insert into _verify (check_name, status, detail)
select 'record_share_and_award_credit()', case when exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'record_share_and_award_credit') then 'PASS' else 'FAIL' end, 'Used by marketplace shares';

insert into _verify (check_name, status, detail)
select 'deduct_credits()', case when exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'deduct_credits') then 'PASS' else 'FAIL' end, 'Used for credit deductions';

-- ─── 6. Storage: audio bucket (Supabase projects include storage by default) ──
insert into _verify (check_name, status, detail)
select 'Storage bucket: audio', case when exists (select 1 from storage.buckets where name = 'audio') then 'PASS' else 'WARN' end, 'Create via Dashboard if missing';

-- ─── 7. Summary ────────────────────────────────────────────────────────────
select
  check_name as "Check",
  status as "Status",
  detail as "Detail"
from _verify
order by
  case when status = 'FAIL' then 0 when status = 'WARN' then 1 else 2 end,
  check_name;
