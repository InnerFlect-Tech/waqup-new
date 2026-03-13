# Mobile Design Audit — Page-by-Page

**Date**: 2026-03-13  
**Purpose**: Ensure glass design, SSOT tokens, and high-quality visuals across all mobile screens.  
**Reference**: `packages/shared/src/theme/tokens.ts`, `packages/mobile/src/theme/`, `.cursor/rules/design-system.mdc`

---

## Design Principles (SSOT)

- **Colors**: Always from `theme.colors` — never hex (`#...`) or `rgba(...)` in components
- **Spacing**: From `spacing.*` tokens
- **Border radius**: From `borderRadius.*` tokens
- **Blur**: From `blurTokens` / `BLUR`
- **Layout**: From `layout.*`, `authTokens`, `homeTokens` where applicable
- **Card**: Use `Card` with `variant="default"` (glass) or `variant="auth"` for auth screens
- **Surfaces**: `colors.glass.opaque`, `colors.glass.transparent`, `colors.glass.border`

---

## Screen Inventory & Status

| Screen | Path | Glass / Tokens | Hardcoded Values | Notes |
|--------|------|---------------|------------------|-------|
| **SetupScreen** | `screens/SetupScreen.tsx` | ✅ authTokens, layout | None | Uses Card, MaterialCommunityIcons, spacing |
| **HealthScreen** | `screens/HealthScreen.tsx` | ✅ | Check | Dev/health check |
| **ShowcaseScreen** | `screens/ShowcaseScreen.tsx` | Partial | Possibly | Design showcase |
| **LoginScreen** | `screens/auth/LoginScreen.tsx` | ✅ auth | None | Card variant="auth", authTokens |
| **SignupScreen** | `screens/auth/SignupScreen.tsx` | ✅ | Check | Auth flow |
| **ForgotPasswordScreen** | `screens/auth/ForgotPasswordScreen.tsx` | ✅ | Check | Auth flow |
| **ResetPasswordScreen** | `screens/auth/ResetPasswordScreen.tsx` | ✅ | Check | Auth flow |
| **OnboardingIntentionScreen** | `screens/onboarding/OnboardingIntentionScreen.tsx` | ✅ | Check | Onboarding |
| **OnboardingProfileScreen** | `screens/onboarding/OnboardingProfileScreen.tsx` | ✅ | Check | Onboarding |
| **OnboardingPreferencesScreen** | `screens/onboarding/OnboardingPreferencesScreen.tsx` | ✅ | Check | Onboarding |
| **OnboardingGuideScreen** | `screens/onboarding/OnboardingGuideScreen.tsx` | ✅ | Check | Onboarding |
| **RitualHomeScreen** | `screens/main/RitualHomeScreen.tsx` | ✅ homeTokens | None | Primary tab |
| **LibraryScreen** | `screens/main/LibraryScreen.tsx` | ✅ | Check | Tab |
| **CreateEntryScreen** | `screens/content/CreateEntryScreen.tsx` | ✅ | Check | Create tab |
| **ProfileScreen** | `screens/main/ProfileScreen.tsx` | ✅ | Check | Tab |
| **ContentDetailScreen** | `screens/content/ContentDetailScreen.tsx` | ✅ | Check | Ritual player |
| **ContentEditScreen** | `screens/content/ContentEditScreen.tsx` | ✅ | Check | Edit metadata |
| **ContentCreateScreen** | `screens/content/ContentCreateScreen.tsx` | ✅ | None | Tokenized; colors.error, accent.primary, glass |
| **CreateModeScreen** | `screens/content/CreateModeScreen.tsx` | ✅ | None | Deprecated; uses CONTENT_TYPE_COLORS |
| **CreateVoiceStepScreen** | `screens/content/CreateVoiceStepScreen.tsx` | ✅ | Check | Voice step |
| **CreditsScreen** | `screens/sanctuary/CreditsScreen.tsx` | ✅ | Check | Credits |
| **ProgressScreen** | `screens/sanctuary/ProgressScreen.tsx` | ✅ | Check | Progress |
| **SettingsScreen** | `screens/sanctuary/SettingsScreen.tsx` | ✅ | Check | Settings |
| **RemindersScreen** | `screens/sanctuary/RemindersScreen.tsx` | ✅ | Check | Reminders |
| **MarketplaceScreen** | `screens/main/MarketplaceScreen.tsx` | ✅ | None | Tokenized; colors.warning for curated badge |
| **SpeakScreen** | `screens/main/SpeakScreen.tsx` | Partial | Check | Deprecated; Orb |
| **HomeScreen** | `screens/main/HomeScreen.tsx` | Deprecated | - | Replaced by RitualHome |

---

## Actions

1. **Replace hardcoded colors**  
   - `#F59E0B` → `colors.warning` (curated badge)  
   - `#ef4444` → `colors.error`  
   - `#9333EA` → `colors.accent.primary`  
   - Any `rgba(...)` → `colors.glass.*` or `withOpacity(colors.X, Y)`

2. **Fix require cycle**  
   - `Header.tsx` imports from `@/components` → change to `@/components/ui`

3. **Verify all Card usage**  
   - Surfaces use `Card` with glass or `backgroundColor: colors.glass.opaque`

4. **Token audit**  
   - Replace raw numbers (e.g. `padding: 12`) with `spacing.sm`, `spacing.md`, etc.

### Completed (2026-03-13)
- Header: fixed require cycle (import from `@/components/ui`)
- MarketplaceScreen: `#F59E0B` → `colors.warning` for curated badge
- ContentCreateScreen: `#ef4444` → `colors.error`, `#9333EA` → `colors.accent.primary`, bubbleAI → `colors.glass.*`
- AudioRecorder: `#ef4444` → `colors.error` for recording state
- Button: web gradient uses `colors.accent.primary`, `colors.accent.secondary`
- QCoin: theme-aware (accent.primary, background.tertiary, text.onDark)

---

## Terminal Warnings (Non-blocking)

| Warning | Action |
|---------|--------|
| WebCrypto not supported (Expo Go) | OAuth may fall back to `plain`; use dev build for PKCE |
| expo-av deprecated | Plan migration to expo-audio/expo-video for SDK 54 |
| expo-notifications in Expo Go | Use development build for push |
| IAP / RevenueCat key not set | Add env var for production |
| Require cycle | Fix Header import path |
