# waQup Production Rebuild Roadmap

**Goal**: Rebuild waQup from scratch as a production-ready mobile app for iOS and Android app stores, with high-quality design, fast performance, and scientific backing.

**Approach**: Each step is independently runnable with clear, visible UI differences. We build incrementally, testing at each stage.

**Important**: For detailed analysis of each phase with "now/after" comparisons, schema verification, and step-by-step implementation details, see:
- [Schema Verification](./02-schema-verification.md) - Complete database schema analysis
- [Phase Analyses](../02-phases/) - Detailed analysis for each phase
- [Changelog](../03-tracking/01-changelog.md) - **Track step completion and updates**
- [Analysis Template](../03-tracking/02-analysis-template.md) - Template for phase analysis
- [Step Tracking Template](../03-tracking/03-step-tracking.md) - Template for tracking individual steps
- [Technology Stack](../../docs/02-mobile/01-technology-stack.md) - Finalized tech stack
- [Architecture](../../docs/02-mobile/02-architecture.md) - Mobile architecture
- [Implementation](../../docs/02-mobile/03-implementation.md) - Implementation guide

**⚠️ IMPORTANT**: Always update [Changelog](../03-tracking/01-changelog.md) when completing or re-running steps!

---

## Table of Contents

1. [Phase 0: Research & Planning](#phase-0-research--planning)
2. [Phase 1: Project Foundation](#phase-1-project-foundation)
3. [Phase 2: Design System & UI Foundation](#phase-2-design-system--ui-foundation)
4. [Phase 3: Authentication System](#phase-3-authentication-system)
5. [Phase 4: Core Pages Structure](#phase-4-core-pages-structure)
6. [Phase 5: Content Definitions & Types](#phase-5-content-definitions--types)
7. [Phase 6: Error Handling & Validation](#phase-6-error-handling--validation)
8. [Phase 7: API Integration](#phase-7-api-integration)
9. [Phase 8: Audio System](#phase-8-audio-system)
10. [Phase 9: AI Integration](#phase-9-ai-integration)
11. [Phase 10: Payment & Credits](#phase-10-payment--credits)
12. [Phase 11: Performance Optimization](#phase-11-performance-optimization)
13. [Phase 12: Testing & Quality Assurance](#phase-12-testing--quality-assurance)
14. [Phase 13: App Store Preparation](#phase-13-app-store-preparation)
15. [Phase 14: Marketplace Platform](#phase-14-marketplace-platform) - *Future*
16. [Phase 15: Social & Community Features](#phase-15-social--community-features) - *Future*
17. [Phase 16: Advanced Features](#phase-16-advanced-features) - *Future*
18. [Phase 17: Desktop App Development](#phase-17-desktop-app-development) - *CANCELLED* (Desktop = Web browsers)

---

## Phase 0: Research & Planning

### Step 0.1: Technology Stack Research ✅
**Goal**: Validate technology choices and gather best practices

**Tasks**:
- [ ] Research React Native + Expo vs Native (iOS Swift/Android Kotlin)
- [ ] Review Supabase React Native SDK capabilities
- [ ] Research OpenAI TTS API integration patterns
- [ ] Review Stripe React Native SDK for mobile payments
- [ ] Study scientific foundations (neuroplasticity, procedural memory, autonomic regulation)
- [ ] Review App Store and Play Store submission requirements
- [ ] Research audio playback best practices for mobile (background audio, interruptions)

**Deliverables**:
- Technology decision document
- Scientific references document
- App store requirements checklist

**Success Criteria**: Clear understanding of tech stack, scientific backing, and store requirements

---

## Phase 1: Project Foundation

### Step 1.1: Initialize React Native Expo Project
**Goal**: Set up a clean, production-ready React Native project with Expo

**Tasks**:
- [ ] Run `npx create-expo-app@latest waqup-mobile --template`
- [ ] Choose TypeScript template
- [ ] Configure project structure (src/, components/, screens/, services/, types/)
- [ ] Set up path aliases (@/components, @/screens, @/services, etc.)
- [ ] Configure ESLint and Prettier
- [ ] Set up Git repository with proper .gitignore
- [ ] Configure environment variables (.env files for dev/staging/prod)

**Deliverables**:
- Working Expo project
- Proper folder structure
- Linting and formatting configured

**Success Criteria**: 
- `npm start` runs successfully
- Project structure follows best practices
- TypeScript compilation works

**UI Checkpoint**: Blank app with Expo welcome screen

---

### Step 1.2: Install Core Dependencies
**Goal**: Install all essential libraries for the app

**Tasks**:
- [ ] Install Supabase client: `@supabase/supabase-js`
- [ ] Install navigation: `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`
- [ ] Install state management: `zustand` or `@tanstack/react-query`
- [ ] Install UI library: `react-native-paper` or `native-base` or custom with `react-native-reanimated`
- [ ] Install audio: `expo-av`
- [ ] Install forms: `react-hook-form` + `zod`
- [ ] Install HTTP client: `axios` or native `fetch` wrapper
- [ ] Install utilities: `date-fns`, `uuid`, `lodash`

**Deliverables**:
- package.json with all dependencies
- Working dependency resolution

**Success Criteria**: All packages install without errors

**UI Checkpoint**: Same blank screen (no UI changes yet)

---

### Step 1.3: Configure Supabase Connection
**Goal**: Set up Supabase client and test connection

**Tasks**:
- [ ] Create Supabase client configuration file
- [ ] Set up environment variables for Supabase URL and keys
- [ ] Create service layer for Supabase operations
- [ ] Test connection with a simple query
- [ ] Set up error handling for connection failures

**Deliverables**:
- Supabase client configured
- Connection test working

**Success Criteria**: Can query Supabase from the app

**UI Checkpoint**: Console log showing successful connection (no UI yet)

---

### Step 1.4: Set Up Navigation Structure
**Goal**: Create navigation structure with all main routes

**Tasks**:
- [ ] Install and configure React Navigation
- [ ] Create navigation types (TypeScript)
- [ ] Set up stack navigator for auth flow
- [ ] Set up tab navigator for main app
- [ ] Create placeholder screens for all routes:
  - Auth: Login, Signup, ForgotPassword
  - Main: Home (Sanctuary), Library, Create, Profile
  - Content: Affirmations, Meditations, Rituals

**Deliverables**:
- Navigation structure in place
- All routes accessible

**Success Criteria**: Can navigate between all screens (empty screens)

**UI Checkpoint**: Navigation bar visible, can tap between tabs, see empty screens

---

## Phase 2: Design System & UI Foundation

### Step 2.1: Create Design System
**Goal**: Define colors, typography, spacing, and component styles

**Tasks**:
- [ ] Define color palette (primary, secondary, accent, background, text, error, success)
- [ ] Define typography scale (headings, body, captions)
- [ ] Define spacing system (4px, 8px, 16px, 24px, 32px, etc.)
- [ ] Define border radius values
- [ ] Define shadow/elevation system
- [ ] Create theme configuration file
- [ ] Set up dark mode support (if needed)

**Deliverables**:
- `theme.ts` or `design-system.ts` file
- Color and typography constants

**Success Criteria**: Theme system ready to use

**UI Checkpoint**: No visible UI yet, but theme is defined

---

### Step 2.2: Build Core UI Components
**Goal**: Create reusable UI components following design system

**Tasks**:
- [ ] Button component (primary, secondary, outline, text variants)
- [ ] Input component (text, email, password, textarea)
- [ ] Card component
- [ ] Typography components (Heading, Body, Caption)
- [ ] Loading/Spinner component
- [ ] Icon component wrapper
- [ ] Container/View wrapper components
- [ ] Badge component
- [ ] Progress indicator component

**Deliverables**:
- Component library in `components/ui/`
- All components documented with props

**Success Criteria**: All components render correctly with theme

**UI Checkpoint**: Component showcase screen showing all components

---

### Step 2.3: Create Layout Components
**Goal**: Build layout structure for screens

**Tasks**:
- [ ] Screen wrapper component (handles safe areas, padding)
- [ ] Header component (with back button, title, actions)
- [ ] Tab bar component (custom styling)
- [ ] Bottom sheet component (for modals)
- [ ] Drawer component (if needed)

**Deliverables**:
- Layout components ready

**Success Criteria**: Layout components work correctly

**UI Checkpoint**: See header and tab bar on all screens

---

### Step 2.4: Build Setup/Onboarding Page
**Goal**: Create a beautiful setup page to verify design system

**Tasks**:
- [ ] Create welcome/setup screen
- [ ] Use all design system elements
- [ ] Add smooth animations (using react-native-reanimated)
- [ ] Implement proper spacing and typography
- [ ] Add illustrations or placeholder images
- [ ] Make it responsive for different screen sizes

**Deliverables**:
- Beautiful setup page

**Success Criteria**: Page looks professional and uses design system correctly

**UI Checkpoint**: See a polished setup/welcome page with all design elements

---

## Phase 3: Authentication System

### Step 3.1: Build Login Screen
**Goal**: Create functional login screen with validation

**Tasks**:
- [ ] Design login screen UI
- [ ] Add email and password inputs
- [ ] Add form validation (email format, password requirements)
- [ ] Add "Forgot Password" link
- [ ] Add "Sign Up" link
- [ ] Implement error message display
- [ ] Add loading state during login
- [ ] Connect to Supabase Auth

**Deliverables**:
- Working login screen

**Success Criteria**: Can log in with valid credentials, see errors for invalid input

**UI Checkpoint**: Beautiful login screen, can type, see validation errors, login works

---

### Step 3.2: Build Signup Screen
**Goal**: Create signup flow with email verification

**Tasks**:
- [ ] Design signup screen UI
- [ ] Add all required fields (email, password, confirm password)
- [ ] Add form validation
- [ ] Add terms of service checkbox
- [ ] Implement email verification flow
- [ ] Add success message after signup
- [ ] Connect to Supabase Auth

**Deliverables**:
- Working signup screen

**Success Criteria**: Can create account, receive verification email

**UI Checkpoint**: Signup screen works, can create account, see success message

---

### Step 3.3: Implement Auth State Management
**Goal**: Manage authentication state across the app

**Tasks**:
- [ ] Create auth context/store (using Zustand or Context API)
- [ ] Implement session persistence
- [ ] Add auth state listeners (Supabase auth state changes)
- [ ] Create protected route wrapper
- [ ] Implement auto-logout on token expiry
- [ ] Add refresh token logic

**Deliverables**:
- Auth state management working

**Success Criteria**: Auth state persists, protected routes work, auto-logout works

**UI Checkpoint**: After login, stay logged in on app restart, protected screens accessible

---

### Step 3.4: Build Forgot Password Flow
**Goal**: Password reset functionality

**Tasks**:
- [ ] Create forgot password screen
- [ ] Add email input and validation
- [ ] Implement password reset email sending
- [ ] Create reset password screen (for email link)
- [ ] Add new password form with validation
- [ ] Connect to Supabase Auth

**Deliverables**:
- Working password reset flow

**Success Criteria**: Can reset password via email

**UI Checkpoint**: Can request reset, receive email, reset password

---

## Phase 4: Core Pages Structure

### Step 4.1: Build Home/Sanctuary Screen
**Goal**: Create main dashboard screen with empty state

**Tasks**:
- [ ] Design home screen layout
- [ ] Add header with user greeting
- [ ] Add empty state for no content
- [ ] Add quick action buttons (Create Affirmation, Create Meditation, Create Ritual)
- [ ] Add navigation to other sections
- [ ] Add placeholder for stats (will be populated later)

**Deliverables**:
- Home screen with structure

**Success Criteria**: Screen looks good, navigation works, empty states shown

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

**Deliverables**:
- Library screen structure

**Success Criteria**: Screen structure complete, filters visible

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

**Deliverables**:
- Create screen with three options

**Success Criteria**: Can see three creation options, can navigate to flows

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

**Deliverables**:
- Profile screen with settings

**Success Criteria**: Can see profile, navigate to settings, logout works

**UI Checkpoint**: See profile screen with settings list, logout works

---

## Phase 5: Content Definitions & Types

### Step 5.1: Define Content Type System
**Goal**: Implement the three content types with proper definitions

**Tasks**:
- [ ] Create TypeScript types for Affirmation, Meditation, Ritual
- [ ] Define structure for each type (based on scientific foundations)
- [ ] Create content type enums and constants
- [ ] Add validation schemas (using Zod)
- [ ] Document differences between types
- [ ] Create content factory/helper functions

**Deliverables**:
- Type system for content
- Validation schemas

**Success Criteria**: Types are well-defined, validation works

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

**Deliverables**:
- Three detail screens with structure

**Success Criteria**: Can navigate to detail screens, see structure

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

**Deliverables**:
- Three creation flows with all steps

**Success Criteria**: Can navigate through all steps in each flow

**UI Checkpoint**: See multi-step creation flows, can navigate steps, see all form fields

---

## Phase 6: Error Handling & Validation

### Step 6.1: Implement Global Error Handling
**Goal**: Handle errors gracefully across the app

**Tasks**:
- [ ] Create error boundary component
- [ ] Create error display component (toast/alert)
- [ ] Set up error logging service
- [ ] Create error types and error message mapping
- [ ] Add network error handling
- [ ] Add API error handling
- [ ] Add form validation error display

**Deliverables**:
- Error handling system

**Success Criteria**: Errors are caught and displayed nicely

**UI Checkpoint**: See error messages displayed properly when errors occur

---

### Step 6.2: Add Form Validation
**Goal**: Validate all forms with proper error messages

**Tasks**:
- [ ] Add validation to login form
- [ ] Add validation to signup form
- [ ] Add validation to content creation forms
- [ ] Add validation to profile/settings forms
- [ ] Create reusable validation rules
- [ ] Add inline error messages
- [ ] Add success messages

**Deliverables**:
- All forms validated

**Success Criteria**: All forms show validation errors correctly

**UI Checkpoint**: See validation errors on all forms when invalid input

---

### Step 6.3: Add Loading States
**Goal**: Show loading indicators during async operations

**Tasks**:
- [ ] Add loading spinner to buttons
- [ ] Add full-screen loading overlay
- [ ] Add skeleton loaders for content lists
- [ ] Add loading states to API calls
- [ ] Add progress indicators for long operations
- [ ] Prevent double submissions

**Deliverables**:
- Loading states everywhere

**Success Criteria**: Loading indicators show during all async operations

**UI Checkpoint**: See loading spinners, skeletons, progress indicators

---

### Step 6.4: Add Empty States
**Goal**: Create beautiful empty states for all screens

**Tasks**:
- [ ] Design empty state component
- [ ] Add empty state for library (no content)
- [ ] Add empty state for search results
- [ ] Add empty state for favorites
- [ ] Add illustrations or icons
- [ ] Add helpful messages and CTAs

**Deliverables**:
- Empty states for all screens

**Success Criteria**: Empty states look good and are helpful

**UI Checkpoint**: See beautiful empty states when no data

---

## Phase 7: API Integration

### Step 7.1: Set Up API Service Layer
**Goal**: Create organized API service functions

**Tasks**:
- [ ] Create API client wrapper (with interceptors)
- [ ] Create auth API functions (login, signup, logout, reset password)
- [ ] Create content API functions (list, get, create, update, delete)
- [ ] Create user API functions (get profile, update profile)
- [ ] Add request/response types
- [ ] Add error handling for API calls
- [ ] Add retry logic for failed requests

**Deliverables**:
- API service layer

**Success Criteria**: API functions are organized and typed

**UI Checkpoint**: No UI changes, but API layer ready

---

### Step 7.2: Integrate Supabase Queries
**Goal**: Connect app to Supabase database

**Tasks**:
- [ ] Set up Supabase queries for users
- [ ] Set up Supabase queries for content items
- [ ] Set up Supabase queries for practice events
- [ ] Add real-time subscriptions (for credit balance, new content)
- [ ] Add pagination for lists
- [ ] Add filtering and sorting
- [ ] Add caching strategy

**Deliverables**:
- Supabase integration complete

**Success Criteria**: Can read/write data to Supabase

**UI Checkpoint**: Can see data from Supabase on screens (if data exists)

---

### Step 7.3: Implement Data Fetching with React Query
**Goal**: Use React Query for efficient data fetching

**Tasks**:
- [ ] Set up React Query provider
- [ ] Create query hooks for content list
- [ ] Create query hooks for content detail
- [ ] Create mutation hooks for content creation
- [ ] Add optimistic updates
- [ ] Add cache invalidation
- [ ] Add background refetching

**Deliverables**:
- React Query integration

**Success Criteria**: Data fetching is efficient and cached

**UI Checkpoint**: Data loads quickly, caching works, updates are smooth

---

## Phase 8: Audio System

### Step 8.1: Build Audio Player Component
**Goal**: Create audio playback functionality

**Tasks**:
- [ ] Install and configure expo-av
- [ ] Create audio player component
- [ ] Add play/pause functionality
- [ ] Add progress bar with scrubbing
- [ ] Add time display (current/total)
- [ ] Add playback speed control
- [ ] Add background audio support
- [ ] Handle audio interruptions (calls, notifications)
- [ ] Add audio session configuration

**Deliverables**:
- Working audio player

**Success Criteria**: Can play audio, control playback, works in background

**UI Checkpoint**: See audio player, can play/pause, see progress, works in background

---

### Step 8.2: Implement Audio Recording
**Goal**: Allow users to record their voice

**Tasks**:
- [ ] Set up audio recording permissions
- [ ] Create recording interface
- [ ] Add record/stop functionality
- [ ] Add recording visualization (waveform or level meter)
- [ ] Add playback of recorded audio
- [ ] Add re-record option
- [ ] Save recording to device storage
- [ ] Upload recording to Supabase Storage

**Deliverables**:
- Working audio recording

**Success Criteria**: Can record audio, play it back, upload it

**UI Checkpoint**: Can record voice, see visualization, play back, upload works

---

### Step 8.3: Integrate Audio Storage
**Goal**: Store and retrieve audio files from Supabase Storage

**Tasks**:
- [ ] Set up Supabase Storage buckets
- [ ] Create upload function for audio files
- [ ] Create download function for audio files
- [ ] Add signed URL generation for private files
- [ ] Add progress tracking for uploads
- [ ] Add error handling for storage operations
- [ ] Add audio file metadata storage

**Deliverables**:
- Audio storage integration

**Success Criteria**: Can upload and download audio files

**UI Checkpoint**: Can upload recordings, download and play stored audio

---

## Phase 9: AI Integration

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

**Deliverables**:
- OpenAI integration ready

**Success Criteria**: Can generate content using OpenAI

**UI Checkpoint**: Can generate scripts, see them in creation flows

---

### Step 9.2: Integrate OpenAI TTS
**Goal**: Generate audio from text using OpenAI TTS

**Tasks**:
- [ ] Set up OpenAI TTS API calls
- [ ] Create TTS generation function
- [ ] Add voice selection (alloy, echo, fable, onyx, nova, shimmer)
- [ ] Add SSML support for prosody control
- [ ] Add audio format selection (mp3, opus)
- [ ] Store generated audio in Supabase Storage
- [ ] Add progress tracking for generation

**Deliverables**:
- TTS integration working

**Success Criteria**: Can generate audio from text

**UI Checkpoint**: Can generate audio, hear it play, see it stored

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

**Deliverables**:
- Conversational creation flow

**Success Criteria**: Can create content through conversation

**UI Checkpoint**: See chat interface, have conversation, generate content

---

## Phase 10: Payment & Credits

### Step 10.1: Integrate Stripe
**Goal**: Set up Stripe for payments

**Tasks**:
- [ ] Install Stripe React Native SDK
- [ ] Set up Stripe account and get API keys
- [ ] Create payment service functions
- [ ] Create checkout flow UI
- [ ] Add subscription management
- [ ] Add one-time payment support
- [ ] Handle payment success/failure
- [ ] Add receipt generation

**Deliverables**:
- Stripe integration

**Success Criteria**: Can process payments

**UI Checkpoint**: Can go through checkout, make payment, see success

---

### Step 10.2: Implement Credits System
**Goal**: Track and manage user credits

**Tasks**:
- [ ] Create credits balance display
- [ ] Add credits transaction history
- [ ] Implement credit consumption on content creation
- [ ] Add credit purchase flow
- [ ] Add credit refund logic (for errors)
- [ ] Add credit balance updates (real-time)
- [ ] Add low credit warnings

**Deliverables**:
- Credits system working

**Success Criteria**: Credits are tracked and consumed correctly

**UI Checkpoint**: See credit balance, see transactions, credits consumed on creation

---

### Step 10.3: Build Subscription Management
**Goal**: Allow users to manage subscriptions

**Tasks**:
- [ ] Create subscription status display
- [ ] Add upgrade/downgrade flow
- [ ] Add subscription cancellation
- [ ] Add billing history
- [ ] Add subscription renewal reminders
- [ ] Handle subscription expiration
- [ ] Add free tier limitations

**Deliverables**:
- Subscription management

**Success Criteria**: Can manage subscriptions

**UI Checkpoint**: See subscription status, can upgrade/downgrade, see billing

---

## Phase 11: Performance Optimization

### Step 11.1: Optimize Images and Assets
**Goal**: Reduce app size and improve load times

**Tasks**:
- [ ] Optimize all images (compress, resize)
- [ ] Use appropriate image formats (WebP where possible)
- [ ] Implement lazy loading for images
- [ ] Add image caching
- [ ] Remove unused assets
- [ ] Optimize app icon and splash screen

**Deliverables**:
- Optimized assets

**Success Criteria**: App size reduced, images load quickly

**UI Checkpoint**: Images load faster, app feels snappier

---

### Step 11.2: Optimize Rendering
**Goal**: Improve app performance and smoothness

**Tasks**:
- [ ] Use React.memo for expensive components
- [ ] Optimize list rendering (FlatList with proper keys)
- [ ] Add virtualization for long lists
- [ ] Optimize re-renders (use useMemo, useCallback)
- [ ] Add skeleton loaders instead of blank screens
- [ ] Optimize navigation transitions
- [ ] Reduce bundle size (code splitting)

**Deliverables**:
- Optimized rendering

**Success Criteria**: App is smooth, no lag, fast interactions

**UI Checkpoint**: App feels smooth and responsive

---

### Step 11.3: Optimize Network Requests
**Goal**: Reduce API calls and improve data fetching

**Tasks**:
- [ ] Implement request caching
- [ ] Add request debouncing for search
- [ ] Batch multiple requests where possible
- [ ] Add request cancellation for unmounted components
- [ ] Optimize query parameters
- [ ] Add compression for large payloads
- [ ] Implement offline support (cache data)

**Deliverables**:
- Optimized network layer

**Success Criteria**: Fewer API calls, faster data loading

**UI Checkpoint**: Data loads quickly, fewer loading states

---

## Phase 12: Testing & Quality Assurance

### Step 12.1: Set Up Testing Infrastructure
**Goal**: Prepare for testing

**Tasks**:
- [ ] Install testing libraries (Jest, React Native Testing Library)
- [ ] Configure test environment
- [ ] Create test utilities and helpers
- [ ] Set up test data factories
- [ ] Configure code coverage reporting
- [ ] Add E2E testing setup (Detox or Maestro)

**Deliverables**:
- Testing infrastructure ready

**Success Criteria**: Can run tests

**UI Checkpoint**: No UI changes

---

### Step 12.2: Write Unit Tests
**Goal**: Test individual components and functions

**Tasks**:
- [ ] Write tests for UI components
- [ ] Write tests for utility functions
- [ ] Write tests for API service functions
- [ ] Write tests for validation logic
- [ ] Write tests for state management
- [ ] Achieve >80% code coverage

**Deliverables**:
- Unit test suite

**Success Criteria**: All critical functions tested

**UI Checkpoint**: No UI changes, but confidence in code quality

---

### Step 12.3: Write Integration Tests
**Goal**: Test feature flows

**Tasks**:
- [ ] Test authentication flow
- [ ] Test content creation flow
- [ ] Test audio playback flow
- [ ] Test payment flow
- [ ] Test navigation flows
- [ ] Test error handling

**Deliverables**:
- Integration test suite

**Success Criteria**: All major flows tested

**UI Checkpoint**: No UI changes

---

### Step 12.4: Manual Testing & Bug Fixes
**Goal**: Find and fix bugs

**Tasks**:
- [ ] Test on iOS devices (various models)
- [ ] Test on Android devices (various models)
- [ ] Test on different screen sizes
- [ ] Test with slow network
- [ ] Test with no network (offline)
- [ ] Test edge cases
- [ ] Fix all critical bugs
- [ ] Fix all high-priority bugs

**Deliverables**:
- Bug-free app

**Success Criteria**: No critical bugs, app works on all devices

**UI Checkpoint**: App works perfectly on all devices

---

## Phase 13: App Store Preparation

### Step 13.1: Prepare App Store Assets
**Goal**: Create all required assets for app stores

**Tasks**:
- [ ] Create app icon (1024x1024 for iOS, various sizes for Android)
- [ ] Create splash screen
- [ ] Create screenshots for iOS (all required sizes)
- [ ] Create screenshots for Android (all required sizes)
- [ ] Create app preview video (optional but recommended)
- [ ] Write app description
- [ ] Write app keywords
- [ ] Create privacy policy
- [ ] Create terms of service
- [ ] Create support URL

**Deliverables**:
- All app store assets

**Success Criteria**: All assets ready and meet requirements

**UI Checkpoint**: See app icon and splash screen

---

### Step 13.2: Configure App Store Listings
**Goal**: Set up app store listings

**Tasks**:
- [ ] Create App Store Connect listing (iOS)
- [ ] Create Google Play Console listing (Android)
- [ ] Fill in all required information
- [ ] Upload screenshots and assets
- [ ] Set pricing and availability
- [ ] Configure in-app purchases (if applicable)
- [ ] Set up age rating
- [ ] Add app categories

**Deliverables**:
- App store listings configured

**Success Criteria**: Listings are complete and ready

**UI Checkpoint**: No UI changes

---

### Step 13.3: Build Production Apps
**Goal**: Create production builds for both platforms

**Tasks**:
- [ ] Configure app.json/app.config.js for production
- [ ] Set up code signing (iOS)
- [ ] Set up signing key (Android)
- [ ] Build iOS app (using EAS Build or Xcode)
- [ ] Build Android app (using EAS Build or Android Studio)
- [ ] Test production builds
- [ ] Optimize app size
- [ ] Verify all features work in production build

**Deliverables**:
- Production builds for iOS and Android

**Success Criteria**: Production builds work correctly

**UI Checkpoint**: Production app works perfectly

---

### Step 13.4: Submit to App Stores
**Goal**: Submit apps for review

**Tasks**:
- [ ] Submit iOS app to App Store
- [ ] Submit Android app to Google Play Store
- [ ] Respond to review feedback
- [ ] Fix any rejection issues
- [ ] Monitor submission status
- [ ] Prepare for launch

**Deliverables**:
- Apps submitted to stores

**Success Criteria**: Apps are in review

**UI Checkpoint**: Apps are live (or in review)

---

## Success Metrics

### Performance Metrics
- App launch time < 2 seconds
- Screen transition < 300ms
- API response time < 500ms
- Audio playback starts < 1 second
- App size < 50MB (initial download)

### Quality Metrics
- Crash rate < 0.1%
- Error rate < 1%
- Test coverage > 80%
- No critical bugs
- App Store rating > 4.5 stars

### User Experience Metrics
- Onboarding completion > 80%
- Content creation success rate > 90%
- Audio playback completion > 70%
- User retention (Day 7) > 40%

---

## Notes

- **Each step should be independently testable**: After completing each step, the app should run and show visible progress
- **Use Context7 for documentation**: Research best practices at each step using Context7
- **Scientific backing**: Reference scientific foundations document when implementing content generation
- **Production quality**: Every feature should be production-ready, not a prototype
- **Mobile-first**: All designs should be optimized for mobile screens
- **Accessibility**: Consider accessibility from the start (screen readers, contrast, etc.)

---

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Stripe React Native SDK](https://stripe.dev/stripe-react-native/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)

---

**Last Updated**: 2026-02-07
**Status**: Ready for Implementation
