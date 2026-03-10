# Schema Verification

**Purpose**: In-repo reference for database tables used by the rebuild.

**Canonical schema source**: `supabase/migrations/` — all schema changes must be versioned there. Deploy with `supabase db push`. Local and production stay in sync via the same migration files.

**Last updated**: 2026-03-09

---

## Verifying Your Database

To confirm your Supabase database matches the expected schema:

### 1. Run the verification script

1. Open **Supabase Dashboard** → your project → **SQL Editor**
2. Copy the contents of `supabase/scripts/verify_database.sql`
3. Paste and **Run**

### 2. Run via npm (after linking)

```bash
npm run supabase:push    # Apply migrations to remote
npm run supabase:migrate # Same via run_migrations.sh wrapper
```

### 3. Interpret results

| Status | Meaning |
|--------|---------|
| **PASS** | Check succeeded |
| **FAIL** | Fix required — apply missing migrations or run repair SQL |
| **WARN** | Optional/recommended; non-blocking |

All **FAIL** items must be resolved. Common fixes:

- **Missing tables/columns** → Run `supabase db push` or apply migrations manually
- **profiles.role / access_granted missing** → See `supabase/migrations/20260310000002_add_role_to_profiles.sql` and `20260310000004_add_access_granted_to_profiles.sql` (or use the combined SQL from the superadmin promotion instructions)

### 4. Sync migrations (recommended)

If the verification shows failures, sync your database with the migrations:

```bash
supabase db push
```

Or link your remote project first: `supabase link --project-ref <your-project-ref>`

---

## Tables used by the app

| Table | Status | Notes |
|-------|--------|-------|
| **profiles** | ✅ Exists | User profile (role, access_granted, is_beta_tester) |
| **content_items** | ✅ Verify in DB | Unified content (affirmations, meditations, rituals). Fields: content_type, script, audio_url, etc. |
| **feedback** | ✅ Exists | User feedback from Help page (syncs to ClickUp) |
| **credit_transactions** | ✅ Exists | Phase 10 – credits tracking (from 20260308000007_create_credit_system.sql) |
| **conversations** | ⏳ May need creation | Phase 9 – conversational creation state (see 03-conversational-system) |

### Content types

- `content_type` enum or equivalent: `affirmation` | `meditation` | `ritual`

### Phase 14 (Marketplace) – future

| Table / concept | Status | Notes |
|-----------------|--------|-------|
| content_items.marketplace_enabled | To add | Boolean |
| content_items.verified | To add | Boolean |
| content_items.price | To add | Decimal |
| marketplace_items | To create | Marketplace listing |
| marketplace_purchases | To create | Purchases |
| creator_profiles | To create | Creator dashboard |
| marketplace_analytics | To create | Analytics |

---

## Coherence checklist

- [ ] Verify `content_items` structure and RLS in Supabase
- [ ] Verify `profiles` and auth integration
- [ ] Create or verify `credit_transactions` when implementing Phase 10
- [ ] Create or verify `conversations` when implementing Phase 9
- [ ] When starting Phase 14, add marketplace tables and RLS per Phase 14 analysis

---

## Reference

- **Phase 7**: API integration – content_items, profiles
- **Phase 9**: AI/conversation – conversations table
- **Phase 10**: Credits – credit_transactions
- **Phase 14**: Marketplace – marketplace_* tables
