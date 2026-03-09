'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Typography, Badge } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, GlassCard } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH } from '@/theme';
import Link from 'next/link';

type ServiceStatus = 'ok' | 'error' | 'not_configured' | 'loading';

interface ServiceResult {
  status: ServiceStatus;
  latency?: number;
  message?: string;
}

interface HealthData {
  ok: boolean;
  timestamp: string;
  services: {
    supabase: ServiceResult;
    openai: ServiceResult;
    elevenlabs: ServiceResult;
    stripe: ServiceResult;
  };
  env: Record<string, boolean>;
}

const SERVICE_META: Record<
  string,
  { label: string; description: string; icon: string; docsUrl: string }
> = {
  supabase: {
    label: 'Supabase',
    description: 'Database, Auth, Storage',
    icon: '🗄️',
    docsUrl: 'https://supabase.com/dashboard',
  },
  openai: {
    label: 'OpenAI',
    description: 'GPT-4o-mini — conversations & scripts',
    icon: '🤖',
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  elevenlabs: {
    label: 'ElevenLabs',
    description: 'Professional Voice Cloning & TTS',
    icon: '🎙️',
    docsUrl: 'https://elevenlabs.io/app/profile-settings',
  },
  stripe: {
    label: 'Stripe',
    description: 'Subscriptions & payments',
    icon: '💳',
    docsUrl: 'https://dashboard.stripe.com/apikeys',
  },
};

const ENV_LABELS: Record<string, string> = {
  NEXT_PUBLIC_SUPABASE_URL: 'Supabase URL',
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'Supabase Anon Key',
  OPENAI_API_KEY: 'OpenAI API Key',
  ELEVENLABS_API_KEY: 'ElevenLabs API Key',
  STRIPE_SECRET_KEY: 'Stripe Secret Key',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'Stripe Publishable Key',
  NEXT_PUBLIC_APP_URL: 'App URL',
};

function statusBadgeVariant(
  status: ServiceStatus
): 'success' | 'error' | 'warning' | 'default' {
  if (status === 'ok') return 'success';
  if (status === 'error') return 'error';
  if (status === 'not_configured') return 'warning';
  return 'default';
}

function statusLabel(status: ServiceStatus): string {
  if (status === 'ok') return 'Connected';
  if (status === 'error') return 'Error';
  if (status === 'not_configured') return 'Not configured';
  return 'Checking…';
}

function latencyColor(ms: number | undefined, colors: { success: string; warning: string; error: string }): string {
  if (ms === undefined) return colors.warning;
  if (ms < 500) return colors.success;
  if (ms < 1500) return colors.warning;
  return colors.error;
}

function ServiceCard({
  name,
  result,
  colors,
}: {
  name: string;
  result: ServiceResult;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
}) {
  const meta = SERVICE_META[name];
  const isOk = result.status === 'ok';

  const borderColor =
    result.status === 'ok'
      ? `${colors.success}40`
      : result.status === 'error'
      ? `${colors.error}40`
      : result.status === 'not_configured'
      ? `${colors.warning}40`
      : colors.glass.border;

  return (
    <GlassCard
      variant="content"
      style={{ borderColor, position: 'relative', overflow: 'hidden' }}
    >
      {/* Status pulse dot */}
      <div
        style={{
          position: 'absolute',
          top: spacing.sm,
          right: spacing.sm,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background:
            result.status === 'ok'
              ? colors.success
              : result.status === 'error'
              ? colors.error
              : colors.warning,
          boxShadow: isOk ? `0 0 8px ${colors.success}80` : undefined,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
        <span style={{ fontSize: '1.5rem' }}>{meta?.icon}</span>
        <div>
          <Typography variant="body" style={{ fontWeight: 700, color: colors.text.primary, lineHeight: 1.2 }}>
            {meta?.label ?? name}
          </Typography>
          <Typography variant="caption" style={{ color: colors.text.secondary, fontSize: '12px' }}>
            {meta?.description}
          </Typography>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.xs }}>
        <Badge variant={statusBadgeVariant(result.status)} size="sm">
          {statusLabel(result.status)}
        </Badge>
        {result.latency !== undefined && (
          <Typography
            variant="caption"
            style={{ fontSize: '12px', color: latencyColor(result.latency, colors) }}
          >
            {result.latency}ms
          </Typography>
        )}
      </div>

      {result.message && result.status !== 'ok' && (
        <Typography
          variant="caption"
          style={{
            fontSize: '11px',
            color: colors.error,
            marginTop: spacing.xs,
            display: 'block',
            wordBreak: 'break-word',
          }}
        >
          {result.message}
        </Typography>
      )}

      {meta?.docsUrl && (
        <a
          href={meta.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: spacing.sm,
            fontSize: '11px',
            color: colors.accent.tertiary,
            textDecoration: 'none',
          }}
        >
          Open dashboard ↗
        </a>
      )}
    </GlassCard>
  );
}

