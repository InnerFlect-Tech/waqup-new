# Spotify-Style Menu Structure — Adapted to waQup Buttons

**Purpose:** Map Spotify's navigation structure onto waQup's existing buttons and screens. No new destinations; only reorganisation and layout.

---

## Tech Stack & Implementation Details

Defined stack for reaching a professional, production-ready implementation. All packages align with Expo SDK 54 and waQup's existing dependencies. Based on React Navigation docs, Expo SDK 54 changelog, and Spotify-style app reference implementations.

### Package Versions (Expo SDK 54 — waQup mobile)

| Package | waQup version | Notes |
|---------|---------------|-------|
| `expo` | ~54.0.33 | Pins compatible native deps |
| `react-native-reanimated` | ~4.1.1 | Required by drawer; avoid v3 (Expo 54 ships v4) |
| `react-native-gesture-handler` | ~2.28.0 | Must wrap app in `GestureHandlerRootView` |
| `react-native-worklets` | 0.5.1 | Reanimated worklets dependency |
| `react-native-screens` | ~4.16.0 | Native screen stack |
| `react-native-safe-area-context` | ~5.6.0 | SafeArea for drawer/header |
| `expo-blur` | ^15.0.8 | BlurView for tab bar, sheet backdrop |

### Navigation Layer

| Package | Version | Role |
|---------|---------|------|
| `@react-navigation/native` | ^7.1.x (existing) | Core navigation |
| `@react-navigation/native-stack` | ^7.1.x (existing) | Stack for ContentCreate, Credits, Settings, etc. |
| `@react-navigation/bottom-tabs` | ^7.1.x (existing) | Bottom tabs (Ritual, Library, Profile) |
| `@react-navigation/drawer` | **Add** — use Expo-pinned | Left drawer; wraps Main tabs |

**Drawer config (best practice):**
- `drawerType: 'front'` — overlay (Spotify-style)
- `drawerPosition: 'left'`
- `edgeWidth: 20` — gesture from screen edge
- `drawerContent` — custom `DrawerContentScrollView` + profile block
- Programmatic control: `navigation.openDrawer()`, `navigation.closeDrawer()`, `navigation.toggleDrawer()`

**Custom DrawerContent pattern:**
```tsx
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
// Profile block (avatar, name, View profile) above DrawerContentScrollView
// DrawerItemList or custom items (Credits, Progress, Reminders, Settings) inside
// Sign Out at bottom, outside scroll
```

### Animation & Gesture Dependencies

| Package | Version | Role |
|---------|---------|------|
| `react-native-reanimated` | ~4.1.1 (existing) | Drawer animations, sheet transitions |
| `react-native-gesture-handler` | ~2.28.0 (existing) | Drawer swipe gestures |
| `react-native-worklets` | 0.5.1 (existing) | Reanimated worklets (required by drawer) |

**Babel:** `react-native-reanimated/plugin` must be **last** in `babel.config.js`. Run `npx expo start --clear` after changes.

### Bottom Sheet (CreateMenuSheet)

| Approach | Rationale |
|----------|-----------|
| **Existing `BottomSheet`** ([packages/mobile/src/components/layout/BottomSheet.tsx](packages/mobile/src/components/layout/BottomSheet.tsx)) | Uses Modal + Animated + expo-blur; no `@gorhom/bottom-sheet` |
| **@gorhom/bottom-sheet** | Avoid — Expo 54 + Reanimated 4 known issues |

**Sheet UX:**
- Snap points: fixed height ~40–50% of screen
- Backdrop tap to close
- Handle bar for affordance
- Spring-like close on option select

### Glass / Blur Effects

| Package | Version | Role |
|---------|---------|------|
| `expo-blur` | ^15.0.8 (existing) | Tab bar `BlurView`, drawer background, sheet backdrop |

**Drawer styling:** Optional `BlurView` behind drawer content; `colors.glass.opaque`, `colors.glass.border` from theme.

### Shared Design Tokens

| Source | Usage |
|--------|-------|
| `@waqup/shared/theme` (tokens, themes) | `spacing`, `borderRadius`, `typography`, `layout`, `authTokens` |
| `colors.glass.opaque`, `colors.glass.border` | Drawer, header, sheet surfaces |
| `buttonTokens.minHeight.lg` (52px) | Touch targets for drawer items, sheet rows |

