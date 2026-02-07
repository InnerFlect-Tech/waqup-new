# Implementation Guide - waQup Mobile App

**Status**: 📝 Active | **Last Updated**: 2026-02-07

## Quick Start

1. **Follow Roadmap**: `../../rebuild-roadmap/01-planning/01-roadmap.md`
2. **Update Changelog**: `../../rebuild-roadmap/03-tracking/01-changelog.md` after each step
3. **Reference This Guide**: For patterns and gotchas

---

## Essential Patterns

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
      detectSessionInUrl: false, // Important for mobile
    },
  }
);
```

### Audio Playback (expo-av)
```typescript
import { Audio } from 'expo-av';

const { sound } = await Audio.Sound.createAsync(
  { uri: audioUrl },
  { shouldPlay: true }
);

// Background audio config in app.json
{
  "expo": {
    "plugins": [["expo-av", {
      "microphonePermission": "Allow waQup to access your microphone."
    }]],
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["audio"]
      }
    }
  }
}
```

### React Query Hook
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['content', contentId],
  queryFn: () => getContent(contentId),
  cacheTime: Infinity,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Zustand Store
```typescript
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### Forms (react-hook-form + zod)
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

### Real-Time Subscriptions
```typescript
useEffect(() => {
  const channel = supabase
    .channel('content-changes')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'content_items',
      filter: `user_id=eq.${userId}`,
    }, (payload) => {
      queryClient.invalidateQueries(['content']);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [userId]);
```

---

## Common Gotchas

### 1. AsyncStorage Keys
- Use consistent naming
- Handle migration if keys change

### 2. Navigation State
- Don't mutate directly
- Use navigation actions

### 3. Audio Session
- Configure properly in app.json
- Handle interruptions gracefully

### 4. Image Loading
- Optimize images (WebP when possible)
- Use proper formats

### 5. Bundle Size
- Monitor size
- Use code splitting
- Remove unused deps

---

## Platform-Specific

### iOS
- Configure Info.plist properly
- Handle background audio
- Test on different iOS versions
- Follow App Store guidelines

### Android
- Configure permissions properly
- Handle back button
- Test on different Android versions
- Follow Play Store guidelines

---

## Error Handling

```typescript
try {
  await createContent(data);
} catch (error) {
  if (error.code === 'NETWORK_ERROR') {
    showError('No internet connection');
  } else {
    showError('Something went wrong. Please try again.');
  }
  logError(error);
}
```

---

## Testing

### Unit Tests
- Utilities
- Components
- Hooks
- Services

### Integration Tests
- Feature flows
- Navigation
- State management

### E2E Tests
- Critical flows
- Real devices
- Offline scenarios

**Target**: >80% code coverage

---

## Performance Tips

1. **Lazy Load Screens**: Use `React.lazy()`
2. **Memo Expensive Components**: Use `React.memo()`
3. **Optimize Images**: WebP, compression
4. **Cache Aggressively**: React Query + local storage
5. **Avoid Unnecessary Re-renders**: Use `useCallback`, `useMemo`

---

## References

- **Technology Stack**: See [01-technology-stack.md](./01-technology-stack.md)
- **Architecture**: See [02-architecture.md](./02-architecture.md)
- **Multi-Platform Strategy**: See `../03-platforms/01-multi-platform-strategy.md`
- **Browser Optimization**: See `../03-platforms/02-browser-optimization-strategy.md`
- **Roadmap**: See `../../rebuild-roadmap/01-planning/01-roadmap.md`
- **Product Docs**: See `../../docs/internal/`
