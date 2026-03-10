# Update and Deployment Checklist

**Purpose**: Master list for pages to update, database migrations, verification, and other deployment tasks.

**Last Updated**: 2026-03-10

---

## 1. Pages to Update (Web)

Based on [04-pages-comparison.md](../04-reference/04-pages-comparison.md) and [09-current-vs-final-solution.md](../04-reference/09-current-vs-final-solution.md).

### 1.1 Create Flows → Conversational (Target)

| Page | Route | Current | Target | Priority |
|------|-------|---------|--------|----------|
| Affirmation create | `/sanctuary/affirmations/create/*` | Step-by-step forms | Conversational (orb/speak entry) | High |
| Meditation create | `/sanctuary/meditations/create/*` | Step-by-step forms | Conversational (orb/speak entry) | High |
| Ritual create | `/sanctuary/rituals/create/*` | Step-by-step forms | Conversational (orb/speak entry) | High |

**Notes**: Create flows exist with init → intent → context (med/rit) → personalization (rit) → script → voice → audio → review. Target is **orb/speak as primary entry**, chat-like, not static forms.

### 1.2 Home vs Sanctuary (Clarify)

| Page | Route | Issue | Action |
|------|-------|-------|--------|
| Home | `/home` | Relationship with `/sanctuary` unclear | Clarify: redirect, merge, or explicit nav |
| Sanctuary | `/sanctuary` | Same as or linked from Home | Ensure consistent entry from Home |

### 1.3 Mobile Pages to Add

| Area | Status | Notes |
|------|--------|-------|
| Content detail/edit/edit-audio | Partial | ContentDetailScreen exists; full flows? |
| Marketplace | Not built | Discovery, creator, publish |
| Dedicated onboarding | Placeholder | Profile, preferences, guide |
| Stripe checkout UI | Not built | Credits displayed; no purchase flow |

### 1.4 Other Page Updates (As Needed)

| Page | Notes |
|------|-------|
| `/sanctuary/affirmations/record` | Placeholder per routes.ts |
| Edit-audio pages | Ensure volumes, waves, preview are immersive |
| Marketplace verification flow | Phase 14.3–14.5 — later |
| Admin pages | Ensure role checks (`superadmin` / `admin`) |

---

## 2. SQL Scripts for Supabase

### 2.1 Run Migrations (Recommended: CLI)

**Preferred method**: Use Supabase CLI. Migrations are in `supabase/migrations/` and applied in order.

```bash
# Link remote project (first time only)
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations to remote database
supabase db push

# Or via npm
npm run supabase:push
```

**Local development**:

```bash
# Reset local DB (applies all migrations + seed)
supabase db reset

# Or
npm run supabase:reset
```

**Script**: `supabase/scripts/run_migrations.sh` — wrapper for `supabase db push` with optional verify.

### 2.2 Verify Database

**Location**: `supabase/scripts/verify_database.sql`

**How to run**:
1. Supabase Dashboard → SQL Editor
2. Paste contents of `verify_database.sql`
3. Run
4. Check results: all checks should show **PASS** (WARN acceptable for optional items)

**Via script** (when `DATABASE_URL` is set in `.env.local`):
```bash
npm run verify:db
```
Use the **Session pooler** connection string (port 6543) from Dashboard if direct (5432) fails with "No route to host".  
Or paste `supabase/scripts/verify_database.sql` into Supabase SQL Editor and run manually.

### 2.3 Repair Scripts (When Verification Fails)

| Script | Use Case |
|--------|----------|
| `supabase/scripts/repair_missing_schema.sql` | Missing tables/columns from early migrations; content_items, credit system, Stripe, waitlist |
| `supabase/scripts/repair_superadmin_daniel.sql` | Promote specific user to superadmin |

**⚠️ Use repair scripts only when `supabase db push` is not possible** (e.g. production DB diverged). Prefer fixing via migrations and `db push`.

---

## 3. Migration Run Script

**File**: `supabase/scripts/run_migrations.sh`

Executes:
1. Check Supabase CLI is installed
2. Optionally link project
3. Run `supabase db push`
4. Optionally run verification

---

## 4. Database Verification Script (Full)

**File**: `supabase/scripts/verify_database.sql`

**Checks**:
- Core tables: profiles, content_items, credit_transactions, subscriptions, marketplace_items, marketplace_shares, sanctuary_saves, waitlist_signups, stripe_webhook_events, user_voices, oracle_sessions, feedback
- Optional tables: user_reminders, investor_inquiries, practice_sessions, reflection_entries, content_series, content_series_items
- profiles columns: role, access_granted, elevenlabs_voice_id, stripe_customer_id, is_beta_tester
- content_items columns: audio_url, voice_url, status
- RLS on: profiles, content_items, credit_transactions
- Functions: get_credit_balance(), add_credits(), get_user_subscription(), record_share_and_award_credit(), deduct_credits()
- Storage bucket: audio (WARN if missing)

---

## 5. Other Things Needed

### 5.1 Infrastructure & Config

- [ ] **Environment variables**: `.env.local` for web; `.env` for mobile (Expo)
- [ ] **Supabase project**: Linked via `supabase link`
- [ ] **Stripe**: Test/Live keys in env; products configured
- [ ] **ElevenLabs**: API key, voice IDs
- [ ] **OpenAI**: API key for scripts/conversation

### 5.2 Pre-Launch

- [ ] **Analytics**: GA4 wired; conversion events marked
- [ ] **Cookie consent**: CookieConsentBanner; Consent Mode v2
- [ ] **PWA**: Manifest, service worker, install prompt
- [ ] **Meta tags**: OG, Twitter cards
- [ ] **Error boundaries**: Global + route-level
- [ ] **Loading states**: Skeleton, spinners
- [ ] **Empty states**: All list/detail screens