### Installation

```bash
cd packages/mobile
npx expo install @react-navigation/drawer
```

No version override — Expo will resolve compatible versions.

### Exact Versions (waQup mobile package.json)

| Package | Current | Notes |
|---------|---------|------|
| expo | ~54.0.33 | SDK 54 |
| react-native-reanimated | ~4.1.1 | Required by drawer; avoid @gorhom/bottom-sheet |
| react-native-gesture-handler | ~2.28.0 | Swipe gestures |
| react-native-worklets | 0.5.1 | Reanimated peer |
| expo-blur | ^15.0.8 | Tab bar: `intensity={80} tint="dark"`; sheet backdrop: `intensity={20}` |

### UX Best Practices (from research)

- **Drawer edgeWidth**: 20–30px for comfortable swipe-from-edge
- **Touch targets**: Min 44pt (Apple HIG) — use `buttonTokens.minHeight.lg` (52px) for drawer items
- **Responsive drawer**: Use `useWindowDimensions()` — `drawerType: isLargeScreen ? 'permanent' : 'front'` for tablet/desktop
- **Bottom sheet**: Modal type for CreateMenuSheet (focused task); backdrop tap + handle bar for dismiss affordance

### Root Structure

```
GestureHandlerRootView (wrap at app root if not already)
  └── NavigationContainer
        └── RootStack (Setup | Auth | Onboarding | Main)
              └── Main = Drawer.Navigator
                    ├── drawerContent: CustomDrawerContent
                    └── Tabs (Stack.Navigator)
                          └── Tab.Navigator (Ritual, Library, Profile)
                                └── Screens
```

### Exact Versions (waQup mobile package.json)

| Package | waQup Version | Expo 54 Pinned |
|---------|---------------|----------------|
| expo | ~54.0.33 | SDK 54 |
| react-native-reanimated | ~4.1.1 | Required for drawer |
| react-native-gesture-handler | ~2.28.0 | Required for drawer |
| react-native-worklets | 0.5.1 | Reanimated worklets |
| expo-blur | ^15.0.8 | BlurView for tab bar, sheet |
| react-native-screens | ~4.16.0 | Native stack |
| react-native-safe-area-context | ~5.6.0 | SafeArea for drawer |

### Professional UX Patterns (from research)

- **Modal bottom sheet**: Overlay with backdrop; focused task; tap backdrop to dismiss
- **Drawer edgeWidth**: 20–30px gesture zone from screen edge (React Navigation default)
- **BlurView**: `intensity={80}` for tab bar, `intensity={20}` for sheet backdrop; `tint="dark"` for dark theme
- **Touch targets**: 44pt minimum (Apple HIG); `buttonTokens.minHeight.lg` = 52px for drawer/sheet rows
- **Responsive**: Optional `useWindowDimensions()` for tablet — `drawerType: 'permanent'` if width ≥ 768

### Exact Versions (waQup mobile package.json)

| Package | waQup Version | Expo 54 Compatible |
|---------|---------------|--------------------|
| expo | ~54.0.33 | Yes |
| react-native | 0.81.5 | Yes |
| react-native-reanimated | ~4.1.1 | Yes (Expo pins this) |
| react-native-gesture-handler | ~2.28.0 | Yes |
| react-native-worklets | 0.5.1 | Yes |
| react-native-screens | ~4.16.0 | Yes |
| react-native-safe-area-context | ~5.6.0 | Yes |
| expo-blur | ^15.0.8 | Yes |

### UX Best Practices (from research)

- **Touch targets:** 44×44pt minimum (Apple HIG) — use `buttonTokens.minHeight.lg` (52px) or `layout.tabBarHeight` for drawer/sheet rows
- **BlurView:** `intensity={80}` for tab bar; `intensity={20}` for sheet backdrop; `tint="dark"` for dark theme
- **Responsive drawer:** For tablets, consider `drawerType={width >= 768 ? 'permanent' : 'front'}` via `useWindowDimensions()`
- **Sheet affordance:** Visible handle bar; backdrop tap to dismiss; spring-like close animation (~250–300ms)

### References

