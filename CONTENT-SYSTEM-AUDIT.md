# waQup Content System Audit

**Purpose**: Precise audit of how affirmations, meditations, rituals, audio, and related systems work in the codebase. Code-only; no speculation.

**Scope**: All information inlined; no references to other documents.

---

## 1. Content System Structure

### AFFIRMATIONS

| Category | Path |
|----------|------|
| Components | `packages/web/src/components/content/ContentIntentStep.tsx`, `ContentScriptStep.tsx`, `ContentVoiceStep.tsx`, `ContentReviewStep.tsx`, `ContentCompleteStep.tsx` |
| Pages | `packages/web/app/[locale]/sanctuary/affirmations/page.tsx`, `[id]/page.tsx`, `[id]/edit/page.tsx`, `[id]/edit-audio/page.tsx`, `create/page.tsx`, `create/init/page.tsx`, `create/intent/page.tsx`, `create/script/page.tsx`, `create/voice/page.tsx`, `create/audio/page.tsx`, `create/review/page.tsx`, `record/page.tsx` |
| API | `packages/web/app/api/conversation/route.ts`, `api/generate-script/route.ts`, `api/ai/render/route.ts`, `api/ai/agent/route.ts`, `api/audio/upload-recording/route.ts` |
| Services | `packages/shared/src/services/ai/openai.ts`, `packages/shared/src/services/supabase/content.ts` |
| Types | `packages/shared/src/types/content.ts`, `packages/shared/src/schemas/content.schemas.ts` |

**Database**: `content_items` with `type = 'affirmation'`

### MEDITATIONS

Same components as affirmations, plus `ContentContextStep.tsx`.  
Pages: `sanctuary/meditations/` tree; includes `create/context/page.tsx`.  
Same API, services, types.  
Database: `content_items` with `type = 'meditation'`

### RITUALS

Same components, plus `ContentPersonalizationStep.tsx`.  
Pages: `sanctuary/rituals/` tree; includes `create/goals/page.tsx` (ritual-specific intent), `create/context/page.tsx`, `create/personalization/page.tsx`, `recordings/page.tsx`.  
Same API, services, types.  
Database: `content_items` with `type = 'ritual'`

### Shared Infrastructure

- `packages/web/src/lib/contexts/ContentCreationContext.tsx` — creation state
- `packages/web/src/lib/creation-steps.ts` — step definitions, getStepsForType
- `packages/web/src/lib/content-helpers.ts`, `packages/shared/src/utils/content-helpers.ts`
- `packages/web/src/lib/api-client.ts`

---

## 2. Affirmation Generation Logic

### Script Generation Prompts (from `packages/shared/src/services/ai/openai.ts`)

**Affirmation system prompt (exact text):**
```
You are a master affirmation writer grounded in cognitive behavioural science and positive psychology.

Your task: write a personal affirmation script for the user to speak aloud in their own voice.

Rules:
- Positive framing only — describe what IS, never what isn't
- Present tense only — "I am", "I have", never "I will"
- Believable and gradual — statements must feel true or just-out-of-reach, never delusional
- Personal and specific — reference the user's intent precisely
- Emotionally resonant — each statement should land with feeling
- Format: 6–8 statements, each on its own line, written in first person
- Length: 100–200 words
- No preamble, no meta-commentary — just the statements
```

**Meditation system prompt (exact text):**
```
You are an expert meditation guide skilled in hypnotherapy-adjacent language, visualization, and state induction.

Your task: write a guided meditation script tailored to the user's intent and context.

Structure (follow this precisely):
1. Grounding (2–3 sentences): Bring awareness to the body, breath, sensations. Present-tense, sensory language.
2. Relaxation induction (3–5 sentences): Progressive release — each exhale releasing tension. Use second person ("you", "your").
3. Visualization (4–6 sentences): Vivid, emotionally charged imagery aligned with the user's intent.
4. Suggestion delivery (4–6 sentences): Softly planted beliefs and feelings as if already true — "you are", "you have", "you feel".
5. Return and close (2–3 sentences): Gently return to awareness, carry the feeling forward.

Rules:
- Second person ("you", "your") throughout
- Slow pacing — short sentences, natural pauses implied by paragraph breaks
- Language should feel warm, authoritative, and safe
- Total length: 300–500 words
- No preamble or meta-commentary — start directly with the guide
```

