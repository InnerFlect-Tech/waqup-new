# waQup Web — Authoritative Route Map

**Last Updated**: 2026-03-07  
**Source of truth**: This file + `packages/web/src/lib/routes.ts`

---

## Auth Requirements Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Public (no auth required) |
| 🔒 | Protected (requires authenticated session — enforced by `packages/web/middleware.ts`) |
| 🛠 | Dev only (blocked in production by middleware) |

---

## Marketing Routes (public)

| Route | File | Auth | Status | Notes |
|-------|------|------|--------|-------|
| `/` | `app/page.tsx` | ✅ | Live | Landing page — hero, features, CTA |
| `/how-it-works` | `app/(marketing)/how-it-works/page.tsx` | ✅ | Live | Journey steps, benefits, early-access CTA |
| `/pricing` | `app/(marketing)/pricing/page.tsx` | ✅ | Live | Real Stripe checkout for Founding Member plan |
| `/terms` | `app/terms/page.tsx` | ✅ | Stub | Terms of Service placeholder |
| `/privacy` | `app/privacy/page.tsx` | ✅ | Stub | Privacy Policy placeholder |

---

## Auth Routes (public)

| Route | File | Auth | Status | Notes |
|-------|------|------|--------|-------|
| `/login` | `app/(auth)/login/page.tsx` | ✅ | Live | Email + Google OAuth, dev override fallback |
| `/signup` | `app/(auth)/signup/page.tsx` | ✅ | Live | Email signup with verification flow |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | ✅ | Live | Sends password reset email |
| `/reset-password` | `app/(auth)/reset-password/page.tsx` | ✅ | Live | Consumes reset token from email link |
| `/confirm-email` | `app/(auth)/confirm-email/page.tsx` | ✅ | Exists | Email confirmation landing |
| `/auth/beta-signup` | `app/auth/beta-signup/page.tsx` | ✅ | Partial | Beta early-access form |
| `/auth/callback` | `app/auth/callback/route.ts` | ✅ | Live | Supabase OAuth code exchange handler |

---

## Main App Routes (protected)

All routes below require an authenticated Supabase session. Unauthenticated requests are redirected to `/login?next=<path>` by middleware.

| Route | File | Auth | Status | Notes |
|-------|------|------|--------|-------|
| `/home` | `app/(main)/home/page.tsx` | 🔒 | UI-only | Quick actions + sanctuary nav (static constants) |
| `/library` | `app/(main)/library/page.tsx` | 🔒 | Wired | Fetches from `content_items` via `useContent()` |
| `/create` | `app/(main)/create/page.tsx` | 🔒 | Live | Links to 3 content-type create flows |
| `/create/conversation` | `app/(main)/create/conversation/page.tsx` | 🔒 | Mock | Chat UI only — mock AI responses, not wired to LLM |
| `/profile` | `app/(main)/profile/page.tsx` | 🔒 | Live | Reads real user from auth store; logout works |
| `/speak` | `app/(main)/speak/page.tsx` | 🔒 | Visual | Animated orb UI — no real speech recognition |
| `/marketplace` | `app/(main)/marketplace/page.tsx` | 🔒 | Mock | 4 mock items, no purchases |
| `/marketplace/creator` | `app/(main)/marketplace/creator/page.tsx` | 🔒 | Stub | Creator dashboard placeholder |

---

## Sanctuary Routes (protected)

| Route | File | Auth | Status | Notes |
|-------|------|------|--------|-------|
| `/sanctuary` | `app/sanctuary/page.tsx` | 🔒 | UI-only | Quick actions + menu (framer-motion, static constants) |
| `/sanctuary/settings` | `app/sanctuary/settings/page.tsx` | 🔒 | Stub | Placeholder |
| `/sanctuary/credits` | `app/sanctuary/credits/page.tsx` | 🔒 | Stub | Placeholder |
| `/sanctuary/progress` | `app/sanctuary/progress/page.tsx` | 🔒 | Stub | Placeholder |
| `/sanctuary/referral` | `app/sanctuary/referral/page.tsx` | 🔒 | Stub | Placeholder |
| `/sanctuary/reminders` | `app/sanctuary/reminders/page.tsx` | 🔒 | Stub | Placeholder |
| `/sanctuary/learn` | `app/sanctuary/learn/page.tsx` | 🔒 | Stub | Placeholder |

### Affirmations

