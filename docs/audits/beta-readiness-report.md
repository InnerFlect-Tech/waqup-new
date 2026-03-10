# waQup Beta Readiness Report

**Date**: 2026-03-10  
**Auditor**: Automated Playwright Audit + Code Review  
**Scope**: Web app (`packages/web/`) — all routes, flows, auth, credits, audio, creation pipelines

---

## Executive Summary

**VERDICT: CONDITIONALLY READY FOR LIMITED BETA**

The core user journey (Landing → Signup → Onboarding → Sanctuary → Speak → Credits) is functional. The creation pipelines are mostly intact but require the route ambiguity to be verified in a running environment. Thirteen code issues were identified; 8 were fixed during this audit. Five issues remain for the team to action before opening beta to external users.

---

## App Structure Summary

### Route Groups

| Group | Routes | Auth Required |
|---|---|---|
| `(auth)` | `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/confirm-email` | No |
| `(main)` | `/library`, `/create`, `/create/conversation`, `/create/orb`, `/speak`, `/profile`, `/marketplace` | Yes |
| `(marketing)` | `/how-it-works`, `/pricing`, `/launch`, `/funnels`, `/investors`, `/get-qs` | No |
| `(onboarding)` | `/onboarding`, `/onboarding/profile`, `/onboarding/preferences`, `/onboarding/guide` | Yes |
| `sanctuary/` | `/sanctuary` + 12 sub-routes (credits, settings, progress, voice, reminders, plan, etc.) | Yes |
| `admin/` | `/admin`, `/admin/users`, `/admin/content`, `/admin/waitlist` | Yes (superadmin) |
| Root | `/`, `/join`, `/waitlist`, `/privacy`, `/play/[id]` | No |

### Auth Architecture

- **Client-side only** via `AuthProvider.tsx` — no Next.js `middleware.ts`
- Three-tier gate: unauthenticated → `/`, logged in but no `access_granted` → `/coming-soon`, full access → app
- Override login system for E2E testing: guarded by `NEXT_PUBLIC_ENABLE_TEST_LOGIN=true`

### Critical Flows

1. **Speak/Oracle**: Most polished flow. SSE streaming, credit deduction, session management — all implemented.
2. **Content Creation (Step-by-step)**: Multi-step form pipeline per content type (affirmation/meditation/ritual), ~8 steps each.
3. **Content Creation (Chat AI)**: Conversational flow via `/create/conversation` + OpenAI.
4. **Content Creation (Orb Voice)**: Voice-first creation via `/create/orb` — functional but has UX gaps.
5. **Credits Purchase**: Stripe Checkout integration, 3 pack tiers, redirect flow.
6. **Onboarding**: 4-step guided setup (intention → profile → preferences → guide).

---

## Issues Found & Status

### Fixed During This Audit

| # | Severity | Issue | Fix Applied |
|---|---|---|---|
| F1 | CRITICAL | Create hub linked to `/sanctuary/{type}s/create` instead of `/init` (unnecessary redirect) | Direct links to `/init` routes added |
| F2 | CRITICAL | `alert()` used for unsupported Speech Recognition browser | Replaced with styled `[data-testid="orb-unsupported-error"]` banner |
| F3 | HIGH | Multiple credit packs could fire checkout simultaneously | Added `disabled` prop when another pack is loading |
| F4 | HIGH | `Analytics.subscriptionStarted` fired with `userId: undefined` on Sanctuary mount | Dependency array fixed to `[user?.id]` with guard |
| F5 | TEST | `sanctuary.spec.ts` tested `/coming-soon` not `/sanctuary` | Test rewritten to test actual `/sanctuary` |
| F6 | TEST | `auth.ts` fixture exported `authenticatedPage: never`, overriding storageState | Fixed to pass through base test without overriding |
| F7 | TEST | `navigation.spec.ts` used soft `if` guards that never fail | Rewritten with hard `toBeVisible()` + `toHaveURL()` assertions |
| F8 | HIGH | `ContentModeSelector` derived `agentHref` via fragile `.replace('conversation', 'orb')` | Replaced with explicit prop or `/create/orb` fallback |

### Remaining Issues (Must Action)

| # | Severity | Issue | Action Required | File |
|---|---|---|---|---|
| R1 | CRITICAL | No `middleware.ts` — auth enforcement is purely client-side; SSR renders protected pages before redirect fires | Add Next.js Edge middleware to redirect unauthenticated requests server-side | New file: `packages/web/middleware.ts` |
| R2 | CRITICAL | All authenticated E2E tests silently skip in CI without env vars, appearing as passing | Add CI step to fail loudly if `NEXT_PUBLIC_ENABLE_TEST_LOGIN` is not configured; alternatively add `.env.test` to CI secrets | `auth.setup.ts`, CI config |
| R3 | MEDIUM | `Speak` page shows `"Get Qs"` link only after session ends when credits run out mid-session | Show "Get Qs" link when `orbState === 'low_credits'` regardless of session state | `packages/web/app/(main)/speak/page.tsx` |
| R4 | MEDIUM | Sanctuary dashboard shows `0` streak silently on API failure — no error state | Add a subtle retry indicator or error note when `getProgressStats()` fails | `packages/web/app/sanctuary/page.tsx` |
| R5 | MEDIUM | Orb creation has no cancel/start-over during `gathering` or `generating-script` phases | Add a small "Start over" link during those phases | `packages/web/app/(main)/create/orb/page.tsx` |

