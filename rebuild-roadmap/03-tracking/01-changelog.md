# Rebuild Roadmap Changelog

**Purpose**: Track completion status and changes for each phase and step

**Format**: Each step includes completion status, date completed, and any updates

---

## Three scrollbars fix & PageShell allowDocumentScroll (2026-03-15)

- **Status**: ✅ Complete
- **Completed**: 2026-03-15
- **Notes**:
  - **Root cause**: PageShell with default `allowDocumentScroll=false` creates a nested scroll container (overflowY: auto + u-h-dvh) inside AppLayout's scroll container. This produced three scrollbars when the mobile menu was open: (1) mobile menu drawer, (2) AppLayout main content, (3) PageShell inner — the third was redundant.
  - **Fix**: Added `allowDocumentScroll` to all PageShell usages that render inside AppLayout: admin (waitlist, users, dashboard, founding-partners, content, oracle, ios-release, onboarding/reset), system (schema, creation-steps, conversation, audio, pipelines, page), updates (page, open-items, beta-tester-recruitment, beta-readiness-implementation, audio-system-implementation, multilingual-i18n-implementation), legal (data-deletion, privacy, terms), health, pages, sitemap-view, ContentCreateLayout, SuperAdminGate, PlaceholderPage. With allowDocumentScroll, PageShell does not add its own overflow — AppLayout's scroll container is the single scroll region for page content.
- **Affected**: 25+ pages and components using PageShell.
- **Updated**: 2026-03-15

---

## Header/Navigation System Production Refactor (2026-03-15)

- **Status**: ✅ Complete
- **Completed**: 2026-03-15
- **Notes**:
  - **Root cause fixed**: AuthProvider no longer blocks AppLayout during profile load. Spinner only during initial auth bootstrap (`!isReady || !isInitialized`). Header now always visible when layout renders — resolves "header disappears on mobile when logged in."
  - **Profile-loading gate**: When authenticated on protected route and profile is loading, content area shows inline spinner; header stays visible.
  - **Route utils**: Created `packages/web/src/lib/route-utils.ts` — `pathWithoutLocale`, `isAuthRoute`, `isOnboardingRoute`, `isProtectedRoute`, `isSuperadminRoute`, `shouldShowPublicFooter`. Single source of truth for path matching.
  - **AppLayout**: Uses route utils; removed inline `AUTH_ROUTES`, `ONBOARDING_ROUTES`; consolidated footer logic with `shouldShowPublicFooter(pathname)`; softened nav animation (`initial={{ y: 0 }}`).
  - **useSuperAdmin**: Migrated to React Query with 5min `staleTime` — reduces profile refetch on navigation; caching avoids redundant fetches.
  - **AuthProvider**: Uses `pathWithoutLocale`, `isProtectedRoute` from route-utils for redirect logic.
- **Affected**: `AuthProvider.tsx`, `AppLayout.tsx`, `useSuperAdmin.ts`, new `route-utils.ts`.
- **Updated**: 2026-03-15

---

## Playwright E2E CI — Skip authenticated tests (2026-03-13)

- **Status**: ✅ Complete
- **Completed**: 2026-03-13
- **Notes**:
  - **canRunAuthTests()**: Returns `false` when `process.env.CI === 'true'` so specs using `skipIfNoAuth()` (critical-flows authenticated block, onboarding-flow, create-affirmation) skip in CI. CI uses placeholder Supabase; profile fetch returns no `access_granted` → users land on /coming-soon → protected routes unreachable.
  - **Docs**: Updated `docs/06-testing/01-playwright-e2e.md` CI section to document this behavior.
- **Affected**: `packages/web/e2e/helpers/auth.helper.ts`, `docs/06-testing/01-playwright-e2e.md`.
- **Updated**: 2026-03-13

---

## Mobile usability and error fixes (2026-03-13)

- **Status**: ✅ Complete
- **Completed**: 2026-03-13
- **Notes**:
  - **SetupScreen**: Restructured so CTA (Get Started / Sign In) is always visible at bottom; removed nested ScrollViews; added hitSlop for touch targets; solid CTA background.
  - **Navigation types**: Auth route now uses `NavigatorScreenParams<AuthStackParamList>` so `navigation.navigate('Auth', { screen: 'Signup' })` is correctly typed.
  - **Require cycles**: AudioPlayer, AudioRecorder, MiniPlayer already import from `@/components/ui` (breaks cycle with `@/components`).
- **Updated**: 2026-03-13

---

## E2E (Playwright) CI fixes (2026-03-11)

- **Status**: ✅ Complete
- **Completed**: 2026-03-11
- **Notes**:
  - **signup-flow.spec.ts**: Fixed invalid Playwright locator — `'input[type="checkbox"], text=/terms|agree|accept/i'` was parsed as CSS and broke (Unexpected token "="). Replaced with `page.locator('input[type="checkbox"]').or(page.getByText(/terms|agree|accept/i)).first()`.
  - **protected-redirect.spec.ts**: Increased `page.goto` timeout to 25s and URL assertion to 10s for "public pages remain accessible without auth" to reduce CI timeouts; use `domcontentloaded` for faster readiness.
  - **analytics-events.spec.ts**: Increased navigation timeouts (15s → 20s) for "page_view fires on navigation".
- **Affected**: `packages/web/e2e/specs/auth/signup-flow.spec.ts`, `packages/web/e2e/specs/auth/protected-redirect.spec.ts`, `packages/web/e2e/specs/analytics/analytics-events.spec.ts`.
- **Updated**: 2026-03-11

---

## Dependency cleanup: deprecation warnings (2026-03-11)

- **Status**: ✅ Complete
- **Completed**: 2026-03-11
- **Notes**:
  - **Root overrides**: Pinned `glob` to `13.0.6` (exact) in root `package.json` to resolve deprecated glob@7/10/11 and security advisories; app uses `@ffmpeg-installer/ffmpeg` + `spawn` only, so `fluent-ffmpeg` was unused.
  - **Web**: Removed deprecated dependency `fluent-ffmpeg` from `packages/web/package.json`; removed from `serverExternalPackages` in `packages/web/next.config.js` (kept `@ffmpeg-installer/ffmpeg`).
  - **Affected**: `package.json`, `package-lock.json`, `packages/web/package.json`, `packages/web/next.config.js`.
  - Remaining transitive deprecation warnings (whatwg-encoding, inflight, domexception, abab, node-domexception) come from tooling (e.g. Playwright/Jest) and do not affect the build.
- **Updated**: 2026-03-11

---

## i18n Full Audit & Pricing Page Wiring (2026-03-11)

### Pricing page localization
- **Status**: ✅ Complete
- **Completed**: 2026-03-11
- **Notes**:
  - **Audit plan**: Created `docs/04-reference/18-i18n-full-audit-plan.md` — page-by-page audit, what to translate vs keep fixed, execution order, tone guidelines (natural over literal, brand names stay).
  - **Pricing page**: Fully wired to `useTranslations('pricing')`. Replaced all hardcoded strings — hero, plan cards (name, description, features, badge, CTA, billing, trial disclaimer), How Qs work section, footer links, comparison table, error messages.
  - **pricing.json**: Added `hero`, `plans.starter/growth/devotion` (name, description, features array, badge, ctaLabel), `badge`, `billing` (trialDays, perWeek, perMonth, week, month), `footer`, `comparison` (heading, rows 1–5, footer, cta) for en, de, es, fr, pt.
  - **Verification**: `npm run verify:i18n` passes. `/de/pricing` and other locales now display in the correct language.
