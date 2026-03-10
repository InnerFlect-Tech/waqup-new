# waQup Mobile UI Audit Report

**Date**: 2026-03-10  
**Scope**: Mobile Web (responsive Next.js) + Native Mobile (Expo/React Native)  
**Target**: App Store and Google Play readiness

---

## 1. Device Matrix

| Device | Width (px) | Height (px) | Category |
|--------|------------|-------------|----------|
| iPhone SE (2nd/3rd) | 375 | 667 | Small |
| iPhone 13 mini | 375 | 812 | Small |
| iPhone 13 / 14 / 15 | 390 | 844 | Standard |
| iPhone 14 Pro / 15 Pro | 393 | 852 | Standard |
| iPhone 14 Pro Max / 15 Pro Max | 430 | 932 | Large |
| Pixel 7 | 412 | 915 | Standard |
| Pixel 7 Pro | 412 | 915 | Standard |
| Samsung Galaxy S23 | 360 | 780 | Small (Android) |
| Android small | 320–360 | 640–780 | Small |

**Viewport targets for testing**:
- 320px (minimum)
- 375px (iPhone SE, common small)
- 390px (iPhone 14)
- 414px (iPhone Plus legacy)
- 430px (Pro Max)
- 480px (breakpoint for footer single-column)

---

## 2. Safe Area Status

### Web
- `NAV_TOP_OFFSET` uses `env(safe-area-inset-top)` in format.ts
- AppLayout header uses `paddingTop: max(spacing.sm, env(safe-area-inset-top))`
- Viewport: `width: device-width`, `initialScale: 1`

### Native Mobile
- **Status**: `SafeAreaProvider` added at root in App.tsx (Phase D complete)
- `Screen`, `BottomSheet`, `Toast`, `Container` use `useSafeAreaInsets()`

---

## 3. Overflow and Layout Issues

| Location | Property | Risk |
|----------|----------|------|
| html, body | overflow-x: hidden | Intentional |
| PageShell | overflowX: hidden | May clip wide content |
| Library cards | overflow: hidden | Long titles truncated |
| Phone mockups (how-it-works, launch) | 270×540 fixed | Overflows on <375px |
| Admin/users table | minWidth: 700, overflowX: auto | Expected |

---

## 4. Touch Interaction Summary

| Component | minHeight/Size | Status |
|-----------|-----------------|--------|
| Button md/lg | 44px / 52px | OK |
| Input | 44px | OK |
| Icon-only | 44px | Fixed (was 40px) |
| BottomSheet handle | 40×4 | Acceptable |

---

## 5. Typography (from shared tokens)

- Body: 16px / 24px line-height
- Caption: 14px / 20px
- Small: 12px / 16px
- Minimum readable on mobile: 14px for secondary text

---

## 6. High-Risk Pages (Web)

- How It Works, Launch: Phone mockup overflow — **fixed** (responsive min(270px, 85vw))
- Speak: Fixed bottom panel 220px — **fixed** (min(220px, 35vh))
- Create/Conversation: height: 100vh traps — **fixed** (minHeight 100dvh)
- Library: Card overflow — uses WebkitLineClamp + ellipsis

## 7. Viewport E2E Tests

Playwright tests at `packages/web/e2e/mobile-viewport.spec.ts` verify landing, how-it-works, login at 375px/390px.

**First-time setup**: Run `npm run test:e2e:install` to download browsers (Chromium, WebKit, Firefox).

**Run tests**: `npm run test:e2e`

---

## 8. Android vs iOS Notes

- KeyboardAvoidingView: padding (iOS) vs height (Android) – implemented
- Shadows: elevation on Android – implemented in format.ts
- Back button: RN handles; verify nested modals
