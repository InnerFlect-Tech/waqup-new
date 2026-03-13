# waQup Solution — Context for AI (ChatGPT / Claude)

**Purpose**: This file documents the **actual current implementation** of waQup (not roadmap or aspirational docs). Use it as context when discussing the codebase with ChatGPT, Claude, or similar AI assistants.

**Canonical AI context.** Docs reference this file for current state. See `docs/04-reference/16-route-map.md` for authoritative route list; `docs/README.md` for full documentation.

**Last updated**: 2026-03-13

---

## 1. Project Overview

### Monorepo structure
- **`packages/web`** — Next.js 16 web app (desktop browsers, PWA support)
- **`packages/mobile`** — React Native + Expo 54 (Android, iOS)
- **`packages/shared`** — Shared business logic, types, services, theme, constants

### Tech stack
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Payments**: Stripe (web only; mobile IAP schema exists, no checkout UI yet)
- **AI / TTS**: OpenAI (script generation, conversation), ElevenLabs (voice cloning IVC, TTS)
- **State**: Zustand (auth), React Query (server state), Supabase Realtime (credits)

### Design system
- **Shared tokens**: `packages/shared/src/theme/tokens.ts` (spacing, radii, blur, colors)
- **Web**: `packages/web/src/theme/format.ts` (CSS adapters), `@/theme` imports
- **Mobile**: `packages/mobile/src/theme/format.ts` (React Native adapters)

### Content types (non-interchangeable)
- **Affirmation** — cognitive re-patterning (shallow → medium)
- **Meditation** — guided meditations (medium depth)
- **Ritual** — identity encoding (deepest)

---

## 2. Web App — Complete Route Map

All routes live under `app/[locale]/` with locales: `en`, `pt`, `es`, `fr`, `de`. Default `en` uses `localePrefix: 'as-needed'` (no `/en` prefix).

### Landing & Marketing
| Path | Completeness | Description | Key components |
|------|--------------|-------------|-----------------|
| `/` | complete | Main landing: hero, benefits, waitlist CTA, founding member modal | PageShell, WaitlistCTA, FoundingMemberModal, PublicFooter, LandingSection, LandingCard |
| `/launch` | complete | Primary marketing landing | PageShell, marketing content |
| `/how-it-works` | complete | How it works (step-by-step) | PageShell |
| `/pricing` | complete | Pricing & plans, Stripe checkout | PageShell, pricing UI |
| `/explanation` | complete | Science — voice + affirmations | PageShell |
| `/our-story` | complete | Founder narrative | PageShell |
| `/community` | complete | Community overview | PageShell |
| `/join` | complete | Founding member sign-up | PageShell |
| `/waitlist` | complete | Multi-step waitlist form | PageShell |
| `/get-qs` | wired | Public Q packs (login required to purchase) | PageShell |
| `/funnels` | complete | Sales funnels (internal) | PageShell |
| `/investors` | complete | Investor pitch (footer only) | PageShell |
| `/play/[id]` | complete | Public audio player (SSR + OG metadata) | PublicPlayerClient |
| `/for-coaches` | complete | Audience page for coaches | PageShell, LandingCard |
| `/for-creators` | complete | Audience page for creators | PageShell, LandingCard |
| `/for-studios` | complete | Audience page for studios | PageShell, LandingCard |
| `/for-teachers` | complete | Audience page for teachers | PageShell, LandingCard |

### Legal
| Path | Completeness | Description |
|------|--------------|-------------|
| `/privacy` | complete | Privacy policy (GDPR/CCPA) |
| `/terms` | complete | Terms of service (wellness disclaimer) |
| `/data-deletion` | complete | Data deletion instructions (Meta/Facebook app submission) |

### Auth
| Path | Completeness | Description | Key components |
|------|--------------|-------------|-----------------|
| `/login` | complete | Email + Google OAuth login | PageShell, GlassCard, Logo, Input, Button, TestLoginButton |
| `/signup` | complete | Email signup, terms checkbox | PageShell, GlassCard |
| `/forgot-password` | complete | Request password reset | PageShell, GlassCard |
| `/reset-password` | complete | Reset from email link (hash-token) | PageShell, GlassCard |
| `/confirm-email` | complete | Email confirmation instructions | PageShell, GlassCard |
| `/coming-soon` | complete | Gate for waitlist-pending users | PageShell |

