# Open Items

Items that still require attention. Minimal and actionable.

**Canonical source.** Also visible at `/updates/open-items` (superadmin) for convenience.

---

## Blocking / High Signal

| Title | Area | Status | Action |
|-------|------|--------|--------|
| **E2E test user access_granted** | testing | needs verification | Run SQL for OVERRIDE_LOGIN_EMAIL user: `UPDATE profiles SET access_granted = true WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_TEST_EMAIL');` |
| **Atmosphere presets** | audio | missing | Upload rain.mp3, forest.mp3, ocean.mp3, white-noise.mp3 to Supabase Storage `atmosphere` bucket. Guide: `packages/web/scripts/upload-atmosphere-presets.md`. |
| **iOS App Store release** | release | to do | Replace REPLACE_WITH_* in eas.json. Set EXPO_PUBLIC_REVENUECAT_IOS_KEY, REVENUECAT_WEBHOOK_SECRET. See `packages/mobile/SUBMISSION.md` and `/admin/ios-release`. |
| **i18n human translation** | copy | missing | Native review of `packages/web/messages/[locale]/` — onboarding, create, sanctuary, auth. |
| **Mobile i18n** | copy | missing | Wire expo-localization + i18next to shared message files. Web done; mobile hardcoded English. |

---

## Deferred

- Design token full pass — post-beta (Speak done; sanctuary, admin, library pending).
- Implicit any types (web) — post-beta; auth/profile/onboarding pages.
- Native app E2E — Maestro or Detox when needed; Playwright covers mobile viewport.
- Google OAuth custom domain — optional; Supabase project URL on consent screen.
- Beta audit R3–R5 — Speak credits UX, orb cancel, sanctuary streak.
- App Store / Google Play localizations — before submission.
- Marketplace item detail generateMetadata — low priority.

---

## Resolved (recent)

- **Final closure pass** — Deleted 4 dead components (MermaidDiagram, CreditConsentWidget, QueryProvider, SectionLabel). Consolidated formatDate to `@waqup/shared/utils`. Updated 16-route-map (create/conversation=Wired, onboarding=Live, marketplace=Wired). `/api/dev/seed` verified blocked in production (NODE_ENV check).
- **Database schema verification** — `npm run verify:db` passes (38 checks).
- **Meta/Instagram setup** — App icon, `/data-deletion`, webhooks, env vars documented.
- **Beta tester recruitment** — Guide at `/updates/beta-tester-recruitment`.
- **E2E critical flows** — PageShell `role="main"`; test:e2e:critical; auth setup accepts /coming-soon.
