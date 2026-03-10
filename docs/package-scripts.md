# waQup Package Scripts — Root Workspace Reference

**Purpose**: Single source of truth for all root `package.json` scripts.

**When to use**: Before running any npm script from the monorepo root; for onboarding; for CI/CD and release procedures.

---

## Quick Reference — Release-Critical Commands

| Command | Purpose |
|---------|---------|
| `npm run build:shared && npm run build:web` | Web deploy (Vercel) |
| `npm run build:shared && npm run build:mobile` | Mobile type-check / pre-EAS |
| `npm run type-check` | Verify all packages compile |
| `npm run test:e2e:critical` | Web E2E smoke tests |
| `npm run verify:db` | Schema verification |

---

## 1. Supabase / Database

| Script | Surface | When to Use |
|--------|---------|-------------|
| `supabase:start` | DB | Start local Supabase (Docker required) |
| `supabase:stop` | DB | Stop local Supabase |
| `supabase:status` | DB | Check local Supabase status |
| `supabase:reset` | DB | Reset local DB (applies all migrations from scratch) |
| `supabase:push` | DB | Push migrations to linked remote project |
| `supabase:migrate` | DB | Run migrations via `run_migrations.sh` wrapper |
| `supabase:diff` | DB | Generate migration from schema diff |
| `verify:db` | DB | Run verification script (see `supabase/scripts/run_verify.sh`) |

---

## 2. Development

| Script | Surface | When to Use |
|--------|---------|-------------|
| `dev:mobile` | mobile | Start Expo dev server (packages/mobile) |
| `dev:web` | web | Start Next.js dev server (packages/web) |
| `dev:all` | web, mobile | Run both dev servers in parallel |
| `dev:all:clean` | web, mobile | Kill ports 3000, 3002, 8081; clear .next; start both |
| `dev:all:win` | web, mobile | Same as dev:all (Windows compatibility) |
| `dev:web:clean` | web | Kill ports 3000/3002; clear .next; start web |
| `dev:local` | DB, web | Start Supabase + web (full local stack) |
| `warmup:dev` | web | Warm up Next.js dev server (scripts/warmup-dev.mjs) |

---

## 3. Build

| Script | Surface | When to Use |
|--------|---------|-------------|
| `build:shared` | shared | Build @waqup/shared (required before web/mobile) |
| `build:web` | web | Build Next.js for production |
| `build:web:clean` | web | Clear .next and rebuild |
| `build:mobile` | mobile | TypeScript check only (Expo uses Metro; no tsc build) |
| `build:all` | shared, web, mobile | Build all packages in order |

---

## 4. Production / Start

| Script | Surface | When to Use |
|--------|---------|-------------|
| `start:web` | web | Run built Next.js app (after `build:web`) |
| `prod:web` | web | Build + start web (local production test) |

---

## 5. Testing

| Script | Surface | When to Use |
|--------|---------|-------------|
| `test` | all | Run tests in all workspaces |
| `test:all` | shared, mobile, web | Shared + mobile unit tests + E2E critical |
| `test:e2e` | web | Full Playwright E2E suite |
| `test:e2e:critical` | web | Critical flows only (auth, sanctuary, credits, create, library) |
| `test:e2e:desktop` | web | Desktop Chromium projects |
| `test:e2e:mobile` | web | Mobile viewport projects (Chrome, Safari) |
| `test:e2e:headed` | web | Run E2E with visible browser |
| `test:e2e:ui` | web | Playwright UI mode for debugging |
| `test:e2e:report` | web | Open last Playwright HTML report |
| `test:e2e:install` | web | Install Playwright browsers (Chromium, etc.) |

---

## 6. Quality

| Script | Surface | When to Use |
|--------|---------|-------------|
| `lint` | all | ESLint across workspaces |
| `type-check` | all | TypeScript `tsc --noEmit` for all packages |

---

## Notes

- **Workspaces**: `packages/web`, `packages/mobile`, `packages/shared`. Use `--workspace=packages/<pkg>` to target a specific package.
- **Node**: Requires Node.js >= 24.0.0 (see `.nvmrc`).
- **Mobile build**: `build:mobile` only runs type-check. For EAS builds, use `eas build` from packages/mobile.
- **E2E**: Requires `NEXT_PUBLIC_ENABLE_TEST_LOGIN`, `OVERRIDE_LOGIN_EMAIL`, `OVERRIDE_LOGIN_PASSWORD` in `.env.local` for authenticated specs. See `docs/05-testing/01-playwright-e2e.md`.
