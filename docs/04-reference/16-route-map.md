# waQup Web — Authoritative Route Map

**Last Updated**: 2026-03-10  
**Source of truth**: This file + `packages/web/src/lib/routes.ts`

**Status legend** (aligned with `routes.ts` completeness): `Live` = complete; `Wired` = API-connected; `Stub` = basic structure; `Placeholder` = generic placeholder; `Mock` = mock data; `Visual` = UI-only (audio page); `Redirect` = redirects elsewhere. Create flows: `to_change` in routes.ts = needs conversational refactor.

---

## When Adding Routes

1. **Create the page** under `app/[locale]/` in the appropriate route group (auth, main, marketing, sanctuary, etc.).
2. **Add to route map**: Update this file (`docs/04-reference/16-route-map.md`) with the new row in the correct table.
3. **Add to routes.ts**: Add a `RouteEntry` in `packages/web/src/lib/routes.ts` so the route appears in `/pages` and `/sitemap-view`.
4. **Auth guard**: If protected, ensure the path prefix is listed in `proxy.ts` protected prefixes.
5. **i18n**: Add any new page titles or labels to `packages/web/messages/[locale]/` if needed.

---

## Locale-Aware Routing

All user-facing routes live under `app/[locale]/` with `next-intl` (locales: en, pt, es, fr, de). Default locale is `en`.

- **`/`** → redirects to `/en` (canonical landing under `[locale]`)
- **`/home`** → redirects to `/sanctuary` (permanent)
- **`/sanctuary`**, **`/speak`** → rewrites to `/en/sanctuary`, `/en/speak` (unprefixed URLs use default locale)

---

## Auth Requirements Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Public (no auth required) |
| 🔒 | Protected (requires authenticated session — enforced by `proxy.ts` / Next.js 16 proxy) |
| 🛠 | Dev only (blocked in production by proxy) |

---

## Marketing Routes (public)

| Route | File | Auth | Status | Notes |
|-------|------|------|--------|-------|
| `/` | `app/[locale]/page.tsx` | ✅ | Live | Redirects to `/en`; landing — hero, features, CTA |
| `/how-it-works` | `app/[locale]/(marketing)/how-it-works/page.tsx` | ✅ | Live | Journey steps, benefits, early-access CTA |
| `/pricing` | `app/[locale]/(marketing)/pricing/page.tsx` | ✅ | Live | Real Stripe checkout for Founding Member plan |
| `/terms` | `app/[locale]/terms/page.tsx` | ✅ | Stub | Terms of Service placeholder |
| `/explanation` | `app/[locale]/explanation/page.tsx` | ✅ | Live | The Science — why voice + affirmations work |
| `/our-story` | `app/[locale]/(marketing)/our-story/page.tsx` | ✅ | Live | Our Story — founder narrative |
| `/privacy` | `app/[locale]/privacy/page.tsx` | ✅ | Live | Privacy Policy (full content) |
| `/join` | `app/[locale]/join/page.tsx` | ✅ | Live | Founding member sign-up |
| `/waitlist` | `app/[locale]/waitlist/page.tsx` | ✅ | Live | Multi-step waitlist form |
| `/get-qs` | `app/[locale]/(marketing)/get-qs/page.tsx` | ✅ | Live | Public Q packs |
| `/funnels` | `app/[locale]/(marketing)/funnels/page.tsx` | ✅ | Live | Sales funnels (internal) |
| `/investors` | `app/[locale]/(marketing)/investors/page.tsx` | ✅ | Live | Investor pitch |
| `/play/[id]` | `app/[locale]/play/[id]/page.tsx` | ✅ | Live | Public audio player (SSR + OG) |
| `/launch` | `app/[locale]/(marketing)/launch/page.tsx` | ✅ | Live | Primary marketing landing |
| `/for-coaches` | `app/[locale]/(marketing)/for-coaches/page.tsx` | ✅ | Live | For coaches audience page |
| `/for-creators` | `app/[locale]/(marketing)/for-creators/page.tsx` | ✅ | Live | For creators |
| `/for-studios` | `app/[locale]/(marketing)/for-studios/page.tsx` | ✅ | Live | For studios |
| `/for-teachers` | `app/[locale]/(marketing)/for-teachers/page.tsx` | ✅ | Live | For teachers |
| `/data-deletion` | `app/[locale]/data-deletion/page.tsx` | ✅ | Live | User data deletion (Meta submission) |

