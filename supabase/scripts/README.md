# Supabase Scripts

Utility scripts for database management.

## `verify_database.sql`

Verifies your Supabase database matches the schema defined in `supabase/migrations/`.

**How to run**: Supabase Dashboard → SQL Editor → copy/paste and Run

**Output**: A table of checks (PASS / FAIL / WARN). All FAIL items need attention.

## `repair_missing_schema.sql`

Repairs missing tables, columns, and functions identified by `verify_database.sql`.

**How to run**: Supabase Dashboard → SQL Editor → copy/paste and Run

**When to use**: After running `verify_database.sql` and seeing FAILs for:
- `deduct_credits()`, `oracle_sessions`, `get_user_subscription()`, `subscriptions`, `stripe_webhook_events`, `profiles.stripe_customer_id`, `waitlist_signups`

Re-run `verify_database.sql` afterward to confirm all checks pass.

See `rebuild-roadmap/01-planning/02-schema-verification.md` for detailed instructions.
