'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useAuthStore } from '@/stores';
import { useSuperAdmin } from '@/hooks';
import { OVERRIDE_STORAGE_KEY } from '@/lib/override-auth';

/**
 * Auth Provider Component
 * Initializes auth state, handles protected route redirects, and gates
 * access to the app based on profiles.access_granted.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isInitialized, initializeAuth, setUser, setSession, setInitialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const mountedRef = useRef(true);

  // Fetch profile-level access from DB (role + access_granted).
  // Only fires when user changes; returns immediately (isLoading=false) when no user.
  const { hasAccess, isLoading: isProfileLoading } = useSuperAdmin();

  useEffect(() => {
    mountedRef.current = true;
    if (typeof window === 'undefined') return;

    const overrideRaw = localStorage.getItem(OVERRIDE_STORAGE_KEY);
    if (overrideRaw) {
      try {
        const overrideUser = JSON.parse(overrideRaw) as { id?: string; email?: string };
        if (overrideUser?.id) {
          setUser(overrideUser as Parameters<typeof setUser>[0]);
          setSession(null);
          setInitialized(true);
          setIsReady(true);
          return;
        }
      } catch {
        localStorage.removeItem(OVERRIDE_STORAGE_KEY);
      }
    }

    let unsubscribe: (() => void) | null = null;
    initializeAuth()
      .then((unsub) => {
        unsubscribe = unsub;
      })
      .catch((err) => {
        console.error('[AuthProvider] initializeAuth failed:', err);
      })
      .finally(() => {
        if (mountedRef.current) setIsReady(true);
      });

    return () => {
      mountedRef.current = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initializeAuth, setUser, setSession, setInitialized]);

  const isProtectedRoute =
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
      '/launch',
      '/login',
      '/signup',
      '/forgot-password',
      '/reset-password',
      '/confirm-email',
      '/how-it-works',
      '/pricing',
      '/get-qs', // Public Q packs — anyone can view; login required only when buying
      '/funnels',
      '/investors',
      '/for-teachers',
      '/for-coaches',
      '/for-studios',
      '/for-creators',
      // Superadmin routes (/pages, /sitemap-view, /system, /admin/*, /health, /showcase) excluded — require auth; SuperAdminGate handles role check
      '/coming-soon',
      '/waitlist',
      '/join', // Founding member signup — footer + popup target
      '/privacy',
      '/terms',
      '/data-deletion',
    ];
    const isPublicRoute =
      publicRoutes.includes(pathname) ||
      pathname.startsWith('/showcase') ||
      pathname.startsWith('/onboarding') ||
      pathname.startsWith('/explanation') ||
      pathname.startsWith('/our-story') ||
      pathname.startsWith('/play') || // Public audio player for sharing
      pathname.includes('/for-teachers') ||
      pathname.includes('/for-coaches') ||
      pathname.includes('/for-studios') ||
      pathname.includes('/for-creators');

    if (isProtectedRoute && !user) {
      router.replace('/');
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
        router.replace('/');
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