- **Updated**: 2026-03-11

---

## Full System Audit Plan Implementation (2026-03-10)

### Phase A: Cleanup & SSOT
- **Status**: ✅ Complete
- **Completed**: 2026-03-10
- **Notes**:
  - **A1**: Removed dead `CreateScreen.tsx` (CreateModeScreen used); removed `ContentEdit` from MainStackParamList (unregistered).
  - **A2**: Created `docs/package-scripts.md` documenting all root scripts, surfaces, release-critical commands.
  - **A3**: Synced route docs — aligned status legend in `16-route-map.md`; updated `04-pages-comparison.md` completeness ref; fixed Mobile Screen Map (tabs: Home, Library, Marketplace, Speak, Profile; CreateMode modal).
- **Updated**: 2026-03-10

### Phase B: Design System Compliance
- **Status**: ✅ Complete (representative set)
- **Completed**: 2026-03-10
- **Notes**:
  - **B4 (Web)**: Token migration in create/page, marketplace/page, library/page, PublicPlayerClient, ElevatedBadge. Added ELEVATED_BADGE_COLOR, ELEVATED_BADGE_COLOR_SECONDARY, CONTENT_TYPE_GRADIENT_DARK to shared constants. Replaced hex/rgba with theme.colors, CONTENT_TYPE_COLORS, withOpacity, shadows.
  - **B5 (Mobile)**: Token migration in AuthNavigator, CreditsScreen, ContentDetailScreen (WaveformBar). Replaced #fff, hex colors with colors.background.primary, colors.text.onDark, CONTENT_TYPE_COLORS, ELEVATED_BADGE_COLOR.
- **Updated**: 2026-03-10

### Phase C: Mobile Parity (critical for beta)
- **C6 – Mobile Stripe checkout**: ✅ Complete
- **Notes**:
  - API: `getAuthenticatedUserForApi(req)` in `supabase-server.ts` — supports Bearer token auth for mobile (cookies first for web).
  - Credits checkout route now accepts `Authorization: Bearer <access_token>` when called from mobile.
  - Mobile: `createCreditCheckoutSession` in `stripe-checkout.ts` — calls API with session token, returns Stripe URL.
  - CreditsScreen: When RevenueCat unavailable (packages.length === 0), shows CREDIT_PACKS with Stripe checkout. Opens URL in WebBrowser; refetches balance on return (AppState listener).
- **Updated**: 2026-03-10

- **C7 – Mobile full onboarding**: ✅ Complete
- **Notes**:
  - Migration `20260327000001_add_onboarding_completed_at.sql` adds `onboarding_completed_at` to profiles.
  - Mobile: 4-step flow — OnboardingIntention → OnboardingProfile → OnboardingPreferences → OnboardingGuide. Matches web flow.
  - useOnboardingStatus hook fetches profile to decide needsOnboarding; OnboardingCompletionContext triggers refetch on complete.
  - RootNavigator: after auth, shows Onboarding stack if needsOnboarding, else Main. Welcome credits API supports Bearer token.
  - Web guide page now sets onboarding_completed_at for cross-platform consistency.
- **Updated**: 2026-03-10

- **C8 – Mobile content detail/edit**: ✅ Complete
- **Notes**:
  - ContentDetailScreen: Added Edit and Edit audio buttons. Edit navigates to ContentEdit. Edit audio opens web edit-audio page in WebBrowser.
  - ContentEditScreen: New screen for editing title, description, script. Uses useContentItemQuery + useUpdateContent.
  - MainNavigator: Registered ContentEdit screen.
  - Replaced hardcoded #fff with theme colors (text.onDark) in ContentDetailScreen.
- **Updated**: 2026-03-10

- **C9 – Mobile SpeakScreen Oracle**: ✅ Complete
- **Notes**:
  - API: oracle/session and oracle routes now support Bearer token auth (getAuthenticatedUserForApi) for mobile.
  - Mobile ai.ts: createOracleSession starts session (1Q, 3 replies), sendOracleMessage requires sessionId. Both use Bearer token.
  - SpeakScreen: Creates session on first message, stores sessionId, passes to sendOracleMessage. Handles session_exhausted (clear session, prompt to tap again). Replaced hardcoded bubble colors with theme.
- **Updated**: 2026-03-10

- **D10 – Conversational create (web)**: ✅ Complete
- **Notes**:
  - Create page restructured: "Create by talking" is now the primary hero with Talk to the Orb (→ /create/orb) and Chat instead (→ /create/conversation). "Or explore with the Oracle" links to /speak.
  - Content type cards (affirmation, meditation, ritual) moved to secondary "Or choose a type" section with simplified copy.
- **Updated**: 2026-03-10

---

## Stripe webhook automation and env validation (2026-03-10)

### Webhook setup and documentation
- **Status**: ✅ Complete
- **Completed**: 2026-03-10
- **Notes**:
  - **Scripts**: `packages/web/scripts/create-stripe-webhook.mjs` — creates production webhook endpoint via Stripe API and prints signing secret; npm scripts `stripe:webhook:listen` and `stripe:webhook:create` in packages/web.
  - **Docs**: `docs/04-reference/13-stripe-setup.md` — API version set to `2026-02-25.clover`; credit pack section updated to current amounts/prices (70/155/316/668 Qs, €6.99–€59.99); Step 3 quick start for local (Stripe CLI + npm run) and production (create script); Linux/WSL CLI install note.
  - **Validation**: `docs/04-reference/14-stripe-env-validation.md` — new doc validating required env vars (webhook, Supabase admin, Stripe price IDs) against codebase with file/line references.
- **Updated**: 2026-03-10

---

## Final Master Audit (2026-03-10)

### Summary
- **Status**: ✅ Complete
- **Completed**: 2026-03-10
- **Report**: `docs/audits/final-master-audit-report.md`

### Changes
- **Route consolidation**: Removed `app/page.tsx`; redirect `/` → `/en`; removed root `app/privacy/`
- **Docs**: Updated `16-route-map.md` to `app/[locale]/...` paths; `00-current-context.md` locale section
- **global-error.tsx**: Added root-level error boundary (build trace fix)
- **Design tokens**: speak/page.tsx — replaced hardcoded rgba/hex with theme colors
- **ESLint**: Scoped to `app src`; ignores `.next`, `.next.nosync`
- **Next.js 16 proxy**: Removed `middleware.ts`; `proxy.ts` only (auth + next-intl)
- **Build verification**: build:shared, build:web, type-check, lint — all pass

### Updated
- 2026-03-10

---

## Production Readiness Audit Implementation (2026-03-10)

### Build fix (iCloud Drive)
- **Status**: ✅ Complete
- **Completed**: 2026-03-10
- **Notes**: Projects in iCloud Drive (`Mobile Documents/com~apple~CloudDocs`) caused ENOENT during Next.js build (Turbopack and webpack cache). Fixed by: (1) `next build --webpack` to use webpack instead of Turbopack; (2) `webpack: { cache: false }` in next.config.js to avoid filesystem cache races.
- **Updated**: 2026-03-10

### Dead code removal
- **Status**: ✅ Complete
- **Completed**: 2026-03-10
- **Notes**:
  - Removed `packages/web/proxy.ts` (duplicate of middleware; middleware.ts is the canonical Next.js middleware with standalone implementation).
  - Removed unreachable routes: `app/(main)/speak/`, `app/sanctuary/`, `app/sanctuary/series/*` — rewrites send `/speak` and `/sanctuary` to `/en/speak` and `/en/sanctuary`, so these non-locale pages were never matched.
  - Removed `proxy.ts` from tsconfig `include`.