### 5.3 Security

- [ ] **RLS policies**: Verified on all tables
- [ ] **Admin routes**: Protected by `profile.role === 'superadmin'`
- [ ] **API validation**: Zod on request bodies
- [ ] **No secrets in code**: Env vars only

### 5.4 Content & Copy

- [ ] **Product copy**: Canonical text in docs/00-current-context.md
- [ ] **Legal**: Privacy, Terms, Data Deletion pages
- [ ] **Help/FAQ**: Sanctuary learn, help

### 5.5 Mobile-Specific

- [ ] **Stripe React Native**: Checkout flow
- [ ] **Audio**: Background playback, expo-av
- [ ] **Push notifications**: If reminders need them
- [ ] **App store assets**: Icons, screenshots, metadata

### 5.6 Testing & QA

- [ ] **Type-check**: `npm run type-check`
- [ ] **Build**: `npm run build:web`, `npm run build:mobile`
- [ ] **E2E**: Critical flows (auth, create, playback)
- [ ] **Lighthouse**: Web performance target

**E2E env vars (for authenticated tests in CI or local)**:

| Variable | Purpose |
|----------|---------|
| `OVERRIDE_LOGIN_EMAIL` | Test user email for override login (E2E only) |
| `OVERRIDE_LOGIN_PASSWORD` | Test user password for override login |
| `NEXT_PUBLIC_ENABLE_TEST_LOGIN` | `true` to show test login button on login page |
| `NEXT_PUBLIC_OVERRIDE_LOGIN_EMAIL` | (Optional) Client-side override email |
| `NEXT_PUBLIC_OVERRIDE_LOGIN_PASSWORD` | (Optional) Client-side override password |

Without these, protected specs skip. Add to CI secrets for full E2E coverage.

**Commands**:
- `npm run test:all` — **Run everything**: shared + mobile unit tests, then web E2E critical (desktop + mobile viewports)
- `npm run test:e2e:critical` — Web E2E smoke only (desktop + mobile viewports)
- `npm run test:e2e` — All web E2E specs
- `npm run test:e2e:desktop` — Desktop viewport only
- `npm run test:e2e:mobile` — Mobile viewports only (web in mobile browsers)

**Coverage**: Web E2E (Playwright) covers desktop + mobile viewports. Mobile app has Jest (unit tests); no native E2E yet (future: Maestro or Detox).

**Reliable local E2E**: Playwright starts the dev server automatically. On iCloud or slow disks, cold starts can exceed the 90s timeout. To avoid `ERR_CONNECTION_REFUSED`, start the server first in a separate terminal: `npm run dev:web`, then run tests. Or run with `CI=true` so Playwright always starts the server (no `reuseExistingServer`).

### 5.7 Documentation

- [ ] **Changelog**: `rebuild-roadmap/03-tracking/01-changelog.md` updated
- [ ] **Current context**: `docs/00-current-context.md` reflects production
- [ ] **Schema verification**: `rebuild-roadmap/01-planning/02-schema-verification.md`

---

## 6. Quick Reference

| Task | Command / Location |
|------|--------------------|
| Run migrations (remote) | `supabase db push` or `npm run supabase:push` |
| Reset local DB | `supabase db reset` or `npm run supabase:reset` |
| Verify database | `supabase/scripts/verify_database.sql` → SQL Editor |
| Repair schema | `supabase/scripts/repair_missing_schema.sql` |
| Type-check | `npm run type-check` |
| Build all | `npm run build:all` |
| Build web (clean) | `npm run build:web:clean` |
| **Test all** (shared + mobile + web E2E) | `npm run test:all` |
| E2E (all) | `npm run test:e2e` |
| E2E (critical smoke) | `npm run test:e2e:critical` |
| Dev web | `npm run dev:web` |
| Dev mobile | `npm run dev:mobile` |

---

---

## 7. Migration Files Reference

All migrations live in `supabase/migrations/` and are applied in filename order:

| Migration | Purpose |
|-----------|---------|
| 20260308000000_create_content_items | Base content_items, set_updated_at |
| 20260308000001_add_audio_columns | audio_url, voice_url, ambient, binaural, default_vol_* |
| 20260308000002_add_elevenlabs_voice_to_profiles | profiles.elevenlabs_voice_id |
| 20260308000003_create_investor_inquiries | investor_inquiries table |
| 20260308000004_create_user_reminders | user_reminders table |
| 20260308000005_marketplace_audio | marketplace_items, marketplace_shares |
| 20260308000006_progress_tracking | practice_sessions, reflection_entries |
| 20260308000007_create_credit_system | credit_transactions, add_credits, get_credit_balance |
| 20260308000008_user_voices_library | user_voices (IVC) |
| 20260308000008_fix_schema_gaps | (alternate) schema fixes |
| 20260308000009_fix_credit_rls | Credit RLS policies |
| 20260308000010_profiles_rls | Profiles RLS |
| 20260308000011_fix_progress_stats_security | get_streak, get_progress_stats |
| 20260309000001_atomic_credit_deduct | deduct_credits, oracle_sessions |
| 20260309000002_consolidate_schema | marketplace_shares unique, get_credit_balance |
| 20260309000004_stripe_billing | subscriptions, stripe_webhook_events |
| ... | (see directory for full list) |

---

**References**:
- [01-roadmap.md](../../rebuild-roadmap/01-planning/01-roadmap.md)
- [02-schema-verification.md](../../rebuild-roadmap/01-planning/02-schema-verification.md)
- [04-pages-comparison.md](../04-reference/04-pages-comparison.md)
- [09-current-vs-final-solution.md](../04-reference/09-current-vs-final-solution.md)
