'use client';

import React from 'react';
import { Typography, PageShell, GlassCard } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH } from '@/theme';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Global tracking page — items still requiring attention before launch.
 * Superadmin only. Canonical source: updates/open-items.md — keep in sync.
 */

const OPEN_ITEMS = [
  {
    id: 'e2e-critical-flows',
    title: 'E2E critical flows',
    origin: 'test:e2e:critical',
    status: 'needs verification',
    explanation: 'Playwright webServer may timeout. Run with dev server already up.',
    action: 'Run `npm run dev:web`, then `npm run test:e2e:critical`. Set OVERRIDE_LOGIN_* for auth tests.',
  },
  {
    id: 'ios-eas-revenuecat-env',
    title: 'iOS eas.json + RevenueCat + env',
    origin: 'iOS App Store Release',
    status: 'to do',
    explanation: 'Replace REPLACE_WITH_* in eas.json. Set EXPO_PUBLIC_REVENUECAT_IOS_KEY, REVENUECAT_WEBHOOK_SECRET in Vercel.',
    action: 'See packages/mobile/SUBMISSION.md and /admin/ios-release.',
  },
  {
    id: 'atmosphere-mp3s',
    title: 'Upload atmosphere MP3 files',
    origin: 'Audio System',
    status: 'missing',
    explanation: 'Rain, forest, ocean, white-noise to Supabase Storage atmosphere bucket.',
    action: 'Guide: packages/web/scripts/upload-atmosphere-presets.md. Verify via GET /api/audio/atmosphere-status.',
  },
  {
    id: 'i18n-translation-review',
    title: 'Human translation review',
    origin: 'i18n',
    status: 'missing',
    explanation: 'Native speaker review of messages/[locale]/ — onboarding, create, sanctuary, auth.',
    action: 'Review packages/web/messages/[locale]/ JSON files.',
  },
  {
    id: 'i18n-mobile',
    title: 'Mobile i18n',
    origin: 'i18n',
    status: 'missing',
    explanation: 'Web uses next-intl; mobile still hardcoded English.',
    action: 'Wire expo-localization + i18next to shared message files in packages/mobile.',
  },
];

const RESOLVED_ITEMS: { id: string; title: string; resolvedBy: string }[] = [
  { id: 'meta-instagram-setup', title: 'Meta/Instagram setup', resolvedBy: 'App icon, /data-deletion, /api/webhooks/meta, domain verification meta tag, docs. Env vars in .env.local. Post-deploy: Vercel env, Meta Dashboard verify domain, webhook config.' },
  { id: 'api-account-delete', title: '/api/account/delete', resolvedBy: 'Implemented. SettingsScreen calls it.' },
  { id: 'api-revenuecat-webhook', title: '/api/webhooks/revenuecat', resolvedBy: 'Implemented. Configure REVENUECAT_WEBHOOK_SECRET + webhook URL.' },
  { id: 'iap-migration', title: 'Supabase IAP migration', resolvedBy: 'Applied via supabase db push.' },
  { id: 'middleware-proxy-conflict', title: 'middleware.ts vs proxy.ts', resolvedBy: 'proxy.ts only (Next.js 16). middleware.ts removed.' },
  { id: 'beta-tester-updates-page', title: 'Beta tester recruitment guide', resolvedBy: 'Full guide at /updates/beta-tester-recruitment.' },
  { id: 'oracle-400-empty-voice', title: 'Oracle 400 (empty voiceId)', resolvedBy: 'Server fallback to Rachel; client error display on stream failure.' },
  { id: 'landing-scroll-footer', title: 'Landing scroll + footer', resolvedBy: 'PublicFooter in landing flow; AppLayout hides on pathname=/; single scroll; overflow prevention.' },
  { id: 'sanctuary-hub-redesign', title: 'Sanctuary hub redesign', resolvedBy: 'Streak + Library prominent cards; Qs badge; Practice | Account grouped list.' },
  { id: 'i18n-hreflang', title: 'hreflang for SEO', resolvedBy: 'alternates.languages in app/[locale]/layout.tsx generateMetadata().' },
  { id: 'deduct-credits-migration', title: 'deduct_credits migration', resolvedBy: 'Verified. supabase db push reports remote up to date; 20260315000001 applied.' },
];

export default function OpenItemsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium" bare>
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: spacing.xl }}>
        <Link
          href="/updates"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.xs,
            color: colors.accent.primary,
            textDecoration: 'none',
            marginBottom: spacing.lg,
            fontSize: '14px',
          }}
        >
          <ArrowLeft size={16} />
          Back to Updates
        </Link>

        <div style={{ marginBottom: spacing.xl }}>
          <Typography
            variant="h1"
            style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.75rem' }}
          >
            Open Items
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Unresolved work requiring attention before launch. Canonical: updates/open-items.md. UI here for superadmin convenience.
          </Typography>
        </div>

        {OPEN_ITEMS.length === 0 ? (
          <GlassCard variant="content" style={{ padding: spacing.xl, textAlign: 'center' }}>
            <CheckCircle2 size={48} color={colors.accent.primary} style={{ marginBottom: spacing.md }} />
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              No open items. All tracked work is complete.
            </Typography>
          </GlassCard>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {OPEN_ITEMS.map((item) => (
              <GlassCard key={item.id} variant="content" style={{ padding: spacing.lg }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm }}>
                  <AlertCircle size={20} color={colors.warning ?? colors.accent.tertiary} style={{ flexShrink: 0 }} />
                  <div>
                    <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1.1rem', marginBottom: spacing.xs }}>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="small"
                      style={{ color: colors.text.tertiary ?? colors.text.secondary, marginBottom: spacing.sm }}
                    >
                      Origin: {item.origin} · Status: {item.status}
                    </Typography>
                    <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                      {item.explanation}
                    </Typography>
                    <Typography
                      variant="small"
                      style={{
                        color: colors.accent.primary,
                        padding: spacing.sm,
                        borderRadius: borderRadius.md,
                        background: `${colors.accent.primary}15`,
                      }}
                    >
                      <strong>Recommended action:</strong> {item.action}
                    </Typography>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {RESOLVED_ITEMS.length > 0 && (
          <div style={{ marginTop: spacing.xl }}>
            <Typography variant="h3" style={{ color: colors.text.secondary, marginBottom: spacing.md, fontSize: '1rem' }}>
              Recently resolved
            </Typography>
            <ul style={{ color: colors.text.tertiary ?? colors.text.secondary, marginLeft: spacing.lg, fontSize: '14px' }}>
              {RESOLVED_ITEMS.map((r) => (
                <li key={r.id} style={{ marginBottom: spacing.xs }}>
                  <strong style={{ color: colors.text.secondary }}>{r.title}</strong> — {r.resolvedBy}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PageShell>
  );
}
