# Cursor Rules Guide — waQup

**Purpose**: Explains how Cursor rules work in this project and where to find them.

---

## Overview

Cursor rules guide AI-assisted development by embedding project conventions, architecture, and constraints. In waQup, rules live in two places:

1. **Root `.cursorrules`** — Main project rules (project context, principles, docs structure, tech stack, code standards)
2. **`.cursor/rules/*.mdc`** — File-scoped rules that auto-apply when editing matching paths

---

## Rule Files

| File | Applies When | Purpose |
|------|--------------|---------|
| `.cursorrules` | Always (project-wide) | Project context, principles, documentation layout, DRY, architecture, code review checklist |
| `.cursor/rules/design-system.mdc` | Editing `packages/web/**/*.{tsx,ts}` or `packages/shared/src/theme/**/*.ts` | Design tokens SSOT, colors, spacing, blur, HEADER_PADDING_X; never hardcode values |
| `.cursor/rules/analytics-events.mdc` | Editing `packages/web/**/*.tsx` or `packages/shared/src/utils/analytics.ts` | Use `Analytics.*` helpers only; never raw `gtag`; fire events after confirmed success |

---

## Key Principles (from `.cursorrules`)

- **Documentation First** — Base work on docs in `docs/`; use Context7 to query
- **Shared Code** — Business logic in `packages/shared/`; never duplicate across platforms
- **Step-by-Step Verification** — Each step independently testable; update changelog when completing steps
- **Production Quality** — Error handling, loading states, empty states everywhere

---

## How to Use

1. **When adding UI or theme code** — Design system rules enforce token usage, no hardcoded colors/spacing/blur
2. **When adding analytics** — Analytics rules enforce typed `Analytics.*` calls, fire after success
3. **When unsure** — Query docs via Context7; reference `docs/04-reference/02-context7-usage.md`

---

## Related Docs

- [Context7 Usage](./02-context7-usage.md) — How to query documentation
- [Design System Cross-Platform](./07-design-system-cross-platform.md) — Tokens and themes
- [Important Files](./03-start-here.md#important-links) — Changelog, roadmap, schema

---

**Last Updated**: 2026-03-09