---

## Auth Routes (public)

| Route | File | Auth | Status | Notes |
|-------|------|------|--------|-------|
| `/login` | `app/[locale]/(auth)/login/page.tsx` | ✅ | Live | Email + Google OAuth, dev override fallback |
| `/signup` | `app/[locale]/(auth)/signup/page.tsx` | ✅ | Live | Email signup with verification flow |
| `/forgot-password` | `app/[locale]/(auth)/forgot-password/page.tsx` | ✅ | Live | Sends password reset email |
| `/reset-password` | `app/[locale]/(auth)/reset-password/page.tsx` | ✅ | Live | Consumes reset token from email link |
| `/confirm-email` | `app/[locale]/(auth)/confirm-email/page.tsx` | ✅ | Live | Email confirmation landing |
| `/coming-soon` | `app/[locale]/coming-soon/page.tsx` | ✅ | Live | Access gate for waitlist-pending users |
| `/auth/beta-signup` | — | ✅ | Redirect | Redirects to `/waitlist` |
| `/auth/callback` | `app/[locale]/auth/callback/route.ts` | ✅ | Live | Supabase OAuth code exchange handler |
| `/auth/callback-mobile` | `app/[locale]/auth/callback-mobile/route.ts` | ✅ | Live | Mobile OAuth proxy — returns 200 so in-app browser receives code; add to Supabase Redirect URLs |

---

## Main App Routes (protected)

All routes below require an authenticated Supabase session. Unauthenticated requests are redirected to `/` by `proxy.ts` (Next.js 16 proxy convention).

| Route | File | Auth | Status | Notes |
|-------|------|------|--------|-------|
| `/home` | — | 🔒 | Redirect | Redirects to `/sanctuary` |
| `/library` | `app/[locale]/(main)/library/page.tsx` | 🔒 | Wired | Fetches from `content_items` via `useContent()` |
| `/create` | `app/[locale]/(main)/create/page.tsx` | 🔒 | Live | Links to 3 content-type create flows |
| `/create/conversation` | `app/[locale]/(main)/create/conversation/page.tsx` | 🔒 | Wired | Chat UI — calls /api/conversation, saveCreationHandoff |
| `/profile` | `app/[locale]/(main)/profile/page.tsx` | 🔒 | Live | Reads real user from auth store |
| `/speak` | `app/[locale]/(main)/speak/page.tsx` | 🔒 | Live | Animated orb UI |
| `/speak/test` | `app/[locale]/(main)/speak/test/page.tsx` | 🔒 | Live | Dev test harness |
| `/create/orb` | `app/[locale]/(main)/create/orb/page.tsx` | 🔒 | Wired | Voice orb creation |
| `/marketplace` | `app/[locale]/(main)/marketplace/page.tsx` | 🔒 | Wired | Browse marketplace (marketplace_items, content_items) |
| `/marketplace/[id]` | `app/[locale]/(main)/marketplace/[id]/page.tsx` | 🔒 | Wired | Item detail + player |
| `/marketplace/creator` | `app/[locale]/(main)/marketplace/creator/page.tsx` | 🔒 | Wired | Creator dashboard — published, drafts, analytics |

---

## Sanctuary Routes (protected)