### Lower Priority (Post-Beta)

| # | Severity | Issue | File |
|---|---|---|---|
| L1 | LOW | `handleChooseVoice` silently drops user at `/sanctuary` if `selectedType` is null | `packages/web/app/(main)/create/orb/page.tsx` |
| L2 | LOW | 400ms artificial delay in onboarding guide not tied to real async work | `packages/web/app/(onboarding)/onboarding/guide/page.tsx` |
| L3 | LOW | Library empty-state CTA and create hub originally used inconsistent route patterns (now aligned) | Fixed by F1 above |
| L4 | LOW | `ttsRafRef` potentially declared twice in speak page | `packages/web/app/(main)/speak/page.tsx` |

---

## Playwright Test Suite — Final State

### Directory Structure After Audit

```
packages/web/e2e/
  helpers/
    auth.helper.ts          NEW — reusable login/logout helpers
    navigation.helper.ts    NEW — page ready waits, overflow checks
    credits.helper.ts       NEW — balance reads, pack assertions
    content.helper.ts       NEW — create hub and flow helpers
  fixtures/
    auth.ts                 FIXED — no longer overrides storageState
    test-user.ts            Unchanged
  auth.setup.ts             Unchanged
  specs/
    public/
      landing.spec.ts       REWRITTEN — CTAs, mobile overflow, marketing pages
      marketing.spec.ts     REWRITTEN — all 7 marketing pages + privacy/data-deletion
      auth-pages.spec.ts    REWRITTEN — validation errors, bad credentials, links
    auth/
      login-flow.spec.ts    REWRITTEN — override login, multiple protected redirects
      protected-redirect.spec.ts  REWRITTEN — all 8 protected routes verified
      signup-flow.spec.ts   NEW — form validation, duplicate email, terms, mobile
    protected/
      sanctuary.spec.ts     REWRITTEN — tests /sanctuary (credit badge, create CTA)
      library.spec.ts       REWRITTEN — content/empty state, filter pills, CTA links
      create.spec.ts        REWRITTEN — all 3 type cards, credit costs, CTAs, mobile
      credits-pricing.spec.ts  REWRITTEN — pack cards, error state, disabled state, checkout
      speak.spec.ts         REWRITTEN — begin button, Q options, API failure states
      navigation.spec.ts    REWRITTEN — hard assertions on all nav links, back/refresh
    onboarding/
      onboarding-flow.spec.ts  NEW — full 4-step flow, continue button state, mobile
    flows/
      create-affirmation.spec.ts  NEW — init, mode selector, intent step, orb page, error banner
    responsive/
      mobile-layout.spec.ts   Extended via inline mobile tests across all specs
      mobile-viewport.spec.ts Unchanged (still valid as sanity checks)
```

### Test Coverage Matrix

| Area | Before Audit | After Audit |
|---|---|---|
| Landing page loads | ✅ (basic) | ✅ (CTAs, overflow, links) |
| Marketing pages | ✅ (3 pages, basic) | ✅ (8 pages + error checking) |
| Login form renders | ✅ (button text only) | ✅ (form fields, validation, bad creds, mobile) |
| Signup form | ❌ None | ✅ (fields, validation, duplicate email, terms) |
| Override login flow | ✅ (when env set) | ✅ (+ production guard test) |
| Protected redirects (all routes) | ✅ (1 route only) | ✅ (8 routes) |
| `hasAccess` gate | ❌ None | ✅ (mock profile, verify /coming-soon) |
| Sanctuary dashboard | ❌ (tested /coming-soon) | ✅ (credit badge, create CTA, library card) |
| Library page | ✅ (basic) | ✅ (content/empty state, filters, CTAs, mobile) |
| Create hub | ✅ (text match only) | ✅ (all 3 cards, links, credits, CTAs, mobile) |
| Create → init step | ❌ None | ✅ (mode selector, navigation) |
| Create → intent step | ❌ None | ✅ (input visible, back navigation) |
| Orb creation page | ❌ None | ✅ (type selector, error banner not alert) |
| Conversation creation | ❌ None | ✅ (page loads) |
| Credits buy page | ✅ (basic) | ✅ (pack cards, error state, disabled guard, mobile) |
| Stripe checkout error | ❌ None | ✅ (mocked 500 error, error message shown) |
| Speak/Oracle page | ✅ (permissive) | ✅ (begin button, Q options, API failure states) |
| Speak API error handling | ❌ None | ✅ (mocked 402 + 500 errors) |
| Onboarding flow | ❌ None | ✅ (all 4 steps, continue button state, mobile) |
| Back/forward navigation | ❌ None | ✅ (back from intent, /sanctuary → back) |
| Refresh during flow | ❌ None | ✅ (auth persists, creation flow persists) |
| Nav links (desktop) | ✅ (soft assertions) | ✅ (hard assertions, all 3 nav items) |
| Mobile viewport no overflow | ✅ (landing only) | ✅ (login, create, library, buy, onboarding, sanctuary) |
| Admin routes protection | ❌ None | ❌ Not covered (low priority for beta) |
| Audio playback | ❌ None | ❌ Requires audio permission grants (future) |
| Voice recording | ❌ None | ❌ Requires mic permissions (future) |

