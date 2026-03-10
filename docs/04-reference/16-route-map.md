# waQup Web — Authoritative Route Map

**Last Updated**: 2026-03-10  
**Source of truth**: This file + `packages/web/src/lib/routes.ts`

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
| `/privacy` | `app/[locale]/privacy/page.tsx` | ✅ | Live | Privacy Policy (full content) |

---

## Auth Routes (public)

| Route | File | Auth | Status | Notes |
|-------|------|------|--------|-------|
| `/login` | `app/[locale]/(auth)/login/page.tsx` | ✅ | Live | Email + Google OAuth, dev override fallback |
| `/signup` | `app/[locale]/(auth)/signup/page.tsx` | ✅ | Live | Email signup with verification flow |
| `/forgot-password` | `app/[locale]/(auth)/forgot-password/page.tsx` | ✅ | Live | Sends password reset email |
| `/reset-password` | `app/[locale]/(auth)/reset-password/page.tsx` | ✅ | Live | Consumes reset token from email link |
| `/confirm-email` | `app/[locale]/(auth)/confirm-email/page.tsx` | ✅ | Exists | Email confirmation landing |
| `/auth/beta-signup` | — | ✅ | Redirect | Redirects to `/waitlist` |
| `/auth/callback` | `app/[locale]/auth/callback/route.ts` | ✅ | Live | Supabase OAuth code exchange handler |

---

## Main App Routes (protected)

All routes below require an authenticated Supabase session. Unauthenticated requests are redirected to `/` by `proxy.ts` (Next.js 16 proxy convention).

| Route | File | Auth | Status | Notes |
|-------|------|------|--------|-------|
| `/home` | — | 🔒 | Redirect | Redirects to `/sanctuary` |
| `/library` | `app/[locale]/(main)/library/page.tsx` | 🔒 | Wired | Fetches from `content_items` via `useContent()` |
| `/create` | `app/[locale]/(main)/create/page.tsx` | 🔒 | Live | Links to 3 content-type create flows |
| `/create/conversation` | `app/[locale]/(main)/create/conversation/page.tsx` | 🔒 | Mock | Chat UI — mock AI responses |
| `/profile` | `app/[locale]/(main)/profile/page.tsx` | 🔒 | Live | Reads real user from auth store |
| `/speak` | `app/[locale]/(main)/speak/page.tsx` | 🔒 | Visual | Animated orb UI |
| `/marketplace` | `app/[locale]/(main)/marketplace/page.tsx` | 🔒 | Mock | Browse marketplace |
| `/marketplace/creator` | `app/[locale]/(main)/marketplace/creator/page.tsx` | 🔒 | Stub | Creator dashboard placeholder |

---

## Sanctuary Routes (protected)

| Route | File | Auth | Status | Notes |
|-------|------|------|--------|-------|
| `/sanctuary` | `app/[locale]/sanctuary/page.tsx` | 🔒 | UI-only | Quick actions + menu |
| `/sanctuary/settings` | `app/[locale]/sanctuary/settings/page.tsx` | 🔒 | Stub | Placeholder |
| `/sanctuary/credits` | `app/[locale]/sanctuary/credits/page.tsx` | 🔒 | Stub | Placeholder |
| `/sanctuary/progress` | `app/[locale]/sanctuary/progress/page.tsx` | 🔒 | Stub | Placeholder |
| `/sanctuary/referral` | `app/[locale]/sanctuary/referral/page.tsx` | 🔒 | Stub | Placeholder |
| `/sanctuary/reminders` | `app/[locale]/sanctuary/reminders/page.tsx` | 🔒 | Stub | Placeholder |
| `/sanctuary/learn` | `app/[locale]/sanctuary/learn/page.tsx` | 🔒 | Stub | Placeholder |

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
| `/onboarding` | `app/[locale]/(onboarding)/onboarding/page.tsx` | 🔒 | Placeholder |
| `/onboarding/profile` | `app/[locale]/(onboarding)/onboarding/profile/page.tsx` | 🔒 | Placeholder |
| `/onboarding/preferences` | `app/[locale]/(onboarding)/onboarding/preferences/page.tsx` | 🔒 | Placeholder |
| `/onboarding/guide` | `app/[locale]/(onboarding)/onboarding/guide/page.tsx` | 🔒 | Placeholder |

---

## Updates (superadmin only)

| Route | File | Auth | Notes |
|-------|------|------|-------|
| `/updates` | `app/[locale]/updates/page.tsx` | 🛡 Superadmin | Updates & how-to guides index |
| `/updates/beta-readiness-implementation` | `app/[locale]/updates/beta-readiness-implementation/page.tsx` | 🛡 Superadmin | Beta readiness |
| `/updates/beta-tester-recruitment` | `app/[locale]/updates/beta-tester-recruitment/page.tsx` | 🛡 Superadmin | Beta tester recruitment |

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

## Mobile Screen Map (React Navigation)

| Navigator | Screen | Route Key | Status |
|-----------|--------|-----------|--------|
| Root | Setup | `Setup` | Live (splash/onboarding) |
| Root | Showcase | `Showcase` | Dev reference |
| Auth Stack | Login | `Login` | Live |
| Auth Stack | Signup | `Signup` | Live |
| Auth Stack | ForgotPassword | `ForgotPassword` | Live |
| Auth Stack | ResetPassword | `ResetPassword` | Live |
| Main Tabs | Home | `Home` | Themed, basic |
| Main Tabs | Library | `Library` | Themed, empty state |
| Main Tabs | Create | `Create` | Themed, content-type cards |
| Main Tabs | Profile | `Profile` | Themed, real user data |
