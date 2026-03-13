# Auth Screens Design Plan — Tier-One Quality

**Purpose**: Single source of truth for professional, production-level design of Setup and Login screens, aligned with waQup visual identity and 2024–2025 best practices.

---

## Research Summary

### Industry Best Practices (2024–2025)

- **Simplicity & clarity**: Strip non-essential elements; focus on primary authentication goal; clear labels, prominent CTAs, ample white space.
- **Mobile-first**: Large tap targets (44pt+), responsive layouts, platform features (SMS autofill, biometrics).
- **Trust signals**: Consistent branding, subtle security cues.
- **Visual hierarchy**: Contrast, sizing, primary action dominance.
- **Glassmorphism (restraint)**: Use selectively on focus areas (cards, modals); translucent blur, subtle borders, soft shadows. Avoid overuse.

### waQup Visual Identity

- **Theme**: Mystical Purple default; glass.light, accent.tertiary, gradients.
- **Glass**: Backdrop blur, subtle borders, accent glow on key surfaces.
- **Typography**: Light weights (300) for headlines; clear hierarchy.
- **Tokens**: All numeric values in `packages/shared/src/theme/tokens.ts` — no hardcoding.

---

## Token Architecture (SSOT)

### Auth Tokens (`authTokens`)

| Token | Value | Use |
|-------|-------|-----|
| `logoFontSizeLogin` | 48 | Login/signup form logo |
| `logoFontSizeHero` | 64 | Setup/landing hero logo |
| `featureIconSize` | 56 | Feature card icon container |
| `featureIconGlyphSize` | 28 | Icon glyph inside container |
| `socialButtonMinHeight` | 52 | Google button min height |

### Layout Tokens (existing)

| Token | Value | Use |
|-------|-------|-----|
| `authCardMaxWidth` | 480 | Max width for auth card |
| `heroBodyFontSizeMin` | 16 | Tagline/subtitle |

---

## Component Updates

### Card — `auth` Variant

- **Padding**: `spacing.xl` (auth-specific, via `blurContainerAuth`)
- **Shadow**: Accent glow (`shadowColor: accent.primary`, `shadowOpacity: 0.25`, `shadowRadius: 24`)
- **Glass**: `colors.glass.light`, `colors.glass.border`

### SetupScreen

- **Icons**: MaterialCommunityIcons (brain, microphone, heart) — no emoji
- **Feature cards**: Glass styling, tokenized icon container
- **Logo**: `authTokens.logoFontSizeHero`
- **Tagline**: `layout.heroBodyFontSizeMin`

### LoginScreen

- **Card**: `variant="auth"` for glass + accent glow
- **Container**: `layout.authCardMaxWidth` (480)
- **Logo**: `authTokens.logoFontSizeLogin`
- **Google button**: `authTokens.socialButtonMinHeight`
- **No redundant padding**: Card auth variant provides it

---

## Anti-Patterns Avoided

- Hardcoded pixel values (e.g. `fontSize: 48`, `maxWidth: 400`)
- Emoji for feature icons
- Duplicate padding (Card auth + screen style)
- Raw `colors.glass.opaque` for auth cards (use theme `colors.glass.light`)

---

## Files Changed

| File | Change |
|------|--------|
| `packages/shared/src/theme/tokens.ts` | Added `authTokens` |
| `packages/mobile/src/theme/index.ts` | Export `layout`, `authTokens` |
| `packages/mobile/src/components/ui/Card.tsx` | Added `auth` variant with glow |
| `packages/mobile/src/screens/auth/LoginScreen.tsx` | Tokens, `variant="auth"`, `layout.authCardMaxWidth` |
| `packages/mobile/src/screens/SetupScreen.tsx` | Vector icons, tokens, `authTokens` |

---

**Last Updated**: 2026-03-13
