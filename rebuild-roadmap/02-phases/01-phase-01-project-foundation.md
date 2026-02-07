# Phase 1: Project Foundation - Detailed Analysis

## Overview
**Goal**: Set up clean, production-ready projects for Mobile (React Native + Expo for Android/iOS) and Web (Next.js for desktop browsers) simultaneously, configure all core dependencies, and establish connection to Supabase across both platforms
**Status**: NOW → AFTER
**Dependencies**: None (starting point)
**Strategy**: Parallel development - Mobile and Web platforms set up simultaneously

## Changelog

### 2026-02-07 - Initial Analysis Created
- **Status**: 📝 Analysis Complete
- **Notes**: Created detailed phase analysis document with NOW/AFTER comparison, schema verification, and 5 implementation steps
- **Next**: Begin Step 1.1 (Initialize React Native Expo Project)

---

## Current State Analysis (NOW)

### Current Implementation
**Location**: `../../../` (Next.js web app - parent waqup-app directory)

**What Exists**:
- ✅ Next.js 14 App Router application
- ✅ Supabase integration (web)
- ✅ TypeScript configuration
- ✅ Tailwind CSS styling
- ✅ Authentication system (web)
- ✅ Database schema (PostgreSQL)
- ✅ API routes (Next.js API routes)

**Current Tech Stack**:
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel
- **State Management**: React Context, Zustand (partial)
- **Audio**: Web Audio API

**Current Project Structure**:
```
waqup-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── (sanctuary)/       # Protected routes
│   ├── (onboarding)/      # Onboarding flow
│   ├── (marketing)/       # Marketing pages
│   ├── api/               # API routes
│   ├── components/        # React components
│   └── lib/               # Utilities
├── docs/                  # Documentation
├── public/                # Static assets
├── supabase/              # Supabase config
└── package.json           # Dependencies
```

**Current Limitations**:
1. ❌ Web-only (not mobile)
2. ❌ No React Native setup
3. ❌ No Expo configuration
4. ❌ No mobile-specific dependencies
5. ❌ No mobile navigation structure
6. ⚠️ Some dependencies may not work on mobile

**Current Issues**:
- Web Audio API won't work on mobile (need expo-av)
- Next.js API routes won't work (need separate backend or Supabase Edge Functions)
- Web-specific components need mobile equivalents
- No mobile app structure

---

## Target State (AFTER)

### Target Implementation
**New Location**: `../` (React Native app will be created in this waqup-new directory, alongside rebuild-roadmap)

**What Will Exist**:
- ✅ React Native + Expo project (Mobile: Android + iOS)
- ✅ Next.js project (Web: Desktop browsers)
- ✅ TypeScript configuration (both platforms)
- ✅ Expo managed workflow (mobile)
- ✅ Mobile navigation (React Navigation)
- ✅ Web navigation (Next.js App Router)
- ✅ Supabase integration (both platforms)
- ✅ Shared business logic package
- ✅ Platform-optimized project structures
- ✅ Environment configuration
- ✅ Development tooling

**Target Tech Stack**:
- **Frontend**: React Native, Expo, TypeScript
- **Navigation**: React Navigation (Stack + Tabs)
- **State Management**: Zustand + React Query
- **Backend**: Supabase (same database)
- **Audio**: expo-av
- **Forms**: react-hook-form + zod
- **UI**: Custom components + react-native-reanimated