**Ritual system prompt (exact text):**
```
You are a master ritual architect who understands identity-level behaviour change, habit formation, and the power of personal ceremony.

Your task: write a daily ritual script for the user to speak aloud — a practice that combines grounding, affirmation, and emotional anchoring.

Structure (follow this precisely):
1. Opening invocation (2–3 sentences): Set the space. The user addresses themselves by name if provided. Statement of intention.
2. Grounding (2–3 sentences): Body and breath. Arrive fully.
3. Values declaration (3–4 sentences): Name and claim the core values provided. "I am someone who…", "I stand for…"
4. Identity affirmations (4–6 sentences): Who this person IS and is becoming — referenced to their goals and why. Present tense, first person.
5. Emotional anchor (2–3 sentences): Evoke the feeling of already living this reality. Visceral and real.
6. Closing commitment (2–3 sentences): A brief daily commitment. End with a clear signal that the ritual is complete.

Rules:
- First person ("I", "my") throughout
- Weave in the user's name, core values, and "why" naturally — don't just list them
- Ritualistic, poetic tone — this is ceremony, not a to-do list
- Total length: 350–550 words
- No preamble or meta-commentary — begin directly
```

### User prompt builder

`buildUserPrompt()` in openai.ts constructs:
```
Please write a {type} script for someone with the following details:

Intent: {intent}
Context: {context}        (if present)
Name: {name}             (if personalization.name)
Core values: {values}    (if personalization.coreValues)
Why this matters: {why}  (if personalization.whyThisMatters)
```

### Conversation prompts (exact text from `api/conversation/route.ts`)

**Affirmation:**
```
You are a supportive creation guide helping someone craft a personal affirmation practice. Your role is to draw out their intent through empathetic, focused questions — one at a time.

Flow:
1. If no intent yet: ask what area of life they want to strengthen
2. Once intent clear: ask what that would feel/look like when achieved
3. After 2 exchanges: say "I have everything I need — generating your script now." and include [GENERATE_SCRIPT] on its own line

Rules:
- One question at a time
- Warm, concise, not therapist-y
- Never give advice — just draw out their truth
- Keep responses under 60 words
```

**Meditation:**
```
You are a calm, focused creation guide helping someone design a personal meditation practice. Draw out their intent through precise, gentle questions — one at a time.

Flow:
1. If no intent yet: ask what state they want to access (sleep, calm, focus, etc.)
2. Once intent clear: ask when they'll practice (morning, evening, etc.)
3. After 2 exchanges: say "Perfect — generating your meditation now." and include [GENERATE_SCRIPT] on its own line

Rules:
- One question at a time
- Calm, unhurried tone
- Keep responses under 60 words
```

**Ritual:**
```
You are a thoughtful creation guide helping someone build a transformational daily ritual. Draw out their intent, values, and context through grounded questions — one at a time.

Flow:
1. If no intent yet: ask what transformation they are working toward
2. Once intent clear: ask what core values drive this work
3. After values shared: ask why this matters to them deeply
4. After 3 exchanges: say "I have what I need — creating your ritual now." and include [GENERATE_SCRIPT] on its own line

Rules:
- One question at a time
- Grounded, purposeful tone
- Keep responses under 70 words
```

**Locale language prepend:** en='', pt='Responda sempre em Português de Portugal. ', es='Responde siempre en español. ', fr='Réponds toujours en français. ', de='Antworte immer auf Deutsch. '

### Agent prompts (from `packages/web/app/api/ai/agent/route.ts`)

**Affirmation:** 6–8 positive present-tense statements, 100–200 words, first person. Pure script only.

**Meditation:** 5-part structure (grounding, relaxation, visualization, suggestion, return). 350–500 words. Second person. Start directly with the guide.

**Ritual:** 6-part structure (invocation, grounding, values, identity affirmations, emotional anchor, closing). 400–550 words. First person. Weave in name, values, why.

### Technology

- **Provider:** OpenAI (`https://api.openai.com/v1/chat/completions`)
- **Script generation model:** `gpt-4o-mini` (SCRIPT_GENERATION)
- **Conversation model:** `gpt-4o-mini` (CONVERSATION), temperature 0.7, max_completion_tokens 400
- **Agent model:** `gpt-4o` (AGENT), temperature 0.8, max_completion_tokens 1000
- **Script params:** temperature 0.75, max_completion_tokens 800

