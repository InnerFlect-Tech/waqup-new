# Public Pages SEO and Share Metadata — Complete List

**Updated**: 2026-03-13  
**Ref**: [16-route-map.md](../04-reference/16-route-map.md)

## Problem

When sharing public pages on WhatsApp, Facebook, or Twitter, the preview shows only **"waQup"** — not the page name or a descriptive snippet. Root cause: `app/[locale]/layout.tsx` hardcodes `openGraph.title` and `twitter.title` to `"waQup"` for all pages.

---

## All Public Pages (Complete List)

Per the route map and AuthProvider, these are **all** public routes that need page-specific OG/Twitter metadata:

### Marketing (16 pages)

| Route | Layout / Page | pageKey | In original plan? |
|-------|---------------|---------|-------------------|
| `/` | `[locale]/page.tsx` (home) | home | **NO** |
| `/how-it-works` | `(marketing)/how-it-works/layout.tsx` | howItWorks | Yes |
| `/pricing` | `(marketing)/pricing/layout.tsx` | pricing | Yes |
| `/terms` | `terms/page.tsx` (static metadata) | terms | **NO** |
| `/explanation` | `explanation/layout.tsx` | theScience | Yes |
| `/our-story` | `(marketing)/our-story/layout.tsx` | ourStory | Yes |
| `/privacy` | `privacy/page.tsx` (static metadata) | privacy | **NO** |
| `/join` | `join/layout.tsx` | join | Yes |
| `/waitlist` | `waitlist/layout.tsx` | waitlist | Yes |
| `/get-qs` | `(marketing)/get-qs/layout.tsx` | getQs | Yes |
| `/funnels` | `(marketing)/funnels/layout.tsx` | funnels | Yes |
| `/investors` | `(marketing)/investors/layout.tsx` | investors | Yes |
| `/launch` | `(marketing)/launch/layout.tsx` | launch | Yes |
| `/for-coaches` | `(marketing)/for-coaches/layout.tsx` | forCoaches | Yes |
| `/for-creators` | `(marketing)/for-creators/layout.tsx` | forCreators | Yes |
| `/for-studios` | `(marketing)/for-studios/layout.tsx` | forStudios | Yes |
| `/for-teachers` | `(marketing)/for-teachers/layout.tsx` | forTeachers | Yes |
| `/data-deletion` | `data-deletion/page.tsx` (static metadata) | dataDeletion | **NO** |

### Auth (6 pages)

| Route | Layout | pageKey | In original plan? |
|-------|--------|---------|-------------------|
| `/login` | `(auth)/login/layout.tsx` | login | **NO** |
| `/signup` | `(auth)/signup/layout.tsx` | signup | **NO** |
| `/forgot-password` | `(auth)/forgot-password/layout.tsx` | forgotPassword | **NO** |
| `/reset-password` | `(auth)/reset-password/layout.tsx` | resetPassword | **NO** |
| `/confirm-email` | `(auth)/confirm-email/layout.tsx` | confirmEmail | **NO** |
| `/coming-soon` | `coming-soon/layout.tsx` | comingSoon | Yes |

### Special case (dynamic, already has metadata)

| Route | Notes |
|-------|-------|
| `/play/[id]` | Dynamic page; already has `generateMetadata` with content-specific OG. **No change needed.** |

---

## Missing from Original Plan (9 pages)

1. **`/` (home)** — Landing page. Home is at `app/[locale]/page.tsx` (client component). **Fix**: Create `app/[locale]/(home)/layout.tsx` with `generateMetadata`, move `page.tsx` to `(home)/page.tsx` so the route group provides metadata.
2. **`/terms`** — Uses static `export const metadata`. Convert to `generateMetadata` + helper for i18n and full OG/twitter.
3. **`/privacy`** — Same as terms.
4. **`/data-deletion`** — Same as terms.
5. **`/login`** — Auth layout; add to helper.
6. **`/signup`** — Auth layout; add to helper.
7. **`/forgot-password`** — Auth layout; add to helper.
8. **`/reset-password`** — Auth layout; add to helper.
9. **`/confirm-email`** — Auth layout; add to helper.

---

## Implementation Summary

- **Total public pages to update**: 25 (including home, terms, privacy, data-deletion, 5 auth pages)
- **Create** `createMarketingMetadata` helper (supports both `pages.*` and `auth.*` keys for auth pages)
- **Add** `descriptions` (and auth descriptions if needed) to all locale `metadata.json`
- **Pages with static metadata** (`terms`, `privacy`, `data-deletion`): Add layout with `generateMetadata` or convert page to server + metadata (they currently have partial OG but no twitter, and relative URLs)
- **Home**: Route group `(home)` + layout with metadata

---

## Full Layout / Page Mapping for Helper

