# Pipeline: Meditations

**Purpose**: Guided meditation creation. Scientific basis: state induction, relaxed states (alpha/theta), visualization, stress reduction, hypnosis-like principles.

**Reference**: Scientific foundations — relaxed states and suggestibility, visualization and guided imagery, hypnosis and guided meditation evidence, stress reduction.

---

## Steps (conversational, chat-like, no static forms)

| Step | Purpose | Inputs | Outputs | LLM/TTS? |
|------|---------|--------|---------|----------|
| 1. Intent | What state/outcome (e.g. sleep, focus, calm) | Conversation | intent | LLM clarifies |
| 2. Context | When/where (morning, before sleep, commute); situation | intent | context | LLM gathers |
| 3. Script | Generate meditation: grounding, visualization, relaxation induction, suggestion delivery | intent, context | script (longer) | LLM (GPT-4) |
| 4. Voice | ElevenLabs (long-form, prosody) or user record | script | raw audio | ElevenLabs / Recording |
| 5. **Audio** | **Audio page**: volumes, waves, background mix, preview | raw audio | mixed audio | — |
| 6. Review | Preview, adjust pacing/imagery if needed | script, audio | saved content_item | — |
| 7. Edit-audio (optional) | Post-creation edits | content_item | updated | Same as 4–5 |

---

## Routes

- Create: `/create/conversation` or `/sanctuary/meditations/create` (conversational)
- Edit-audio: `/sanctuary/meditations/[id]/edit-audio` (includes full Audio page)

**Note**: Meditations list (`/sanctuary/meditations`), detail (`[id]`), and edit (`[id]/edit`) pages are missing — see [04-pages-comparison.md](../04-reference/04-pages-comparison.md).

---

## Content structure (from scientific foundations)

- **Grounding**: Breath work, body awareness — shift into alpha/theta states
- **Visualization**: Sensory-rich imagery; subconscious doesn't distinguish real from vividly imagined
- **Relaxation induction**: Progressive relaxation, calming guidance
- **Suggestion delivery**: Positive suggestions during receptive states (hypnosis-like)
- **Pacing**: Slower for deeper states; allow time for imagery

---

## See also

- [02-pipeline-affirmations.md](./02-pipeline-affirmations.md)
- [04-pipeline-rituals.md](./04-pipeline-rituals.md)
- [05-pipelines-overview.md](./05-pipelines-overview.md)
- [06-audio-generation-summary.md](./06-audio-generation-summary.md)
- [08-llm-conversation-summary.md](./08-llm-conversation-summary.md)
- See `05-pipelines-overview.md`, `08-llm-conversation-summary.md`