### Output rules (inline)

| Type       | Format                      | Length (words) |
|------------|-----------------------------|----------------|
| Affirmation| 6–8 statements, one per line| 100–200        |
| Meditation | 5 sections                  | 300–500        |
| Ritual     | 6 sections                 | 350–550        |

### Validation (from `packages/shared/src/schemas/content.schemas.ts`)

- `intent`: 10–300 chars
- `context`: max 250 chars, optional
- `personalization.coreValues`: 1–3 items, optional
- `personalization.name`: max 40 chars, optional
- `personalization.whyThisMatters`: max 300 chars, optional

### TTS and render limits

- **Max text for TTS:** 5000 chars (`/api/ai/render`)
- **TTS credit bands (chars → credits):** 0–500 → 4, 501–1500 → 10, 1501–3500 → 22, 3501–8000 → 50, 8001+ → 72

---

## 3. Ritual Creation Flow

### Form path steps

| Step | Route | Component | Data | Feeds script |
|------|-------|-----------|------|--------------|
| 1 | `/sanctuary/rituals/create/init` | CreateFlowInitStep | — | No |
| 2 | `/sanctuary/rituals/create/goals` | Ritual goals page | Selected from 8 goals | Yes → intent |
| 3 | `/sanctuary/rituals/create/context` | ContentContextStep | Situation, emotional state | Yes |
| 4 | `/sanctuary/rituals/create/personalization` | ContentPersonalizationStep | Core values, name, why | Yes |
| 5 | `/sanctuary/rituals/create/script` | ContentScriptStep | — | — |
| 6 | `/sanctuary/rituals/create/voice` | ContentVoiceStep | record / ai / library | — |
| 7 | `/sanctuary/rituals/create/audio` | AudioPage | Volumes, binaural, atmosphere | — |
| 8 | `/sanctuary/rituals/create/review` | ContentReviewStep | — | — |
| 9 | `/sanctuary/rituals/create/complete` | ContentCompleteStep | Save | — |

### Ritual goals (fixed set)

| id | label | description |
|----|-------|-------------|
| confidence | Confidence | Build unshakeable self-belief |
| health | Health & Vitality | Honour and strengthen your body |
| focus | Focus & Clarity | Cut through noise and distraction |
| energy | Energy & Motivation | Access your inner drive |
| relationships | Relationships | Deepen connection and love |
| peace | Inner Peace | Cultivate calm and equanimity |
| resilience | Resilience | Bounce back stronger |
| purpose | Purpose & Meaning | Align with what matters most |

Selected labels become intent: `Goals: ${goalLabels.join(', ')}`.

### Alternative paths

- Chat: `/create/conversation?type=ritual`
- Orb: `/create/orb?type=ritual`
- Agent: POST `/api/ai/agent` with intent (max 2000 chars)

### Affirmation flow

init → intent → script → voice → audio → review

### Meditation flow

init → intent → context → script → voice → audio → review

---

## 4. Audio Architecture

### MediaRecorder

- **Location:** `packages/web/src/components/content/ContentVoiceStep.tsx`
- **Flow:** `getUserMedia({ audio: true })` → `new MediaRecorder(stream, { mimeType })`
- **MIME:** Prefers `audio/webm;codecs=opus`, else `audio/webm`, else `audio/mp4`
- **Upload:** POST `/api/audio/upload-recording` (multipart form) → Supabase `audio` bucket
- **Path:** `recordings/{user_id}/{contentId}.webm` or `.mp4`
- **Signed URL:** 7-day, passed as `ownVoiceUrl` to `/api/ai/render`

### Storage

- **audio bucket:** `{user_id}/{contentId}.mp3` (TTS), `recordings/{user_id}/{contentId}.webm|mp4` (recordings)
- **atmosphere bucket:** Public; files `rain.mp3`, `forest.mp3`, `ocean.mp3`, `white-noise.mp3` at `atmosphere/{id}.mp3`

### Mixing

- **Where:** Client-side Web Audio API
- **Hooks:** `useWebAudioPlayer.ts`, `useBinauralEngine.ts`, `useLayersPreview.ts`
- **Component:** `AudioPage.tsx`
- **Layers:** Voice (file), Ambient (Supabase file), Binaural (oscillator-generated)
- **Backend:** No mixing; `/api/ai/render` only produces/stores voice URL

