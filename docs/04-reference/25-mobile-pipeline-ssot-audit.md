# waQup Mobile + Pipeline SSOT Audit

**Purpose**: Single Source of Truth for the current state of the app before mobile redesign.

**Date**: 2026-03-13

---

## 1. SYSTEM SUMMARY

**Tech stack**:

- **Mobile**: React Native + Expo SDK 54, React Navigation, Zustand, React Query (persisted to AsyncStorage), expo-av
- **Web**: Next.js App Router, `@/lib` (routes, contexts, creation-steps), sessionStorage for creation state
- **Shared**: `packages/shared` — types, constants (content-costs, credit-packs, orb-costs), services (Supabase, AI), hooks (useContent, useCreditBalance factory)

**Critical architecture distinction**: Web has a **full sanctuary pipeline** (init→intent→context→personalization→script→voice→audio→review→complete) with shared tail steps. **Mobile does not** — it uses a simplified CreateMode→ContentCreate flow that creates drafts and optionally renders audio, then navigates to ContentDetail. Mobile never enters sanctuary creation routes.

---

## 2. CURRENT MOBILE ROUTE MAP

```mermaid
flowchart TD
    subgraph Root [Root Stack]
        Setup[Setup - Pre-auth landing]
        Auth[Auth - Login/Signup/Forgot/Reset]
        Onboarding[Onboarding - 4 steps]
        Main[Main]
        Showcase[Showcase]
        Health[Health]
    end

    subgraph AuthStack [Auth Stack]
        Login[Login] Signup[Signup]
        ForgotPassword[ForgotPassword] ResetPassword[ResetPassword]
    end

    subgraph OnboardingStack [Onboarding Stack]
        Intention[OnboardingIntention] Profile[OnboardingProfile]
        Preferences[OnboardingPreferences] Guide[OnboardingGuide]
    end

    subgraph MainStack [Main Stack]
        Tabs[MainTabs] ContentDetail[ContentDetail]
        ContentEdit[ContentEdit] CreateMode[CreateMode - modal]
        ContentCreate[ContentCreate] Credits[Credits]
        Progress[Progress] Settings[Settings] Reminders[Reminders]
    end

    subgraph Tabs [Main Tabs]
        Home[Home] Library[Library] Marketplace[Marketplace]
        Speak[Speak] Profile[Profile]
    end

    Root --> Setup
    Root --> Auth
    Root --> Onboarding
    Root --> Main
    Home --> |CreateMode| CreateMode
    CreateMode --> |ContentCreate| ContentCreate
    ContentCreate --> |ContentDetail| ContentDetail
```

**Deep links**: `waqup://`, `https://waqup.app` — auth/login, auth/signup, auth/forgot-password, auth/reset-password, onboarding-flow, main, showcase, health

**Key routes**:

- [MainNavigator.tsx](../../packages/mobile/src/navigation/MainNavigator.tsx) — Tabs + stack screens
- [RootNavigator.tsx](../../packages/mobile/src/navigation/RootNavigator.tsx) — auth/onboarding/main gating

---

## 3. CURRENT CREATION PIPELINES

### 3.1 Web — Three Entry Paths

| Entry            | Path                             | Handoff                                                      | Tail Steps                                                                                 |
| ---------------- | -------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **Orb**          | `/create/orb`                    | `saveCreationHandoff(type, script, intent)` → sessionStorage | → `/sanctuary/{type}s/create/voice` → audio → review → complete                            |
| **Conversation** | `/create/conversation`           | Same                                                         | Same                                                                                       |
| **Direct type**  | `/sanctuary/{type}s/create/init` | N/A (form flow)                                              | init → intent → (context) → (personalization) → script → voice → audio → review → complete |

**Type-specific head steps**:

- **Affirmation**: init → intent → script → voice (shared tail)
- **Meditation**: init → intent → context → script → voice (shared tail)
- **Ritual**: init → goals → context → personalization → script → voice (shared tail)

**Shared tail** (all types): voice → audio → review → complete

### 3.2 Mobile — Single Path (Different from Web)

| Step | Screen              | Behavior                                                                                                                                                        |
| ---- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | HomeScreen          | Cards for affirmations/meditations/rituals → `CreateMode`                                                                                                       |
| 2    | CreateModeScreen    | Choose form/chat/agent; shows credit cost per mode                                                                                                              |
| 3    | ContentCreateScreen | Form: structured fields → create draft (no script). Chat: conversation → generate script → create draft. Agent: intent+context → generate script → create draft |
| 4    | —                   | `createContent()` → draft; optional `renderContentAudio()` (ElevenLabs)                                                                                         |
| 5    | ContentDetailScreen | Playback UI (or edit later)                                                                                                                                     |

