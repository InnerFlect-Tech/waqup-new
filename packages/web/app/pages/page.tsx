'use client';

import React from 'react';
import { Typography, Badge } from '@/components';
import { useTheme, type Theme } from '@/theme';
import { PageShell } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { getRouteGroupsForPages, pathToHref, type RouteStatus, type RouteGroup } from '@/lib';
import Link from 'next/link';

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

function RouteCard({ route, colors }: { route: { path: string; description: string; status: RouteStatus; note?: string }; colors: Theme['colors'] }) {
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
  const { public: WITHOUT_AUTH, protected: WITH_AUTH } = getRouteGroupsForPages();

  return (
    <PageShell intensity="medium" bare>
      <div style={{ padding: spacing.xl }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary, fontSize: '1.5rem' }}>
            All Pages
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg, fontSize: '14px' }}>
            By auth: public (no login) vs protected (login required). Status: exists / to create / to change.
          </Typography>

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

          <Typography variant="h2" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.1rem', fontWeight: 600 }}>
            Without auth (public)
          </Typography>
          {(WITHOUT_AUTH as RouteGroup[]).map((group) => (
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

          <Typography variant="h2" style={{ marginTop: spacing.xl, marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.1rem', fontWeight: 600 }}>
            With auth (protected)
          </Typography>
          {(WITH_AUTH as RouteGroup[]).map((group) => (
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
