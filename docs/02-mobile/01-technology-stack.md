# Technology Stack - waQup Mobile App

**Status**: ✅ Finalized | **Last Updated**: 2026-02-07

## Quick Reference

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React Native + Expo | SDK 54 |
| **Language** | TypeScript | 5.6+ |
| **Navigation** | React Navigation | v6 |
| **State** | Zustand + React Query | v4 + v5 |
| **Backend** | Supabase | Latest |
| **Audio** | expo-av | ~14.0 |
| **TTS** | ElevenLabs | Professional Voice Cloning |
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
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/stack": "^6.3.0",
  "@react-navigation/bottom-tabs": "^6.5.0"
}
```

### Supabase (Backend) ✅
**Why**: Same database as web app, cost-effective (~$50-100/month), built-in auth/storage/realtime

**Configuration**:
- Use `@supabase/supabase-js` with AsyncStorage
- Set `detectSessionInUrl: false` for mobile
- Enable real-time subscriptions

### Audio: ElevenLabs + expo-av ✅
**TTS**: ElevenLabs Professional Voice Cloning
- Enterprise-grade (10,000+ businesses)
- Best for long-form content (10-30 min)
- 70+ languages
- Professional quality

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

### Payments: Stripe React Native SDK ✅
- Official SDK
- Native payment UI
- Apple Pay / Google Pay
- Secure (PCI compliant)

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

- **Full Details**: See `../../../docs/internal/05-system-architecture.md`
- **Audio Details**: See `../../../docs/internal/audio-generation.md`
- **Implementation**: See [03-implementation.md](./03-implementation.md)
- **Multi-Platform Strategy**: See `../03-platforms/01-multi-platform-strategy.md`
- **Browser Optimization**: See `../03-platforms/02-browser-optimization-strategy.md`
