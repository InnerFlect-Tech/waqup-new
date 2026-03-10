# waQup Professional Quality & Clarity Audit

**Date:** 2026-03-10  
**Scope:** Full product experience — web and mobile  
**Purpose:** Evaluate understandability, intentionality, professionalism, and App Store readiness from the perspective of a new user, reviewer, investor, or App Store reviewer  

---

## Executive Summary

waQup has a **strong foundation** — consistent product copy, polished marketing, clear value proposition, and coherent design. Several **MVP artifacts** and **unfinished flows** remain that could undermine perceived professionalism and App Store approval. The product is **80% ready** for public launch; targeted fixes will close the gap.

**Overall verdict:** Understandable and intentional where complete; unprofessional where incomplete.

---

# 1. Professional Quality Audit Report

## 1.1 What Feels Professional ✅

| Area | Quality | Notes |
|------|---------|-------|
| Marketing (landing, how-it-works, launch, pricing) | **Excellent** | Polished copy, shared constants, consistent tone |
| Auth flow (login, signup, forgot/reset) | **Polished** | Clear CTAs, good error handling, proper placeholders |
| Onboarding | **Polished** | Intention selector, "Hey {name}, what matters most?" — warm, clear |
| Content type explanations | **Strong** | Shared `CONTENT_TYPE_COPY`, distinct depth/time/credits |
| "Practice is free" messaging | Both platforms | Uses `PRACTICE_IS_FREE_ONE_LINER` consistently |
| Create flows (web) | **Polished** | Conversation, Create mode selector, credit costs shown |
| Error boundaries | **Good** | "Something went wrong", Try again, Go to Sanctuary |
| Design system | **Consistent** | Tokens, colors, spacing from shared theme |

## 1.2 What Feels Unprofessional ❌

| Issue | Severity | Location | Impact |
|-------|----------|----------|--------|
| TestLoginButton on login | **Critical** | `/login` | If env enabled in prod, suggests dev/test build |
| Join form does not persist | **Critical** | `/join` | User believes they signed up; nothing saved |
| Record Affirmation placeholder | **High** | `/sanctuary/affirmations/record` | Dead-end page, no recording UI |
| Voice Settings / Privacy & Data do nothing | **High** | Profile (mobile) | Tappable menu items with no screen |
| SpeakScreen fake AI | **High** | Speak (mobile) | Records, 1.5s delay, returns idle — no AI |
| Sanctuary stats hardcoded | **Medium** | Sanctuary home | Library: —, Streak: —, Qs: 50 |
| Profile "Plan: Free" hardcoded | **Medium** | Profile (mobile) | Not from subscription |
| Dev screens reachable in prod | **Medium** | `/speak/test`, Showcase, Health | Internal UI exposed |
| Join "47 spots remaining" | **Low** | Join page | Arbitrary scarcity copy |
| "waQup v1.0.0" footer | **Low** | Profile (mobile) | Feels developer artifact |

## 1.3 Placeholder / Debug Elements

| Element | File/Location | Recommendation |
|---------|---------------|----------------|
| TestLoginButton | `TestLoginButton.tsx` | Never render when `NODE_ENV === 'production'` |
| Join setTimeout(900) | `join/page.tsx:86` | Integrate with Supabase/waitlist API |
| SpeakScreen 1.5s delay | `SpeakScreen.tsx:94` | Replace with real AI or "Coming soon" |
| PlaceholderPage | `sanctuary/affirmations/record` | Implement or remove route |
| Header emoji placeholder | `Header.tsx` (mobile) | Replace with proper icon/logo |
| eas.json appleId | `YOUR_APPLE_ID@example.com` | Replace before submission |

---

# 2. Clarity and Understandability Report

## 2.1 What Users Can Easily Understand ✅

