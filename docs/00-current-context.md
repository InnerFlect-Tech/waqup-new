# waQup — Current Context

**Purpose**: Standalone reference for the **built solution** — what exists on Web and Mobile today. Self-contained.

**Last Updated**: 2026-03-10

---

## 1. Business Overview

### What is waQup?

waQup is a **voice-first** wellness app for creating and practicing personalized **affirmations**, **guided meditations**, and **rituals**. Content is created through **conversation** (or forms) and practiced via **audio**.

### Product Principles

| Principle | Description |
|-----------|-------------|
| **Voice-first** | Audio is primary. Background playback, orb interface, own-voice recording (bypasses skepticism). |
| **Three content types** | Affirmations, Meditations, Rituals — non-interchangeable, distinct pipelines. |

| Type | Depth | Purpose |
|------|-------|---------|
| **Affirmation** | Shallow → medium | Cognitive re-patterning |
| **Meditation** | Medium | State induction |
| **Ritual** | Deepest | Identity encoding |
| **Conversation over forms** | Chat-like UI preferred; forms also available on mobile. |
| **Practice is free** | Unlimited replay. Credits consumed only for creation. |
| **User autonomy** | No manipulation, no pressure, easy exit. |

### Practice vs Creation Model

| Action | Credits |
|--------|---------|
| **Play content** | Free |
| **Create content** | Consumed |
| **Use Speak / Oracle** | Consumed |
| **Create voice (IVC)** | 50 Qs one-time |

---

## 2. Pricing

### Subscriptions

| Plan | Price | Credits | Billing |
|------|-------|---------|---------|
| **Starter** | €7 | 11 Qs | Weekly |
| **Growth** | €20 | 33 Qs | Monthly (7-day trial) |
| **Devotion** | €60 | 99 Qs | Monthly (14-day trial) |

### Credit Packs (One-time)

| Pack | Price | Credits |
|------|-------|---------|
| Spark | €6.99 | 70 Qs |
| Creator | €14.99 | 155 Qs |
| Flow | €29.99 | 316 Qs |
| Devotion | €59.99 | 668 Qs |

Credits do not expire.

### Credit Costs

| Content type | Form (base) | With AI voice |
|--------------|------------|---------------|
| Affirmation | 1 Q | 2 Q |
| Meditation | 2 Q | 4 Q |
| Ritual | 5 Q | 10 Q |

| Creation mode | Flat fee |
|---------------|----------|
| Form | 0 Q |
| Chat | 3 Q |
| Agent | 7 Q |

| API | Cost |
|-----|------|
| Conversation reply | 1 Q |
| Generate script | 2 Q |
| Oracle session | 1 Q |
| ElevenLabs TTS | 1 Q |
| New voice slot (IVC) | 50 Q |

---

## 3. Pipelines — What Is Built

### Web Route Structure (Locale-Aware)

All web routes live under `app/[locale]/` with `next-intl` (locales: en, pt, es, fr, de; default: en). `/` redirects to `/en`. Unprefixed `/sanctuary` and `/speak` rewrite to `/en/sanctuary`, `/en/speak`. See `docs/04-reference/16-route-map.md`.

### Pipeline Step Definition (Shared Config)

From `creation-steps.ts`, steps and which types they apply to:

| Step | Affirmation | Meditation | Ritual | Form route pattern |
|------|:-----------:|:----------:|:------:|--------------------|
| Intent | ✓ | ✓ | ✓ | `/{type}s/create/intent` |
| Context | — | ✓ | ✓ | `/{type}s/create/context` |
| Personalization | — | — | ✓ | `/{type}s/create/personalization` |
| Script | ✓ | ✓ | ✓ | `/{type}s/create/script` |
| Voice | ✓ | ✓ | ✓ | `/{type}s/create/voice` |
| Audio | ✓ | ✓ | ✓ | `/{type}s/create/audio` |
| Review | ✓ | ✓ | ✓ | `/{type}s/create/review` |

Rituals additionally have: `goals` page (`/rituals/create/goals`), `recordings` page.

### Web — Step-by-Step Routes (Built)

