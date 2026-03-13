# Audio Creation Fix, Recording UX, and Pricing Plan

## Part 1: Audio Creation Fixes (Existing Plan)

### 1.1 Voice Library path — render never triggered (critical)

When a user selects **Voice Library**, `ContentReviewStep` never triggers render because it only fires for `(ai + voiceId)` or `(own + ownVoiceUrl)`. Library sets `voiceType='own'` with `ownVoiceUrl=null`.

**Fix**: In [ContentReviewStep.tsx](packages/web/src/components/content/ContentReviewStep.tsx), trigger TTS when `voiceId && script` (covers AI + Library), and own-voice when `ownVoiceUrl && script`.

### 1.2 Surface storage failures

If TTS succeeds but storage upload fails, return 503 instead of 200 with `audioUrl: null`. See [api/ai/render/route.ts](packages/web/app/api/ai/render/route.ts).

---

## Part 2: Recording UX Improvements

### 2.1 Show script during recording

**Current**: ContentVoiceStep says "Read your script aloud" but does not display the script.

**Change**: In [ContentVoiceStep.tsx](packages/web/src/components/content/ContentVoiceStep.tsx):

- Pull `script` from `useContentCreation()`.
- When `choice === 'record'`, render the script in a scrollable, readable block (idle and recording states).
- Design: Card or glass panel with the script text, font size readable at arm’s length.
- i18n: Add message for "Your script to read" if needed.

### 2.2 Cool live waveform during recording

**Current**: Pulsing mic icon and timer, no waveform.

**Change**:

- Use `MediaRecorder` + `AudioContext` + `createAnalyser()` to drive a live waveform.
- Reuse or adapt patterns from [useAudioAnalyzer.ts](packages/web/src/hooks/useAudioAnalyzer.ts) or [VoiceOrb.tsx](packages/web/src/components/audio/VoiceOrb.tsx).
- UI: Animated bars or line waveform under/around the mic, synced to input levels.
- Mobile: Use equivalent logic in [AudioRecorder.tsx](packages/mobile/src/components/audio/AudioRecorder.tsx) if possible.

### 2.3 Recording time limit

**Requirement**: Cap recording duration per content type.

**Proposal**:

| Content type | Max recording (sec) | Rationale |
|--------------|---------------------|-----------|
| Affirmation  | 120 (2 min)         | Short scripts |
| Meditation   | 300 (5 min)         | Guided, slower pace |
| Ritual       | 600 (10 min)        | Longer rituals |

**Implementation**:

- Store limits in shared constants (e.g. `RECORDING_LIMITS_SEC` in `content-costs.ts` or a new `recording.ts`).
- In `startRecording`, start a max-duration timer; when it elapses, call `stopRecording` automatically.
- Show countdown or progress: "2:30 / 5:00 max" during recording.
- Optional: Soft warning at 80% of limit.

---

## Part 3: ElevenLabs Cost and 5x Margin

### 3.1 ElevenLabs pricing (research)

- **eleven_multilingual_v2**: ~$0.17–0.22 per 1,000 characters (Creator/Pro overage).
- **Speech rate**: ~150 words/min ≈ 750–900 chars/min → assume ~800 chars/min.
- **Cost per duration** (€, ~1.1 EUR/USD):

| Duration | Chars (est) | ElevenLabs cost (€) |
|----------|-------------|----------------------|
| 30 sec   | ~400        | ~€0.07               |
| 3 min    | ~2,400      | ~€0.43               |
| 10 min   | ~8,000      | ~€1.44               |

### 3.2 Current waQup pricing

- **Credits**: aiTts = 1Q per render (flat); content: affirmation 2Q, meditation 4Q, ritual 10Q (with AI).
- **Credit packs**: Spark 70Q @ €6.99 ≈ €0.10/Q.
- **Effective price per content** (€0.10/Q): affirmation €0.20, meditation €0.40, ritual €1.00.

### 3.3 Target prices (user)

| Content type        | Target price (€) | Duration (est) |
|---------------------|------------------|----------------|
| Short affirmation   | €0.05–0.10       | ~30 sec        |
| 3‑min meditation    | €0.40–0.60       | ~3 min         |
| 10‑min ritual       | €1.5–2           | ~10 min        |

### 3.4 5x profit on ElevenLabs cost

- Formula: `sell_price >= 5 × elevenlabs_cost`
- Using €0.10/Q:

| Duration | ElevenLabs (€) | 5x price (€) | Credits needed |
|----------|----------------|--------------|----------------|
| 30 sec   | ~0.07          | 0.35         | 4Q             |
| 3 min    | ~0.43          | 2.15         | 22Q            |
| 10 min   | ~1.44          | 7.20         | 72Q            |

