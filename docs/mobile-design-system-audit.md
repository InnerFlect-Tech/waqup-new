# Mobile Design System Audit

**Purpose**: Deep inspection of website design basis and mobile current state to define a coherent, premium mobile design system derived from the web.

**Date**: 2026-03-13

---

## 1. Website Visual DNA

### Brand and Theme

- **Primary palette**: Mystical Purple — `#9333EA`, `#7C3AED`, `#A855F7`
- **Base**: Dark (`#000000`) for default theme
- **Theme system**: 6 themes generated from `ThemeVariables` (primary, secondary, base, text, glass, mystical)
- **Glass**: `rgba` overlays, `backdrop-filter` blur, `blurTokens` (8, 10, 12, 20px)
- **Gradients**: `gradientPrimary`, `gradientBackground`, `gradientMystical` (radial purple glow)
- **Emotional tone**: Calm, mystical, premium, restrained

### Typography

| Token | Size | Weight | Line Height | Use |
|-------|------|--------|-------------|-----|
| h1 | 32 | 300 | 40 | Hero, setup |
| h2 | 24 | 300 | 32 | Section |
| h3 | 20 | 300 | 28 | Subsection |
| h4 | 18 | 600 | 24 | Headline, nav |
| body | 16 | 400 | 24 | Main content |
| caption | 14 | 400 | 20 | Secondary |
| small | 12 | 400 | 16 | Dense |
| label | 13 | 500 | 18 | System |
| micro | 10 | 500 | 14 | Badges |

- **Font**: System (no custom font loaded on web; relies on -apple-system, etc.)
- **Hierarchy**: Light (300) for headlines, Semibold (600) for emphasis

### Spacing

- **Scale**: 4, 8, 16, 24, 32, 48, 64 (`spacing.xs` → `spacing.xxxl`)
- **Card padding**: `spacing.md` (16) default, `spacing.xl` (32) auth
- **Page padding**: `HEADER_PADDING_X_RESPONSIVE` = `clamp(16px, 5vw, 96px)`
- **Section gaps**: `spacing.lg`–`spacing.xxl`

### Radius

- **Scale**: 4, 8, 12, 16, 24, full (`borderRadius.xs` → `borderRadius.full`)
- **Cards**: `borderRadius.lg` (16)
- **Buttons**: `buttonTokens.borderRadius` = 16 (pill-like)

### Shadows and Elevation

- **Tokens**: `shadowTokens` — sm, md, lg, xl (y, blur, opacity)
- **Card elevated**: `0 8px 32px ${accent}40`
- **Card default**: `0 4px 16px ${accent}30`
- **Glass**: Subtle, not heavy

### Card Styles (Web)

- **GlassCard**: `colors.glass.light`, `BLUR.xl`, `1px solid glass.border`, `boxShadow` with accent
- **Card**: variants `default` | `elevated` | `flat`; `pressable` with hover lift
- **Padding**: `spacing.md` (16) default; auth uses `CARD_PADDING_AUTH` (xl)

### Button Styles (Web)

- **Primary**: Gradient (`gradients.primary`), `BLUR.md`, `boxShadow` accent
- **Secondary**: `glass.light`, `glass.border`
- **Outline**: `borderColor: accent.primary`, transparent bg
- **Sizes**: sm, md, lg via `BUTTON_TOKENS` (minHeight 32, 44, 52; paddingX 16, 24, 32)
- **Border radius**: 16 (pill)

### Icons (Web)

- **Library**: Lucide React
- **Sizes**: `w-4 h-4`, `w-5 h-5` (16px, 20px)
- **Usage**: Nav, menu, benefits, marketing

### Recurring Patterns (Web)

- Hero with gradient background, centered CTA
- Glass cards with blur and border
- Section headers with clamp() typography
- Menu panel: `MENU_PANEL_BG` (rgba(15,5,35,0.88)), `MENU_PANEL_SHADOW`
- Nav scrolled: `NAV_SCROLLED_BG` (rgba(0,0,0,0.8))

---

## 2. Current Mobile Inconsistencies

### Token Misalignment

| Area | Web | Mobile | Issue |
|------|-----|--------|-------|
| Button borderRadius | 16 (buttonTokens) | 12 (borderRadius.md) | Mobile Button uses wrong token |
| Typography fontWeight | 300 for h1–h3 | Lost — format maps to 400/600/700 only | Light weight not supported |
| Glass styles | Theme-aware | Static `colors` from shared | `glass.ts` ignores theme; breaks dark mode |

### Component Usage Gaps

| Screen/Area | Uses | Should Use |
|-------------|------|------------|
| RitualHomeScreen cards | TouchableOpacity + inline styles | Card (pressable) |
| LoginScreen buttons | TouchableOpacity | Button |
| CreateMenuSheet icon tiles | Emoji (✨, 🔮, 🧘) | Vector icons (MaterialCommunityIcons) |
| LibraryScreen empty | Custom emptyCard | EmptyState primitive |
| ProfileScreen menu items | TouchableOpacity + Card | ListRow or MenuRow pattern |

