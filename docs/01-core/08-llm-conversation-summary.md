# LLM / Conversation Summary

**Purpose**: Conversation over forms; chat-like UI; state machine.

---

## Principles

- **No static forms** — all creation through dialogue
- **Chat-like interface** — conversational UI
- **State machine** — manages flow, transitions
- **Context-aware** — adapts based on responses

---

## Per content type: conversational vs LLM steps

| Step | Affirmation | Meditation | Ritual |
|------|-------------|------------|--------|
| Intent | Conversational + LLM clarifies | Conversational + LLM clarifies | Conversational + LLM clarifies |
| Context | — | Conversational + LLM gathers | Conversational + LLM gathers |
| Personalization | — | — | Conversational + LLM explores |
| Script | LLM generates | LLM generates | LLM generates |
| Voice | Choice (record/TTS) | Choice | Choice |
| Audio | UI (no LLM) | UI | UI |
| Review | UI | UI | UI |

---

## Message flow

1. **User** sends message (text/voice)
2. **LLM** responds — clarifies, gathers context, or generates script
3. **Context** accumulated in conversation state
4. **Transition** to next step when sufficient context

---

## Prompts

- **System prompt**: Core rules (positive language, present tense, believability, etc.)
- **Content-type-specific**: Affirmation vs meditation vs ritual structure
- **Reference**: Scientific foundations for language rules

---

## Reference

- **Pipelines**: [02-pipeline-affirmations.md](./02-pipeline-affirmations.md), [03-pipeline-meditations.md](./03-pipeline-meditations.md), [04-pipeline-rituals.md](./04-pipeline-rituals.md)
- **Phase 9**: [rebuild-roadmap/02-phases/09-phase-09-ai-integration.md](../../rebuild-roadmap/02-phases/09-phase-09-ai-integration.md)
