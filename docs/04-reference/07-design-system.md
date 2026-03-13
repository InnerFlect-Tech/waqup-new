# Design System - Cross-Platform Visual Coherence

**Purpose**: Single source of truth for web, iOS, and Android visual consistency.

---

## Architecture

```
@waqup/shared/theme (canonical tokens)
├── colors.ts      → Same hex/rgba across all platforms
├── tokens.ts      → Numeric values (spacing, borderRadius, typography, shadows, layout)
├── types.ts       → Theme, ThemeVariables interfaces
├── themes.ts      → Theme generator + 6 predefined themes
└── index.ts

packages/web/src/theme/     → CSS format adapters
├── format.ts      → Converts numbers to px strings, builds shadow CSS
├── glass.ts       → backdrop-filter (web only)
├── ThemeProvider.tsx
└── index.ts

packages/mobile/src/theme/  → React Native format adapters
├── format.ts      → Uses numbers directly, builds RN shadow objects
├── glass.ts       → backgroundColor + border (no backdrop blur)
├── ThemeProvider.tsx       → AsyncStorage for persistence
└── index.ts
```

---

## Key Principles

1. **Canonical Numbers**: Shared tokens use numeric values. Web converts to `"Npx"`; RN uses numbers directly.
2. **Single Theme Logic**: Theme generation (colors, gradients, WCAG contrast) lives in shared. No duplication.
3. **Platform Adapters**: Thin format layers per platform. ~50 lines each vs 500+ duplicated before.
4. **Shadows**: Semantic tokens `{ y, blur, opacity }` → Web: CSS string; RN: `shadowOffset`, `shadowOpacity`, `shadowRadius`, `elevation`.

---

## Usage

**Web**:
```ts
import { useTheme, spacing, typography, borderRadius, shadows } from '@/theme';
```

**Mobile**:
```ts
import { useTheme, spacing, typography, borderRadius, shadows } from '@/theme';
```

Same API, platform-appropriate formats.

---

## Adding New Tokens

1. Add to `packages/shared/src/theme/tokens.ts` (numeric)
2. Add format conversion in `packages/web/src/theme/format.ts` if CSS string needed
3. Add format conversion in `packages/mobile/src/theme/format.ts` if RN object needed
4. Export from both platform index.ts

---

## Spacing Rules

**Rule**: Always use `spacing.*` tokens. Never use raw pixel values for margins, padding, or gaps. Never append `px` to spacing tokens (they already include the unit).

| Token | Value | Use case |
|-------|-------|----------|
| `xs` | 4px | Tight inline (badge, chip), minimal gaps |
| `sm` | 8px | Icon-text gap, small internal padding |
| `md` | 16px | List item padding, card internal, row gaps |
| `lg` | 24px | Section gaps, card padding, list row padding |
| `xl` | 32px | Page padding, major sections |
| `xxl` | 48px | Large section breaks |
| `xxxl` | 64px | Hero spacing |

**Import**: `import { spacing } from '@/theme';`

---

## Button Tokens

From `packages/shared/src/theme/tokens.ts` → `BUTTON_TOKENS` (or `buttonTokens`):

| Token | Use case |
|-------|----------|
| `borderRadius` | 16px — pill-like corners |
| `iconGap` | 8px — gap between icon and text |
| `iconSize.sm/md/lg` | 14/16/20px — icon size per button size |
| `paddingX/Y.sm/md/lg` | Button padding by size |
| `minHeight.sm/md/lg` | 32/44/52px — touch targets |

The shared `Button` component uses these internally. For custom CTAs, import `BUTTON_TOKENS` from `@/theme`.

---

## Responsive Design (Web)

**Breakpoints**: 320px, 375px, 390px (mobile); 640, 768, 1024, 1280px (desktop). **Header**: `HEADER_PADDING_X_RESPONSIVE` (`clamp(16px, 5vw, 96px)`). **Landing sections**: `padding: 0 clamp(16px, 4vw, 32px)`. **Typography**: Use `clamp()` for fluid scaling. **Checklist**: No overflow at 320px; padding via `clamp()` or media queries; tables in `overflow-x: auto`.

---

## Error, Loading, Empty States

- **Loading**: `<Loading />` or `Button` with `loading` prop. Never blank during fetch.
- **Error**: `try/catch`, user-friendly messages, `<ErrorBanner message="…" onRetry={…} />` for recoverable errors.
- **Empty**: `<EmptyState icon={…} title="…" body="…" action={…} />` with CTA when user can act.

---

**Design rules** are enforced by [.cursor/rules/design-system.mdc](../../.cursor/rules/design-system.mdc).

**Last Updated**: 2026-03-13
