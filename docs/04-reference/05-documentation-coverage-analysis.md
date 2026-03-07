# Documentation Coverage Analysis

**Purpose**: Single source of truth for what is documented in-repo vs referenced externally, and what is missing. Ensures we have full coverage of **architecture**, **LLM communication system**, **each pipeline**, **each page**, and **marketplace**.

**Last updated**: 2026-02-16

---

## 1. Where the docs live

### In this repo (`waqup-new`)

| Area | Location | Status |
|------|----------|--------|
| **Architecture (app)** | `docs/02-mobile/02-architecture.md` | ✅ In-repo: layers, data flow, Supabase/OpenAI/ElevenLabs/Stripe |
| **Tech stack** | `docs/02-mobile/01-technology-stack.md` | ✅ In-repo: OpenAI, ElevenLabs, Expo, Stripe, etc. |
| **Implementation** | `docs/02-mobile/03-implementation.md` | ✅ In-repo: patterns, gotchas |
| **Multi-platform** | `docs/03-platforms/01-multi-platform-strategy.md` | ✅ In-repo: Mobile + Web, quality bar |
| **Browser** | `docs/03-platforms/02-browser-optimization-strategy.md` | ✅ In-repo: Chrome-first |
| **Pages (SSOT)** | `docs/04-reference/04-pages-comparison.md` | ✅ In-repo: what exists vs what’s needed |
| **Roadmap** | `rebuild-roadmap/01-planning/01-roadmap.md` | ✅ In-repo: phases, steps, UI checkpoints |
| **Phase analyses** | `rebuild-roadmap/02-phases/*.md` | ✅ In-repo: NOW/AFTER, schema notes, tasks |
| **Core product index** | `docs/01-core/README.md` | ✅ In-repo: external refs + pipeline/summary docs (02–08) |

### Referenced only (main waQup project, outside this repo)

**All docs**: This repo only — `docs/` and `rebuild-roadmap/`.

| Doc | Covers | In-repo equivalent? |
|-----|--------|----------------------|
| **01-product-constitution.md** | Identity, three content types, voice-first | No — reference only |
| **02-scientific-foundations.md** | Neuroplasticity, voice, research | No |
| **03-conversational-system.md** | **Conversation flows, state machine, content types** | ✅ Summary: `docs/01-core/08-llm-conversation-summary.md` |
| **04-ai-voice-ethics.md** | AI voice, ethics, privacy | No |
| **05-system-architecture.md** | **Full system architecture, APIs, infra** | Partial — mobile arch in `02-architecture.md` |
| **06-value-economy.md** | Credits, tokens, pricing | No |
| **07-roadmap.md** | Product roadmap | Rebuild roadmap is in-repo |
| **database.md** | **Schema, tables, RLS** | ✅ Reference: `rebuild-roadmap/01-planning/02-schema-verification.md` |
| **flows.md** | **User flows, ritual/affirmation flows** | ✅ Pipelines: `docs/01-core/02-04-pipeline-*.md`, `05-pipelines-overview.md` |
| **system-spec.md** | Technical specs | No |
| **system-audit.md** | Implementation status | Changelog in-repo |
| **audio-generation.md** | Voice cloning, TTS, ElevenLabs | ✅ Summary: `docs/01-core/06-audio-generation-summary.md` (incl. Audio page) |
| **marketplace-platform.md** | **Marketplace features, viral, verification** | ✅ Summary: `docs/01-core/07-marketplace-summary.md` |
| **voice-interaction-design.md** | **Orb, voice-first UI** | No |

---

## 2. Architecture

### What we have in-repo

- **`docs/02-mobile/02-architecture.md`**
  - App layers: Presentation, State (Zustand + React Query), Service, Navigation
  - Data flow: content creation, audio playback
  - Integration: Supabase (DB, Auth, Storage, Realtime), OpenAI, ElevenLabs, Stripe
  - Security, performance targets
  - Architecture details in `docs/02-mobile/02-architecture.md`

### Gaps

- **Full system architecture** (backend services, APIs, infra, envs) is only in external `05-system-architecture.md`. If this repo is used without the main project, that context is missing.
- **Web app architecture** (Next.js layout, API routes, server vs client) is not described in a dedicated doc; it’s implied by `packages/web/` and phase/roadmap steps.

### Recommendation

- Keep using `02-architecture.md` as the in-repo app architecture.
- Optionally add a short **`docs/04-reference/06-web-architecture.md`** (or section in ORGANIZATION) describing: App Router layout, auth flow, API route usage, and pointer to `05-system-architecture.md` for full system.

