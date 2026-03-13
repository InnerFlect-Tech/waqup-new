# waQup Mobile Rebuild — Constraints + Reuse Map

**Purpose**: Focused implementation report for rebuilding mobile into a simple, audio-first ritual product.  
**Date**: 2026-03-13  
**Scope**: Code-only analysis; no code changes.  
**Audience**: Engineering team planning the mobile rebuild.

---

## 1. REUSABLE MOBILE COMPONENTS

| Component / Hook | Assessment | Reason |
|------------------|------------|--------|
| **VoiceOrb** | ✅ Keep | Clean, well-defined OrbState model, Reanimated animations. Used by ContentDetailScreen, ContentCreateScreen, SpeakScreen. No hardcoded colors in API—but STATE_COLORS uses hex; consider theme tokens. |
| **useAudioPlayer** | ✅ Keep | Solid expo-av integration, supports voice/ambient/binaural layers, background playback mode. Single source for playback logic. |
| **Screen** | ✅ Keep | Used by all screens. Handles safe areas, padding, scrollable. No duplication. |
| **UI primitives** (Button, Card, Typography, Input, Loading, Progress, Badge, QCoin, Toast, ErrorBoundary, Container) | ✅ Keep | Theme-aware, design-system aligned. Used across auth, onboarding, content, sanctuary. |
| **Auth flows** (LoginScreen, SignupScreen, ForgotPasswordScreen, ResetPasswordScreen, AuthNavigator) | ✅ Keep | Functional, form validation, Supabase auth. |
| **Onboarding flows** (OnboardingIntention, Profile, Preferences, Guide, OnboardingWrapper) | ✅ Keep | 4-step flow, OnboardingCompletionContext. |
| **Navigation shell** (RootNavigator, MainNavigator, AuthNavigator, OnboardingNavigator, linking config) | 🔧 Refactor | Keep structure; reduce tabs from 5 → 4 (remove Marketplace; optionally merge Speak into Create). |
| **ContentDetailScreen** | 🔧 Refactor | Strong base: VoiceOrb, waveform bars, useAudioPlayer, seek controls. Uses `audioUrl`; shared schema prefers `voiceUrl`. Add `voiceUrl ?? audioUrl` for playback URL. Becomes ritual player base. |
| **LibraryScreen** | 🔧 Refactor | Clean list, filters, search. Keep; simplify for ritual-first (rituals as primary). |
| **AudioRecorder** | 🔧 Refactor | Records via expo-av, `onConfirm(uri)` callback. **Not wired to upload API**. Implement `uploadRecording(uri)` calling `POST /api/audio/upload-recording`. Keep component; add service integration. |
| **CreateModeScreen** | 🔧 Refactor | Simple mode selector (form/chat/agent). Can become "quick create" entry; reduce to chat + optional form. |
| **AudioPlayer** (full component) | ❌ Replace for main flow | Heavy (volume sliders for 4 layers). ContentDetailScreen uses `useAudioPlayer` directly with custom UI—not the AudioPlayer component. AudioPlayer is only used if explicitly imported; grep shows no screen imports it. Use as reference for mini-player controls; don't ship full sliders in main ritual UX. |
| **useContent, useContentItem, useCreateContent, useUpdateContent** | ✅ Keep | Shared hooks; content service integration. |
| **useCreditBalance, useOnboardingStatus** | ✅ Keep | Shared data. |
| **Theme (useTheme, ThemeProvider, format, glass)** | ✅ Keep | Design tokens, colors. |
| **i18n** | ✅ Keep | react-i18next setup. |

---

## 2. COMPONENTS THAT SHOULD BE REMOVED OR IGNORED

