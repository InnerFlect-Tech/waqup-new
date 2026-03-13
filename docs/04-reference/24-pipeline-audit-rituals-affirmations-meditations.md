# waQup Creation Pipelines Audit — Affirmations / Meditations / Rituals

**Purpose**: Map the **current real flow** implemented in the codebase for the three creation pipelines, to inform mobile redesign.  
**Date**: 2026-03-13  
**Scope**: Web implementation only (mobile uses shared services but has different UI).  
**Status**: Read-only audit — no code changes.

---

## Executive Summary

All three pipelines share a common backend and **five identical tail steps**: script → voice → audio → review → complete.  
**Differences** are in the **pre-script steps**:

| Pipeline      | Pre-script steps           | Form steps (total) | Unique routes |
|---------------|----------------------------|--------------------|---------------|
| Affirmations  | intent                     | 6                  | `/intent`     |
| Meditations   | intent → context           | 7                  | `/intent`, `/context` |
| Rituals       | goals → context → personalization | 8 | `/goals`, `/context`, `/personalization` |

**Entry modes**: Form (Sanctuary step-by-step), Chat (`/create/conversation`), Orb (`/create/orb`).  
**Handoff**: Chat/Orb write `script` and `intent` to `sessionStorage` via `saveCreationHandoff()`, then redirect to the voice step. Context and personalization (for meditations/rituals) are embedded in the conversation but not persisted separately; script generation in Chat/Orb uses intent-only or intent plus conversation context passed at call time.

---

## 1. AFFIRMATION PIPELINE

### Step-by-step flow

| Step   | Route                                      | Component            | Back              | Next      |
|--------|--------------------------------------------|----------------------|-------------------|-----------|
| init   | `/sanctuary/affirmations/create/init`      | CreateFlowInitStep   | —                 | (selector)|
| intent | `/sanctuary/affirmations/create/intent`    | ContentIntentStep    | init              | script    |
| script | `/sanctuary/affirmations/create/script`    | ContentScriptStep    | intent            | voice     |
| voice  | `/sanctuary/affirmations/create/voice`     | ContentVoiceStep     | script            | audio     |
| audio  | `/sanctuary/affirmations/create/audio`     | ContentAudioStep     | voice             | review    |
| review | `/sanctuary/affirmations/create/review`     | ContentReviewStep    | audio             | complete  |
| complete | `/sanctuary/affirmations/create/complete?id=` | ContentCompleteStep | —               | —         |

**Sequence**: `init` → `intent` → `script` → `voice` → `audio` → `review` → `complete`

### Entry points

| Route                                | Purpose                    |
|-------------------------------------|----------------------------|
| `/sanctuary/affirmations/create`    | Redirects to `/init`       |
| `/sanctuary/affirmations/create/init` | Mode select (form / chat / orb) |
| `/create/conversation?type=affirmation` | Chat creation          |
| `/create/orb?type=affirmation`     | Orb creation               |

### Involved files

| Area          | Path                                                                 |
|---------------|----------------------------------------------------------------------|
| Init          | `app/[locale]/sanctuary/affirmations/create/init/page.tsx`           |
| Intent        | `app/[locale]/sanctuary/affirmations/create/intent/page.tsx`         |
| Script        | `app/[locale]/sanctuary/affirmations/create/script/page.tsx`         |
| Voice         | `app/[locale]/sanctuary/affirmations/create/voice/page.tsx`          |
| Audio         | `app/[locale]/sanctuary/affirmations/create/audio/page.tsx`         |
| Review        | `app/[locale]/sanctuary/affirmations/create/review/page.tsx`         |
| Complete      | `app/[locale]/sanctuary/affirmations/create/complete/page.tsx`       |
| Shared steps  | `components/content/ContentIntentStep.tsx`, `ContentScriptStep.tsx`, `ContentVoiceStep.tsx`, `ContentAudioStep.tsx`, `ContentReviewStep.tsx`, `ContentCompleteStep.tsx` |
| Context       | `lib/contexts/ContentCreationContext.tsx`                           |
| API client    | `lib/api-client.ts` (generate-script)                                |
| Conversation  | `app/[locale]/(main)/create/conversation/page.tsx`                   |
| Orb           | `app/[locale]/(main)/create/orb/page.tsx`                            |
| Handoff       | `lib/creation-steps.ts` (`saveCreationHandoff`)                      |

### Backend endpoints

