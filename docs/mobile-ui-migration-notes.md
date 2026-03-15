# Mobile UI Migration Notes

**Purpose**: Document what changed in the mobile design system implementation and how to build new screens consistently.

**Date**: 2026-03-13

---

## What Changed

### Tokens

- **Added** `motionTokens` (fast, normal, slow, sheet) and `iconTokens` (sm, md, lg) in `packages/shared/src/theme/tokens.ts`.
- **Fixed** typography `fontWeight` in mobile format: now supports 300, 500 (previously only 400, 600, 700).
- **Removed** `glass.ts` — was unused and used static colors; components use theme directly.

### Components

- **Button**: Uses `buttonTokens.borderRadius` (16) instead of `borderRadius.md` (12). Added `iconLeft` prop. Added haptic feedback on primary/secondary press.
- **BottomSheet**: Backdrop uses `theme.colors.overlay` instead of hardcoded `rgba(0,0,0,0.5)`. Animation duration uses `motionTokens.sheet`.
- **Card**: Added `noPadding` prop for menu/list rows.
- **New**: `EmptyState`, `ListRow`, `SectionHeader`.

### Screens Refactored

| Screen | Changes |
|--------|---------|
| RitualHomeScreen | TouchableOpacity cards → Card (pressable); iconTokens |
| LoginScreen | TouchableOpacity pill buttons → Button (primary, secondary); iconLeft for Google |
| CreateMenuSheet | Emoji → MaterialCommunityIcons; TouchableOpacity → ListRow; haptics |
| LibraryScreen | Custom empty/error cards → EmptyState |
| ProfileScreen | TouchableOpacity + emoji → Card (pressable) + ListRow; MaterialCommunityIcons |

### Other

- **VoiceOrb**: Hardcoded hex → theme-derived colors via `getOrbColors(theme.colors.accent, theme.colors.error)`.
- **expo-haptics**: Added; wired to Button (primary/secondary) and CreateMenuSheet tile press.

---

## Migration Steps for New Screens

1. **Import theme**: `useTheme()`, `spacing`, `borderRadius`, `iconTokens`, etc. from `@/theme`.
2. **Use primitives**: Prefer `Card`, `Button`, `ListRow`, `EmptyState`, `SectionHeader` over custom layouts.
3. **Use tokens**: No hardcoded colors, spacing, or font sizes.
4. **Accessibility**: Add `accessibilityRole="button"` and `accessibilityLabel` to interactive elements.
5. **Empty/error states**: Use `EmptyState` with icon, title, body, optional action.
6. **Menu rows**: Use `ListRow` inside `Card` with `noPadding` for settings, drawer items, etc.
7. **Icons**: Use `MaterialCommunityIcons` with `iconTokens.lg` (24) for list/nav.

---

## References

- [mobile-design-system-audit.md](./mobile-design-system-audit.md) — Full audit and rationale
- [mobile-design-system.md](./mobile-design-system.md) — Token rules and primitives
