'use client';

import React from 'react';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, ThemeSelector, AppHeader } from '@/components';
import { spacing } from '@/theme';
import Link from 'next/link';

const SITEMAP_ROUTES = [
  { path: '/', section: 'Landing' },
  { path: '/how-it-works', section: 'Marketing' },
  { path: '/pricing', section: 'Marketing' },
  { path: '/login', section: 'Auth' },
  { path: '/signup', section: 'Auth' },
  { path: '/confirm-email', section: 'Auth' },
  { path: '/auth/beta-signup', section: 'Auth' },
  { path: '/onboarding', section: 'Onboarding' },
  { path: '/onboarding/profile', section: 'Onboarding' },
  { path: '/onboarding/preferences', section: 'Onboarding' },
  { path: '/onboarding/guide', section: 'Onboarding' },
  { path: '/home', section: 'Main App' },
  { path: '/library', section: 'Main App' },
  { path: '/create', section: 'Main App' },
  { path: '/profile', section: 'Main App' },
  { path: '/sanctuary', section: 'Sanctuary' },
  { path: '/sanctuary/settings', section: 'Sanctuary' },
  { path: '/sanctuary/credits', section: 'Sanctuary' },
  { path: '/sanctuary/progress', section: 'Sanctuary' },
  { path: '/sanctuary/referral', section: 'Sanctuary' },
  { path: '/sanctuary/reminders', section: 'Sanctuary' },
  { path: '/sanctuary/learn', section: 'Sanctuary' },
  { path: '/sanctuary/affirmations', section: 'Affirmations' },
  { path: '/sanctuary/affirmations/create', section: 'Affirmations' },
  { path: '/sanctuary/affirmations/record', section: 'Affirmations' },
  { path: '/sanctuary/rituals', section: 'Rituals' },
  { path: '/sanctuary/rituals/create', section: 'Rituals' },
  { path: '/sanctuary/rituals/recordings', section: 'Rituals' },
  { path: '/showcase', section: 'Utility' },
  { path: '/pages', section: 'Utility' },
  { path: '/sitemap', section: 'Utility' },
];

export default function SitemapPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const routesBySection = SITEMAP_ROUTES.reduce<Record<string, string[]>>((acc, route) => {
    if (!acc[route.section]) acc[route.section] = [];
    acc[route.section].push(route.path);
    return acc;
  }, {});

  return (
    <PageShell intensity="medium" bare>
      <ThemeSelector />
      <AppHeader variant="public" />
      <div style={{ padding: spacing.xl }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
              Sitemap
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xxl }}>
              Complete sitemap of all waQup routes
            </Typography>

            {Object.entries(routesBySection).map(([section, paths]) => (
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
  );
}
