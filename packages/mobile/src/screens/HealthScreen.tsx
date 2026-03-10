import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Screen } from '@/components/layout';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
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
        <Text style={[styles.title, { color: colors.text.primary }]}>🩺 API Health</Text>
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
          <Text
            style={[
              styles.overallBadgeText,
              { color: allOk ? colors.success : colors.warning },
            ]}
          >
            {loading
              ? 'Checking…'
              : allOk
              ? 'All systems operational'
              : `${okCount}/4 OK`}
          </Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Live connection status for all external services.
        </Text>
        {lastChecked && (
          <Text style={[styles.caption, { color: colors.text.secondary }]}>
            Last checked: {lastChecked.toLocaleTimeString()}
          </Text>
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
            <ActivityIndicator size="small" color={colors.text.primary} />
          ) : (
            <Text style={styles.refreshBtnText}>↻ Refresh</Text>
          )}
        </TouchableOpacity>
      </View>

      {fetchError && (
        <View
          style={[
            styles.errorBanner,
            { backgroundColor: `${colors.error}18`, borderColor: `${colors.error}40` },
          ]}
        >
          <Text style={[styles.errorText, { color: colors.error }]}>{fetchError}</Text>
          <Text style={[styles.errorHint, { color: colors.text.secondary }]}>
            Make sure the web server is running at {API_BASE_URL}
          </Text>
        </View>
      )}

      {/* Services */}
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Services</Text>
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
                  : `${sc}40`,
              },
            ]}
          >
            <View style={styles.serviceRow}>
              <Text style={styles.serviceIcon}>{meta?.icon}</Text>
              <View style={styles.serviceInfo}>
                <Text style={[styles.serviceLabel, { color: colors.text.primary }]}>
                  {meta?.label ?? name}
                </Text>
                <Text style={[styles.serviceDescription, { color: colors.text.secondary }]}>
                  {meta?.description}
                </Text>
              </View>
              <View style={[styles.statusDot, { backgroundColor: sc }]} />
            </View>
            <View style={styles.serviceFooter}>
              <View style={[styles.statusBadge, { backgroundColor: `${sc}18`, borderColor: `${sc}40` }]}>
                <Text style={[styles.statusBadgeText, { color: sc }]}>
                  {statusLabel(result.status)}
                </Text>
              </View>
              {result.latency !== undefined && (
                <Text
                  style={[
                    styles.latencyText,
                    { color: latencyColor(result.latency, colors) },
                  ]}
                >
                  {result.latency}ms
                </Text>
              )}
            </View>
            {result.message && result.status !== 'ok' && (
              <Text style={[styles.errorMsg, { color: colors.error }]}>
                {result.message}
              </Text>
            )}
          </View>
        );
      })}

      {/* Env vars */}
      <Text style={[styles.sectionTitle, { color: colors.text.primary, marginTop: spacing.lg }]}>
        Environment Variables
      </Text>
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
            <View key={key} style={styles.envRow}>
              <View style={styles.envInfo}>
                <Text style={[styles.envLabel, { color: colors.text.primary }]}>{label}</Text>
                <Text style={[styles.envKey, { color: colors.text.secondary }]}>{key}</Text>
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
                <Text style={{ color: set ? colors.success : colors.error, fontSize: 11, fontWeight: '600' }}>
                  {set ? 'Set' : 'Missing'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.text.secondary }]}>
          API Base: {API_BASE_URL}
        </Text>
        <Text style={[styles.footerText, { color: colors.text.secondary }]}>
          Accessible via waqup://health
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  overallBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  overallBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  caption: {
    fontSize: 12,
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
  refreshBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
  serviceIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceLabel: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  serviceDescription: {
    fontSize: 12,
    lineHeight: 16,
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
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  envInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  envLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  envKey: {
    fontSize: 10,
    marginTop: 1,
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
  footerText: {
    fontSize: 11,
  },
});
