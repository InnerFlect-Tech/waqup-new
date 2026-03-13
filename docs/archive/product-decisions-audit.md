# Product Decisions (Audit Resolved)

**Date**: 2026-03-10  
**Context**: Functional reality audit questions — resolved with coherent defaults.

---

## 1. Orb tables (Speak/Orb feature)

**Question**: Is Speak/Orb live? Were orb_config, user_orb_settings, user_profiles created manually? Should we add a migration?

**Decision**: **Speak/Orb is a live feature** (speak page, api/orb/config, api/orb/chat exist and are used). Migration added: `20260328000001_orb_tables.sql` creates orb_config, user_orb_settings, user_profiles. Run `supabase db push` to apply.

---

## 2. creator_proposals

**Question**: Is the creator proposal form live? Should we add a migration?

**Decision**: **Yes — CreatorGate shows proposal form** when user hasn’t unlocked Creator Marketplace. Migration added: `20260328000002_creator_proposals.sql`.

---

## 3. verify_database.sql

**Question**: Can you run it and share FAIL results?

**Decision**: Script cannot be run from this environment (no DB access). **Updated** `verify_database.sql` to check orb_config, user_orb_settings, user_profiles, creator_proposals. Run in Supabase SQL Editor → all checks should PASS after `supabase db push`.

---

## 4. Conversations table

**Question**: Persist conversation history or keep stateless?

**Decision**: **Keep stateless**. Messages sent in request body; no persistence needed. `conversations` table not used. Oracle uses `oracle_sessions` for reply counting only.

---

## 5. Mobile role step

**Question**: Is 4-step (no role) mobile onboarding intentional?

**Decision**: **Yes — intentional**. Mobile has 4 steps: profile → preferences → intention → guide. Web has 5 (includes role). Role is web-only for now; mobile can add later if needed.

---

## Applying migrations

```bash
# Option A: Remote (linked project)
supabase link --project-ref <your-project-ref>
supabase db push

# Option B: Local (Docker required)
supabase start
supabase db reset   # applies all migrations to local DB
```

After applying, run `supabase/scripts/verify_database.sql` in **Supabase SQL Editor** (Dashboard → SQL Editor). All checks should show `PASS`.
