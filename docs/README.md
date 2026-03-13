# waQup Documentation

**Purpose**: Documentation for waQup multi-platform rebuild (Mobile + Web)

---

## Documentation Structure

```
docs/
├── README.md                    # This file
├── 00-architecture-overview.md  # Monorepo, backend, data flows
├── 00-current-context.md       # Business, pricing, pipelines, design — full app context
├── 00-developer-onboarding.md  # Full onboarding guide
│
├── 01-core/                    # Core product documentation
│   ├── README.md
│   ├── 02-pipeline-affirmations.md
│   ├── 03-pipeline-meditations.md
│   ├── 04-pipeline-rituals.md
│   ├── 05-pipelines-overview.md
│   ├── 06-audio-generation-summary.md
│   ├── 07-marketplace-summary.md
│   └── 08-llm-conversation-summary.md
│
├── 02-mobile/                  # Mobile-specific documentation
│   ├── 01-technology-stack.md
│   ├── 02-architecture.md
│   └── 03-implementation.md
│
├── 03-platforms/               # Multi-platform strategy
│   ├── 01-multi-platform-strategy.md
│   └── 02-browser-optimization-strategy.md
│
├── 04-reference/               # Reference guides
│   ├── 02-developer-tooling.md
│   ├── 03-start-here.md
│   ├── 04-pages-comparison.md
│   ├── 07-design-system.md
│   ├── 09-current-vs-final-solution.md
│   ├── 12-local-development.md
│   ├── 13-stripe-setup.md
│   ├── 16-route-map.md
│   └── 23-full-audit-consolidated.md
│
├── 05-deployment/
│   ├── 01-github-vercel-setup.md
│   ├── 02-releases.md
│   └── 02-meta-app-submission.md
└── 06-testing/
    └── 01-playwright-e2e.md      # Playwright E2E testing guide
```

---

## Quick Navigation

### 🏠 Overview (start here)
- **[00 Architecture Overview](./00-architecture-overview.md)** - Monorepo structure, backend services, data flows
- **[00 Current Context](./00-current-context.md)** - Business, pricing, pipelines, design — single reference for app context (includes product principles)
- **[00 Developer Onboarding](./00-developer-onboarding.md)** - Full onboarding guide
- **[03 Start Here](./04-reference/03-start-here.md)** - Quick start, current phase, workflow

### 📱 Mobile Documentation (`02-mobile/`)
- **[01 Technology Stack](./02-mobile/01-technology-stack.md)** - Mobile tech decisions & stack
- **[02 Architecture](./02-mobile/02-architecture.md)** - Mobile app architecture
- **[03 Implementation](./02-mobile/03-implementation.md)** - Mobile implementation guide

### 🌐 Platform Documentation (`03-platforms/`)
- **[01 Multi-Platform Strategy](./03-platforms/01-multi-platform-strategy.md)** - Mobile + Web strategy
- **[02 Browser Optimization Strategy](./03-platforms/02-browser-optimization-strategy.md)** - Chrome-first browser strategy

### 📚 Reference Guides (`04-reference/`)
- **[02 Developer Tooling](./04-reference/02-developer-tooling.md)** - Context7, Cursor rules, developer workflows
- **[03 Start Here](./04-reference/03-start-here.md)** - Developer entry point (quick start, current phase, workflow)
- **[04 Pages Comparison](./04-reference/04-pages-comparison.md)** - What exists vs what’s needed (SSOT for pages)
- **[07 Design System](./04-reference/07-design-system.md)** - Tokens, spacing, buttons, cross-platform
- **[09 Current vs Final Solution](./04-reference/09-current-vs-final-solution.md)** - Implementation status: Web vs Mobile, gaps, roadmap alignment
- **[12 Local Development](./04-reference/12-local-development.md)** - Full local Supabase setup, env config, Stripe testing, troubleshooting
- **[13 Stripe Setup](./04-reference/13-stripe-setup.md)** - Stripe setup, products, webhook, env validation
- **[16 Route Map](./04-reference/16-route-map.md)** - Authoritative route list

### 🚀 Deployment (`05-deployment/`)
- **[01 GitHub & Vercel Setup](./05-deployment/01-github-vercel-setup.md)** - CI/CD, Vercel env, Stripe
- **[02 Releases](./05-deployment/02-releases.md)** - Versioning, migrations, pre-deploy checklist

### 🔗 Core Product Docs (`01-core/`)
- **[README](./01-core/README.md)** - Reference to main product docs + in-repo pipelines
- **[02 Affirmations Pipeline](./01-core/02-pipeline-affirmations.md)** | **[03 Meditations](./01-core/03-pipeline-meditations.md)** | **[04 Rituals](./01-core/04-pipeline-rituals.md)** | **[05 Overview](./01-core/05-pipelines-overview.md)**
- **[06 Audio Generation](./01-core/06-audio-generation-summary.md)** | **[07 Marketplace](./01-core/07-marketplace-summary.md)** | **[08 LLM/Conversation](./01-core/08-llm-conversation-summary.md)**

---

## How to Use

1. **For Mobile Development**: 
   - Tech Stack: `02-mobile/01-technology-stack.md`
   - Architecture: `02-mobile/02-architecture.md`
   - Implementation: `02-mobile/03-implementation.md`

2. **For Multi-Platform Strategy**: 
   - Platform Strategy: `03-platforms/01-multi-platform-strategy.md`
   - Browser Optimization: `03-platforms/02-browser-optimization-strategy.md`

3. **For Overview & Onboarding**: 
   - Architecture: `00-architecture-overview.md`
   - Product/context: `00-current-context.md`
   - Developer onboarding: `00-developer-onboarding.md`
   - Start Here: `04-reference/03-start-here.md`

4. **For Reference Guides**: 
   - Developer tooling (Context7, Cursor rules): `04-reference/02-developer-tooling.md`
   - Pages comparison: `04-reference/04-pages-comparison.md`
   - Current vs final: `04-reference/09-current-vs-final-solution.md`
   - Route map: `04-reference/16-route-map.md`
   - Local development: `04-reference/12-local-development.md`

5. **For Product Context**: See `01-core/README.md`

6. **For Testing**: See `06-testing/01-playwright-e2e.md` — Playwright E2E setup, auth, CI

---

## Roadmap & Planning

See `../rebuild-roadmap/` for:
- Complete roadmap
- Schema verification
- Phase analyses
- Changelog tracking

**Open items** (unresolved work before launch): [`../updates/open-items.md`](../updates/open-items.md)

---

## Organization & Hierarchy

- **01-core/**: Core product — pipelines, audio, marketplace, LLM
- **02-mobile/**: Mobile-only — tech stack, architecture, implementation
- **03-platforms/**: Cross-platform — multi-platform strategy, browser optimization
- **04-reference/**: Reference guides — SSOT for pages, routes, design, local dev
- **05-deployment/**: Deployment — GitHub, Vercel, Stripe
- **06-testing/**: Testing — Playwright E2E

**Numbering**: Folders use `01-`, `02-` prefix; files use sequential numbering within folders. Mobile-specific → `02-mobile/`; cross-platform → `03-platforms/`.

**AI context**: [`../CONTEXT-FOR-AI.md`](../CONTEXT-FOR-AI.md) — canonical current implementation reference for AI assistants.

---

**Last Updated**: 2026-03-13