**Target Project Structure**:
```
waqup-mobile/
├── src/
│   ├── app/               # App entry point
│   ├── screens/           # Screen components
│   │   ├── auth/
│   │   ├── main/
│   │   └── content/
│   ├── components/        # Reusable components
│   │   ├── ui/            # UI primitives
│   │   └── features/      # Feature components
│   ├── navigation/        # Navigation config
│   ├── services/          # API services
│   │   ├── supabase/
│   │   ├── api/
│   │   └── storage/
│   ├── stores/            # Zustand stores
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript types
│   ├── utils/             # Utilities
│   └── constants/         # Constants
├── assets/                # Images, fonts, etc.
├── app.json               # Expo config
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

**Improvements**:
1. ✅ Mobile-first architecture
2. ✅ Cross-platform (iOS + Android)
3. ✅ Native performance
4. ✅ Offline support capability
5. ✅ Push notifications ready
6. ✅ App store deployment ready

---

## Schema Verification

### Current Schema (NOW)
**Status**: ✅ Database exists and is well-structured

**Key Tables**:
- `users` ✅
- `rituals` ✅ (needs migration to `content_items`)
- `recordings` ✅
- `practice_sessions` ✅
- `sanctuary_progress` ✅
- `achievements` ✅
- `user_achievements` ✅

**Missing Tables** (see SCHEMA_VERIFICATION.md):
- ❌ `content_items` (unified table)
- ❌ `credit_transactions`
- ❌ `conversations`

### Target Schema (AFTER)
**Status**: Same database, mobile app will use it

**No Schema Changes Required** for Phase 1, but:
- ⚠️ Need to verify Supabase connection works from React Native
- ⚠️ Need to test RLS policies work with mobile app
- ⚠️ Need to verify storage access works

### Schema Coherence Check
- [x] Database exists and is accessible
- [x] Supabase project configured
- [ ] Test connection from React Native
- [ ] Verify RLS policies work
- [ ] Test storage access

---

## Implementation Steps

### Step 1.1: Initialize All Platform Projects
**Goal**: Create Mobile (React Native + Expo) and Web (Next.js) projects with TypeScript

**Tasks**:
- [ ] Initialize Mobile: Run `npx create-expo-app@latest mobile --template blank-typescript`
- [ ] Initialize Web: Run `npx create-next-app@latest web --typescript --app`
- [ ] Initialize Shared: Create shared package structure
- [ ] Configure workspace: Set up monorepo with workspaces
- [ ] Verify project structures
- [ ] Test Mobile: `npm start` works, displays on iOS/Android
- [ ] Test Web: `npm run dev` works, loads in browser

**Code Changes**:
```bash
# Mobile
npx create-expo-app@latest mobile --template blank-typescript

# Web
npx create-next-app@latest web --typescript --app --tailwind --eslint