**Affirmations** (`/sanctuary/affirmations/create/`):
- `init` → type select, redirect
- `intent` → intent form
- `script` → `/api/generate-script`, AI script
- `voice` → ElevenLabs or record
- `audio` → `/api/ai/render`, volume sliders
- `review` → save to `content_items`
- `[id]/edit`, `[id]/edit-audio` — edit existing

**Meditations** (`/sanctuary/meditations/create/`):
- Same pattern + `context` step between intent and script
- `intent` → `context` → `script` → `voice` → `audio` → `review`

**Rituals** (`/sanctuary/rituals/create/`):
- Same pattern + `context` + `personalization` steps
- `intent` → `context` → `personalization` → `script` → `voice` → `audio` → `review`
- Extra: `goals` page, `recordings` page

**Audio step** (all types): Voice + ambient + binaural URLs; `content_items` has `voice_url`, `ambient_url`, `binaural_url`, `default_vol_*`.

### Mobile — ContentCreateScreen (Built)

- **Entry**: `ContentCreate` screen with params `contentType`, `mode`.
- **Modes**: `form` (Quick Form), `chat` (Guided Chat), `agent` (AI Agent).
- **Form**: Structured fields per type (title, goal/intention/identity, duration, etc.). Submits to `useCreateContent` (Supabase insert).
- **Chat**: `sendConversationMessage` → builds context → `generateScript` when ready. Shows transcript.
- **Agent**: User enters intent + context → `generateAgentScript` (7 Q flat) → script generated.
- **No step-by-step form flow** — single screen per mode. No voice/audio step on mobile; content saved with script only (or TTS if wired).
- **VoiceOrb** component used in chat/agent for visual feedback.

---

## 4. The Orb — What Is Built

### Two Orb Contexts

| Orb | Route/Screen | Purpose |
|-----|--------------|---------|
| **Create Orb** | Web: `/create/orb` | Voice-led content creation; converses through pipeline steps |
| **Speak Orb (Oracle)** | Web: `/speak` — Mobile: `SpeakScreen` | General voice AI — guidance, reflection, creation help |

### Create Orb (Web `/create/orb`)

- **Phases**: `type-select` → `gathering` → `generating-script` → `reviewing-script`.
- **Steps** (from `ALL_PIPELINE_STEPS`): intent, context (med/rit), personalization (rit), script, voice, audio, review.
- **Input**: Voice (Web Speech API) or text. Mic listens after AI speaks.
- **TTS**: `/api/oracle/tts` (ElevenLabs), config from `localStorage` (`elevenlabs-config`).
- **Output**: Orb animates to frequency data (mic when listening, TTS when speaking). Handoff to voice step via `saveCreationHandoff` (sessionStorage).
- **APIs**: `/api/oracle/tts`, `/api/generate-script`. Routes to `/sanctuary/{type}s/create/voice` when script ready.

### Speak Orb / Oracle (Web `/speak`)

- **Session**: `POST /api/oracle/session` — buys 1Q session with N replies (1/3, 2/6, 5/15).
- **Streaming**: `/api/oracle/stream` — SSE stream of assistant text + TTS chunks.
- **Input**: Web Speech API (voice) or text. Continuous listening when session has replies left.
- **TTS**: ElevenLabs streaming; plays through Web Audio API; orb reacts to frequency data.
- **Config**: `localStorage` — `elevenlabs-config` (voice, model, stability, etc.), `oracle-config` (system prompt, temperature).
- **Credit balance** displayed; `useCreditBalance`; auto-refill option.

### Speak Orb (Mobile SpeakScreen)

- **Built**: `VoiceOrb` component, expo-av recording. Tap to start/stop listening.
- **Not built**: No Oracle API call. Stops recording → 1.5s placeholder delay → returns to idle.
- **States**: idle, requesting, listening, processing, speaking, error.

---

## 5. Marketplace — What Is Built

### Database

| Table | Columns | Purpose |
|-------|---------|---------|
| `marketplace_items` | id, content_item_id, creator_id, is_elevated, is_listed, play_count, share_count, listed_at, updated_at | One row per listed content |
| `marketplace_shares` | id, content_item_id, sharer_user_id, platform, shared_at | Share events |