| Location | pageKey | path |
|----------|---------|------|
| `(home)/layout.tsx` (new) | home | / |
| `(marketing)/how-it-works/layout.tsx` | howItWorks | /how-it-works |
| `(marketing)/investors/layout.tsx` | investors | /investors |
| `(marketing)/our-story/layout.tsx` | ourStory | /our-story |
| `explanation/layout.tsx` | theScience | /explanation |
| `(marketing)/for-teachers/layout.tsx` | forTeachers | /for-teachers |
| `(marketing)/for-coaches/layout.tsx` | forCoaches | /for-coaches |
| `(marketing)/for-creators/layout.tsx` | forCreators | /for-creators |
| `(marketing)/for-studios/layout.tsx` | forStudios | /for-studios |
| `(marketing)/pricing/layout.tsx` | pricing | /pricing |
| `(marketing)/funnels/layout.tsx` | funnels | /funnels |
| `(marketing)/launch/layout.tsx` | launch | /launch |
| `(marketing)/get-qs/layout.tsx` | getQs | /get-qs |
| `join/layout.tsx` | join | /join |
| `waitlist/layout.tsx` | waitlist | /waitlist |
| `coming-soon/layout.tsx` | comingSoon | /coming-soon |
| `terms/` — add layout or convert page | terms | /terms |
| `privacy/` — add layout or convert page | privacy | /privacy |
| `data-deletion/` — add layout or convert page | dataDeletion | /data-deletion |
| `(auth)/login/layout.tsx` | login | /login |
| `(auth)/signup/layout.tsx` | signup | /signup |
| `(auth)/forgot-password/layout.tsx` | forgotPassword | /forgot-password |
| `(auth)/reset-password/layout.tsx` | resetPassword | /reset-password |
| `(auth)/confirm-email/layout.tsx` | confirmEmail | /confirm-email |

**Note**: For `terms`, `privacy`, `data-deletion` — they use `pages.privacy`, `pages.terms`, `pages.dataDeletion` in metadata.json. The helper should support these keys. If they need dynamic content (e.g. effective date from LEGAL_CONFIG), the helper can accept an optional `descriptionOverride` parameter, or those pages keep a custom `generateMetadata` that builds metadata and passes to a shared `enrichWithOgTwitter()` util.

---

## i18n Verification — Translation Audit

**Verify**: `npm run verify:i18n` — **PASSED** (all locales have structural parity with `en`)

### What works

- **metadata.json**: All keys exist in en, pt, es, fr, de. No missing keys.
- **marketing.json**: Full parity; pt, es, fr, de have real translations (e.g. `hero.headline`, `howItWorks.page.*`).
- **Pages using i18n correctly**: Landing, how-it-works, our-story, explanation, get-qs, waitlist, pricing (from marketing/pricing namespaces).

### Gaps — Pages with hardcoded English (not translated)

| Page | Issue | Scope |
|------|-------|-------|
| **Terms** | Content and metadata 100% hardcoded English | Full page |
| **Privacy** | Content and metadata 100% hardcoded English | Full page |
| **Data deletion** | Content and metadata 100% hardcoded English | Full page |
| **for-teachers** | BENEFITS, STEPS, COMPARISON_ROWS arrays are inline English | ~30+ strings |
| **for-coaches** | Pain points, features, workflow steps inline English | ~40+ strings |
| **for-creators** | Tiers, features, example content inline English | ~35+ strings |
| **for-studios** | Use cases, steps inline English | ~25+ strings |
| **launch** | Mock UI labels, FAQ Q&A, tab labels — all hardcoded | ~50+ strings |
| **pricing** | Error messages in catch blocks (e.g. “Failed to start checkout”) | ~5 strings |

### Recommendations for i18n fix

1. **Legal pages (terms, privacy, data-deletion)**  
   Create `messages/{locale}/legal.json` with sections/keys for all content. Use `useTranslations('legal')` in `TermsContent`, `PrivacyContent`, `DataDeletionContent`. Convert page metadata to `generateMetadata` using helper + i18n.

2. **Persona pages (for-teachers, for-coaches, for-creators, for-studios)**  
   Add `marketing.forTeachers.benefits`, `marketing.forTeachers.steps`, etc. (and equivalent sections for coaches, creators, studios). Replace inline arrays with `t()` calls, e.g. `t('forTeachers.benefits.0.title')` or structured keys.

3. **launch page**  
   Add `marketing.launch.page.*` (or `launch.page.*`) for: mock greetings, content-type labels, tab labels, creation flow copy, FAQ Q&A pairs. Replace hardcoded strings with `t()`.

4. **pricing page**  
   Add error message keys to `pricing.json` or `errors.json` and use `t()` in catch blocks.

### Elements that should NOT be translated

- Logos, brand name “waQup”
- URLs, API keys, technical identifiers
- `alt` text for decorative images (can stay minimal or generic)