### Inline Styling Problems

- Many screens pass `style={{ backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }}` instead of using Card/primitive variants
- `marginTop: 2`, `marginBottom: spacing.xs` scattered without tokens
- `fontSize: 22`, `fontSize: 28` in Typography overrides
- `opacity: 0.6` for disabled — should be token

### Hardcoded Colors

- **VoiceOrb.tsx**: Full hex palette for states (`#3b0764`, `#7c3aed`, etc.) — not theme-derived
- **BottomSheet.tsx**: `rgba(0, 0, 0, 0.5)` backdrop — should use `colors.overlay`
- **glass.ts**: Uses `colors` from shared (light theme) — not `useTheme()`

### Icon System

- **Drawer**: MaterialCommunityIcons (24px) — good
- **SpotifyHeader**: MaterialCommunityIcons (24px) — good
- **CreateMenuSheet**: Emoji in icon tiles — inconsistent
- **RitualHomeScreen**: MaterialCommunityIcons (24px) — good
- **ContentCreateScreen**: MaterialCommunityIcons — good
- **Web**: Lucide — different family; acceptable for platform split

### Typography

- **format.ts**: `fontWeight: String(v.fontWeight) as '400' | '600' | '700'` — drops 300, 500
- **Result**: h1, h2, h3 render as 400 instead of 300 on mobile

### Safe Area and Layout

- **Screen**: Supports `safeAreaTop`, `safeAreaBottom`; default padding `spacing.md`
- **Screens with `padding={false}`**: RitualHomeScreen, LibraryScreen, LoginScreen — then add custom padding
- **Inconsistent**: Some use `insets.bottom + spacing.xxl`, others `spacing.xxxl`
- **Tab bar**: Uses `layout.tabBarHeight + insets.bottom` — correct
- **MiniPlayer**: Uses `layout.tabBarHeight + insets.bottom` — correct

### Missing Primitives

- **EmptyState**: Web has it; mobile builds ad-hoc empty cards
- **ListRow**: No shared row pattern for Profile menu, Drawer, CreateMenuSheet
- **SectionHeader**: No shared section header
- **LoadingState**: Spinner used; no skeleton for content-heavy screens

### Motion

- **Button**: `useAnimatedStyle` with scale 0.98 on press — good
- **No motion tokens**: Durations (120, 180, 240ms) not centralized
- **BottomSheet**: 300ms timing — hardcoded
- **No haptics**: expo-haptics not installed

---

## 3. Missing Design-System Layers

1. **Semantic color tokens**: `surface.card`, `surface.glass`, `surface.elevated` — currently raw `colors.glass.opaque`
2. **Motion tokens**: `duration.fast`, `duration.normal`, `duration.slow`, `easing.standard`
3. **Icon tokens**: `iconSize.sm`, `iconSize.md`, `iconSize.lg` — partially in buttonTokens, not for nav/list
4. **Radius tokens**: Component-specific (card, button, chip) — some screens use arbitrary values
5. **Alias tokens**: `touchTargetMin`, `headerHeight`, `cardPadding` — some in layout, not systematic
6. **Theme-aware glass**: `glass.ts` must use `useTheme()` or receive theme
7. **Typography fontWeight**: Support 300, 500 in mobile format
8. **EmptyState, LoadingState, ErrorState**: Shared primitives on mobile

---

## 4. Recommended Final Mobile System

### Token Structure

```
packages/shared/src/theme/
├── tokens.ts          # Extend: motionTokens, iconTokens, aliasTokens
├── colors.ts          # Keep; themes.ts generates semantic
├── themes.ts          # Keep; ensure overlay, surface semantics
└── types.ts           # Extend Theme if needed

packages/mobile/src/theme/
├── format.ts          # Fix typography fontWeight; add motion
├── glass.ts           # Refactor to theme-aware (or remove, use theme in components)
└── index.ts
```

### Primitive Components (Mobile)

| Component | Status | Action |
|-----------|--------|--------|
| Screen | Exists | Keep; ensure consistent safe area usage |
| Typography | Exists | Fix fontWeight in format |
| Button | Exists | Align borderRadius, use buttonTokens fully |
| Card | Exists | Keep; ensure all screens use it |
| Input | Exists | Audit token usage |
| Icon | N/A | Create Icon wrapper (MaterialCommunityIcons + size tokens) |
| ListRow | Missing | Create — 52pt min height, icon + text + chevron |
| SectionHeader | Missing | Create — h4 + optional caption |
| EmptyState | Missing | Port from web; adapt for RN |
| LoadingState | Exists (Loading) | Add Skeleton variant usage for lists |
| ErrorState | Missing | Create or use ErrorBanner |
| BottomSheet | Exists | Use theme.overlay for backdrop |
| Badge, Chip | Exists (Badge) | Audit |

### Pattern Layer

