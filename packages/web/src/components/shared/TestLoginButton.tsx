'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components';
import { useTheme } from '@/theme';
import { useAuthStore } from '@/stores';
import { applyOverrideLogin, clearStoredOverride } from '@/lib/auth-override';

const TEST_USER_EMAIL = 'test@waqup.app';
const ENABLE_TEST_LOGIN = process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN === 'true';

/**
 * Temporary test login/logout button. No database — sets a fake user in the store.
 * Only rendered when NEXT_PUBLIC_ENABLE_TEST_LOGIN=true. Remove when done testing.
 *
 * Uses full page navigation (window.location) after test login so the cookie is
 * reliably sent with the next request — fixes mobile Safari / client-nav timing.
 */
export function TestLoginButton() {
  const { theme } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const setError = useAuthStore((s) => s.setError);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  if (!ENABLE_TEST_LOGIN) return null;

  const isOverrideUser = user?.id?.startsWith?.('override-') ?? false;

  const handleTestLogin = () => {
    setError(null);
    applyOverrideLogin(TEST_USER_EMAIL);
    setUser({
      id: `override-${TEST_USER_EMAIL}`,
      email: TEST_USER_EMAIL,
      aud: 'override',
      role: 'override',
      email_confirmed_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_anonymous: false,
    } as ReturnType<typeof applyOverrideLogin>);
    // Full page navigation ensures cookie is sent with request (fixes mobile)
    if (typeof window !== 'undefined') {
      window.location.href = '/sanctuary';
    } else {
      router.push('/sanctuary');
    }
  };

  const handleTestLogout = () => {
    clearStoredOverride();
    clearAuth();
    router.push('/login');
  };

  const buttonStyle: React.CSSProperties = {
    borderColor: theme.colors.warning ?? theme.colors.accent.secondary,
    color: theme.colors.warning ?? theme.colors.accent.secondary,
    fontSize: '14px',
    minHeight: 44,
    minWidth: 44,
    padding: '10px 20px',
  };

  if (isOverrideUser) {
    return (
      <Button
        type="button"
        variant="outline"
        size="md"
        onClick={handleTestLogout}
        style={buttonStyle}
      >
        Test logout
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="md"
      onClick={handleTestLogin}
      style={buttonStyle}
    >
      Test login (no DB)
    </Button>
  );
}
