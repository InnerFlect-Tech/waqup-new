# Documentation Organization & Hierarchy

**Purpose**: Overview of documentation structure, hierarchy, and coherence

---

## Complete Structure

```
docs/
├── README.md                    # Main documentation overview
│
├── 01-core/                    # Core product documentation (references + pipelines)
│   ├── README.md               # Reference guide to main docs
│   ├── 02-pipeline-affirmations.md
│   ├── 03-pipeline-meditations.md
│   ├── 04-pipeline-rituals.md
│   ├── 05-pipelines-overview.md
│   ├── 06-audio-generation-summary.md
│   ├── 07-marketplace-summary.md
│   └── 08-llm-conversation-summary.md
│
├── 02-mobile/                  # Mobile-specific documentation ONLY
│   ├── README.md               # Mobile docs overview
│   ├── 01-technology-stack.md  # Mobile tech stack & decisions
│   ├── 02-architecture.md      # Mobile architecture
│   └── 03-implementation.md    # Mobile implementation guide
│
├── 03-platforms/               # Multi-platform strategy & optimization
│   ├── README.md               # Platform docs overview
│   ├── 01-multi-platform-strategy.md  # Mobile + Web strategy
│   └── 02-browser-optimization-strategy.md  # Chrome-first browser strategy
│
└── 04-reference/               # Reference guides
    ├── 01-showcase-access.md   # Component showcase (Web & Mobile access)
    ├── 02-context7-usage.md    # How to use Context7 for documentation queries
    ├── 03-start-here.md        # Developer entry point (quick start, phase, workflow)
    ├── 04-pages-comparison.md  # Pages: what exists vs what's needed (SSOT)
    ├── 05-documentation-coverage-analysis.md  # Architecture, LLM, pipelines, marketplace
    ├── 06-first-commits-vs-now.md             # First-commits vs now, coherence gaps
    ├── 07-design-system-cross-platform.md    # Design tokens, themes, web/iOS/Android coherence
    ├── 08-full-codebase-analysis.md          # Duplicates, reductions, best practices (Context7)
    └── 09-current-vs-final-solution.md       # Implementation status: Web vs Mobile, gaps, roadmap
```

---

## Hierarchy & Coherence

### 01-core/ - Core Product Docs
**Purpose**: Reference to main product documentation + in-repo pipeline and summary docs  
**Content**: Pipeline specs (02–04), overview (05), audio (06), marketplace (07), LLM (08) — all in-repo  
**Scope**: Product constitution, scientific foundations, pipelines, audio, marketplace, conversation

### 02-mobile/ - Mobile-Specific Docs
**Purpose**: Mobile app development documentation  
**Content**: Mobile-specific tech stack, architecture, implementation  
**Scope**: React Native, Expo, mobile patterns, mobile optimizations  
**Coherence**: ✅ Contains ONLY mobile-specific content

### 03-platforms/ - Multi-Platform Strategy
**Purpose**: Cross-platform development strategies  
**Content**: Multi-platform strategy, browser optimization  
**Scope**: Mobile + Web, parallel development, browser strategies  
**Coherence**: ✅ Separated from mobile-specific docs

### 04-reference/ - Reference Guides
**Purpose**: Reference documentation (SSOT)  
**Content**: Showcase access (Web URL, Mobile deep links)  
**Scope**: Development and testing reference

---

## Numbering Convention

- **Folders**: `01-`, `02-`, `03-`, `04-` prefix (sequential, hierarchical)
- **Files**: `01-`, `02-`, `03-` prefix within folders (sequential)
- **Consistent**: All numbered items follow this pattern

---

## Coherence Rules

### ✅ Mobile Docs (`02-mobile/`)
- **Contains**: Mobile-specific content ONLY
- **Does NOT contain**: Multi-platform strategies, browser strategies
- **References**: Links to `03-platforms/` for cross-platform info

### ✅ Platform Docs (`03-platforms/`)
- **Contains**: Cross-platform strategies, browser optimization
- **References**: Links to `02-mobile/` for mobile-specific details
- **Scope**: Both platforms (Mobile + Web)

### ✅ Clear Separation
- Mobile-specific → `02-mobile/`
- Cross-platform → `03-platforms/`
- References → `04-reference/`
- Core product → `01-core/`

---

## Navigation Flow

### For Mobile Development
1. Start: `02-mobile/README.md`
2. Tech Stack: `02-mobile/01-technology-stack.md`
3. Architecture: `02-mobile/02-architecture.md`
4. Implementation: `02-mobile/03-implementation.md`
5. Cross-platform: `03-platforms/01-multi-platform-strategy.md`

### For Multi-Platform Development
1. Start: `03-platforms/README.md`
2. Strategy: `03-platforms/01-multi-platform-strategy.md`
3. Browser: `03-platforms/02-browser-optimization-strategy.md`
4. Mobile details: `02-mobile/` (for mobile-specific info)

---

## References Updated

✅ All internal references updated:
- `docs/README.md` - Updated structure
- `.cursorrules` - Updated paths
- All doc files - Updated cross-references
- No broken links

---

**Last Updated**: 2026-02-16
**Status**: ✅ Organized & Coherent