### Onboarding
| Path | Completeness | Description | Key components |
|------|--------------|-------------|-----------------|
| `/onboarding` | complete | Why + intention; grants 20 welcome Qs | PageShell, GlassCard, OnboardingSuperAdminLink |
| `/onboarding/voice` | complete | Voice cloning (IVC) setup | PageShell, voice setup |
| `/onboarding/profile` | complete | Profile setup (name, avatar) | PageShell, profile form |
| `/onboarding/preferences` | placeholder | Preferences | PageShell |
| `/onboarding/guide` | placeholder | Getting started guide | PageShell |
| `/onboarding/role` | placeholder | Role selection | PageShell |

### Main App
| Path | Completeness | Description | Key components |
|------|--------------|-------------|-----------------|
| `/library` | wired | Content library, filters, Today's practice | PageShell, PageContent, useContent, ShareModal |
| `/create` | complete | Content type picker (affirmation/meditation/ritual) | PageShell, PageContent, ContentTypeCard, QCoin, CONTENT_CREDIT_COSTS |
| `/create/conversation` | mock | Text chat conversational creation | PageShell, PageContent, Chat UI, /api/conversation |
| `/create/orb` | wired | Voice orb creation flow | PageShell, PageContent, orb UI |
| `/profile` | complete | User profile, name, bio, credits, logout | PageShell, PageContent, useAuthStore, useCreditBalance |

### Voice & Speak
| Path | Completeness | Description | Key components |
|------|--------------|-------------|-----------------|
| `/speak` | complete | Real-time voice AI orb conversation | PageShell, PageContent, VoiceOrb |
| `/speak/test` | complete | Dev test harness for speak | PageShell, PageContent |

### Sanctuary (hub + sub-pages)
| Path | Completeness | Description |
|------|--------------|-------------|
| `/sanctuary` | complete | Sanctuary home dashboard |
| `/sanctuary/settings` | stub | Account settings |
| `/sanctuary/settings/about` | complete | About, version, changelog, acknowledgments |
| `/sanctuary/voice` | wired | Voice cloning setup |
| `/sanctuary/voices` | wired | Voice library browser |
| `/sanctuary/progress` | stub | Progress tracking & XP |
| `/sanctuary/reminders` | stub | Reminders manager |
| `/sanctuary/referral` | stub | Referral & rewards |
| `/sanctuary/learn` | stub | Educational content |
| `/sanctuary/help` | stub | Help & support |
| `/sanctuary/plan` | wired | Subscription plan picker |
| `/sanctuary/series` | wired | Series list |
| `/sanctuary/series/[id]` | wired | Series detail |

### Credits
| Path | Completeness | Description |
|------|--------------|-------------|
| `/sanctuary/credits` | wired | Credit balance overview |
| `/sanctuary/credits/buy` | wired | Buy Qs (Stripe checkout) |
| `/sanctuary/credits/transactions` | wired | Transaction history |

### Affirmations
| Path | Completeness | Description |
|------|--------------|-------------|
| `/sanctuary/affirmations` | wired | List |
| `/sanctuary/affirmations/[id]` | wired | Detail / player |
| `/sanctuary/affirmations/[id]/edit` | wired | Edit metadata |
| `/sanctuary/affirmations/[id]/edit-audio` | wired | Edit audio layers |
| `/sanctuary/affirmations/create` | to_change | Redirects to init |
| `/sanctuary/affirmations/create/init` | wired | Step overview + mode select |
| `/sanctuary/affirmations/create/intent` | wired | Intention step |
| `/sanctuary/affirmations/create/script` | wired | AI-generated script |
| `/sanctuary/affirmations/create/voice` | wired | Voice selection |
| `/sanctuary/affirmations/create/audio` | wired | Audio mixing |
| `/sanctuary/affirmations/create/review` | wired | Review before save |
| `/sanctuary/affirmations/create/complete` | wired | Success screen |
| `/sanctuary/affirmations/record` | placeholder | Record voice |

