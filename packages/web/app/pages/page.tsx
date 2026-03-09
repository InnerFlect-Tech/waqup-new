'use client';

import React, { useMemo } from 'react';
import { Typography, Badge, SuperAdminGate } from '@/components';
import { useTheme, type Theme } from '@/theme';
import { PageShell, GlassCard } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH } from '@/theme';
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
        transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.glass.light;
        e.currentTarget.style.boxShadow = `0 4px 12px ${colors.accent.primary}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isAction ? `${colors.warning}12` : 'transparent';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap', marginBottom: spacing.xs }}>
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
        <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary, marginTop: spacing.xs, fontStyle: 'italic', fontSize: '11px' }}>
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

const SECTION_FLOW = ['Landing & Marketing', 'Auth', 'Onboarding', 'Main', 'Sanctuary', 'Utility (public by exception)', 'Voice & conversation', 'Marketplace (Phase 14)'];

export default function PagesIndexPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { public: WITHOUT_AUTH, protected: WITH_AUTH, superadmin: SUPERADMIN } = getRouteGroupsForPages();

  const stats = useMemo(() => {
    const allRoutes = [...(WITHOUT_AUTH as RouteGroup[]).flatMap((g) => g.routes), ...(WITH_AUTH as RouteGroup[]).flatMap((g) => g.routes), ...(SUPERADMIN as RouteGroup[]).flatMap((g) => g.routes)];
    const byStatus: Record<RouteStatus, number> = { exists: 0, to_create: 0, to_delete: 0, to_change: 0 };
    for (const r of allRoutes) {
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    }
    return {
      total: allRoutes.length,
      public: (WITHOUT_AUTH as RouteGroup[]).flatMap((g) => g.routes).length,
      protected: (WITH_AUTH as RouteGroup[]).flatMap((g) => g.routes).length,
      byStatus,
    };
  }, [WITHOUT_AUTH, WITH_AUTH]);

  return (
    <SuperAdminGate>
    <PageShell intensity="medium" bare>
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: spacing.xl }}>
        <div style={{ marginBottom: spacing.xl }}>
          <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
            All Pages
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            By auth: public (no login) vs protected (login required). Status: exists / to create / to change.
          </Typography>

          {/* Route count summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: spacing.md, marginBottom: spacing.xl }}>
            <GlassCard variant="content" style={{ textAlign: 'center' }}>
              <Typography variant="h3" style={{ color: colors.accent.tertiary }}>{stats.total}</Typography>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Total routes</Typography>
            </GlassCard>
            <GlassCard variant="content" style={{ textAlign: 'center' }}>
              <Typography variant="h3" style={{ color: colors.text.primary }}>{stats.public}</Typography>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Public</Typography>
            </GlassCard>
            <GlassCard variant="content" style={{ textAlign: 'center' }}>
              <Typography variant="h3" style={{ color: colors.text.primary }}>{stats.protected}</Typography>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Protected</Typography>
            </GlassCard>
            <GlassCard variant="content" style={{ textAlign: 'center' }}>
              <Typography variant="h3" style={{ color: colors.success }}>{stats.byStatus.exists}</Typography>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Exists</Typography>
            </GlassCard>
            <GlassCard variant="content" style={{ textAlign: 'center' }}>
              <Typography variant="h3" style={{ color: colors.info }}>{stats.byStatus.to_create}</Typography>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>To create</Typography>
            </GlassCard>
            <GlassCard variant="content" style={{ textAlign: 'center' }}>
              <Typography variant="h3" style={{ color: colors.warning }}>{stats.byStatus.to_change}</Typography>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>To change</Typography>
            </GlassCard>
          </div>

          {/* Status distribution bar */}
          <GlassCard variant="content" style={{ marginBottom: spacing.xl }}>
            <Typography variant="h4" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>Status distribution</Typography>
            <div style={{ display: 'flex', height: 24, borderRadius: borderRadius.sm, overflow: 'hidden', background: colors.background.secondary }}>
              <div style={{ width: `${(stats.byStatus.exists / stats.total) * 100}%`, background: colors.success, minWidth: stats.byStatus.exists ? 4 : 0 }} title={`Exists: ${stats.byStatus.exists}`} />
              <div style={{ width: `${(stats.byStatus.to_create / stats.total) * 100}%`, background: colors.info, minWidth: stats.byStatus.to_create ? 4 : 0 }} title={`To create: ${stats.byStatus.to_create}`} />
              <div style={{ width: `${(stats.byStatus.to_change / stats.total) * 100}%`, background: colors.warning, minWidth: stats.byStatus.to_change ? 4 : 0 }} title={`To change: ${stats.byStatus.to_change}`} />
              <div style={{ width: `${(stats.byStatus.to_delete / stats.total) * 100}%`, background: colors.error, minWidth: stats.byStatus.to_delete ? 4 : 0 }} title={`To delete: ${stats.byStatus.to_delete}`} />
            </div>
            <div style={{ display: 'flex', gap: spacing.lg, marginTop: spacing.sm, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: 12, color: colors.text.secondary }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: colors.success }} /> Exists
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: 12, color: colors.text.secondary }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: colors.info }} /> To create
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: 12, color: colors.text.secondary }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: colors.warning }} /> To change
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: 12, color: colors.text.secondary }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: colors.error }} /> To delete
              </span>
            </div>
          </GlassCard>

          {/* Section flow diagram */}
          <GlassCard variant="content" style={{ marginBottom: spacing.xl }}>
            <Typography variant="h4" style={{ marginBottom: spacing.md, color: colors.text.primary }}>Section flow</Typography>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm, alignItems: 'center' }}>
              {SECTION_FLOW.map((section, i) => (
                <React.Fragment key={section}>
                  <div
                    style={{
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: borderRadius.sm,
                      background: colors.glass.light,
                      border: `1px solid ${colors.glass.border}`,
                      fontSize: 12,
                      color: colors.text.secondary,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {section}
                  </div>
                  {i < SECTION_FLOW.length - 1 && (
                    <span style={{ color: colors.text.tertiary, fontSize: 14 }}>→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </GlassCard>

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
            <strong style={{ color: colors.text.primary }}>Access tiers:</strong> Public — no login required. Protected — login required. Superadmin — <code>role = superadmin</code> in profiles required.
          </div>
        </div>

        <Typography variant="h2" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.1rem', fontWeight: 600 }}>
          Without auth (public)
        </Typography>
        {(WITHOUT_AUTH as RouteGroup[]).map((group) => (
          <GlassCard key={group.title} variant="content" style={{ marginBottom: spacing.lg }}>
            <Typography variant="body" style={{ marginBottom: spacing.sm, color: colors.text.secondary, fontSize: '13px', fontWeight: 600 }}>
              {group.title}
            </Typography>
            <div style={CARD_GRID_STYLE}>
              {group.routes.map((route) => (
                <RouteCard key={route.path} route={route} colors={colors} />
              ))}
            </div>
          </GlassCard>
        ))}

        <Typography variant="h2" style={{ marginTop: spacing.xl, marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.1rem', fontWeight: 600 }}>
          With auth (protected)
        </Typography>
        {(WITH_AUTH as RouteGroup[]).map((group) => (
          <GlassCard key={group.title} variant="content" style={{ marginBottom: spacing.lg }}>
            <Typography variant="body" style={{ marginBottom: spacing.sm, color: colors.text.secondary, fontSize: '13px', fontWeight: 600 }}>
              {group.title}
            </Typography>
            <div style={CARD_GRID_STYLE}>
              {group.routes.map((route) => (
                <RouteCard key={route.path} route={route} colors={colors} />
              ))}
            </div>
          </GlassCard>
        ))}

        <Typography variant="h2" style={{ marginTop: spacing.xl, marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.1rem', fontWeight: 600 }}>
          Superadmin only
        </Typography>
        {(SUPERADMIN as RouteGroup[]).map((group) => (
          <GlassCard key={group.title} variant="content" style={{ marginBottom: spacing.lg }}>
            <Typography variant="body" style={{ marginBottom: spacing.sm, color: colors.text.secondary, fontSize: '13px', fontWeight: 600 }}>
              {group.title}
            </Typography>
            <div style={CARD_GRID_STYLE}>
              {group.routes.map((route) => (
                <RouteCard key={route.path} route={route} colors={colors} />
              ))}
            </div>
          </GlassCard>
        ))}

        {/* Admin dashboard shortcut */}
        <div style={{ marginTop: spacing.xl, paddingTop: spacing.xl, borderTop: `1px solid ${colors.glass.border}`, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
          <Link href="/admin" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Admin Dashboard</Link>
          <Link href="/health" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>API Health</Link>
          <Link href="/sitemap-view" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Sitemap</Link>
        </div>
      </div>
    </PageShell>
    </SuperAdminGate>
  );
}
