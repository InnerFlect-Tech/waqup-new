# Phase 16: Advanced Features

## Overview

Phase 16 adds the production-hardening layer: biometric authentication, offline caching, analytics instrumentation, push notifications, and security hardening. These features move waQup from MVP to a production-grade platform.

---

## NOW State (Analysis Against Codebase)

### What Already Exists

| Feature | Status | Location |
|---|---|---|
| React Query offline persistence | ✅ Complete | `packages/mobile/src/app/App.tsx` (PersistQueryClientProvider) |
| Audio local caching | ✅ Wired | `expo-file-system` + Supabase signed URLs |
| Push notifications config | ⏳ Pending | Not yet implemented |
| Biometric auth hook | ✅ Implemented (this phase) | `packages/mobile/src/hooks/useBiometricAuth.ts` |
| Analytics shared utility | ✅ Implemented (this phase) | `packages/shared/src/utils/analytics.ts` |
| Analytics transport (web) | ✅ Stub (this phase) | `packages/web/src/components/AnalyticsProvider.tsx` |
| Analytics transport (mobile) | ✅ Stub (this phase) | `packages/mobile/src/app/App.tsx` |
| Service Worker (web offline) | ✅ Implemented | `packages/web/public/sw.js` |

### What Was Missing (Fixed This Phase)

1. **Analytics infrastructure** — `Analytics` utility + typed event helpers in shared; init in both platforms
2. **Biometric authentication hook** — `useBiometricAuth` using `expo-local-authentication`; biometric permissions in `app.json`
3. **Phase 16 documentation** — This document

---

## AFTER State (Target)

### Analytics Pipeline

```
User action (create, play, share, purchase)
  → Analytics.eventName() helper
  → trackEvent() in shared
  → Platform transport (web: PostHog; mobile: Mixpanel or PostHog RN)
  → Analytics dashboard (PostHog Cloud recommended)
```

**Key Events Instrumented:**
- `content_created` — type, mode (form/chat/agent) ✅
- `content_played` — content ID, type
- `credits_purchased` — pack ID, amount ✅
- `subscription_started` — plan ID ✅
- `referral_shared` — platform ✅
- `content_shared` — content ID, platform ✅
- `signup_completed` — method, referral code ✅
- `session_started` — user ID ✅

### Biometric Auth Flow (Mobile)

```
User opens app → settings toggle "Use biometrics" ON
  → useBiometricAuth() checks availability + enrollment
  → On next cold start → prompt Face ID / Touch ID
  → Success → skip password entry
```

The `useBiometricAuth` hook is ready. Integration into the unlock/login flow is pending.

### Push Notifications Flow

```
User grants permission (onboarding or settings screen)
  → expo-notifications registers for push token
  → Token saved to profiles.push_token
  → Server (Supabase Edge Function) sends notifications for:
    - Practice reminders (daily/weekly)
    - New content from followed creators
    - Credit expiry warnings
    - Streak maintenance nudges
```

---

## Implementation Status

### Completed ✅

- `packages/shared/src/utils/analytics.ts` — Transport-agnostic analytics with typed helpers
- `packages/shared/src/utils/index.ts` — Exported analytics
- `packages/web/src/components/AnalyticsProvider.tsx` — Web transport init
- `packages/web/app/layout.tsx` — AnalyticsProvider mounted
- `packages/mobile/src/app/App.tsx` — Mobile analytics transport init
- `packages/mobile/src/hooks/useBiometricAuth.ts` — Full biometric auth hook
- `packages/mobile/src/hooks/index.ts` — Exported useBiometricAuth
- `packages/mobile/app.json` — Biometric permissions (NSFaceIDUsageDescription, USE_BIOMETRIC, USE_FINGERPRINT)
- `expo-local-authentication` — Installed in mobile package

### Pending

- [ ] **Push notifications** — Install `expo-notifications`, add push token to profiles table, create Supabase Edge Function for sending
- [ ] **Analytics production transport** — Wire to PostHog (recommended) or Mixpanel for real event capture
- [ ] **Biometric unlock UI** — Add toggle to mobile SettingsScreen + use `useBiometricAuth` in `RootNavigator` lock screen
- [ ] **Offline audio download** — "Save for offline" button in content detail; use `expo-file-system` to cache MP3
- [ ] **Security hardening** — Certificate pinning, jailbreak detection (optional)

---

## Analytics Event Catalogue

```typescript
// All events available via:
import { Analytics } from '@waqup/shared/utils';

Analytics.contentCreated(type, mode, userId)
Analytics.contentPlayed(contentId, type, userId)
Analytics.creditsPurchased(packId, amount, userId)
Analytics.subscriptionStarted(planId, userId)
Analytics.referralShared(platform, userId)
Analytics.contentShared(contentId, platform, userId)
Analytics.signupCompleted(method, referralCode)
Analytics.sessionStarted(userId)

// Or raw:
import { trackEvent } from '@waqup/shared/utils';
trackEvent('custom_event', { custom_prop: 'value' });
```

---

## Biometric Auth Usage

```typescript
import { useBiometricAuth } from '@/hooks';

function LockScreen() {
  const { isAvailable, biometricType, authenticate } = useBiometricAuth();

  const handleUnlock = async () => {
    const result = await authenticate('Unlock your Sanctuary');
    if (result.success) {
      // navigate to app
    }
  };

  return isAvailable ? (
    <Button onPress={handleUnlock}>
      {biometricType === 'face' ? 'Use Face ID' : 'Use Touch ID'}
    </Button>
  ) : null;
}
```

---

## Success Metrics

- Analytics events firing on key user actions: 100%
- Biometric auth adoption: > 40% of mobile users
- Push notification opt-in rate: > 60%
- Offline content access: > 20% of sessions
- App crash rate: < 0.1%

---

**Status**: 🟡 Partially Complete — Analytics + biometric hook done; push notifications pending
**Priority**: Medium (polish & retention)
**Dependencies**: None blocking — can be completed independently
