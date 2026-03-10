'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components';
import { useAuthStore } from '@/stores';
import { Analytics } from '@waqup/shared/utils';
import { OVERRIDE_STORAGE_KEY } from '@/lib/override-auth';
import type { User } from '@supabase/supabase-js';

/**
 * Test login (no DB) — uses /api/auth/override when env is configured.
 * Only rendered when NEXT_PUBLIC_ENABLE_TEST_LOGIN=true.
 * For E2E and local dev only.
 */
export function TestLoginButton() {
  const router = useRouter();
  const { setUser, setSession } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = process.env.NEXT_PUBLIC_OVERRIDE_LOGIN_EMAIL?.trim();
  const password = process.env.NEXT_PUBLIC_OVERRIDE_LOGIN_PASSWORD;

  if (process.env.NEXT_PUBLIC_ENABLE_TEST_LOGIN !== 'true') return null;
  if (!email || !password) return null;

  const handleTestLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data?.error || 'Override login failed');
        return;
      }

      const overrideUser: User = {
        id: `override-${email}`,
        email: email,
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User;

      setUser(overrideUser);
      setSession(null);
      if (typeof window !== 'undefined') {
        localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify(overrideUser));
      }
      Analytics.loginCompleted('override', overrideUser.id);
      router.push('/coming-soon');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 16, textAlign: 'center' }}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleTestLogin}
        disabled={loading}
        data-testid="test-login-button"
      >
        {loading ? 'Signing in...' : 'Test login'}
      </Button>
      {error && (
        <p style={{ color: 'var(--color-error)', fontSize: 14, marginTop: 8 }}>{error}</p>
      )}
    </div>
  );
}