- [React Navigation Drawer](https://reactnavigation.org/docs/drawer-navigator) — config, custom content
- [Expo Drawer docs](https://docs.expo.dev/router/advanced/drawer/) — Expo + drawer setup
- [expo-blur](https://docs.expo.dev/versions/latest/sdk/blur-view/) — BlurView props
- [Spotify clone (RN)](https://github.com/devandres-tech/RN-Spotify-Clone-Redesigned) — reference architecture
- [Bottom sheet UX patterns](https://gorhom.github.io/react-native-bottom-sheet/) — concepts (we use custom component)
- [expo-blur](https://docs.expo.dev/versions/latest/sdk/blur-view/) — BlurView usage
- [Bottom sheet UX best practices](https://gorhom.github.io/react-native-bottom-sheet/) — concepts (we use custom component)

---

## Button Mapping (Source of Truth)

### Drawer Content ← ProfileScreen

| Drawer Item | Source in ProfileScreen | Action |
|-------------|------------------------|--------|
| [Avatar] + display name | User card | — |
| View profile | New (Spotify pattern) | jumpTo('Profile') |
| Credits (QCoin + balance) | Credits row in user card | navigate('Credits') |
| Progress | Menu item "Progress" | navigate('Progress') |
| Reminders | Menu item "Reminders" | navigate('Reminders') |
| Settings | Menu item "Account Settings" (covers Voice Settings, Privacy & Data) | navigate('Settings') |
| Sign Out | Sign Out button | logout() |

### CreateMenuSheet ← CreateEntryScreen

| Sheet Row | Source in CreateEntryScreen | Action |
|-----------|-----------------------------|--------|
| Rituals | Ritual card | ContentCreate(ritual, chat) |
| Affirmations | Affirmation card | ContentCreate(affirmation, chat) |
| Meditations | Meditation card | ContentCreate(meditation, chat) |

Use `CONTENT_TYPE_COPY`, `CONTENT_TYPE_COLORS` from `@waqup/shared/constants`. Same order (ritual-first), same copy (`depth`, `shortDesc`).

### Header ← Current + New

| Position | Before | After |
|----------|--------|-------|
| Left | (empty) | Profile avatar (tap → open drawer) |
| Center | (empty) | Tab title: Ritual / Library / Profile |
| Right | QBalanceBadge | QBalanceBadge + Plus icon |

**Plus** opens CreateMenuSheet. On row tap → close sheet + navigate to ContentCreate.

### Bottom Tabs

| Before | After |
|--------|-------|
| Ritual, Library, **Create**, Profile | Ritual, Library, Profile |

Create tab removed. Create entry points:
1. **+** in header → CreateMenuSheet → ContentCreate
2. RitualHomeScreen 3 cards → ContentCreate (unchanged)
3. LibraryScreen empty "Create Practice" → ContentCreate (unchanged)

---

## What Stays the Same

- **RitualHomeScreen:** 3 cards (Affirmations, Meditations, Rituals) — keep
- **LibraryScreen:** Search bar, filter pills (All/Affirmations/Meditations/Rituals), empty state — keep
- **ProfileScreen:** Full menu (Account Settings, Progress, Reminders, Voice Settings, Privacy & Data), Sign Out — keep; drawer is a quick-access mirror
- **BottomSheet:** Reuse existing component for CreateMenuSheet

---

## What Changes

1. **Add** @react-navigation/drawer → wrap Main tabs
2. **Add** DrawerContent.tsx (avatar, Credits, Progress, Reminders, Settings, Sign Out)
3. **Add** CreateMenuSheet.tsx (3 options from CreateEntryScreen)
4. **Add** shared header (avatar left, title center, QBalanceBadge + Plus right)
5. **Remove** Create tab from bottom tabs
6. **Remove** CreateEntryScreen as tab — its content moves into CreateMenuSheet

---

## Nav Translations (en)

Bottom tabs use `nav.json`. After removing Create:
- `ritual`, `library`, `profile` — keep
- `create` — remove from tabs; only used for CreateMenuSheet title if needed

---

## Sync with Cursor Plan

Copy the **Tech Stack & Implementation Details** section above into the Cursor plan file (`~/.cursor/plans/spotify-style_menu_structure_712aea0b.plan.md`) to keep it up to date.