- **What waQup is:** Landing tagline "Your voice. Your practice. Your transformation." + feature cards
- **What makes it different:** FAQ "Headspace and Calm give you generic content... waQup creates personalized content voiced in your own cloned voice"
- **How creation works:** How-it-works 3-step flow + AppMockup (Sanctuary → Create → Listen)
- **Why practice is free:** `PRACTICE_IS_FREE_ONE_LINER` used consistently
- **Content types:** Shared `CONTENT_TYPE_COPY` with duration, depth, science tags
- **Orb concept:** `ORB_INTRO` / `ORB_INTRO_SHORT` — "Speak naturally. The Orb responds..."
- **Voice cloning:** `VOICE_CLONING_COPY` — "Record 60 seconds. waQup clones it — or choose professional voices"

## 2.2 Where Clarity Gaps Exist

| Gap | Impact | Recommendation |
|-----|--------|-----------------|
| "Qs" first-time explanation | New users may not understand until FAQ/pricing | Add one-time tooltip or in-app "What are Qs?" in credits/sanctuary |
| Sanctuary stats "—" | Confusing without context | Add loading state or "Set up your practice to track" |
| Mobile content type descriptions | Slightly different from shared (`"Induce calm states"` vs `"State induction"`) | Use `CONTENT_TYPE_COPY` from shared |
| "Q credits" vs "Qs" terminology | Inconsistent (CreatorGate, AddVoiceModal use "Q credits") | Standardize on "Qs" per product-copy |
| "47 spots remaining" | Feels marketing/synthetic | Either wire to real count or soften ("Limited founding spots") |

## 2.3 Technical / Overly Long Copy

- **FAQ answers:** Generally clear; "21–66 days" and neuroplasticity terms are appropriate for target audience
- **Science section:** Accessible — "The brain rewires itself through repeated exposure"
- **No excessive jargon** in user-facing copy

---

# 3. UX Coherence Report

## 3.1 Navigation Flow

**Web:**
- Main: Library, Create, Profile, Speak — clear
- Sanctuary sidebar: Quick actions + menu items — logical
- Create → sanctuary flows (affirmations/meditations/rituals) — correct

**Mobile:**
- Tabs: Home, Library, Create, Speak, Profile — aligned
- Profile: Account Settings, Progress, Reminders → work
- Voice Settings, Privacy & Data → **no navigation** (dead ends)

## 3.2 Terminology Consistency

| Concept | Canonical | Inconsistent usage |
|---------|-----------|---------------------|
| Credits | **Qs** | "Q credits" (CreatorGate, AddVoiceModal) |
| Email placeholder | `your@email.com` | `you@example.com` (join, investors, CreatorGate) |
| Content type labels | `CONTENT_TYPE_COPY` | Mobile HomeScreen/CreateScreen use custom strings |
| Practice free | `PRACTICE_IS_FREE_ONE_LINER` | Generally consistent |

## 3.3 Action Naming

- Buttons: "Sign In", "Continue →", "Claim founding membership", "Create your account now" — clear
- "Get Credits →" vs "Get Qs" — minor inconsistency (Profile shows "Get Credits →")

## 3.4 Dead Ends (No-Op Actions)

| Action | Result |
|--------|--------|
| Tap "Voice Settings" (mobile) | Nothing |
| Tap "Privacy & Data" (mobile) | Nothing |
| Submit Join form | Fake success, no persistence |
| Navigate to `/sanctuary/affirmations/record` | PlaceholderPage only |
| Tap orb, record, stop (mobile Speak) | 1.5s delay, return to idle — no AI response |

---

# 4. Copy Quality Report

## 4.1 Grammar & Tone

- **Grammar:** No significant issues found
- **Tone:** Calm, confident, premium — aligned with Apple/Headspace/Notion
- **Conciseness:** Generally good; FAQ answers are appropriately detailed

## 4.2 Inconsistencies to Fix

| Copy | Location | Issue |
|------|----------|-------|
| "Personalise" vs "Personalize" | Onboarding uses "personalise" (UK) | Decide: UK or US; standardize |
| "Credits" vs "Qs" | Profile mobile: "Credits" label, "Get Credits →" | Use "Qs" where referring to creation currency |
| "Plan: Free" | Profile mobile | Should reflect real subscription or "Free Plan" |

