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
| 4. Script | Generate ritual: grounding, context, affirmations, emotional anchoring, closure; identity-level language | intent, context, personalization | script (structured) | LLM (GPT-4) |
| 5. Voice | ElevenLabs (emotional prosody) or user record | script | raw audio | ElevenLabs / Recording |
| 6. **Audio** | **Audio page**: volumes, waves, effects, preview | raw audio | mixed audio | — |
| 7. Review | Preview, feel, confirm | script, audio | saved content_item | — |
| 8. Edit-audio (optional) | Post-creation edits | content_item | updated | Same as 5–6 |

---

## Routes

- Create: `/create/conversation` or `/sanctuary/rituals/create` (conversational)
- Edit-audio: `/sanctuary/rituals/[id]/edit-audio` (includes full Audio page)

---

## Ritual structure (from scientific foundations)

- **Grounding**: Shift into receptive state; devote time and space
- **Context**: "Why this matters" — connect to personal meaning
- **Affirmations**: Identity-level, present-tense, value-aligned
- **Emotional anchoring**: Felt sense, emotional integration
- **Closure**: Integration guidance; signal completion

Rituals are "events, not content" — the structured sequence signals importance to the subconscious.

---

## See also

- [02-pipeline-affirmations.md](./02-pipeline-affirmations.md)
- [03-pipeline-meditations.md](./03-pipeline-meditations.md)
- [05-pipelines-overview.md](./05-pipelines-overview.md)
- [06-audio-generation-summary.md](./06-audio-generation-summary.md)
- [08-llm-conversation-summary.md](./08-llm-conversation-summary.md)
- See `05-pipelines-overview.md`, `08-llm-conversation-summary.md`
