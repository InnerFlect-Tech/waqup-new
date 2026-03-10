# Design System — waQup

Single source of truth for the waQup design system. All values are verified against the live codebase.

---

## Architecture

```
packages/shared/src/theme/
  tokens.ts      — canonical numeric values (spacing, borderRadius, typography, layout)
  types.ts       — TypeScript interfaces (Theme, ThemeVariables)
  themes.ts      — generateTheme() factory + all named themes
  index.ts       — re-exports all of the above

packages/web/src/theme/
  format.ts      — converts shared tokens to CSS strings (px values, layout constants)
  ThemeProvider.tsx — React context + CSS custom property injection
  index.ts       — re-exports shared + format + ThemeProvider

packages/mobile/src/theme/
  format.ts      — converts shared tokens to React Native numbers
  ThemeProvider.tsx — React Native context
  index.ts       — re-exports
```

**Rule**: All design decisions live in `packages/shared/src/theme/tokens.ts` and `themes.ts`. Platform format adapters (`packages/web/src/theme/format.ts`, `packages/mobile/src/theme/format.ts`) convert to platform-appropriate values. No hardcoded design values in components.

---

## Color Tokens — Mystical Purple (default theme)

`packages/shared/src/theme/themes.ts` → `generateTheme()`

| Token | Value | Usage |
|-------|-------|-------|
| `background.primary` | `#000000` | Page background, auth page solid bg |
| `background.secondary` | `#0f0f0f` | Elevated surfaces |
| `accent.primary` | `#9333EA` | Primary CTA gradient start |
| `accent.secondary` | `#4F46E5` | Primary CTA gradient end |
| `accent.tertiary` | `#A855F7` | Links, highlighted text, "Q" in logo |
| `text.primary` | `#FFFFFF` | Headings, body on dark |
| `text.secondary` | `rgba(255,255,255,0.7)` | Subtitles, secondary copy |
| `text.tertiary` | `rgba(255,255,255,0.5)` | Captions, placeholders |
| `glass.light` | `rgba(255,255,255,0.05)` | **Card backgrounds** |
| `glass.medium` | `rgba(255,255,255,0.03)` | Hover overlays |
| `glass.border` | `rgba(255,255,255,0.10)` | **Card and input borders** |
| `glass.opaque` | `rgba(255,255,255,0.10)` | Use only for borders/highlights, NOT card backgrounds |
| `gradients.primary` | `linear-gradient(to right, #9333EA, #4F46E5)` | Primary buttons |
| `gradients.background` | `linear-gradient(to br, #000, rgba(88,28,135,0.2), #000)` | Page gradient wash |
| `gradients.mystical` | `radial-gradient(circle at center, rgba(147,51,234,0.03), transparent)` | Subtle overlay on app pages |

> **Important**: `glass.light (0.05)` is the card background. `glass.border (0.10)` is the border. They are intentionally different to create visible depth.

---

## Spacing Scale

`packages/shared/src/theme/tokens.ts`

| Token | Value |
|-------|-------|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `xxl` | 48px |
| `xxxl` | 64px |

---

## Border Radius

| Token | Value | Used For |
|-------|-------|----------|
| `sm` | 8px | Inputs, small elements |
| `md` | 12px | Standard cards (Card component) |
| `lg` | 16px | Auth card in mobile, feature cards |
| `xl` | 24px | GlassCard (web), hero cards |
| `full` | 9999px | Pills, badges, icon circles |

---

## Typography Scale

`packages/shared/src/theme/tokens.ts`

| Variant | Size | Weight | Usage |
|---------|------|--------|-------|
| `h1` | 32px | **300** | Page titles, hero headings |
| `h2` | 24px | **300** | Section headings, card titles |
| `h3` | 20px | **300** | Sub-section headings |
| `h4` | 18px | 600 | UI element labels, emphasized items |
| `body` | 16px | 400 | Default body copy |
| `bodyBold` | 16px | 600 | Emphasized body text |
| `caption` | 14px | 400 | Labels, secondary text |
| `captionBold` | 14px | 600 | Active labels |
| `small` | 12px | 400 | Metadata, badges |

> Headings use `font-weight: 300` (light) — this is the core aesthetic of the reference design. Heavy weights (700) are intentional only for numbers, prices, and strong CTAs.

---

## Layout Constants

`packages/web/src/theme/format.ts`