| Route | File | Auth | Status | Notes |
|-------|------|------|--------|-------|
| `/sanctuary` | `app/[locale]/sanctuary/page.tsx` | 🔒 | Live | Quick actions + menu |
| `/sanctuary/settings` | `app/[locale]/sanctuary/settings/page.tsx` | 🔒 | Wired | Profile, theme, notifications |
| `/sanctuary/settings/about` | `app/[locale]/sanctuary/settings/about/page.tsx` | 🔒 | Live | About — version, changelog link, acknowledgments |
| `/sanctuary/progress` | `app/[locale]/sanctuary/progress/page.tsx` | 🔒 | Wired | Heatmap, sessions, get_progress_stats |
| `/sanctuary/referral` | `app/[locale]/sanctuary/referral/page.tsx` | 🔒 | Stub | Referral link; backend ready |
| `/sanctuary/reminders` | `app/[locale]/sanctuary/reminders/page.tsx` | 🔒 | Wired | user_reminders CRUD |
| `/sanctuary/learn` | `app/[locale]/sanctuary/learn/page.tsx` | 🔒 | Stub | Learn content placeholder |
| `/sanctuary/help` | `app/[locale]/sanctuary/help/page.tsx` | 🔒 | Stub | Help & support |
| `/sanctuary/plan` | `app/[locale]/sanctuary/plan/page.tsx` | 🔒 | Wired | Subscription plan picker |
| `/sanctuary/voice` | `app/[locale]/sanctuary/voice/page.tsx` | 🔒 | Wired | Voice cloning setup |
| `/sanctuary/voices` | `app/[locale]/sanctuary/voices/page.tsx` | 🔒 | Wired | Voice library browser |
| `/sanctuary/series` | `app/[locale]/sanctuary/series/page.tsx` | 🔒 | Wired | Series list |
| `/sanctuary/series/[id]` | `app/[locale]/sanctuary/series/[id]/page.tsx` | 🔒 | Wired | Series detail |
| `/sanctuary/credits` | `app/[locale]/sanctuary/credits/page.tsx` | 🔒 | Wired | Credit balance |
| `/sanctuary/credits/buy` | `app/[locale]/sanctuary/credits/buy/page.tsx` | 🔒 | Wired | Buy Qs |
| `/sanctuary/credits/transactions` | `app/[locale]/sanctuary/credits/transactions/page.tsx` | 🔒 | Wired | Transaction history |

### Affirmations

| Route | File | Auth | Status |
|-------|------|------|--------|
| `/sanctuary/affirmations` | `app/[locale]/sanctuary/affirmations/page.tsx` | 🔒 | Wired |
| `/sanctuary/affirmations/[id]` | `app/[locale]/sanctuary/affirmations/[id]/page.tsx` | 🔒 | Wired |
| `/sanctuary/affirmations/[id]/edit` | `app/[locale]/sanctuary/affirmations/[id]/edit/page.tsx` | 🔒 | Wired |
| `/sanctuary/affirmations/[id]/edit-audio` | `app/[locale]/sanctuary/affirmations/[id]/edit-audio/page.tsx` | 🔒 | Visual |
| `/sanctuary/affirmations/create` | `app/[locale]/sanctuary/affirmations/create/page.tsx` | 🔒 | Redirect → init |
| `/sanctuary/affirmations/create/init` | `app/[locale]/sanctuary/affirmations/create/init/page.tsx` | 🔒 | UI |
| `/sanctuary/affirmations/record` | `app/[locale]/sanctuary/affirmations/record/page.tsx` | 🔒 | Stub |

### Meditations

| Route | File | Auth | Status |
|-------|------|------|--------|
| `/sanctuary/meditations` | `app/[locale]/sanctuary/meditations/page.tsx` | 🔒 | Wired |
| `/sanctuary/meditations/[id]` | `app/[locale]/sanctuary/meditations/[id]/page.tsx` | 🔒 | Wired |
| `/sanctuary/meditations/[id]/edit` | `app/[locale]/sanctuary/meditations/[id]/edit/page.tsx` | 🔒 | Wired |
| `/sanctuary/meditations/[id]/edit-audio` | `app/[locale]/sanctuary/meditations/[id]/edit-audio/page.tsx` | 🔒 | Visual |
| `/sanctuary/meditations/create` | `app/[locale]/sanctuary/meditations/create/page.tsx` | 🔒 | Redirect |
| `/sanctuary/meditations/create/init` | `app/[locale]/sanctuary/meditations/create/init/page.tsx` | 🔒 | UI |

