'use client';

import React from 'react';
import { Typography, Badge } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, ThemeSelector, AppHeader } from '@/components';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';

export type RouteStatus = 'exists' | 'to_create' | 'to_delete' | 'to_change';

interface RouteEntry {
  path: string;
  description: string;
  status: RouteStatus;
  note?: string;
}

interface RouteGroup {
  title: string;
  routes: RouteEntry[];
}

const ROUTE_GROUPS: RouteGroup[] = [
  {
    title: 'Landing & Marketing',
    routes: [
      { path: '/', description: 'Homepage', status: 'exists' },
      { path: '/how-it-works', description: 'How it works', status: 'exists' },
      { path: '/pricing', description: 'Pricing', status: 'exists' },
    ],
  },
  {
    title: 'Auth',
    routes: [
      { path: '/login', description: 'Sign in', status: 'exists' },
      { path: '/signup', description: 'Sign up', status: 'exists' },
      { path: '/forgot-password', description: 'Forgot password', status: 'exists' },
      { path: '/reset-password', description: 'Reset password', status: 'exists' },
      { path: '/confirm-email', description: 'Confirm email', status: 'exists' },
      { path: '/auth/beta-signup', description: 'Beta signup', status: 'exists' },
    ],
  },
  {
    title: 'Onboarding',
    routes: [
      { path: '/onboarding', description: 'Onboarding', status: 'exists' },
      { path: '/onboarding/profile', description: 'Profile', status: 'exists' },
      { path: '/onboarding/preferences', description: 'Preferences', status: 'exists' },
      { path: '/onboarding/guide', description: 'Guide', status: 'exists' },
    ],
  },
  {
    title: 'Main App',
    routes: [
      { path: '/home', description: 'Dashboard', status: 'exists', note: 'Clarify relationship with /sanctuary (roadmap: "Home (Sanctuary)")' },
      { path: '/library', description: 'Library', status: 'exists' },
      { path: '/create', description: 'Create', status: 'exists' },
      { path: '/profile', description: 'Profile', status: 'exists' },
    ],
  },
  {
    title: 'Sanctuary',
    routes: [
      { path: '/sanctuary', description: 'Sanctuary home', status: 'exists', note: 'Clarify relationship with /home' },
      { path: '/sanctuary/settings', description: 'Settings', status: 'exists' },
      { path: '/sanctuary/credits', description: 'Credits', status: 'exists' },
      { path: '/sanctuary/progress', description: 'Progress', status: 'exists' },
      { path: '/sanctuary/referral', description: 'Referral', status: 'exists' },
      { path: '/sanctuary/reminders', description: 'Reminders', status: 'exists' },
      { path: '/sanctuary/learn', description: 'Learn', status: 'exists' },
    ],
  },
  {
    title: 'Affirmations',
    routes: [
      { path: '/sanctuary/affirmations', description: 'List', status: 'exists' },
      { path: '/sanctuary/affirmations/create', description: 'Create (steps: select, theme, voice, audio, mix, complete)', status: 'to_change', note: 'Make conversational (orb/speak), not static forms' },
      { path: '/sanctuary/affirmations/record', description: 'Record', status: 'exists' },
    ],
  },
  {
    title: 'Rituals',
    routes: [
      { path: '/sanctuary/rituals', description: 'List', status: 'exists' },
      { path: '/sanctuary/rituals/[id]', description: 'Ritual detail', status: 'exists' },
      { path: '/sanctuary/rituals/[id]/edit', description: 'Edit', status: 'exists' },
      { path: '/sanctuary/rituals/create', description: 'Create (steps: init, values, strengths, goals, patterns, tone, language, script, review, record, enhance, complete)', status: 'to_change', note: 'Make conversational (orb/speak)' },
      { path: '/sanctuary/rituals/recordings', description: 'Recordings', status: 'exists' },
    ],
  },
  {
    title: 'Meditations',
    routes: [
      { path: '/sanctuary/meditations', description: 'List', status: 'to_create', note: 'Missing in app' },
      { path: '/sanctuary/meditations/[id]', description: 'Meditation detail', status: 'to_create', note: 'Phase 5.2' },
      { path: '/sanctuary/meditations/[id]/edit', description: 'Edit meditation', status: 'to_create' },
      { path: '/sanctuary/meditations/create', description: 'Create meditation', status: 'to_change', note: 'Make conversational (orb/speak)' },
    ],
  },
  {
    title: 'Voice & conversation (to create)',
    routes: [
      { path: '/speak', description: 'Orb that speaks — voice-first conversation UI', status: 'to_create', note: 'voice-interaction-design, Phase 9' },
      { path: '/create/conversation', description: 'Conversational creation (chat-like, no static forms)', status: 'to_create', note: 'Replace/augment create flows; state machine' },
      { path: '/sanctuary/affirmations/[id]/edit-audio', description: 'Edit sound/script in pipeline (affirmation)', status: 'to_create', note: 'Cool edit-audio step in pipeline' },
      { path: '/sanctuary/rituals/[id]/edit-audio', description: 'Edit sound/script in pipeline (ritual)', status: 'to_create', note: 'Cool edit-audio step in pipeline' },
      { path: '/sanctuary/meditations/[id]/edit-audio', description: 'Edit sound/script in pipeline (meditation)', status: 'to_create', note: 'Cool edit-audio step in pipeline' },
    ],
  },
  {
    title: 'Affirmations (missing detail/edit)',
    routes: [
      { path: '/sanctuary/affirmations/[id]', description: 'Affirmation detail (play, edit, delete, share)', status: 'to_create', note: 'Phase 5.2' },
      { path: '/sanctuary/affirmations/[id]/edit', description: 'Edit affirmation', status: 'to_create' },
    ],
  },
  {
    title: 'Marketplace (Phase 14 — future)',
    routes: [
      { path: '/marketplace', description: 'Discovery, search, filter, browse', status: 'to_create', note: 'Phase 14.1' },
      { path: '/marketplace/creator', description: 'Creator dashboard — publish, pricing, analytics', status: 'to_create', note: 'Phase 14.2' },
    ],
  },
  {
    title: 'Useful Links',
    routes: [
      { path: '/showcase', description: 'Design system & UI components (elements)', status: 'exists' },
      { path: '/pages', description: 'Index of all pages (this page)', status: 'exists' },
      { path: '/sitemap-view', description: 'Sitemap', status: 'exists' },
    ],
  },
];

