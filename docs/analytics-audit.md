# waQup Analytics Audit Report

**Date**: 2026-03-10  
**Scope**: Google Analytics 4 implementation across Next.js web app  
**Status**: Audit complete; implementation plan attached

---

## Executive Summary

waQup has a **solid foundation** for analytics: transport-agnostic design in shared, GA4 Consent Mode v2, typed `Analytics.*` helpers, and page view tracking. However, **many events are defined but never fired**, funnel tracking is absent, and several structural improvements are needed for production-level SaaS analytics.

---

## 1. Current Implementation

### 1.1 Components That Exist and Work

| Component | Location | Status |
|-----------|----------|--------|
| Analytics transport | `packages/shared/src/utils/analytics.ts` | Single source of truth; transport-agnostic |
| GA4 wiring | `packages/web/src/components/AnalyticsProvider.tsx` | Forwards events to `window.gtag` |
| Page view tracking | `packages/web/src/components/analytics/GoogleAnalyticsTracker.tsx` | Fires `page_view` on pathname/searchParams change |
| Consent Mode v2 | Inline script in `packages/web/app/[locale]/layout.tsx` | Default `denied`; runs before gtag.js |
| Cookie banner | `packages/web/src/components/analytics/CookieConsentBanner.tsx` | Grants/denies via `gtag('consent','update')` |
| GA script loading | Same layout | `strategy="afterInteractive"`; `send_page_view: false` (manual `page_view`) |

### 1.2 Script Injection Architecture

```
layout.tsx (locale)
├── <head>: Consent default script (sync, inline) — ONLY if GA_ID
├── <body>:
│   ├── GA gtag.js (afterInteractive) — ONLY if GA_ID AND production
│   ├── GA config script (afterInteractive)
│   ├── AnalyticsProvider (initAnalytics → gtag transport)
│   ├── Suspense > GoogleAnalyticsTracker (page_view on route change)
│   └── <Analytics /> (Vercel Analytics)
```

**Vercel Analytics** runs alongside GA4. It provides Web Vitals + page views on Vercel. Different purpose than GA4 (performance vs product analytics). Keep both.

### 1.3 Events Implemented (Actually Fired)

| Event | Where Fired |
|-------|-------------|
| `sign_up` | `signup/page.tsx` (email signup success) |
| `login` | `login/page.tsx` (email + Google), `TestLoginButton.tsx` |
| `logout` | `profile/page.tsx`, `sanctuary/settings/page.tsx` |
| `onboarding_step_completed` | All onboarding pages (intention, profile, role, preferences, guide) |
| `content_created` | `ContentCompleteStep.tsx` |
| `begin_checkout` | `get-qs/page.tsx`, `sanctuary/credits/buy/page.tsx`, `pricing/page.tsx` |
| `purchase` (credits) | `sanctuary/credits/page.tsx` (checkout success) |
| `purchase` (subscription) | `sanctuary/page.tsx` (checkout success) |

---

## 2. Missing Events

| Event | Helper | Missing Usage |
|-------|--------|---------------|
| `content_played` | `Analytics.contentPlayed` | `AudioPage.tsx`, `ContentDetailPage.tsx`, play routes |
| `content_completed` | `Analytics.contentCompleted` | Same playback components (on `ended` event) |
| `share` | `Analytics.contentShared` | Share buttons in content detail / player |
| `referral_shared` | `Analytics.referralShared` | `sanctuary/referral/page.tsx` |
| `view_item` | `Analytics.marketplaceItemViewed` | `marketplace/[id]/page.tsx` |
| `session_start` | `Analytics.sessionStarted` | Post-auth (middleware or app shell) |
| `app_error` | `Analytics.errorOccurred` | Error boundaries, auth/payment failures |

---

## 3. Structural Problems

1. **Credits success page**: `sanctuary/credits/page.tsx` uses `useEffect(..., [])` — `user?.id` may be undefined when effect runs. Should depend on `[searchParams, user?.id]` and guard.

2. **No funnel events**: Funnel (Landing → Signup → Trial → First Ritual → Paid) is not explicitly tracked. Can be derived from existing events in GA4, but dedicated funnel events improve clarity and Exploration setup.

3. **No lib/analytics.ts**: Current flow uses shared `Analytics.*` directly. A web-specific `lib/analytics.ts` with `trackEvent`, `trackPageView`, `trackConversion` would centralise web usage.

4. **Page view consent**: `GoogleAnalyticsTracker` does not explicitly check consent before firing. GA4 Consent Mode causes GA to drop hits when `analytics_storage: denied`, so behaviour is correct. Optional: skip gtag call when consent denied to reduce noise.

5. **GA loads only in production**: Layout gates GA scripts on `NODE_ENV === 'production'`. In dev, `window.gtag` is undefined; `AnalyticsProvider` no-ops; console.debug still logs. Correct.

---

## 4. Performance Risks

- **Low**: GA script uses `afterInteractive` — does not block initial paint
- Consent script: sync inline — minimal (few hundred bytes)
- No duplicate gtag.js
- Vercel Analytics is lightweight

**Assessment**: No significant performance risks.

---

## 5. Privacy Issues

- **Consent Mode v2**: Default `denied`; data withheld until user accepts
- **No PII**: Events use opaque `user_id` (Supabase UUID); no email, name, or phone
- **url_passthrough** and **ads_data_redaction** set
- Cookie banner stores decision in `localStorage` (`waqup_cookie_consent`)

**Assessment**: Privacy implementation is strong and GDPR-aware.

---

## 6. Duplicated Scripts

- **None**: Single GA4 property; single gtag.js load
- Vercel Analytics is separate (different product) — not duplication

---

## 7. Incorrect GA Setup

- **send_page_view: false** — correct; we fire `page_view` manually via `GoogleAnalyticsTracker` on SPA route changes
- **Consent before gtag** — correct; consent script runs synchronously in head
- **user_id** — passed where available for cross-device tracking

**Assessment**: GA4 setup is correct.

---

## 8. Marketing Funnel Measurability

| Funnel Step | Measurable? | Current Event |
|-------------|-------------|---------------|
| Landing view | Yes | `page_view` |
| Signup started | Partial | `page_view` on `/signup` only |
| Signup completed | Yes | `sign_up` |
| Trial started | Partial | `subscriptionStarted` with plan metadata |
| First ritual | Yes | `content_created` (type: ritual) |
| Paid conversion | Yes | `purchase` (credits or subscription) |

**Gap**: Explicit funnel events (`funnel_signup_started`, `funnel_signup_completed`, `funnel_first_ritual`, `funnel_paid_conversion`) would improve Exploration setup and reporting clarity.

---

## 9. Conversion Definition

- **In GA4**: Mark as conversions in Admin → Events → Mark as conversion
- **Recommended conversions**: `sign_up`, `purchase` (all), `onboarding_step_completed` (step: `intention`)

---

## 10. Recommendations Summary

1. Fix credits checkout-success effect (user?.id in deps)
2. Add `lib/analytics.ts` web adapter
3. Wire missing events: contentPlayed, contentCompleted, contentShared, referralShared, marketplaceItemViewed, sessionStarted
4. Add funnel events for funnel visualization
5. Add new helpers: credits_spent, credits_low, cta_clicked, waitlist_joined, admin_page_accessed, voice_recorded, ai_voice_generated
6. Document event taxonomy and implementation guide
