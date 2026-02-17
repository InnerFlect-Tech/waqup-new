# Pages comparison: what is / what needs to be / comparison

**Purpose**: Single source of truth for which pages exist, which are missing, and which need to be changed. Three columns: **What is** (current app), **What needs to be** (docs/roadmap), **Comparison** (gap or status).

**References**: Roadmap `rebuild-roadmap/01-planning/01-roadmap.md`, phases `rebuild-roadmap/02-phases/*`; main product docs `../../docs/internal/` (flows, conversational-system, voice-interaction-design, marketplace-platform); current app `packages/web/app/` and `/pages`.

---

## Auth

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| `/login` | Login (Step 3.1) | Exists |
| `/signup` | Signup with email verification | Exists |
| `/forgot-password` | Forgot password | Exists |
| `/reset-password` | Reset password (reset flow) | Exists |
| `/confirm-email` | Confirm email (verification) | Exists |
| `/auth/beta-signup` | Beta signup variant | Exists |

---

## Landing & marketing

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| `/` | Homepage / landing | Exists |
| `/how-it-works` | How it works | Exists |
| `/pricing` | Pricing | Exists |

---

## Onboarding

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| `/onboarding` | Onboarding / setup (Step 2.4) | Exists |
| `/onboarding/profile`, `preferences`, `guide` | Extended onboarding | Exists |

---

## Main app (core)

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| `/home` | Home / Sanctuary (roadmap: "Home (Sanctuary)") | Exists — clarify relationship with `/sanctuary` |
| `/sanctuary` | Sanctuary home (same as or linked from Home) | Exists — clarify relationship with `/home` |
| `/library` | Library (filters, search, empty state) | Exists |
| `/create` | Create — entry with three options (Affirmation, Meditation, Ritual) | Exists |
| `/profile` | Profile — user info, settings list, logout | Exists — unified settings cards; theme selector collapsible so it does not overlap content |

---

## Sanctuary (settings & learning)

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| `/sanctuary/settings` | Settings | Exists |
| `/sanctuary/credits` | Credits (Phase 10, value economy) | Exists |
| `/sanctuary/progress` | Progress | Exists |
| `/sanctuary/referral` | Referral | Exists |
| `/sanctuary/reminders` | Reminders / notifications | Exists |
| `/sanctuary/learn` | Learn / help | Exists |

---

## Affirmations

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| `/sanctuary/affirmations` | Affirmations list | Exists |
| — | Affirmation detail (Phase 5.2: audio, Play, Edit, Delete, Share) | **Missing** — add `/sanctuary/affirmations/[id]` |
| — | Affirmation edit | **Missing** — add `/sanctuary/affirmations/[id]/edit` |
| `/sanctuary/affirmations/create` | Affirmation creation — **conversational** (Intent, Script, Voice, Review), chat-like, not static forms | **To change** — make conversational (orb/speak) |
| `/sanctuary/affirmations/record` | Record step | Exists |
| — | Edit sound/script in pipeline (cool edit-audio step) | **Missing** — add e.g. `/sanctuary/affirmations/[id]/edit-audio` |

---

## Rituals

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| `/sanctuary/rituals` | Rituals list | Exists |
| `/sanctuary/rituals/[id]` | Ritual detail (Phase 5.2) | Exists |
| `/sanctuary/rituals/[id]/edit` | Ritual edit | Exists |
| `/sanctuary/rituals/create` | Ritual creation — **conversational** (Intent, Context, Personalization, Script, Voice, Review) | **To change** — make conversational (orb/speak) |
| `/sanctuary/rituals/recordings` | Recordings list | Exists |
| — | Edit sound/script in pipeline | **Missing** — add e.g. `/sanctuary/rituals/[id]/edit-audio` |

---

## Meditations

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| — | Meditations list | **Missing** — add `/sanctuary/meditations` |
| — | Meditation detail (Phase 5.2) | **Missing** — add `/sanctuary/meditations/[id]` |
| — | Meditation edit | **Missing** — add `/sanctuary/meditations/[id]/edit` |
| `/sanctuary/meditations/create` | Meditation creation — **conversational** (Intent, Context, Script, Voice, Review) | **To change** — make conversational (orb/speak) |
| — | Edit sound/script in pipeline | **Missing** — add e.g. `/sanctuary/meditations/[id]/edit-audio` |

---

## Voice & conversation (speak / orb)

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| — | **Orb that speaks** — voice-first conversation UI (voice-interaction-design.md, Phase 9) | **Missing** — add e.g. `/speak` or global orb + conversation mode |
| — | Conversation UI — chat-like interface, state machine, context gathering (03-conversational-system.md) | **Missing** — add e.g. `/create/conversation` or integrate into create flows |
| SpeakingAnimation (visual orbs) | Visual for “speaking”; not the conversational entry point | Exists as component only — need full speak/conversation experience |

---

## Marketplace (Phase 14)

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| — | Marketplace discovery — browse, search, filter (Phase 14.1) | **Missing** — add `/marketplace` |
| — | Creator dashboard — publish, pricing, analytics (Phase 14.2) | **Missing** — add e.g. `/marketplace/creator` |
| — | Verification flow, viral/share, revenue (Phase 14.3–14.5) | **Missing** — later |

---

## Utility / dev

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| `/showcase` | Design system & UI components (elements) | Exists |
| `/pages` | All-pages index for dev/testing | Exists |
| `/sitemap-view` | Human-readable sitemap | Exists |

---

## Summary

| Category | What is | What needs to be | Comparison |
|----------|---------|------------------|------------|
| **Speak / orb** | No route | Orb that speaks, conversation UI | Create `/speak` or global + conversation |
| **Marketplace** | No route | Discovery, creator, verification | Create `/marketplace` (and creator, etc.) |
| **Three pipelines** | Create entry points + placeholder steps | **Conversational** creation (no static forms) | Change: make creation conversational (orb/speak) |
| **Edit sound in pipelines** | No step/screen | Dedicated edit script/voice/audio in pipeline | Create edit-audio step or page per type |
| **Meditations** | Create only | List + detail + edit + conversational create | Create list, detail, edit; change create to conversational |
| **Affirmations** | List, create, record | + detail + edit + conversational create + edit-audio | Create detail, edit, edit-audio; change create to conversational |
| **Home vs Sanctuary** | `/home` and `/sanctuary` both exist | Roadmap: "Home (Sanctuary)" | Clarify: merge or define distinct roles |

---

**Last updated**: 2026-02-17  
**Status**: Comparison complete; decisions pending.
