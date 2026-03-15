# Mobile Design System

**Purpose**: Canonical reference for the waQup mobile design system, derived from the website and adapted for native iOS/Android.

**Last updated**: 2026-03-13

---

## 1. Design Principles

- **Derive from website**: Visual language comes from the web; adapt for mobile, do not copy layouts blindly.
- **Premium restraint**: Apple-level clarity; Spotify/Revolut-level consistency.
- **Native feel**: Strong iPhone feel; touch targets, gestures, safe areas.
- **Token-first**: Use semantic tokens only; no arbitrary values.
- **Primitive-first**: Build screens from primitives and patterns, not one-off styles.

---

## 2. Token Rules

### Colors

- **Never hardcode hex colors.** Use `theme.colors` from `useTheme()`.
- **Semantic usage**:
  - `colors.background.primary` — main background
  - `colors.glass.opaque`, `colors.glass.light`, `colors.glass.border` — cards, surfaces
  - `colors.text.primary`, `colors.text.secondary`, `colors.text.tertiary` — text hierarchy
  - `colors.accent.primary`, `colors.accent.tertiary` — CTAs, highlights
  - `colors.overlay` — modal/sheet backdrops
  - `colors.error`, `colors.success` — feedback

### Spacing

- **Use `spacing` tokens only**: `xs` (4), `sm` (8), `md` (16), `lg` (24), `xl` (32), `xxl` (48), `xxxl` (64).
- **No arbitrary values** (e.g. `marginTop: 12`) unless truly exceptional.

### Typography

- **Use `typography` variants**: `h1`, `h2`, `h3`, `h4`, `body`, `bodyBold`, `caption`, `captionBold`, `small`, `smallBold`, `label`, `micro`.
- **Font weights**: 300 (headlines), 400 (body), 500 (label), 600 (emphasis), 700 (strong).
- **Never override `fontSize`** unless using a variant; prefer variant over inline size.

### Radius

- **Use `borderRadius` tokens**: `xs` (4), `sm` (8), `md` (12), `lg` (16), `xl` (24), `full`.
- **Buttons**: `buttonTokens.borderRadius` (16).
- **Cards**: `borderRadius.lg` (16).

### Motion

- **Use `motionTokens`**: `fast` (120ms), `normal` (180ms), `slow` (240ms), `sheet` (300ms).
- **Easing**: `easing.standard` for most transitions.

### Icons

- **Use `iconTokens`**: `sm` (16), `md` (20), `lg` (24).
- **Family**: MaterialCommunityIcons (Expo).
- **No emoji for UI icons** — use vector icons.

---

## 3. Primitives

| Component | Purpose |
|-----------|---------|
| **Screen** | Layout wrapper; safe area, padding, scrollable |
| **Typography** | Text with variant, color |
| **Button** | Primary, secondary, outline, text, ghost; sizes sm/md/lg; iconLeft |
| **Card** | Glass surface; variants default/elevated/flat/auth; pressable; noPadding |
| **Input** | Form input with label, error |
| **EmptyState** | Icon + title + body + action for empty lists |
| **ListRow** | Icon + label + description + chevron; 52pt min height |
| **SectionHeader** | h4 + optional caption |
| **Loading** | Spinner, skeleton |
| **Badge** | Small label/chip |
| **BottomSheet** | Modal bottom sheet; theme overlay |

---

## 4. Patterns

| Pattern | Usage |
|---------|-------|
| **MenuRow** | ListRow inside Card (noPadding) for Drawer, Profile, CreateMenuSheet |
| **ContentCard** | Card + icon container + title + subtitle (RitualHomeScreen, Library) |
| **AuthPillButton** | Button size="lg" fullWidth for login/signup |
| **EmptyState** | EmptyState with icon, title, body, optional Button action |

---

## 5. Never Do

- Hardcode hex colors (use theme)
- Use arbitrary spacing (use `spacing.*`)
- Use arbitrary font sizes (use typography variants)
- Use emoji for UI icons (use MaterialCommunityIcons)
- Create one-off card/row styles (use Card, ListRow)
- Use `TouchableOpacity` for primary CTAs (use Button)
- Use `TouchableOpacity` for menu/content cards (use Card pressable)
- Skip `accessibilityRole` and `accessibilityLabel` on interactive elements
- Use `rgba(0,0,0,0.5)` for overlays (use `colors.overlay`)

---

## 6. Library Strategy

- **Keep**: expo-blur, react-native-reanimated, react-native-gesture-handler, custom BottomSheet
- **Added**: expo-haptics (primary actions)
- **Skip**: Tamagui, NativeWind, @gorhom/bottom-sheet

---

## 7. File Locations

- **Shared tokens**: `packages/shared/src/theme/tokens.ts`
- **Mobile format**: `packages/mobile/src/theme/format.ts`
- **Theme provider**: `packages/mobile/src/theme/ThemeProvider.tsx`
- **Primitives**: `packages/mobile/src/components/ui/`