Current credits (affirmation 2Q, meditation 4Q, ritual 10Q) are below 5x for all types. To hit 5x:

- Move from **flat** to **character-based** (or tiered) credits for AI/Library voice.
- Keep **flat** credits for own-voice (no TTS cost).

---

## Part 4: Variable Credits and Cost Estimator

### 4.1 Recording model: 5 min cap, then repeat/loop

- For **own voice**: User records the full script. No TTS; charge base credits only. The “5 min then repeat” idea implies:
  - Cap recording at 5 min (or per-type limits).
  - If script is longer, user records in segments or we repeat a shorter clip — **out of scope for v1**; v1 = record full script once.

- For **AI / Library voice**: TTS cost scales with script length. Credits should scale with characters (or tiered duration bands).

### 4.2 Character-based credit formula

Shared constants, e.g.:

```typescript
// packages/shared/src/constants/content-costs.ts

/** ElevenLabs cost per 1000 chars (€, approximate) */
const ELEVENLABS_COST_PER_1K_CHARS = 0.20;

/** Target margin multiplier (5x on ElevenLabs cost) */
const MARGIN_MULTIPLIER = 5;

/** Price per Q in € (from Spark pack) */
const PRICE_PER_Q = 0.10;

/**
 * Credits for TTS render based on script length.
 * Ensures ~5x profit on ElevenLabs cost.
 */
export function getTtsCreditsForScript(script: string): number {
  const chars = script.length;
  const costEur = (chars / 1000) * ELEVENLABS_COST_PER_1K_CHARS;
  const targetPriceEur = costEur * MARGIN_MULTIPLIER;
  const credits = Math.ceil(targetPriceEur / PRICE_PER_Q);
  return Math.max(1, credits); // minimum 1Q
}
```

Alternative: **tiered bands** (simpler for users):

| Script chars | Est. duration | Credits |
|--------------|---------------|---------|
| 0–500        | &lt;1 min      | 4Q      |
| 501–1500     | 1–2 min       | 10Q     |
| 1501–3500    | 2–4 min       | 22Q     |
| 3501–8000    | 4–10 min      | 50Q     |
| 8001+        | &gt;10 min    | 72Q+    |

### 4.3 Cost estimator (pre-recording / pre-render)

**Placement**: Script step (after generation) and Voice step (before recording/choice).

**Behaviour**:

- Compute `script.length` and `getTtsCreditsForScript(script)` (or tiered equivalent).
- Show: “This script is ~1,200 characters (~2.5 min). AI voice: 12 Qs”.
- For recording: “Own voice: 1 Q (no AI cost)”.
- Optional: “Remove sentences to lower cost” with simple editor or trim control.

### 4.4 Sentence reduction for budget

**Option A**: Script editor with “Remove sentence” actions; recalc credits on change.

**Option B**: Slider “Use first N% of script” — truncate and recompute credits (less precise but easier).

**Option C (v1)**: Show estimate only; full reduction in a future script-editing step.

---

## Part 5: Implementation Todos

1. **Fix Voice Library render** — ContentReviewStep: render when `voiceId && script`.
2. **Surface storage failures** — api/ai/render: return 503 when upload fails.
3. **Show script during recording** — ContentVoiceStep: render `script` from context.
4. **Live waveform** — Add analyser-driven waveform to recording UI.
5. **Recording time limits** — Per-type limits; auto-stop + countdown/progress.
6. **Variable TTS credits** — Replace flat 1Q with `getTtsCreditsForScript` or tiered bands.
7. **Cost estimator** — Show credits + duration estimate on Script and Voice steps.
8. **Sentence reduction (optional)** — Truncate script to hit target credits; show updated cost.

---

## Part 6: Files to Touch

| File | Changes |
|------|---------|
| `packages/web/src/components/content/ContentReviewStep.tsx` | Fix Library render path |
| `packages/web/src/components/content/ContentVoiceStep.tsx` | Script display, waveform, time limit |
| `packages/web/app/api/ai/render/route.ts` | Variable credits (if moving from 1Q), storage error handling |
| `packages/shared/src/constants/content-costs.ts` | `getTtsCreditsForScript`, tiered bands, `RECORDING_LIMITS_SEC` |
| `packages/web/src/hooks/useAudioAnalyzer.ts` or new hook | Reuse/adapt for recording waveform |
| `packages/mobile/src/components/audio/AudioRecorder.tsx` | Waveform, time limit (if supported) |

---

## Summary

| Area | Action |
|------|--------|
| Library path | Render when voiceId + script |
| Storage | Return 503 on upload failure |
| Recording | Show script, live waveform, time limit |
| TTS pricing | Variable credits by script length, 5x margin |
| Cost UX | Estimator before record/render, optional sentence reduction |
