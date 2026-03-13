# Quick Create Rebuild — Implementation Report

**Date**: 2026-03-13  
**Status**: Complete

## Summary

Mobile creation flow refactored into a quick chat → script → voice choice (own voice or AI) → save → ContentDetail flow. Form and agent modes removed from the main path; chat-only is the default.

## Deliverables

| Item | Status | Location |
|------|--------|----------|
| `uploadRecording` service | Done | `packages/mobile/src/services/audio.ts` |
| upload-recording API Bearer auth + m4a MIME | Done | `packages/web/app/api/audio/upload-recording/route.ts` |
| Render API `ownVoiceUrl` support (mobile client) | Done | `packages/mobile/src/services/ai.ts` (extended `renderContentAudio`) |
| CreateVoiceStepScreen | Done | `packages/mobile/src/screens/content/CreateVoiceStepScreen.tsx` |
| ContentCreateScreen simplification | Done | Chat-only, "Continue" → CreateVoiceStep |
| Form/agent removal | Done | Removed from main flow |
| MainNavigator + types | Done | CreateVoiceStep route added |
| i18n strings | Done | `packages/mobile/messages/en/common.json` |

## End-to-End Flow

1. **Create tab** → CreateEntryScreen (type picker: ritual, affirmation, meditation)
2. **ContentCreateScreen** → Chat-based creation with GPT-4o-mini (1Q per reply)
3. **Script generated** → "Continue" creates draft content and navigates to CreateVoiceStep
4. **CreateVoiceStepScreen** → User chooses:
   - **Record my voice** → AudioRecorder → `uploadRecording(uri)` → `renderContentAudio` with `ownVoiceUrl`
   - **Use AI voice** → `renderContentAudio` with `voiceId` from profile (costs Qs)
5. **ContentDetailScreen** → New ritual opens with `voiceUrl ?? audioUrl`; works with playbackStore and MiniPlayer

## ownVoiceUrl Backend Status

**ownVoiceUrl path is fully supported.**

- `/api/ai/render`: Accepts `ownVoiceUrl`. When provided, skips TTS, writes URL to `voice_url`/`audio_url`, sets `voice_type: 'own'`, no credit deduction.
- `/api/audio/upload-recording`: Now uses `getAuthenticatedUserForApi(req)` for Bearer token (mobile) in addition to cookie auth (web). MIME handling extended for `audio/m4a` (expo-av on iOS).
- Mobile `uploadRecording` sends FormData with `{ uri, type: 'audio/m4a', name: 'recording.m4a' }`.
- Mobile `renderContentAudio` accepts `{ ownVoiceUrl }` or `voiceId` (string) for backward compatibility.

## Files Changed

### New
- `packages/mobile/src/services/audio.ts`
- `packages/mobile/src/screens/content/CreateVoiceStepScreen.tsx`
- `docs/04-reference/27-quick-create-implementation-report.md`

### Modified
- `packages/mobile/src/services/index.ts` — export audio
- `packages/web/app/api/audio/upload-recording/route.ts` — Bearer auth, m4a MIME
- `packages/mobile/src/services/ai.ts` — `renderContentAudio` with `RenderOptions` / `ownVoiceUrl`
- `packages/mobile/src/screens/content/ContentCreateScreen.tsx` — chat-only, Continue → CreateVoiceStep
- `packages/mobile/src/navigation/types.ts` — CreateVoiceStep params
- `packages/mobile/src/navigation/MainNavigator.tsx` — CreateVoiceStep screen
- `packages/mobile/src/screens/content/index.ts` — export CreateVoiceStepScreen
- `packages/mobile/messages/en/common.json` — addYourVoice, recordMyVoice, useAIVoice, etc.

## Notes

- **CreateEntryScreen**: Unchanged; already navigates to ContentCreate with `mode: 'chat'`.
- **ContentDetailScreen / playbackStore**: No changes; `voiceUrl ?? audioUrl` already works for own-voice content.
- **AudioRecorder**: Used as-is; `onConfirm(uri)` receives local file URI; caller (`CreateVoiceStepScreen`) passes it to `uploadRecording`.
