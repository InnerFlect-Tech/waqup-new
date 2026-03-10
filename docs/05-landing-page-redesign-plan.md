# waQup Landing Page Redesign Plan

## Research Synthesis (Context7 + Web)

### High-Conversion SaaS Principles
- **Clarity → Comprehension → Credibility → Conversion** flow
- Lead with outcomes, not features; benefit-driven copy
- Single primary CTA repeated; avoid decision paralysis
- Social proof early; video demos can lift conversions up to 80%

### Meditation / Wellness App Patterns (Calm, Headspace)
- Emotional hook first; personalization through preference selection
- Clear value prop: "your voice" vs generic content
- Friction management: free trial / practice free messaging
- Gamification and social proof (streak, community)

### Mobile-First & Spacing
- Single-column on mobile; cards stack cleanly
- Fluid typography: `clamp()` for scaling
- Touch targets: 48x48px minimum (56px for primary CTA)
- Consistent spacing: modular scale, 8px base

### Typography & Rhythm
- Strong visual hierarchy; avoid dense paragraphs
- Scannable content; icons support comprehension
- Section spacing: 120–160px desktop, 80–120px tablet, 60–80px mobile

---

## Structure Constraint

**KEEP (unchanged structure):**
1. Hero section
2. Phone showcase (AppMockup) section
3. Final strong closing CTA section
4. PublicFooter

**REDESIGN (between hero and CTA):** 5 new sections with best-practice flow.

---

## Section Blueprint

### SECTION 1 — Core Value Explanation
- **Type:** 4-column (desktop) / 2-column (tablet) / 1-column (mobile) feature grid
- **Goal:** Explain waQup in seconds; benefits, not features
- **Cards:** Simple, scannable, icon + headline + 1–2 lines
- **Content pillars:**
  - Your voice, not generic audio
  - AI helps you create, not replace you
  - Practices you actually replay
  - Takes minutes, not hours

### SECTION 2 — How It Works
- **Type:** 3-step visual flow (horizontal with arrows)
- **Steps:**
  1. Tell the orb what you're working on
  2. Review and record in your own voice
  3. Replay it daily
- **Per step:** icon, headline, 1–2 lines
- **Goal:** Reduce friction; instantly understandable

### SECTION 3 — Product Differentiation
- **Type:** Comparison or strong contrast statements
- **Content:**
  - Generic meditation apps vs Your own voice speaking your intentions
  - Generic affirmations vs Personalised identity encoding
- **Emotional resonance:** "different" and "yours"

### SECTION 4 — Key Product Pillars
- **Type:** 3-card grid (Affirmations, Meditations, Rituals)
- **Per card:** what it is, what it helps change, when people use it
- **Reference:** docs/01-core/05-pipelines-overview.md (depth, purpose)

### SECTION 5 — Psychological Reinforcement
- **Type:** Horizontal benefit bullets (checkmarks)
- **Copy improvements:**
  - ✓ Hear yourself say what you most need to hear
  - ✓ Personal practices, not generic audio
  - ✓ Practice free forever — creation only uses credits
  - ✓ Works in minutes, compounds for life
  - ✓ Your voice data stays yours
- **Layout:** Clean, horizontal on desktop; stack on mobile

---

## Spacing System

| Element | Desktop | Tablet | Mobile |
|--------|---------|--------|--------|
| Section padding (vertical) | 120–160px | 80–120px | 60–80px |
| Card padding | 32–40px | 32px | 24px |
| Grid gap | 24–32px | 24px | 16px |
| Section gap (between sections) | 120–160px | 80px | 60px |

Use design tokens: `spacing.xl` (32), `spacing.xxl` (48), `spacing.xxxl` (64); extend with clamp for responsive.

---

## Copy Optimization
- Shorter, clearer, emotionally resonant
- Avoid abstract language; concrete wording
- Easier to scan; fewer words per card

---

## Components to Create
1. `LandingSection` — wrapper with consistent padding
2. `LandingCard` — glass card with icon, hierarchy
3. `StepFlow` — 3-step visual with arrows
4. `ComparisonBlock` — vs. layout for differentiation
5. `BenefitList` — horizontal checkmarks

---

## Files to Modify
- `packages/web/app/[locale]/page.tsx` — main landing page
- `packages/web/messages/en/marketing.json` — new translation keys
- New: `packages/web/src/components/marketing/LandingSection.tsx`
- New: `packages/web/src/components/marketing/LandingCard.tsx`

---

## Success Criteria
- [ ] Clear what waQup is in seconds
- [ ] Premium, modern feel (Apple/Notion/Calm level)
- [ ] Conversion path obvious
- [ ] Trust built quickly
- [ ] No visual clutter; spacious rhythm
- [ ] Mobile-first; responsive
- [ ] Design system compliant
