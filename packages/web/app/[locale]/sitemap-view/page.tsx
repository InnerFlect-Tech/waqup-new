'use client';

import React from 'react';
import { Typography, SuperAdminGate } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing } from '@/theme';
import { routesBySection } from '@/lib';
import { Link } from '@/i18n/navigation';

export default function SitemapPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const routesBySectionData = routesBySection();

  return (
    <SuperAdminGate>
    <PageShell intensity="medium" bare>
      <div style={{ padding: spacing.xl }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
            Sitemap
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xxl }}>
            Complete sitemap of all waQup routes
          </Typography>

          {Object.entries(routesBySectionData).map(([section, paths]) => (
            <div key={section} style={{ marginBottom: spacing.xl }}>
              <Typography variant="h2" style={{ marginBottom: spacing.md, color: colors.text.primary, fontSize: '1.125rem' }}>
                {section}
              </Typography>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {paths.map((path) => (
                  <li key={path} style={{ marginBottom: spacing.xs }}>
                    <Link
                      href={path}
                      style={{
                        color: colors.accent.primary,
                        textDecoration: 'none',
                        fontSize: '14px',
                      }}
                    >
                      {path}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ marginTop: spacing.lg, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
            <Link href="/pages" style={{ color: colors.accent.primary, fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>
              Pages index
            </Link>
            <Link href="/system" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>
              System
            </Link>
            <Link href="/system/creation-steps" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>
              Creation Steps
            </Link>
            <Link href="/admin" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
    </SuperAdminGate>
  );
}
