# waQup Product Overview

**Purpose**: High-level description of what waQup is, its principles, and core concepts.

**Last Updated**: 2026-03-09

---

## What is waQup?

waQup is a **voice-first** wellness app for creating and practicing personalized affirmations, guided meditations, and rituals. Content is created through **conversation** (not static forms) and practiced via **audio** — text and visuals are secondary.

---

## Product Principles

### Voice-first

- **Audio is primary** — text and visual are supporting
- **Background audio** — support playback while app is in background
- **Orb interface** — a speaking, responsive orb that guides creation and practice
- **Own voice** — users can record their own voice for affirmations (bypasses skepticism)

### Three content types (non-interchangeable)

| Type | Depth | Purpose |
|------|-------|---------|
| **Affirmation** | Shallow → medium | Cognitive re-patterning — repetition, positive language, believability |
| **Meditation** | Medium | State induction — relaxed states, visualization |
| **Ritual** | Deepest | Identity encoding — value alignment, emotional anchoring, ritual structure |

Each type has a distinct creation pipeline and scientific basis. See [05-pipelines-overview.md](01-core/05-pipelines-overview.md).

### Conversation over forms

- **No static forms** — all creation through dialogue
- **Chat-like interface** — conversational UI
- **Context-aware** — adapts based on user responses
- **State machine** — manages conversation flow

### Practice is free

- **Unlimited replay** — no credit consumption for playback
- **Credits for creation only** — TTS, script generation, agent mode consume credits
- **No subscription pressure** — user autonomy

### User autonomy

- **No manipulation** — respect user choices
- **No pressure** — no consequences for not practicing
- **Easy exit** — can leave anytime

---

## Practice vs Creation Model

| Action | Credits | Notes |
|--------|---------|-------|
| **Play content** | Free | Unlimited replay |
| **Create content** | Consumed | Script generation, TTS, agent mode |
| **Use conversation** | Consumed | Per message |
| **Use Oracle / Speak** | Consumed | Per session |
| **Create voice (IVC)** | One-time | 50Q for new voice slot |

---

## Content Creation Pipelines

All pipelines share: **Intent → Script → Voice → Audio → Review**

- **Affirmations**: Intent → Script → Voice → Audio → Review
- **Meditations**: Intent → Context → Script → Voice → Audio → Review
- **Rituals**: Intent → Context → Personalization → Script → Voice → Audio → Review

Details: [01-core/02-pipeline-affirmations.md](01-core/02-pipeline-affirmations.md), [03-pipeline-meditations.md](01-core/03-pipeline-meditations.md), [04-pipeline-rituals.md](01-core/04-pipeline-rituals.md).

---

## Related Docs

- **Level unlocks & gamification**: [docs/01-core/10-gamification-level-unlocks.md](01-core/10-gamification-level-unlocks.md)
- **Pipelines overview**: [docs/01-core/05-pipelines-overview.md](01-core/05-pipelines-overview.md)
- **Audio generation**: [docs/01-core/06-audio-generation-summary.md](01-core/06-audio-generation-summary.md)
- **Conversation system**: [docs/01-core/08-llm-conversation-summary.md](01-core/08-llm-conversation-summary.md)
- **Marketplace**: [docs/01-core/07-marketplace-summary.md](01-core/07-marketplace-summary.md)
