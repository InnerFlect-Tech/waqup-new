# Full Spacing Analysis – waQup Web

**Purpose**: Comprehensive audit of spacing inconsistencies across the application. Use this to fix wrong spacing and align with design tokens.

**Reference**: [13-spacing-usage-guide.md](./13-spacing-usage-guide.md) for token definitions.

---

## Executive Summary

| Area | Issue | Severity |
|------|-------|----------|
| Sanctuary stats cards | Bottom padding too tight vs Action cards | High |
| Sanctuary vs Create/Profile | Inconsistent card padding (md vs xl vs xxl) | Medium |
| AppLayout | Tailwind gaps (gap-10, gap-x-16) not aligned to tokens | Medium |
| Profile stats row | No gap between value and label | Low |
| Raw numbers | minHeight, width/height for icons, fontSize | Low |
| Section headers | Inconsistent marginBottom (lg vs xl) | Low |

---

## 1. Sanctuary Page (`packages/web/app/sanctuary/page.tsx`)

### 1.1 Stats Strip (Library, Streak, Credits) – **Primary Issue**

**Current:**
```ts
padding: `${spacing.md}px ${spacing.lg}px`  // 16px top/bottom, 24px left/right
gap: spacing.sm                             // 8px between icon, value, label
```

**Problem**: Vertical padding is 16px. The label at the bottom sits only 16px from the card edge, creating a cramped feel compared to the Quick Action cards below.

**Quick Action cards** use `padding: spacing.xl` (32px) – twice as much. This creates a clear visual inconsistency between two similar card types on the same page.

**Fix**: Use `padding: ${spacing.lg}px ${spacing.lg}px` (24px all sides) for stats cards. This:
- Increases bottom padding from 16px to 24px
- Aligns with the semantic "card internal padding" token
- Reduces the gap between stats and action card styles

### 1.2 Quick Action Cards

**Current:** `padding: spacing.xl` (32px) – good, generous.

**Internal spacing:**
- Icon box → title: `marginBottom: spacing.md` (16px)
- Title → description: `marginBottom: spacing.xs` (4px)

**Note**: Title→description could use `spacing.sm` (8px) for slightly better separation.

### 1.3 Menu Grid (Your Sanctuary)

**Current:** `padding: spacing.lg` (24px), `gap: spacing.md` (16px) – consistent.

**Internal:** Icon 40×40, `gap: spacing.md` between icon and content. Title→description uses `marginBottom: spacing.xs` in the flex child.

---

## 2. AppLayout (`packages/web/src/components/shared/AppLayout.tsx`)

### 2.1 Tailwind Gaps vs Design Tokens

| Location | Current | Token Equivalent | Issue |
|----------|---------|------------------|-------|
| Nav items (desktop) | `gap-6` | 24px = spacing.lg | OK |
| Nav + profile area | `gap-10` | 40px | No token – use spacing.xl (32) or add token |
| Profile dropdown items | `px-4 py-2` | 16px, 8px | ≈ spacing.md, spacing.sm |
| Logo ↔ nav | `gap-x-16` | 64px | ≈ spacing.xxxl (64) |
| Mobile menu | `space-y-1`, `px-2 pt-2 pb-3` | 4px, 8px, 12px | Inconsistent with tokens |

**Recommendation**: Replace Tailwind spacing with inline styles using `spacing.*` for consistency. Example:
- `gap-6` → `gap: spacing.lg`
- `gap-10` → `gap: spacing.xl`
- `gap-x-16` → `gap: spacing.xxl` or `spacing.xxxl`

### 2.2 Credits Badge

**Current:** `padding: ${spacing.xs} ${spacing.sm}` – correct per tokens.

---

## 3. Profile Page (`packages/web/app/(main)/profile/page.tsx`)

### 3.1 Stats Row (Content, Credits, Member since)

**Current:** `gridTemplateColumns: 'repeat(3, 1fr)'`, `gap: spacing.md`, no gap between value and label.

**Problem**: Value and label are stacked with `textAlign: 'center'` but Typography has `margin: 0`. The two lines can feel cramped.

**Fix**: Add `marginBottom: spacing.xs` to the value Typography, or wrap in a flex column with `gap: spacing.xs`.

### 3.2 Menu Cards

**Current:** `padding: spacing.lg` (24px), `gap: spacing.md` – consistent with Sanctuary menu grid.

---

## 4. Create Page (`packages/web/app/(main)/create/page.tsx`)

### 4.1 Content Type Cards

**Current:** `padding: spacing.xxl` (48px), `minHeight: 320` (raw number).