---

## Beta Readiness Verdict

### Overall: CONDITIONALLY READY

**Stable and ready to expose:**
- Landing page → Waitlist/Join flow
- Login / Signup / Password reset
- Onboarding 4-step flow
- Sanctuary dashboard
- Speak / Oracle session (most polished UX)
- Credits purchase via Stripe
- Sanctuary sub-pages (settings, progress, plan, reminders)
- Library (browse + playback)

**Requires R1 fix before external beta:**
- Any route that handles sensitive data (`/sanctuary/settings`, `/sanctuary/credits`, profile data) should have server-side auth protection. Without `middleware.ts`, unauthenticated SSR responses could expose partial rendered HTML of protected pages.

**Recommend hiding for first beta wave:**
- `/create/orb` (Orb voice creation) — orb error banner is now fixed, but missing cancel flow (R5), null-type silent redirect (L1), and no mid-session credits UX (R3). Show only `/create/conversation` and step-by-step form initially.
- `/marketplace` — verify completeness before exposing to beta testers.
- `/admin` and `/system/*` — must be confirmed as superadmin-only server-side.

---

## Must-Fix Before Beta Opens (Priority Order)

1. **[R1] Add `middleware.ts`** — even a minimal one that redirects `/sanctuary*`, `/library*`, `/create*`, `/speak*`, `/profile*`, `/marketplace*` to `/` when no auth cookie is present. This is the single most impactful security fix.

2. **[R2] Fix CI skipping** — add a CI check that fails loudly if authenticated tests are all skipped. Add `NEXT_PUBLIC_ENABLE_TEST_LOGIN`, `OVERRIDE_LOGIN_EMAIL`, `OVERRIDE_LOGIN_PASSWORD` to CI secrets and `.env.test`.

3. **[R3] Credits mid-session** — show "Get Qs" link when `orbState === 'low_credits'` inside the session, not just after it ends.

4. **[R5] Orb cancel flow** — add a "Start over" button so users aren't stranded during AI processing.

5. **[R4] Sanctuary streak error state** — add graceful handling so a failed `/api/progress/stats` call shows a retry state instead of silently showing 0.

---

## Recommended Ideal Tester Journey

1. Land on `/` — read hero, watch how-it-works
2. Click primary CTA → `/join` → submit email to waitlist
3. Receive access grant → click activation link → confirm email
4. Land at `/login` → sign up or log in
5. Complete 4-step onboarding (intention → profile → preferences → guide)
6. Arrive at Sanctuary dashboard — see 0 streak, 0 library items, credit balance
7. Explore the Speak page — start a 1Q Oracle session, have 3 exchanges
8. Return to Sanctuary — see updated credit balance
9. Go to Credits → Buy → purchase 10Q pack (Stripe test card: `4242 4242 4242 4242`)
10. Navigate to Create → select Affirmation → choose Step-by-step
11. Complete the intent step, let AI generate a script
12. Choose a voice, complete audio mix, review, save
13. Find the new affirmation in Library → play it back
14. Explore Sanctuary settings → update display name
15. Test referral link from `/sanctuary/referral`

---

## Playwright Quick Start

```bash
# Install browsers (first time)
cd packages/web && npx playwright install

# Run full test suite (requires dev server running on :3000)
NEXT_PUBLIC_ENABLE_TEST_LOGIN=true \
OVERRIDE_LOGIN_EMAIL=test@example.com \
OVERRIDE_LOGIN_PASSWORD=testpassword \
npx playwright test

# Run only public tests (no auth required)
npx playwright test --project=desktop-chromium specs/public/

# Run with UI mode for debugging
npx playwright test --ui

# Run a single spec
npx playwright test specs/protected/sanctuary.spec.ts
```

### Required `.env.test` (or CI secrets)

```
NEXT_PUBLIC_ENABLE_TEST_LOGIN=true
OVERRIDE_LOGIN_EMAIL=<test account email>
OVERRIDE_LOGIN_PASSWORD=<test account password>
PLAYWRIGHT_BASE_URL=http://localhost:3000
```

---

*Report generated: 2026-03-10 | Audit scope: packages/web/ | Tests written: 80+ across 14 spec files*
