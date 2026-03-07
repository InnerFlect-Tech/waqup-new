# Core Product Documentation Reference

**Purpose**: Reference guide to waQup product documentation — all docs live in this repo (`docs/`).

---

## In-Repo Product Docs (this folder)

| Doc | Purpose |
|-----|---------|
| [02-pipeline-affirmations.md](./02-pipeline-affirmations.md) | Affirmation creation steps (Intent → Script → Voice → Audio → Review) |
| [03-pipeline-meditations.md](./03-pipeline-meditations.md) | Meditation creation steps (+ Context) |
| [04-pipeline-rituals.md](./04-pipeline-rituals.md) | Ritual creation steps (+ Context, Personalization) |
| [05-pipelines-overview.md](./05-pipelines-overview.md) | Overview, shared Audio page, route map |
| [06-audio-generation-summary.md](./06-audio-generation-summary.md) | TTS (ElevenLabs), recording, Audio page spec |
| [07-marketplace-summary.md](./07-marketplace-summary.md) | Discovery, creator, verification, viral, revenue |
| [08-llm-conversation-summary.md](./08-llm-conversation-summary.md) | Conversation flow, state machine, prompts |

---

## Documentation in This Repo

**All documentation is in `docs/`** — no external doc paths.

### Product & Pipelines
- **01-core/** – Pipelines (affirmations, meditations, rituals), audio, marketplace, LLM
- **02-mobile/** – Tech stack, architecture, implementation
- **03-platforms/** – Multi-platform strategy, browser optimization
- **04-reference/** – Pages, Context7 usage, current vs final, design system

### Planning
- **rebuild-roadmap/** – Roadmap, schema verification, phase analyses, changelog

---

## Using Context7

Use Context7 to query docs in this repo.

**Example**:
```
Context7 Query: "What are the three content types in waQup?"
Reference: docs/01-core/05-pipelines-overview.md
```

See [../04-reference/02-context7-usage.md](../04-reference/02-context7-usage.md) for detailed guide.