---

## 3. LLM communication system

### What we have in-repo

- **Phase 9** (`rebuild-roadmap/02-phases/09-phase-09-ai-integration.md`):
  - Goals: OpenAI for scripts + TTS, **conversational content creation**
  - Tasks: conversation UI, **conversation state machine**, steps per content type, context gathering, history, “Connect to OpenAI for conversational responses”
  - References: `03-conversational-system.md`, `02-scientific-foundations.md`, `audio-generation.md`
- **Roadmap** (Phase 9): same high-level conversation flow and state machine.
- **.cursorrules**: “Conversation over forms”, “state machine”, “chat-like interface”, “context-aware”.

### What we do not have in-repo

- **State machine definition**: states, transitions, and which content type each state belongs to.
- **Message/API contract**: user message format, assistant message format, tool calls if any, and how they map to “Intent / Context / Script / Voice / Review”.
- **Prompt strategy**: system prompts, content-type-specific prompts, and where they live (e.g. which repo or folder).
- **Orchestration**: whether the LLM is called from the client, from Next.js API routes, or from another backend — and how conversation state is stored (e.g. `conversations` table).

Summary in `docs/01-core/08-llm-conversation-summary.md`.

### Recommendation

- **Option A (preferred)**: Copy or mirror the relevant parts of `03-conversational-system.md` (and related flows) into this repo, e.g. **`docs/01-core/02-conversational-system-spec.md`** (or under `docs/04-reference/`), so the rebuild has a self-contained LLM/conversation spec.
- **Option B**: Add **`docs/04-reference/07-llm-conversation-summary.md`** that summarizes: state machine (list of states/transitions), message contract, where prompts live, and “docs/01-core/08-llm-conversation-summary.md”.

---

## 4. Pipelines (creation flows) and pages per content type

### Pipeline steps (in-repo since 2026-02-16)

| Content type | Steps | Conversational? |
|--------------|-------|-----------------|
| **Affirmation** | Intent → Script → Voice → **Audio** → Review | Yes |
| **Meditation** | Intent → Context → Script → Voice → **Audio** → Review | Yes |
| **Ritual** | Intent → Context → Personalization → Script → Voice → **Audio** → Review | Yes |

All pipelines share the **Audio page** step (volumes, waves, preview).

Edit-audio routes lead to the same Audio page for re-customization.

### What we have in-repo

- **Pipeline specs**: `docs/01-core/02-pipeline-affirmations.md`, `03-pipeline-meditations.md`, `04-pipeline-rituals.md`, `05-pipelines-overview.md` — exact steps, inputs/outputs, LLM/TTS per step, routes.
- **Pages**: **`docs/04-reference/04-pages-comparison.md`** is the SSOT.

### Legacy (superseded by in-repo pipeline docs)

- **Detailed pipeline spec**: For each content type, a doc that defines:
  - Exact steps and order
  - Inputs/outputs per step (e.g. “Intent” = one string? structured?)
  - Which step calls the LLM and for what (script generation, clarification, etc.)
  - Where TTS/voice fits (which step, which service)
- **flows.md** (external) is the canonical place for “ritual creation flow”, “affirmation flow”, etc., but not in this repo.

### Recommendation

- Add **`docs/04-reference/08-creation-pipelines.md`** (or `docs/01-core/03-creation-pipelines.md`) that, for each type:
  - Lists steps in order and whether each is conversational or form.
  - Maps steps to routes (e.g. `/create/conversation`, then type-specific steps).
  - References “docs/01-core/02-05 (pipelines)” and “conversation spec: 03-conversational-system”.
- Keep **04-pages-comparison.md** as the SSOT for which pages exist and which are missing (including edit-audio and meditations list/detail/edit).

---

## 5. Pages (summary)

**SSOT**: `docs/04-reference/04-pages-comparison.md`.
**Current vs Final**: `docs/04-reference/09-current-vs-final-solution.md`.

**Web (current)**:
- **Auth, landing, onboarding, main app, sanctuary**: All exist.
- **Affirmations**: List, create (init+steps), `[id]`, edit, edit-audio, record exist; create **to change** to conversational.
- **Rituals**: List, `[id]`, edit, create (init, goals), edit-audio, recordings exist; create **to change** to conversational.
- **Meditations**: List, create (init), `[id]`, edit, edit-audio exist; create **to change** to conversational.
- **Voice/speak**: `/speak` (orb) and `/create/conversation` exist.
- **Marketplace**: `/marketplace`, `/marketplace/creator` exist; verification/viral/revenue later.
- **Home vs Sanctuary**: Both exist; home links to sanctuary.

