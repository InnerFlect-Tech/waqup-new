'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import {
  getOverrideUserToRestore,
  setTestSessionCookie,
} from '@/lib/auth-override';

/**
 * Auth Provider Component
 * Initializes auth state and handles protected route redirects
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isInitialized, initializeAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If an override user is stored in localStorage, restore it immediately —
    // no need to wait for Supabase which may not be configured in dev.
    const overrideUser = getOverrideUserToRestore();
    if (overrideUser) {
      setTestSessionCookie(); // Ensure cookie exists for middleware (e.g. after cookie expiry)
      useAuthStore.getState().setUser(overrideUser);
      useAuthStore.getState().setInitialized(true);
      queueMicrotask(() => setIsReady(true));
      return;
    }

    // No override user — run full Supabase auth initialization.
    let unsubscribe: (() => void) | null = null;
    initializeAuth()
      .then((unsub) => {
        unsubscribe = unsub;
      })
      .catch((err) => {
        console.error('[AuthProvider] initializeAuth failed:', err);
      })
      .finally(() => {
        setIsReady(true);
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initializeAuth]);

  useEffect(() => {
    // Handle protected route redirects
    if (!isReady || !isInitialized) return;

    const publicRoutes = [
      '/',
      '/login',
      '/signup',
      '/forgot-password',
      '/reset-password',
      '/confirm-email',
      '/auth/beta-signup',
      '/how-it-works',
      '/pricing',
      '/funnels',
      '/investors',
      '/pages',
      '/sitemap-view',
      '/system',
    ];
    const isPublicRoute =
      publicRoutes.includes(pathname) ||
      pathname.startsWith('/showcase') ||
      pathname.startsWith('/onboarding') ||
      pathname.startsWith('/explanation');
    const isProtectedRoute =
      pathname.startsWith('/home') ||
      pathname.startsWith('/library') ||
      pathname.startsWith('/create') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/sanctuary') ||
      pathname.startsWith('/speak') ||
      pathname.startsWith('/marketplace');

    if (isProtectedRoute && !user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (!isPublicRoute && !isProtectedRoute && pathname !== '/') {
      if (!user) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
      }
    }
  }, [user, isReady, isInitialized, pathname, router]);

  if (!isReady || !isInitialized) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0f',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '2px solid rgba(168,85,247,0.2)',
            borderTopColor: '#a855f7',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
