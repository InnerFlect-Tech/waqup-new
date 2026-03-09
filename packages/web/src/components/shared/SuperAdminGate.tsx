'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSuperAdmin } from '@/hooks';
import { useAuthStore } from '@/stores';
import { PageShell } from './PageShell';

/**
 * Wraps superadmin-only pages.
 * - Unauthenticated → redirects to /login
 * - Authenticated but not superadmin → redirects to /sanctuary
 * - Superadmin → renders children
 */
export function SuperAdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.isLoading);
  const { isSuperAdmin, isLoading: roleLoading } = useSuperAdmin();

  const isLoading = authLoading || roleLoading;

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (!isSuperAdmin) {
      router.replace('/sanctuary');
    }
  }, [isLoading, user, isSuperAdmin, router]);

  if (isLoading) {
    return (
      <PageShell intensity="light" bare>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            color: 'rgba(255,255,255,0.4)',
            fontSize: 14,
          }}
        >
          Verifying access...
        </div>
      </PageShell>
    );
  }

  if (!user || !isSuperAdmin) {
    return null;
  }

  return <>{children}</>;
}
