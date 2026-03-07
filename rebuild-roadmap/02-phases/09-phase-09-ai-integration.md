# Phase 9: AI Integration - Detailed Analysis

## Overview
**Goal**: Integrate OpenAI for script generation and ElevenLabs for TTS; implement conversational content creation flow
**Status**: ⏳ Pending → Ready to start after Phase 8
**Dependencies**: Phase 8 (Audio System)

## Changelog

### 2026-02-07 - Initial Analysis Created
- **Status**: 📝 Analysis Complete
- **Notes**: Created detailed phase analysis with NOW/AFTER comparison and implementation steps
- **Next**: Begin after Phase 8 completion

---

## Current State Analysis (NOW)

### Current Implementation
**Location**: Creation flows exist but are non-functional

**What Exists** (After Phases 1-8):
- ✅ Creation flow structures
- ✅ Form inputs
- ✅ Audio system ready
- ❌ No AI integration
- ❌ No script generation
- ❌ No TTS generation
- ❌ No conversational flow

**Current Features**:
- Creation Flows: ✅ Structure exists
- AI Integration: ❌ Not implemented
- Script Generation: ❌ Not implemented
- TTS: ❌ Not implemented

---

## Target State (AFTER)

### Target Implementation
**New Location**: `src/services/ai/`, `src/hooks/useAI.ts`, `src/screens/create/conversation/`

**What Will Exist**:
- ✅ OpenAI integration for script generation
- ✅ ElevenLabs TTS integration (per tech stack)
- ✅ User recording option (own voice — see Phase 8; scientific principle 13)
- ✅ Conversational creation flow
- ✅ Prompt engineering based on scientific foundations
- ✅ Cost optimization (GPT-4o-mini, Batch API)

**Target Features**:
- Script Generation: ✅ Working for all content types
- TTS: ✅ ElevenLabs for audio from text; user recording for affirmations (optional)
- Conversation: ✅ Chat-like creation flow
- Cost Optimization: ✅ Implemented

---

## Schema Verification

### Current Schema (NOW)
| Table/Field | Type | Status | Notes |
|------------|------|--------|-------|
| content_items.script | Field | ✅ | Should exist |
| content_items.audio_url | Field | ✅ | Should exist |

### Target Schema (AFTER)
| Table/Field | Type | Status | Notes |
|------------|------|--------|-------|
| content_items.script | Field | ✅ | Populated by AI |
| content_items.audio_url | Field | ✅ | Populated by ElevenLabs TTS or user recording |

### Schema Changes Required
- None (using existing fields)

---

## Implementation Steps

### Step 9.1: Set Up OpenAI Integration
**Goal**: Connect to OpenAI API for content generation

**Tasks**:
- [ ] Set up OpenAI client
- [ ] Create API route/function for script generation
- [ ] Create prompts for each content type (Affirmation, Meditation, Ritual)
- [ ] Add prompt engineering based on scientific foundations
- [ ] Add error handling for API failures
- [ ] Add rate limiting
- [ ] Add cost tracking

**UI Checkpoint**: Can generate scripts, see them in creation flows

---

### Step 9.2: Integrate ElevenLabs TTS
**Goal**: Generate audio from text using ElevenLabs (per tech stack). User recording option for affirmations — see Phase 8.

**Tasks**:
- [ ] Set up ElevenLabs API integration
- [ ] Create TTS generation function (Professional Voice Cloning)
- [ ] Add voice selection (ElevenLabs voices)
- [ ] Add prosody control for long-form content
- [ ] Store generated audio in Supabase Storage
- [ ] Add progress tracking for generation
- [ ] Integrate with Audio page (volumes, waves) — see [06-audio-generation-summary.md](../../../docs/01-core/06-audio-generation-summary.md)

**UI Checkpoint**: Can generate audio, hear it play, customize on Audio page, see it stored

---

### Step 9.3: Implement Conversation Flow
**Goal**: Create conversational content creation

**Tasks**:
- [ ] Design conversation UI (chat-like interface)
- [ ] Create conversation state machine
- [ ] Implement conversation steps for each content type
- [ ] Add context gathering through conversation
- [ ] Add conversation history management
- [ ] Add ability to go back and edit responses
- [ ] Connect to OpenAI for conversational responses

**UI Checkpoint**: See chat interface, have conversation, generate content

---

## Verification Checklist

### AI Integration
- [ ] OpenAI connection works
- [ ] Script generation works
- [ ] ElevenLabs TTS / user recording works
- [ ] Error handling works
- [ ] Cost tracking works

### Conversation Flow
- [ ] Conversation UI works
- [ ] State machine works
- [ ] Context gathering works
- [ ] Content generation works

---

## References

- [Technology Stack](../../docs/02-mobile/01-technology-stack.md)
- [Audio Generation](../../docs/01-core/06-audio-generation-summary.md)
- [Conversational System](../../docs/01-core/08-llm-conversation-summary.md)
- [Roadmap](../01-planning/01-roadmap.md)

---

**Last Updated**: 2026-02-07
**Status**: ⏳ Pending (Waiting for Phase 8)