| Constant | Value | Usage |
|----------|-------|-------|
| `CONTENT_MAX_WIDTH` | **1280px** | All page content containers (aligns with nav) |
| `AUTH_CARD_MAX_WIDTH` | 480px | Auth form cards |
| `MAX_WIDTH_7XL` | 1280px | Nav container |
| `NAV_HEIGHT` | 64px | Fixed navigation bar |
| `PAGE_TOP_PADDING` | 96px | Top padding on app pages (64px nav + 32px) |
| `PAGE_PADDING` | 32px | Standard page padding (sides + bottom + auth top) |

> `CONTENT_MAX_WIDTH` and `MAX_WIDTH_7XL` are intentionally the same value (1280px). Content and nav are aligned.

---

## Glass Morphism

### Web — GlassCard component

`packages/web/src/components/shared/GlassCard.tsx`

```typescript
background: colors.glass.light        // rgba(255,255,255,0.05)
backdropFilter: 'blur(20px)'
border: `1px solid ${colors.glass.border}`  // rgba(255,255,255,0.10)
borderRadius: borderRadius.xl          // 24px
```

Use `<GlassCard variant="auth">` for auth forms and `<GlassCard variant="content">` for content cards. Do not pass `backgroundColor` as a style override — it breaks the glass depth effect.

### Mobile — Card component

`packages/mobile/src/components/ui/Card.tsx`

Uses `expo-blur BlurView` with:
```typescript
backgroundColor: colors.glass.light   // rgba(255,255,255,0.05)
borderColor: colors.glass.border      // rgba(255,255,255,0.10)
borderWidth: 1
borderRadius: borderRadius.lg         // 16px
```

Do not override `backgroundColor` or `borderColor` via the `style` prop — the BlurView manages these internally.

---

## Page Layout Patterns

### Auth pages (`/login`, `/signup`, `/forgot-password`, `/reset-password`, `/confirm-email`)

```tsx
<PageShell maxWidth={480} centered plain>
  {/* Logo + subtitle */}
  <GlassCard variant="auth">
    {/* form */}
  </GlassCard>
</PageShell>
```

- `plain` prop: solid `#000` background, no animated orbs
- `centered` prop: vertically centered content, `padding: 32px` (not nav-offset)
- No `AppLayout` nav (bypassed via `AUTH_ROUTES` check)

### Authenticated app pages (`/home`, `/library`, `/sanctuary`, etc.)

```tsx
<PageShell intensity="medium">
  <PageContent>
    {/* page content */}
  </PageContent>
</PageShell>
```

- `PageShell` without `centered`: `paddingTop: 96px` (clears 64px fixed nav)
- `AnimatedBackground` with floating orbs at `intensity="medium"`
- `PageContent` defaults to `max-width: 1280px`

### Marketing pages (`/`, `/pricing`, `/how-it-works`)

```tsx
<PageShell intensity="high" bare>
  {/* custom layout */}
</PageShell>
```

- `bare` prop: no content container wrapper, custom layout responsibility
- `AnimatedBackground` at higher intensity

---

## Navigation

### Public nav (unauthenticated, non-auth routes)
- Fixed top, `z-50`, `height: 64px`
- Transparent → `bg-black/80 backdrop-blur-lg` on scroll
- Container: `max-width: 1280px`, `padding: 0 32px`
- Logo: `font-weight: 300, tracking-widest` + `accent.tertiary` Q
- Links: ghost buttons | CTA: primary gradient button

### Authenticated nav
- Same structure
- Left: logo → `/sanctuary`
- Center: Sanctuary, Library, Reminders
- Right: user email + credits badge

### Auth / Onboarding pages
- No nav rendered — `AppLayout` bypasses these route groups entirely

---

## Button Variants

Primary CTA:
```typescript
background: colors.gradients.primary  // linear-gradient(to right, #9333EA, #4F46E5)
color: #ffffff
height: 48-52px (lg size)
```

Ghost (nav items):
```typescript
background: transparent
color: colors.text.secondary
hover: rgba(255,255,255,0.05)
```

---

## What NOT to Do

- Do not import `glassStyles` — this module has been removed
- Do not use `AppHeader` component — removed; use `AppLayout` only
- Do not pass `backgroundColor: colors.glass.opaque` to Card/GlassCard — use the component defaults
- Do not use `CONTENT_MAX_WIDTH` from `@waqup/shared/theme` directly in web — import from `@/theme` which gives the CSS string
- Do not set `fontWeight: 700` on h1/h2/h3 — the token default is now `300`; use `fontWeight: 600` for `h4` and above only when emphasis is needed

---

*Last verified: 2026-03-07 — aligned with design-system.mdc rules*
