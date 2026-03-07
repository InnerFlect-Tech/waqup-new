# Start Here – waQup Rebuild

**Welcome to the waQup multi-platform rebuild (Mobile + Web).**  
This doc is the entry point for developers: quick start, current phase, essential docs, and workflow.

---

## Quick start checklist

### Prerequisites

- [ ] Node.js 24.0.0+ (see [README](../../README.md) for exact requirement)
- [ ] npm 10.0.0+
- [ ] Git
- [ ] Supabase account and project
- [ ] OpenAI API key
- [ ] Stripe account (for payments)

**Optional (mobile)**: Expo Go app and/or Xcode / Android Studio.

### Setup

1. Clone and install (see root [README](../../README.md)):
   - **macOS/Linux**: `./scripts/install.sh`
   - **Windows**: `.\scripts\install.ps1`
2. Copy `.env.example` to `.env` and add API keys.
3. Run `npm run dev:web` and/or `npm run dev:mobile` (or `npm run dev:all`).

---

## Current phase

**Web**: Phases 1–5 done (Sanctuary, content CRUD, speak, marketplace). Next: conversational create flows, Phase 7 API.  
**Mobile**: Phases 1–3 done. Next: Phase 4 (Sanctuary, content).

**Changelog**: [rebuild-roadmap/03-tracking/01-changelog.md](../../rebuild-roadmap/03-tracking/01-changelog.md)  
**Current vs Final**: [docs/04-reference/09-current-vs-final-solution.md](./09-current-vs-final-solution.md)  
**Roadmap**: [rebuild-roadmap/01-planning/01-roadmap.md](../../rebuild-roadmap/01-planning/01-roadmap.md)

---

## Essential documentation

### Before starting

1. **Roadmap** – [rebuild-roadmap/01-planning/01-roadmap.md](../../rebuild-roadmap/01-planning/01-roadmap.md)
2. **Current phase analysis** – [rebuild-roadmap/02-phases/](../../rebuild-roadmap/02-phases/) (e.g. 01-phase-01-project-foundation.md)
3. **Tech stack** – [docs/02-mobile/01-technology-stack.md](../02-mobile/01-technology-stack.md)
4. **Multi-platform strategy** – [docs/03-platforms/01-multi-platform-strategy.md](../03-platforms/01-multi-platform-strategy.md)

### During development

- **Architecture** – [docs/02-mobile/02-architecture.md](../02-mobile/02-architecture.md)
- **Implementation** – [docs/02-mobile/03-implementation.md](../02-mobile/03-implementation.md)
- **Browser strategy** – [docs/03-platforms/02-browser-optimization-strategy.md](../03-platforms/02-browser-optimization-strategy.md)
- **Pages (what exists / missing)** – [docs/04-reference/04-pages-comparison.md](./04-pages-comparison.md)
- **Schema** – [rebuild-roadmap/01-planning/02-schema-verification.md](../../rebuild-roadmap/01-planning/02-schema-verification.md)
- **Context7** – [docs/04-reference/02-context7-usage.md](./02-context7-usage.md)

### Product docs (external)

Main product docs: [docs/01-core/](../01-core/README.md).

---

## Development workflow

1. **Read phase analysis** – `rebuild-roadmap/02-phases/XX-phase-XX-*.md`
2. **Follow step details** – Implement per phase doc
3. **Test** – Web and/or mobile as relevant
4. **Update changelog** – [rebuild-roadmap/03-tracking/01-changelog.md](../../rebuild-roadmap/03-tracking/01-changelog.md)
5. **Commit** – Descriptive message, reference step/phase

---

## Design principles

- **Voice-first** – Audio primary, text/visual secondary
- **Three content types** – Affirmations, Meditations, Rituals (not interchangeable)
- **Conversation over forms** – Creation through dialogue
- **Practice is free** – Unlimited replay; credits for creation only
- **User autonomy** – No manipulation, easy exit

---

## Important links

- **Roadmap**: [rebuild-roadmap/01-planning/01-roadmap.md](../../rebuild-roadmap/01-planning/01-roadmap.md)
- **Changelog**: [rebuild-roadmap/03-tracking/01-changelog.md](../../rebuild-roadmap/03-tracking/01-changelog.md)
- **Schema**: [rebuild-roadmap/01-planning/02-schema-verification.md](../../rebuild-roadmap/01-planning/02-schema-verification.md)
- **Docs coverage**: [docs/04-reference/05-documentation-coverage-analysis.md](./05-documentation-coverage-analysis.md)
- **Current vs final**: [docs/04-reference/09-current-vs-final-solution.md](./09-current-vs-final-solution.md)
- **First-commits vs now**: [docs/04-reference/06-first-commits-vs-now.md](./06-first-commits-vs-now.md)

---

**Last updated**: 2026-02-16
