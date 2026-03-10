'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/theme';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { AppLayout } from '@/components';
import { ToastProvider } from '@/components/ui/Toast';
import { CookieConsentBanner } from '@/components/analytics';

/**
 * Single client boundary for all app providers.
 * Ensures QueryClientProvider is in the same React tree as pages that use useQuery,
 * avoiding "No QueryClient set" errors from split client boundaries.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultThemeName="mystical-purple">
        <AuthProvider>
          <ToastProvider>
            <AppLayout>{children}</AppLayout>
            <CookieConsentBanner />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