| Component | Assessment | Why |
|------------|------------|-----|
| **Header** | ❌ Remove / Ignore | Exported from layout index but **never imported** by any screen. All screens use inline header sections (Typography). Dead code. |
| **BottomSheet** | ❌ Remove / Ignore | Exported but **never imported**. No usage. Dead code. |
| **AudioPlayer** (full component) | ❌ Don't use as base | No screen uses it. ContentDetailScreen builds custom UI with useAudioPlayer. The component has 4 volume sliders (voice, binaural, atmosphere, master)—overkill for ritual-first. Use useAudioPlayer directly. |
| **ContentCreateScreen** | 🔧 Replace flow | Single 539-line file handling form + chat + agent modes. Overloaded. Form mode creates content with metadata only (no script/audio). Chat/agent flow: conversation → script → renderContentAudio (ElevenLabs only). **No own-voice recording path**. Agent mode costs 7Q. For ritual-first rebuild: extract chat flow, add own-voice step, remove or defer agent mode. |
| **MarketplaceScreen** | ❌ Deprecate for v1 | Discovery/marketplace. Out of scope for "simple, audio-first ritual product." Can hide from tabs or remove. |
| **SpeakScreen** | 🔧 Decide | "Talk to the Orb" — voice → transcribe → Oracle AI. Separate product surface. For ritual rebuild: either merge into Create (voice creation) or keep as secondary. Not core ritual loop. |
| **ShowcaseScreen, HealthScreen** | ❌ Remove / Dev-only | Dev/showcase; health checks. Not part of user-facing rebuild. |
| **ContentEditScreen** | 🔧 Simplify | Metadata edit (title, description, script). No audio edit. Edit-audio opens WebBrowser to web. Acceptable for v1; improve later. |

---

## 3. NAVIGATION REBUILD PLAN

**Current structure** (from `MainNavigator`, `types`):
- **Tabs**: Home, Library, Marketplace, Speak, Profile (5 tabs)
- **Stack**: Tabs, ContentDetail, ContentEdit, CreateMode, ContentCreate, Credits, Progress, Settings, Reminders

**Target direction**: Ritual (default home), Library, Create, Profile.