### Binaural presets (full list)

| id | label | beatFrequencyHz | carrierFrequencyHz | mood |
|----|-------|-----------------|--------------------|------|
| none | None | 0 | 0 | — |
| delta | Delta | 2 | 200 | Deep rest |
| theta | Theta | 6 | 200 | Meditation |
| alpha | Alpha | 10 | 200 | Calm focus |
| beta | Beta | 15 | 200 | Active focus |
| gamma | Gamma | 40 | 200 | Peak focus |

Left ear: `carrier + beat/2`, Right ear: `carrier - beat/2`. Client-side oscillators; no stored files.

### Atmosphere presets (full list)

| id | label | description | Storage path |
|----|-------|-------------|--------------|
| none | None | Voice only | — |
| rain | Rain | Soft, steady rainfall | atmosphere/rain.mp3 |
| forest | Forest | Birds, breeze, rustling leaves | atmosphere/forest.mp3 |
| ocean | Ocean | Slow, rhythmic waves | atmosphere/ocean.mp3 |
| white-noise | White Noise | Steady broadband ambient | atmosphere/white-noise.mp3 |

Resolved via `resolveAtmosphereUrl()` from Supabase public URL. If files not uploaded, layer is silent.

### Recording limits (seconds)

| Type | Limit |
|------|-------|
| affirmation | 120 (2 min) |
| meditation | 300 (5 min) |
| ritual | 600 (10 min) |

---

## 5. Database Schema

### content_items

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | FK auth.users, on delete cascade |
| type | text | check: 'affirmation', 'meditation', 'ritual' |
| title | text | not null |
| description | text | default '' |
| script | text | |
| duration | text | default '' |
| frequency | text | |
| status | text | draft, complete, processing, ready, failed |
| last_played_at | timestamptz | |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | auto-updated |
| audio_url | text | legacy |
| voice_url | text | voice layer |
| ambient_url | text | atmosphere layer |
| binaural_url | text | optional (mobile pre-rendered) |
| voice_type | text | e.g. 'own', 'ai' |
| audio_settings | jsonb | volumeVoice, volumeAmbient, volumeBinaural, volumeMaster, binauralPresetId, atmospherePresetId, fadeIn, fadeOut |

**Indexes:** `content_items_user_id_idx` (user_id, created_at desc), `content_items_user_type_idx` (user_id, type, created_at desc)  
**RLS:** Users can select/insert/update/delete own rows.

### practice_sessions

| Column | Type |
|--------|------|
| id | uuid |
| user_id | uuid |
| content_item_id | uuid (nullable) |
| content_type | text |
| duration_seconds | integer |
| played_at | timestamptz |

### profiles (audio volume preferences)

- `pref_vol_voice`, `pref_vol_ambient`, `pref_vol_binaural`, `pref_vol_master` (0–100)

---

## 6. TypeScript Types (inline)

### ContentItemType
```ts
type ContentItemType = 'affirmation' | 'ritual' | 'meditation';
```

### ContentStatus
```ts
type ContentStatus = 'draft' | 'processing' | 'ready' | 'failed';
```

### VoiceType
```ts
type VoiceType = 'elevenlabs' | 'tts' | 'recorded' | 'ai';
```

### AudioSettings
```ts
interface AudioSettings {
  volumeVoice: number;
  volumeAmbient: number;
  volumeBinaural: number;
  volumeMaster: number;
  binauralPresetId: string;
  atmospherePresetId: string;
  fadeIn: boolean;
  fadeOut: boolean;
}
```

### ContentItem
```ts
interface ContentItem {
  id: string;
  type: ContentItemType;
  title: string;
  description: string;
  duration: string;
  frequency?: string;
  lastPlayed?: string;
  script?: string;
  status?: ContentStatus;
  audioUrl?: string;
  voiceUrl?: string;
  ambientUrl?: string;
  binauralUrl?: string;
  defaultVolVoice?: number;
  defaultVolAmbient?: number;
  defaultVolBinaural?: number;
  voiceType?: VoiceType;
  audioSettings?: AudioSettings;
  createdAt?: string;
  updatedAt?: string;
  isElevated?: boolean;
  isListed?: boolean;
  playCount?: number;
  shareCount?: number;
  marketplaceItemId?: string;
  creatorId?: string;
}
```

