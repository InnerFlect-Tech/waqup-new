# waQup Analytics Implementation Guide

How to use analytics in waQup, add new events, and read funnels in GA4.

---

## Overview

Analytics uses a **transport-agnostic** design: events are defined in `packages/shared/src/utils/analytics.ts` and forwarded to GA4 via a platform transport (`AnalyticsProvider` on web). Never call `window.gtag` directly.

---

## Event List

See [analytics-events.md](./analytics-events.md) for the full taxonomy.

---

## How to Track New Events

1. **Add a typed helper** in `packages/shared/src/utils/analytics.ts`:

   ```typescript
   myNewEvent: (param: string, userId?: string) =>
     trackEvent('my_new_event', { param }, userId),
   ```

2. **Call it from your component** at the point of confirmed success (not on click):

   ```typescript
   import { Analytics } from '@waqup/shared/utils';

   if (result.success) {
     Analytics.myNewEvent('value', user?.id);
   }
   ```

3. **Update** [analytics-events.md](./analytics-events.md) with the new event.

---

## Debug Mode

In development (`NODE_ENV !== 'production'`):
- GA4 scripts do not load.
- All events are logged to `console.debug` with `[analytics]` prefix.
- Filter by `[analytics]` in DevTools to inspect events.

Set `NEXT_PUBLIC_ANALYTICS_DEBUG=true` in production build for additional logging if needed.

---

## Page Views

Page views are tracked automatically by `GoogleAnalyticsTracker` on every client-side route change. No manual `trackPageView` call needed unless you have a special case.

For manual overrides:

```typescript
import { trackPageView } from '@/lib/analytics';
trackPageView('/custom-path', 'Custom Title');
```

---

## Conversions in GA4

1. Go to **GA4 Admin → Events**.
2. Find the event (e.g. `sign_up`, `purchase`).
3. Toggle **Mark as conversion**.

Recommended conversions: `sign_up`, `purchase`, `onboarding_step_completed` (step: `intention`), `funnel_paid_conversion`.

---

## How to Read Funnels in GA4

### Funnel Exploration

1. **Explore → Create exploration → Funnel exploration**.
2. Add steps:
   - Step 1: `funnel_signup_started` or `page_view` (page = signup)
   - Step 2: `funnel_signup_completed` or `sign_up`
   - Step 3: `content_created` (filter: `content_type = ritual`) or `funnel_first_ritual`
   - Step 4: `funnel_paid_conversion` or `purchase`
3. Set **Breakdown** (optional): e.g. by `user_id` for cohort view.

### Key Funnel: Landing → Signup → First Ritual → Paid

| Step | Event |
|------|-------|
| Started signup | `funnel_signup_started` |
| Completed signup | `funnel_signup_completed` |
| First ritual created | `funnel_first_ritual` |
| Paid conversion | `funnel_paid_conversion` |

---

## Performance

- GA script: `afterInteractive` — does not block initial paint.
- Consent script: minimal inline (~500 bytes).
- Events are fire-and-forget; analytics never blocks the app.

---

## Validation

How to verify analytics events fire correctly and reach GA4.

### Manual Verification

**Development mode**: In dev (`npm run dev`), GA4 scripts do not load. All events are logged to the console. Open DevTools → Console, filter by `[analytics]`, and perform flows to confirm expected events appear.

**Production / Staging with GA4 DebugView**: Deploy to staging with `NEXT_PUBLIC_GA_MEASUREMENT_ID` set. Open GA4 → Admin → DebugView. Add `?gtm_debug=x` to the URL or use the GA4 DebugView extension. Run through flows and verify events appear in real time.

### Playwright E2E

Analytics specs live in `packages/web/e2e/specs/analytics/analytics-events.spec.ts`. Run: `npx playwright test specs/analytics/`. A mock `window.gtag` is injected; events are pushed to `window.__analyticsEvents` for assertions.

### Event Checklist

| Event | Trigger | Where to Verify |
|-------|---------|-----------------|
| `funnel_signup_started` | Visit /signup | E2E spec |
| `sign_up` | Complete signup | Manual or E2E |
| `login` | Complete login | Manual or E2E |
| `content_played` | Press play on content | Manual |
| `content_completed` | Audio finishes | Manual |
| `content_shared` | Click Share | Manual |
| `credits_purchased` | Stripe success return | Manual |
| `subscription_started` | Stripe success return | Manual |
| `funnel_paid_conversion` | First purchase | Manual |
| `session_start` | Authenticated load | Manual |

### GA4 Admin Setup

1. **Mark conversions**: Admin → Events → toggle "Mark as conversion" for `sign_up`, `purchase`, `funnel_paid_conversion`.
2. **Create funnel exploration**: Explore → Funnel exploration → add funnel events as steps.
3. **Verify data**: Reports → Realtime → perform actions and confirm events within seconds.

---

## Related Docs

- [analytics-events.md](./analytics-events.md) — Event taxonomy