- **Updated**: 2026-03-10

### E2E consolidation
- **Status**: ✅ Complete
- **Completed**: 2026-03-10
- **Notes**:
  - Consolidated auth skip logic: all protected specs now use `skipIfNoAuth(test)` from `auth.helper.ts`.
  - Created `e2e/specs/critical-flows.spec.ts` — smoke tests for public flows (landing, pricing, login, signup, protected redirect) and authenticated flows (login → sanctuary, credits buy, create hub, library).
  - Added `npm run test:e2e:critical` — runs critical-flows spec only.
  - Authenticated project now matches both `specs/protected/` and `specs/critical-flows.spec.ts`.
- **Updated**: 2026-03-10

### Documentation
- **Status**: ✅ Complete
- **Completed**: 2026-03-10
- **Notes**:
  - E2E env vars documented in `docs/05-deployment/03-update-and-deployment-checklist.md` (OVERRIDE_LOGIN_EMAIL, OVERRIDE_LOGIN_PASSWORD, NEXT_PUBLIC_ENABLE_TEST_LOGIN).
  - Quick reference: `test:e2e`, `test:e2e:critical`, `build:web:clean`.
  - Changelog correction: middleware.ts is standalone; it does not re-export from proxy (proxy.ts was removed).
- **Updated**: 2026-03-10

---

## Marketplace Fully Functional + ChunkLoadError Fix (2026-03-10)

### ChunkLoadError
- **Status**: ✅ Complete
- **Completed**: 2026-03-10
- **Notes**: Moved GA4 consent Script from `beforeInteractive` to `afterInteractive` in layout to avoid blocking initial chunk load. Added ChunkLoadError recovery in global error boundary — auto-reload once on chunk timeout using sessionStorage.
- **Updated**: 2026-03-10

### Marketplace schema and API
- **Status**: ✅ Complete
- **Completed**: 2026-03-10
- **Notes**:
  - Migration `20260317000001_sanctuary_saves.sql`: Created `sanctuary_saves` table (user_id, content_item_id, unique constraint) with RLS for "Add to Sanctuary".
  - Migration `20260317000002_marketplace_items_unique_content.sql`: Added unique index on `marketplace_items.content_item_id` for publish upsert.
  - Marketplace GET API: Use `content_items!inner` when filtering by type for correct inner-join semantics.
  - verify_database.sql: Added sanctuary_saves check.
- **Updated**: 2026-03-10

---

## Repository Organization Audit Implementation (2026-03-10)

### Safe refactor across monorepo

