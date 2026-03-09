'use client';

import React from 'react';
import { Typography, SuperAdminGate } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing } from '@/theme';
import { routesBySection } from '@/lib';
import Link from 'next/link';

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

          <Link href="/pages" style={{ textDecoration: 'none', marginTop: spacing.lg, display: 'inline-block' }}>
            <Typography variant="body" style={{ color: colors.accent.primary, fontWeight: 500 }}>
              View full pages index
            </Typography>
          </Link>
        </div>
      </div>
    </PageShell>
    </SuperAdminGate>
  );
}
