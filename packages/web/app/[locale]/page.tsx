'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Typography, Button } from '@/components';
import { PageShell, WaitlistCTA, FoundingMemberModal, PublicFooter } from '@/components';
import { spacing, borderRadius, BLUR } from '@/theme';
import { CONTENT_MAX_WIDTH, NAV_TOP_OFFSET } from '@/theme';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTheme } from '@/theme';
import { Sparkles, ArrowRight, Gift, BookOpen } from 'lucide-react';

function formatWaitlistCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k+`;
  return count.toLocaleString();
}

export default function PreLaunchLandingPage() {
  const t = useTranslations('marketing.preLaunch');
  const { theme } = useTheme();
  const colors = theme.colors;
  const [showFoundingModal, setShowFoundingModal] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/waitlist/count')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.count === 'number') setWaitlistCount(data.count);
      })
      .catch(() => {});
  }, []);

  return (
    <PageShell intensity="high" bare scrollSnap allowDocumentScroll>
      <section
        className="landing-hero"
        style={{
          position: 'relative' as const,
          minHeight: '100dvh',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          padding: `${NAV_TOP_OFFSET} clamp(16px, 4vw, 32px) ${spacing.xxl}`,
          marginTop: `calc(-1 * ${NAV_TOP_OFFSET})`,
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
          maxWidth: CONTENT_MAX_WIDTH,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          minWidth: 0,
        }}
      >
        {/* Background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100vw',
            zIndex: 0,
          }}
        >
          <Image
            src="/images/landing-hero-bg.png"
            alt=""
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
            sizes="100vw"
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(6,2,20,0.85) 0%, rgba(6,2,20,0.6) 50%, rgba(6,2,20,0.9) 100%)',
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Badge */}
          <div
            style={{
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              background: `${colors.accent.tertiary}20`,
              border: `1px solid ${colors.accent.tertiary}40`,
              display: 'inline-block',
              marginBottom: spacing.md,
            }}
          >
            <Typography
              variant="smallBold"
              style={{
                color: colors.accent.tertiary,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {t('badge')}
            </Typography>
          </div>

          {/* Brand */}
          <div
            style={{
              fontSize: 'clamp(32px, 8vw, 72px)',
              fontWeight: 300,
              lineHeight: 1,
              marginBottom: spacing.md,
              letterSpacing: '-2px',
              color: colors.text.primary,
            }}
          >
            <span style={{ fontWeight: 300, color: colors.text.primary }}>wa</span>
            <span style={{ color: colors.accent.tertiary, fontWeight: 300 }}>Q</span>
            <span style={{ fontWeight: 300, color: colors.text.primary }}>up</span>
          </div>

          {/* Headline */}
          <Typography
            variant="body"
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              color: colors.text.primary,
              maxWidth: 520,
              margin: `0 auto ${spacing.sm} auto`,
              lineHeight: 1.25,
              fontWeight: 400,
            }}
          >
            {t('headline')}
          </Typography>

          <Typography
            variant="body"
            style={{
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              color: colors.text.secondary,
              maxWidth: 480,
              margin: `0 auto ${spacing.xl} auto`,
              lineHeight: 1.6,
              fontWeight: 300,
            }}
          >
            {t('subheadline')}
          </Typography>

          {/* Waitlist CTA */}
          <div style={{ width: '100%', maxWidth: 440, marginBottom: spacing.lg }}>
            <WaitlistCTA
              variant="inline"
              subtext={t('earlyAccess')}
              compact
            />
          </div>

          {/* Beta tester + Full form */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.sm,
              width: '100%',
              maxWidth: 440,
              marginBottom: spacing.lg,
            }}
          >
            <Link href="/waitlist" style={{ textDecoration: 'none' }}>
              <Button
                variant="outline"
                size="md"
                fullWidth
                style={{
                  borderColor: colors.accent.primary,
                  color: colors.accent.tertiary,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.sm,
                }}
              >
                <Sparkles size={16} />
                {t('ctaBetaTester')}
              </Button>
            </Link>
            <Typography
              variant="small"
              style={{
                color: colors.text.tertiary ?? colors.text.secondary,
                textAlign: 'center',
                lineHeight: 1.4,
              }}
            >
              {t('ctaBetaDesc')}
            </Typography>
          </div>

          {waitlistCount !== null && waitlistCount > 0 && (
            <div
              style={{
                marginBottom: spacing.xl,
                fontSize: 13,
                color: colors.text.tertiary ?? colors.text.secondary,
              }}
            >
              {t('waitlistCount', { count: formatWaitlistCount(waitlistCount) })}
            </div>
          )}

          {/* Share & earn card */}
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              marginBottom: spacing.xl,
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              background: colors.glass.light,
              backdropFilter: BLUR.lg,
              WebkitBackdropFilter: BLUR.lg,
              border: `1px solid ${colors.glass.border}`,
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.md }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: borderRadius.md,
                  background: `${colors.accent.primary}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Gift size={20} color={colors.accent.primary} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h4"
                  style={{
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  {t('shareEarnTitle')}
                </Typography>
                <Typography
                  variant="small"
                  style={{
                    color: colors.text.secondary,
                    lineHeight: 1.5,
                    fontSize: 13,
                  }}
                >
                  {t('shareEarnDesc')}
                </Typography>
                <Link
                  href="/join"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: spacing.sm,
                    fontSize: 13,
                    color: colors.accent.tertiary,
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {t('ctaWaitlist')} <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* For teachers */}
          <Link
            href="/for-teachers"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: spacing.md,
              width: '100%',
              maxWidth: 400,
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              background: `${colors.accent.secondary}10`,
              border: `1px solid ${colors.accent.secondary}30`,
              textDecoration: 'none',
              marginBottom: spacing.xl,
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: borderRadius.md,
                background: `${colors.accent.secondary}25`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BookOpen size={20} color={colors.accent.secondary} strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h4"
                style={{
                  color: colors.text.primary,
                  marginBottom: spacing.xs,
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {t('forTeachersTitle')}
              </Typography>
              <Typography
                variant="small"
                style={{
                  color: colors.text.secondary,
                  lineHeight: 1.5,
                  fontSize: 13,
                }}
              >
                {t('forTeachersDesc')}
              </Typography>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: spacing.sm,
                  fontSize: 13,
                  color: colors.accent.secondary,
                  fontWeight: 500,
                }}
              >
                {t('exploreProgramme')} <ArrowRight size={12} />
              </span>
            </div>
          </Link>

          {/* Founding members */}
          <button
            type="button"
            onClick={() => setShowFoundingModal(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.text.tertiary ?? colors.text.secondary,
              padding: 0,
              fontSize: 13,
              marginBottom: spacing.lg,
            }}
          >
            {t('foundingMembersLink')}
          </button>

          {/* Sign in */}
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <Button
              variant="outline"
              size="md"
              style={{
                borderColor: colors.glass.border,
                color: colors.text.secondary,
              }}
            >
              {t('signInButton')}
            </Button>
          </Link>
        </div>

        {/* Footer links */}
        <div
          style={{
            position: 'absolute',
            bottom: spacing.xl,
            left: 0,
            right: 0,
            zIndex: 2,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.md,
            fontSize: 12,
            color: colors.text.tertiary ?? colors.text.secondary,
            opacity: 0.8,
          }}
        >
          <Link href="/how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>
            {t('howItWorks')}
          </Link>
          <span style={{ opacity: 0.4 }}>·</span>
          <Link href="/launch" style={{ color: 'inherit', textDecoration: 'none' }}>
            {t('launchPage')}
          </Link>
          <span style={{ opacity: 0.4 }}>·</span>
          <Link href="/for-teachers" style={{ color: 'inherit', textDecoration: 'none' }}>
            {t('forTeachersTitle')}
          </Link>
          <span style={{ opacity: 0.4 }}>·</span>
          <Link href="/for-coaches" style={{ color: 'inherit', textDecoration: 'none' }}>
            {t('forCoaches')}
          </Link>
          <span style={{ opacity: 0.4 }}>·</span>
          <Link href="/for-studios" style={{ color: 'inherit', textDecoration: 'none' }}>
            {t('forStudios')}
          </Link>
          <span style={{ opacity: 0.4 }}>·</span>
          <Link href="/for-creators" style={{ color: 'inherit', textDecoration: 'none' }}>
            {t('forCreators')}
          </Link>
        </div>

        <FoundingMemberModal
          isOpen={showFoundingModal}
          onClose={() => setShowFoundingModal(false)}
        />
      </section>

      <section style={{ scrollSnapAlign: 'none', minHeight: 'auto' }}>
        <PublicFooter />
      </section>
    </PageShell>
  );
}
