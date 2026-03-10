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

## `seed_daniel_indias.sql`

Seeds example data for `daniel.indias@gmail.com`: content items (affirmations, meditations, rituals), 500 Qs, practice sessions, and reflection entries. Lets you see the full app experience (Library, Sanctuary, Progress, Qs balance).

**Prerequisite**: The account must exist — sign up with that email first.

**How to run**: Supabase Dashboard → SQL Editor → copy/paste `seed_daniel_indias.sql` and Run

**Alternative (dev)**: Superadmin can seed via API while the dev server is running:
```bash
curl -X POST "http://localhost:3000/api/dev/seed?email=daniel.indias@gmail.com" -H "Cookie: <your-session-cookie>"
```
Or from the browser console while logged in as superadmin:
```js
fetch('/api/dev/seed?email=daniel.indias@gmail.com', { method: 'POST', credentials: 'include' }).then(r => r.json()).then(console.log)
```
