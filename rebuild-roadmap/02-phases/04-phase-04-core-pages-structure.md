# Phase 4: Core Pages Structure - Detailed Analysis

## Overview
**Goal**: Build the core page structure for Home, Library, Create, and Profile screens with empty states and navigation
**Status**: ✅ Complete (Web) | ⏳ Pending (Mobile)
**Dependencies**: Phase 1 (Project Foundation), Phase 2 (Design System), Phase 3 (Authentication)

## Changelog

### 2026-02-07 - Initial Analysis Created
- **Status**: 📝 Analysis Complete
- **Notes**: Created detailed phase analysis with NOW/AFTER comparison and implementation steps
- **Next**: Begin after Phase 3 completion

---

## Current State Analysis (NOW)

### Web (2026-02-16)
- ✅ Home, Library, Create, Profile – full UI
- ✅ Sanctuary hub with settings, credits, progress, referral, reminders, learn
- ✅ Affirmations, Meditations, Rituals: list, create, [id], edit, edit-audio
- ✅ Speak, conversation UI, marketplace

### Mobile
- ✅ Navigation structure, placeholder screens (Home, Library, Create, Profile)
- ❌ No Sanctuary, no content CRUD, no speak, no marketplace

---

## Target State (AFTER)

### Target Implementation
**New Location**: `src/screens/` (Home, Library, Create, Profile)

**What Will Exist**:
- ✅ Home/Sanctuary screen with empty state
- ✅ Library screen with filters and empty state
- ✅ Create screen with three options
- ✅ Profile/Settings screen
- ✅ Beautiful empty states
- ✅ Navigation between screens

**Target Features**:
- Home Screen: ✅ Dashboard with empty state
- Library Screen: ✅ Filters, search placeholder, empty state
- Create Screen: ✅ Three creation options
- Profile Screen: ✅ User info, settings list

---

## Schema Verification

### Current Schema (NOW)
| Table/Field | Type | Status | Notes |
|------------|------|--------|-------|
| content_items | Table | ⏳ | May not exist yet |
| profiles | Table | ✅ | Exists |

### Target Schema (AFTER)
| Table/Field | Type | Status | Notes |
|------------|------|--------|-------|
| content_items | Table | ⏳ | Will be populated in Phase 7 |

### Schema Changes Required
- None (structure only, no data yet)

---

## Implementation Steps

### Step 4.1: Build Home/Sanctuary Screen
**Goal**: Create main dashboard screen with empty state

**Tasks**:
- [ ] Design home screen layout
- [ ] Add header with user greeting
- [ ] Add empty state for no content
- [ ] Add quick action buttons (Create Affirmation, Create Meditation, Create Ritual)
- [ ] Add navigation to other sections
- [ ] Add placeholder for stats

**UI Checkpoint**: See home screen with empty states and action buttons

---

### Step 4.2: Build Library Screen
**Goal**: Create content library screen (empty)

**Tasks**:
- [ ] Design library screen layout
- [ ] Add filter tabs (All, Affirmations, Meditations, Rituals)
- [ ] Add search bar (non-functional for now)
- [ ] Add empty state with illustration
- [ ] Add grid/list view toggle (placeholder)
- [ ] Add sorting options (placeholder)

**UI Checkpoint**: See library screen with filters and empty state

---

### Step 4.3: Build Create Screen
**Goal**: Create content creation entry point

**Tasks**:
- [ ] Design create screen with three options
- [ ] Add cards for: Create Affirmation, Create Meditation, Create Ritual
- [ ] Add descriptions for each type
- [ ] Add navigation to creation flows (empty flows for now)
- [ ] Add visual indicators (icons, colors)

**UI Checkpoint**: See create screen with three beautiful option cards

---

### Step 4.4: Build Profile/Settings Screen
**Goal**: Create user profile and settings screen

**Tasks**:
- [ ] Design profile screen layout
- [ ] Add user info section (name, email, avatar placeholder)
- [ ] Add settings list (Preferences, Notifications, Credits, About, Logout)
- [ ] Add navigation to each setting section
- [ ] Add logout functionality
- [ ] Add app version display

**UI Checkpoint**: See profile screen with settings list, logout works

---

## Verification Checklist

### Code Quality
- [ ] TypeScript types defined
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Empty states designed

### UI/UX
- [ ] Design system followed
- [ ] Responsive design
- [ ] Empty states beautiful
- [ ] Navigation smooth

---

## References

- [Roadmap](../01-planning/01-roadmap.md)
- [Phase 1 Analysis](./01-phase-01-project-foundation.md)
- [Phase 2 Analysis](./02-phase-02-design-system-ui-foundation.md)
- [Phase 3 Analysis](./03-phase-03-authentication-system.md)

---

**Last Updated**: 2026-02-16
**Status**: ✅ Complete (Web) | ⏳ Pending (Mobile – needs Sanctuary, content)