**Internal:**
- Icon box: `marginBottom: spacing.xl`
- Tagline: `marginBottom: spacing.sm`
- Title: `marginBottom: spacing.sm`
- Footer: `marginTop: spacing.xl`, `paddingTop: spacing.md`

**Note**: `minHeight: 320` is a raw number. Consider `minHeight` as a design decision; no token exists. Document or add a token if reused.

---

## 5. Credits Page (`packages/web/app/sanctuary/credits/page.tsx`)

### 5.1 Balance Card

**Current:** `padding: spacing.xxl` – good.

**Internal:** Icon `marginBottom: spacing.md`, value `marginBottom: spacing.sm`, body `marginBottom: spacing.xl` – well spaced.

### 5.2 Earn Methods & Transactions

**Current:** `padding: spacing.lg` per row, `gap: spacing.md` – consistent.

---

## 6. Marketplace Page (`packages/web/app/(main)/marketplace/page.tsx`)

### 6.1 Featured Card

**Current:** `padding: spacing.xl` – good.

### 6.2 Library Grid Cards

**Current:** `padding: spacing.lg` – consistent with other list-style cards.

---

## 7. Card Padding Summary

| Card Type | Current Padding | Recommended |
|-----------|-----------------|-------------|
| Stats (Library, Streak, Credits) | spacing.md (16px) | spacing.lg (24px) |
| Quick Action cards | spacing.xl (32px) | Keep |
| Sanctuary menu items | spacing.lg (24px) | Keep |
| Profile menu items | spacing.lg (24px) | Keep |
| Create content type cards | spacing.xxl (48px) | Keep |
| Credits balance | spacing.xxl (48px) | Keep |
| Credits earn/transaction rows | spacing.lg (24px) | Keep |
| Marketplace featured | spacing.xl (32px) | Keep |
| Marketplace library cards | spacing.lg (24px) | Keep |

**Rule of thumb:**
- **Compact stat cards**: spacing.lg minimum
- **Standard cards** (menu, list rows): spacing.lg
- **Prominent cards** (actions, featured): spacing.xl
- **Hero/balance cards**: spacing.xxl

---

## 8. Section Header Spacing

| Page | Section Header | marginBottom | Notes |
|------|----------------|--------------|-------|
| Sanctuary | Welcome | spacing.xl | Good |
| Sanctuary | Quick Actions | spacing.lg | OK |
| Sanctuary | Your Sanctuary | spacing.lg | OK |
| Create | Header | spacing.xxl | Good |
| Credits | How to earn | spacing.lg | OK |
| Credits | Recent activity | spacing.lg | OK |
| Profile | (no section headers) | — | — |

**Recommendation**: Use `spacing.lg` for section headers above card grids consistently.

---

## 9. Raw Numbers to Review

| File | Value | Context | Suggestion |
|------|-------|---------|------------|
| sanctuary/page.tsx | width: 48, height: 48 | Quick action icon box | OK (icon size) |
| sanctuary/page.tsx | width: 40, height: 40 | Menu icon | OK |
| create/page.tsx | minHeight: 320 | Content type card | Consider token or document |
| create/page.tsx | width: 72, height: 72 | Icon box | OK (fixed icon size) |
| profile/page.tsx | width: 88, height: 88 | Avatar | OK |
| SpeakingAnimation.tsx | gap: '8px' | — | Use spacing.sm |
| progress/page.tsx | borderRadius: 3 | Intensity dot | Consider borderRadius.sm |

---

## 10. Implementation Priority

1. **High**: Sanctuary stats cards – increase padding to spacing.lg
2. **Medium**: AppLayout – replace Tailwind gaps with spacing tokens where possible
3. **Low**: Profile stats row – add gap between value and label
4. **Low**: Quick Action cards – consider spacing.sm between title and description
5. **Document**: Add CARD_PADDING_STATS or similar if stats-style cards are reused

---

## 11. Files to Modify (Priority Order)

| File | Change |
|------|--------|
| `packages/web/app/sanctuary/page.tsx` | Stats cards: `padding: ${spacing.lg}px ${spacing.lg}px` |
| `packages/web/app/sanctuary/page.tsx` | Quick Action: title→description `marginBottom: spacing.sm` |
| `packages/web/src/components/shared/AppLayout.tsx` | Replace Tailwind gap classes with spacing tokens (optional, larger refactor) |
| `packages/web/app/(main)/profile/page.tsx` | Stats row: add `gap: spacing.xs` or margin between value and label |
| `packages/web/src/components/audio/SpeakingAnimation.tsx` | `gap: '8px'` → `gap: spacing.sm` |

---

**Last Updated**: 2026-03-08
