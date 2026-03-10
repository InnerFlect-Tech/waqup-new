# Analytics Validation Guide

How to verify analytics events fire correctly and reach GA4.

---

## Manual Verification

### 1. Development Mode

In dev (`npm run dev`), GA4 scripts do not load. All events are logged to the console:

1. Open DevTools → Console.
2. Filter by `[analytics]`.
3. Perform flows (signup, login, playback, etc.).
4. Confirm expected events appear.

### 2. Production / Staging with GA4 DebugView

1. Deploy to staging with `NEXT_PUBLIC_GA_MEASUREMENT_ID` set.
2. Open GA4 → Admin → DebugView.
3. Option A: Add `?gtm_debug=x` to the URL (if GTM is used).
4. Option B: Use the GA4 DebugView extension or connect from the GA4 UI.
5. Run through flows and verify events appear in real time.

---

## Playwright E2E

Analytics specs live in `packages/web/e2e/specs/analytics/analytics-events.spec.ts`.

### Run Analytics Specs

```bash
cd packages/web
npx playwright test specs/analytics/
```

### How It Works

- A mock `window.gtag` is injected before page load.
- Events are pushed to `window.__analyticsEvents`.
- Tests assert expected events were fired.

### Add New Assertions

```typescript
const events = await page.evaluate(() => (window as any).__analyticsEvents);
const hasEvent = events.some(
  (args) => Array.isArray(args) && args[0] === 'event' && args[1] === 'your_event_name',
);
expect(hasEvent).toBe(true);
```

---

## Event Checklist

| Event | Trigger | Where to Verify |
|-------|---------|-----------------|
| `funnel_signup_started` | Visit /signup | E2E spec |
| `sign_up` | Complete signup | Manual or E2E (with auth) |
| `login` | Complete login | Manual or E2E |
| `content_played` | Press play on content | Manual (AudioPage, ContentDetailPage) |
| `content_completed` | Audio finishes | Manual |
| `content_shared` | Click Share | Manual |
| `credits_purchased` | Stripe success return | Manual (checkout flow) |
| `subscription_started` | Stripe success return | Manual |
| `funnel_paid_conversion` | First purchase | Manual |
| `session_start` | Authenticated load | Manual (check console when logged in) |

---

## GA4 Admin Setup

1. **Mark conversions**: Admin → Events → toggle "Mark as conversion" for `sign_up`, `purchase`, `funnel_paid_conversion`.
2. **Create funnel exploration**: Explore → Funnel exploration → add funnel events as steps.
3. **Verify data**: Reports → Realtime → perform actions and confirm events within seconds.
