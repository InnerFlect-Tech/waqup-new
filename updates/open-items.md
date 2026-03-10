# Open Items

Items that still require attention. Minimal and actionable.

**Canonical source.** Also visible at `/updates/open-items` (superadmin) for convenience.

---

## Blocking / High Signal

| Title | Origin | Status | Action |
|-------|--------|--------|--------|
| **E2E critical flows** | test:all / test:e2e:critical | needs verification | Implementation done. **test:all** runs shared + mobile unit tests, then web E2E (desktop + mobile viewports). Verify: start `npm run dev:web` first (iCloud), then `npm run test:all` or `npm run test:e2e:critical`. Auth: OVERRIDE_LOGIN_* env vars. |
| **iOS App Store release** | Apple submission | to do | Replace REPLACE_WITH_* in eas.json. Set EXPO_PUBLIC_REVENUECAT_IOS_KEY, REVENUECAT_WEBHOOK_SECRET. See `packages/mobile/SUBMISSION.md` and `/admin/ios-release`. |
| **Atmosphere presets** | Audio system | missing | Upload rain.mp3, forest.mp3, ocean.mp3, white-noise.mp3 to Supabase Storage `atmosphere` bucket. Guide: `packages/web/scripts/upload-atmosphere-presets.md`. |
| **i18n human translation** | Multilingual | missing | Native review of `packages/web/messages/[locale]/` — onboarding, create, sanctuary, auth. |
| **Mobile i18n** | Multilingual | missing | Wire expo-localization + i18next to shared message files. Web done; mobile hardcoded English. |
---

## Deferred (when relevant)

- Design token pass (sanctuary hub, admin, library) — Speak done.
- Beta audit R3–R5 (Speak credits UX, orb cancel, sanctuary streak).
- App Store / Google Play localizations — before submission.
- **Google OAuth custom domain** — Supabase project URL shows on consent screen. Optional: add custom domain (e.g. `api.waqup.com`) via Supabase paid add-on. Docs: `docs/05-deployment`; requires DNS + Google redirect URI update.
- Marketplace item detail (`/marketplace/[id]`) — tab shows "Marketplace"; could add generateMetadata for item name (low priority).
- **Native app E2E** — Web E2E (Playwright) covers desktop + mobile viewports. Expo app has no E2E yet. Future: Maestro or Detox.

---

## Resolved (recent conversations)

- **Meta/Instagram setup (this conversation)** — App icon (`app-icon-1024.png`), `/data-deletion` page, `/api/webhooks/meta` (GET verify, POST events), Facebook domain verification meta tag in `[locale]/layout.tsx`, `docs/05-deployment/02-meta-app-submission.md`. Env vars: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID, META_APP_SECRET, META_WEBHOOK_VERIFY_TOKEN. Launch page shows live follower count from `/api/instagram/stats`. **Post-deploy:** Add env vars to Vercel; click "Verify domain" in Meta Dashboard; configure webhook callback if using Instagram webhooks. Instagram token refresh: before 60-day expiry, call `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={TOKEN}`.
- **Profile dropdown & Creator Gate** — Profile menu: 2-column Super Admin grid (desktop + mobile), wider dropdown (380px), max-height + scroll; Creator Marketplace: vertically centered block, Available Soon badge centered (`alignSelf: 'center'`).
- **Pending migrations** — Applied via `supabase db push`. Remote database up to date (deduct_credits, audio_system, is_unlisted).
- `/api/account/delete`, `/api/webhooks/revenuecat` — implemented. IAP migration applied via `supabase db push`.
- middleware vs proxy — `proxy.ts` only (Next.js 16). Auth + next-intl. No middleware.ts.
- Beta tester recruitment — full guide at `/updates/beta-tester-recruitment`.
- Oracle 400 (empty voiceId) — Speak orb replies when no admin voice config. Rachel fallback; parsed error on stream failure.
- Next.js dev lock / webpack cache — Removed `.next/dev/lock` and `.next/dev/cache`. If ENOENT on `.pack.gz` recurs (e.g. iCloud), run `rm -rf packages/web/.next` and restart.
- deduct_credits migration — Verified. `supabase db push` reports remote up to date; `20260315000001` applied (advisory locks, no FOR UPDATE).
- **Landing scroll + footer** — PublicFooter extracted; footer in landing scroll flow (Step 6); AppLayout hides footer when `pathname === '/'`; single scroll container; overflow prevention. Aligned with i18n (next-intl pathname returns `/` for root).
- **Sanctuary hub redesign** — Streak + Library as prominent cards; Qs badge in header; Practice | Account grouped list. Live data from `getProgressStats`, `useContent`, `useCreditBalance`.
- **Sanctuary vertical centering** — PageShell `centerVertically` prop in use on sanctuary home. Layout improvements from prior conversation incorporated into current hub redesign.
- **Page-specific document titles** — All routes under `[locale]` have layout metadata with i18n (`t('pages.xxx')`). Template `%s — waQup`. Aligned with next-intl + [locale] structure.
- **i18n hreflang SEO** — `alternates.languages` added to `app/[locale]/layout.tsx` generateMetadata(). Generates `<link rel="alternate" hreflang="x" href="..." />` for en, pt, es, fr, de.
- **Marketplace + ChunkLoadError** — GA4 consent inline in layout; ChunkLoadError retry in error.tsx. Marketplace: migrations applied via `supabase db push`; API `content_items!inner`; page redesign with hero, elevated cards, Creator CTA.
- **E2E critical flows (this conversation)** — PageShell `role="main"` for tests; `domcontentloaded` nav; webServer timeout 90s; test:e2e:critical runs desktop + mobile viewports; deployment checklist E2E docs (env vars, CI, native app note).
- **verify:db infrastructure** — `supabase/scripts/run_verify.sh`, `npm run verify:db`, `DATABASE_URL` in `.env.example`, deployment checklist updated (pooler note, no `supabase db execute`). Run with pooler URL or manually in Dashboard; schema check output still needs verification.
- **Database schema verification** — `npm run verify:db` runs successfully via Session pooler (aws-1-ap-south-1.pooler.supabase.com). All 38 checks PASS (tables, columns, RLS, functions, Storage bucket).