**Mobile never uses**: sanctuary routes, voice step, audio mix step, review step, ContentCreationContext, saveCreationHandoff.

---

## 4. SHARED COMPONENT MAP

### Web sanctuary pipeline (shared tail)

| Component                  | Location                                                             | Uses                                                |
| -------------------------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| ContentCreateLayout        | `packages/web/src/components/shared/ContentCreateLayout.tsx`         | Wraps sanctuary create with ContentCreationProvider |
| ContentIntentStep          | `packages/web/src/components/content/ContentIntentStep.tsx`          | useContentCreation                                  |
| ContentContextStep         | `packages/web/src/components/content/ContentContextStep.tsx`         | useContentCreation                                  |
| ContentPersonalizationStep | `packages/web/src/components/content/ContentPersonalizationStep.tsx` | useContentCreation                                  |
| ContentScriptStep          | `packages/web/src/components/content/ContentScriptStep.tsx`           | useContentCreation                                  |
| ContentVoiceStep           | `packages/web/src/components/content/ContentVoiceStep.tsx`            | useContentCreation                                  |
| ContentAudioStep           | `packages/web/src/components/content/ContentAudioStep.tsx`           | useContentCreation (audioSettings)                   |
| ContentReviewStep          | `packages/web/src/components/content/ContentReviewStep.tsx`          | useContentCreation                                  |
| ContentCompleteStep        | `packages/web/src/components/content/ContentCompleteStep.tsx`         | useContentCreation                                  |

**Layouts**: affirmations/create/layout.tsx, meditations/create/layout.tsx, rituals/create/layout.tsx — all wrap children in `ContentCreateLayout` + `ContentCreationProvider`.

### Mobile creation

| Component           | Location                                                      | Shared?                                   |
| ------------------- | ------------------------------------------------------------- | ----------------------------------------- |
| CreateModeScreen    | `packages/mobile/src/screens/content/CreateModeScreen.tsx`     | No — mobile-only                          |
| ContentCreateScreen | `packages/mobile/src/screens/content/ContentCreateScreen.tsx` | No — mobile-only; monolithic (~540 lines) |
| VoiceOrb            | `packages/mobile/src/components/audio/VoiceOrb.tsx`           | Mobile-specific (different from web orb)  |

### Shared across platforms

- `@waqup/shared` — constants, types, services, useContent/useCreditBalance
- QCoin, Typography, Card, Button, etc. — design primitives per platform

---

## 5. DATA FLOW + STATE FLOW

### Web creation state

```mermaid
flowchart LR
    subgraph Web [Web Creation State]
        Ctx[ContentCreationContext]
        SS[sessionStorage]
        Handoff[saveCreationHandoff]
        Orb[Orb page] Conv[Conversation page]
    end
    Ctx --> SS
    Orb --> Handoff --> SS
    Conv --> Handoff --> SS
    SS --> Ctx
```

- **ContentCreationProvider** (ContentCreationContext.tsx): Persists to `sessionStorage` key `waqup_creation_{type}`. Fields: creationMode, currentStep, intent, context, personalization, script, voiceId, voiceType, ownVoiceUrl, audioSettings.
- **saveCreationHandoff** (creation-steps.ts): Writes script, intent, currentStep to sessionStorage. Voice step reads and continues.

### Mobile creation state

- **No ContentCreationContext** — web-only (sessionStorage, `window`).
- **ContentCreateScreen** holds local state: formValues, messages, chatInput, chatPhase, generatedScript, agentIntent, agentContext, isRendering.
- **No persistence** across navigation — state is lost on back/close.

### API proxy

- Mobile AI calls go through **web server** (`API_BASE_URL`): `/api/conversation`, `/api/generate-script`, `/api/ai/agent`, `/api/ai/render`. See packages/mobile/src/services/ai.ts.

---

## 6. CREDIT FLOW

### Deduction points (server-side `deduct_credits` RPC)

| API route              | Cost                                       | When                               |
| ---------------------- | ------------------------------------------ | ---------------------------------- |
| `/api/conversation`    | 1 Q per reply                              | Chat creation flow                 |
| `/api/generate-script` | 2 Q                                        | Script generation                  |
| `/api/ai/agent`        | 7 Q                                        | Agent mode                         |
| `/api/ai/render`       | Variable (TTS bands) or base for own-voice  | ElevenLabs TTS or recording upload |
| `/api/ai/tts`          | TTS bands (4–72 Q)                         | Fallback TTS                       |
| `/api/oracle/`*        | 1 Q per session                            | Oracle/Speak                       |
| `/api/voices`          | 50 Q                                       | New voice slot                     |

