'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button, Typography } from '@/components/ui';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR, CARD_PADDING_AUTH } from '@/theme';
import { buttonTokens } from '@waqup/shared/theme';
import { ArrowRight, Sparkles } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { Analytics } from '@waqup/shared/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

export type WaitlistCTAVariant = 'inline' | 'banner';

interface WaitlistCTAProps {
  variant?: WaitlistCTAVariant;
  /** Headline override for the banner variant */
  headline?: string;
  /** Sub-text override */
  subtext?: string;
  className?: string;
  style?: React.CSSProperties;
}

// ── Inline variant (button only → /waitlist) ──────────────────────────────────

function InlineCTA({ headline, subtext, style }: { headline?: string; subtext?: string; style?: React.CSSProperties }) {
  const t = useTranslations('marketing');
  const { theme } = useTheme();
  const colors = theme.colors;
  const pathname = usePathname();
  const page = pathname?.replace(/^\/(en|pt|es|fr|de)/, '') || '/';

  return (
    <div style={{ textAlign: 'center', ...style }}>
      {headline && (
        <Typography
          variant="h2"
          style={{ color: colors.text.primary, marginBottom: spacing.sm }}
        >
          {headline}
        </Typography>
      )}
      {subtext && (
        <Typography
          variant="body"
          style={{ color: colors.text.secondary, marginBottom: spacing.lg, lineHeight: 1.65 }}
        >
          {subtext}
        </Typography>
      )}
      <Link
        href="/waitlist"
        style={{ textDecoration: 'none', display: 'inline-block' }}
        onClick={() => Analytics.ctaClicked('waitlist-full-form', page)}
      >
        <Button
          variant="primary"
          size="lg"
          style={{ display: 'inline-flex', alignItems: 'center', gap: buttonTokens.iconGap }}
        >
          {t('waitlistCta.joinWaitlist')} <ArrowRight size={buttonTokens.iconSize.lg} strokeWidth={2.5} />
        </Button>
      </Link>
    </div>
  );
}

// ── Banner variant ─────────────────────────────────────────────────────────────

function BannerCTA({ headline, subtext, style }: { headline?: string; subtext?: string; style?: React.CSSProperties }) {
  const t = useTranslations('marketing');
  const { theme } = useTheme();
  const colors = theme.colors;
  const defaultHeadline = headline ?? t('waitlistCta.bannerHeadline');
  const defaultSubtext = subtext ?? t('waitlistCta.bannerSubtext');

  return (
    <div
      style={{
        position: 'relative',
        padding: CARD_PADDING_AUTH,
        borderRadius: borderRadius.xl,
        background: colors.glass.light,
        backdropFilter: BLUR.xl,
        WebkitBackdropFilter: BLUR.xl,
        boxShadow: `0 16px 64px ${colors.accent.primary}40`,
        overflow: 'hidden',
        textAlign: 'center',
        ...style,
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: `${spacing.xs} ${spacing.md}`,
            borderRadius: borderRadius.full,
            background: `${colors.accent.tertiary}20`,
            border: `1px solid ${colors.accent.tertiary}40`,
            marginBottom: spacing.lg,
          }}
        >
          <Sparkles size={12} color={colors.accent.tertiary} />
          <Typography
            variant="smallBold"
            style={{ color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.08em' }}
          >
            {t('waitlistCta.earlyAccessBadge')}
          </Typography>
        </div>

        <InlineCTA headline={defaultHeadline} subtext={defaultSubtext} style={style} />
      </div>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function WaitlistCTA({
  variant = 'inline',
  headline,
  subtext,
  style,
}: WaitlistCTAProps) {
  if (variant === 'banner') {
    return <BannerCTA headline={headline} subtext={subtext} style={style} />;
  }
  return <InlineCTA headline={headline} subtext={subtext} style={style} />;
}