- **MenuRow**: Icon (24px) + label + optional chevron — for Drawer, CreateMenuSheet, Profile
- **ContentCard**: Icon container + title + subtitle — for RitualHomeScreen, Library
- **AuthPillButton**: Full-width, 52pt — for Login, Signup
- **SettingsSection**: SectionHeader + MenuRows

### Screen Structure

- **Consistent padding**: `spacing.xl` horizontal, `spacing.xxl` bottom (with insets)
- **Header**: SpotifyHeader (avatar, title, QCoin, Plus) — already shared
- **Tab bar**: BlurView, 60pt + insets
- **Drawer**: 280px, glass.opaque, 24px padding

---

## 5. What to Keep

- Shared theme/tokens architecture
- ThemeProvider with AsyncStorage persistence
- Theme generation (themes.ts) and 6 themes
- Card, Button, Typography, Screen, Input, Loading
- Navigation structure (Drawer, Tabs, Stack)
- expo-blur, react-native-reanimated, gesture-handler
- SpotifyHeader, DrawerContent, CreateMenuSheet structure
- CONTENT_TYPE_COPY, CONTENT_TYPE_COLORS from shared
- buttonTokens, layout, drawerTokens, authTokens, homeTokens

---

## 6. What to Refactor

- **glass.ts**: Make theme-aware or inline into components
- **typography format**: Add 300, 500 to fontWeight union
- **Button**: Use `buttonTokens.borderRadius` (16), not `borderRadius.md` (12)
- **RitualHomeScreen**: Use Card (pressable) instead of TouchableOpacity
- **LoginScreen**: Use Button for pill CTAs
- **CreateMenuSheet**: Replace emoji with MaterialCommunityIcons
- **LibraryScreen**: Use EmptyState primitive
- **ProfileScreen**: Use ListRow/MenuRow pattern
- **VoiceOrb**: Replace hardcoded hex with theme-derived colors
- **BottomSheet**: Use `colors.overlay` for backdrop

---

## 7. What to Remove

- Duplicate inline style objects that match Card/Button variants
- Hardcoded hex in VoiceOrb (use theme)
- Redundant `style={{ backgroundColor: colors.glass.opaque }}` when Card variant exists

---

## 8. Library Strategy

### Current Stack

- **Styling**: Custom (StyleSheet, theme from shared)
- **Animation**: react-native-reanimated
- **Gestures**: react-native-gesture-handler
- **Blur**: expo-blur
- **Navigation**: @react-navigation (drawer, stack, tabs)
- **Bottom sheet**: Custom (Modal + Animated)

### Recommendations

| Library | Action | Reason |
|---------|--------|--------|
| expo-haptics | Add | Premium feedback on primary actions |
| @gorhom/bottom-sheet | Consider | If custom BottomSheet lacks snap points, handle — but plan says avoid due to Expo 54 + Reanimated 4 issues |
| @shopify/flash-list | Consider later | If list performance issues; LibraryScreen uses FlatList |
| Tamagui / NativeWind | Do not add | Migration cost high; current stack is workable |
| Restyle | Do not add | Same as above |

**Conclusion**: Keep current stack. Add expo-haptics. Improve token usage and primitives without new UI frameworks.

---

## 9. Priority Order of Implementation

1. **Fix typography fontWeight** (format.ts) — restores h1–h3 light weight
2. **Fix glass.ts** — theme-aware or remove
3. **Fix Button** — borderRadius 16, full buttonTokens
4. **Add motion tokens** — durations, easing
5. **Create EmptyState** (mobile) — port from web
6. **Create ListRow / MenuRow** — shared pattern
7. **Refactor RitualHomeScreen** — use Card
8. **Refactor LoginScreen** — use Button
9. **Refactor CreateMenuSheet** — vector icons
10. **Refactor ProfileScreen** — MenuRow pattern
11. **Refactor LibraryScreen** — EmptyState
12. **Refactor VoiceOrb** — theme colors
13. **Refactor BottomSheet** — theme.overlay
14. **Add expo-haptics** — wire to primary actions
15. **Add icon tokens** — centralize sizes
16. **Document** — mobile-design-system.md, migration notes

---

## 10. Risk and Migration Notes

- **glass.ts**: Used by? Grep shows it's exported but may not be used. If unused, remove. If used, fix theme.
- **Typography fontWeight**: Changing format may affect screens that rely on 400 fallback. Verify no layout breaks.
- **Button borderRadius**: 12 → 16 is subtle; low risk.
- **RitualHomeScreen**: Switching to Card may change layout slightly (padding, blur). Test.
- **VoiceOrb**: Theme-derived colors must match current purple palette for brand consistency.
- **expo-haptics**: Add to package.json; no breaking changes.

---

## Summary

The website has a clear visual DNA: Mystical Purple, glass surfaces, gradient accents, light typography for headlines. The mobile app shares tokens and theme generation but has implementation gaps: wrong Button radius, lost font weights, theme-unaware glass, ad-hoc components instead of primitives, hardcoded colors. The path forward is to fix tokens and format, then refactor screens to use shared primitives and patterns, without introducing new UI frameworks.