**Constants**: packages/shared/src/constants/content-costs.ts — `CONTENT_CREDIT_COSTS`, `AI_MODE_COSTS`, `API_ROUTE_COSTS`, `getTtsCreditsForScript()`, `getCreditCost()`.

### Mobile credit surfaces

- **QBalanceBadge** in Main header → Credits screen
- **ProfileScreen** — balance + "Get Credits →"
- **CreditsScreen** — RevenueCat IAP (iOS/Android) + Stripe fallback
- **CreateModeScreen** / **ContentCreateScreen** — show cost per mode

### CreateModeScreen cost display (post-audit fix)

CreateModeScreen uses `getCreditCost(contentType, mode, true)` for agent mode — agent flat fee (7 Q) + AI voice cost. Aligned with shared constants.

---

## 7. UX / ARCHITECTURE RISKS

1. **Mobile vs Web creation divergence** — Mobile has no voice selection, no audio mix (binaural/ambient), no review step. Different UX and feature parity gaps.
2. **Mobile form mode creates scriptless drafts** — Form submits title, description, duration, frequency; no script. ContentDetail may show empty playback.
3. **No creation state persistence on mobile** — Back/close loses chat history, generated script.
4. **ContentCreationContext is web-only** — No shared creation context for mobile; would need AsyncStorage-backed equivalent for parity.
5. **Orb/Chat handoff is web-only** — `saveCreationHandoff` uses sessionStorage; mobile orb equivalent (SpeakScreen) does not hand off to creation.

---

## 8. OUTDATED OR CONFLICTING LOGIC

| Item                    | Location                             | Issue                                                                                          |
| ----------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| docs/01-core pipeline  | 02, 03, 04                           | Describe conversational flow; web uses form + orb/conversation; mobile uses form/chat/agent   |
| Navigation types        | packages/web/src/types/navigation.ts  | SANCTUARY_ROUTES omits meditations create paths; sitemap has partial coverage                  |
| routes.ts completeness  | packages/web/src/lib/routes.ts       | `create/conversation` marked "mock"; orb "wired" — verify current state                        |
| renderContentAudio cost | Mobile ai.ts comment "Deducts 1Q"    | API actually uses TTS bands or base; comment is outdated                                      |

---

## 9. WHAT MUST STAY

1. **Shared constants** — content-costs, content-type-copy, credit-packs, API_ROUTE_COSTS
2. **Shared services** — Supabase content, credits, voices, storage; AI (OpenAI, ElevenLabs)
3. **Shared hooks** — useContent, useCreditBalance (per-platform channel names)
4. **Credit deduction** — atomic `deduct_credits` RPC; API routes as single deduction points
5. **Web sanctuary pipeline** — init→voice→audio→review→complete as canonical flow for web
6. **ContentCreationProvider** — sessionStorage persistence for web cross-segment navigation
7. **saveCreationHandoff** — orb/conversation → voice step handoff on web
8. **Three content types** — affirmation, meditation, ritual (distinct pipelines per type)
9. **API proxy pattern** — mobile calling web APIs for AI (keeps keys server-side)

---

## 10. WHAT CAN CHANGE

1. **Mobile creation flow** — Can align with sanctuary pipeline (voice→audio→review→complete) or keep simplified with improvements
2. **Mobile creation state** — Add persistence (AsyncStorage) if resumable flows are desired
3. **Form mode on mobile** — Either remove or extend to capture script (or redirect to chat)
4. **Shared creation context** — Extract/adapt ContentCreationContext for mobile if pursuing parity
5. **SpeakScreen → creation handoff** — Currently separate; could hand off to creation like web orb
6. **Documentation** — Align docs/01-core pipelines with actual web + mobile behavior

---

## Appendix: File Reference

| Area             | Key files                                                                           |
| ---------------- | ----------------------------------------------------------------------------------- |
| Mobile nav       | packages/mobile/src/navigation/RootNavigator.tsx, MainNavigator.tsx, MainTabs       |
| Mobile creation  | CreateModeScreen.tsx, ContentCreateScreen.tsx                                       |
| Web creation     | create/page.tsx, create/orb/page.tsx, create/conversation/page.tsx                   |
| Web sanctuary    | sanctuary/{affirmations,meditations,rituals}/create/*                                |
| Creation context | packages/web/src/lib/contexts/ContentCreationContext.tsx                            |
| Creation steps   | packages/web/src/lib/creation-steps.ts                                              |
| Shared costs     | packages/shared/src/constants/content-costs.ts                                     |
| Credit APIs      | api/conversation, api/generate-script, api/ai/agent, api/ai/render                   |
| Mobile AI        | packages/mobile/src/services/ai.ts                                                   |
