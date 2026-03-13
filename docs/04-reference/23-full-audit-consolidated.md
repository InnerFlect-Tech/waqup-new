# waQup — Full Audit Consolidated

**Purpose**: Single document containing all five system audits. No code changes—documentation only.

**Last Updated**: 2026-03-13

---

## Contents

1. [Technical Audit](#1-technical-audit)
2. [Mobile UX Audit](#2-mobile-ux-audit)
3. [Audio Engine Deep Scan](#3-audio-engine-deep-scan)
4. [State Management Map](#4-state-management-map)
5. [Component Inventory](#5-component-inventory)

---

# 1. Technical Audit

**Scope**: Framework, monorepo structure, routing, audio architecture, ritual pipeline, orb, auth/DB, APIs, mobile UI, risks.

---

## 1.1 Monorepo & Framework

| Platform | Framework | Version |
|----------|-----------|---------|
| Web | Next.js | 16.x (App Router) |
| Mobile | React Native + Expo | SDK 54 |
| Shared | — | `packages/shared` (business logic, types, services, stores) |

**Structure**:
```
waqup-new/
├── packages/
│   ├── shared/   # Services, stores, types, schemas, constants
│   ├── web/      # Next.js app
│   └── mobile/   # Expo/React Native app
├── docs/
└── rebuild-roadmap/
```

---

## 1.2 Routing

**Web**:
- Next.js App Router under `app/[locale]/`
- Locales: en, pt, es, fr, de (next-intl)
- Route groups: (auth), (main), (marketing), (onboarding), (home), sanctuary
- Key routes: `/`, `/how-it-works`, `/pricing`, `/login`, `/signup`, `/sanctuary/*`, `/create`, `/create/conversation`, `/create/orb`, `/speak`, `/marketplace`, `/play/[id]`

**Mobile**:
- React Navigation v7 (Native Stack + Bottom Tabs)
- Stack: Root → Auth | Main | Onboarding | Setup
- Main tabs: Home, Library, Create, Speak, Profile
- Sanctuary: nested under Profile or separate stack

---

## 1.3 Audio Architecture

| Platform | Playback | Recording |
|----------|----------|-----------|
| Web | Web Audio API (AudioContext, GainNode, AnalyserNode) | MediaRecorder (webm/mp4) |
| Mobile | expo-av (Audio.Sound) | expo-av Recording (m4a) |

- **TTS**: ElevenLabs (Instant Voice Cloning)
- **Binaural**: Web = oscillators; Mobile = pre-rendered files
- **Atmosphere**: Supabase Storage `atmosphere` bucket
- **Storage**: `audio` bucket (recordings, TTS output)

---

## 1.4 Ritual Pipeline

Three content types (affirmation, meditation, ritual). Shared steps: Intent → Context (ritual) → Personalization (ritual) → Script → Voice → **Audio page** → Review.

- **Form flow**: `/sanctuary/rituals/create/*` — ContentCreationContext
- **Orb/Chat flow**: `/create/orb`, `/create/conversation` — local state + `saveCreationHandoff()` to sessionStorage → navigate to voice step
- **Audio page**: Volumes, waves, preview, mix (shared across all types)

---

## 1.5 Orb

- **Web**: `packages/web/src/components/audio/VoiceOrb.tsx` — canvas-based visualization, Web Audio AnalyserNode for frequency data
- **Mobile**: `packages/mobile/src/components/audio/VoiceOrb.tsx` — Reanimated
- **Speak page**: VoiceOrb for Oracle/conversation UI
- **Create/orb**: Type selection + conversation + script generation

---

## 1.6 Auth & Database

- **Auth**: Supabase Auth v2 (email, Google OAuth), authStore (Zustand), AuthProvider
- **DB**: Supabase PostgreSQL, RLS
- **Tables**: users, content_items, credit_transactions, profiles, voice_samples, etc.
- **Storage**: audio, atmosphere, recordings buckets

---

## 1.7 APIs

| API | Purpose |
|-----|---------|
| `/api/ai/render` | ElevenLabs TTS, credit deduction |
| `/api/ai/agent` | Conversation/script generation |
| `/api/transcribe` | OpenAI Whisper (SpeakScreen/Oracle) |
| `/api/audio/upload-recording` | User voice upload |
| `/api/audio/signed-url` | Signed playback URLs |
| Stripe webhooks | Credits, subscriptions |

---

## 1.8 Mobile UI

- Screens: Auth, Setup, Onboarding, Home, Library, Create, Speak, Profile, Sanctuary sub-pages (Credits, Progress, Settings, Reminders)
- ContentCreateScreen: form + chat + agent modes
- ContentDetailScreen: uses `useAudioPlayer` directly (no AudioPlayer component)
- No mini-player; no global playback state

---

## 1.9 Risks

| Risk | Detail |
|------|--------|
| iOS Safari | Web AudioContext must resume in user gesture |
| Binaural | Mobile has no oscillator API; requires pre-rendered files |
| Signed URLs | 7-day expiry; playback may fail if stale |
| Background | Web loses AudioContext when tab backgrounded; mobile has `staysActiveInBackground` |
| Test login | TestLoginButton must never show in production |
| Multiple creation entry points | Form, Chat, Orb — different state models; handoff via sessionStorage |

---

# 2. Mobile UX Audit

**Scope**: Navigation, Home screen, ritual/content player, mini player, record flow, create flow, component reuse, UX issues.

---

## 2.1 Navigation

| Element | Implementation |
|---------|----------------|
| **5 tabs** | Home, Library, Create, Speak, Profile |
| **Stack** | Auth, Main, Onboarding, Setup |
| **Sanctuary** | CreditsScreen, ProgressScreen, SettingsScreen, RemindersScreen (nested) |
| **Header** | React Navigation header; custom `Header` component exists but **not used** |
| **BottomSheet** | Component exists but **not used** |

---

## 2.2 Home Screen

- Content type shortcuts (affirmation, meditation, ritual)
- Recent/popular content
- Navigation to create, library, speak

---

## 2.3 Content / Ritual Player

| Aspect | Implementation |
|--------|----------------|
| **Screen** | ContentDetailScreen |
| **Playback** | useAudioPlayer (expo-av) — three Sound instances (voice, ambient, binaural) |
| **UI** | Scrubber, play/pause, volume per layer |
| **Note** | ContentDetailScreen uses useAudioPlayer directly; **AudioPlayer component not used** |
| **Volume** | Local state; no profile persistence on mobile |

---

## 2.4 Mini Player

| Status | Detail |
|--------|--------|
| **Missing** | No mini-player; no "now playing" bar |
| **Impact** | Leaving ContentDetailScreen stops playback; no cross-screen continuity |
| **Web** | Same — each player instance isolated |

---

## 2.5 Record Flow

| Component | Status |
|-----------|--------|
| **AudioRecorder** | `packages/mobile/src/components/audio/AudioRecorder.tsx` |
| **Usage** | **Not wired** into any creation flow |
| **SpeakScreen** | Uses expo-av Recording for Oracle voice input → `/api/transcribe` |
| **Create flow** | Mobile create uses ElevenLabs TTS; no own-voice recording path |

---

## 2.6 Create Flow

| Mode | Implementation |
|------|----------------|
| **Form** | ContentCreateScreen with form steps |
| **Chat** | Conversation UI with messages |
| **Agent** | Agent-style generation |
| **State** | Local useState; **no ContentCreationContext** on mobile |
| **Handoff** | N/A — mobile does not use sessionStorage handoff like web |

---

## 2.7 Component Reuse

| Shared | Platform-specific |
|--------|-------------------|
| UI primitives (Typography, Button, Card, Input, Loading, etc.) from `@waqup/shared` or platform `@/components` | Screen layouts, navigation |
| ContentCreateScreen (mobile) is self-contained | Web uses ContentCreationContext |
| useAudioPlayer (mobile) vs useWebAudioPlayer (web) | Different APIs |

---

## 2.8 UX Issues

| Issue | Detail |
|-------|--------|
| No mini-player | Playback stops on navigate |
| AudioRecorder unused | Own-voice recording not available in mobile create |
| AudioPlayer unused | ContentDetailScreen reimplements player UI with useAudioPlayer |
| Header/BottomSheet unused | Orphaned layout components |
| Volume persistence | Mobile has no pref_vol_* in profiles |
| ThemeSelector | Removed from main app; showcase only (web) |

---

## 2.9 Mobile UI Audit (Device / Layout)

**Device matrix**:

| Device | Width (px) | Height (px) | Category |
|--------|------------|-------------|----------|
| iPhone SE (2nd/3rd) | 375 | 667 | Small |
| iPhone 13 mini | 375 | 812 | Small |
| iPhone 13 / 14 / 15 | 390 | 844 | Standard |
| iPhone 14 Pro / 15 Pro | 393 | 852 | Standard |
| iPhone 14 Pro Max / 15 Pro Max | 430 | 932 | Large |
| Pixel 7 | 412 | 915 | Standard |
| Pixel 7 Pro | 412 | 915 | Standard |
| Samsung Galaxy S23 | 360 | 780 | Small (Android) |
| Android small | 320–360 | 640–780 | Small |

**Viewport targets for testing**: 320px (minimum), 375px (iPhone SE), 390px (iPhone 14), 414px (iPhone Plus legacy), 430px (Pro Max), 480px (footer single-column breakpoint).

**Safe area**:
- Web: `NAV_TOP_OFFSET` uses `env(safe-area-inset-top)`; AppLayout header uses `paddingTop: max(spacing.sm, env(safe-area-inset-top))`; viewport `width: device-width`, `initialScale: 1`.
- Native mobile: SafeAreaProvider at root in App.tsx; Screen, BottomSheet, Toast, Container use `useSafeAreaInsets()`.

**Overflow and layout**:

| Location | Property | Risk |
|----------|----------|------|
| html, body | overflow-x: hidden | Intentional |
| PageShell | overflowX: hidden | May clip wide content |
| Library cards | overflow: hidden | Long titles truncated |
| Phone mockups (how-it-works, launch) | 270×540 fixed | Overflows on &lt;375px — fixed (responsive min(270px, 85vw)) |
| Admin/users table | minWidth: 700, overflowX: auto | Expected |

**Touch targets**:

| Component | minHeight/Size | Status |
|-----------|----------------|--------|
| Button md/lg | 44px / 52px | OK |
| Input | 44px | OK |
| Icon-only | 44px | OK |
| BottomSheet handle | 40×4 | Acceptable |

**Typography** (shared tokens): Body 16px/24px line-height; Caption 14px/20px; Small 12px/16px; minimum readable on mobile 14px for secondary text.

**High-risk pages (web)**: How It Works, Launch — phone mockup overflow fixed (responsive min(270px, 85vw)); Speak — fixed bottom panel 220px fixed (min(220px, 35vh)); Create/Conversation — height 100vh traps fixed (minHeight 100dvh); Library — card overflow uses WebkitLineClamp + ellipsis.

**Viewport E2E tests**: Playwright at `packages/web/e2e/mobile-viewport.spec.ts` verifies landing, how-it-works, login at 375px/390px. Run `npm run test:e2e:install` then `npm run test:e2e`.

**Android vs iOS**: KeyboardAvoidingView (padding iOS vs height Android) — implemented; shadows (elevation on Android) — implemented in format.ts; back button — RN handles; verify nested modals.

---

# 3. Audio Engine Deep Scan

**Purpose**: Maps the complete audio architecture across web and mobile.

---

## 3.1 Playback Engine

### Web (`packages/web/src/hooks/useWebAudioPlayer.ts`)

| Aspect | Implementation |
|--------|----------------|
| **API** | Web Audio API (AudioContext, BufferSource, GainNode, AnalyserNode) |
| **Graph** | Voice → voiceGain → analyser → masterGain; Ambient → ambientGain → masterGain; Binaural → binauralGain → masterGain; masterGain → destination |
| **Lazy init** | AudioContext created on first `play()` (user gesture) for iOS Safari compatibility |
| **Position tracking** | `setInterval(250ms)` to reduce CPU on mobile |
| **Voice end** | Ambient loop explicitly stopped when voice track ends |

### Mobile (`packages/mobile/src/components/audio/useAudioPlayer.ts`)

| Aspect | Implementation |
|--------|----------------|
| **API** | expo-av (`Audio.Sound`) |
| **Architecture** | Three separate Sound instances (voice, ambient, binaural); no shared graph |
| **Mode** | `playsInSilentModeIOS: true`, `staysActiveInBackground: true`, `shouldDuckAndroid: true` |
| **Position** | `onPlaybackStatusUpdate` callback with `positionMillis` / `durationMillis` |

---

## 3.2 Voice Recording System

### Web (`packages/web/src/components/content/ContentVoiceStep.tsx`)

| Aspect | Implementation |
|--------|----------------|
| **API** | MediaRecorder |
| **MIME detection** | `audio/webm;codecs=opus` → `audio/webm` → `audio/mp4` (Safari fallback) |
| **Flow** | `getUserMedia` → MediaRecorder → `ondataavailable` → Blob → `uploadRecording()` |
| **Upload** | `POST /api/audio/upload-recording` (multipart/form-data) |
| **Storage path** | `recordings/{userId}/{contentId}.webm|mp4` (Supabase `audio` bucket) |
| **Result** | Signed URL returned; stored in ContentCreationContext.ownVoiceUrl |

### Mobile

| Component | Location | Usage |
|-----------|----------|-------|
| **AudioRecorder** | `packages/mobile/src/components/audio/AudioRecorder.tsx` | expo-av Recording; states: idle → recording → recorded → playing → uploading |
| **Orphaned** | — | Not wired into any creation flow; mobile create uses ElevenLabs TTS |
| **SpeakScreen** | `packages/mobile/src/screens/main/SpeakScreen.tsx` | Uses expo-av Recording for Oracle voice input; uploaded to `/api/transcribe` |

---

## 3.3 Binaural Frequency Generation

### Web (`packages/web/src/hooks/useBinauralEngine.ts`)

| Aspect | Implementation |
|--------|----------------|
| **Method** | Two sine oscillators (left/right), panned hard L/R |
| **Formula** | Left = carrier + beat/2; Right = carrier - beat/2 |
| **Connection** | Oscillators → StereoPanner → binauralGain (from useWebAudioPlayer) |
| **Presets** | `packages/shared/src/constants/binaural-presets.ts`: delta (2Hz), theta (6Hz), alpha (10Hz), beta (15Hz), gamma (40Hz); carrier 200Hz |
| **Activation** | Starts when `isPlaying=true` and preset ≠ 'none'; stops on pause/unmount |

### Mobile

| Aspect | Implementation |
|--------|----------------|
| **Method** | Pre-rendered file via `layers.binauralUrl` (expo-av Sound) |
| **No oscillators** | React Native has no Web Audio API; binaural must come from files or a native module |
| **Gap** | If `binauralUrl` is null, binaural layer is silent—no runtime generation |

---

## 3.4 Atmosphere Sound Playback

### Web

| Aspect | Implementation |
|--------|----------------|
| **Source** | Supabase Storage `atmosphere` bucket (public): `atmosphere/{id}.mp3` |
| **Resolution** | `packages/web/src/utils/atmosphere.ts` — `resolveAtmosphereUrl(presetId)` builds URL from env |
| **Presets** | `packages/shared/src/constants/atmosphere-presets.ts`: rain, forest, ocean, white-noise |
| **Playback** | Loaded as ArrayBuffer, decoded in AudioContext, looped via BufferSource with `loop: true` |
| **Fallback** | If preset.fileUrl is null or decode fails, atmosphere layer is silent (non-fatal) |

### Mobile

| Aspect | Implementation |
|--------|----------------|
| **Source** | Same URL resolution if available; loaded via `Audio.Sound.createAsync({ uri })` |
| **Loop** | `isLooping: true` on expo-av Sound |

---

## 3.5 Audio Mixing Approach

### Web (useWebAudioPlayer)

```
Voice ──► voiceGain ──► analyser ──► masterGain ──► destination
                                             ▲
Ambient ──► ambientGain ──────────────────────┘
                                             ▲
Binaural ──► binauralGain (useBinauralEngine) ─┘
```

- **Per-layer gain**: voiceGain, ambientGain, binauralGain
- **Master bus**: masterGain
- **Volume sync**: `setTargetAtTime(value, t, 0.01)` for smooth changes (avoids clicks)
- **Shared types**: `AudioVolumes` { voice, ambient, binaural, master } 0–100

### Mobile

- **Per-sound volume**: Each Sound has `setVolumeAsync(vol)` where vol = (layer/100) × (master/100)
- **No shared bus**: Volumes applied per Sound; no single master mix node
- **Same schema**: `AudioVolumes` from shared types

---

## 3.6 Volume Control Architecture

| Level | Web | Mobile |
|-------|-----|--------|
| **State** | `useState` in useWebAudioPlayer | `useState` in useAudioPlayer |
| **Persistence** | `profiles.pref_vol_*` (AudioPage loads/saves via Supabase) | Local state only; no profile persistence |
| **UI** | Sliders in AudioPage, ContentAudioStep | VolumeSlider in AudioPlayer (but ContentDetailScreen does not use AudioPlayer—no volume UI) |
| **Default** | `DEFAULT_VOLUMES`: voice 80, ambient 40, binaural 30, master 100 |

---

## 3.7 Mobile Compatibility Risks

| Risk | Detail |
|------|--------|
| **iOS Safari** | Web AudioContext must be resumed in user gesture stack |
| **Binaural** | Mobile has no oscillator-based binaural; requires pre-rendered files or native module |
| **MediaRecorder** | Web-only; mobile uses expo-av Recording, different format (m4a) |
| **Signed URLs** | 7-day expiry; mobile playback may fail after a week if URL not refreshed |
| **Background** | Mobile expo-av has `staysActiveInBackground: true`; Web loses AudioContext when tab backgrounded |
| **Atmosphere files** | If atmosphere bucket files not uploaded, preset resolves to null; both platforms get silent layer |

---

## 3.8 Audio Buffering Strategy

### Web

| Phase | Behavior |
|-------|----------|
| **Fetch** | Eager `fetch(layers.voiceUrl)` → `arrayBuffer()` on URL change |
| **Decode** | Temp AudioContext for duration peek; full decode in buildGraph (lazy, on first play) |
| **Caching** | Raw ArrayBuffers held in refs; decoded AudioBuffers in refs |
| **Cleanup** | On unmount: close AudioContext, null refs |

### Mobile

| Phase | Behavior |
|-------|----------|
| **Load** | `Audio.Sound.createAsync({ uri })` — expo-av handles streaming/caching internally |
| **No pre-fetch** | Sounds loaded when layers change; no explicit ArrayBuffer stage |
| **Unload** | `unloadAsync()` on layer change or unmount |

---

## 3.9 Latency Risks

| Source | Impact |
|--------|--------|
| **Fetch before play** | Web fetches voice + ambient eagerly; first play waits for decode. Mobile loads on demand |
| **TTS generation** | `/api/ai/render` → ElevenLabs → network round-trip; 5–30s typical for long scripts |
| **Transcription** | `/api/transcribe` → OpenAI Whisper; network latency for SpeakScreen |
| **Position tick** | Web uses 250ms interval; scrub feedback lags slightly |
| **Signed URL resolution** | `useSignedRecordingsUrl` adds one HTTP round-trip before playback for recordings |

---

## 3.10 Offline Playback Capability

| Platform | Status |
|----------|--------|
| **Web** | No explicit offline cache for audio. Fetch from URLs; once in memory, playback works until tab closed |
| **Mobile** | React Query persists to AsyncStorage (24h); content metadata cached. Audio files are streamed from URLs—no offline audio cache |
| **Service Worker** | No audio-specific cache strategy in PWA config |
| **Recommendation** | Add Cache API or expo-file-system cache for recently played audio if offline playback is a goal |

---

## 3.11 Full Audio Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           VOICE RECORDING → PROCESSING → STORAGE → PLAYBACK → MIXING     │
└─────────────────────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════════════════════
PATH A: OWN VOICE (WEB)
═══════════════════════════════════════════════════════════════════════════════════════════

  [Microphone]                                                    [Supabase Storage]
       │                                                               ▲
       │ getUserMedia                                                   │
       ▼                                                               │
  [MediaRecorder] ── Blob ──► [POST /api/audio/upload-recording] ──────┘
  (audio/webm or                                                           recordings/
   audio/mp4)                                                              {userId}/{id}.webm
       │                                                                        │
       │ ownVoiceUrl                                                            │ signed URL
       ▼                                                                        ▼
  [ContentCreationContext] ◄────────────────────────────────────────── [content_items.voice_url]


═══════════════════════════════════════════════════════════════════════════════════════════
PATH B: AI VOICE (ELEVENLABS)
═══════════════════════════════════════════════════════════════════════════════════════════

  [Script] ──► [POST /api/ai/render { contentId, text, voiceId }]
                       │
                       ├── deduct_credits
                       ├── textToSpeech(voiceId, text) ──► [ElevenLabs API]
                       │         │
                       │         └── ArrayBuffer (audio/mpeg)
                       │
                       └── supabase.storage.upload('audio', userId/contentId.mp3)
                                     │
                                     └──► [Supabase Storage: audio bucket]
                                                 │
                                                 └── content_items.voice_url, audio_url, status='ready'


═══════════════════════════════════════════════════════════════════════════════════════════
PATH C: SPEAK / ORACLE (MOBILE TRANSCRIPTION)
═══════════════════════════════════════════════════════════════════════════════════════════

  [expo-av Recording] ── m4a ──► [POST /api/transcribe] ──► [OpenAI Whisper]
       │                                  │                         │
       │                                  └── text ◄─────────────────┘
       │                                          │
       │                                          ▼
       │                                  [Oracle / Orb Chat]
       │
       └── (Recording discarded; transcription used for LLM, not stored as content)


═══════════════════════════════════════════════════════════════════════════════════════════
STORAGE BUCKETS
═══════════════════════════════════════════════════════════════════════════════════════════

  audio (private): recordings/{userId}/{contentId}.webm|mp4, {userId}/{contentId}.mp3
  atmosphere (public): {id}.mp3 — rain, forest, ocean, white-noise


═══════════════════════════════════════════════════════════════════════════════════════════
PLAYBACK & MIXING (WEB)
═══════════════════════════════════════════════════════════════════════════════════════════

  [content_items] voice_url, ambient_url, audio_settings.binauralPresetId
       │
       ▼
  [useWebAudioPlayer] fetch → buildGraph (on first play):
       voiceGain ── analyser ── masterGain ── destination
       ambientGain ──────────── masterGain ── destination
       binauralGain ─────────── masterGain ── destination
       │
       └── [useBinauralEngine] when isPlaying: OscillatorNode L/R ── StereoPanner ── binauralGain
       │
       ▼
  [Audio Waveform] ◄── analyser.getByteFrequencyData()


═══════════════════════════════════════════════════════════════════════════════════════════
PLAYBACK & MIXING (MOBILE)
═══════════════════════════════════════════════════════════════════════════════════════════

  [content_items] voice_url, ambient_url?, binaural_url?
       │
       ▼
  [useAudioPlayer / expo-av]
       Audio.Sound.createAsync × 3 → setVolumeAsync, playAsync, pauseAsync
       Per-sound volume: (layer/100) * (master/100)
```

---

## 3.12 Audio File Reference

| Purpose | File(s) |
|---------|---------|
| Web playback | `packages/web/src/hooks/useWebAudioPlayer.ts` |
| Binaural (web) | `packages/web/src/hooks/useBinauralEngine.ts` |
| Layers preview | `packages/web/src/hooks/useLayersPreview.ts` |
| Atmosphere resolution | `packages/web/src/utils/atmosphere.ts` |
| Voice recording (web) | `packages/web/src/components/content/ContentVoiceStep.tsx` |
| Mix UI | `packages/web/src/components/audio/AudioPage.tsx` |
| Upload recording | `packages/web/app/api/audio/upload-recording/route.ts` |
| AI render (TTS) | `packages/web/app/api/ai/render/route.ts` |
| Transcribe | `packages/web/app/api/transcribe/route.ts` |
| Signed URL | `packages/web/app/api/audio/signed-url/route.ts` |
| Mobile playback | `packages/mobile/src/components/audio/useAudioPlayer.ts` |
| Mobile recorder | `packages/mobile/src/components/audio/AudioRecorder.tsx` |
| Shared types | `packages/shared/src/types/audio.ts` |
| Binaural presets | `packages/shared/src/constants/binaural-presets.ts` |
| Atmosphere presets | `packages/shared/src/constants/atmosphere-presets.ts` |

---

# 4. State Management Map

**Purpose**: Maps the entire frontend state architecture across web and mobile.

---

## 4.1 State Overview

| State Category | Web | Mobile | Shared |
|----------------|-----|--------|--------|
| **User/Auth** | authStore (Zustand) | authStore (Zustand) | createAuthStore factory |
| **Credits** | useCreditBalance | useCreditBalance | createUseCreditBalance factory |
| **Creation/Ritual** | ContentCreationContext | Local useState in ContentCreateScreen | — |
| **Content (server)** | React Query | React Query | createContentHooks |
| **Playback** | useWebAudioPlayer (local) | useAudioPlayer (local) | — |
| **Theme** | ThemeProvider (Context) | ThemeProvider (Context) | themes (shared) |
| **Toast** | ToastProvider (Context) | ToastProvider (Context) | — |
| **Role override** | useRoleOverrideStore (Zustand) | — | — |
| **Onboarding** | — | OnboardingCompletionContext | — |

---

## 4.2 ContentCreationContext

**Location**: `packages/web/src/lib/contexts/ContentCreationContext.tsx`

| Field | Purpose |
|-------|---------|
| contentType | affirmation \| meditation \| ritual |
| creationMode | form \| chat \| agent |
| currentStep | init, intent, context, personalization, script, voice, audio, review |
| intent, context, personalization, script | Creation data |
| voiceId, voiceType, ownVoiceUrl | Voice selection |
| audioSettings | Volumes, binaural, atmosphere |

**Persistence**: sessionStorage key `waqup_creation_{contentType}`.

**Scope**: Wrapped by ContentCreateLayout around sanctuary create flows only. **Not used** by `/create/conversation` or `/create/orb` — those use local state + `saveCreationHandoff()`.

---

## 4.3 Provider Trees

**Web** (AppProviders.tsx):
```
QueryClientProvider → ThemeProvider → AuthProvider → ToastProvider → children
```

**Mobile** (App.tsx):
```
SafeAreaProvider → PersistQueryClientProvider → ThemeProvider → ToastProvider → children
```

---

## 4.4 Audio State

### Creation-Related Audio (Web)

| Location | State | Scope |
|----------|-------|-------|
| ContentCreationContext | audioSettings, ownVoiceUrl | Creation flow (voice step, audio step) |
| ContentVoiceStep | recordState, audioBlob, audioUrl, uploadedUrl (local) | Voice step form |
| ContentAudioStep | Local volumes from useContentCreation.audioSettings | Mix step |
| AudioPage | useWebAudioPlayer, useBinauralEngine, useLayersPreview | Edit-audio, create/audio |
| profiles table | pref_vol_voice, pref_vol_ambient, pref_vol_binaural, pref_vol_master | User volume prefs (AudioPage loads/saves) |

### Playback State (Web)

| Hook | State | Scope |
|------|-------|-------|
| useWebAudioPlayer | state, position, volumes, speed, analyserNode, audioContext, binauralGain | Per mount; no global |
| useBinauralEngine | isActive | Depends on useWebAudioPlayer nodes |
| useLayersPreview | isPlaying | Standalone preview (temp AudioContext) |

**No global playback state.** Each screen (ContentDetailPage, AudioPage, PublicPlayerClient, marketplace player) instantiates its own player. Leaving the screen destroys playback.

### Playback State (Mobile)

| Hook/Component | State | Scope |
|----------------|-------|-------|
| useAudioPlayer | state, position, volumes, speed (useState) | Per mount |
| ContentDetailScreen | useAudioPlayer directly | Player screen only |
| AudioPlayer component | useAudioPlayer with full volume UI | Exists but not used in ContentDetailScreen |

---

## 4.5 Ritual State

Ritual creation state is a subset of ContentCreationContext when `contentType === 'ritual'`.

Ritual-specific fields: intent, context, personalization (ritual-only; deeper than meditation), script, voiceId / voiceType / ownVoiceUrl, audioSettings, currentStep (goals → context → personalization → script → voice → audio → review).

**Form flow**: `/sanctuary/rituals/create/init` → goals → context → personalization → script → voice → audio → review → complete. Each step page uses `useContentCreation()` and updates via setters.

**Orb flow**: `/create/orb?type=ritual` — local state (transcript, currentStep, generatedScript). On done, `saveCreationHandoff('ritual', script, intent)` → navigate to `/sanctuary/rituals/create/voice`. ContentCreationProvider loads script/intent from sessionStorage.

---

## 4.6 User State (authStore)

**Location**: `packages/shared/src/stores/authStore.ts`. Created via `createAuthStore({ client, storage })` — platform provides Supabase client and optional storage (AsyncStorage on mobile).

| Field | Type |
|-------|------|
| user | User \| null |
| session | Session \| null |
| isLoading | boolean |
| error | string \| null |
| isInitialized | boolean |

**Actions**: login, signup, logout, requestPasswordReset, resetPassword, resendVerificationEmail, initializeAuth, setUser, setSession, clearAuth.

**Flow**: AuthProvider (web) or RootNavigator (mobile) calls `initializeAuth()` on mount. Supabase `onAuthStateChange` keeps store in sync. Protected routes read `user` to gate access.

---

## 4.7 Credits State (useCreditBalance)

**Location**: `packages/shared/src/hooks/useCreditBalance.ts`. Created via `createUseCreditBalance(supabase, channelName)` — each platform passes its client and a unique channel name (e.g. `credit-balance-web`, `credit-balance-mobile`).

| Return | Type |
|--------|------|
| balance | number |
| isLoading | boolean |
| refetch | () => void |

**Flow**: On mount, fetches balance and subscribes to `postgres_changes` on `credit_transactions`. On INSERT, refetches. Realtime keeps balance fresh across tabs/devices.

---

## 4.8 State Flow Diagrams

### Creation Flow (Web Form)

```
ContentCreateLayout (contentType=ritual)
  └── ContentCreationProvider
        └── loadFromStorage(ritual)  ← sessionStorage
        └── useState(PersistedState)
        └── saveToStorage on every change
        └── Step pages: useContentCreation() → setIntent, setContext, setScript, etc.
        └── ContentVoiceStep: setOwnVoiceUrl after upload
        └── ContentReviewStep: createContent(), POST /api/ai/render
```

### Creation Flow (Web Chat/Orb → Handoff)

```
/create/conversation or /create/orb
  └── Local useState: messages, phase, generatedScript, intent
  └── saveCreationHandoff(type, script, intent)  → sessionStorage['waqup_creation_ritual']
  └── router.push(/sanctuary/rituals/create/voice)

/sanctuary/rituals/create/voice
  └── ContentCreateLayout wraps
  └── ContentCreationProvider mounts
  └── loadFromStorage('ritual')  ← reads script, intent from sessionStorage (handoff)
  └── User continues from voice step
```

### Creation Flow (Mobile)

```
ContentCreateScreen
  └── Local useState: formValues, messages, chatInput, chatPhase, generatedScript,
      agentIntent, agentContext, isRendering, etc.
  └── No ContentCreationContext
  └── useCreateContent() → createContent() → navigation to ContentDetail
  └── renderContentAudio() for TTS
```

### Playback Flow

```
ContentDetailScreen / AudioPage / PublicPlayerClient
  └── useAudioPlayer or useWebAudioPlayer({ layers })
  └── Local state: state, position, volumes, speed
  └── On unmount: playback stops, state destroyed
```

---

## 4.9 Problems & Risks

| Problem | Details |
|---------|---------|
| **Duplicated state** | Form vs Chat vs Orb — three creation entry points; different state models |
| **Mobile creation** | ContentCreateScreen has its own state; no ContentCreationContext |
| **Volume state** | AudioPage + profiles + ContentCreationContext.audioSettings — potential drift |
| **ContentCreationContext value** | Single object; any change re-renders all consumers (no selective subscriptions) |
| **Tight coupling** | ContentAudioStep, AudioPage: useWebAudioPlayer + useBinauralEngine + useContentCreation intertwined |
| **No global playback** | No mini-player; no "now playing" across navigation |
| **sessionStorage handoff** | saveCreationHandoff merges; multiple tabs can cause stale/merged data |

---

# 5. Component Inventory

**Purpose**: Full scan of `packages/web/src/components` and `packages/mobile/src/components`. Classified and marked as Production ready, Needs improvement, or Not used.

---

## 5.1 Web Components

### UI Components

| Component | Path | Status | Notes |
|-----------|------|--------|-------|
| Typography | ui/Typography.tsx | ✅ Production ready | Used everywhere |
| Button | ui/Button.tsx | ✅ Production ready | Used everywhere |
| Input | ui/Input.tsx | ✅ Production ready | Forms, auth, waitlist |
| Card | ui/Card.tsx | ✅ Production ready | Used across app |
| Badge | ui/Badge.tsx | ✅ Production ready | Library, marketplace |
| Loading | ui/Loading.tsx | ✅ Production ready | Loading states |
| Progress | ui/Progress.tsx | ✅ Production ready | Content create flow |
| Container | ui/Container.tsx | 🔧 Needs improvement | Showcase only; real pages use PageShell/PageContent |
| EmptyState | ui/EmptyState.tsx | ✅ Production ready | Empty lists |
| ErrorBanner | ui/ErrorBanner.tsx | ✅ Production ready | Error display |
| Toast | ui/Toast.tsx | ✅ Production ready | ToastProvider + useToast |
| Icon | ui/Icon.tsx | 🔧 Needs improvement | Showcase only; Lucide used directly elsewhere |
| QCoin | ui/QCoin.tsx | ✅ Production ready | Credits, pricing, navigation |
| AiCostNotice | ui/AiCostNotice.tsx | ✅ Production ready | Voice cloning, ContentScriptStep |
| AvatarOrb | ui/AvatarOrb.tsx | ✅ Production ready | Profile, settings |
| ContentIcon | ui/ContentIcon.tsx | ✅ Production ready | Content type icons |

### Audio Components

| Component | Path | Status |
|-----------|------|--------|
| AudioWaveform | audio/AudioWaveform.tsx | ✅ Production ready |
| AudioPage | audio/AudioPage.tsx | ✅ Production ready |
| VoiceOrb | audio/VoiceOrb.tsx | ✅ Production ready |

### Recording Components

| Component | Path | Status |
|-----------|------|--------|
| RecordingWaveform | content/RecordingWaveform.tsx | ✅ Production ready |

### Ritual / Content Components

ContentListPage, ContentDetailPage, ContentEditPage, CreateFlowInitStep, ContentModeSelector, ScienceInsight, ContentIntentStep, ContentContextStep, ContentPersonalizationStep, ContentScriptStep, ContentVoiceStep, ContentAudioStep, ContentReviewStep, ContentCompleteStep, PlaceholderPage — **all ✅ Production ready**.

### Orb Components

VoiceOrb (re-exported from orb/) — **✅ Production ready**.

### Navigation / Layout

PageShell, PageContent, AppLayout, ContentCreateLayout, CreateProgressBar, GlassCard, BaseModal, SuperAdminGate — **all ✅ Production ready**.

### Marketing / Marketplace / Voice / Onboarding

AppMockup, LandingSection, LandingCard; ElevatedBadge, ShareModal, CreatorGate; VoiceGate, VoiceCard, AddVoiceModal, VoiceLibrary; OnboardingStepLayout, OnboardingSuperAdminLink — **all ✅ Production ready**.

### Shared / Misc

| Component | Status |
|-----------|--------|
| ThemeSelector | 🔧 Needs improvement (showcase only) |
| TestLoginButton | 🔧 Needs improvement (env-gated; must never show in prod) |
| Others (AnimatedBackground, Logo, WaitlistCTA, etc.) | ✅ Production ready |

---

## 5.2 Mobile Components

### UI Components

Typography, Button, Input, Card, Badge, Loading, Progress, Container, Toast, QCoin, ErrorBoundary — **all ✅ Production ready**.

### Layout

| Component | Status |
|-----------|--------|
| Screen | ✅ Production ready |
| Header | ❌ Not used |
| BottomSheet | ❌ Not used |

### Audio

| Component | Status |
|-----------|--------|
| VoiceOrb | ✅ Production ready |
| useAudioPlayer | ✅ Production ready |
| AudioPlayer | ❌ Not used (ContentDetailScreen uses useAudioPlayer directly) |
| AudioRecorder | ❌ Not used (no screen imports it) |

---

## 5.3 Summary

### Web

| Category | Production | Needs improvement | Not used |
|----------|------------|-------------------|----------|
| UI | 13 | 3 (Icon, Container, ThemeSelector) | 0 |
| Audio | 3 | 0 | 0 |
| Recording | 1 | 0 | 0 |
| Ritual/Content | 15 | 0 | 0 |
| Orb | 1 | 0 | 0 |
| Navigation/Layout | 8 | 0 | 0 |
| Marketing/Marketplace/Voice/Onboarding | 12 | 0 | 0 |
| Shared/Misc | 9 | 2 | 0 |

### Mobile

| Category | Production | Not used |
|----------|------------|----------|
| UI | 11 | 0 |
| Layout | 1 (Screen) | 2 (Header, BottomSheet) |
| Audio | 2 (VoiceOrb, useAudioPlayer) | 2 (AudioPlayer, AudioRecorder) |

---

## 5.4 Recommendations

1. **Mobile**: Wire or remove Header, BottomSheet, AudioPlayer, AudioRecorder.
2. **Web**: Reintegrate ThemeSelector or remove; ensure TestLoginButton never in prod; adopt or remove Icon; adopt or remove Container.
3. **Audio**: Add volume UI to ContentDetailScreen (mobile) or use AudioPlayer component.

---

*End of Full Audit Consolidated*
