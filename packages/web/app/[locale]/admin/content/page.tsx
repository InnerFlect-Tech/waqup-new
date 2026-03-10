'use client';

import React, { useEffect, useState } from 'react';
import { Typography, SuperAdminGate } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, GlassCard } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import { Link } from '@/i18n/navigation';

interface ContentStats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  last7Days: number;
  last30Days: number;
}

export default function ContentOverviewPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [data, setData] = useState<{ stats: ContentStats; timestamp: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((body) => {
        if (body.error && !body.stats) {
          setError(body.error);
        } else {
          setData({ stats: body.stats ?? { total: 0, byType: {}, byStatus: {}, last7Days: 0, last30Days: 0 }, timestamp: body.timestamp ?? '' });
        }
      })
      .catch((e) => setError(e.message));
  }, []);

  const stats = data?.stats;
  const typeLabels: Record<string, { label: string; color: string }> = {
    affirmation: { label: 'Affirmations', color: CONTENT_TYPE_COLORS.affirmation },
    meditation: { label: 'Meditations', color: CONTENT_TYPE_COLORS.meditation },
    ritual: { label: 'Rituals', color: CONTENT_TYPE_COLORS.ritual },
  };

  return (
    <SuperAdminGate>
      <PageShell intensity="medium" bare>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: spacing.xl }}>
          <div style={{ marginBottom: spacing.xl }}>
            <Link href="/admin" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none', marginBottom: spacing.sm, display: 'inline-block' }}>
              ← Admin
            </Link>
            <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.75rem' }}>
              Content Overview
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Platform content counts and recent activity.
            </Typography>
          </div>

          {error && (
            <GlassCard variant="content" style={{ marginBottom: spacing.xl, borderColor: colors.error }}>
              <Typography variant="body" style={{ color: colors.error }}>{error}</Typography>
            </GlassCard>
          )}

          {stats && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: spacing.md, marginBottom: spacing.xl }}>
                <GlassCard variant="content" style={{ textAlign: 'center' }}>
                  <Typography variant="h3" style={{ color: colors.accent.primary }}>{stats.total}</Typography>
                  <Typography variant="caption" style={{ color: colors.text.secondary }}>Total items</Typography>
                </GlassCard>
                <GlassCard variant="content" style={{ textAlign: 'center' }}>
                  <Typography variant="h3" style={{ color: colors.success }}>{stats.last7Days}</Typography>
                  <Typography variant="caption" style={{ color: colors.text.secondary }}>Last 7 days</Typography>
                </GlassCard>
                <GlassCard variant="content" style={{ textAlign: 'center' }}>
                  <Typography variant="h3" style={{ color: colors.info }}>{stats.last30Days}</Typography>
                  <Typography variant="caption" style={{ color: colors.text.secondary }}>Last 30 days</Typography>
                </GlassCard>
              </div>

              <GlassCard variant="content" style={{ marginBottom: spacing.xl }}>
                <Typography variant="h4" style={{ marginBottom: spacing.md, color: colors.text.primary }}>By type</Typography>
                <div style={{ display: 'flex', gap: spacing.lg, flexWrap: 'wrap' }}>
                  {(['affirmation', 'meditation', 'ritual'] as const).map((t) => {
                    const meta = typeLabels[t] ?? { label: t, color: colors.text.secondary };
                    const count = stats.byType[t] ?? 0;
                    return (
                      <div
                        key={t}
                        style={{
                          padding: spacing.md,
                          borderRadius: borderRadius.md,
                          background: `${meta.color}15`,
                          border: `1px solid ${meta.color}40`,
                          minWidth: 140,
                        }}
                      >
                        <Typography variant="body" style={{ color: meta.color, fontWeight: 600 }}>{meta.label}</Typography>
                        <Typography variant="h3" style={{ color: colors.text.primary }}>{count}</Typography>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              <GlassCard variant="content" style={{ marginBottom: spacing.xl }}>
                <Typography variant="h4" style={{ marginBottom: spacing.md, color: colors.text.primary }}>By status</Typography>
                <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
                  {Object.entries(stats.byStatus).map(([status, count]) => (
                    <div
                      key={status}
                      style={{
                        padding: `${spacing.sm} ${spacing.md}`,
                        borderRadius: borderRadius.sm,
                        background: colors.glass.light,
                        border: `1px solid ${colors.glass.border}`,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: spacing.sm,
                      }}
                    >
                      <Typography variant="small" style={{ color: colors.text.secondary, textTransform: 'capitalize' }}>{status}</Typography>
                      <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 600 }}>{count}</Typography>
                    </div>
                  ))}
                  {Object.keys(stats.byStatus).length === 0 && (
                    <Typography variant="small" style={{ color: colors.text.tertiary }}>No content yet</Typography>
                  )}
                </div>
              </GlassCard>

              <Typography variant="small" style={{ color: colors.text.tertiary }}>
                Last updated: {data?.timestamp ? new Date(data.timestamp).toLocaleString() : '—'}
              </Typography>
            </>
          )}

          <div style={{ marginTop: spacing.xl, paddingTop: spacing.lg, borderTop: `1px solid ${colors.glass.border}`, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
            <Link href="/library" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Content Library</Link>
            <Link href="/admin" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Admin</Link>
          </div>
        </div>
      </PageShell>
    </SuperAdminGate>
  );
}
