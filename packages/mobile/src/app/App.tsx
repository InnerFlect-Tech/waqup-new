import { StatusBar } from 'expo-status-bar';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootNavigator } from '@/navigation';
import { ThemeProvider } from '@/theme';
import { ErrorBoundary, ToastProvider } from '@/components/ui';
import { initAnalytics } from '@waqup/shared/utils';

// Initialise analytics transport (dev logs only; wire to PostHog/etc. for production)
initAnalytics((event) => {
  if (__DEV__) {
    console.debug('[analytics]', event.name, event.properties ?? '');
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000, // 24h for offline persistence
      retry: 2,
    },
    mutations: {
      retry: 0,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'waqup-query-cache',
  throttleTime: 1000,
});

export default function App() {
  return (
    <ErrorBoundary>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        <ThemeProvider defaultThemeName="mystical-purple">
          <ToastProvider>
            <RootNavigator />
            <StatusBar style="light" />
          </ToastProvider>
        </ThemeProvider>
      </PersistQueryClientProvider>
    </ErrorBoundary>
  );
}