### What should remain
- `RootNavigator` flow: Setup → Auth | Onboarding | Main
- `AuthNavigator`: Login, Signup, ForgotPassword, ResetPassword
- `OnboardingNavigator`: 4-step flow
- Stack screens: ContentDetail (ritual player), ContentEdit, ContentCreate, Credits, Progress, Settings, Reminders
- Deep linking config (waqup://, https://waqup.app)

### What should be removed
- **Marketplace** tab — deprecate for v1 ritual product
- **Speak** tab — merge into Create or make secondary (not a primary tab)
- `CreateMode` as separate modal — can become inline in Create tab or single-step entry

### What to merge
- **Home** → **Ritual** (default): Ritual as primary. Today Home shows "What would you like to practice?" with 3 type cards → CreateMode. Rebuild as "Today's ritual" / "Start ritual" with ritual-first CTA.
- **Create** tab: Single entry replacing CreateMode + ContentCreate. Quick create (chat) as primary; form/agent as optional.

### Proposed tab bar
| Tab | Screen | Role |
|-----|--------|------|
| Ritual | RitualHomeScreen (replaces HomeScreen) | Default. "Your ritual" / "Practice now" / quick access to last or suggested ritual. |
| Library | LibraryScreen | Existing; ritual filter default. |
| Create | CreateScreen (unified) | Single flow: chat → script → record or AI voice → save. No mode picker modal. |
| Profile | ProfileScreen | Existing. |

### Route changes
- Remove `CreateMode` as modal; integrate into Create tab flow
- `ContentCreate` becomes internal step or is merged into Create tab
- Marketplace, Speak: remove from tabs or move to Profile submenu

---

## 4. AUDIO REBUILD PLAN

**Current state**:
- `useAudioPlayer`: Local hook; each screen creates its own instance. No global playback state.
- `ContentDetailScreen`: Uses useAudioPlayer with `layers: { voiceUrl: item?.audioUrl }`. Playback dies when leaving screen.
- No mini-player.
- `AudioRecorder`: Records; `onConfirm(uri)` — **no upload implementation**. Mobile `ai.ts` has no `uploadRecording`.

### Safest path

| Need | Approach | Where |
|------|----------|-------|
| **Global playback state** | Add Zustand store `playbackStore`: `{ currentItem, layers, state, position, ... }`. `useAudioPlayer` stays as engine; store holds "now playing" and persists across navigations. | `packages/shared/src/stores/playbackStore.ts` (or mobile-only if web differs) |
| **Persistent mini-player** | New component `MiniPlayer` above tab bar. Reads from playbackStore. Tap → navigate to ContentDetail (full ritual player). Renders only when `currentItem` is set. | `packages/mobile/src/components/audio/MiniPlayer.tsx` |
| **Full-screen ritual player** | Refactor ContentDetailScreen. Use playbackStore when viewing same item; otherwise init from route params. Keep VoiceOrb, waveform, controls. | Existing `ContentDetailScreen` |
| **Own-voice recording in Create** | Wire `AudioRecorder` → new mobile service `uploadRecording(uri, contentId)`. Call `POST ${API_BASE_URL}/api/audio/upload-recording` with `FormData` (file from uri). Web route accepts multipart; mobile must send file. Then pass returned `url` to `renderContentAudio` as `ownVoiceUrl`—**but** current render API may not accept ownVoiceUrl from mobile. Audit `api/ai/render` for own-voice support. | `packages/mobile/src/services/audio.ts` (new), extend `ai.ts` or add `uploadRecording` |

### Centralization

| Concern | Centralize in |
|---------|----------------|
| Playback state (now playing, position, state) | Zustand `playbackStore` |
| Audio engine (load, play, pause, seek) | `useAudioPlayer` (unchanged) |
| Mini-player visibility | `playbackStore.currentItem !== null` |
| Recording → Upload | New `uploadRecording()` in mobile services |
| Signed URL refresh | `GET /api/audio/signed-url?url=...` exists. Audio bucket is private; stored URLs may expire. Mobile playback may need to resolve signed URL before play. Verify shared content service / API contract. |

---

## 5. CREATION FLOW REBUILD PLAN

**Current ContentCreateScreen**: 3 modes in one file — form (metadata only, no script), chat (conversation → script → ElevenLabs render), agent (intent → script → render). No own-voice.

### Recommendations

| Action | Rationale |
|--------|-----------|
| **Refactor, don't delete** | ContentCreateScreen has working chat flow and API wiring. Extract into smaller screens/steps. |
| **Quick create as default** | Chat flow (2–3 exchanges → script → record or TTS) fits "quick create." Make it the only path initially. |
| **Split screens** | 1) `CreateRitualScreen` — chat UI + script result. 2) `CreateVoiceStepScreen` — record (AudioRecorder + upload) or choose AI. 3) `CreateReviewScreen` — optional, or merge into step 2. |
| **Remove from main flow** | Form mode (metadata-only creation) — defer. Agent mode (7Q) — defer or bury in "Advanced." |
| **Own-voice first** | Add recording step. `AudioRecorder` → `uploadRecording(uri)` → pass URL to render. Web flow uses `ownVoiceUrl` in render; confirm API supports it. |

### Implementation order

1. Add `uploadRecording(uri, contentId?)` to mobile services.
2. Create `CreateVoiceStepScreen`: script display + AudioRecorder (onConfirm → upload → navigate to detail).
3. Simplify ContentCreateScreen: chat only → on script ready navigate to CreateVoiceStepScreen.
4. Remove CreateMode modal; Create tab goes straight to chat.

---

## 6. STATE REBUILD PLAN

| State | Recommended approach | Location |
|-------|----------------------|----------|
| **Playback** | Zustand | `playbackStore`: currentItem, layers, state, position, volumes, speed. Single source of truth. |
| **Now playing** | Derived from playbackStore | `currentItem !== null` → show mini-player. |
| **Creation draft** | Local component state + optional persisted draft | Session or AsyncStorage for "resume later." Not critical for v1. |
| **Ritual session state** | Local in ContentDetailScreen or playbackStore | Play/pause, position, speed. playbackStore holds it. |
| **Credits** | Existing | `useCreditBalance` (React Query). Keep. |
| **Auth** | Existing | `authStore` (Zustand). Keep. |

**Context**:
- `OnboardingCompletionContext` — keep for onboarding flow.
- No new Context for playback; Zustand is sufficient and easier to consume from MiniPlayer + screens.

---

## 7. SCREEN-BY-SCREEN REBUILD ORDER