### Rituals

| Route | File | Auth | Status |
|-------|------|------|--------|
| `/sanctuary/rituals` | `app/[locale]/sanctuary/rituals/page.tsx` | 🔒 | Wired |
| `/sanctuary/rituals/[id]` | `app/[locale]/sanctuary/rituals/[id]/page.tsx` | 🔒 | Wired |
| `/sanctuary/rituals/[id]/edit` | `app/[locale]/sanctuary/rituals/[id]/edit/page.tsx` | 🔒 | Wired |
| `/sanctuary/rituals/[id]/edit-audio` | `app/[locale]/sanctuary/rituals/[id]/edit-audio/page.tsx` | 🔒 | Visual |
| `/sanctuary/rituals/create` | `app/[locale]/sanctuary/rituals/create/page.tsx` | 🔒 | Redirect |
| `/sanctuary/rituals/create/init` | `app/[locale]/sanctuary/rituals/create/init/page.tsx` | 🔒 | UI |
| `/sanctuary/rituals/create/goals` | `app/[locale]/sanctuary/rituals/create/goals/page.tsx` | 🔒 | UI |
| `/sanctuary/rituals/recordings` | `app/[locale]/sanctuary/rituals/recordings/page.tsx` | 🔒 | Stub |

---

## Onboarding Routes (protected)

| Route | File | Auth | Status |
|-------|------|------|--------|
| `/onboarding` | `app/[locale]/(onboarding)/onboarding/page.tsx` | 🔒 | Live | 4-step flow (profile, preferences, intention, guide) |
| `/onboarding/profile` | `app/[locale]/(onboarding)/onboarding/profile/page.tsx` | 🔒 | Live | Name, avatar → profiles |
| `/onboarding/preferences` | `app/[locale]/(onboarding)/onboarding/preferences/page.tsx` | 🔒 | Live | Preferences → profiles |
| `/onboarding/guide` | `app/[locale]/(onboarding)/onboarding/guide/page.tsx` | 🔒 | Live | Completion → onboarding_completed_at |
| `/onboarding/role` | `app/[locale]/(onboarding)/onboarding/role/page.tsx` | 🔒 | Live | Role step (web-only) |

---

## Superadmin Routes

| Route | File | Auth | Notes |
|-------|------|------|-------|
| `/admin` | `app/[locale]/admin/page.tsx` | 🛡 Superadmin | Dashboard hub |
| `/admin/oracle` | `app/[locale]/admin/oracle/page.tsx` | 🛡 Superadmin | Oracle AI config |
| `/admin/users` | `app/[locale]/admin/users/page.tsx` | 🛡 Superadmin | User management |
| `/admin/waitlist` | `app/[locale]/admin/waitlist/page.tsx` | 🛡 Superadmin | Waitlist dashboard |
| `/admin/ios-release` | `app/[locale]/admin/ios-release/page.tsx` | 🛡 Superadmin | iOS release management |
| `/admin/content` | `app/[locale]/admin/content/page.tsx` | 🛡 Superadmin | Content overview |
| `/system` | `app/[locale]/system/page.tsx` | 🛡 Superadmin | System & schema overview |
| `/system/creation-steps` | `app/[locale]/system/creation-steps/page.tsx` | 🛡 Superadmin | Creation pipeline status |
| `/system/pipelines` | `app/[locale]/system/pipelines/page.tsx` | 🛡 Superadmin | Pipelines reference |
| `/system/audio` | `app/[locale]/system/audio/page.tsx` | 🛡 Superadmin | Audio & TTS reference |
| `/system/conversation` | `app/[locale]/system/conversation/page.tsx` | 🛡 Superadmin | Conversation flow |
| `/system/schema` | `app/[locale]/system/schema/page.tsx` | 🛡 Superadmin | Schema live status |
| `/health` | `app/[locale]/health/page.tsx` | 🛡 Superadmin | API health dashboard |

---

## Updates (superadmin only)

