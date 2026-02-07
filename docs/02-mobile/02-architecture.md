# Architecture - waQup Mobile App

**Status**: ✅ Defined | **Last Updated**: 2026-02-07

## Overview

Mobile app architecture optimized for React Native + Expo, sharing Supabase backend with web app.

```
Mobile App (React Native)
    ↓
Supabase Backend (PostgreSQL, Auth, Storage, Realtime)
    ↓
External Services (ElevenLabs, OpenAI, Stripe)
```

---

## App Layers

### 1. Presentation Layer
**Screens** (`src/screens/`):
- Auth (Login, Signup, ForgotPassword)
- Main (Home, Library, Create, Profile)
- Content (Detail screens, Creation flows)

**Components** (`src/components/`):
- UI primitives (Button, Input, Card)
- Features (AudioPlayer, ContentCard)
- Layouts (Header, TabBar)

### 2. State Management
**Global State** (Zustand - `src/stores/`):
- Auth store (user, session)
- UI store (modals, loading)
- Preferences store

**Server State** (React Query - `src/hooks/`):
- Content queries
- User profile
- Practice sessions
- Real-time subscriptions

### 3. Service Layer
**API Services** (`src/services/`):
- Supabase client
- Content API
- Audio API
- Payment API
- Auth API

**Storage** (`src/services/storage/`):
- Audio upload/download
- File management

### 4. Navigation Layer
**Structure** (`src/navigation/`):
- RootNavigator (Auth vs Main)
- AuthNavigator (Stack)
- MainNavigator (Bottom Tabs)
- ContentNavigator (Stack)

---

## Data Flow

### Content Creation
```
User Input → Validation → Service → Supabase → External API → Process → Update State → UI
```

### Audio Playback
```
User Taps Play → Audio Service → Load from Storage → Play → Track Progress → Record Session
```

---

## Key Decisions

### Offline-First
- Cache content locally (React Query)
- Store audio files locally
- Queue actions when offline
- Sync when online

### Real-Time Updates
- Supabase Realtime subscriptions
- Update React Query cache automatically
- Live UI updates

### Audio Handling
- Background audio support
- Handle interruptions gracefully
- Cache audio files locally
- Stream from CDN

### Performance
- Lazy load screens
- Optimize images
- Code splitting
- Memoization

---

## Integration Points

### Supabase
- **Database**: PostgreSQL queries
- **Auth**: Supabase Auth v2 with PKCE
- **Storage**: Audio file upload/download
- **Realtime**: Live updates

### External APIs
- **ElevenLabs**: Voice cloning, TTS
- **OpenAI**: Conversations, script generation
- **Stripe**: Payments, subscriptions

---

## Security

- Supabase Auth v2 with PKCE
- Secure token storage (Keychain/Keystore)
- HTTPS only
- RLS policies
- GDPR compliant

---

## Performance Targets

- App launch: < 2s
- Screen transition: < 300ms
- API response: < 500ms
- Audio playback start: < 1s
- Bundle size: < 50MB

---

## References

- **Full Architecture**: See `../../../docs/internal/05-system-architecture.md`
- **Implementation**: See [03-implementation.md](./03-implementation.md)
- **Multi-Platform Strategy**: See `../03-platforms/01-multi-platform-strategy.md`
