'use client';

import React from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing, SAFE_AREA_RIGHT } from '@/theme';
import Link from 'next/link';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
}

export function PlaceholderPage({
  title,
  description,
  backHref = '/home',
  backLabel = 'Back',
  children,
}: PlaceholderPageProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium">
      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: spacing.md, paddingRight: SAFE_AREA_RIGHT }}>
          <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl }}>
              {description}
            </Typography>
          )}
          {children}
          <div style={{ marginTop: spacing.xl }}>
            <Link href={backHref} style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="md" style={{ color: colors.text.secondary }}>
                {backLabel}
              </Button>
            </Link>
          </div>
        </div>
    </PageShell>
  );
}
