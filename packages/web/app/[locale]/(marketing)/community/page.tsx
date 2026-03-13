'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR, CONTENT_MAX_WIDTH } from '@/theme';
import { Typography, Button, PageShell, PublicFooter } from '@/components';
import { Link } from '@/i18n/navigation';

/**
 * Community page — invitational, grounded.
 * "Awaken people" coming together, collective consciousness, contributing to a different world — without grandiosity.
 */
export default function CommunityPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const t = useTranslations('marketing.community');

  return (
    <PageShell intensity="medium" bare allowDocumentScroll>
      <section
        style={{
          width: '100%',
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
          padding: `clamp(80px, 12vh, 140px) ${spacing.xl} ${spacing.xxxl}`,
        }}
      >
        <div
          style={{
            padding: spacing.xxl,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${colors.glass.border}`,
          }}
        >
          <Typography
            variant="h1"
            style={{
              color: colors.text.primary,
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: spacing.md,
            }}
          >
            {t('headline')}
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              fontSize: '18px',
              lineHeight: 1.6,
              marginBottom: spacing.xl,
            }}
          >
            {t('subhead')}
          </Typography>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, marginBottom: spacing.xl }}>
            <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.7 }}>
              {t('body1')}
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.7 }}>
              {t('body2')}
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.7 }}>
              {t('body3')}
            </Typography>
          </div>

          <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
            <Link
              href="/waitlist"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.md} ${spacing.xl}`,
                borderRadius: borderRadius.lg,
                background: colors.gradients.primary,
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.92'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              {t('cta')}
            </Link>
            <Link
              href="/sanctuary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.md} ${spacing.xl}`,
                borderRadius: borderRadius.lg,
                border: `1px solid ${colors.glass.border}`,
                color: colors.text.primary,
                fontSize: 15,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>
      <PublicFooter />
    </PageShell>
  );
}