const LOADING_SERVICES: HealthData['services'] = {
  supabase: { status: 'loading' },
  openai: { status: 'loading' },
  elevenlabs: { status: 'loading' },
  stripe: { status: 'loading' },
};

export default function HealthPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const check = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/health', { cache: 'no-store' });
      const json = (await res.json()) as HealthData;
      setData(json);
      setLastChecked(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reach health API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  const services = data?.services ?? LOADING_SERVICES;
  const env = data?.env ?? {};

  const okCount = data
    ? Object.values(data.services).filter((s) => s.status === 'ok').length
    : 0;
  const totalCount = 4;
  const allOk = okCount === totalCount;

  return (
    <PageShell intensity="medium" bare>
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: spacing.xl }}>

        {/* Header */}
        <div style={{ marginBottom: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
            <span style={{ fontSize: '1.5rem' }}>🩺</span>
            <Typography variant="h1" style={{ color: colors.text.primary, fontSize: '1.75rem' }}>
              API Health
            </Typography>
            {data && (
              <Badge variant={allOk ? 'success' : 'warning'} size="sm">
                {allOk ? 'All systems operational' : `${okCount}/${totalCount} services OK`}
              </Badge>
            )}
          </div>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
            Live connection status for all external services.
          </Typography>
          <div style={{ display: 'flex', gap: spacing.md, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => void check()}
              disabled={loading}
              style={{
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: borderRadius.sm,
                background: loading ? colors.glass.light : colors.accent.primary,
                color: loading ? colors.text.secondary : '#fff',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'background 0.2s',
              }}
            >
              {loading ? 'Checking…' : '↻ Refresh'}
            </button>
            {lastChecked && (
              <Typography variant="caption" style={{ color: colors.text.secondary, fontSize: '12px' }}>
                Last checked: {lastChecked.toLocaleTimeString()}
              </Typography>
            )}
          </div>

          {error && (
            <div
              style={{
                marginTop: spacing.md,
                padding: spacing.sm,
                borderRadius: borderRadius.sm,
                background: `${colors.error}18`,
                border: `1px solid ${colors.error}40`,
                color: colors.error,
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Service cards */}
        <Typography variant="h2" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1rem', fontWeight: 600 }}>
          Services
        </Typography>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: spacing.md,
            marginBottom: spacing.xl,
          }}
        >
          {(Object.keys(services) as (keyof typeof services)[]).map((name) => (
            <ServiceCard key={name} name={name} result={services[name]} colors={colors} />
          ))}
        </div>

        {/* Environment variables */}
        <Typography variant="h2" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1rem', fontWeight: 600 }}>
          Environment Variables
        </Typography>
        <GlassCard variant="content" style={{ marginBottom: spacing.xl }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: spacing.sm,
            }}
          >
            {Object.entries(ENV_LABELS).map(([key, label]) => {
              const set = env[key] ?? false;
              return (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: `${spacing.xs} ${spacing.sm}`,
                    borderRadius: borderRadius.sm,
                    background: set ? `${colors.success}10` : `${colors.error}10`,
                    border: `1px solid ${set ? colors.success : colors.error}30`,
                  }}
                >
                  <div>
                    <Typography variant="caption" style={{ fontSize: '12px', fontWeight: 600, color: colors.text.primary }}>
                      {label}
                    </Typography>
                    <Typography variant="caption" style={{ fontSize: '10px', color: colors.text.secondary, display: 'block' }}>
                      {key}
                    </Typography>
                  </div>
                  <Badge variant={set ? 'success' : 'error'} size="sm">
                    {set ? 'Set' : 'Missing'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Raw JSON */}
        {data && (
          <>
            <Typography variant="h2" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1rem', fontWeight: 600 }}>
              Raw Response
            </Typography>
            <GlassCard variant="content" style={{ marginBottom: spacing.xl }}>
              <pre
                style={{
                  fontSize: '12px',
                  color: colors.text.secondary,
                  overflow: 'auto',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {JSON.stringify(data, null, 2)}
              </pre>
            </GlassCard>
          </>
        )}

        {/* Nav */}
        <div
          style={{
            paddingTop: spacing.lg,
            borderTop: `1px solid ${colors.glass.border}`,
            display: 'flex',
            gap: spacing.md,
            flexWrap: 'wrap',
          }}
        >
          <Link href="/system" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>
            System
          </Link>
          <Link href="/showcase" style={{ color: colors.accent.tertiary, fontSize: 14, textDecoration: 'none' }}>
            Showcase
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
