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
 */
export function TestLoginButton() {
  const { theme } = useTheme();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const setSession = useAuthStore((s) => s.setSession);
  const setError = useAuthStore((s) => s.setError);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  if (!ENABLE_TEST_LOGIN) return null;

  const isOverrideUser = user?.id?.startsWith?.('override-') ?? false;

  const handleTestLogin = () => {
    setError(null);
    const overrideUser = applyOverrideLogin(TEST_USER_EMAIL);
    setUser(overrideUser);
    setSession(null);
    router.push('/pages');
  };

  const handleTestLogout = () => {
    clearStoredOverride();
    clearAuth();
    router.push('/login');
  };

  const buttonStyle: React.CSSProperties = {
    borderColor: theme.colors.warning ?? theme.colors.accent.secondary,
    color: theme.colors.warning ?? theme.colors.accent.secondary,
    fontSize: '13px',
  };

  if (isOverrideUser) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
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
      size="sm"
      onClick={handleTestLogin}
      style={buttonStyle}
    >
      Test login (no DB)
    </Button>
  );
}
