# Changelog

All notable changes to waQup are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Pre-release / Beta**: We are currently in beta. Version numbers use `0.x.x` until general availability.

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

### Changed

- Dependency cleanup: removed deprecated `fluent-ffmpeg`; pinned `glob` to resolve deprecation warnings
- E2E specs: increased timeouts for CI stability; fixed Playwright locator in signup flow

### Fixed

- Signup checkbox locator in Playwright (invalid CSS selector)
- Protected redirect and analytics event specs (timeout tuning)

---

## How to Bump Versions

- **Pre-1.0** (beta): Use `0.x.0` for minor releases, `0.9.x` for patches.
- **Post-1.0**: Use `npm version patch|minor|major` and push tags `vX.Y.Z`.
- See `docs/05-deployment/04-versioning-and-releases.md` for full workflow.

[0.9.0]: https://github.com/InnerFlect-Tech/waqup-new/releases/tag/v0.9.0
