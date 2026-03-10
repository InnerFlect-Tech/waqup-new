# waQup Documentation

**Purpose**: Documentation for waQup multi-platform rebuild (Mobile + Web)

---

## Documentation Structure

```
docs/
├── README.md                    # This file
├── 00-architecture-overview.md  # Monorepo, backend, data flows
├── 00-current-context.md       # Business, pricing, pipelines, design — full app context
├── 00-product-overview.md      # What waQup is, principles
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
│   ├── 01-showcase-access.md
│   ├── 02-context7-usage.md
│   ├── 02-cursor-rules-guide.md
│   ├── 03-start-here.md
│   ├── 04-pages-comparison.md
│   ├── 05-documentation-coverage-analysis.md
│   ├── 06-first-commits-vs-now.md
│   ├── 07-design-system-cross-platform.md
│   ├── 08-full-codebase-analysis.md
│   ├── 09-current-vs-final-solution.md
│   ├── 10-admin-pages-proposal.md
│   ├── 11-design-system.md
│   ├── 12-local-development.md
│   ├── 13-stripe-setup.md
│   ├── 14-spacing-analysis-full.md
│   ├── 15-button-design-tokens.md
│   ├── 16-route-map.md
│   └── 17-spacing-usage-guide.md
│
├── 05-testing/
│   └── 01-playwright-e2e.md      # Playwright E2E testing guide
└── 05-deployment/
    └── 01-github-vercel-setup.md
```

---

## Quick Navigation

### 🏠 Overview (start here)
- **[00 Architecture Overview](./00-architecture-overview.md)** - Monorepo structure, backend services, data flows
- **[00 Current Context](./00-current-context.md)** - Business, pricing, pipelines, design — single reference for app context
- **[00 Product Overview](./00-product-overview.md)** - What waQup is, principles, content types
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
- **[01 Showcase Access](./04-reference/01-showcase-access.md)** - Component showcase (Web URL & Mobile deep links)
- **[02 Context7 Usage](./04-reference/02-context7-usage.md)** - How to use Context7 for documentation queries
- **[03 Start Here](./04-reference/03-start-here.md)** - Developer entry point (quick start, current phase, workflow)
- **[04 Pages Comparison](./04-reference/04-pages-comparison.md)** - What exists vs what’s needed (SSOT for pages)
- **[05 Documentation Coverage Analysis](./04-reference/05-documentation-coverage-analysis.md)** - Architecture, LLM, pipelines, pages, marketplace (gaps & recommendations)
- **[06 First Commits vs Now](./04-reference/06-first-commits-vs-now.md)** - Doc coherence: first commits vs now, what's fixed
- **[09 Current vs Final Solution](./04-reference/09-current-vs-final-solution.md)** - Implementation status: Web vs Mobile, gaps, roadmap alignment
- **[12 Local Development](./04-reference/12-local-development.md)** - Full local Supabase setup, env config, Stripe testing, troubleshooting
- **[13 Responsive Design](./04-reference/13-responsive-design.md)** - Breakpoints, padding rules, responsive checklist for web and mobile
- **[17 Spacing Usage Guide](./04-reference/17-spacing-usage-guide.md)** - Spacing tokens, semantic rules, audit checklist

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
   - Product: `00-product-overview.md`
   - Developer onboarding: `00-developer-onboarding.md`
   - Start Here: `04-reference/03-start-here.md`

4. **For Reference Guides**: 
   - Context7: `04-reference/02-context7-usage.md`
   - Cursor rules: `04-reference/02-cursor-rules-guide.md`
   - Pages comparison: `04-reference/04-pages-comparison.md`
   - Current vs final: `04-reference/09-current-vs-final-solution.md`
   - Route map: `04-reference/16-route-map.md`
   - Local development: `04-reference/12-local-development.md`

5. **For Product Context**: See `01-core/README.md`

6. **For Testing**: See `05-testing/01-playwright-e2e.md` — Playwright E2E setup, auth, CI

---

## Roadmap & Planning

See `../rebuild-roadmap/` for:
- Complete roadmap
- Schema verification
- Phase analyses
- Changelog tracking

**Open items** (unresolved work before launch): [`../updates/open-items.md`](../updates/open-items.md)

---

**Last Updated**: 2026-03-09
