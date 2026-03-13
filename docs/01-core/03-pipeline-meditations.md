# Pipeline: Meditations

**Purpose**: Guided meditation creation for **state regulation** — breath, body, and attention readiness. Meditations prepare the nervous system; they are not belief scripts or affirmations.

**Reference**: Scientific foundations — relaxed states (alpha/theta), breath regulation, embodied awareness, stress reduction. No suggestion delivery or visualization unless explicitly requested.

---

## Steps (conversational, chat-like, no static forms)

| Step | Purpose | Inputs | Outputs | LLM/TTS? |
|------|---------|--------|---------|----------|
| 1. Intent | What state to regulate (e.g. calm, focus, sleep, reset) | Conversation | intent | LLM clarifies |
| 2. Context | When to practice; how arriving (tired, wired, scattered, calm) | intent | context | LLM gathers |
| 3. Script | Generate regulation meditation: arrival, breath, body, attention, close | intent, context | script (150–250 words) | LLM (GPT-4o-mini) |
| 4. Voice | ElevenLabs (long-form, prosody) or user record | script | raw audio | ElevenLabs / Recording |
| 5. **Audio** | **Audio page**: volumes, waves, background mix, preview | raw audio | mixed audio | — |
| 6. Review | Preview, save to sanctuary | script, audio | saved content_item | — |
| 7. Edit-audio (optional) | Post-creation edits | content_item | updated | Same as 4–5 |

---

## Routes

- Create: `/create/conversation` or `/sanctuary/meditations/create` (conversational)
- Edit-audio: `/sanctuary/meditations/[id]/edit-audio` (includes full Audio page)

**Note**: Meditations list (`/sanctuary/meditations`), detail (`[id]`), and edit (`[id]/edit`) pages are missing — see [04-pages-comparison.md](../04-reference/04-pages-comparison.md).

---

## Content structure (regulation-focused)

- **Arrival** (2–3 sentences): Invite attention to the present; body, breath, here and now
- **Breath regulation** (3–4 sentences): Slow, even breath; exhale releasing; no rush
- **Body softening** (3–4 sentences): Notice tension; let shoulders soften; feel the ground
- **Attention settling** (3–4 sentences): Let attention rest; calm; readiness
- **Gentle close** (2–3 sentences): Return to the room; carry the calm forward

**Rules**: Second person ("you", "your"). Simple, sensory, calm, direct. **No suggestion delivery** — no "you are", "you have", "you feel" belief planting. **No visualization** unless the user explicitly asks. Total length: 150–250 words.

---

## See also

- [02-pipeline-affirmations.md](./02-pipeline-affirmations.md)
- [04-pipeline-rituals.md](./04-pipeline-rituals.md)
- [05-pipelines-overview.md](./05-pipelines-overview.md)
- [06-audio-generation-summary.md](./06-audio-generation-summary.md)
- [08-llm-conversation-summary.md](./08-llm-conversation-summary.md)
- See `05-pipelines-overview.md`, `08-llm-conversation-summary.md`
