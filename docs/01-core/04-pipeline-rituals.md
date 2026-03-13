# Pipeline: Rituals

**Purpose**: Ritual creation (identity encoding, deepest engagement). Scientific basis: value alignment, emotional anchoring, ritual structure, RAS priming.

**Reference**: Scientific foundations — rituals and behavioral anchoring, emotion and memory encoding, RAS and goal priming, identity-level language.

---

## Steps (conversational, chat-like, no static forms)

| Step | Purpose | Inputs | Outputs | LLM/TTS? |
|------|---------|--------|---------|----------|
| 1. Intent | What identity/change; "why this matters" | Conversation | intent | LLM clarifies |
| 2. Context | Situation, emotional state | intent | context | LLM gathers |
| 3. Personalization | Core values, name, specific life details, "why this matters" | context | personalization | LLM explores |
| 4. Script | Generate ritual: arrival, regulation, identity encoding (5 lines), repetition, closure; daily conditioning sequence | intent, context, personalization | script (structured) | LLM (GPT-4) |
| 5. Voice | ElevenLabs (emotional prosody) or user record | script | raw audio | ElevenLabs / Recording |
| 6. **Audio** | **Audio page**: volumes, waves, effects, preview | raw audio | mixed audio | — |
| 7. Review | Preview, feel, confirm | script, audio | saved content_item | — |
| 8. Edit-audio (optional) | Post-creation edits | content_item | updated | Same as 5–6 |

---

## Routes

- Create: `/create/conversation` or `/sanctuary/rituals/create` (conversational)
- Edit-audio: `/sanctuary/rituals/[id]/edit-audio` (includes full Audio page)

---

## Ritual structure (daily conditioning sequence)

1. **Arrival**: Brief breath cue; simple settling
2. **Regulation**: Body and mind quiet down
3. **Identity encoding**: 5 short lines (4–8 words each); first person, present tense
4. **Repetition**: Repeat key identity lines or instruction to repeat
5. **Closure**: "This is who I am. I carry this with me."

Total length: 150–250 words. Rituals are repeatable daily practices — not poetic monologues. The structured sequence signals importance to the subconscious.

---

## See also

- [02-pipeline-affirmations.md](./02-pipeline-affirmations.md)
- [03-pipeline-meditations.md](./03-pipeline-meditations.md)
- [05-pipelines-overview.md](./05-pipelines-overview.md)
- [06-audio-generation-summary.md](./06-audio-generation-summary.md)
- [08-llm-conversation-summary.md](./08-llm-conversation-summary.md)
- See `05-pipelines-overview.md`, `08-llm-conversation-summary.md`
