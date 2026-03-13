'use client';

import { useEffect, useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { PageShell, SuperAdminGate } from '@/components';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

/**
 * Superadmin-only page. Calls POST /api/admin/onboarding/reset to clear
 * onboarding_completed_at, then redirects to /onboarding.
 */
export default function RestartOnboardingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = theme.colors;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function reset() {
      try {
        const res = await fetch('/api/admin/onboarding/reset', {
          method: 'POST',
          credentials: 'same-origin',
        });

        if (cancelled) return;

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setErrorMessage(body?.error ?? `Request failed (${res.status})`);
          setStatus('error');
          return;
        }

        setStatus('success');
        router.push('/onboarding');
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(err instanceof Error ? err.message : 'Network error');
        setStatus('error');
      }
    }

    reset();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <SuperAdminGate>
      <PageShell intensity="strong" maxWidth={480}>
        <div
          style={{
            minHeight: '50dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.xl,
            gap: spacing.lg,
          }}
        >
          {status === 'loading' && (
            <>
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: `3px solid ${colors.glass.border}`,
                  borderTopColor: colors.accent.primary,
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <Typography variant="body" style={{ color: colors.text.secondary }}>
                Restarting onboarding…
              </Typography>
            </>
          )}

          {status === 'error' && (
            <>
              <Typography variant="h3" style={{ color: colors.text.primary }}>
                Could not restart
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center' }}>
                {errorMessage}
              </Typography>
              <Link
                href="/admin"
                style={{ color: colors.accent.primary, fontSize: 14, textDecoration: 'none' }}
              >
                Back to Admin
              </Link>
            </>
          )}
        </div>
      </PageShell>
    </SuperAdminGate>
  );
}
