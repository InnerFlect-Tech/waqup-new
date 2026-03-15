'use client';

import React, { useEffect, useState } from 'react';
import { Typography, SuperAdminGate } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, GlassCard } from '@/components';
import { spacing, borderRadius, CONTENT_MAX_WIDTH } from '@/theme';
import { Link } from '@/i18n/navigation';
import { formatDate } from '@waqup/shared/utils';

interface SchemaCheck {
  check_name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  detail: string | null;
}

export default function SchemaPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [data, setData] = useState<{ checks: SchemaCheck[]; timestamp: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/schema')
      .then((r) => r.json())
      .then((body) => {
        if (body.error && !body.checks) {
          setError(body.error);
        } else {
          setData({ checks: body.checks ?? [], timestamp: body.timestamp ?? '' });
        }
      })
      .catch((e) => setError(e.message));
  }, []);

  const pass = data?.checks?.filter((c) => c.status === 'PASS').length ?? 0;
  const fail = data?.checks?.filter((c) => c.status === 'FAIL').length ?? 0;
  const warn = data?.checks?.filter((c) => c.status === 'WARN').length ?? 0;

  return (
    <SuperAdminGate>
      <PageShell intensity="medium" bare allowDocumentScroll>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', paddingTop: spacing.xxl, paddingBottom: spacing.xxl }}>
          <div style={{ marginBottom: spacing.xl }}>
            <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.75rem' }}>
              Schema Live Status
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
              Live view of database schema — tables and key columns. Run supabase/scripts/verify_database.sql for full verification.
            </Typography>
          </div>

          {error && (
            <GlassCard variant="content" style={{ marginBottom: spacing.xl, borderColor: colors.error }}>
              <Typography variant="body" style={{ color: colors.error }}>{error}</Typography>
            </GlassCard>
          )}

          {data && (
            <>
              <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.xl }}>
                <GlassCard variant="content" style={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="h3" style={{ color: colors.success }}>{pass}</Typography>
                  <Typography variant="caption" style={{ color: colors.text.secondary }}>PASS</Typography>
                </GlassCard>
                <GlassCard variant="content" style={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="h3" style={{ color: colors.error }}>{fail}</Typography>
                  <Typography variant="caption" style={{ color: colors.text.secondary }}>FAIL</Typography>
                </GlassCard>
                <GlassCard variant="content" style={{ textAlign: 'center', flex: 1 }}>
                  <Typography variant="h3" style={{ color: colors.warning }}>{warn}</Typography>
                  <Typography variant="caption" style={{ color: colors.text.secondary }}>WARN</Typography>
                </GlassCard>
              </div>

              <GlassCard variant="content" style={{ marginBottom: spacing.xl }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: spacing.sm, color: colors.text.secondary, borderBottom: `1px solid ${colors.glass.border}` }}>Check</th>
                      <th style={{ textAlign: 'left', padding: spacing.sm, color: colors.text.secondary, borderBottom: `1px solid ${colors.glass.border}` }}>Status</th>
                      <th style={{ textAlign: 'left', padding: spacing.sm, color: colors.text.secondary, borderBottom: `1px solid ${colors.glass.border}` }}>Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.checks.map((c) => (
                      <tr key={c.check_name} style={{ borderBottom: `1px solid ${colors.glass.border}` }}>
                        <td style={{ padding: spacing.sm, color: colors.text.primary }}>{c.check_name}</td>
                        <td style={{ padding: spacing.sm }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              padding: '2px 8px',
                              borderRadius: 999,
                              fontSize: 11,
                              fontWeight: 600,
                              background: c.status === 'PASS' ? `${colors.success}20` : c.status === 'FAIL' ? `${colors.error}20` : `${colors.warning}20`,
                              color: c.status === 'PASS' ? colors.success : c.status === 'FAIL' ? colors.error : colors.warning,
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: spacing.sm, color: colors.text.tertiary }}>{c.detail ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>

              <Typography variant="small" style={{ color: colors.text.tertiary, marginBottom: spacing.xl }}>
                Last checked: {formatDate(data.timestamp ?? null, { fallback: '—' })}
              </Typography>
            </>
          )}

          <div style={{ paddingTop: spacing.lg, borderTop: `1px solid ${colors.glass.border}`, display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
            <Link href="/system" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>System</Link>
            <Link href="/health" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>API Health</Link>
            <Link href="/admin" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>Admin</Link>
          </div>
        </div>
      </PageShell>
    </SuperAdminGate>
  );
}