**Functions**:
- `record_share_and_award_credit(p_content_item_id, p_platform, p_sharer_user_id)` — inserts share, increments `share_count`, awards +1 Q to creator.
- `increment_play_count(p_content_item_id)` — bumps play_count for listed items.

**View**: `creator_profiles_view` — creator_id, published_count, total_plays, total_shares.

### APIs

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/marketplace/items` | GET | List items; params: type, elevated, sort (trending/recent/top), limit, offset. Joins `content_items`. |
| `/api/marketplace/items` | POST | Publish: body `{ contentItemId }`. Upserts `marketplace_items`, sets `is_listed=true`. |
| `/api/marketplace/share` | POST | Body `{ contentItemId, platform }`. Calls `record_share_and_award_credit`. |

### Web UI

- **`/marketplace`**: Filter (all, affirmation, meditation, ritual), sort (trending, recent, top), search. Grid of cards. Elevated section. Links to `/marketplace/[id]`.
- **`/marketplace/[id]**: Detail page, `ShareModal` — share links (X, WhatsApp, etc.); on share, `POST /api/marketplace/share`. "Creator earns a credit for each share."
- **`/marketplace/creator`**: Creator dashboard (stub). `CreatorGate` checks if user has published content.
- **`ShareModal`**: Platform options; copies link; calls share API.

### Mobile

- Marketplace not implemented.

---

## 6. Design System

### Default Theme: Mystical Purple