### Meditations
| Path | Completeness | Description |
|------|--------------|-------------|
| `/sanctuary/meditations` | wired | List |
| `/sanctuary/meditations/[id]` | wired | Detail / player |
| `/sanctuary/meditations/[id]/edit` | wired | Edit metadata |
| `/sanctuary/meditations/[id]/edit-audio` | wired | Edit audio layers |
| `/sanctuary/meditations/create` | to_change | Redirects to init |
| `/sanctuary/meditations/create/init` | wired | Init step |
| `/sanctuary/meditations/create/intent` | wired | Intention |
| `/sanctuary/meditations/create/context` | wired | Emotional context |
| `/sanctuary/meditations/create/script` | wired | AI-generated script |
| `/sanctuary/meditations/create/voice` | wired | Voice selection |
| `/sanctuary/meditations/create/audio` | wired | Audio mixing |
| `/sanctuary/meditations/create/review` | wired | Review |
| `/sanctuary/meditations/create/complete` | wired | Success screen |

### Rituals
| Path | Completeness | Description |
|------|--------------|-------------|
| `/sanctuary/rituals` | wired | List |
| `/sanctuary/rituals/recordings` | stub | Ritual recordings |
| `/sanctuary/rituals/[id]` | wired | Detail / player |
| `/sanctuary/rituals/[id]/edit` | wired | Edit metadata |
| `/sanctuary/rituals/[id]/edit-audio` | wired | Edit audio layers |
| `/sanctuary/rituals/create` | to_change | Redirects to init |
| `/sanctuary/rituals/create/init` | wired | Init step |
| `/sanctuary/rituals/create/goals` | wired | Goal selection |
| `/sanctuary/rituals/create/context` | wired | Emotional context |
| `/sanctuary/rituals/create/personalization` | wired | Deep personalization |
| `/sanctuary/rituals/create/script` | wired | AI-generated script |
| `/sanctuary/rituals/create/voice` | wired | Voice selection |
| `/sanctuary/rituals/create/audio` | wired | Audio mixing |
| `/sanctuary/rituals/create/review` | wired | Review |
| `/sanctuary/rituals/create/complete` | wired | Success screen |

### Marketplace
| Path | Completeness | Description |
|------|--------------|-------------|
| `/marketplace` | mock | Browse / discovery |
| `/marketplace/[id]` | mock | Item detail + player |
| `/marketplace/creator` | stub | Creator dashboard |

### Superadmin (internal only)
| Path | Completeness | Description |
|------|--------------|-------------|
| `/admin` | complete | Superadmin hub |
| `/admin/oracle` | complete | Oracle AI config |
| `/admin/users` | complete | User management |
| `/admin/waitlist` | complete | Waitlist dashboard |
| `/admin/ios-release` | complete | iOS release management |
| `/admin/content` | complete | Content overview |
| `/admin/onboarding/reset` | complete | Onboarding reset |
| `/system` | complete | System & schema overview |
| `/system/creation-steps` | complete | Creation pipeline step status |
| `/system/pipelines` | complete | Pipelines reference |
| `/system/audio` | complete | Audio & TTS reference |
| `/system/conversation` | complete | Conversation flow (LLM state machine) |
| `/system/schema` | complete | Schema live status |
| `/health` | complete | API health dashboard |
| `/showcase` | complete | Design system showcase |
| `/pages` | complete | Route registry |
| `/sitemap-view` | complete | Visual sitemap |
| `/updates` | complete | Updates index |
| `/updates/beta-readiness-implementation` | complete | Beta readiness guide |
| `/updates/beta-tester-recruitment` | complete | Beta tester guide |
| `/updates/audio-system-implementation` | complete | Audio system audit |
| `/updates/multilingual-i18n-implementation` | complete | i18n guide |
| `/updates/open-items` | complete | Open items before launch |

### Other
| Path | Description |
|------|-------------|
| `/auth/callback` | Supabase OAuth code exchange (route handler) |

---

## 3. Mobile App — Screen Map

### Root flow
- **Setup** (unauthenticated) → Landing
- **Auth** (unauthenticated) → Login, Signup, ForgotPassword, ResetPassword
- **Onboarding** (authenticated, needs onboarding) → 4 steps
- **Main** (authenticated, onboarding done) → Tabs + stack overlays

### Deep linking
Prefixes: `waqup://`, `https://waqup.app`, `https://www.waqup.app`  
Paths: `auth/login`, `auth/signup`, `auth/forgot-password`, `auth/reset-password`, `onboarding`, `onboarding-flow`, `main`, `showcase`, `health`

### Auth stack
| Screen | Component | Purpose |
|--------|-----------|---------|
| Login | LoginScreen | Email / Google sign-in |
| Signup | SignupScreen | Email / Google sign-up |
| ForgotPassword | ForgotPasswordScreen | Request reset link |
| ResetPassword | ResetPasswordScreen | Reset with token |