- **Status**: ✅ Complete
- **Completed**: 2026-03-10
- **Notes**:
  - **Phase A**: Removed `getCreditCostLegacy` dead export; moved `shared/src/database/*.sql` to `supabase/scripts/reference/`; removed outdated Container.tsx TODO.
  - **Phase B**: Consolidated content type colors — mobile ProgressScreen, LibraryScreen; web marketplace [id], creator, CreatorGate, admin/content; creation-steps.ts now use `CONTENT_TYPE_COLORS` from shared. Fixed ritual color bug on mobile (#f59e0b → #34d399).
  - **Phase C**: Migrated deprecated `ContentType` and `CreationStep` → `ContentItemType` and `ConversationStep` from `@waqup/shared/types` across all web usages; removed deprecated exports from ContentCreationContext.
  - **Phase D**: Added `hooks` and `theme` exports to `packages/shared/src/index.ts`; renamed root package `waqup-app` → `waqup`.
  - **Phase E**: Mobile ProgressScreen refactored to use `createProgressService` instead of raw Supabase queries.
- **Verification**: `npm run type-check` ✅, `npm run build:web` ✅, `npm run build:mobile` ✅.
- **Updated**: 2026-03-10

---

## Full Mobile Design and UX Audit (2026-03-10)

### Mobile Web (responsive) and Native Mobile (Expo)

- **Status**: ✅ Complete
- **Completed**: 2026-03-10
- **Notes**:
  - **Audit docs**: Created `docs/audits/mobile-ui-audit-report.md`, `docs/audits/mobile-page-issues.md`, `docs/audits/mobile-fix-log.md` with device matrix, safe area status, overflow report.
  - **Phone mockups** (how-it-works, launch): Responsive sizing — `width: min(270px, 85vw)`, `aspectRatio: 1/2` so mockups scale on small viewports.
  - **Speak page**: `SPEAK_BOTTOM_UI_HEIGHT` changed to `min(220px, 35vh)` for small viewports.
  - **Create/Conversation**: `height: 100vh` → `minHeight: 100dvh`; `paddingBottom` uses `env(safe-area-inset-bottom)`.
  - **375px breakpoint**: Added in globals.css for hero, pricing, footer padding on smallest phones.
  - **SafeAreaProvider**: Added to mobile App.tsx root so `useSafeAreaInsets()` works correctly.
  - **Touch targets**: `iconOnlySize` in shared tokens bumped 40 → 44px per Apple HIG / Android guidelines.
  - **Input error/helper**: Mobile Input now uses `variant="caption"` (14px) instead of `small` (12px) for better readability.
- **Updated**: 2026-03-10

---

## Full Production Audit Implementation (2026-03-09)

### Security and correctness
- **Status**: ✅ Complete
- **Completed**: 2026-03-09
- **Notes**:
  - **Middleware**: Created `packages/web/middleware.ts` as Next.js default middleware — server-side route protection now active (Supabase session check for protected routes).
  - **Admin API**: Replaced `x-admin-pass` / `NEXT_PUBLIC_ORACLE_ADMIN_PASS` with session-based auth. `GET /api/admin/users` and `GET /api/waitlist` now require `profile.role === 'superadmin'` via Supabase session.
  - **Marketplace proposals**: Fixed `profile?.is_admin` → `profile?.role === 'admin' || profile?.role === 'superadmin'` in `GET /api/marketplace/proposals`.
  - **Profiles RLS**: Migration `20260313000001_tighten_profiles_insert_rls.sql` drops permissive "Service role can insert profiles" policy; users may only insert their own profile.
  - **Zod validation**: Added request body validation to `/api/ai/render`, `/api/ai/tts`, `/api/conversation`, `/api/generate-script`, `/api/orb/chat`.
- **Updated**: 2026-03-09

### Consolidation and cleanup
- **Notes**:
  - **useCreditBalance**: Moved to `packages/shared/src/hooks/useCreditBalance.ts` factory; web and mobile use `createUseCreditBalance(supabase, channelName)`.
  - **Content type icons**: Removed duplicate `CONTENT_TYPE_ICONS` from creation-steps; all usage now via `getContentTypeIcon` from content-helpers.
  - **Dead code**: Removed `mockContent.ts`, `test-imports.ts` (web + mobile), unused `IconButton` component.
  - **routes.ts**: Onboarding steps (profile, preferences, guide) set to `exists`; affirmations/record set to `exists` with note "Placeholder".
  - **Design system**: Replaced hardcoded blur in VoiceCard, VoiceLibrary, CreateFlowInitStep with `BLUR.*` tokens.
- **Updated**: 2026-03-09

### Documentation
- **Notes**:
  - **Roadmap Step 9.2**: Updated OpenAI TTS → ElevenLabs TTS.
  - **waqup-app references**: Replaced with "waqup-new" / "this repo" in phase 01, multi-platform strategy, design system.
  - **Schema verification**: Updated credit_transactions status to "Exists".
- **Updated**: 2026-03-09

---

## Web Stripe Integration Completion (2026-03-09)

### Stripe Customer Portal and Subscriptions hook
- **Status**: ✅ Complete
- **Completed**: 2026-03-09
- **Notes**: Added the web Customer Portal API route `POST /api/stripe/portal`, added the `useSubscription` React Query hook to `packages/web/src/hooks/useSubscription.ts` with its corresponding `Subscription` type definition in `@waqup/shared/types`. Updated the Settings page to display the current subscription plan (including status: active/trialing/past_due) and added a "Manage Billing" button that redirects to the Stripe Customer Portal. Attempted Stripe MCP configuration but no relevant test products existed for waQup yet.
- **Updated**: 2026-03-09

---

## Full Aligned Plan — Blocks 1–10 (2026-03-08)

### All remaining critical broken paths + infrastructure

- **Status**: ✅ Complete
- **Completed**: 2026-03-08
- **Notes**:
  - **Block 1A**: `ContentReviewStep` → `router.push(completeHref?id=savedId)`. Complete pages wrapped in `Suspense` + `useSearchParams` to read `savedId`.
  - **Block 1B**: `ContentCreationContext` extended with `voiceId` + `voiceType`; `ContentVoiceStep` sets them; `ContentReviewStep` passes to `createContent` + triggers `/api/ai/render`.
  - **Block 1C**: New `/api/ai/render` route: validate credits → ElevenLabs TTS → upload to Supabase 'audio' bucket → update `content_items.audio_url`.
  - **Block 1D**: Mobile `ContentCreateScreen` form submit now calls `useCreateContent` mutation.
  - **Block 1E**: Mobile `ProfileScreen` menu items wired with `navigation.navigate()`.
  - **Block 2**: Stripe test keys added to `.env.local`; existing `/api/stripe/checkout/credits`, `/api/stripe/checkout/subscription`, `/api/stripe/webhook` confirmed complete. Stripe SDK updated to `2026-02-25.clover`.
  - **Block 3**: `supabase/migrations/20260310000001_create_audio_bucket.sql` — private 'audio' bucket with owner RLS + marketplace public read. Shared `uploadAudio`, `getAudioSignedUrl`, `deleteAudio` utilities.
  - **Block 4A**: `packages/mobile/src/components/audio/AudioRecorder.tsx` — full recording/playback UI with `expo-av`.
  - **Block 4B**: `app.json` background audio modes + `NSMicrophoneUsageDescription`/`RECORD_AUDIO`/`FOREGROUND_SERVICE` permissions.
  - **Block 4C**: New mobile Sanctuary sub-pages: `CreditsScreen`, `ProgressScreen`, `SettingsScreen`, `RemindersScreen`. Registered in `MainNavigator`.
  - **Block 5**: Web + mobile `useCreditBalance` hooks extended with Supabase Realtime `postgres_changes` subscription for instant credit updates.
  - **Block 6**: Search debouncing (300ms) in `ContentListPage` (web) and `LibraryScreen` (mobile). `LibraryScreen` migrated to `FlatList` with perf props. React Query offline persistor via `AsyncStorage` in mobile `App.tsx`.
  - **Block 7**: `packages/shared/jest.config.js` + 28 passing unit tests: credits service, content service, auth schemas, credit cost constants.
  - **Block 8**: PWA manifest enhanced (shortcuts, screenshots, categories). `packages/mobile/eas.json` created with dev/preview/production build profiles. Service worker `sw.js` (cache-first static, network-first navigation). `ServiceWorkerRegistration` component mounted in web layout.
  - **Block 9A (Phase 15)**: Share button + `ShareModal` wired into `ContentCompleteStep`. Phase 15 analysis doc at `rebuild-roadmap/02-phases/15-phase-15-social-community.md`.
  - **Block 9B (Phase 16)**: Analytics transport-agnostic utility (`packages/shared/src/utils/analytics.ts`) with typed `Analytics.*` helpers. Init in web (`AnalyticsProvider`) and mobile (`App.tsx`). `useBiometricAuth` hook (`expo-local-authentication`). Biometric permissions in `app.json`. Phase 16 doc at `rebuild-roadmap/02-phases/16-phase-16-advanced-features.md`.
  - **Block 10**: This changelog + TypeScript errors fixed (Stripe SDK 20.x API changes: `invoice.parent.subscription_details.subscription`, `subscription.items.data[0].current_period_*`; `ContentAudioStep` field names aligned with `AudioSettings` type; `AudioPageProps` extended; `ScienceTopic` extended).
- **Updated**: 2026-03-08

---

## GitHub CI & Vercel Deployment (2026-03-08)

### Web CI workflow improvements and Vercel deploy
- **Status**: ✅ Complete
- **Completed**: 2026-03-08
- **Notes**: Production-level Web CI: concurrency (cancel in-progress), least-privilege permissions, node_modules + Next.js cache, lint step. Deploy job (main only, after build): vercel pull → vercel build → vercel deploy --prebuilt --prod. Added packages/web/vercel.json for monorepo (installCommand: cd ../.. && npm ci, buildCommand: build:shared then build:web). Docs: docs/05-deployment/01-github-vercel-setup.md (secrets, options A/B, troubleshooting).
- **Updated**: 2026-03-08

---

## Voice Orb (Speak Page)

### High-performance audio-reactive spiritual orb
- **Status**: Complete
- **Completed**: 2026-03-08
- **Notes**: Implemented Voice Orb per plan: WebGL orb using Three.js + React Three Fiber with custom ShaderMaterial (Fresnel rim glow, vertex displacement, audio-driven intensity). Added `useAudioAnalyzer` hook (Web Audio API, AnalyserNode, mic/TTS support). VoiceOrb component with theme colors (mystical.orb, mystical.glow), WebGL fallback (CSS orb), `prefers-reduced-motion` support, Page Visibility API (frameloop demand when tab hidden), lazy-load via dynamic import on Speak page. Integrated with Speak page; mic click calls `resume()` for AudioContext. Fixed format.ts `as const` TypeScript error.
- **Updated**: 2026-03-08

---

## Credits on Create + Voice Setup (non-step)

### Content credit costs and ElevenLabs voice setup
- **Status**: ✅ Complete
- **Completed**: 2026-03-08
- **Notes**: Added shared content credit costs (affirmation 1/2, meditation 2/4, ritual 5/10; base vs AI voice). Updated create page, conversation page, and sanctuary create init pages to display costs. Created ElevenLabs Professional Voice Cloning integration: shared service (create PVC, add samples, TTS preview), API routes (create, samples, get, patch, preview), voice setup page at /sanctuary/voice (create voice, upload samples, preview). Database migration for profiles.elevenlabs_voice_id. Added My Voice to Sanctuary menu. ELEVENLABS_API_KEY in .env.example.
- **Updated**: 2026-03-08

---

## Credits on Create + Voice Setup (plan implementation)

### Content credit costs and ElevenLabs voice setup
- **Status**: ✅ Complete
- **Completed**: 2026-03-08
- **Notes**:
  - **Credit costs**: Shared `CONTENT_CREDIT_COSTS` (affirmation 1/2, meditation 2/4, ritual 5/10; 2x with AI). Applied to create page, conversation page, and sanctuary init pages (affirmations, meditations, rituals).
  - **Voice setup page**: `/sanctuary/voice` with ElevenLabs Professional Voice Cloning flow — create PVC voice, upload samples, preview TTS, update metadata.
  - **API routes**: POST /api/voice/create, POST /api/voice/samples, GET/PATCH /api/voice, POST /api/voice/preview.
  - **Database**: Migration `20260308000002_add_elevenlabs_voice_to_profiles.sql` adds elevenlabs_voice_id, elevenlabs_voice_name, elevenlabs_voice_language to profiles.
  - **Navigation**: "My Voice" added to SANCTUARY_MENU_ITEMS.
  - **Env**: ELEVENLABS_API_KEY in .env.example (server-side).
- **Updated**: 2026-03-08

---

## Credits on Create + Voice Setup (non-step)

### Content credit costs and ElevenLabs voice setup page
- **Status**: Complete
- **Completed**: 2026-03-08
- **Notes**: Added shared `CONTENT_CREDIT_COSTS` (affirmation 1/2, meditation 2/4, ritual 5/10; base vs with AI). Updated create page, conversation page, and sanctuary create init pages to show credit costs. Created ElevenLabs Professional Voice Cloning integration: shared service (`createPvcVoice`, `addSamplesToPvc`, `getVoice`, `textToSpeech`), API routes (`/api/voice`, `/api/voice/create`, `/api/voice/samples`, `/api/voice/preview`), voice setup page at `/sanctuary/voice`, migration for `profiles.elevenlabs_voice_id`, and "My Voice" in Sanctuary menu. Added `ELEVENLABS_API_KEY` to env example.
- **Updated**: 2026-03-08

---

## Credits on Create + Voice Setup (non-step)

### Content credit costs and ElevenLabs voice setup page
- **Status**: Complete
- **Completed**: 2026-03-08
- **Notes**: Added shared `CONTENT_CREDIT_COSTS` (affirmation 1/2, meditation 2/4, ritual 5/10; 2x with AI). Updated create page, conversation page, and sanctuary init pages to show credit costs. Created ElevenLabs Professional Voice Cloning integration: migration for `profiles.elevenlabs_voice_id`, shared `elevenlabs.ts` service (create PVC, add samples, get voice, TTS), API routes (`/api/voice`, `/api/voice/create`, `/api/voice/samples`, `/api/voice/preview`), voice setup page at `/sanctuary/voice` with create/upload/preview flow. Added "My Voice" to Sanctuary menu, `ELEVENLABS_API_KEY` to env example.
- **Updated**: 2026-03-08

---

## Credits on Create + Voice Setup (non-step)

### Content credit costs and ElevenLabs voice setup page
- **Status**: Complete
- **Completed**: 2026-03-08
- **Notes**: Added shared `CONTENT_CREDIT_COSTS` (affirmation 1/2, meditation 2/4, ritual 5/10 credits; 2x with AI). Updated create page, conversation page, and sanctuary init pages to show credit costs. Created ElevenLabs Professional Voice Cloning integration: shared service (`createPvcVoice`, `addSamplesToPvc`, `getVoice`, `textToSpeech`), API routes (`/api/voice`, `/api/voice/create`, `/api/voice/samples`, `/api/voice/preview`), voice setup page at `/sanctuary/voice`, migration for `profiles.elevenlabs_voice_id`, and "My Voice" in Sanctuary menu. Added `ELEVENLABS_API_KEY` to .env.example.
- **Updated**: 2026-03-08

---

## Credits on Create + Voice Setup (non-step)

### Content credit costs and ElevenLabs voice setup
- **Status**: Complete
- **Completed**: 2026-03-08
- **Notes**: Added shared `CONTENT_CREDIT_COSTS` (affirmation 1/2, meditation 2/4, ritual 5/10; base vs with AI). Updated create page, conversation page, and sanctuary create init pages to show credit costs. Created ElevenLabs Professional Voice Cloning integration: shared service (`createPvcVoice`, `addSamplesToPvc`, `getVoice`, `textToSpeech`), API routes (`/api/voice`, `/api/voice/create`, `/api/voice/samples`, `/api/voice/preview`), voice setup page at `/sanctuary/voice`, migration for `profiles.elevenlabs_voice_id`, and "My Voice" in Sanctuary menu. Added `ELEVENLABS_API_KEY` to env example.
- **Updated**: 2026-03-08

---

## Credits on Create + Voice Setup (plan implementation)

### Content credit costs and ElevenLabs voice setup
- **Status**: Complete
- **Completed**: 2026-03-08
- **Notes**: Added shared `CONTENT_CREDIT_COSTS` (affirmation 1/2, meditation 2/4, ritual 5/10; base vs with AI). Updated create page, conversation page, and sanctuary init pages (affirmations, meditations, rituals) to display credit costs. Created ElevenLabs Professional Voice Cloning integration: migration for `profiles.elevenlabs_voice_id`, shared `elevenlabs.ts` service (create PVC, add samples, get voice, TTS), API routes (`/api/voice`, `/api/voice/create`, `/api/voice/samples`, `/api/voice/preview`), voice setup page at `/sanctuary/voice`, and "My Voice" in Sanctuary menu. Added `ELEVENLABS_API_KEY` to env examples.
- **Updated**: 2026-03-08

---

## Credits on Create + Voice Setup (non-step)

### Content credit costs and ElevenLabs voice setup page
- **Status**: Complete
- **Completed**: 2026-03-08
- **Notes**: Added shared `CONTENT_CREDIT_COSTS` (affirmation 1/2, meditation 2/4, ritual 5/10; base vs with AI). Updated create page, conversation page, and sanctuary init pages to show credit costs. Created ElevenLabs Professional Voice Cloning integration: shared service (`createPvcVoice`, `addSamplesToPvc`, `getVoice`, `textToSpeech`), API routes (`/api/voice`, `/api/voice/create`, `/api/voice/samples`, `/api/voice/preview`), voice setup page at `/sanctuary/voice`, migration for `profiles.elevenlabs_voice_id`, and "My Voice" in Sanctuary menu. Added `ELEVENLABS_API_KEY` to .env.example.
- **Updated**: 2026-03-08

---

## Credits on Create + Voice Setup (plan implementation)

### Content credit costs and ElevenLabs voice setup
- **Status**: ✅ Complete
- **Completed**: 2026-03-08
- **Notes**: Added shared `CONTENT_CREDIT_COSTS` (affirmation 1/2, meditation 2/4, ritual 5/10). Updated create page, conversation page, and sanctuary init pages to show credit costs. Created ElevenLabs Professional Voice Cloning integration: shared service (`packages/shared/src/services/ai/elevenlabs.ts`), API routes (create, samples, get/patch, preview), voice setup page at `/sanctuary/voice`, migration for `profiles.elevenlabs_voice_id`, and "My Voice" in Sanctuary menu. Added `ELEVENLABS_API_KEY` to .env.example.
- **Updated**: 2026-03-08

---

## Credits on Create + Voice Setup (plan implementation)

### Content credit costs and ElevenLabs voice setup
- **Status**: Complete
- **Completed**: 2026-03-08
- **Notes**: Added shared `CONTENT_CREDIT_COSTS` (affirmation 1/2, meditation 2/4, ritual 5/10; base vs with AI). Updated create page, conversation page, and sanctuary init pages to show credit costs. Created ElevenLabs Professional Voice Cloning integration: shared service (`createPvcVoice`, `addSamplesToPvc`, `getVoice`, `textToSpeech`), API routes (`/api/voice`, `/api/voice/create`, `/api/voice/samples`, `/api/voice/preview`), voice setup page at `/sanctuary/voice`, migration for `profiles.elevenlabs_voice_id`, and "My Voice" in Sanctuary menu. Added `ELEVENLABS_API_KEY` to env example.
- **Updated**: 2026-03-08

---

## EBADENGINE and version consistency (non-step)

### Node version alignment and deprecated package mitigation
- **Status**: Complete
- **Completed**: 2026-03-08
- **Notes**: Aligned Node/npm version requirements across project. Added `.nvmrc` (24) for local consistency. Updated README.md, docs/04-reference/12-local-development.md, scripts/README.md to require Node.js >= 24.0.0 (was 20.9/22). Added npm override for `glob@^10.4.5` to mitigate deprecated glob@7.2.3/inflight warnings from transitive deps (Jest, React Native). CI already uses Node 24. Verified: build:shared and build:web succeed.
- **Updated**: 2026-03-08

---

## Local Development Setup (non-step)

### Full local Supabase development environment
- **Status**: Complete
- **Completed**: 2026-03-08
- **Notes**: Supabase CLI initialized; migrations in `supabase/migrations/` (content_items + audio columns); seed data (dev user dev@local.test/password123 + sample content); `.env.local.example` for web and mobile; NPM scripts (supabase:start, supabase:stop, supabase:status, supabase:reset, dev:local); docs at `docs/04-reference/12-local-development.md`. Requires Docker for `supabase start`.
- **Updated**: 2026-03-08

---

## UI polish (non-step)

### UI spacing and padding consistency
- **Status**: ✅ Complete
- **Completed**: 2026-03-08
- **Notes**: Replaced magic numbers with design tokens across all web pages and components. Created `docs/04-reference/13-spacing-usage-guide.md` and semantic helpers (ICON_TEXT_GAP, LIST_ITEM_PADDING, CARD_INTERNAL_PADDING) in theme. Fixed: AppLayout nav bar (gap between nav group and profile, credits badge padding), Credits page (transaction row padding, amount margin), Sanctuary page (stats strip gap, menu item badge padding), ContentListPage/library/marketplace/join (gap: 3 → spacing.xs), and 20+ files with marginBottom/marginTop/gap magic numbers. Verification: no remaining `gap: [0-9]` or `marginBottom: [0-9]` in style objects.
- **Updated**: 2026-03-08

### All-pages safe-area and unified card styling
- **Status**: ✅ Complete
- **Completed**: 2026-02-18
- **Notes**: Added design token SAFE_AREA_RIGHT ('100px') in design-tokens.ts. Applied safe-area padding (paddingTop + paddingRight) to main app pages (home, library, create, profile), PlaceholderPage (sanctuary and other placeholders), marketing (how-it-works, pricing), and landing (hero, features, benefits, CTA, footer) so the fixed Theme button never overlaps content. Unified card styling on Home and Create to match Profile: single glass.opaque style, consistent icon treatment (background.tertiary, accent.primary), no alternating opaque/transparent.
- **Updated**: 2026-02-18

### Profile page & Theme selector UX
- **Status**: ✅ Complete
- **Completed**: 2026-02-17
- **Notes**: ThemeSelector is now collapsible (single “Theme” button with palette icon; dropdown on click, close on outside click or theme select) to avoid overlapping profile and other main content. Profile page: unified settings card styling (glass.opaque, consistent icons), increased header-to-content spacing (spacing.xxl), responsive grid for menu items (auto-fill minmax(280px, 1fr)), and right padding so fixed Theme button does not overlap title/content.
- **Updated**: 2026-02-17

---

## Phase 0: Research & Planning

### Step 0.1: Technology Stack Research
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**: 
  - Reviewed all docs in `docs/`
  - Researched React Native + Expo
  - Researched Supabase React Native SDK
  - Documented in `docs/02-mobile/01-technology-stack.md`
- **Updated**: 2026-02-07

---

## Phase 1: Project Foundation

### Step 1.1: Initialize All Platform Projects
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Updated**: 2026-02-07 (Simplified to Mobile + Web only)
- **Notes**: 
  - **Simplified Architecture**: Removed Tauri/Rust desktop app, using Web platform for desktop browsers
  - Mobile: Expo SDK 54 + React Native 0.81.5 + React 19.1.0 initialized
  - Web: Next.js 16.1.6 + React 19.2.3 + TypeScript 5.9.3 initialized (serves desktop browsers)
  - Shared: Package structure created with latest stable dependencies
    - Supabase 2.95.3
    - Zustand 5.0.10
    - React Query 5.90.16
    - Zod 3.23.8
  - Both platforms configured with workspace linking
  - Environment templates created (.env.example)
  - Git remote updated to waqup-new.git
  - **Desktop = Web**: Desktop functionality via Next.js web app (PWA support)

### Step 1.2: Configure Project Structure
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**: 
  - Created complete `src/` directory structure for mobile with all subdirectories (app, screens, components, navigation, services, hooks, types, utils, constants)
  - Created mobile `src/app/App.tsx` entry point with basic Expo app
  - Created all barrel export files (index.ts) for mobile directories
  - Configured `app.json` with app metadata (name: "waQup", slug: "waqup", iOS/Android config)
  - Created Next.js App Router structure for web (`app/` directory)
  - Created web `app/layout.tsx` root layout and `app/page.tsx` home page
  - Created web `src/` directory structure with components, hooks, lib, types
  - Configured web `tsconfig.json` with Next.js config and path aliases
  - Created `next.config.js` for web
  - Verified path aliases work on both platforms (tested with imports)
  - TypeScript compilation succeeds on both platforms
- **Updated**: 2026-02-07

### Step 1.3: Install Core Dependencies
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**: 
  - **Mobile Dependencies Installed**:
    - Navigation: @react-navigation/native, @react-navigation/stack, @react-navigation/bottom-tabs
    - Navigation deps: react-native-screens, react-native-safe-area-context
    - Audio: expo-av
    - Forms: react-hook-form, @hookform/resolvers
    - UI: react-native-reanimated, react-native-gesture-handler
    - Utilities: date-fns, uuid, axios
    - Storage: @react-native-async-storage/async-storage (for Supabase auth)
    - Dev: @types/react-native, @types/uuid
  - **Web Dependencies Installed**:
    - Forms: react-hook-form, @hookform/resolvers
    - Utilities: date-fns, uuid
    - Dev: @types/uuid
  - **Installation Method**: Direct installation in package directories with `--no-audit --no-fund` flags to avoid hanging
  - **Installation Script**: Created `scripts/install-dependencies.sh` for future use
  - **Verification**: TypeScript compilation succeeds on both platforms
  - **Note**: Shared package (zustand, react-query, zod, supabase) already installed and working
- **Updated**: 2026-02-07

### Step 1.4: Configure Supabase Connection
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**: 
  - **Shared Package**: Created Supabase client factory function in `packages/shared/src/services/supabase/client.ts`
    - Platform-agnostic `createSupabaseClient()` function that accepts storage adapter
    - `testSupabaseConnection()` utility function for testing
    - Exported from shared services index
  - **Mobile Package**: 
    - Verified `expo-constants` is installed (already present)
    - Created mobile-specific Supabase client in `packages/mobile/src/services/supabase.ts`
    - Uses AsyncStorage for auth persistence
    - Reads environment variables from `Constants.expoConfig?.extra` or `process.env.EXPO_PUBLIC_*`
    - Updated `app.json` with `extra` field for environment variables
  - **Web Package**: 
    - Created web-specific Supabase client in `packages/web/src/lib/supabase.ts`
    - Uses browser localStorage automatically (no storage adapter needed)
    - Reads environment variables from `process.env.NEXT_PUBLIC_*`
  - **Verification**: 
    - TypeScript compilation succeeds on both platforms
    - Imports work correctly from `@waqup/shared/services`
    - Both clients properly configured with auth options (autoRefreshToken, persistSession, detectSessionInUrl: false)
- **Updated**: 2026-02-07

### Step 1.5: Set Up Navigation Structure
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**: 
  - **Mobile Navigation**:
    - Created navigation types in `packages/mobile/src/navigation/types.ts`
    - Created AuthNavigator (Stack) with Login, Signup, ForgotPassword screens
    - Created MainNavigator (Bottom Tabs) with Home, Library, Create, Profile screens
    - Created RootNavigator that conditionally shows Auth or Main based on auth state
    - Created all placeholder screens in `packages/mobile/src/screens/`
    - Integrated RootNavigator in App.tsx entry point
  - **Web Navigation**:
    - Created navigation types in `packages/web/src/types/navigation.ts`
    - Created Next.js App Router structure with route groups:
      - `app/(auth)/` - Auth routes (login, signup, forgot-password)
      - `app/(main)/` - Main routes (home, library, create, profile)
    - Created layout components for each route group
    - Updated root page.tsx to redirect to /login (temporary, will be updated in Phase 3)
  - **TypeScript**: All navigation properly typed with TypeScript
  - **Verification**: 
    - Mobile: Navigation structure works, can navigate between screens
    - Web: All routes accessible, route groups properly organized
- **Updated**: 2026-02-07

---

## Phase 3: Authentication System

### Step 3.1: Build Login Screen
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**:
  - **Shared Layer**:
    - Created auth service (`packages/shared/src/services/auth/authService.ts`) with login, signup, logout, password reset functions
    - Created auth store factory (`packages/shared/src/stores/authStore.ts`) using Zustand with user, session, loading, error state
    - Created auth validation schemas (`packages/shared/src/schemas/auth.schemas.ts`) using Zod for login, signup, password reset
    - Created auth TypeScript types (`packages/shared/src/types/auth.ts`) for AuthState, LoginCredentials, SignupData
  - **Mobile Platform**:
    - Created mobile auth store instance (`packages/mobile/src/stores/authStore.ts`) with AsyncStorage
    - Built functional login screen (`packages/mobile/src/screens/auth/LoginScreen.tsx`) with form validation using react-hook-form and zodResolver
    - Integrated with auth store for login functionality
    - Added error handling and loading states
    - Updated RootNavigator to check auth state and conditionally show Auth or Main navigator
  - **Web Platform**:
    - Created web auth store instance (`packages/web/src/stores/authStore.ts`)
    - Built functional login page (`packages/web/app/(auth)/login/page.tsx`) with form validation
    - Integrated with auth store for login functionality
    - Added error handling and loading states
- **Updated**: 2026-02-07

### Step 3.2: Build Signup Screen
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**:
  - **Shared Layer**:
    - Extended auth service with signup and resendVerificationEmail functions
    - Extended auth schemas with signup validation (password confirmation matching, terms acceptance)
  - **Mobile Platform**:
    - Built functional signup screen (`packages/mobile/src/screens/auth/SignupScreen.tsx`) with:
      - Email, password, confirm password inputs with validation
      - Password strength requirements (uppercase, lowercase, number)
      - Terms of service checkbox
      - Success screen with email verification instructions
      - Resend verification email functionality
  - **Web Platform**:
    - Built functional signup page (`packages/web/app/(auth)/signup/page.tsx`) with same functionality as mobile
    - Web-optimized layout with centered form
- **Updated**: 2026-02-07

### Step 3.3: Implement Auth State Management
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**:
  - **Shared Layer**:
    - Enhanced auth store with session persistence (AsyncStorage for mobile, localStorage for web)
    - Added auto-refresh token logic via Supabase auth state listener
    - Added `initializeAuth()` function to load session on app start
    - Added `getCurrentSession()` function for session verification
  - **Mobile Platform**:
    - Updated RootNavigator (`packages/mobile/src/navigation/RootNavigator.tsx`) to:
      - Initialize auth state on mount
      - Check auth state from store
      - Conditionally render AuthNavigator or MainNavigator
      - Handle auth state changes (auto-navigate)
  - **Web Platform**:
    - Created AuthProvider component (`packages/web/src/components/auth/AuthProvider.tsx`) to:
      - Initialize auth state on mount
      - Handle protected route redirects
      - Check auth state and redirect to login if not authenticated
    - Updated root layout (`packages/web/app/layout.tsx`) to wrap app with AuthProvider
    - Created middleware (`packages/web/middleware.ts`) for basic route protection (client-side auth check in AuthProvider handles actual redirects)
- **Updated**: 2026-02-07

### Step 3.4: Build Forgot Password Flow
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**:
  - **Shared Layer**:
    - Extended auth service with `requestPasswordReset()` and `resetPassword()` functions
    - Extended auth schemas with forgot password and reset password validation
    - Updated reset password to work with Supabase's hash fragment flow (token handled automatically)
  - **Mobile Platform**:
    - Built forgot password screen (`packages/mobile/src/screens/auth/ForgotPasswordScreen.tsx`) with:
      - Email input with validation
      - Success message after email sent
      - Instructions for checking email
    - Built reset password screen (`packages/mobile/src/screens/auth/ResetPasswordScreen.tsx`) with:
      - New password and confirm password inputs
      - Token validation (handled via deep linking)
      - Success message and redirect to login
    - Updated AuthNavigator to include ResetPassword route
    - Updated navigation types to include ResetPassword route with token param
  - **Web Platform**:
    - Built forgot password page (`packages/web/app/(auth)/forgot-password/page.tsx`) with same functionality as mobile
    - Built reset password page (`packages/web/app/(auth)/reset-password/page.tsx`) with:
      - Token extraction from URL hash fragments (handled by Supabase automatically)
      - Session validation before allowing password reset
      - Success message and redirect to login
- **Updated**: 2026-02-07

### Summary: Phase 3 Complete
- **All Steps**: ✅ Complete
- **Date**: 2026-02-07
- **Platforms**: Mobile + Web (parallel development)
- **Key Achievements**:
  - Complete authentication system with login, signup, password reset
  - Shared auth logic in `packages/shared/` (service, store, schemas, types)
  - Platform-specific UI implementations for mobile and web
  - Session persistence and protected routes
  - Form validation with react-hook-form and Zod
  - Error handling and loading states throughout
  - Email verification flow for signup
  - Password reset flow with Supabase integration

---

## Phase 2: Design System & UI Foundation

### Step 2.1: Create Design System
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**: 
  - **Web Platform**: 
    - Complete theme system with `themes.ts` (6 predefined themes: mystical-purple, professional-blue, serene-green, golden-sunset, cosmic-dark, minimalist-light)
    - ThemeProvider with React Context and localStorage persistence
    - Theme system matches old app design exactly (purple-600, indigo-600, bg-white/5, border-white/10)
    - All theme tokens exported (colors, typography, spacing, borderRadius, shadows, glass)
  - **Mobile Platform**: 
    - Complete theme system with `themes.ts` matching web structure
    - ThemeProvider with React Context and AsyncStorage persistence
    - Same 6 predefined themes as web platform
    - All theme tokens exported (colors, typography, spacing, borderRadius, shadows, glass)
    - ThemeProvider integrated in App.tsx entry point
- **Updated**: 2026-02-07

### Step 2.2: Build Core UI Components
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**: 
  - **Web Platform**: 
    - Button, Card, Typography, Input, Loading, Badge, Container, Progress, Icon components
    - All components use theme system via `useTheme()` hook
    - Glass-morphism effects with backdrop-blur
    - Proper TypeScript types and accessibility attributes
  - **Mobile Platform**: 
    - Button, Card, Typography, Input, Loading, Badge, Container, Progress components
    - All components updated to use theme system via `useTheme()` hook
    - Glass-morphism effects with expo-blur BlurView
    - Proper TypeScript types and accessibility attributes
    - Components match web platform functionality
- **Updated**: 2026-02-07

### Step 2.3: Create Layout Components
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**: 
  - **Web Platform**: 
    - Layout components in `app/(auth)/layout.tsx`, `app/(marketing)/layout.tsx`, `app/(main)/layout.tsx`
    - ThemeProvider integrated in all layouts
    - ThemeSelector component visible on all pages
  - **Mobile Platform**: 
    - Created Screen component (handles safe areas, padding, scrollable option)
    - Created Header component (navigation header with back button, title, actions)
    - Created BottomSheet component (modal bottom sheet with animations and blur)
    - Updated MainNavigator to use theme system for tab bar styling
    - All layout components use theme system via `useTheme()` hook
    - Layout components exported from `packages/mobile/src/components/layout/index.ts`
- **Updated**: 2026-02-07

### Step 2.4: Build Setup/Onboarding Page
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**: 
  - **Web Platform**: 
    - Landing page (`app/page.tsx`) with hero section, features, and CTA
    - All marketing pages created (`/how-it-works`, `/pricing`)
    - Beautiful animations and glass-morphism effects
    - ThemeSelector visible on all pages
  - **Mobile Platform**: 
    - Created SetupScreen component (`packages/mobile/src/screens/SetupScreen.tsx`)
    - Beautiful welcome screen with hero section, feature cards, and CTA buttons
    - Uses all design system components (Screen, Card, Button, Typography)
    - Smooth animations using react-native-reanimated (FadeInUp, FadeInDown)
    - Responsive design with proper spacing and typography
    - Exported from `packages/mobile/src/screens/index.ts`
- **Updated**: 2026-02-07

---

## Documentation Steps

### Documentation: Research Findings
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
  - **Notes**: Consolidated into `docs/02-mobile/01-technology-stack.md`
- **Updated**: 2026-02-07

### Documentation: Technology Decisions
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
  - **Notes**: Consolidated into `docs/02-mobile/01-technology-stack.md`
- **Updated**: 2026-02-07

### Documentation: Mobile Architecture
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
  - **Notes**: Moved to `docs/02-mobile/02-architecture.md`
- **Updated**: 2026-02-07

### Documentation: Implementation Notes
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
  - **Notes**: Moved to `docs/02-mobile/03-implementation.md`
- **Updated**: 2026-02-07

### Documentation: Schema Verification
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**: Moved to `../01-planning/02-schema-verification.md`
- **Updated**: 2026-02-07

### Documentation: Phase 1 Analysis
- **Status**: ✅ Complete
- **Completed**: 2026-02-07
- **Notes**: Moved to `../02-phases/01-phase-01-project-foundation.md`
- **Updated**: 2026-02-07

---

## Pages & Routes Complete (2026-02-13)

### Web App - Full Route Structure
- **Status**: ✅ Complete
- **Completed**: 2026-02-13
- **Notes**:
  - Created `/pages` index and `/sitemap` (HTML + XML) for all routes
  - Added Auth: `/confirm-email`, `/auth/beta-signup`
  - Added Onboarding: `/onboarding`, `/onboarding/profile`, `/onboarding/preferences`, `/onboarding/guide`
  - Added Sanctuary: `/sanctuary`, settings, credits, progress, referral, reminders, learn
  - Added Affirmations: list, create (steps), record
  - Added Rituals: list, [id], [id]/edit, create, recordings
  - Added Meditations: create (for create page link)
  - Removed duplicate ThemeSelector from (main) pages; removed redundant ThemeProvider from route group layouts
  - Updated home and profile links to sanctuary routes
  - Updated AuthProvider, proxy, navigation types with new routes
  - Created shared PlaceholderPage component for new pages
- **Updated**: 2026-02-13

---

## Phase 4–5 & Sanctuary (Web) – Extended Implementation

### Web: Core Pages + Sanctuary + Content CRUD
- **Status**: ✅ Complete (Web)
- **Completed**: 2026-02-16 (documented)
- **Notes**:
  - **Phase 4 (Web)**: Home, Library, Create, Profile – full UI with links to Sanctuary
  - **Sanctuary hub**: `/sanctuary` with settings, credits, progress, referral, reminders, learn
  - **Affirmations**: List, create (init + steps), [id] detail, edit, edit-audio, record
  - **Meditations**: List, create (init), [id] detail, edit, edit-audio
  - **Rituals**: List, create (init, goals), [id] detail, edit, edit-audio, recordings
  - **Speak / conversation**: `/speak` (orb), `/create/conversation` – full UI
  - **Marketplace**: `/marketplace`, `/marketplace/creator` – full UI
  - Create flows use multi-step forms (init, goals); **to change** → conversational (orb/speak)
- **Mobile**: Phase 4 not started (only basic Home, Library, Create, Profile placeholders)
- **Updated**: 2026-02-16

---

## Design System Consolidation (Shared Theme)

### Theme moved to @waqup/shared
- **Status**: ✅ Complete
- **Completed**: 2026-02-16 (documented)
- **Notes**:
  - Canonical theme in `packages/shared/src/theme/` (colors, tokens, types, themes)
  - Web: `format.ts` (px, shadow CSS), `glass.ts` (backdrop-filter)
  - Mobile: `format.ts` (RN numbers/objects), `glass.ts` (fallback)
  - Removed: platform-level `borders.ts`, `colors.ts`, `shadows.ts`, `spacing.ts`, `typography.ts`, `themes.ts`
  - Ref: `docs/04-reference/07-design-system.md`
- **Updated**: 2026-02-16

---

## How to Update

When completing a step:
1. Update status: ⏳ Pending → ✅ Complete
2. Add completion date
3. Add notes about what was done
4. Update "Updated" date

When re-running a step:
1. Keep previous completion entry
2. Add new entry with updated date
3. Note what changed or was updated

---

**Last Updated**: 2026-03-09

---

## Summary

- **Phases 1–3**: ✅ Complete (Mobile + Web)
- **Phase 2**: Design System ✅ Complete – theme consolidated to `@waqup/shared`
- **Phase 4–5 (Web)**: ✅ Complete – Sanctuary, content CRUD, speak, marketplace
- **Phase 8 (Web)**: ✅ Complete – ElevenLabs TTS, /api/ai/render, Voice Orb, audio bucket
- **Phase 10 (Web)**: ✅ Complete – Stripe checkout, portal, credits, subscriptions
- **Phase 4–5 (Mobile)**: ⏳ Partial – Sanctuary sub-pages (Credits, Progress, Settings, Reminders), ContentCreateScreen, SpeakScreen, Library
- **Next**: Web — conversational create flows; Mobile — Stripe checkout, full onboarding, marketplace

**Phase 2 steps** (2.1, 2.2, 2.3, 2.4) completed with:
- Complete theme system matching old app design
- All core UI components using theme system
- Layout components for both platforms
- Setup/onboarding pages created
- Consistent design across platforms
