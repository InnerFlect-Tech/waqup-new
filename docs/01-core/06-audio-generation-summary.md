# Audio Generation Summary

**Purpose**: TTS, recording, and the shared Audio page.

---

## TTS: ElevenLabs

- **Provider**: ElevenLabs Instant Voice Cloning (IVC)
- **Implementation**: `createInstantVoice`, `editVoice` in `packages/shared/src/services/ai/elevenlabs.ts` — IVC is available on all tiers including free; PVC (Professional Voice Cloning) exists but requires a paid Creator plan and is not used
- **Use case**: Long-form content (10–30 min), prosody, 70+ languages
- **Per tech stack**: [docs/02-mobile/01-technology-stack.md](../02-mobile/01-technology-stack.md)

---

## Recording: Own voice

- **Scientific basis**: Principle 13 — "personalized authority"; own voice bypasses skepticism
- **Use case**: Affirmations especially; also meditations and rituals
- **Flow**: Record → upload to Supabase Storage → use in Audio page

---

## Flow

1. **Script** (from LLM)
2. **Choose**: ElevenLabs OR Record
3. **Generate/upload** raw audio
4. **Audio page** — volumes, waves, preview, mix
5. **Store** final mix → `content_items.audio_url`

---

## Audio page (shared across all pipelines)

**Purpose**: Dedicated page where users customize their audio before saving. Must feel **cool** — visually engaging, satisfying to use.

**Route pattern**: After Voice step in create flow; also at `/sanctuary/{affirmations|meditations|rituals}/[id]/edit-audio`.

### Controls

| Control | Description |
|---------|-------------|
| **Volumes** | Voice vs background music/ambience mix; master volume |
| **Waves** | Waveform visualization style (bars, line, particles); optional wave presets/themes |
| **Playback** | Preview with real-time waveform; seek, loop section |
| **Effects** (future) | Reverb, EQ presets, etc. if supported |

### UX goals

- Immersive, modern, tactile
- Clear feedback
- Optional full-screen/ambient mode

### Schema

Store in `content_items` or separate `audio_settings`: `volume_voice`, `volume_ambient`, `wave_style`, etc.

---

## Reference

- **Tech stack**: [docs/02-mobile/01-technology-stack.md](../02-mobile/01-technology-stack.md)
- **Phase 8**: [rebuild-roadmap/02-phases/08-phase-08-audio-system.md](../../rebuild-roadmap/02-phases/08-phase-08-audio-system.md)
