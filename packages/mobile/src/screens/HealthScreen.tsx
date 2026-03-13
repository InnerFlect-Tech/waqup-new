import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as Sentry from '@sentry/react-native';
import { Screen } from '@/components/layout';
import { Typography } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { withOpacity } from '@waqup/shared/theme';
import { API_BASE_URL } from '@/constants/app';

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

const SERVICE_META: Record<string, { label: string; description: string; icon: string }> = {
  supabase: { label: 'Supabase', description: 'Database, Auth, Storage', icon: '🗄️' },
  openai: { label: 'OpenAI', description: 'GPT-4o-mini — scripts & chat', icon: '🤖' },
  elevenlabs: { label: 'ElevenLabs', description: 'Voice Cloning & TTS', icon: '🎙️' },
  stripe: { label: 'Stripe', description: 'Subscriptions & payments', icon: '💳' },
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

function statusColor(
  status: ServiceStatus,
  colors: { success: string; error: string; warning: string; text: { secondary: string } }
): string {
  if (status === 'ok') return colors.success;
  if (status === 'error') return colors.error;
  if (status === 'not_configured') return colors.warning;
  return colors.text.secondary;
}

function statusLabel(status: ServiceStatus): string {
  if (status === 'ok') return 'Connected';
  if (status === 'error') return 'Error';
  if (status === 'not_configured') return 'Not configured';
  return 'Checking…';
}

function latencyColor(
  ms: number | undefined,
  colors: { success: string; warning: string; error: string }
): string {
  if (ms === undefined) return colors.warning;
  if (ms < 500) return colors.success;
  if (ms < 1500) return colors.warning;
  return colors.error;
}

const LOADING_SERVICES: HealthData['services'] = {
  supabase: { status: 'loading' },
  openai: { status: 'loading' },
  elevenlabs: { status: 'loading' },
  stripe: { status: 'loading' },
};

export default function HealthScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const check = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      const json = (await res.json()) as HealthData;
      setData(json);
      setLastChecked(new Date());
    } catch (err) {
      setFetchError(
        err instanceof Error ? err.message : 'Could not reach health API'
      );
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
  const allOk = okCount === 4;

  return (
    <Screen scrollable padding>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>🩺 API Health</Typography>
        <View
          style={[
            styles.overallBadge,
            {
              backgroundColor: allOk
                ? `${colors.success}22`
                : `${colors.warning}22`,
              borderColor: allOk ? colors.success : colors.warning,
            },
          ]}
        >
          <Typography
            variant="captionBold"
            style={{ color: allOk ? colors.success : colors.warning }}
          >
            {loading
              ? 'Checking…'
              : allOk
              ? 'All systems operational'
              : `${okCount}/4 OK`}
          </Typography>
        </View>
        <Typography variant="caption" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
          Live connection status for all external services.
        </Typography>
        {lastChecked && (
          <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
            Last checked: {lastChecked.toLocaleTimeString()}
          </Typography>
        )}
        <TouchableOpacity
          onPress={() => void check()}
          disabled={loading}
          style={[
            styles.refreshBtn,
            {
              backgroundColor: loading ? colors.glass?.light : colors.accent.primary,
              opacity: loading ? 0.6 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.text.onDark} />
          ) : (
            <Typography variant="captionBold" style={{ color: colors.text.onDark }}>↻ Refresh</Typography>
          )}
        </TouchableOpacity>
      </View>

      {fetchError && (
        <View
          style={[
            styles.errorBanner,
            { backgroundColor: withOpacity(colors.error, 0.09), borderColor: withOpacity(colors.error, 0.25) },
          ]}
        >
          <Typography variant="captionBold" style={{ color: colors.error, marginBottom: 4 }}>{fetchError}</Typography>
          <Typography variant="small" style={{ color: colors.text.secondary }}>
            Make sure the web server is running at {API_BASE_URL}
          </Typography>
        </View>
      )}

      {/* Services */}
      <Typography variant="captionBold" style={{ color: colors.text.primary, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>Services</Typography>
      {(Object.keys(services) as (keyof typeof services)[]).map((name) => {
        const result = services[name];
        const meta = SERVICE_META[name];
        const sc = statusColor(result.status, colors);
        return (
          <View
            key={name}
            style={[
              styles.serviceCard,
              {
                backgroundColor: colors.glass?.light ?? `${colors.background.secondary}`,
                borderColor: result.status === 'loading'
                  ? colors.glass?.border
                  : withOpacity(sc, 0.25),
              },
            ]}
          >
            <View style={styles.serviceRow}>
              <Typography style={{ fontSize: 24, marginRight: spacing.sm }}>{meta?.icon}</Typography>
              <View style={styles.serviceInfo}>
                <Typography variant="bodyBold" style={{ color: colors.text.primary }}>
                  {meta?.label ?? name}
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary }}>
                  {meta?.description}
                </Typography>
              </View>
              <View style={[styles.statusDot, { backgroundColor: sc }]} />
            </View>
            <View style={styles.serviceFooter}>
              <View style={[styles.statusBadge, { backgroundColor: withOpacity(sc, 0.09), borderColor: withOpacity(sc, 0.25) }]}>
                <Typography variant="smallBold" style={{ color: sc }}>
                  {statusLabel(result.status)}
                </Typography>
              </View>
              {result.latency !== undefined && (
                <Typography
                  variant="small"
                  style={{ color: latencyColor(result.latency, colors), fontWeight: '500' }}
                >
                  {result.latency}ms
                </Typography>
              )}
            </View>
            {result.message && result.status !== 'ok' && (
              <Typography variant="small" style={{ color: colors.error, marginTop: spacing.xs, fontSize: 11 }}>
                {result.message}
              </Typography>
            )}
          </View>
        );
      })}

      {/* Env vars */}
      <Typography variant="captionBold" style={{ color: colors.text.primary, marginTop: spacing.lg, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Environment Variables
      </Typography>
      <View
        style={[
          styles.envCard,
          {
            backgroundColor: colors.glass?.light ?? colors.background.secondary,
            borderColor: colors.glass?.border,
          },
        ]}
      >
        {Object.entries(ENV_LABELS).map(([key, label]) => {
          const set = env[key] ?? false;
          return (
            <View key={key} style={[styles.envRow, { borderBottomColor: colors.glass.border }]}>
              <View style={styles.envInfo}>
                <Typography variant="captionBold" style={{ color: colors.text.primary }}>{label}</Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, marginTop: 1 }}>{key}</Typography>
              </View>
              <View
                style={[
                  styles.envBadge,
                  {
                    backgroundColor: set ? `${colors.success}18` : `${colors.error}18`,
                    borderColor: set ? `${colors.success}40` : `${colors.error}40`,
                  },
                ]}
              >
                <Typography variant="smallBold" style={{ color: set ? colors.success : colors.error, fontSize: 11 }}>
                  {set ? 'Set' : 'Missing'}
                </Typography>
              </View>
            </View>
          );
        })}
      </View>

      {/* Sentry test — dev only when EXPO_PUBLIC_SENTRY_DEV_TEST=1 */}
      {__DEV__ && process.env.EXPO_PUBLIC_SENTRY_DEV_TEST === '1' && (
        <View style={[styles.sentrySection, { borderColor: colors.glass.border }]}>
          <Typography variant="captionBold" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
            Test Sentry
          </Typography>
          <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
            Tap below to send a test error. Check your Sentry dashboard.
          </Typography>
          <TouchableOpacity
            onPress={() => {
              Sentry.captureException(new Error('waQup Sentry dev test — safe to ignore'));
              Alert.alert('Sent', 'Test error sent to Sentry. Check your dashboard.');
            }}
            style={[styles.refreshBtn, { backgroundColor: colors.accent.primary }]}
          >
            <Typography variant="captionBold" style={{ color: colors.text.onDark }}>Send Test Error</Typography>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11 }}>
          API Base: {API_BASE_URL}
        </Typography>
        <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11 }}>
          Accessible via waqup://health
        </Typography>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
  },
  overallBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  refreshBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  errorBanner: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  errorHint: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  serviceCard: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  serviceInfo: {
    flex: 1,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  serviceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  latencyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  errorMsg: {
    fontSize: 11,
    marginTop: spacing.xs,
  },
  envCard: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  envRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  envInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  envBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
  },
  footer: {
    marginTop: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.xs,
  },
  sentrySection: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
});
