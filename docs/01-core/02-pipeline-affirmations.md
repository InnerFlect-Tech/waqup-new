# Pipeline: Affirmations

**Purpose**: Exact steps for affirmation creation. Scientific basis: cognitive re-patterning, repetition, positive language, believability, emotion, **own voice** (Research principle 13).

**Reference**: Scientific foundations — subconscious dominance, neuroplasticity, repetition, relaxed states, language framing (positive, present-tense, believable), emotion, own voice.

---

## Steps (conversational, chat-like, no static forms)

| Step | Purpose | Inputs | Outputs | LLM/TTS? |
|------|---------|--------|---------|----------|
| 1. Intent | User articulates what they want to change/strengthen | Conversation | intent (string, structured) | LLM clarifies |
| 2. Script | Generate affirmations: positive, present-tense, believable, gradual | intent | script (text) | LLM (GPT-4) |
| 3. Voice | Choose: user record own voice OR ElevenLabs TTS | script, choice | raw audio | Recording or ElevenLabs |
| 4. **Audio** | **Dedicated audio page**: volumes, waves, effects, preview | raw audio | mixed/customized audio | — |
| 5. Review | Preview, edit script if needed, confirm | script, audio | saved content_item | — |
| 6. Edit-audio (optional) | Re-record, change voice, re-customize on audio page | content_item | updated audio/script | Same as 3–4 |

---

## Routes

- Create: `/create/conversation` or `/sanctuary/affirmations/create` (conversational)
- Edit-audio: `/sanctuary/affirmations/[id]/edit-audio` (includes full Audio page)

---

## Language rules (from scientific foundations)

- **Positive framing**: Avoid negation; focus on what you want
- **Present tense**: "I am confident" not "I will be confident"
- **Believability**: Gradual, plausible — avoid grandiose claims that trigger rejection
- **Emotion**: Infuse with genuine feeling; emotion encodes deeper
- **Own voice**: Recording your own voice has "personalized authority" — bypasses skepticism

---

## See also

- [03-pipeline-meditations.md](./03-pipeline-meditations.md)
- [04-pipeline-rituals.md](./04-pipeline-rituals.md)
- [05-pipelines-overview.md](./05-pipelines-overview.md)
- [06-audio-generation-summary.md](./06-audio-generation-summary.md)
- [08-llm-conversation-summary.md](./08-llm-conversation-summary.md)
- See `05-pipelines-overview.md`, `08-llm-conversation-summary.md`
