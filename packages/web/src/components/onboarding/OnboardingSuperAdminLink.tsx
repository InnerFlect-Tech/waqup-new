'use client';

import React from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { RotateCcw } from 'lucide-react';
import { useSuperAdmin } from '@/hooks';
import { useTheme, spacing } from '@/theme';

/**
 * Shows a "Restart onboarding" link on onboarding pages when user is superadmin.
 * Onboarding pages hide the main nav, so this is the only way to access restart
 * while testing the flow.
 */
export function OnboardingSuperAdminLink() {
  const pathname = usePathname();
  const { actualIsSuperAdmin } = useSuperAdmin();
  const { theme } = useTheme();
  const colors = theme.colors;

  const isOnboarding =
    (pathname?.includes('/onboarding') ?? false);

  if (!actualIsSuperAdmin || !isOnboarding) return null;

  return (
    <Link
      href="/admin/onboarding/reset"
      style={{
        position: 'fixed',
        bottom: spacing.lg,
        right: spacing.lg,
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.xs,
        padding: `${spacing.xs} ${spacing.sm}`,
        fontSize: 12,
        fontWeight: 500,
        color: colors.accent.tertiary,
        background: 'rgba(168,85,247,0.12)',
        border: `1px solid ${colors.accent.tertiary}40`,
        borderRadius: 6,
        textDecoration: 'none',
        zIndex: 9999,
      }}
    >
      <RotateCcw size={14} />
      Restart onboarding
    </Link>
  );
}
