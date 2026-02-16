'use client';

import React from 'react';
import { Typography, Badge } from '@/components';
import { useTheme, type Theme } from '@/theme';
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

// --- Without auth (public): AuthProvider allows access when not logged in ---
const WITHOUT_AUTH: RouteGroup[] = [
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
    title: 'Utility (public by exception)',
    routes: [
      { path: '/showcase', description: 'Design system & UI components', status: 'exists' },
      { path: '/pages', description: 'This index', status: 'exists' },
      { path: '/sitemap-view', description: 'Sitemap', status: 'exists' },
    ],
  },
];

// --- With auth (protected): AuthProvider redirects to /login if not logged in ---
const WITH_AUTH: RouteGroup[] = [
  {
    title: 'Main',
    routes: [
      { path: '/home', description: 'Dashboard', status: 'exists', note: 'Clarify vs /sanctuary' },
      { path: '/library', description: 'Library', status: 'exists' },
      { path: '/create', description: 'Create', status: 'exists' },
      { path: '/profile', description: 'Profile', status: 'exists' },
    ],
  },
  {
    title: 'Sanctuary',
    routes: [
      { path: '/sanctuary', description: 'Sanctuary home', status: 'exists', note: 'Clarify vs /home' },
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
      { path: '/sanctuary/affirmations/[id]', description: 'Detail', status: 'to_create', note: 'Phase 5.2' },
      { path: '/sanctuary/affirmations/[id]/edit', description: 'Edit', status: 'to_create' },
      { path: '/sanctuary/affirmations/create', description: 'Create', status: 'to_change', note: 'Make conversational' },
      { path: '/sanctuary/affirmations/record', description: 'Record', status: 'exists' },
      { path: '/sanctuary/affirmations/[id]/edit-audio', description: 'Edit sound/script', status: 'to_create' },
    ],
  },
  {
    title: 'Rituals',
    routes: [
      { path: '/sanctuary/rituals', description: 'List', status: 'exists' },
      { path: '/sanctuary/rituals/[id]', description: 'Detail', status: 'exists' },
      { path: '/sanctuary/rituals/[id]/edit', description: 'Edit', status: 'exists' },
      { path: '/sanctuary/rituals/create', description: 'Create', status: 'to_change', note: 'Make conversational' },
      { path: '/sanctuary/rituals/recordings', description: 'Recordings', status: 'exists' },
      { path: '/sanctuary/rituals/[id]/edit-audio', description: 'Edit sound/script', status: 'to_create' },
    ],
  },
  {
    title: 'Meditations',
    routes: [
      { path: '/sanctuary/meditations', description: 'List', status: 'to_create' },
      { path: '/sanctuary/meditations/[id]', description: 'Detail', status: 'to_create' },
      { path: '/sanctuary/meditations/[id]/edit', description: 'Edit', status: 'to_create' },
      { path: '/sanctuary/meditations/create', description: 'Create', status: 'to_change', note: 'Make conversational' },
      { path: '/sanctuary/meditations/[id]/edit-audio', description: 'Edit sound/script', status: 'to_create' },
    ],
  },
  {
    title: 'Voice & conversation (to create)',
    routes: [
      { path: '/speak', description: 'Orb that speaks', status: 'to_create', note: 'Phase 9' },
      { path: '/create/conversation', description: 'Conversational creation', status: 'to_create' },
    ],
  },
  {
    title: 'Marketplace (Phase 14)',
    routes: [
      { path: '/marketplace', description: 'Discovery', status: 'to_create' },
      { path: '/marketplace/creator', description: 'Creator dashboard', status: 'to_create' },
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

function pathToHref(path: string): string {
  return path.replace(/\[id\]/g, '1').replace(/\[[\w-]+\]/g, '1');
}

function RouteCard({ route, colors }: { route: RouteEntry; colors: Theme['colors'] }) {
  const isAction = route.status === 'to_delete' || route.status === 'to_change';
  const href = pathToHref(route.path);
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        background: isAction ? `${colors.warning}12` : undefined,
        border: `1px solid ${isAction ? colors.warning ?? colors.glass.border : colors.glass.border}`,
        textDecoration: 'none',
        color: colors.text.primary,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap', marginBottom: 2 }}>
        <Typography variant="small" style={{ fontWeight: 600, fontSize: '13px' }}>
          {route.path}
        </Typography>
        <Badge variant={STATUS_BADGE_VARIANT[route.status]} size="sm">
          {STATUS_LABELS[route.status]}
        </Badge>
      </div>
      <Typography variant="small" style={{ color: colors.text.secondary, fontSize: '12px', lineHeight: 1.3 }}>
        {route.description}
      </Typography>
      {route.note && (
        <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary, marginTop: 2, fontStyle: 'italic', fontSize: '11px' }}>
          {route.note}
        </Typography>
      )}
    </Link>
  );
}

const CARD_GRID_STYLE: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: spacing.sm,
};

export default function PagesIndexPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium" bare>
      <ThemeSelector />
      <AppHeader variant="public" />
      <div style={{ padding: spacing.xl }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary, fontSize: '1.5rem' }}>
            All Pages
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, fontSize: '14px' }}>
            By auth: public (no login) vs protected (login required). Status: exists / to create / to change.
          </Typography>

          {/* Exceptions: clear note */}
          <div
            style={{
              padding: spacing.sm,
              borderRadius: borderRadius.md,
              background: `${colors.accent.primary}12`,
              border: `1px solid ${colors.accent.primary}40`,
              marginBottom: spacing.xl,
              fontSize: '12px',
              color: colors.text.secondary,
            }}
          >
            <strong style={{ color: colors.text.primary }}>Exceptions:</strong> All of &quot;Without auth&quot; are public. In &quot;With auth&quot;, only routes under /home, /library, /create, /profile, /sanctuary require login. <em>/pages</em>, <em>/showcase</em>, <em>/sitemap-view</em> and <em>/onboarding/*</em> are public by design (dev/testing or first-time flow).
          </div>

          {/* Without auth */}
          <Typography variant="h2" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.1rem', fontWeight: 600 }}>
            Without auth (public)
          </Typography>
          {WITHOUT_AUTH.map((group) => (
            <div key={group.title} style={{ marginBottom: spacing.lg }}>
              <Typography variant="body" style={{ marginBottom: spacing.xs, color: colors.text.secondary, fontSize: '13px', fontWeight: 600 }}>
                {group.title}
              </Typography>
              <div style={CARD_GRID_STYLE}>
                {group.routes.map((route) => (
                  <RouteCard key={route.path} route={route} colors={colors} />
                ))}
              </div>
            </div>
          ))}

          {/* With auth */}
          <Typography variant="h2" style={{ marginTop: spacing.xl, marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.1rem', fontWeight: 600 }}>
            With auth (protected)
          </Typography>
          {WITH_AUTH.map((group) => (
            <div key={group.title} style={{ marginBottom: spacing.lg }}>
              <Typography variant="body" style={{ marginBottom: spacing.xs, color: colors.text.secondary, fontSize: '13px', fontWeight: 600 }}>
                {group.title}
              </Typography>
              <div style={CARD_GRID_STYLE}>
                {group.routes.map((route) => (
                  <RouteCard key={route.path} route={route} colors={colors} />
                ))}
              </div>
            </div>
          ))}

          <Link href="/" style={{ textDecoration: 'none', fontSize: '13px', marginTop: spacing.lg, display: 'inline-block' }}>
            <Typography variant="body" style={{ color: colors.accent.primary, fontWeight: 500 }}>
              Back to Home
            </Typography>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
