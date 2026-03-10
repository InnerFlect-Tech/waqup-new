# Pipelines Overview

**Purpose**: Single overview linking all three content creation pipelines, mapping to routes, and referencing scientific foundations.

---

## Shared structure: Voice → Audio → Review

**All pipelines share** the **Audio page** step. After the Voice step ( ElevenLabs or user recording), users go to a dedicated **Audio page** to:

- Adjust **volumes** (voice vs background/ambience)
- Choose **waves** (waveform visualization style, presets)
- **Preview** with real-time waveform
- Save the final mix

Edit-audio routes (`/sanctuary/{affirmations|meditations|rituals}/[id]/edit-audio`) lead to the **same Audio page** for re-customization. The Audio page must feel **cool** — immersive, modern, tactile.

---

## Pipeline comparison

| Step | Affirmation | Meditation | Ritual |
|------|-------------|------------|--------|
| 1 | Intent | Intent | Intent |
| 2 | Script | Context | Context |
| 3 | Voice | Script | Personalization |
| 4 | **Audio** | Voice | Script |
| 5 | Review | **Audio** | Voice |
| 6 | Edit-audio | Review | **Audio** |
| 7 | | Edit-audio | Review |
| 8 | | | Edit-audio |

---

## Route map

| Content type | Create flow | Edit-audio |
|--------------|-------------|------------|
| Affirmation | `/create/conversation` or `/sanctuary/affirmations/create` | `/sanctuary/affirmations/[id]/edit-audio` |
| Meditation | `/create/conversation` or `/sanctuary/meditations/create` | `/sanctuary/meditations/[id]/edit-audio` |
| Ritual | `/create/conversation` or `/sanctuary/rituals/create` | `/sanctuary/rituals/[id]/edit-audio` |

---

## Depth (from scientific foundations)

- **Affirmation**: Cognitive re-patterning (shallow → medium) — repetition, positive language, believability, own voice
- **Meditation**: State induction (medium) — relaxed states, visualization, hypnosis-like principles
- **Ritual**: Identity encoding (deepest) — value alignment, emotional anchoring, ritual structure, RAS priming

---

## Pipeline docs

- [02-pipeline-affirmations.md](./02-pipeline-affirmations.md)
- [03-pipeline-meditations.md](./03-pipeline-meditations.md)
- [04-pipeline-rituals.md](./04-pipeline-rituals.md)

---

## See also

- [06-audio-generation-summary.md](./06-audio-generation-summary.md) — Audio page spec, TTS, recording
- [10-gamification-level-unlocks.md](./10-gamification-level-unlocks.md) — Level unlocks, rituals as backbone
- [08-llm-conversation-summary.md](./08-llm-conversation-summary.md) — Conversational flow
- [04-pages-comparison.md](../04-reference/04-pages-comparison.md) — What exists vs missing
- See `08-llm-conversation-summary.md`
