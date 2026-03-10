# Technology Stack - waQup Mobile App

**Status**: ✅ Finalized | **Last Updated**: 2026-03-09

## Quick Reference

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React Native + Expo | SDK 54 |
| **Language** | TypeScript | 5.6+ |
| **Navigation** | React Navigation | v7 |
| **State** | Zustand + React Query | v4 + v5 |
| **Backend** | Supabase | Latest |
| **Audio** | expo-av | ~14.0 |
| **TTS** | ElevenLabs | Instant Voice Cloning (IVC) |
| **AI** | OpenAI | GPT-4o-mini / GPT-4 |
| **Payments** | Stripe React Native | Latest |
| **Forms** | react-hook-form + zod | Latest |
| **Animations** | react-native-reanimated | v3 |

---

## Core Decisions

### React Native + Expo ✅
**Why**: Cross-platform, cost-effective (~50% vs native), excellent Supabase support, OTA updates, App Store ready

**Key Packages**:
```json
{
  "expo": "~54.0.0",
  "react-native": "0.81.5",
  "@react-navigation/native": "^7.1.0",
  "@react-navigation/native-stack": "^7.1.0",
  "@react-navigation/bottom-tabs": "^7.1.0"
}
```

### Supabase (Backend) ✅
**Why**: Same database as web app, cost-effective (~$50-100/month), built-in auth/storage/realtime

**Configuration**:
- Use `@supabase/supabase-js` with AsyncStorage
- Set `detectSessionInUrl: false` for mobile
- Enable real-time subscriptions

### Audio: ElevenLabs + expo-av ✅
**TTS**: ElevenLabs Instant Voice Cloning (IVC)
- Implementation: `createInstantVoice`, `editVoice` in `packages/shared/src/services/ai/elevenlabs.ts`
- IVC available on all tiers including free; PVC (Professional Voice Cloning) requires paid Creator plan and is not used
- Best for long-form content (10-30 min)
- 70+ languages

**Playback**: expo-av
- Native audio playback
- Background audio support
- Handles interruptions

### AI: OpenAI ✅
**Conversations**: GPT-4o-mini (75% cost reduction)
- Fast, cost-effective
- Excellent for question generation
- Prompt caching support

**Scripts**: GPT-4 (Batch API for 50% savings)
- Highest quality
- Type-specific structures
- Batch processing for background

### Payments: Stripe ✅ (Web); Mobile pending
- **Web**: Stripe checkout (credits, subscription), Customer Portal, webhook handling — fully implemented
- **Mobile**: Stripe React Native SDK planned; credits displayed via `useCreditBalance`, but no checkout UI yet

---

## Project Structure

```
src/
├── app/              # App entry
├── screens/          # Screen components
├── components/       # Reusable components
│   ├── ui/          # UI primitives
│   └── features/    # Feature components
├── navigation/       # Navigation config
├── services/         # API services
│   ├── supabase/    # Supabase client
│   ├── api/         # API functions
│   └── storage/     # Storage functions
├── stores/           # Zustand stores
├── hooks/            # React Query hooks
├── types/            # TypeScript types
├── utils/            # Utilities
└── constants/        # Constants
```

---

## Key Patterns

### Supabase Connection
```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
```

### React Query Hook
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['content', id],
  queryFn: () => getContent(id),
  cacheTime: Infinity,
  staleTime: 5 * 60 * 1000,
});
```

### Zustand Store
```typescript
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

---

## Cost Estimates (10K Users)

- OpenAI TTS: ~$750/month
- OpenAI LLM: ~$50-200/month
- Supabase: ~$25/month
- Storage: ~$2.50/month
- Vercel: ~$20/month
- **Total**: ~$850-1,000/month

**Optimizations**:
- GPT-4o-mini for conversations (75% savings)
- Batch API for scripts (50% savings)
- Prompt caching (up to 50% additional)
- Vercel AI SDK caching (30-50% savings)

---

## References

- **Architecture**: See `02-architecture.md`
- **Audio**: See `../01-core/06-audio-generation-summary.md`
- **Implementation**: See [03-implementation.md](./03-implementation.md)
- **Multi-Platform Strategy**: See `../03-platforms/01-multi-platform-strategy.md`
- **Browser Optimization**: See `../03-platforms/02-browser-optimization-strategy.md`