| Token | Value |
|-------|-------|
| background.primary | #000000 |
| accent.primary | #9333EA |
| accent.secondary | #4F46E5 |
| accent.tertiary | #A855F7 |
| text.primary | #FFFFFF |
| text.secondary | rgba(255,255,255,0.7) |
| glass.light | rgba(255,255,255,0.05) |
| glass.border | rgba(255,255,255,0.10) |
| gradients.primary | linear-gradient(to right, #9333EA, #4F46E5) |

### Spacing, Radius, Typography

- Spacing: xs 4, sm 8, md 16, lg 24, xl 32, xxl 48, xxxl 64.
- Border radius: sm 8, md 12, lg 16, xl 24, full 9999.
- Typography: h1 32/300, h2 24/300, h3 20/300, body 16/400, caption 14, small 12.
- Layout: CONTENT_MAX_WIDTH 1280px, NAV_HEIGHT 64px, PAGE_TOP_PADDING 96px.

### Glass Morphism

- Card: `glass.light` bg, `glass.border`, `backdropFilter: blur(20px)`, `borderRadius: 24px`.

---

## 7. Tech Stack & Architecture

### Monorepo

| Package | Purpose |
|---------|---------|
| shared | Business logic, types, services, theme, constants, hooks |
| web | Next.js 16, App Router, PWA |
| mobile | Expo 54, React Native (iOS, Android) |

### Backend

| Service | Use |
|---------|-----|
| Supabase | Auth, PostgreSQL, Storage (audio), Realtime (credits) |
| OpenAI | GPT-4o-mini (conversation, scripts), GPT-4 (agent) |
| ElevenLabs | TTS, IVC |
| Stripe | Subscriptions, credit packs, Customer Portal |

### Provider Coverage (Web & Mobile)

**Web**: `QueryClientProvider`, `ThemeProvider`, `AuthProvider` live in `AppProviders` inside `app/[locale]/layout.tsx`. Root-level `/sanctuary` and `/speak` would bypass providers; `next.config.js` rewrites them to `/en/sanctuary`, `/en/speak` so they use the locale layout. Verified routes: `/sanctuary`, `/sanctuary/*`, `/speak`, `/speak/*`.

**Mobile**: `PersistQueryClientProvider` wraps the app at `App.tsx` root. All screens (RootNavigator → MainNavigator, etc.) are children; no split routes. Screens using `useContent`, `useCreditBalance`, `useContentItem` are covered.

**Verification**:
- Web: run `npm run dev:web`, log in, open `/sanctuary` and `/speak`; no "No QueryClient set" in console. E2E: `npm run test:e2e` (requires `NEXT_PUBLIC_ENABLE_TEST_LOGIN=true`, override credentials in `.env.local`).
- Mobile: run `npm run dev:mobile`, open Home, Library, Credits; no provider errors.

### Key Tables

| Table | Purpose |
|-------|---------|
| profiles | User, stripe_customer_id |
| content_items | All content; voice_url, ambient_url, binaural_url, default_vol_* |
| credit_transactions | Credits/debits |
| user_voices | ElevenLabs IVC slots |
| marketplace_items | Listings, play_count, share_count |
| marketplace_shares | Share events |
| subscriptions | Plan subs |

---

## 8. Web — What Is Built

### Routes (Summary)

| Area | Routes | Status |
|------|--------|--------|
| Marketing | /, /waitlist, /join, /get-qs, /how-it-works, /pricing | Live |
| Auth | /login, /signup, /forgot-password, /reset-password, /confirm-email | Live |
| Main | /home, /library, /create, /create/orb, /create/conversation, /profile, /speak | Live |
| Marketplace | /marketplace, /marketplace/[id], /marketplace/creator | Wired (creator stub) |
| Sanctuary | hub, credits, credits/buy, credits/transactions, plan, voice, referral, progress, settings, reminders, learn | Mix (referral live) |
| Content | /sanctuary/{affirmations,meditations,rituals} + create flows + [id] + edit + edit-audio | Wired |
| Play | /play/[id] | Public player |
| Onboarding | /onboarding/* | Placeholder |

### APIs (Built)

- Auth: Supabase; `/auth/callback`. Protected routes (library, create, profile, sanctuary, speak, marketplace) enforced server-side in `proxy.ts` (Supabase `getUser`); `AuthProvider` handles client-side fallback, `access_granted`, E2E override.
- Content: CRUD via Supabase client.
- Script: `/api/generate-script`, `/api/ai/agent`.
- TTS: `/api/ai/tts`, `/api/oracle/tts`, `/api/ai/render`.
- Oracle: `/api/oracle/session`, `/api/oracle/stream`.
- Voice: `/api/voice`, `/api/voice/create`, `/api/voice/samples`, `/api/voice/preview`, `/api/voices`.
- Marketplace: `/api/marketplace/items`, `/api/marketplace/share`.
- Stripe: `/api/stripe/checkout/subscription`, `/api/stripe/checkout/credits`, `/api/stripe/portal`, webhook.
- Credits: `deduct_credits` RPC, Realtime on `credit_transactions`.

---

## 9. Mobile — What Is Built

### Screens

| Screen | Status | Notes |
|--------|--------|------|
| Setup | Live | Splash/onboarding entry |
| Login, Signup, ForgotPassword, ResetPassword | Live | Auth stack |
| Home, Library, Create, Profile | Live | Main tabs |
| ContentCreate | Live | Form, chat, agent modes; no voice/audio step |
| LibraryScreen | Live | FlatList, search; fetches content |
| SpeakScreen | Partial | VoiceOrb, recording; no Oracle API |
| CreditsScreen, ProgressScreen, SettingsScreen, RemindersScreen | Live | Sanctuary sub |
| ContentDetailScreen | Partial | Exists; full flow? |
| ShowcaseScreen | Dev | Component showcase |

### Not Built on Mobile

- Stripe checkout
- Marketplace
- Step-by-step create flows (intent → context → script → voice → audio → review)
- Oracle/Speak API integration
- Content [id] edit, edit-audio
- Full onboarding (profile, preferences, guide)

### Shared with Web

- `useCreditBalance` (Supabase, Realtime)
- Theme (format.ts adapters for RN)
- Content types, constants, creation costs
- VoiceOrb component (visual states)

---

## 10. Product Copy (Canonical)

**Practice is free**: *"Practice is free. Replay your content as often as you like. Qs are only used when you create something new."*

**Qs**: *"Qs are credits used to create new content. You earn them when you sign up and can purchase more. Listening to and practicing your existing content is always 100% free. Qs are only spent during creation."*

**Orb**: *"The Orb is your voice AI. Speak to it — ask for guidance, reflect, or get help creating content. Each reply uses Qs from your balance."*

**Voice cloning**: *"Record 60 seconds of your voice. waQup clones it — or choose from professional voices. Your choice."*
