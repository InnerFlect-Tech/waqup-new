'use client';

import React from 'react';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, ThemeSelector, AppHeader } from '@/components';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';

interface RouteGroup {
  title: string;
  routes: { path: string; description: string }[];
}

const ROUTE_GROUPS: RouteGroup[] = [
  {
    title: 'Landing & Marketing',
    routes: [
      { path: '/', description: 'Homepage' },
      { path: '/how-it-works', description: 'How it works' },
      { path: '/pricing', description: 'Pricing' },
    ],
  },
  {
    title: 'Auth',
    routes: [
      { path: '/login', description: 'Sign in' },
      { path: '/signup', description: 'Sign up' },
      { path: '/confirm-email', description: 'Confirm email' },
      { path: '/auth/beta-signup', description: 'Beta signup' },
    ],
  },
  {
    title: 'Onboarding',
    routes: [
      { path: '/onboarding', description: 'Onboarding' },
      { path: '/onboarding/profile', description: 'Profile' },
      { path: '/onboarding/preferences', description: 'Preferences' },
      { path: '/onboarding/guide', description: 'Guide' },
    ],
  },
  {
    title: 'Main App',
    routes: [
      { path: '/home', description: 'Dashboard' },
      { path: '/library', description: 'Library' },
      { path: '/create', description: 'Create' },
      { path: '/profile', description: 'Profile' },
    ],
  },
  {
    title: 'Sanctuary',
    routes: [
      { path: '/sanctuary', description: 'Sanctuary home' },
      { path: '/sanctuary/settings', description: 'Settings' },
      { path: '/sanctuary/credits', description: 'Credits' },
      { path: '/sanctuary/progress', description: 'Progress' },
      { path: '/sanctuary/referral', description: 'Referral' },
      { path: '/sanctuary/reminders', description: 'Reminders' },
      { path: '/sanctuary/learn', description: 'Learn' },
    ],
  },
  {
    title: 'Affirmations',
    routes: [
      { path: '/sanctuary/affirmations', description: 'List' },
      { path: '/sanctuary/affirmations/create', description: 'Create (steps: select, theme, voice, audio, mix, complete)' },
      { path: '/sanctuary/affirmations/record', description: 'Record' },
    ],
  },
  {
    title: 'Rituals',
    routes: [
      { path: '/sanctuary/rituals', description: 'List' },
      { path: '/sanctuary/rituals/[id]', description: 'Ritual detail' },
      { path: '/sanctuary/rituals/[id]/edit', description: 'Edit' },
      { path: '/sanctuary/rituals/create', description: 'Create (steps: init, values, strengths, goals, patterns, tone, language, script, review, record, enhance, complete)' },
      { path: '/sanctuary/rituals/recordings', description: 'Recordings' },
    ],
  },
  {
    title: 'Useful Links',
    routes: [
      { path: '/showcase', description: 'Design system & UI components' },
      { path: '/pages', description: 'Index of all pages' },
      { path: '/sitemap', description: 'Sitemap' },
    ],
  },
];

export default function PagesIndexPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium" bare>
      <ThemeSelector />
      <AppHeader variant="public" />
      <div style={{ padding: spacing.xl }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
              All Pages
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xxl }}>
              Index of all routes in the waQup web app
            </Typography>

            {ROUTE_GROUPS.map((group) => (
              <div key={group.title} style={{ marginBottom: spacing.xxl }}>
                <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, fontSize: '1.25rem' }}>
                  {group.title}
                </Typography>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm,
                  }}
                >
                  {group.routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      style={{
                        display: 'block',
                        padding: spacing.md,
                        borderRadius: borderRadius.md,
                        background: colors.glass.opaque,
                        border: `1px solid ${colors.glass.border}`,
                        textDecoration: 'none',
                        color: colors.text.primary,
                      }}
                    >
                      <Typography variant="body" style={{ fontWeight: 600, marginBottom: spacing.xs }}>
                        {route.path}
                      </Typography>
                      <Typography variant="small" style={{ color: colors.text.secondary }}>
                        {route.description}
                      </Typography>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography variant="body" style={{ color: colors.accent.primary, fontWeight: 500 }}>
                Back to Home
              </Typography>
            </Link>
          </div>
        </div>
    </PageShell>
  );
}
