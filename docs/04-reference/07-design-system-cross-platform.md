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

**Last Updated**: 2026-02-16