### Onboarding stack (4 steps)
| Screen | Component | Purpose |
|--------|-----------|---------|
| OnboardingIntention | OnboardingIntentionScreen | Set intention |
| OnboardingProfile | OnboardingProfileScreen | Profile (params: intention) |
| OnboardingPreferences | OnboardingPreferencesScreen | Preferences |
| OnboardingGuide | OnboardingGuideScreen | Final guide |

### Main tabs (5 tabs)
| Tab | Screen | Purpose |
|-----|--------|---------|
| Home | HomeScreen | Greeting, quick create by type, "Practice is free" CTA |
| Library | LibraryScreen | User content list, filters, search |
| Marketplace | MarketplaceScreen | "Discover" — browse content |
| Speak | SpeakScreen | Voice oracle chat (Oracle API) |
| Profile | ProfileScreen | User info, Q balance, Settings, Progress, Reminders, logout |

### Stack overlays (over tabs)
| Screen | Component | Purpose |
|--------|-----------|---------|
| ContentDetail | ContentDetailScreen | View and play content |
| ContentEdit | ContentEditScreen | Edit content |
| CreateMode | CreateModeScreen | Choose creation mode (form / chat / agent) |
| ContentCreate | ContentCreateScreen | Form / chat / agent creation flow |
| Credits | CreditsScreen | Q credit balance |
| Progress | ProgressScreen | Practice history / streaks |
| Settings | SettingsScreen | Account, voice, privacy |
| Reminders | RemindersScreen | Daily reminders |

### Other root screens
| Screen | Purpose |
|--------|---------|
| Setup | SetupScreen — Landing with feature cards, Get Started / Sign In |
| Showcase | ShowcaseScreen — Design system demo |
| Health | HealthScreen — Health-related |

### Mobile — Implemented vs missing
| Area | Status |
|------|--------|
| Auth, Setup | Implemented |
| Onboarding (4 steps) | Implemented |
| Main tabs, Speak, Library | Implemented |
| ContentCreateScreen (form + conversation + agent) | Implemented |
| Credits display, useCreditBalance (Realtime) | Implemented |
| Stripe checkout UI | **Not implemented** |
| Full content detail/edit/edit-audio | **Not implemented** (basic flows) |
| Marketplace | **Not implemented** |

---

## 4. API Routes (Web)

From `packages/web/app/api/`:

| Area | Route | Purpose |
|------|-------|---------|
| **Auth** | `auth/override` | Auth override (internal) |
| | `auth/callback` | OAuth callback (Supabase) |
| **AI** | `ai/tts` | TTS generation |
| | `ai/render` | AI render (audio pipeline) |
| | `ai/agent` | Agent API |
| | `conversation` | Conversational creation |
| | `generate-script` | Script generation |
| **Oracle** | `oracle/route` | Oracle endpoint |
| | `oracle/session` | Oracle session management |
| | `oracle/tts` | Oracle TTS |
| | `oracle/stream` | Oracle streaming |
| **Orb** | `orb/config` | Orb configuration |
| | `orb/chat` | Orb chat |
| **Voices** | `voices` | List voices |
| | `voices/[id]` | Voice CRUD |
| | `voices/[id]/samples` | Voice samples |
| | `voices/[id]/preview` | Voice preview |
| | `voice` | Voice operations |
| | `voice/create` | Create voice |
| | `voice/samples` | Voice samples |
| | `voice/preview` | Voice preview |
| **Audio** | `audio/signed-url` | Signed URLs for audio |
| | `audio/upload-recording` | Upload user recording |
| | `audio/normalize` | Audio normalization |
| | `audio/atmosphere-presets` | Atmosphere presets |
| | `audio/atmosphere-available` | Atmosphere availability |
| | `audio/atmosphere-status` | Atmosphere status |
| | `audio/binaural-presets` | Binaural presets |
| **Credits** | `credits/welcome` | Welcome credits grant |
| **Progress** | `progress/stats` | Progress stats |
| | `reflection` | Reflection entries |
| **Stripe** | `stripe/checkout/credits` | Credit pack checkout |
| | `stripe/checkout/subscription` | Subscription checkout |
| | `stripe/portal` | Customer portal |
| | `stripe/webhook` | Stripe webhook handler |
| | `stripe/price-ids` | Price IDs |
| **Marketplace** | `marketplace/items` | Marketplace items |
| | `marketplace/share` | Share to marketplace |
| | `marketplace/proposals` | Creator proposals |
| **Admin** | `admin/users` | User management |
| | `admin/waitlist` | Waitlist CRUD |
| | `admin/waitlist/[id]` | Waitlist item |
| | `admin/content` | Content overview |
| | `admin/schema` | Schema status |
| | `admin/onboarding/reset` | Reset onboarding |
| | `admin/elevenlabs/voices` | ElevenLabs voices |
| **Other** | `health` | Health check |
| | `feedback` | User feedback |
| | `transcribe` | Transcription |
| | `waitlist` | Waitlist signup |
| | `waitlist/count` | Waitlist count |
| | `founding-members` | Founding members |
| | `founding-members/remaining` | Remaining slots |
| | `investors/contact` | Investor contact |
| | `account/delete` | Account deletion |
| | `webhooks/revenuecat` | RevenueCat webhook |
| | `webhooks/meta` | Meta webhook |
| | `instagram/stats` | Instagram stats |
| | `dev/seed` | Dev seed (internal) |

