import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { RootNavigator } from '@/navigation';
import { ThemeProvider } from '@/theme';
import { ErrorBoundary, ToastProvider } from '@/components/ui';
import { initAnalytics } from '@waqup/shared/utils';
import { initRevenueCat } from '@/services/iap';
import { useOAuthDeepLink } from '@/hooks/useOAuthDeepLink';

// ── Sentry crash reporting ────────────────────────────────────────────────────
// Set EXPO_PUBLIC_SENTRY_DSN in packages/mobile/.env (get DSN from sentry.io)
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN ?? '';
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    debug: __DEV__,
    environment: process.env.APP_ENV ?? 'development',
    tracesSampleRate: __DEV__ ? 0 : 0.2,
    // Disable Sentry in dev unless EXPO_PUBLIC_SENTRY_DEV_TEST=1 (for testing)
    enabled: __DEV__ ? process.env.EXPO_PUBLIC_SENTRY_DEV_TEST === '1' : true,
  });
}

// ── Analytics transport ───────────────────────────────────────────────────────
initAnalytics((event) => {
  if (__DEV__) {
    console.debug('[analytics]', event.name, event.properties ?? '');
  }
});

// ── RevenueCat (Apple IAP) ────────────────────────────────────────────────────
initRevenueCat();

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

function AppRoot() {
  useOAuthDeepLink();
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}

// Wrap with Sentry's native error boundary for crash reporting
export default SENTRY_DSN ? Sentry.wrap(AppRoot) : AppRoot;