### AudioLayers
```ts
interface AudioLayers {
  voiceUrl: string | null;
  ambientUrl?: string | null;
  binauralUrl?: string | null;
}
```

### AudioVolumes
```ts
interface AudioVolumes {
  voice: number;
  ambient: number;
  binaural: number;
  master: number;
}
```

### PracticeSession
```ts
interface PracticeSession {
  id: string;
  user_id: string;
  content_item_id: string | null;
  content_type: string;
  duration_seconds: number;
  played_at: string;
}
```

---

## 7. Credit Costs (inline)

### Content creation
| Type | Base (own voice) | With AI voice |
|------|------------------|----------------|
| affirmation | 1 | 2 |
| meditation | 2 | 4 |
| ritual | 5 | 10 |

### AI mode fees
| Mode | Qs |
|------|----|
| form | 0 |
| chat | 3 |
| agent | 7 |

### API route costs
| Route | Qs |
|-------|----|
| conversation | 1 |
| generateScript | 2 |
| aiAgent | 7 |
| oracleSession | 1 |
| aiTts | 1 |
| voiceSlot | 50 |

### TTS bands (script length)
| chars | credits |
|-------|---------|
| 0–500 | 4 |
| 501–1500 | 10 |
| 1501–3500 | 22 |
| 3501–8000 | 50 |
| 8001+ | 72 |

---

## 8. UX Implementation

### See affirmations
- List: `/sanctuary/affirmations`
- Detail: `/sanctuary/affirmations/[id]`
- Library: `/library` (filtered)
- Create flow: ContentScriptStep, ContentReviewStep, ContentCompleteStep; voice step shows script

### Edit affirmations
- Metadata: `/sanctuary/affirmations/[id]/edit`
- Audio: `/sanctuary/affirmations/[id]/edit-audio` (AudioPage)

### Record voice
- ContentVoiceStep at `/sanctuary/*/create/voice` (affirmations, meditations, rituals)
- MediaRecorder → `/api/audio/upload-recording`

### Listen to ritual
- Detail: `/sanctuary/rituals/[id]`
- Public: `/play/[id]` (PublicPlayerClient)
- Edit-audio: `/sanctuary/rituals/[id]/edit-audio` (preview)

### Playback
- Web: `useWebAudioPlayer`, `useBinauralEngine`, `AudioPage`, `AudioWaveform`
- Mobile: `packages/mobile/src/components/audio/useAudioPlayer.ts` (expo-av)

---

## 9. Identified Limitations (from code)

### Length and limits
- Affirmation prompt: 100–200 words; 6–8 statements
- Render API: max 5000 chars for TTS
- Script generation: max_completion_tokens 800 (can exceed 200 words)
- Recording: affirmation 120s, meditation 300s, ritual 600s

### Content type mixing
- Shared pipeline; context/personalization gated by `applyToTypes`
- Ritual uses goals selector; affirmation/meditation use free-text intent
- Single `content_items` table; type is a column

### Architecture inconsistencies
- Ritual route `/goals` but `setCurrentStep('intent')`
- Conversation vs form paths; handoff via sessionStorage `waqup_creation_{type}`
- `voice_type`: DB uses 'own'/'ai'; TypeScript has 'elevenlabs'|'tts'|'recorded'|'ai'
- Status: DB has 'draft'/'complete'; later migration adds 'processing'/'ready'/'failed'; TS uses 'draft'|'processing'|'ready'|'failed' — `complete` vs `ready` mismatch

### Duplication
- Per-type create page trees; shared components but parallel route structures
- Edit-audio: three identical pages (`affirmations/[id]/edit-audio`, etc.)
- Prompts in openai.ts, conversation/route.ts, agent/route.ts overlap

### Other
- Mobile binaural: expects `binauralUrl` (file); web uses oscillators — no pre-rendered binaural in flow
- Atmosphere: if MP3s not uploaded, layer silent
- Own voice: `setOwnVoiceUrl(uploadedUrl)` may run before upload; `canContinue` requires `uploadedUrl !== null` to block early continue

---

*Audit generated from codebase. Self-contained; no external references. 2026-03-13.*
