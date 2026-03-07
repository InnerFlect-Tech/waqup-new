# Schema Verification

**Purpose**: In-repo reference for database tables used by the rebuild. Full schema, RLS, and migrations live in the main project.

**In-repo reference**: Schema defined here. Extend as needed for new tables.

**Last updated**: 2026-02-16

---

## Tables used by the app

| Table | Status | Notes |
|-------|--------|-------|
| **profiles** | ✅ Exists | User profile (same DB as web app) |
| **content_items** | ✅ Verify in DB | Unified content (affirmations, meditations, rituals). Fields: content_type, script, audio_url, etc. |
| **credit_transactions** | ⏳ May need creation | Phase 10 – credits tracking |
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