**Mobile (current)**: Auth, setup, main tabs (Home, Library, Create, Profile) only. No Sanctuary, content CRUD, speak, marketplace.

---

## 6. Marketplace

### What we have in-repo

- **Phase 14** (`rebuild-roadmap/02-phases/14-phase-14-marketplace-platform.md`):
  - Steps: 14.1 Foundation (discovery, search, filters), 14.2 Creator tools, 14.3 Verification, 14.4 Viral distribution, 14.5 Revenue.
  - Schema notes: marketplace_items, marketplace_purchases, creator_profiles, marketplace fields on content_items.
  - References: `marketplace-platform.md`, `06-value-economy.md`.
- **04-pages-comparison.md**: Marketplace section lists missing routes and Phase 14.

### What we do not have in-repo

- **Product/feature spec**: See `docs/01-core/07-marketplace-summary.md` for discovery, creator tools, verification, viral, revenue.
- **Schema**: `02-schema-verification.md` exists; Phase 14 marketplace tables noted.

### Recommendation

- Marketplace summary in `docs/01-core/07-marketplace-summary.md`. Link from Phase 14 if needed.
- Schema doc already includes Phase 14 marketplace tables.

---

## 7. Schema and database

### Current status

- **`rebuild-roadmap/01-planning/02-schema-verification.md`** is **referenced** in:
  - `rebuild-roadmap/01-planning/01-roadmap.md`
  - `rebuild-roadmap/README.md`
  - Phase 7, Phase 1, changelog
- **File exists** ✅ (02-schema-verification.md in 01-planning/)


### Recommendation

- Keep schema doc updated for Phase 7, 9, 10, 14. Verify content_items and RLS. Schema doc includes:
  - List of tables used by the app (e.g. content_items, profiles, credit_transactions, conversations).
  - For each: status (exists / to create), key columns.
  - Marketplace-related tables from Phase 14.
  - Short “RLS and migrations” section with pointer to main project.

---

## 8. Checklist: “Do we have everything?”

| Topic | In-repo doc | External reference | Status |
|-------|-------------|--------------------|--------|
| **Architecture (app)** | ✅ `02-mobile/02-architecture.md` | `05-system-architecture.md` | Covered |
| **Architecture (full system)** | — | `05-system-architecture.md` | OK if main repo accessible |
| **LLM / conversation** | ✅ `01-core/08-llm-conversation-summary.md` | `03-conversational-system.md` | Covered |
| **Pipelines (per type)** | ✅ `01-core/02-04-pipeline-*.md`, `05-pipelines-overview.md` | `flows.md` | Covered |
| **Pages** | ✅ `04-pages-comparison.md` | — | SSOT |
| **Marketplace** | ✅ `01-core/07-marketplace-summary.md` | `marketplace-platform.md` | Covered |
| **Audio** | ✅ `01-core/06-audio-generation-summary.md` | `audio-generation.md` | Covered (incl. Audio page) |
| **Schema/DB** | ✅ `02-schema-verification.md` | `database.md` | Covered |
| **Tech stack** | ✅ `02-mobile/01-technology-stack.md` | — | — |
| **Multi-platform** | ✅ `03-platforms/01-multi-platform-strategy.md` | — | — |

---

## 9. Status (updated 2026-02-16)

All core coverage items are now in-repo:

- **Pipelines**: `docs/01-core/02-05-*.md` (affirmations, meditations, rituals, overview)
- **Audio**: `docs/01-core/06-audio-generation-summary.md` (TTS, recording, Audio page)
- **Marketplace**: `docs/01-core/07-marketplace-summary.md`
- **LLM**: `docs/01-core/08-llm-conversation-summary.md`
- **Schema**: `rebuild-roadmap/01-planning/02-schema-verification.md`

Optional: `docs/04-reference/06-web-architecture.md` for Next.js layout — not yet created.

---

**References**

- Pages: `docs/04-reference/04-pages-comparison.md`
- Roadmap: `rebuild-roadmap/01-planning/01-roadmap.md`
- Phase 4/5/9/14: `rebuild-roadmap/02-phases/04-*.md`, `05-*.md`, `09-*.md`, `14-*.md`
- Core product index: `docs/01-core/README.md`
- Organization: `docs/ORGANIZATION.md`
