# waQup Product Quality Audit

**Date:** 2026-03-10  
**Scope:** All user-facing pages and components across web, mobile, and shared packages  
**Purpose:** Evaluate product quality, clarity, UX, copy, and professionalism for new users and App Store reviewers

---

## Executive Summary

The waQup codebase has a solid foundation with consistent shared product copy (`@waqup/shared/constants`), professional marketing pages, and coherent flows. Several unfinished or debug artifacts remain that could affect first impressions and App Store review. Terminology shows minor inconsistency between "Qs" and "Q credits."

**Critical issues:** 4  
**Moderate issues:** 8  
**Minor / polish:** 12+

---

## 1. Page-by-Page Inventory

### 1.1 Marketing & Landing (Web)

| Route | Status | Notes |
|-------|--------|-------|
| `/` | ✅ Polished | Landing with features, benefits, waitlist CTA, Founding Members modal. Uses `PRACTICE_IS_FREE_ONE_LINER`, `VOICE_CLONING_COPY` from shared. |
| `/launch` | ✅ Polished | Primary marketing landing with phone mockup, FAQ, perks. |
| `/how-it-works` | ✅ Polished | Step-by-step explanation with `AppMockup`. |
| `/pricing` | ✅ Polished | Plans from `@waqup/shared/constants/plans`. |
| `/explanation` | ✅ Polished | Science narrative with rotating social proof quotes. |
| `/join` | ⚠️ **MVP** | Form submits but **TODO: integrate with Supabase or waitlist API**. Uses fake `setTimeout(900)` and shows success without persisting. |
| `/waitlist` | ✅ Polished | Multi-step waitlist form. |
| `/get-qs` | ✅ Exists | Public Q packs; sign-in required to purchase. |
| `/funnels` | ✅ Internal | Not in public nav. |
| `/investors` | ✅ Exists | Footer only. |
| `/play/[id]` | ✅ Exists | Public audio player (SSR + OG). |

### 1.2 Auth (Web)

| Route | Status | Notes |
|-------|--------|-------|
| `/login` | ⚠️ Debug | **TestLoginButton** rendered when `NEXT_PUBLIC_ENABLE_TEST_LOGIN=true`. Button label: "Test login". Must be disabled in production. |
| `/signup` | ✅ Polished | Email + password + Google. Placeholders: `your@email.com`, `Create a password`, `Confirm your password`. |
| `/forgot-password` | ✅ Exists | Standard flow. |
| `/reset-password` | ✅ Exists | Standard flow. |
| `/confirm-email` | ✅ Exists | Email confirmation. |
| `/coming-soon` | ✅ Polished | Waitlist gate for logged-in users without access. Shows status badge, WaitlistCTA. |

### 1.3 Main App (Web)

| Route | Status | Notes |
|-------|--------|-------|
| `/library` | ✅ Exists | Content library; search placeholder: "Search your library...". |
| `/create` | ✅ Polished | Content type selector; links to sanctuary create flows. Uses `CONTENT_CREDIT_COSTS`, `formatQs`. |
| `/create/conversation` | ✅ Exists | Text conversational creation. Placeholder: "Tell me what to change…" / "Type your message…". |
| `/create/orb` | ✅ Exists | Voice orb creation; credit costs shown. |
| `/profile` | ✅ Exists | Profile; placeholder "How you show up in the marketplace…". |
| `/speak` | ✅ Exists | Real-time voice AI. Shows "Not enough Qs. Get more to continue." |
| `/speak/test` | ⚠️ **Dev** | Dev test harness. Should be excluded from production or behind superadmin gate. |
| `/marketplace` | ✅ Exists | Browse; placeholder "Search content...". |
| `/marketplace/[id]` | ✅ Exists | Item detail + player. |
| `/marketplace/creator` | ✅ Exists | CreatorGate, creator dashboard. |

### 1.4 Sanctuary (Web)

