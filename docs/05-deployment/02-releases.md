# Versioning and Releases — waQup

**Status**: Pre-release / Beta  
**Current version**: 0.9.0

---

## Versioning Scheme

waQup uses [Semantic Versioning 2.0.0](https://semver.org/): `MAJOR.MINOR.PATCH`.

- **0.x.x** — Beta; patch for bug fixes, minor for new features.
- **1.0.0** — GA when shipping to production.

## Where Versions Live

| Location | Purpose |
|----------|---------|
| `package.json` (root) | Source of truth |
| `packages/web/package.json`, `packages/mobile/package.json` | Keep aligned |
| `packages/mobile/app.json` | Expo/App Store |
| `packages/web/src/config/version.ts` | `APP_VERSION` for UI (About page) |

## Bumping Versions

1. Update root `package.json` (e.g. `0.9.0` → `0.9.1`).
2. Sync `packages/web`, `packages/mobile`, `app.json`, and `version.ts`.
3. Update `CHANGELOG.md` — add `## [X.Y.Z] - YYYY-MM-DD`.
4. Tag: `git tag v0.9.1`; push: `git push origin v0.9.1`

**Using npm**: `npm version patch -m "Release v%s"` — then sync packages and `version.ts`.

## Changelog

Root [CHANGELOG.md](../../CHANGELOG.md) follows [Keep a Changelog](https://keepachangelog.com/): Added, Changed, Deprecated, Removed, Fixed, Security.

---

## Release Workflow (Beta)

1. Run tests: `npm run test:all`
2. Bump version (root + sync packages + `version.ts`)
3. Update `CHANGELOG.md`
4. Commit and tag: `git tag v0.9.x`
5. Push: `git push origin main && git push origin v0.9.x`
6. (Optional) Create GitHub Release from tag

---

## Migrations (Supabase)

| Task | Command |
|------|---------|
| Push migrations (remote) | `supabase db push` or `npm run supabase:push` |
| Reset local DB | `supabase db reset` or `npm run supabase:reset` |
| Verify database | Run `supabase/scripts/verify_database.sql` in Supabase SQL Editor |

Migrations live in `supabase/migrations/`; applied in filename order.

**Repair scripts** (use only when `db push` fails): `repair_missing_schema.sql`, `repair_superadmin_daniel.sql`.

---

## Pre-Deploy Checklist

- [ ] **Type-check**: `npm run type-check`
- [ ] **Build**: `npm run build:all` (or `build:web`)
- [ ] **Tests**: `npm run test:all` (shared + mobile unit + web E2E)
- [ ] **Migrations**: `supabase db push` if schema changes
- [ ] **Env**: Stripe, Supabase, GA keys set in Vercel (see [01-github-vercel-setup.md](./01-github-vercel-setup.md))

**E2E (authenticated tests)**: Set `OVERRIDE_LOGIN_EMAIL`, `OVERRIDE_LOGIN_PASSWORD`, `NEXT_PUBLIC_ENABLE_TEST_LOGIN` in CI secrets.

---

## Quick Reference

| Task | Command |
|------|---------|
| Migrations (remote) | `supabase db push` |
| Type-check | `npm run type-check` |
| Build all | `npm run build:all` |
| Test all | `npm run test:all` |
| E2E critical | `npm run test:e2e:critical` |
| Dev web | `npm run dev:web` |
| Dev mobile | `npm run dev:mobile` |

**References**: [01-github-vercel-setup.md](./01-github-vercel-setup.md), [04-pages-comparison.md](../04-reference/04-pages-comparison.md), [09-current-vs-final-solution.md](../04-reference/09-current-vs-final-solution.md)
