# Developer Tooling — Context7 & Cursor Rules

**Purpose**: How to use Context7 for documentation queries and Cursor rules for project conventions.

---

## Part 1: Context7 — Documentation Queries

**All docs**: This repo only — `docs/` and `rebuild-roadmap/`. No external paths.

### When to use Context7

- **Before implementing** — Query relevant docs for requirements and patterns
- **When stuck** — Find answers in product and technical docs
- **When verifying** — Check requirements against docs
- **When documenting** — Reuse existing patterns and wording

### What to query

| Topic | Reference |
|-------|-----------|
| Three content types, pipelines | `docs/01-core/05-pipelines-overview.md` |
| Affirmation / Meditation / Ritual pipelines | `docs/01-core/02-04-pipeline-*.md` |
| Conversation flows, state machine | `docs/01-core/08-llm-conversation-summary.md` |
| Audio, TTS, ElevenLabs | `docs/01-core/06-audio-generation-summary.md` |
| Marketplace | `docs/01-core/07-marketplace-summary.md` |
| Tech stack (mobile) | `docs/02-mobile/01-technology-stack.md` |
| Architecture, implementation | `docs/02-mobile/02-architecture.md`, `03-implementation.md` |
| Multi-platform, browser | `docs/03-platforms/01-multi-platform-strategy.md`, `02-browser-optimization-strategy.md` |
| Roadmap, schema | `rebuild-roadmap/01-planning/01-roadmap.md`, `02-schema-verification.md` |
| Pages (what exists / missing) | `docs/04-reference/04-pages-and-routes.md` |
| Current vs final | `docs/04-reference/09-current-vs-final-solution.md` |
| Design system | `docs/04-reference/07-design-system.md` |

### Pattern

1. Ask one clear question.
2. Use docs from this repo only.
3. Update docs if something changed.

---

## Part 2: Cursor Rules

**Purpose**: Project conventions enforced by `.cursorrules` and `.cursor/rules/*.mdc`.

### Rule files

| File | Applies When | Purpose |
|------|--------------|---------|
| `.cursorrules` | Always (project-wide) | Project context, principles, docs structure, DRY, architecture, code review checklist |
| `.cursor/rules/design-system.mdc` | Editing `packages/web/**`, `packages/shared/src/theme/**` | Design tokens SSOT; never hardcode colors, spacing, blur |
| `.cursor/rules/analytics-events.mdc` | Editing `packages/web/**`, `analytics.ts` | Use `Analytics.*` helpers only; fire events after confirmed success |

### Key principles

- **Documentation First** — Base work on docs in `docs/`; use Context7 to query
- **Shared Code** — Business logic in `packages/shared/`; never duplicate across platforms
- **Step-by-Step Verification** — Each step independently testable; update changelog when completing steps
- **Production Quality** — Error handling, loading states, empty states everywhere

### When unsure

Query docs via Context7 (see Part 1).

---

**Last Updated**: 2026-03-13