---

## 5. Shared Package — Services and Types

### Services (factory-based; take Supabase client)
- **supabase/**: `client` (createSupabaseClient), `content` (CRUD for content_items), `credits`, `reminders`, `progress`, `voices`, `storage` (uploadAudio, getAudioSignedUrl, deleteAudio)
- **auth/**: `createAuthService(client)` — login, signup, logout, getCurrentSession, getCurrentUser, requestPasswordReset, resetPassword, resendVerificationEmail, onAuthStateChange
- **ai/**: `openai` (generateScript, generateConversationReply), `elevenlabs` (createInstantVoice, editVoice, getVoice, textToSpeech), `orb-chat` (sendOrbMessage)

**Payments**: Not implemented (commented out in services index).

### Stores
- **authStore** (Zustand): `user`, `session`, `isLoading`, `error`, `isInitialized`; actions: login, signup, logout, requestPasswordReset, resetPassword, etc.
- **uiStore**: Not implemented (stubbed)

### Types
- **ContentItem**: id, type, title, description, script, duration, status, audio_url, voice_url, ambient_url, binaural_url, audio_settings (JSONB), voice_type, etc.
- **ContentItemType**: `'affirmation' | 'ritual' | 'meditation'`
- **ContentStatus**: `'draft' | 'processing' | 'ready' | 'failed'`
- **VoiceType**: `'elevenlabs' | 'tts' | 'recorded' | 'ai'`
- **AudioSettings**: volumeVoice, volumeAmbient, volumeBinaural, volumeMaster, binauralPresetId, atmospherePresetId, fadeIn, fadeOut
- **CreditTransaction**, **UserReminder**, **ProgressStats**, **UserVoice**, etc.

### Schemas (Zod)
- **auth**: loginSchema, signupSchema, forgotPasswordSchema, resetPasswordSchema
- **content**: contentTypeSchema, intentSchema, contextSchema, personalizationSchema, affirmationCreationSchema, meditationCreationSchema, ritualCreationSchema, scriptGenerationSchema, createContentSchema

### Constants
- **content-costs**: CONTENT_CREDIT_COSTS, AI_MODE_COSTS, getCreditCost(), API_ROUTE_COSTS, RECORDING_LIMITS_SEC
- **credit-packs**: Credit pack definitions
- **ai-models**: AI_MODELS (script, conversation, orb, agent, TTS)
- **plans**: Pricing / Stripe plans
- **binaural-presets**, **atmosphere-presets**
- **content-type-colors**, **content-type-copy**
- **product-copy**: Product copy

### Hooks
- **useContent**: createContentHooks(contentService) — React Query for content CRUD
- **useCreditBalance**: createUseCreditBalance(supabase, channelName) — Realtime subscription for credit balance

---

## 6. Database Schema (Key Tables)

From `supabase/migrations/` and `supabase/scripts/repair_missing_schema.sql`:

| Table | Purpose |
|-------|---------|
| **content_items** | User content (affirmations, meditations, rituals). Columns: id, user_id, type, title, description, script, duration, status, last_played_at, audio_url, voice_url, ambient_url, binaural_url, voice_type, audio_settings (JSONB), play_count, share_count, is_elevated, is_listed, etc. |
| **credit_transactions** | Credit balance changes (amount, description). Used for welcome credits, purchases, content creation deductions. |
| **profiles** / **user_profiles** | User metadata, ElevenLabs voice ID |
| **user_voices** | Cloned voices (IVC) |
| **practice_sessions** | Practice history, duration, content_id |
| **reflection_entries** | Reflection logs |
| **user_reminders** | Reminders CRUD |
| **oracle_sessions** | Voice Orb sessions (replies_total, replies_used, expires_at) |
| **marketplace_items** | Marketplace listing metadata |
| **marketplace_shares** | Share tracking |
| **subscriptions** | Stripe subscription state |
| **stripe_webhook_events** | Webhook idempotency |
| **waitlist_signups** | Waitlist signup form data |
| **iap_purchases**, **iap_products** | Mobile IAP (schema exists, no checkout UI) |
| **creator_proposals** | Creator marketplace proposals |
| **content_series**, **content_series_items** | Series grouping |
| **orb_config**, **user_orb_settings** | Orb configuration |
| **sanctuary_saves** | Sanctuary saves |
| **feedback** | User feedback |
| **investor_inquiries** | Investor contact form |

### Functions
- **deduct_credits(p_user_id, p_amount, p_description)** — Atomic credit deduction
- **consume_oracle_reply(p_session_id, p_user_id)** — Oracle session consumption

---

## 7. Content Creation Pipelines

Per content type, the step sequence:

### Affirmations
`init` → `intent` → `script` → `voice` → `audio` → `review` → `complete`

### Meditations
`init` → `intent` → `context` → `script` → `voice` → `audio` → `review` → `complete`

### Rituals
`init` → `goals` → `context` → `personalization` → `script` → `voice` → `audio` → `review` → `complete`

**Note**: Creation currently uses multi-step forms. Target is conversational (orb/speak as primary entry). `/create/conversation` and `/create/orb` exist but the create flow is not fully conversational yet.

---

## 8. Key Components (Web)

From `packages/web/src/components/`:

| Category | Components |
|----------|------------|
| **Shared** | PageShell, PageContent, GlassCard, AppLayout, PublicFooter, CreateProgressBar, ContentCreateLayout, WaitlistCTA, FoundingMemberModal, LanguageSwitcher, ThemeSelector, TestLoginButton |
| **Content** | ContentDetailPage, ContentEditPage, ContentListPage, ContentAudioStep, ContentScriptStep, ContentVoiceStep, ContentIntentStep, ContentContextStep, ContentPersonalizationStep, ContentReviewStep, ContentCompleteStep, ContentModeSelector, CreateFlowInitStep |
| **Audio** | AudioPage, AudioWaveform, VoiceOrb, RecordingWaveform |
| **Voices** | VoiceLibrary, VoiceCard, AddVoiceModal |
| **Marketplace** | ShareModal, CreatorGate, ElevatedBadge |
| **Auth** | AuthProvider |
| **Analytics** | AnalyticsProvider, GoogleAnalyticsTracker, CookieConsentBanner, SessionTracker |
| **UI** | Button, Input, Card, Badge, Typography, Icon, AvatarOrb, QCoin, EmptyState, Loading, ErrorBanner, Toast, Progress |
| **Onboarding** | OnboardingStepLayout, OnboardingSuperAdminLink |
| **Legal** | WellnessDisclaimer |
| **Gates** | SuperAdminGate, VoiceGate |

---

## 9. i18n

- **Locales**: `en`, `pt`, `es`, `fr`, `de`
- **Default**: `en` with `localePrefix: 'as-needed'` (no prefix for English)
- **Routing**: `next-intl` — all routes under `app/[locale]/`
- **Message namespaces**: `common`, `auth`, `legal`, `marketing`, `metadata`, `onboarding`, `pricing`, `settings`, etc.
- **Files**: `packages/web/messages/{locale}/{namespace}.json`

---

## 10. Implementation Gaps (Quick Reference)

| Platform | Gap |
|----------|-----|
| **Web** | Create flows not fully conversational (orb/speak as primary); Phase 7 API completeness; error/loading/empty states partial |
| **Mobile** | No Stripe checkout; partial onboarding; no full content detail/edit; no marketplace |
| **Shared** | No payments service; uiStore stubbed |

---

*End of context document*