| Endpoint                           | When            | Purpose                          |
|------------------------------------|-----------------|----------------------------------|
| `POST /api/conversation`           | Chat (per turn) | AI reply; may trigger script gen |
| `POST /api/generate-script`        | Script step     | OpenAI script (intent only)       |
| `POST /api/audio/upload-recording` | Voice step      | Upload recording blob            |
| `POST /api/ai/render`              | Review (Save)   | TTS or own-voice final audio     |

### Audio generation

- **TTS**: ElevenLabs via `packages/shared/src/services/ai/elevenlabs.ts` → `textToSpeech()`.
- **Own voice**: `ContentVoiceStep` uses `navigator.mediaDevices.getUserMedia` + `MediaRecorder` → `POST /api/audio/upload-recording` → Supabase `audio` bucket → URL in `ownVoiceUrl`.
- **Render**: `ContentReviewStep` calls `POST /api/ai/render`. If `ownVoiceUrl` is set, TTS is skipped and that URL is used.

### Completion and storage

- `ContentReviewStep` calls `createContentService(supabase).createContent()` → insert in `content_items` (`type: 'affirmation'`, `status: 'draft'`).
- Fire-and-forget `POST /api/ai/render` → updates `voice_url`, `audio_url`, `voice_type`, `status: 'ready'`.

---

## 2. MEDITATION PIPELINE

### Step-by-step flow

| Step   | Route                                       | Component            | Back              | Next      |
|--------|---------------------------------------------|----------------------|-------------------|-----------|
| init   | `/sanctuary/meditations/create/init`        | CreateFlowInitStep   | —                 | (selector)|
| intent | `/sanctuary/meditations/create/intent`      | ContentIntentStep    | init              | context   |
| context| `/sanctuary/meditations/create/context`     | Context form         | intent            | script    |
| script | `/sanctuary/meditations/create/script`      | ContentScriptStep    | context           | voice     |
| voice  | `/sanctuary/meditations/create/voice`      | ContentVoiceStep     | script            | audio     |
| audio  | `/sanctuary/meditations/create/audio`      | ContentAudioStep     | voice             | review    |
| review | `/sanctuary/meditations/create/review`      | ContentReviewStep    | audio             | complete  |
| complete | `/sanctuary/meditations/create/complete?id=` | ContentCompleteStep | —               | —         |

**Sequence**: `init` → `intent` → `context` → `script` → `voice` → `audio` → `review` → `complete`

### Entry points

| Route                                | Purpose                    |
|-------------------------------------|----------------------------|
| `/sanctuary/meditations/create`     | Redirects to `/init`       |
| `/sanctuary/meditations/create/init` | Mode select               |
| `/create/conversation?type=meditation` | Chat creation           |
| `/create/orb?type=meditation`       | Orb creation               |

### Involved files

| Area          | Path                                                                 |
|---------------|----------------------------------------------------------------------|
| Init          | `app/[locale]/sanctuary/meditations/create/init/page.tsx`            |
| Intent        | `app/[locale]/sanctuary/meditations/create/intent/page.tsx`           |
| Context       | `app/[locale]/sanctuary/meditations/create/context/page.tsx`          |
| Script        | `app/[locale]/sanctuary/meditations/create/script/page.tsx`           |
| Voice         | `app/[locale]/sanctuary/meditations/create/voice/page.tsx`           |
| Audio         | `app/[locale]/sanctuary/meditations/create/audio/page.tsx`           |
| Review        | `app/[locale]/sanctuary/meditations/create/review/page.tsx`           |
| Complete      | `app/[locale]/sanctuary/meditations/create/complete/page.tsx`        |
| Shared steps  | Same as affirmations                                                 |
| Context       | `ContentCreationContext` (stores `intent`, `context`)                |

### Backend endpoints

Same as affirmations, plus:

- Script generation receives `intent` and `context` when using the form flow.

### Audio generation

Same as affirmations: ElevenLabs TTS or own-voice recording.

### Completion and storage

Same as affirmations: `createContent()` → `content_items` → `POST /api/ai/render`.

---

## 3. RITUAL PIPELINE

### Step-by-step flow

