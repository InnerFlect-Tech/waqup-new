# Admin Pages Proposal — 5 New Superadmin Pages

**Purpose**: Proposals for new superadmin-only pages that deepen understanding of how the waQup solution works, following the pattern of Creation Steps and System docs.

**Context**: Creation Steps and System docs are strong references. These 5 additions would complete a coherent internal documentation and ops suite.

---

## Summary

| Page | Path | Purpose |
|------|------|---------|
| Pipelines Reference | `/system/pipelines` | Scientific foundations, pipeline comparison, links to product docs |
| Audio & TTS Reference | `/system/audio` | ElevenLabs, TTS, voice cloning, recording flow |
| Conversation Flow | `/system/conversation` | LLM state machine, chat vs orb, handoff logic |
| Schema Live Status | `/system/schema` | Live DB schema check (tables, columns, indexes) |
| Content Overview | `/admin/content` | Content counts by type, status, recent activity |

---

## 1. Pipelines Reference — `/system/pipelines`

**Purpose**: Explain how the three content types (affirmations, meditations, rituals) differ scientifically and how their creation pipelines map to docs.

**Content** (from `docs/01-core/`):
- Pipeline comparison table (from `05-pipelines-overview.md`)
- Depth: cognitive re-patterning → state induction → identity encoding
- Links to `02-pipeline-affirmations.md`, `03-pipeline-meditations.md`, `04-pipeline-rituals.md`
- Route map per content type
- Shared Audio page explanation

**Why**: Creation Steps is implementation-focused; Pipelines Reference is product- and science-focused. Complements it.

**Design**: Same layout as System/Creation Steps — PageShell, sections, links to Creation Steps and Admin.

---

## 2. Audio & TTS Reference — `/system/audio`

**Purpose**: Technical reference for audio generation: ElevenLabs, TTS options, voice cloning, recording.

**Content** (from `docs/01-core/06-audio-generation-summary.md`):
- ElevenLabs setup (API key, voice selection)
- TTS options (ElevenLabs vs fallback)
- Voice cloning flow (Professional Voice Cloning)
- Recording flow (expo-av, user-recorded)
- Audio page spec: volumes, waveforms, preview
- Links to Oracle config for voice IDs

**Why**: Oracle page configures voices; this page explains the full audio pipeline for admins debugging or onboarding.

---

## 3. Conversation Flow — `/system/conversation`

**Purpose**: How the conversational creation flow works: state machine, chat vs orb, handoff.

**Content** (from `docs/01-core/08-llm-conversation-summary.md`):
- State machine diagram (intent → context → personalization → script → handoff)
- Chat mode flow (text input, script generation, sessionStorage handoff)
- Orb mode flow (voice input, inline script, same handoff)
- `saveCreationHandoff` and `waqup_creation_[type]` sessionStorage
- Links to `/create/conversation`, `/create/orb`, Creation Steps

**Why**: Creation Steps shows steps; this shows the flow and handoff logic. Critical for debugging creation flows.

---

## 4. Schema Live Status — `/system/schema`

**Purpose**: Live view of database schema — which tables/columns exist, alignment with migrations.

**Content**:
- Call Supabase `information_schema` (or run `verify_database.sql` logic) to list:
  - Tables: `profiles`, `content_items`, `credit_transactions`, etc.
  - Key columns per table
  - Indexes, RLS policies (if queryable)
- Pass/Fail/Warn status per expected table
- Link to `supabase/scripts/verify_database.sql` for manual run
- Last-checked timestamp

**Why**: System page has a static ER diagram. This would show live state and catch drift.

**Implementation**: Server component or API route that queries `pg_catalog`/`information_schema` with service role, or invokes a stored procedure that runs the verification script logic.

---

## 5. Content Overview — `/admin/content`

**Purpose**: Dashboard of content counts and recent activity for superadmins.

**Content**:
- Counts by type: affirmations, meditations, rituals
- Counts by status: draft vs complete
- Recent creations (last 7 days, last 30 days)
- Optional: creation mode breakdown (form vs conversation vs orb) if stored
- Empty state if no content yet

**Why**: Quick health check for platform usage; helps prioritize support or feature work.

**Implementation**: Query `content_items` with service role (or RLS if superadmin can see all). Simple aggregations.

---

## Implementation Order

1. **Pipelines Reference** — Static content from docs; no API.
2. **Audio & TTS Reference** — Static content from docs; no API.
3. **Conversation Flow** — Static content from docs; no API.
4. **Content Overview** — Needs Supabase query; straightforward.
5. **Schema Live Status** — Needs DB introspection; more involved.

---

## Access Control

All five pages:
- Wrapped in `SuperAdminGate`
- Added to `APP_ROUTES` with `section: 'Superadmin'`
- Linked from Admin dashboard and System footer
- Added to `SUPERADMIN_MENU_ITEMS` in AppLayout (optional; may overcrowd menu)
- **Not** in public `sitemap.ts`

---

## References

- `docs/01-core/02-pipeline-affirmations.md`
- `docs/01-core/03-pipeline-meditations.md`
- `docs/01-core/04-pipeline-rituals.md`
- `docs/01-core/05-pipelines-overview.md`
- `docs/01-core/06-audio-generation-summary.md`
- `docs/01-core/08-llm-conversation-summary.md`
- `packages/web/app/system/creation-steps/page.tsx` — design pattern
- `packages/web/app/system/page.tsx` — design pattern
- `rebuild-roadmap/01-planning/02-schema-verification.md`
- `supabase/scripts/verify_database.sql`