const STATUS_LABELS: Record<RouteStatus, string> = {
  exists: 'Exists',
  to_create: 'To create',
  to_delete: 'To delete',
  to_change: 'To change',
};

const STATUS_BADGE_VARIANT: Record<RouteStatus, 'success' | 'warning' | 'error' | 'info' | 'outline' | 'default'> = {
  exists: 'success',
  to_create: 'info',
  to_delete: 'error',
  to_change: 'warning',
};

/** Convert a path with dynamic segments (e.g. [id]) to a concrete href for Next.js Link. */
function pathToHref(path: string): string {
  return path
    .replace(/\[id\]/g, '1')
    .replace(/\[[\w-]+\]/g, '1');
}

function RouteCard({ route, colors }: { route: RouteEntry; colors: Record<string, string> }) {
  const isAction = route.status === 'to_delete' || route.status === 'to_change';
  const href = pathToHref(route.path);
  const linkStyle: React.CSSProperties = {
    display: 'block',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    background: isAction ? `${colors.warning}12` : undefined,
    border: `1px solid ${isAction ? colors.warning ?? colors.glass.border : colors.glass.border}`,
    textDecoration: 'none',
    color: colors.text.primary,
  };

  return (
    <Link href={href} style={linkStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.xs }}>
        <Typography variant="body" style={{ fontWeight: 600 }}>
          {route.path}
        </Typography>
        <Badge variant={STATUS_BADGE_VARIANT[route.status]} size="sm">
          {STATUS_LABELS[route.status]}
        </Badge>
      </div>
      <Typography variant="small" style={{ color: colors.text.secondary }}>
        {route.description}
      </Typography>
      {route.note && (
        <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary, marginTop: spacing.xs, fontStyle: 'italic' }}>
          {route.note}
        </Typography>
      )}
    </Link>
  );
}

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
            Index of all routes in the waQup web app. Status: exists, to create, to delete, or to change.
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
                  <RouteCard key={route.path} route={route} colors={colors} />
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
