# i18n Full Audit & Fix Plan

**Purpose**: Every page must show content in the user’s chosen language. No hardcoded English. This plan audits all pages, lists what to translate vs keep fixed, and sets a clear order of work.

**Status**: Phase 1 (translation keys) done. Phase 2 (wiring pages to translations) partially done. Many pages still show English regardless of locale.

---

## Tone & approach

- **Natural over literal** — Translations should read like a human wrote them in that language. If English copy sounds stiff, the translation will sound worse.
- **Brand names stay** — waQup, Qs, Calm, Headspace remain as-is. The sentence around them translates: "Try waQup free" → "Probiere waQup kostenlos".
- **One source of truth** — English in `messages/en/` is canonical. Other locales can be machine-translated initially, then reviewed by a native speaker.
- **Don't over-translate** — Error codes, URLs, technical terms (e.g. "API") stay in English where industry-standard.

---

## What should NOT be translated

Keep these as-is across all locales:

| Item | Reason |
|------|--------|
| **Logo / brand mark** | "waQup" is the product name |
| **Locale codes in language switcher** | EN, DE, PT, etc. — identifiers, not content |
| **Third-party brand names** | Calm, Headspace, Stripe, Spotify — proper nouns |
| **URLs, API keys, env vars** | Technical, not user-facing |
| **Error codes** | e.g. `E001` — technical |
| **Creator / artist names** | e.g. Nu Moksa, Cronaxy — proper nouns |
| **Scientific terms** | Neuroplasticity, theta, hypnagogic — often kept in English for consistency |
| **Content type IDs** | affirmation, meditation, ritual — used in code; labels are translated |

---

## What MUST be translated

All user-facing copy that explains, instructs, or markets:

- Headlines, subheadlines, body text
- Button labels (Save, Cancel, Continue, etc.)
- Form placeholders, validation messages
- Plan names, descriptions, features, badges
- Section titles (How Qs work, Pricing, etc.)
- Comparison table labels (Content, Voice, Personalisation…)
- Empty states, error messages
- Nav labels (Sanctuary, Library, Profile — from `nav` namespace)
- Legal page content (privacy, terms — from their namespaces)
- Page titles (metadata) — already wired via layouts

---

## Page-by-page audit

### Marketing (public)

| Route | Uses t()? | Hardcoded? | Namespace | Action |
|-------|-----------|------------|-----------|--------|
| `/` (landing) | Yes | Partial | marketing | Check — likely OK |
| `/pricing` | **No** | **All** | pricing | Wire fully — hero, plans, HOW_QS_WORK, comparison table, CTAs |
| `/how-it-works` | Yes | Likely some | marketing | Spot-check images alt, edge copy |
| `/get-qs` | Yes | Likely some | marketing | Spot-check |
| `/explanation` | Partial | **Most** | — | Heavy — science copy, labels, sections all hardcoded |
| `/our-story` | Partial | Body copy | — | Wire narrative sections |
| `/join` | Unknown | Likely | marketing.joinFounders | Wire |
| `/waitlist` | Yes | — | marketing.waitlist | Done |
| `/coming-soon` | Yes | Status labels | marketing.preLaunch? | Wire status text |
| `/for-teachers` | Layout only | **Page content** | — | Wire full page |
| `/for-coaches` | Layout only | **Page content** | — | Wire full page |
| `/for-creators` | Layout only | **Page content** | — | Wire full page |
| `/for-studios` | Layout only | **Page content** | — | Wire full page |
| `/investors` | Layout only | Page content | — | Wire |
| `/launch` | Layout only | Page content | — | Wire |
| `/funnels` | Layout only | Page content | — | Wire |

### Auth

| Route | Uses t()? | Hardcoded? | Action |
|-------|-----------|------------|--------|
| `/login` | Yes | — | Done |
| `/signup` | Yes | — | Done |
| `/forgot-password` | Yes | — | Done |
| `/reset-password` | Yes | — | Done |
| `/confirm-email` | Layout only | Page content? | Wire if needed |