| Route | File | Auth | Notes |
|-------|------|------|-------|
| `/updates` | `app/[locale]/updates/page.tsx` | 🛡 Superadmin | Updates & how-to guides index |
| `/updates/beta-readiness-implementation` | `app/[locale]/updates/beta-readiness-implementation/page.tsx` | 🛡 Superadmin | Beta readiness |
| `/updates/beta-tester-recruitment` | `app/[locale]/updates/beta-tester-recruitment/page.tsx` | 🛡 Superadmin | Beta tester recruitment |
| `/updates/audio-system-implementation` | `app/[locale]/updates/audio-system-implementation/page.tsx` | 🛡 Superadmin | Audio system audit |
| `/updates/multilingual-i18n-implementation` | `app/[locale]/updates/multilingual-i18n-implementation/page.tsx` | 🛡 Superadmin | Multilingual i18n guide |
| `/updates/open-items` | `app/[locale]/updates/open-items/page.tsx` | 🛡 Superadmin | Unresolved work before launch |

---

## Dev-Only Routes (blocked in production by middleware)

| Route | Purpose |
|-------|---------|
| `/showcase` | Design system reference — all UI components |
| `/pages` | Route registry viewer — links to all pages |
| `/sitemap-view` | Visual sitemap — grouped route overview |

---

## API Routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/auth/override` | POST | — | Dev-only bypass login (disabled in production) |
| `/auth/callback` | GET | — | Supabase OAuth PKCE code exchange |

---

## Auth Guard Implementation

Auth is enforced at two layers:

1. **Proxy** (`packages/web/proxy.ts`) — server-side, runs before page render, redirects unauthenticated to `/`. Next.js 16 convention (replaces legacy middleware).
2. **AuthProvider** (`packages/web/src/components/auth/AuthProvider.tsx`) — client-side fallback, handles session restoration

### Protected Path Prefixes (proxy.ts)
```
/home, /library, /create, /profile, /speak, /marketplace, /sanctuary, /onboarding
```

### Public Path Prefixes (always allowed)
```
/, /login, /signup, /forgot-password, /reset-password, /confirm-email, /auth/*, /how-it-works, /pricing, /terms, /privacy, /_next, /favicon, /api
```

---

---

## Footer Logic

The public footer (links, share, wellness disclaimer, payment note) is rendered by `AppLayout` unless the pathname is excluded. Some pages render `PublicFooter` themselves; for those, AppLayout does not render it (to avoid duplicates).

**Excluded from AppLayout footer:** `/`, `/for-teachers`, `/for-coaches`, `/for-creators`, `/for-studios`, `/community`, `/sanctuary/*/create/*`, auth routes, `/coming-soon`, `/onboarding/*`.

Most marketing routes show the footer via AppLayout. Create flows, auth, and onboarding are excluded for focused UX.

---

## Mobile Screen Map (React Navigation)

| Navigator | Screen | Route Key | Status |
|-----------|--------|-----------|--------|
| Root | Setup | `Setup` | Live (splash/onboarding) |
| Root | Showcase | `Showcase` | Dev reference |
| Auth Stack | Login | `Login` | Live |
| Auth Stack | Signup | `Signup` | Live |
| Auth Stack | ForgotPassword | `ForgotPassword` | Live |
| Auth Stack | ResetPassword | `ResetPassword` | Live |
| Main Tabs | Home | `Home` | Live — create entry (navigates to CreateMode) |
| Main Tabs | Library | `Library` | Live |
| Main Tabs | Marketplace | `Marketplace` | Live |
| Main Tabs | Speak | `Speak` | Live — Oracle API, session-based replies |
| Main Tabs | Profile | `Profile` | Live |
| Main Stack | CreateMode | `CreateMode` | Live (modal — content type + mode picker) |
| Main Stack | ContentCreate | `ContentCreate` | Live |
| Main Stack | ContentDetail | `ContentDetail` | Live — Edit, Edit audio (web) |
| Main Stack | Credits, Progress, Settings, Reminders | — | Live |
