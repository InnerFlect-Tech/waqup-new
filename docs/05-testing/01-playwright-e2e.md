# Playwright E2E Testing — waQup Web

## What Playwright Tests

- **Next.js web app** (`packages/web`) at `http://localhost:3000`
- **Desktop viewport** — Chrome (primary web experience)
- **Mobile viewport** — Pixel 5 (Android), iPhone 14 (iOS) via device emulation
- Public pages, auth flows, protected routes (with auth fixture), responsive layout

## What Playwright Does Not Test

- **Native Expo app** (iOS/Android): Playwright cannot automate native React Native apps. Use **Detox** (React Native) or **Maestro** for native E2E in a future phase.
- **Expo web** (`localhost:8081`): Separate app (react-native-web); different codebase and port. Optional later: add `playwright-expo.config.ts` if Expo web regression testing is prioritized.

## Prerequisites

- Node.js 24+
- `npm run test:e2e:install` — installs Playwright browsers (Chromium, etc.)

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

## CI

E2E runs in GitHub Actions after the build job:

- Builds web with placeholder Supabase + override env
- Installs Chromium
- Runs `npm run start` via Playwright webServer, then tests
- On failure: uploads `playwright-report` and `test-results` as artifacts

## Adding Tests

- **Layout**: `e2e/specs/public/`, `e2e/specs/auth/`, `e2e/specs/protected/`, `e2e/specs/responsive/`
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