### Sanctuary (authenticated)

| Route | Uses t()? | Hardcoded? | Action |
|-------|-----------|------------|--------|
| `/sanctuary` | Yes | — | Done |
| `/sanctuary/referral` | Partial | STEP_ITEMS, share labels | Wire step cards, Share on X/WhatsApp/Email |
| `/sanctuary/credits`, buy, transactions | Layout | Page content | Wire from pricing namespace |
| `/sanctuary/progress` | Layout | Page content | Wire |
| `/sanctuary/reminders` | Layout | Page content | Wire |
| `/sanctuary/learn`, help | Layout | Page content | Wire |
| `/sanctuary/plan` | Layout | Plans from shared? | Wire plan copy from i18n |

### Main app

| Route | Uses t()? | Hardcoded? | Action |
|-------|-----------|------------|--------|
| `/library` | Layout | Page content | Wire |
| `/create`, orb, conversation | Layout | Page content | Wire |
| `/marketplace`, `[id]` | Layout | Type labels, "Content not found", "About", "Saved!" | Wire |
| `/profile` | Layout | Page content | Wire |
| `/speak` | Layout | Page content | Wire |

### Shared components

| Component | Uses t()? | Hardcoded? | Action |
|-----------|-----------|------------|--------|
| AppLayout (nav) | Partial | Nav items (Sanctuary, Speak, Marketplace, Reminders, etc.) | Use nav namespace |
| PublicFooter | Yes | — | Done |
| WaitlistCTA | Yes | — | Done |
| FoundingMemberModal | Yes | — | Done |
| PageShareButtons | Partial | "Copied" | Wire |

---

## Data sources that need i18n

| Source | Location | Problem | Fix |
|--------|----------|---------|-----|
| PLANS | shared/constants/plans.ts | name, description, features, badge, ctaLabel all English | Add pricing.plans.starter.* etc.; page reads by id |
| HOW_QS_WORK | pricing/page.tsx | Array hardcoded | Use pricing.howQsWork.* |
| Comparison rows | pricing/page.tsx | Inline array | Use pricing.comparison.* or similar |
| Content type labels | marketplace/[id] | affirmation/meditation/ritual | Use create or common namespace |

---

## Execution order

1. **Pricing** — Highest visibility, /de/pricing broken. Add pricing page keys, wire component.
2. **For-teachers, for-coaches, for-creators, for-studios** — Audience pages, same pattern.
3. **Explanation** — Large page, many sections. Add explanation namespace or extend marketing.
4. **Referral** — STEP_ITEMS, share button labels.
5. **AppLayout nav** — Use nav keys for main/app nav items.
6. **Marketplace [id]** — Content type, About, Script excerpt, Saved/Add to Sanctuary.
7. **Coming-soon** — Status labels.
8. **Our-story** — Narrative body.
9. **Join** — Founding members form.
10. **Remaining sanctuary & main** — Credits, progress, reminders, learn, help, library, create, profile, speak.

---

## Namespace checklist

Ensure these exist and have all keys for EN + DE, ES, FR, PT:

- `pricing` — Page already has keys; page does not use them. Expand for plan-specific copy.
- `nav` — Add main nav labels (Sanctuary, Speak, Marketplace, Reminders, My Library, Plan, Settings, Share & Earn, Help & Feedback) and admin nav.
- `create` or `common` — Content type labels (Affirmation, Guided Meditation, Ritual).
- `explanation` or `marketing.explanation` — Science page sections.
- `marketing` — for-teachers, for-coaches, for-creators, for-studios subpages.

---

## Verification

1. Run `npm run verify:i18n` — structural parity.
2. Manual: Visit `/de/pricing`, `/es/how-it-works`, `/fr/sanctuary/referral` — all visible text in that language.
3. No raw keys (e.g. `marketing.waitlist.page.xyz`) visible.
4. Logos, language switcher codes, brand names (waQup, Calm, Headspace) unchanged.
