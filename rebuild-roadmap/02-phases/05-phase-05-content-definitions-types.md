# Phase 5: Content Definitions & Types - Detailed Analysis

## Overview
**Goal**: Implement the three content types (Affirmations, Meditations, Rituals) with proper TypeScript definitions, validation schemas, and creation flow structures
**Status**: ⏳ Pending → Ready to start after Phase 4
**Dependencies**: Phase 4 (Core Pages Structure)

## Changelog

### 2026-02-07 - Initial Analysis Created
- **Status**: 📝 Analysis Complete
- **Notes**: Created detailed phase analysis with NOW/AFTER comparison and implementation steps
- **Next**: Begin after Phase 4 completion

---

## Current State Analysis (NOW)

### Current Implementation
**Location**: Create screen exists but flows are empty

**What Exists** (After Phase 4):
- ✅ Create screen with three options
- ✅ Navigation to creation flows
- ❌ No content type definitions
- ❌ No validation schemas
- ❌ No creation flow structure

**Current Schema**:
- content_items table may exist but structure unclear

**Current Features**:
- Create Screen: ✅ Entry point exists
- Content Types: ❌ Not defined
- Validation: ❌ Not implemented
- Creation Flows: ❌ Empty

---

## Target State (AFTER)

### Target Implementation
**New Location**: `src/types/content.ts`, `src/schemas/content.ts`, `src/screens/create/`

**What Will Exist**:
- ✅ TypeScript types for all three content types
- ✅ Zod validation schemas
- ✅ Content type enums and constants
- ✅ Detail screens for each content type (structure)
- ✅ Multi-step creation flows (structure)

**Target Features**:
- Type System: ✅ Complete definitions
- Validation: ✅ Zod schemas
- Detail Screens: ✅ Structure ready
- Creation Flows: ✅ All steps defined

---

## Schema Verification

### Current Schema (NOW)
| Table/Field | Type | Status | Notes |
|------------|------|--------|-------|
| content_items | Table | ⏳ | Structure to verify |
| content_type | Enum | ⏳ | Should be: affirmation, meditation, ritual |

### Target Schema (AFTER)
| Table/Field | Type | Status | Notes |
|------------|------|--------|-------|
| content_items | Table | ✅ | Verified structure |
| content_type | Enum | ✅ | Three types defined |

### Schema Changes Required
- [ ] Verify content_items table structure
- [ ] Verify content_type enum values
- [ ] Add missing fields if needed

---

## Implementation Steps

### Step 5.1: Define Content Type System
**Goal**: Implement the three content types with proper definitions

**Tasks**:
- [ ] Create TypeScript types for Affirmation, Meditation, Ritual
- [ ] Define structure for each type (based on scientific foundations)
- [ ] Create content type enums and constants
- [ ] Add validation schemas (using Zod)
- [ ] Document differences between types
- [ ] Create content factory/helper functions

**UI Checkpoint**: No UI changes, but types are ready

---

### Step 5.2: Build Content Detail Screens (Empty)
**Goal**: Create screens for viewing individual content items

**Tasks**:
- [ ] Create Affirmation detail screen (structure only)
- [ ] Create Meditation detail screen (structure only)
- [ ] Create Ritual detail screen (structure only)
- [ ] Add placeholder for audio player
- [ ] Add placeholder for content text
- [ ] Add action buttons (Play, Edit, Delete, Share)
- [ ] Add metadata display (duration, created date, tags)

**UI Checkpoint**: See detail screens with placeholders for all elements

---

### Step 5.3: Build Content Creation Flows (Structure Only)
**Goal**: Create multi-step creation flows for each content type

**Tasks**:
- [ ] Create Affirmation creation flow (steps: Intent, Script, Voice, Review)
- [ ] Create Meditation creation flow (steps: Intent, Context, Script, Voice, Review)
- [ ] Create Ritual creation flow (steps: Intent, Context, Personalization, Script, Voice, Review)
- [ ] Add step indicator component
- [ ] Add navigation between steps
- [ ] Add form inputs for each step (non-functional)
- [ ] Add "Next" and "Back" buttons

**UI Checkpoint**: See multi-step creation flows, can navigate steps, see all form fields

---

## Verification Checklist

### Code Quality
- [ ] TypeScript types well-defined
- [ ] Validation schemas complete
- [ ] Type safety enforced

### Content Types
- [ ] Three types clearly defined
- [ ] Differences documented
- [ ] Validation works

---

## References

- [Product Constitution](../../../docs/internal/01-product-constitution.md) - Three content types definition
- [Roadmap](../01-planning/01-roadmap.md)
- [Phase 4 Analysis](./04-phase-04-core-pages-structure.md)

---

**Last Updated**: 2026-02-07
**Status**: ⏳ Pending (Waiting for Phase 4)