## 4.3 Suggested Rewrites

| Current | Suggested | Reason |
|---------|-----------|--------|
| "47 spots remaining at founding price" | "Limited founding spots available" | Less synthetic scarcity |
| "Your cloned ElevenLabs voice" (Voice Settings) | "Your cloned voice" | Avoid exposing vendor |
| "Something went wrong" (Speak error) | "We couldn't process that. Try again." | Slightly more actionable |

## 4.4 Placeholder Audit

| Placeholder | Used in | Recommendation |
|-------------|---------|----------------|
| `your@email.com` | login, signup, forgot-password, WaitlistCTA | ✅ Keep (canonical) |
| `you@example.com` | join, investors, CreatorGate | ❌ Change to `your@email.com` |
| `Enter your email` | mobile auth | ✅ Acceptable |
| `Your first name` | join | ✅ Good |
| `e.g. Alex` | onboarding profile | ✅ Good |
| `How you show up in the marketplace…` | profile | ✅ Good |

---

# 5. Visual Professionalism Report

## 5.1 Spacing & Layout

- **Design tokens:** `spacing`, `borderRadius`, `BLUR`, `HEADER_PADDING_X` used consistently (per design-system rules)
- **Content max width:** `CONTENT_MAX_WIDTH`, `CONTENT_NARROW`, `CONTENT_MEDIUM` applied
- **No random spacing** observed in sampled pages

## 5.2 Typography

- Variants: `h1`, `h2`, `h3`, `h4`, `body`, `small`, `caption`, `captionBold` — hierarchy clear
- Landing: clamp for responsive sizing, letter-spacing

## 5.3 Color Consistency

- Theme colors from `packages/shared/src/theme` — `colors.text.primary`, `colors.accent.primary`, etc.
- Join page has hardcoded hex (`#34d399`, `#f59e0b`) in PERKS — consider moving to theme

## 5.4 Unfinished / Crowded UI

| Area | Issue |
|------|-------|
| How-it-works phone mockup | Hardcoded `#060606`, `#9333EA` — not theme tokens |
| Sanctuary stats "—" | Looks placeholder without loading/empty state |
| Library empty state | "Your library is empty" — good |
| Marketplace empty | "Nothing here yet" — good |
| Error page | Uses `DEFAULT_BRAND_COLORS` inline — acceptable for fallback |

---

# 6. List of Elements That Feel Unfinished

## Critical (Blocks Launch)

1. **TestLoginButton** — Must never appear in production
2. **Join page** — Form does not persist; user believes signup succeeded
3. **Record Affirmation** — Placeholder page; linked or discoverable
4. **Profile Voice Settings & Privacy** (mobile) — Tappable but no screen

## High (Strongly Recommend)

5. **SpeakScreen AI** (mobile) — Recording works; AI is fake (1.5s delay)
6. **Sanctuary stats** — Hardcoded —, —, 50
7. **Profile Plan** (mobile) — Hardcoded "Free"

## Medium (Polish)

8. **Dev screens** — `/speak/test`, Showcase, Health — gate or exclude from prod
9. **Terminology** — "Qs" vs "Q credits"; "Credits" vs "Qs"
10. **Email placeholders** — Unify to `your@email.com`
11. **Join "47 spots"** — Synthetic scarcity
12. **Header emoji** (mobile) — Replace with proper asset

## Low (Nice to Have)

13. **Personalise vs Personalize** — Spelling consistency
14. **Join PERKS colors** — Move hardcoded hex to theme
15. **version footer** — "waQup v1.0.0" feels dev artifact

---

# 7. Suggested Improvements (Prioritized)

## P0 — Before Any Public Launch

1. **Remove/gate TestLoginButton**  
   - Never render when `NODE_ENV === 'production'` OR explicitly check `NEXT_PUBLIC_ENABLE_TEST_LOGIN !== 'true'`  
   - Add build check: fail if `NEXT_PUBLIC_ENABLE_TEST_LOGIN=true` in prod build

