# Spacing Usage Guide

**Purpose**: Single source of truth for padding and spacing across waQup Web and Mobile. Ensures consistent, professional UI.

---

## Rule: Never Use Raw Numbers

**Always use `spacing.*` tokens.** Do not use raw pixel values (e.g. `4`, `6`, `8`, `24`) for margins, padding, or gaps.

---

## Design Token Reference

From `packages/shared/src/theme/tokens.ts`:

| Token | Value | Use case |
|-------|-------|----------|
| `xs` | 4px | Tight inline (badge, chip), minimal gaps |
| `sm` | 8px | Icon-text gap, small internal padding |
| `md` | 16px | List item padding, card internal, row gaps |
| `lg` | 24px | Section gaps, card padding, list row padding |
| `xl` | 32px | Page padding, major sections |
| `xxl` | 48px | Large section breaks |
| `xxxl` | 64px | Hero spacing |

---

## Semantic Mapping

| Context | Token | Example |
|---------|-------|---------|
| Icon to text | `spacing.sm` | Nav items, buttons with icons |
| Badge/chip padding | `spacing.xs` or `spacing.sm` | Credits badge, count pills |
| List item horizontal padding | `spacing.lg` | Transaction rows, menu items |
| List item vertical padding | `spacing.md` | Row height, list density |
| Right-aligned content (amounts) | `spacing.lg` margin-left | Credit amounts, prices |
| Card internal padding | `spacing.lg` or `spacing.xl` | Cards, glass panels |
| Section gap | `spacing.xl` or `spacing.xxl` | Between major blocks |
| Nav bar item gap | `spacing.md` (gap-4) | Between nav buttons |
| Stats strip (icon/value/label) | `spacing.sm` | Compact stat cards |

---

## Web Import

```ts
import { spacing } from '@/theme';
```

---

## Audit Checklist for New Components

- [ ] No raw numbers for margin, padding, or gap
- [ ] Icon-text pairs use `gap: spacing.sm`
- [ ] List rows have `padding: spacing.md` or `spacing.lg` on all sides
- [ ] Right-aligned values (amounts, badges) have adequate margin/padding from edge
- [ ] Section breaks use `spacing.xl` or `spacing.xxl`

---

## Related Docs

- Design system: `docs/04-reference/07-design-system-cross-platform.md`
- Phase 2 (Design System): `rebuild-roadmap/02-phases/02-phase-02-design-system-ui-foundation.md`

---

**Last Updated**: 2026-03-08
