'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTheme, spacing, borderRadius, BLUR } from '@/theme';
import { PageShell, GlassCard } from '@/components';
import { Typography, Button } from '@/components';
import { Link } from '@/i18n/navigation';
import { useAuthStore } from '@/stores';
import { Analytics } from '@waqup/shared/utils';
import { useTranslations } from 'next-intl';

const INTENTIONS = [
  { id: 'confidence', emoji: '🦁', label: 'Confidence & Self-Worth', sub: 'Own who you are, fully' },
  { id: 'abundance', emoji: '💎', label: 'Abundance & Wealth', sub: 'Rewire your money beliefs' },
  { id: 'peace', emoji: '🌊', label: 'Inner Peace & Calm', sub: 'Quiet the noise inside' },
  { id: 'love', emoji: '❤️', label: 'Love & Relationships', sub: 'Open your heart completely' },
  { id: 'purpose', emoji: '🔥', label: 'Purpose & Direction', sub: 'Live with total clarity' },
  { id: 'health', emoji: '⚡', label: 'Health & Vitality', sub: 'Heal from the inside out' },
];

export default function OnboardingPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const t = useTranslations('onboarding');
  const [screen, setScreen] = useState<'why' | 'intention'>('why');
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'there';

  // Grant 20 welcome Qs on first visit — idempotent on server side
  useEffect(() => {
    if (!user) return;
    fetch('/api/credits/welcome', { method: 'POST' }).catch(() => {});
  }, [user]);

  const handleWhyReady = () => {
    setScreen('intention');
  };

  const handleIntentionContinue = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    Analytics.onboardingStepCompleted('intention', user?.id);
    await new Promise((r) => setTimeout(r, 400));
    router.push(`/onboarding/voice?intention=${encodeURIComponent(selected)}`);
  };

  const handleSkipToOrb = () => {
    Analytics.onboardingStepCompleted('intention_skipped', user?.id);
    router.push('/create/orb');
  };

  const progressStep = screen === 'why' ? 1 : 2;

  return (
    <PageShell intensity="strong" maxWidth={520}>
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: spacing.xl,
          paddingBottom: spacing.xxxl,
          gap: spacing.xl,
        }}
      >
        {/* Progress indicator — 5 dots */}
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            paddingTop: spacing.md,
          }}
        >
          {([1, 2, 3, 4, 5] as const).map((i) => {
            const isActive = i <= progressStep;
            return (
              <div
                key={i}
                style={{
                  height: '3px',
                  width: '32px',
                  borderRadius: borderRadius.full,
                  background: isActive ? colors.accent.primary : `${colors.accent.primary}30`,
                  transition: 'background 0.3s ease',
                }}
              />
            );
          })}
        </div>

        {screen === 'why' && (
          <>
            <GlassCard
              style={{
                textAlign: 'left',
                padding: `${spacing.xxl} ${spacing.xl}`,
                width: '100%',
              }}
            >
              <Typography
                variant="h1"
                style={{
                  color: colors.text.primary,
                  fontSize: 'clamp(20px, 4vw, 26px)',
                  fontWeight: 800,
                  lineHeight: 1.3,
                  marginBottom: spacing.lg,
                }}
              >
                {t('why.founderStory')}
              </Typography>
              <Typography
                variant="body"
                style={{
                  color: colors.text.secondary,
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: spacing.sm,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {t('why.rulesTitle')}
              </Typography>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: spacing.lg,
                  color: colors.text.secondary,
                  fontSize: '14px',
                  lineHeight: 1.7,
                }}
              >
                <li>{t('why.ruleRepetition')}</li>
                <li>{t('why.rulePositive')}</li>
                <li>{t('why.rulePresent')}</li>
                <li>{t('why.ruleBelievable')}</li>
                <li>{t('why.ruleOwnVoice')}</li>
              </ul>
              <Typography
                variant="body"
                style={{
                  color: colors.text.secondary,
                  fontSize: '14px',
                  lineHeight: 1.6,
                  marginTop: spacing.md,
                }}
              >
                {t('why.identityShift')}
              </Typography>
              <Link
                href="/explanation"
                style={{
                  display: 'inline-block',
                  marginTop: spacing.sm,
                  fontSize: '13px',
                  color: colors.accent.tertiary,
                  textDecoration: 'none',
                }}
              >
                {t('why.scienceLink')} →
              </Link>
            </GlassCard>
            <div style={{ width: '100%' }}>
              <Button
                variant="primary"
                size="lg"
                onClick={handleWhyReady}
                data-testid="onboarding-continue-button"
                style={{
                  width: '100%',
                  minHeight: '56px',
                  fontSize: '17px',
                  fontWeight: 700,
                }}
              >
                {t('why.cta')}
              </Button>
            </div>
          </>
        )}

        {screen === 'intention' && (
          <>
            <GlassCard
              style={{
                textAlign: 'center',
                padding: `${spacing.xxl} ${spacing.xl}`,
                width: '100%',
              }}
            >
              <Typography
                variant="h1"
                style={{
                  color: colors.text.primary,
                  fontSize: 'clamp(22px, 5vw, 30px)',
                  fontWeight: 900,
                  lineHeight: 1.2,
                  marginBottom: spacing.md,
                }}
              >
                {t('intention.headline')}
              </Typography>
              <Typography
                variant="body"
                style={{
                  color: colors.text.secondary,
                  fontSize: '15px',
                  lineHeight: 1.6,
                }}
              >
                {t('intention.subhead')}
              </Typography>
            </GlassCard>

            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: spacing.md,
              }}
            >
              {INTENTIONS.map((intention) => {
                const isActive = selected === intention.id;
                return (
                  <button
                    key={intention.id}
                    onClick={() => setSelected(intention.id)}
                    style={{
                      all: 'unset',
                      cursor: 'pointer',
                      padding: `${spacing.lg} ${spacing.md}`,
                      borderRadius: borderRadius.lg,
                      background: isActive ? `${colors.accent.primary}25` : colors.glass.light,
                      backdropFilter: BLUR.lg,
                      WebkitBackdropFilter: BLUR.lg,
                      border: `1px solid ${isActive ? colors.accent.primary : colors.glass.border}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: spacing.sm,
                      textAlign: 'center',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive
                        ? `0 0 24px ${colors.accent.primary}40`
                        : `0 4px 16px ${colors.accent.primary}15`,
                      minHeight: '44px',
                    }}
                  >
                    <span style={{ fontSize: '28px', lineHeight: 1 }}>{intention.emoji}</span>
                    <Typography
                      variant="body"
                      style={{
                        color: isActive ? colors.accent.primary : colors.text.primary,
                        fontWeight: 700,
                        fontSize: '13px',
                        lineHeight: 1.3,
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {intention.label}
                    </Typography>
                    <Typography
                      variant="body"
                      style={{
                        color: colors.text.secondary,
                        fontSize: '11px',
                        lineHeight: 1.4,
                        opacity: 0.8,
                      }}
                    >
                      {intention.sub}
                    </Typography>
                  </button>
                );
              })}
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.md, alignItems: 'center' }}>
              <Button
                variant="primary"
                size="lg"
                disabled={!selected || isSubmitting}
                onClick={handleIntentionContinue}
                data-testid="onboarding-continue-button"
                style={{
                  width: '100%',
                  minHeight: '56px',
                  fontSize: '17px',
                  fontWeight: 700,
                  opacity: selected ? 1 : 0.45,
                  transition: 'opacity 0.2s ease',
                }}
              >
                {isSubmitting ? 'Creating your first practice…' : t('intention.cta')}
              </Button>
              <button
                onClick={handleSkipToOrb}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: `${spacing.sm} 0`,
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="body"
                  style={{
                    color: colors.text.secondary,
                    fontSize: '13px',
                    opacity: 0.6,
                  }}
                >
                  {t('intention.skip')}
                </Typography>
              </button>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
