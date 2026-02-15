'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { getOverrideUserToRestore } from '@/lib/auth-override';

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
    // Initialize auth state on mount
    let unsubscribe: (() => void) | null = null;
    
    initializeAuth().then((unsub) => {
      unsubscribe = unsub;
      // If no Supabase session but override is stored, restore override user so pages are visible
      const overrideUser = getOverrideUserToRestore();
      if (overrideUser) {
        useAuthStore.getState().setUser(overrideUser);
      }
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
      '/pages',
      '/sitemap',
    ];
    const isPublicRoute =
      publicRoutes.includes(pathname) ||
      pathname.startsWith('/showcase') ||
      pathname.startsWith('/onboarding');
    const isProtectedRoute =
      pathname.startsWith('/home') ||
      pathname.startsWith('/library') ||
      pathname.startsWith('/create') ||
      pathname.startsWith('/profile') ||
      pathname.startsWith('/sanctuary');

    if (isProtectedRoute && !user) {
      // Redirect to login if trying to access protected route without auth
      router.push('/login');
    } else if (!isPublicRoute && !isProtectedRoute && pathname !== '/') {
      // If on an unknown route and not authenticated, redirect to home or login
      if (!user) {
        router.push('/login');
      }
    }
  }, [user, isReady, isInitialized, pathname, router]);

  // Show nothing while initializing
  if (!isReady || !isInitialized) {
    return null; // Or a loading screen component
  }

  return <>{children}</>;
}