2. **Integrate Join page**  
   - Wire to Supabase `waitlist` or existing waitlist API  
   - Remove fake `setTimeout(900)` and success-without-persist

3. **Implement or hide Record Affirmation**  
   - Either build recording UI or remove/hide link to `/sanctuary/affirmations/record`

4. **Wire Profile Voice Settings & Privacy**  
   - Add screens or remove menu items until implemented

## P1 — Before App Store Submission

5. **Complete or label SpeakScreen AI**  
   - Integrate real voice AI, or add "Coming soon" + disable recording with clear message

6. **Gate dev screens in production**  
   - Exclude Showcase, Health from prod build or require superadmin  
   - Exclude or gate `/speak/test`

7. **Wire Sanctuary stats**  
   - Library count, streak, Q balance from API; or show loading/empty state

8. **Wire Profile Plan**  
   - Reflect real subscription or "Free plan"

## P2 — Short-Term Polish

9. Standardize terminology (Qs everywhere; unify email placeholders)
10. Use `CONTENT_TYPE_COPY` on mobile HomeScreen/CreateScreen
11. Replace Header emoji with proper logo/icon
12. Soften Join "47 spots" or wire to real count

## P3 — Ongoing

13. Spelling consistency (UK vs US)
14. Replace hardcoded colors in Join PERKS with theme
15. Consider one-time "What are Qs?" for new users

---

# 8. Priority Fixes Required Before Public Launch

## Must Fix (Blocking)

| # | Fix | Effort |
|---|-----|--------|
| 1 | TestLoginButton: never render in production | Low |
| 2 | Join page: integrate with Supabase/waitlist API | Medium |
| 3 | Record Affirmation: implement or hide | Medium (hide) / High (implement) |
| 4 | Profile Voice Settings & Privacy: add screens or remove items | Medium |

## Should Fix (App Store Risk)

| # | Fix | Effort |
|---|-----|--------|
| 5 | SpeakScreen: real AI or "Coming soon" | High / Low |
| 6 | Dev screens: gate or exclude from prod | Low |
| 7 | Sanctuary stats: wire or add loading state | Medium |
| 8 | Profile Plan: wire to subscription | Medium |

## Nice to Fix

| # | Fix | Effort |
|---|-----|--------|
| 9 | Terminology (Qs, email placeholders) | Low |
| 10 | Content type copy on mobile from shared | Low |

---

# Appendix: Page-by-Page Summary

## Web — Marketing
- `/` — Polished
- `/launch` — Polished
- `/how-it-works` — Polished
- `/pricing` — Polished
- `/explanation` — Polished
- `/join` — **MVP** (form does not persist)
- `/waitlist` — Polished
- `/get-qs` — Exists
- `/investors` — Exists (you@example.com)

## Web — Auth
- `/login` — Polished + TestLoginButton (env-gated)
- `/signup` — Polished
- `/forgot-password`, `/reset-password`, `/confirm-email` — Polished
- `/coming-soon` — Polished

## Web — Main App
- `/library` — Polished, good empty state
- `/create` — Polished
- `/create/conversation`, `/create/orb` — Polished
- `/profile` — Polished
- `/speak` — Polished (real AI)
- `/speak/test` — **Dev** (gate)
- `/marketplace` — Polished

## Web — Sanctuary
- `/sanctuary` — **MVP** (hardcoded stats)
- Other sanctuary pages — Polished
- `/sanctuary/affirmations/record` — **Placeholder**

## Mobile
- Auth screens — Polished
- HomeScreen, CreateScreen, LibraryScreen — Polished
- SpeakScreen — **Placeholder** (fake AI)
- ProfileScreen — **Partial** (Voice/Privacy no-op, Plan hardcoded)
- CreditsScreen, ProgressScreen, RemindersScreen, SettingsScreen — Polished
- ShowcaseScreen, HealthScreen — **Dev** (gate)

---

*End of Professional Quality & Clarity Audit*
