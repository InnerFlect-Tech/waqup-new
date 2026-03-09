'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { useSuperAdmin } from '@/hooks';

/**
 * Auth Provider Component
 * Initializes auth state, handles protected route redirects, and gates
 * access to the app based on profiles.access_granted.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isInitialized, initializeAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  // Fetch profile-level access from DB (role + access_granted).
  // Only fires when user changes; returns immediately (isLoading=false) when no user.
  const { hasAccess, isLoading: isProfileLoading } = useSuperAdmin();

  useEffect(() => {
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

  const isProtectedRoute =
    pathname.startsWith('/home') ||
    pathname.startsWith('/library') ||
    pathname.startsWith('/create') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/sanctuary') ||
    pathname.startsWith('/speak') ||
    pathname.startsWith('/marketplace');

  useEffect(() => {
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
      '/coming-soon',
      '/waitlist',
    ];
    const isPublicRoute =
      publicRoutes.includes(pathname) ||
      pathname.startsWith('/showcase') ||
      pathname.startsWith('/onboarding') ||
      pathname.startsWith('/explanation');

    if (isProtectedRoute && !user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    // Authenticated but profile not yet loaded — wait before access check.
    if (isProtectedRoute && user && isProfileLoading) return;

    // Authenticated but no access granted — send to coming soon.
    if (isProtectedRoute && user && !hasAccess) {
      router.replace('/coming-soon');
      return;
    }

    if (!isPublicRoute && !isProtectedRoute && pathname !== '/') {
      if (!user) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
      }
    }
  }, [user, isReady, isInitialized, pathname, router, isProtectedRoute, hasAccess, isProfileLoading]);

  const showSpinner =
    !isReady ||
    !isInitialized ||
    (isProtectedRoute && !user) ||
    (isProtectedRoute && user && isProfileLoading);

  if (showSpinner) {
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
