# Playwright E2E Testing — waQup Web

## What Playwright Tests

- **Next.js web app** (`packages/web`) at `http://localhost:3000`
- **Desktop viewport** — Chrome (primary web experience)
- **Mobile viewport** — Pixel 5 (Android), iPhone 14 (iOS) via device emulation
- Public pages, auth flows, protected routes (with auth fixture), responsive layout

## Provider Coverage Verification (Web + Shared + Mobile)

**Shared (Jest)**: `packages/shared/src/hooks/__tests__/provider-coverage.test.tsx` — verifies that `useContentQuery` (from `createContentHooks`) renders correctly when wrapped in `QueryClientProvider`. Run with `npm run test --workspace=packages/shared`.

**Web (Playwright)**: Protected routes `/sanctuary` and `/speak` are rewritten to `/en/*` so they receive `QueryClientProvider` (see `next.config.js` rewrites). The E2E spec `e2e/specs/protected/provider-coverage.spec.ts` visits these routes and asserts no "No QueryClient set" console errors. Run with `npm run test:e2e` (requires auth setup and dev server).

**Mobile**: `PersistQueryClientProvider` wraps the app at root (`App.tsx`). All screens use the same React tree. No route splitting. The shared provider-coverage Jest test covers the hook behavior used by mobile.

## What Playwright Does Not Test

- **Native Expo app** (iOS/Android): Playwright cannot automate native React Native apps. Use **Detox** (React Native) or **Maestro** for native E2E in a future phase.
- **Expo web** (`localhost:8081`): Separate app (react-native-web); different codebase and port. Optional later: add `playwright-expo.config.ts` if Expo web regression testing is prioritized.

## Prerequisites

- Node.js 24+
- `npm run test:e2e:install` — installs Playwright browsers (Chromium, etc.)

## Local Server Reuse

By default, Playwright reuses an existing dev server when running locally. To force a fresh server (e.g. to avoid port conflicts when dev is already running), set `PLAYWRIGHT_REUSE_SERVER=false`:

```bash
PLAYWRIGHT_REUSE_SERVER=false npm run test:e2e
```

## Running Tests

| Script | Command |
|--------|---------|
| All tests | `npm run test:e2e` |
| Desktop only | `npm run test:e2e:desktop` |
| Mobile only | `npm run test:e2e:mobile` |
| Headed (visible browser) | `npm run test:e2e:headed` |
| UI mode | `npm run test:e2e:ui` |
| Show last report | `npm run test:e2e:report` |
| Install browsers | `npm run test:e2e:install` |

## Auth (Override Login)

For protected-route specs, use the **override login** flow when env is configured:

- `OVERRIDE_LOGIN_EMAIL` / `OVERRIDE_LOGIN_PASSWORD` — server validation
- `NEXT_PUBLIC_OVERRIDE_LOGIN_EMAIL` / `NEXT_PUBLIC_OVERRIDE_LOGIN_PASSWORD` — client (Test login button)
- `NEXT_PUBLIC_ENABLE_TEST_LOGIN=true` — shows "Test login" on login page

1. Add to `.env.local` or CI:
   ```
   NEXT_PUBLIC_ENABLE_TEST_LOGIN=true
   OVERRIDE_LOGIN_EMAIL=test@waqup.app
   OVERRIDE_LOGIN_PASSWORD=testpass123
   NEXT_PUBLIC_OVERRIDE_LOGIN_EMAIL=test@waqup.app
   NEXT_PUBLIC_OVERRIDE_LOGIN_PASSWORD=testpass123
   ```
2. The setup project runs first, logs in via Test login, saves `e2e/.auth/user.json`
3. Authenticated projects use `storageState: 'e2e/.auth/user.json'`
4. **For sanctuary/create/credits specs**: The test user must have `access_granted: true` in `profiles`. Otherwise the user lands on `/coming-soon` and protected specs (credit badge, create hub, etc.) will fail. Run `supabase/scripts/ensure-e2e-user.sql` in Supabase SQL Editor (or manually: `UPDATE profiles SET access_granted = true WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_TEST_EMAIL');`).

## CI

E2E runs in GitHub Actions after the build job:

- Builds web with placeholder Supabase + override env
- Installs Chromium
- Runs `npm run dev` via Playwright webServer (`next start` is incompatible with `output: standalone`)
- On failure: uploads `playwright-report` and `test-results` as artifacts

**Authenticated specs**: CI runs `desktop-chromium` only with placeholder Supabase. `canRunAuthTests()` returns `false` when `CI=true`, so specs using `skipIfNoAuth()` (critical-flows authenticated block, onboarding-flow, create-affirmation) are skipped in CI. This avoids failures from profile fetch returning no `access_granted` with placeholder Supabase. Full E2E (including protected routes and authenticated specs) runs locally with real Supabase and `supabase/scripts/ensure-e2e-user.sql`. To run authenticated specs in CI: (a) add Supabase secrets to the workflow, (b) run the E2E user seed before tests, (c) include `desktop-chromium-authenticated` in the playwright test command.

## Suite Structure (Consolidated)

- **Public**: landing, auth-pages, marketing, protected-redirect
- **Auth**: login-flow (override login, test button visibility), signup-flow (validation, hasAccess)
- **Protected** (requires auth): sanctuary, create, library, speak, credits-pricing, navigation, provider-coverage, settings-profile
- **Flows**: create-affirmation, onboarding-flow
- **Responsive**: mobile-viewport (merged from mobile-layout)
- **i18n**: locale-routing

Run full suite: `npm run test:e2e`. Run critical subset: `npm run test:e2e:critical`.

## Adding Tests

- **Layout**: `e2e/specs/public/`, `e2e/specs/auth/`, `e2e/specs/protected/`, `e2e/specs/responsive/`, `e2e/specs/flows/`, `e2e/specs/onboarding/`, `e2e/specs/i18n/`
- **Fixtures**: `e2e/fixtures/auth.ts`, `e2e/fixtures/test-user.ts`
- Prefer `getByRole`, `getByLabelText`, `getByText`
- Add `data-testid` only when semantic locators are brittle (e.g. `data-testid="nav-sanctuary"`)

## Debugging

- **Traces**: `npx playwright show-trace test-results/.../trace.zip`
- **Screenshots**: `test-results/` (on failure)
- **Videos**: `test-results/` (on retry)
- **HTML report**: `npm run test:e2e:report` after a run

## Native App Strategy

For the native iOS/Android app:

- **Detox**: JavaScript-based, Jest, Expo support
- **Maestro**: YAML flows, no code, good for smoke tests

Recommend a follow-up phase to add native E2E; keep Playwright focused on web.
