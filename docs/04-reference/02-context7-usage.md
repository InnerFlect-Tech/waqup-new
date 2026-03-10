# Context7 Usage – Documentation Queries

**Purpose**: How to use Context7 to query waQup documentation (fastest and most accurate).

**All docs**: This repo only — `docs/` and `rebuild-roadmap/`. No external paths.

---

## When to use Context7

- **Before implementing** – Query relevant docs for requirements and patterns
- **When stuck** – Find answers in product and technical docs
- **When verifying** – Check requirements against docs
- **When documenting** – Reuse existing patterns and wording

---

## What to query (this repo)

### Core product (`docs/01-core/`)

| Topic | Reference |
|-------|-----------|
| Three content types, pipelines | `docs/01-core/05-pipelines-overview.md` |
| Affirmation pipeline | `docs/01-core/02-pipeline-affirmations.md` |
| Meditation pipeline | `docs/01-core/03-pipeline-meditations.md` |
| Ritual pipeline | `docs/01-core/04-pipeline-rituals.md` |
| Conversation flows, state machine | `docs/01-core/08-llm-conversation-summary.md` |
| Audio, TTS, ElevenLabs | `docs/01-core/06-audio-generation-summary.md` |
| Marketplace | `docs/01-core/07-marketplace-summary.md` |

### Tech & Architecture

| Topic | Reference |
|-------|-----------|
| Tech stack (mobile) | `docs/02-mobile/01-technology-stack.md` |
| Architecture (app) | `docs/02-mobile/02-architecture.md` |
| Implementation patterns | `docs/02-mobile/03-implementation.md` |
| Multi-platform strategy | `docs/03-platforms/01-multi-platform-strategy.md` |
| Browser optimization | `docs/03-platforms/02-browser-optimization-strategy.md` |

### Planning & Reference

| Topic | Reference |
|-------|-----------|
| Roadmap, phases | `rebuild-roadmap/01-planning/01-roadmap.md` |
| Schema | `rebuild-roadmap/01-planning/02-schema-verification.md` |
| Pages (what exists / missing) | `docs/04-reference/04-pages-comparison.md` |
| Current vs final | `docs/04-reference/09-current-vs-final-solution.md` |
| Design system | `docs/04-reference/07-design-system-cross-platform.md` |
| Spacing tokens, rules | `docs/04-reference/17-spacing-usage-guide.md` |

---

## Example queries

- “What are the three content types in waQup?” → `docs/01-core/05-pipelines-overview.md`
- “How does the conversation system work?” → `docs/01-core/08-llm-conversation-summary.md`
- “What is the database schema for content items?” → `rebuild-roadmap/01-planning/02-schema-verification.md`
- “How does ElevenLabs TTS work?” → `docs/01-core/06-audio-generation-summary.md`
- “What is the tech stack?” → `docs/02-mobile/01-technology-stack.md`
- “What pages exist?” → `docs/04-reference/04-pages-comparison.md`

---

## Pattern

1. Ask one clear question.
2. Use docs from this repo only.
3. Update docs if something changed.
