# Changelog

All notable changes to waQup are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Pre-release / Beta**: We are currently in beta. Version numbers use `0.x.x` until general availability.

---

## [0.9.1] - 2026-03-15

### Fixed

- **Navigation & scroll (web)** — Fixed three scrollbars appearing when the mobile menu was open; PageShell now uses a single scroll region
- **Header visibility (web)** — Header no longer disappears when logged in on mobile; AuthProvider only shows a full-screen spinner during initial auth bootstrap, not during profile load
- **Profile loading** — When profile is loading on a protected route, content area shows an inline spinner while the header stays visible

### Changed

- **Route handling** — Centralized path matching in `route-utils.ts` for auth, onboarding, and protected routes
- **Super admin** — Migrated to React Query with caching to reduce redundant profile fetches on navigation
- **Nav animation** — Softened header animation on route change

---

## [0.9.0] - 2026-03-13

### Pre-release / Beta

First beta release. Core flows are in place on web and mobile.

### Added

- **About & Acknowledgments** — Version display and credits page (`/sanctuary/settings/about`) crediting contributors, beta testers, and services
- **Changelog** — Root `CHANGELOG.md` for product releases (Keep a Changelog format)
- **Versioning** — Unified 0.9.0 across monorepo; SemVer workflow documented in `docs/05-deployment/04-versioning-and-releases.md`
- Multilingual support (en, pt, es, fr, de) across marketing, pricing, and core flows
- E2E Playwright tests for critical flows (auth, credits, locale routing)
- Sanctuary settings: Profile, Billing, Theme, Avatar, Notifications, About
- Create flows (affirmations, meditations, rituals) with voice orb and conversation UI
- Speak (AI voice) and Marketplace
- Stripe subscriptions and credit packs (web + mobile fallback)
- **Pricing page i18n** — Full localization for pricing page in all supported languages

### Changed

- Dependency cleanup: removed deprecated `fluent-ffmpeg`; pinned `glob` to resolve deprecation warnings
- E2E specs: increased timeouts for CI stability; fixed Playwright locator in signup flow
- **Mobile SetupScreen** — CTA (Get Started / Sign In) always visible at bottom; improved touch targets and solid CTA background

### Fixed

- Signup checkbox locator in Playwright (invalid CSS selector)
- Protected redirect and analytics event specs (timeout tuning)

---

## [0.8.0] - 2026-03-10

### Added

- **Create hub** — "Create by talking" primary path with Talk to the Orb and Chat; content type cards in secondary section
- **Mobile Stripe checkout** — Credit pack purchase via Stripe when RevenueCat is unavailable
- **Mobile onboarding** — 4-step flow (Intention → Profile → Preferences → Guide) matching web
- **Mobile content editing** — Edit title, description, script; Edit audio opens web page in browser
- **Mobile Speak/Oracle** — AI Oracle sessions with Bearer token auth
- **Marketplace "Add to Sanctuary"** — `sanctuary_saves` table and RLS for saving content
- **Stripe webhook** — Automation scripts and docs for production webhook setup
- **ChunkLoadError recovery** — Global error boundary auto-reload on chunk timeout

### Changed

- **Route consolidation** — `/` redirects to `/en`; removed duplicate root routes
- **Design tokens** — Migrated create, marketplace, library, and mobile screens to theme tokens (no hardcoded hex)
- **Admin API** — Session-based auth (no x-admin-pass); `profile.role === 'superadmin'` for admin routes
- **Profiles RLS** — Users may only insert their own profile
- **API validation** — Zod validation on `/api/ai/render`, `/api/conversation`, `/api/oracle`, and related routes

### Fixed

- iCloud Drive build issues (webpack cache; `cache: false` for projects in cloud storage)
- Marketplace GET API inner-join semantics for content type filtering

---

## [0.7.0] - 2026-03-08

### Added

- **Voice Orb** — WebGL audio-reactive orb on Speak page (Three.js + Web Audio API)
- **Credits on create** — Credit costs shown for affirmations, meditations, rituals (1–10 Qs; 2× with AI)
- **ElevenLabs voice setup** — Professional Voice Cloning at `/sanctuary/voice`; create PVC, upload samples, preview TTS
- **Stripe Customer Portal** — Manage subscription and billing from Settings
- **Realtime credits** — Supabase postgres_changes subscription for instant balance updates
- **PWA** — Enhanced manifest, service worker, installable app
- **Share flow** — Share button in content completion step

### Changed

- **Content creation** — Voice selection and ElevenLabs render via `/api/ai/render`
- **Stripe SDK** — Updated to `2026-02-25.clover`

---

## How to Bump Versions

- **Pre-1.0** (beta): Use `0.x.0` for minor releases, `0.9.x` for patches.
- **Post-1.0**: Use `npm version patch|minor|major` and push tags `vX.Y.Z`.
- See `docs/05-deployment/04-versioning-and-releases.md` for full workflow.

[0.9.1]: https://github.com/InnerFlect-Tech/waqup-new/releases/tag/v0.9.1
[0.9.0]: https://github.com/InnerFlect-Tech/waqup-new/releases/tag/v0.9.0
[0.8.0]: https://github.com/InnerFlect-Tech/waqup-new/releases/tag/v0.8.0
[0.7.0]: https://github.com/InnerFlect-Tech/waqup-new/releases/tag/v0.7.0