| Route | Status | Notes |
|-------|--------|-------|
| `/sanctuary` | ⚠️ **MVP** | Stats strip shows **hardcoded** values: `Library: —`, `Streak: —`, `Qs: 50`. Not wired to real data. |
| `/sanctuary/settings` | ✅ Exists | Account settings. |
| `/sanctuary/voice` | ✅ Exists | Voice cloning setup. |
| `/sanctuary/voices` | ✅ Exists | Voice library. |
| `/sanctuary/progress` | ✅ Exists | Progress tracking; placeholders for journal prompts. |
| `/sanctuary/reminders` | ✅ Exists | Reminders manager. |
| `/sanctuary/referral` | ✅ Exists | Referral & rewards. |
| `/sanctuary/learn` | ✅ Exists | Educational content. |
| `/sanctuary/help` | ✅ Exists | Help & support. |
| `/sanctuary/plan` | ✅ Exists | Plan picker. |
| `/sanctuary/credits` | ✅ Exists | Credits page; "Your Qs", "Get Qs". |
| `/sanctuary/credits/buy` | ✅ Exists | Buy Qs. |
| `/sanctuary/credits/transactions` | ✅ Exists | Transaction history. |
| `/sanctuary/affirmations/record` | ⚠️ **Placeholder** | Uses **PlaceholderPage** — "Record Affirmation", "Record your voice for this affirmation.", Back button only. No real recording UI. |
| All other affirmation/meditation/ritual flows | ✅ Exist | Create init/intent/script/voice/audio/review/complete. |

### 1.5 Onboarding (Web)

| Route | Status | Notes |
|-------|--------|-------|
| `/onboarding` | ✅ Polished | Intention selector with 6 intentions. |
| `/onboarding/profile` | ✅ Exists | Profile setup; placeholder "e.g. Alex". |
| `/onboarding/preferences` | ✅ Exists | Preferences. |
| `/onboarding/guide` | ✅ Exists | Getting started guide. |

### 1.6 System & Admin (Web)

| Route | Status | Notes |
|-------|--------|-------|
| `/admin/*` | Internal | Superadmin only. Oracle page has dev-style inputs ("empty = random", "e.g. Samantha, Daniel, Karen…"). |
| `/system/*` | Internal | System overview, schema, pipelines, audio, conversation. |
| `/showcase` | Internal | Design system showcase. |
| `/health` | Internal | API health dashboard. |
| `/pages`, `/sitemap-view` | Internal | Route index, sitemap. |

### 1.7 Legal (Web)

| Route | Status | Notes |
|-------|--------|-------|
| `/privacy` | ✅ Exists | Privacy policy via `PrivacyContent`. |
| `/terms` | ✅ Exists | Terms of service. |

---

## 2. Mobile Screens Inventory

| Screen | Status | Notes |
|--------|--------|-------|
| **Auth** | | |
| LoginScreen | ✅ Exists | Email/password; placeholders "Enter your email", "Enter your password". |
| SignupScreen | ✅ Exists | Standard signup. |
| ForgotPasswordScreen | ✅ Exists | |
| ResetPasswordScreen | ✅ Exists | |
| **Main** | | |
| HomeScreen | ✅ Polished | Greeting, content type cards. Uses `PRACTICE_IS_FREE_ONE_LINER`. Descriptions differ slightly from shared `CONTENT_TYPE_COPY` (e.g. "Induce calm states" vs "State induction"). |
| CreateScreen | ✅ Polished | Content type cards with depth, time, credits. Uses `PRACTICE_IS_FREE_ONE_LINER`. Duplicated descriptions vs shared. |
| LibraryScreen | ✅ Exists | Search "Search your library...". |
| SpeakScreen | ⚠️ **Placeholder** | **Comment: "Placeholder: future AI processing goes here"**. Recording starts/stops; fake 1.5s delay then returns to idle. No actual AI. |
| ProfileScreen | ⚠️ **Partial** | "Voice Settings" and "Privacy & Data" have **no `screen`** — tapping does nothing. "Plan: Free" hardcoded. |
| **Sanctuary** | | |
| CreditsScreen | ✅ Exists | Credits overview. |
| ProgressScreen | ✅ Exists | Progress & streaks. |
| RemindersScreen | ✅ Exists | Reminders. |
| SettingsScreen | ✅ Exists | Name placeholder "Your name". |
| **Content** | | |
| ContentDetailScreen | ✅ Exists | Content detail. |
| ContentCreateScreen | ✅ Exists | Create flow with form fields. |
| CreateModeScreen | ✅ Exists | Mode selection. |
| **Other** | | |
| ShowcaseScreen | ⚠️ **Dev** | Design system component showcase. **In root navigator** — reachable via `waqup://showcase` deep link. |
| HealthScreen | ⚠️ **Dev** | API health, env vars, service status. **In root navigator** — reachable via `waqup://health`. Footer: "Accessible via waqup://health". |
| SetupScreen | ✅ Exists | Setup flow. |