| Step          | Route                                         | Component            | Back              | Next           |
|---------------|-----------------------------------------------|----------------------|-------------------|----------------|
| init          | `/sanctuary/rituals/create/init`              | CreateFlowInitStep   | —                 | (selector)      |
| goals (intent)| `/sanctuary/rituals/create/goals`             | Goal picker         | init              | context        |
| context       | `/sanctuary/rituals/create/context`           | Context form         | goals             | personalization |
| personalization | `/sanctuary/rituals/create/personalization`  | Personalization form | context         | script         |
| script        | `/sanctuary/rituals/create/script`            | ContentScriptStep    | personalization   | voice          |
| voice         | `/sanctuary/rituals/create/voice`             | ContentVoiceStep     | script            | audio          |
| audio         | `/sanctuary/rituals/create/audio`             | ContentAudioStep     | voice             | review         |
| review        | `/sanctuary/rituals/create/review`            | ContentReviewStep    | audio             | complete       |
| complete      | `/sanctuary/rituals/create/complete?id=`      | ContentCompleteStep  | —                 | —              |

**Sequence**: `init` → `goals` → `context` → `personalization` → `script` → `voice` → `audio` → `review` → `complete`

**Note**: Rituals use `/goals` instead of `/intent`. Selected goals are mapped to an `intent` string (e.g. `Goals: Confidence, Health`).

### Entry points

| Route                             | Purpose                    |
|-----------------------------------|----------------------------|
| `/sanctuary/rituals/create`       | Redirects to `/init`       |
| `/sanctuary/rituals/create/init`  | Mode select                |
| `/sanctuary/rituals/create/goals` | Form start (goal picker)   |
| `/create/conversation?type=ritual`| Chat creation              |
| `/create/orb?type=ritual`         | Orb creation               |

### Involved files

| Area          | Path                                                                 |
|---------------|----------------------------------------------------------------------|
| Init          | `app/[locale]/sanctuary/rituals/create/init/page.tsx`               |
| Goals         | `app/[locale]/sanctuary/rituals/create/goals/page.tsx`              |
| Context       | `app/[locale]/sanctuary/rituals/create/context/page.tsx`             |
| Personalization | `app/[locale]/sanctuary/rituals/create/personalization/page.tsx`  |
| Script        | `app/[locale]/sanctuary/rituals/create/script/page.tsx`              |
| Voice         | `app/[locale]/sanctuary/rituals/create/voice/page.tsx`              |
| Audio         | `app/[locale]/sanctuary/rituals/create/audio/page.tsx`               |
| Review        | `app/[locale]/sanctuary/rituals/create/review/page.tsx`             |
| Complete      | `app/[locale]/sanctuary/rituals/create/complete/page.tsx`            |
| Shared steps  | Same as affirmations/meditations                                   |
| Content helpers | `packages/shared/src/utils/content-helpers.ts` (ritual sections)  |

### Backend endpoints

Same pattern; script generation receives `intent`, `context`, and `personalization` when using the form flow.

### Audio generation

Same as affirmations and meditations.

### Completion and storage

Same as affirmations and meditations.

---

## 4. PIPELINE DIFFERENCES

| Dimension       | Affirmations | Meditations | Rituals |
|-----------------|--------------|-------------|---------|
| Pre-script steps| 1 (intent)   | 2 (intent, context) | 3 (goals, context, personalization) |
| Total form steps| 6            | 7           | 8       |
| Intent step     | `/intent`    | `/intent`   | `/goals` (maps to intent) |
| Context step    | ❌           | ✅ `/context` | ✅ `/context` |
| Personalization | ❌           | ❌          | ✅ `/personalization` |
| Script structure| 5 short lines | Arrival, breath, body, attention, close | Arrival, regulation, encoding (5 lines), repetition, closure |
| AI model        | GPT-4        | GPT-4o-mini  | GPT-4   |
| Shared tail     | script → voice → audio → review → complete | Same | Same |

### Chat/Orb handoff behaviour

- `saveCreationHandoff(type, script, intent)` writes to `sessionStorage['waqup_creation_' + type]`.
- Only `script`, `intent`, and `currentStep: 'script'` are persisted.
- Context and personalization are **not** persisted; they are used during the conversation to produce the script.
- After handoff, the user lands on `/sanctuary/{type}s/create/voice` with script and intent pre-filled from sessionStorage.

---

## 5. PIPELINE COMPLEXITY ANALYSIS

### Shared infrastructure