# Shared
mkdir -p packages/shared/src/{services,stores,types,utils,schemas}
```

**Testing**:
- [ ] Mobile project creates successfully
- [ ] Web project creates successfully
- [ ] Shared package structure created
- [ ] `npm start` (mobile) runs without errors
- [ ] `npm run dev` (web) runs without errors
- [ ] Mobile app displays on iOS simulator/Android emulator
- [ ] Web app loads in browser

**Success Criteria**:
- [ ] Mobile: Expo project created, TypeScript configured
- [ ] Web: Next.js project created, TypeScript configured
- [ ] Shared: Package structure created
- [ ] Both platforms can import from shared
- [ ] Both platforms run successfully

**UI Checkpoint**: 
- Mobile: Expo welcome screen on iOS/Android
- Web: Next.js welcome page in browser

---

### Step 1.2: Configure Project Structure
**Goal**: Set up organized folder structure

**Tasks**:
- [ ] Create `src/` directory
- [ ] Create subdirectories (screens, components, services, etc.)
- [ ] Move App.tsx to `src/app/App.tsx`
- [ ] Update imports
- [ ] Configure path aliases in `tsconfig.json`
- [ ] Update `app.json` with app metadata

**Code Changes**:
```json
// tsconfig.json - Add path aliases
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@screens/*": ["src/screens/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@stores/*": ["src/stores/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

```json
// app.json - App configuration
{
  "expo": {
    "name": "waQup",
    "slug": "waqup",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "ios": {
      "bundleIdentifier": "com.waqup.app"
    },
    "android": {
      "package": "com.waqup.app"
    }
  }
}
```

**Testing**:
- [ ] Imports work with path aliases
- [ ] App still runs after restructuring
- [ ] No TypeScript errors

**Success Criteria**:
- [ ] Folder structure created
- [ ] Path aliases working
- [ ] App runs successfully

**UI Checkpoint**: Same welcome screen (no visual changes)

---

### Step 1.3: Install Core Dependencies
**Goal**: Install all essential libraries

**Tasks**:
- [ ] Install navigation: `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`
- [ ] Install navigation dependencies: `react-native-screens`, `react-native-safe-area-context`
- [ ] Install state: `zustand`, `@tanstack/react-query`
- [ ] Install Supabase: `@supabase/supabase-js`
- [ ] Install audio: `expo-av`
- [ ] Install forms: `react-hook-form`, `zod`, `@hookform/resolvers`
- [ ] Install UI: `react-native-reanimated`, `react-native-gesture-handler`
- [ ] Install utilities: `date-fns`, `uuid`, `axios`
- [ ] Install dev tools: `@types/react`, `@types/react-native`

**Code Changes**:
```json
// package.json - Dependencies
{
  "dependencies": {
    "expo": "~54.0.0",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "react-native-screens": "~3.31.0",
    "react-native-safe-area-context": "4.10.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "expo-av": "~14.0.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "react-native-reanimated": "~3.10.0",
    "react-native-gesture-handler": "~2.16.0",
    "date-fns": "^3.0.0",
    "uuid": "^9.0.0",
    "axios": "^1.6.0"
  }
}
```

**Testing**:
- [ ] All packages install without errors
- [ ] No peer dependency warnings
- [ ] App still runs

**Success Criteria**:
- [ ] All dependencies installed
- [ ] No conflicts
- [ ] App runs successfully

**UI Checkpoint**: Same welcome screen (no visual changes)

---

### Step 1.4: Configure Supabase Connection
**Goal**: Set up Supabase client for React Native

**Tasks**:
- [ ] Create `.env` file with Supabase credentials
- [ ] Install `expo-constants` for environment variables
- [ ] Create `src/services/supabase/client.ts`
- [ ] Configure Supabase client
- [ ] Test connection with simple query
- [ ] Create types file for Supabase types

**Code Changes**:
```typescript
// src/services/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = Constants.expoConfig?.extra?.supabasePublishableKey || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage, // Need to install @react-native-async-storage/async-storage
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Test connection
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { success: false, error };
  }
}
```

```typescript
// app.config.js - Add environment variables
export default {
  expo: {
    // ... other config
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabasePublishableKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    },
  },
};
```

```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

**Testing**:
- [ ] Connection test succeeds
- [ ] Can query users table
- [ ] No CORS errors
- [ ] Auth works (test login)

**Success Criteria**:
- [ ] Supabase client configured
- [ ] Connection test passes
- [ ] Can query database

**UI Checkpoint**: Console log showing successful connection (no UI changes)

---

### Step 1.5: Set Up Navigation Structure
**Goal**: Create navigation with all main routes

**Tasks**:
- [ ] Install navigation dependencies
- [ ] Create `src/navigation/types.ts` (TypeScript types)
- [ ] Create `src/navigation/AuthNavigator.tsx` (Stack)
- [ ] Create `src/navigation/MainNavigator.tsx` (Tabs)
- [ ] Create `src/navigation/RootNavigator.tsx` (Root)
- [ ] Create placeholder screens for all routes
- [ ] Set up navigation in App.tsx

**Code Changes**:
```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  Create: undefined;
  Profile: undefined;
};
```

```typescript
// src/navigation/RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**Testing**:
- [ ] Navigation works
- [ ] Can navigate between screens
- [ ] TypeScript types work
- [ ] No navigation errors

**Success Criteria**:
- [ ] Navigation structure in place
- [ ] All routes accessible
- [ ] TypeScript types correct

**UI Checkpoint**: See navigation bar, can tap between tabs, see empty screens

---

## Verification Checklist

### Code Quality
- [x] TypeScript configured
- [ ] ESLint configured
- [ ] Prettier configured
- [ ] Git hooks set up

### Project Structure
- [ ] Folder structure organized
- [ ] Path aliases working
- [ ] Imports resolve correctly

### Dependencies
- [ ] All packages installed
- [ ] No conflicts
- [ ] Versions compatible

### Supabase
- [ ] Connection working
- [ ] Can query database
- [ ] Auth configured
- [ ] Storage accessible

### Navigation
- [ ] Navigation works
- [ ] All routes accessible
- [ ] Types correct

---

## Documentation Updates Required

- [ ] Update README with mobile setup
- [ ] Document environment variables
- [ ] Document project structure
- [ ] Document navigation structure

---

## Risks & Mitigation

### Technical Risks
1. **Risk**: Expo version compatibility issues
   - **Impact**: High
   - **Mitigation**: Use latest stable Expo SDK, test on both platforms

2. **Risk**: Supabase React Native SDK issues
   - **Impact**: High
   - **Mitigation**: Use official SDK, test connection early, check documentation

3. **Risk**: Navigation setup complexity
   - **Impact**: Medium
   - **Mitigation**: Follow React Navigation docs, start simple, add complexity gradually

---

## References

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

---

**Last Updated**: 2026-02-07
**Status**: Ready for Implementation