---

## 3. Copy Excerpts & Issues

### 3.1 Shared Product Copy (Canonical)

**From `packages/shared/src/constants/product-copy.ts`:**

- `PRACTICE_IS_FREE_SHORT`: "Practice is free. Replay your content as often as you like. Qs are only used when you create something new."
- `PRACTICE_IS_FREE_ONE_LINER`: "Practice is always free — Qs only power creation."
- `QS_EXPLANATION`: "Qs are credits used to create new content..."
- `VOICE_CLONING_COPY`: "Record 60 seconds of your voice. waQup clones it — or choose from professional voices."
- `ORB_INTRO` / `ORB_INTRO_SHORT`: Orb as voice AI.

**From `packages/shared/src/constants/content-type-copy.ts`:**

- Affirmation: "Cognitive re-patterning through voice and positive language..."
- Meditation: "State induction through guided visualization and relaxation..."
- Ritual: "Identity encoding through intentional practice and voice..."

### 3.2 Terminology Inconsistencies

| Location | Term Used | Canonical |
|----------|-----------|-----------|
| product-copy.ts, plans.ts, credits page | **Qs** | — |
| CreatorGate.tsx | **Q credits** | "Qs" |
| AddVoiceModal.tsx | **Q credits** | "Qs" |
| API oracle session | **Q** (singular) | "Qs" |

**Recommendation:** Standardize on **"Qs"** everywhere; use "Q credits" only when context requires (e.g. "Q credits" in a sentence like "Earn Q credits").

### 3.3 Email Placeholder Variants

- `your@email.com` (login, signup, forgot-password)
- `you@example.com` (join, CreatorGate, investors)
- `Enter your email` (mobile auth)

**Recommendation:** Use `your@email.com` consistently (avoid `example.com` in production copy).

### 3.4 Debug / Test Copy

| Location | Copy | Risk |
|----------|------|------|
| TestLoginButton | "Test login" | High if `NEXT_PUBLIC_ENABLE_TEST_LOGIN=true` in prod |
| HealthScreen footer | "Accessible via waqup://health" | Low (dev screen) |
| Join page success | "You're in, {name}" | N/A (fake success) |

---

## 4. Placeholder, Debug & Unfinished Elements

### 4.1 Placeholder Pages

| Page | Component | Copy |
|------|-----------|------|
| `/sanctuary/affirmations/record` | PlaceholderPage | "Record Affirmation", "Record your voice for this affirmation." |

**Routes.ts:** `{ path: '/sanctuary/affirmations/record', note: 'Placeholder' }`

### 4.2 TODO / Unimplemented

| File | Line | Issue |
|------|------|-------|
| `join/page.tsx` | 86 | `// TODO: integrate with Supabase or waitlist API` — form does not persist |
| `SpeakScreen.tsx` | 94 | `// Placeholder: future AI processing goes here` |
| `Header.tsx` (mobile) | 8 | `// For now, using simple text/emoji as placeholder` |

### 4.3 Hardcoded / Static Data

| Location | Data | Issue |
|----------|------|-------|
| Sanctuary home | `Library: —`, `Streak: —`, `Qs: 50` | Stats not from API |
| ProfileScreen (mobile) | "Plan: Free" | Not from subscription |
| Join page | Fake 900ms delay, success without DB | No real signup flow |

### 4.4 Dev-Only / Internal Screens

| Screen/Route | Access | Recommendation |
|--------------|--------|-----------------|
| `/speak/test` | Direct URL | Gate behind superadmin or remove in prod |
| ShowcaseScreen (mobile) | `waqup://showcase` | Remove from production build or gate |
| HealthScreen (mobile) | `waqup://health` | Remove from production build or gate |
| TestLoginButton | Env-gated | Ensure `NEXT_PUBLIC_ENABLE_TEST_LOGIN` never set in prod |

### 4.5 Build-Time Placeholders

| File | Content |
|------|---------|
| `supabase.ts` (web) | `url: supabaseUrl || 'https://placeholder.supabase.co'`, `key: 'placeholder-anon-key-build-only'` — for prerender only |
| `eas.json` | `"appleId": "YOUR_APPLE_ID@example.com"` — template value |

---

## 5. UX Flow & Clarity Audit

