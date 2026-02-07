# Cursor Prompt for Step-by-Step Development

**Use this prompt in Cursor to build the entire solution step by step**

---

## 🎯 How to Use This Prompt

Copy and paste this prompt into Cursor, and it will guide you through building the entire waQup solution step by step.

---

## 📋 Complete Cursor Prompt

```
I'm building waQup - a production-ready mobile and web application following a detailed roadmap. I need you to help me implement each step systematically.

**Current Context:**
- Location: `/Users/indiasfernandes/waqup-app/waqup-new/`
- Architecture: Monorepo with Mobile (React Native + Expo) and Web (Next.js) platforms
- Shared codebase: `packages/shared/` for business logic
- Roadmap: `rebuild-roadmap/01-planning/01-roadmap.md`
- Changelog: `rebuild-roadmap/03-tracking/01-changelog.md`

**Your Task:**
1. Read the current phase analysis: `rebuild-roadmap/02-phases/01-phase-XX-*.md`
2. Check the changelog to see what's completed: `rebuild-roadmap/03-tracking/01-changelog.md`
3. Implement the NEXT pending step from the roadmap
4. Test on both platforms (Mobile + Web)
5. Update the changelog when complete
6. Follow all rules in `.cursorrules`

**Key Principles:**
- Step-by-step verification: Each step must be independently testable
- Now/After analysis: Document current state before changes
- Production quality: Not prototypes, everything must be production-ready
- Test simultaneously: Test Mobile and Web together
- Update changelog: Mark progress in `rebuild-roadmap/03-tracking/01-changelog.md`

**Current Status:**
- Phase 1, Step 1.1: ✅ Complete (Platforms initialized)
- Next: Phase 1, Step 1.2 (Configure Project Structure)

**What to do:**
1. Check what step we're on by reading the changelog
2. Read the detailed phase analysis for that step
3. Implement the step following the detailed instructions
4. Test on both platforms
5. Update the changelog
6. Tell me what's next

Always reference:
- `.cursorrules` for project context
- Phase analysis docs for detailed steps
- `docs/` for architecture and implementation guides
- Use Context7 for latest library documentation
```

---

## 📚 Roadmap Overview

### Phase 0: Research & Planning ✅
- **Step 0.1**: Technology Stack Research ✅

### Phase 1: Project Foundation (Current)
- **Step 1.1**: Initialize All Platform Projects ✅
- **Step 1.2**: Configure Project Structure ⏳ **NEXT**
- **Step 1.3**: Install Core Dependencies ⏳
- **Step 1.4**: Configure Supabase Connection ⏳
- **Step 1.5**: Set Up Navigation Structure ⏳

### Phase 2: Design System & UI Foundation
- **Step 2.1**: Create Design System
- **Step 2.2**: Build Core UI Components
- **Step 2.3**: Create Layout Components
- **Step 2.4**: Build Setup/Onboarding Page

### Phase 3: Authentication System
- **Step 3.1**: Set Up Supabase Auth
- **Step 3.2**: Build Auth Screens
- **Step 3.3**: Implement Auth Flow
- **Step 3.4**: Add Session Management

### Phase 4: Core Pages Structure
- **Step 4.1**: Create Home/Dashboard
- **Step 4.2**: Build Library Page
- **Step 4.3**: Create Content Detail Pages
- **Step 4.4**: Build Profile/Settings

### Phase 5: Content Definitions & Types
- **Step 5.1**: Define Content Types (Affirmations, Meditations, Rituals)
- **Step 5.2**: Create TypeScript Types
- **Step 5.3**: Build Content Schemas (Zod)
- **Step 5.4**: Implement Content Validation

### Phase 6: Error Handling & Validation
- **Step 6.1**: Set Up Error Boundaries
- **Step 6.2**: Create Error Components
- **Step 6.3**: Implement Form Validation
- **Step 6.4**: Add Loading States

### Phase 7: API Integration
- **Step 7.1**: Set Up Supabase Client
- **Step 7.2**: Create API Services
- **Step 7.3**: Implement Data Fetching (React Query)
- **Step 7.4**: Add Caching Strategy

### Phase 8: Audio System
- **Step 8.1**: Set Up Audio Playback (expo-av / Web Audio)
- **Step 8.2**: Implement Playback Controls
- **Step 8.3**: Add Background Audio Support
- **Step 8.4**: Create Audio Player UI

### Phase 9: AI Integration
- **Step 9.1**: Set Up OpenAI Client
- **Step 9.2**: Implement Script Generation
- **Step 9.3**: Add TTS Integration (ElevenLabs)
- **Step 9.4**: Create AI Conversation Flow

### Phase 10: Payment & Credits
- **Step 10.1**: Set Up Stripe Integration
- **Step 10.2**: Create Credit System
- **Step 10.3**: Build Payment Flow
- **Step 10.4**: Implement Credit Management

### Phase 11: Performance Optimization
- **Step 11.1**: Optimize Bundle Size
- **Step 11.2**: Implement Code Splitting
- **Step 11.3**: Add Image Optimization
- **Step 11.4**: Optimize Animations

### Phase 12: Testing & Quality Assurance
- **Step 12.1**: Set Up Testing Framework
- **Step 12.2**: Write Unit Tests
- **Step 12.3**: Add Integration Tests
- **Step 12.4**: Implement E2E Tests

### Phase 13: App Store Preparation
- **Step 13.1**: Configure App Metadata
- **Step 13.2**: Set Up App Store Listings
- **Step 13.3**: Build Production Apps
- **Step 13.4**: Submit to App Stores

---

## 🔄 Step-by-Step Workflow

### For Each Step:

1. **Check Status**
   ```
   Read: rebuild-roadmap/03-tracking/01-changelog.md
   ```

2. **Read Phase Analysis**
   ```
   Read: rebuild-roadmap/02-phases/01-phase-XX-*.md
   ```

3. **Implement Step**
   - Follow detailed instructions in phase doc
   - Reference `.cursorrules` for project context
   - Use Context7 for library docs

4. **Test**
   - Test on Mobile: `npm run dev:mobile`
   - Test on Web: `npm run dev:web`
   - Verify both platforms work

5. **Update Changelog**
   ```
   Edit: rebuild-roadmap/03-tracking/01-changelog.md
   Mark step as ✅ Complete
   ```

6. **Commit**
   ```
   git add .
   git commit -m "feat: complete Phase X Step X.X - [description]"
   ```

---

## 🎯 Quick Start Prompt (Copy This)

```
I'm following the waQup rebuild roadmap. Check the changelog to see what's completed, then implement the next pending step from Phase 1. Follow the detailed instructions in the phase analysis document, test on both Mobile and Web platforms, and update the changelog when done.
```

---

## 📖 Key Documents

- **Roadmap**: `rebuild-roadmap/01-planning/01-roadmap.md`
- **Changelog**: `rebuild-roadmap/03-tracking/01-changelog.md`
- **Phase Analyses**: `rebuild-roadmap/02-phases/01-phase-XX-*.md`
- **Tech Stack**: `docs/02-mobile/01-technology-stack.md`
- **Architecture**: `docs/02-mobile/02-architecture.md`
- **Implementation**: `docs/02-mobile/03-implementation.md`
- **Cursor Rules**: `.cursorrules`

---

## ✅ Current Progress

**Completed:**
- ✅ Phase 0: Research & Planning
- ✅ Phase 1, Step 1.1: Initialize All Platform Projects

**Next:**
- ⏳ Phase 1, Step 1.2: Configure Project Structure

---

**Last Updated**: 2026-02-07