| Layer       | Location                                          | Role |
|-------------|---------------------------------------------------|------|
| State       | `ContentCreationContext.tsx`                      | Persists `intent`, `context`, `personalization`, `script`, `voiceId`, `voiceType`, `ownVoiceUrl`, `audioSettings` in `sessionStorage` |
| Script gen  | `packages/shared/src/services/ai/openai.ts`       | `generateScript()` — type-specific system prompts |
| TTS         | `packages/shared/src/services/ai/elevenlabs.ts`   | `textToSpeech()` |
| Content API | `packages/shared/src/services/supabase/content.ts` | `createContentService().createContent()` |
| Creation steps | `lib/creation-steps.ts`                         | `saveCreationHandoff()`, `getStepsForType()`, step configs |

### Credit consumption

| API                  | Credits | When |
|----------------------|---------|------|
| `POST /api/conversation` | 1Q  | Per AI reply in chat |
| `POST /api/generate-script` | 2Q | Script generation |
| `POST /api/ai/render`  | Variable (TTS) or 0 (own voice) | Final audio |
| `POST /api/audio/upload-recording` | 0 | Recording upload |

### Complexity by pipeline

- **Affirmations**: Lowest — intent → script → voice → audio → review.
- **Meditations**: Medium — adds explicit context step.
- **Rituals**: Highest — goals, context, personalization, plus structured script format (arrival, regulation, encoding, repetition, closure).

---

## 6. WHAT CAN BE SIMPLIFIED FOR MOBILE

### Reusable across pipelines

1. **Tail flow** (script → voice → audio → review → complete) — already shared; mobile can reuse the same flow and components.
2. **ContentCreationContext** — can be reused; mobile should support `sessionStorage` or equivalent (e.g. persisted storage) for Chat/Orb handoff.
3. **APIs** — same endpoints; mobile `ai.ts` already calls conversation, generate-script, upload-recording, ai/render with Bearer auth.

### Mobile-specific simplifications

1. **Single conversational creation**  
   Use Chat or Orb as the primary creation path on mobile. Form-based flows (many steps) are more suited to desktop.

2. **Reduce pre-script steps**  
   - Affirmations: Keep intent only (already minimal).  
   - Meditations: Merge intent + context into one conversational block.  
   - Rituals: Either use goals as a quick picker, or fold goals/context/personalization into one conversation.

3. **Voice step**  
   Mobile can prioritise **own-voice recording** (strongest for subconscious programming) and offer AI voice as secondary. Same recording API: `POST /api/audio/upload-recording`.

4. **Audio step**  
   Simplify volume/frequency UI for small screens; keep core volume sliders. Audio mixing logic can stay on server or in shared layer.

5. **Daily ritual loop**  
   If mobile focuses on the daily ritual loop, **playback** is primary; creation pipelines can be simplified to “conversation → script → record → save” without the full form flow.

### What to keep

- Shared `generateScript` + type-specific prompts.
- Shared `createContentService` and `content_items` schema.
- Credit deduction flow (conversation, generate-script, ai/render).
- Own-voice recording path.
- TTS fallback for users who prefer AI voice.

---

## Appendix: Route reference

### Affirmations

```
/sanctuary/affirmations/create         → /init
/sanctuary/affirmations/create/init
/sanctuary/affirmations/create/intent
/sanctuary/affirmations/create/script
/sanctuary/affirmations/create/voice
/sanctuary/affirmations/create/audio
/sanctuary/affirmations/create/review
/sanctuary/affirmations/create/complete?id=<id>
```

### Meditations

```
/sanctuary/meditations/create           → /init
/sanctuary/meditations/create/init
/sanctuary/meditations/create/intent
/sanctuary/meditations/create/context
/sanctuary/meditations/create/script
/sanctuary/meditations/create/voice
/sanctuary/meditations/create/audio
/sanctuary/meditations/create/review
/sanctuary/meditations/create/complete?id=<id>
```

### Rituals

```
/sanctuary/rituals/create               → /init
/sanctuary/rituals/create/init
/sanctuary/rituals/create/goals
/sanctuary/rituals/create/context
/sanctuary/rituals/create/personalization
/sanctuary/rituals/create/script
/sanctuary/rituals/create/voice
/sanctuary/rituals/create/audio
/sanctuary/rituals/create/review
/sanctuary/rituals/create/complete?id=<id>
```

### Shared creation (Chat / Orb)

```
/create/conversation?type=affirmation|meditation|ritual
/create/orb?type=affirmation|meditation|ritual
```

---

*Audit complete. No code was modified.*