| Route | File | Auth | Status |
|-------|------|------|--------|
| `/sanctuary/affirmations` | `app/sanctuary/affirmations/page.tsx` | 🔒 | Wired — fetches from `content_items` |
| `/sanctuary/affirmations/[id]` | `app/sanctuary/affirmations/[id]/page.tsx` | 🔒 | Wired — loads real item |
| `/sanctuary/affirmations/[id]/edit` | `app/sanctuary/affirmations/[id]/edit/page.tsx` | 🔒 | Wired — saves to Supabase |
| `/sanctuary/affirmations/[id]/edit-audio` | `app/sanctuary/affirmations/[id]/edit-audio/page.tsx` | 🔒 | Visual — sliders only |
| `/sanctuary/affirmations/create` | `app/sanctuary/affirmations/create/page.tsx` | 🔒 | Redirect → `/create/init` |
| `/sanctuary/affirmations/create/init` | `app/sanctuary/affirmations/create/init/page.tsx` | 🔒 | UI — routes to mock conversation |
| `/sanctuary/affirmations/record` | `app/sanctuary/affirmations/record/page.tsx` | 🔒 | Stub |

### Meditations

| Route | File | Auth | Status |
|-------|------|------|--------|
| `/sanctuary/meditations` | `app/sanctuary/meditations/page.tsx` | 🔒 | Wired |
| `/sanctuary/meditations/[id]` | `app/sanctuary/meditations/[id]/page.tsx` | 🔒 | Wired |
| `/sanctuary/meditations/[id]/edit` | `app/sanctuary/meditations/[id]/edit/page.tsx` | 🔒 | Wired |
| `/sanctuary/meditations/[id]/edit-audio` | `app/sanctuary/meditations/[id]/edit-audio/page.tsx` | 🔒 | Visual |
| `/sanctuary/meditations/create` | `app/sanctuary/meditations/create/page.tsx` | 🔒 | Redirect |
| `/sanctuary/meditations/create/init` | `app/sanctuary/meditations/create/init/page.tsx` | 🔒 | UI |

### Rituals

| Route | File | Auth | Status |
|-------|------|------|--------|
| `/sanctuary/rituals` | `app/sanctuary/rituals/page.tsx` | 🔒 | Wired |
| `/sanctuary/rituals/[id]` | `app/sanctuary/rituals/[id]/page.tsx` | 🔒 | Wired |
| `/sanctuary/rituals/[id]/edit` | `app/sanctuary/rituals/[id]/edit/page.tsx` | 🔒 | Wired |
| `/sanctuary/rituals/[id]/edit-audio` | `app/sanctuary/rituals/[id]/edit-audio/page.tsx` | 🔒 | Visual |
| `/sanctuary/rituals/create` | `app/sanctuary/rituals/create/page.tsx` | 🔒 | Redirect |
| `/sanctuary/rituals/create/init` | `app/sanctuary/rituals/create/init/page.tsx` | 🔒 | UI |
| `/sanctuary/rituals/create/goals` | `app/sanctuary/rituals/create/goals/page.tsx` | 🔒 | UI |
| `/sanctuary/rituals/recordings` | `app/sanctuary/rituals/recordings/page.tsx` | 🔒 | Stub |

---

## Onboarding Routes (protected)

| Route | File | Auth | Status |
|-------|------|------|--------|
| `/onboarding` | `app/(onboarding)/onboarding/page.tsx` | 🔒 | Placeholder |
| `/onboarding/profile` | `app/(onboarding)/onboarding/profile/page.tsx` | 🔒 | Placeholder |
| `/onboarding/preferences` | `app/(onboarding)/onboarding/preferences/page.tsx` | 🔒 | Placeholder |
| `/onboarding/guide` | `app/(onboarding)/onboarding/guide/page.tsx` | 🔒 | Placeholder |

---

## Updates (superadmin only)

| Route | File | Auth | Notes |
|-------|------|------|-------|
| `/updates` | `app/[locale]/updates/page.tsx` | 🛡 Superadmin | Updates & how-to guides index |
| `/updates/beta-readiness-implementation` | `app/[locale]/updates/beta-readiness-implementation/page.tsx` | 🛡 Superadmin | Beta readiness: what was done, migrations, ChatGPT prompts |
| `/updates/beta-tester-recruitment` | `app/[locale]/updates/beta-tester-recruitment/page.tsx` | 🛡 Superadmin | Beta tester recruitment guide |

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

1. **Middleware** (`packages/web/middleware.ts`) — server-side, runs before page render, redirects to `/login?next=<path>`
2. **AuthProvider** (`packages/web/src/components/auth/AuthProvider.tsx`) — client-side fallback, handles session restoration and listen for auth state changes

### Protected Path Prefixes (middleware)
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