### Phase 1 — Foundation (no breaking changes)
1. Add `playbackStore` (Zustand) with `currentItem`, `layers`, `state`, `position`, `setCurrentItem`, `clear`.
2. Add `uploadRecording(uri, contentId?)` to mobile services; call `POST /api/audio/upload-recording`.
3. Wire `useAudioPlayer` to optionally sync with playbackStore (or create `useGlobalAudioPlayer` that uses both).
4. **Risks**: None. Additive only.

### Phase 2 — Navigation + Ritual Home
1. Rename HomeScreen → RitualHomeScreen; focus on ritual CTA ("Start today's ritual", "Continue where you left off").
2. Remove Marketplace from tabs; optionally remove Speak or merge.
3. Add Create as primary tab; remove CreateMode modal, go straight to chat create.
4. **Risks**: Navigation param changes; ensure deep links still work.

### Phase 3 — Audio + Mini-Player
1. Build `MiniPlayer` component; render in MainNavigator above TabBar when playbackStore has currentItem.
2. ContentDetailScreen: on play, set playbackStore.currentItem; on mount, read from store if same item.
3. ContentDetailScreen: use `voiceUrl ?? audioUrl` for playback URL.
4. **Risks**: Tab bar layout; safe area for mini-player.

### Phase 4 — Creation Flow
1. Add `CreateVoiceStepScreen` with AudioRecorder + upload.
2. ContentCreateScreen: chat → script done → navigate to CreateVoiceStepScreen (or inline step).
3. Verify render API accepts ownVoiceUrl from mobile.
4. **Risks**: API contract for own-voice; ensure upload returns URL in correct format.

### Phase 5 — Cleanup
1. Remove Header, BottomSheet if confirmed unused.
2. Deprecate MarketplaceScreen, ShowcaseScreen, HealthScreen (or move to dev menu).
3. Simplify ContentCreateScreen: remove form/agent from main path.
4. **Risks**: Low.

---

## 8. HARD BLOCKERS

| Blocker | Severity | Notes |
|---------|----------|-------|
| **Missing upload-recording in mobile** | High | `packages/mobile/src/services/ai.ts` has no `uploadRecording`. `AudioRecorder` calls `onConfirm(uri)` but no caller uploads. Must add `POST /api/audio/upload-recording` with FormData. Web route exists and works. |
| **Render API own-voice support** | High | Web `ContentVoiceStep` passes `ownVoiceUrl` to `api/ai/render`. Verify route accepts it from mobile and uses it when present (skip TTS). |
| **Signed URL expiration** | Medium | Upload returns 7-day signed URL. Stored in DB. When expired, playback fails. Mobile may need `GET /api/audio/signed-url?url=...` to refresh. signed-url route exists; verify it supports mobile-stored paths. |
| **ContentDetailScreen uses audioUrl** | Low | Shared content returns `voiceUrl` (canonical) and `audioUrl` (legacy). ContentDetailScreen uses `item?.audioUrl`. Change to `item?.voiceUrl ?? item?.audioUrl` for robustness. |
| **Transcription for SpeakScreen** | Medium | SpeakScreen uses `POST /api/transcribe`. Verify route exists and handles mobile `audio/m4a` uploads. |
| **No binaural on mobile** | Low | useAudioPlayer supports `binauralUrl` (file). Web uses oscillators; mobile expects pre-rendered file. Ritual-first may skip binaural initially. |

---

## Summary

**Keep**: VoiceOrb, useAudioPlayer, Screen, UI primitives, auth, onboarding, navigation shell, content hooks, theme, i18n.

**Refactor**: ContentDetailScreen (voiceUrl, playbackStore), LibraryScreen (ritual-default), AudioRecorder (wire upload), CreateModeScreen (merge into Create), MainNavigator (4 tabs).

**Remove/Ignore**: Header, BottomSheet; don't use AudioPlayer component as main UX.

**Add**: playbackStore, MiniPlayer, uploadRecording service, CreateVoiceStepScreen.

**Blockers**: Mobile upload-recording integration; render API own-voice path; signed URL refresh strategy.
