# Pages comparison: what is / what needs to be / comparison

**Purpose**: Single source of truth for which pages exist, which are missing, and which need to be changed.

**Platforms**: **Web** (Next.js) and **Mobile** (Expo/React Native). Web has full route coverage; Mobile has basic auth + main tabs only.

**References**: Roadmap `rebuild-roadmap/01-planning/01-roadmap.md`, phases `rebuild-roadmap/02-phases/*`; **Current vs Final**: [09-current-vs-final-solution.md](./09-current-vs-final-solution.md).

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
| `/profile` | Profile — user info, settings list, logout | Exists |

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
| `/sanctuary/affirmations` | Affirmations list | Exists (full UI) |
| `/sanctuary/affirmations/[id]` | Affirmation detail (Phase 5.2: audio, Play, Edit, Delete, Share) | Exists (full UI) |
| `/sanctuary/affirmations/[id]/edit` | Affirmation edit | Exists (full UI) |
| `/sanctuary/affirmations/create` | Affirmation creation — **conversational** (Intent, Script, Voice, Review), chat-like, not static forms | **To change** — make conversational (orb/speak) |
| `/sanctuary/affirmations/record` | Record step | Exists |
| `/sanctuary/affirmations/[id]/edit-audio` | **Audio page** (edit-audio): volumes, waves, preview — must be cool (immersive, tactile, modern) | Exists (full UI) |

---

## Rituals

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| `/sanctuary/rituals` | Rituals list | Exists (full UI) |
| `/sanctuary/rituals/[id]` | Ritual detail (Phase 5.2) | Exists (full UI) |
| `/sanctuary/rituals/[id]/edit` | Ritual edit | Exists (full UI) |
| `/sanctuary/rituals/create` | Ritual creation — **conversational** (Intent, Context, Personalization, Script, Voice, Review) | **To change** — make conversational (orb/speak) |
| `/sanctuary/rituals/recordings` | Recordings list | Exists |
| `/sanctuary/rituals/[id]/edit-audio` | **Audio page** (edit-audio): volumes, waves, preview | Exists (full UI) |

---

## Meditations

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| `/sanctuary/meditations` | Meditations list | Exists (full UI) |
| `/sanctuary/meditations/[id]` | Meditation detail (Phase 5.2) | Exists (full UI) |
| `/sanctuary/meditations/[id]/edit` | Meditation edit | Exists (full UI) |
| `/sanctuary/meditations/create` | Meditation creation — **conversational** (Intent, Context, Script, Voice, Review) | **To change** — make conversational (orb/speak) |
| `/sanctuary/meditations/[id]/edit-audio` | **Audio page** (edit-audio): volumes, waves, preview | Exists (full UI) |

---

## Voice & conversation (speak / orb)

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| `/speak` | **Orb that speaks** — voice-first conversation UI (voice-interaction-design.md, Phase 9) | Exists (full UI) |
| `/create/conversation` | Conversation UI — chat-like interface, state machine, context gathering (03-conversational-system.md) | Exists (full UI) |
| SpeakingAnimation (visual orbs) | Visual for “speaking”; not the conversational entry point | Exists as component; used in /speak and content detail |

---

## Marketplace (Phase 14)

| What is (current) | What needs to be (docs/roadmap) | Comparison |
|-------------------|---------------------------------|------------|
| `/marketplace` | Marketplace discovery — browse, search, filter (Phase 14.1) | Exists (full UI) |
| `/marketplace/creator` | Creator dashboard — publish, pricing, analytics (Phase 14.2) | Exists (full UI) |
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

| Category | Web | Mobile | Final target |
|----------|-----|--------|--------------|
| **Speak / orb** | ✅ `/speak`, `/create/conversation` | ❌ | Orb that speaks, conversation UI |
| **Marketplace** | ✅ discovery, creator | ❌ | Discovery, creator, verification |
| **Three pipelines** | Create steps exist (forms) | ❌ | **Conversational** creation (orb/speak) |
| **Audio page (edit-audio)** | ✅ All three edit-audio | ❌ | Volumes, waves, preview |
| **Affirmations** | ✅ List + detail + edit + edit-audio + create | ❌ | + conversational create |
| **Meditations** | ✅ List + detail + edit + edit-audio + create | ❌ | Same |
| **Rituals** | ✅ List + detail + edit + edit-audio + create + recordings | ❌ | Same |
| **Home vs Sanctuary** | `/home` → `/sanctuary`; both exist | Home only | Home links to Sanctuary hub |

**To change**: Create flows → conversational (orb/speak entry). Mobile needs all content/sanctuary/marketplace pages.

---

**Note**: Edit-audio routes = **Audio page** — volumes, waves, effects. See [02-pipeline-affirmations.md](../01-core/02-pipeline-affirmations.md) and [06-audio-generation-summary.md](../01-core/06-audio-generation-summary.md).

**Last updated**: 2026-02-16  
**Status**: Web – all pages implemented (frontend); Mobile – basic only. See [09-current-vs-final-solution.md](./09-current-vs-final-solution.md).
