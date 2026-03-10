# Developer Onboarding Guide — waQup

**Purpose**: Comprehensive onboarding for new developers. Use this after the [Start Here](04-reference/03-start-here.md) quick start.

**Last Updated**: 2026-03-09

---

## 1. Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 24.0.0+ | Use `nvm use` (project has `.nvmrc`) |
| npm | 10.0.0+ | Comes with Node |
| Git | Latest | |
| Supabase | Account + project | URL and keys in `.env` |
| OpenAI | API key | Server-side only |
| Stripe | Account | Test keys for local dev |
| ElevenLabs | API key | For voice/TTS |

**Mobile (optional)**: Expo Go app, or Xcode (iOS) / Android Studio (Android) for custom builds.

---

## 2. Clone and Install

```bash
git clone https://github.com/InnerFlect-Tech/waqup-new.git
cd waqup-new
chmod +x scripts/install.sh   # macOS/Linux
./scripts/install.sh
```

**Windows**: `.\scripts\install.ps1`

The install script will:
- Verify Node, npm, Git
- Install all dependencies (root, shared, web, mobile)
- Copy `.env.example` to `.env`
- Run TypeScript checks

---

## 3. Environment Setup

Edit `.env` (or `.env.local`) with real values. Key variables:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side only (webhooks, admin) |
| `EXPO_PUBLIC_SUPABASE_*` | For mobile (same values) |
| `OPENAI_API_KEY` | OpenAI API |
| `ELEVENLABS_API_KEY` | ElevenLabs voice/TTS |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable |
| `STRIPE_SECRET_KEY` | Stripe secret |
| `STRIPE_WEBHOOK_SECRET` | From `stripe listen --forward-to localhost:3000/api/stripe/webhook` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local; production URL for deploy |

Full list: [.env.example](../.env.example). Local Supabase setup: [12-local-development.md](04-reference/12-local-development.md).

---

## 4. Run the App

```bash
# Web only
npm run dev:web

# Mobile only
npm run dev:mobile

# Both
npm run dev:all
```

- **Web**: http://localhost:3000
- **Mobile**: Expo Dev Server — press `i` (iOS) or `a` (Android), or scan QR with Expo Go

---

## 5. Key Docs to Read

| Doc | Purpose |
|-----|---------|
| [03-start-here.md](04-reference/03-start-here.md) | Quick start, current phase |
| [00-architecture-overview.md](00-architecture-overview.md) | Monorepo, backend, data flows |
| [00-product-overview.md](00-product-overview.md) | What waQup is, principles |
| [01-roadmap.md](../rebuild-roadmap/01-planning/01-roadmap.md) | Phase roadmap |
| [09-current-vs-final-solution.md](04-reference/09-current-vs-final-solution.md) | What's done vs target |
| [01-changelog.md](../rebuild-roadmap/03-tracking/01-changelog.md) | Step completion tracking |
| [02-schema-verification.md](../rebuild-roadmap/01-planning/02-schema-verification.md) | Database schema |

---

## 6. First Tasks

1. **Pick a phase** — See [01-roadmap.md](../rebuild-roadmap/01-planning/01-roadmap.md) Current Status; read the phase analysis in `rebuild-roadmap/02-phases/`.
2. **Implement** — Follow the phase doc; use shared services from `packages/shared/`.
3. **Test** — Run both web and mobile; verify UI and flows.
4. **Update changelog** — Add entry to [01-changelog.md](../rebuild-roadmap/03-tracking/01-changelog.md).
5. **Commit** — Descriptive message, reference step/phase.

---

## 7. Design System Quick Reference

- **Tokens**: `packages/shared/src/theme/tokens.ts` (SSOT)
- **Web**: Import from `@/theme`; use `spacing`, `BLUR`, `colors`, etc.
- **Never**: Hardcode hex colors, raw `blur(Xpx)`, raw spacing numbers
- **Rules**: [.cursor/rules/design-system.mdc](../.cursor/rules/design-system.mdc)

---

## 8. Code Standards

- **Shared first** — Business logic in `packages/shared/`; never duplicate
- **Types** — Import from `@waqup/shared/types`
- **Services** — Use `@waqup/shared/services`
- **Analytics** — Use `Analytics.*` from `@waqup/shared/utils`; never raw gtag

---

## 9. Troubleshooting

- **Scripts won't run**: `chmod +x scripts/*.sh`
- **npm install hangs**: Use `--no-audit --no-fund`; clear cache if needed
- **Node version**: Run `nvm use` for Node 24
- **Stripe webhook**: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

See [12-local-development.md](04-reference/12-local-development.md) for full setup and Stripe testing.