### 5.1 Navigation

**Web:**

- Main nav: Library, Create, Profile, Speak; Sanctuary sidebar with quick actions and menu items.
- Create flow: `/create` → sanctuary create flows (affirmations/meditations/rituals).
- Speak: `/speak` with Q selection and session flow.

**Mobile:**

- Bottom tabs: Home, Library, Create, Speak, Profile.
- Create: Home → CreateMode (content type) → ContentCreateScreen.
- Profile: Menu items; "Voice Settings" and "Privacy & Data" **do not navigate** (no `screen` prop).

### 5.2 Dead Ends / No-Op Actions

| Action | Location | Result |
|--------|----------|--------|
| Tap "Voice Settings" | ProfileScreen (mobile) | No navigation |
| Tap "Privacy & Data" | ProfileScreen (mobile) | No navigation |
| Submit join form | Join page | Fake success, no persistence |
| Tap "Record Affirmation" | sanctuary/affirmations/record | PlaceholderPage only |

### 5.3 Clarity for New Users

**Strengths:**

- Clear "Practice is free" messaging.
- Content type descriptions (affirmation vs meditation vs ritual) are distinct.
- Onboarding intention selector is clear.

**Gaps:**

- Sanctuary stats show "—" for Library/Streak — confusing without context.
- "Qs" may need one-time explanation for new users (FAQ on launch/pricing helps).

---

## 6. App Store Reviewer Considerations

### 6.1 High Risk

1. **TestLoginButton** — If visible, suggests test/dev build. Ensure `NEXT_PUBLIC_ENABLE_TEST_LOGIN` is never `true` in production.
2. **Join page** — Form appears to work but does not persist. Could be seen as misleading.
3. **Showcase / Health** — If reviewers open `waqup://showcase` or `waqup://health`, they see internal dev UI. Consider excluding from production builds.

### 6.2 Medium Risk

4. **SpeakScreen** — Recording UI works but AI is fake (1.5s delay). Could be perceived as incomplete.
5. **sanctuary/affirmations/record** — Placeholder page; linked from flows? If discoverable, looks unfinished.
6. **Profile "Voice Settings" / "Privacy & Data"** — Tappable but no action. Suggests incomplete features.

### 6.3 Low Risk

7. Hardcoded stats on Sanctuary home.
8. Minor terminology mix (Qs vs Q credits).
9. `you@example.com` in some placeholders.

---

## 7. Recommendations Summary

### 7.1 Immediate (Before Public Launch / App Store)

1. **Remove or gate TestLoginButton** — Never render when `NODE_ENV === 'production'` or when `NEXT_PUBLIC_ENABLE_TEST_LOGIN !== 'true'`.
2. **Integrate Join page** — Wire to Supabase/waitlist API; remove fake `setTimeout` success.
3. **Implement or hide Record Affirmation** — Either build recording UI or remove/hide link to placeholder.
4. **Wire Profile Voice Settings & Privacy** — Add screens or remove menu items until implemented.
5. **Gate or remove dev screens in production** — `/speak/test`, Showcase, Health; exclude from prod builds or require superadmin.

### 7.2 Short Term

6. **Wire Sanctuary stats** — Library count, streak, real Q balance from API.
7. **Standardize terminology** — Use "Qs" everywhere; reserve "Q credits" only where context demands.
8. **Unify email placeholders** — Use `your@email.com` across web and mobile.
9. **Complete SpeakScreen AI** — Replace placeholder with real voice AI or clearly label as "Coming soon".

### 7.3 Polish

10. Replace `YOUR_APPLE_ID@example.com` in eas.json before submission.
11. Add loading/empty states where stats show "—".
12. Consider one-time "What are Qs?" tooltip for new users.

---

## 8. Files Referenced

| Category | Paths |
|----------|-------|
| Shared copy | `packages/shared/src/constants/product-copy.ts`, `content-type-copy.ts`, `plans.ts` |
| Web pages | `packages/web/app/**/page.tsx` |
| Mobile screens | `packages/mobile/src/screens/**/*.tsx` |
| Navigation | `packages/web/src/lib/routes.ts`, `packages/mobile/src/navigation/RootNavigator.tsx` |
| Placeholder component | `packages/web/src/components/shared/PlaceholderPage.tsx` |
| Test login | `packages/web/src/components/shared/TestLoginButton.tsx` |

---

*End of audit*
