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
import { ChevronRight, Sun, Moon, Clock, Check } from 'lucide-react';
import Image from 'next/image';

const TRANSFORMATION_IMAGE = '/images/transformation-before-shift-after.png';

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
    <PageShell intensity="strong" maxWidth={640}>
      <div
        className="onboarding-root"
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
            <div
              className="onboarding-why-section"
              style={{
                width: '100%',
                maxWidth: 640,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.lg,
                flex: 1,
                minHeight: 0,
                paddingBottom: spacing.lg,
              }}
            >
              <div style={{ textAlign: 'center', maxWidth: 420 }}>
                <h2
                  style={{
                    margin: 0,
                    marginBottom: spacing.sm,
                    fontSize: 'clamp(21px, 4vw, 27px)',
                    fontWeight: 600,
                    lineHeight: 1.3,
                    letterSpacing: '-0.02em',
                    color: colors.text.primary,
                  }}
                >
                  Change the{' '}
                  <span
                    style={{
                      background: colors.gradients.primary,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {t('why.headlineVoice')}
                  </span>
                  {' '}that shapes you
                </h2>
                <Typography
                  variant="body"
                  style={{
                    color: colors.text.secondary,
                    fontSize: 'clamp(14px, 1.9vw, 16px)',
                    lineHeight: 1.5,
                    fontWeight: 400,
                  }}
                >
                  {t('why.supportingLine')}
                </Typography>
                <div
                  style={{
                    width: 48,
                    height: 2,
                    margin: `${spacing.sm} auto 0`,
                    borderRadius: 1,
                    background: `linear-gradient(90deg, transparent, ${colors.accent.primary}88, transparent)`,
                    boxShadow: `0 0 12px ${colors.accent.primary}50`,
                  }}
                  aria-hidden
                />
              </div>

              {/* Transformation image: Before → Shift → After — cropped to three panels, aligned with page */}
              <div
                className="transformation-image-wrap"
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '3 / 1',
                  minHeight: 100,
                  maxHeight: 'clamp(120px, 22vw, 200px)',
                  borderRadius: borderRadius.lg,
                  overflow: 'hidden',
                  flexShrink: 0,
                  alignSelf: 'stretch',
                }}
              >
                <Image
                  src={TRANSFORMATION_IMAGE}
                  alt=""
                  fill
                  sizes="(max-width: 600px) 100vw, 640px"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center center',
                  }}
                  unoptimized
                  priority
                />
              </div>

              {/* Before → Shift → After — 3 panels with flow arrows */}
              <div
                className="transformation-panels"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1.15fr auto 1fr',
                  gridTemplateRows: 'auto',
                  gap: 0,
                  width: '100%',
                  alignItems: 'stretch',
                }}
              >
                {[
                  {
                    id: 'before',
                    titleKey: 'why.beforeTitle',
                    content: 'desc' as const,
                    style: {
                      background: `${colors.glass.light}`,
                      border: `1px solid ${colors.glass.border}`,
                      color: colors.text.secondary,
                      opacity: 0.95,
                    },
                  },
                  {
                    id: 'shift',
                    titleKey: 'why.shiftTitle',
                    content: 'shift' as const,
                    style: {
                      background: `linear-gradient(145deg, ${colors.accent.primary}22 0%, ${colors.accent.tertiary}14 100%)`,
                      border: `1px solid ${colors.accent.primary}55`,
                      color: colors.text.primary,
                      boxShadow: `0 0 40px ${colors.accent.primary}30`,
                    },
                  },
                  {
                    id: 'after',
                    titleKey: 'why.afterTitle',
                    content: 'checks' as const,
                    style: {
                      background: colors.glass.light,
                      border: `1px solid ${colors.glass.border}`,
                      color: colors.text.primary,
                    },
                  },
                ].flatMap((panel, idx) => {
                  const renderContent = () => {
                    if (panel.content === 'desc') {
                      return (
                        <Typography variant="body" style={{ fontSize: 13, lineHeight: 1.5, color: 'inherit', margin: 0 }}>
                          {t('why.beforeDesc')}
                        </Typography>
                      );
                    }
                    if (panel.content === 'shift') {
                      return (
                        <>
                          <Typography variant="body" style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.45, color: 'inherit', margin: 0 }}>
                            {t('why.shiftLine1')}
                          </Typography>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <Clock size={12} color={colors.accent.tertiary} style={{ opacity: 0.9 }} />
                            <Typography variant="body" style={{ fontSize: 12, lineHeight: 1.4, color: 'inherit', margin: 0 }}>
                              {t('why.shiftLine2')}
                            </Typography>
                          </div>
                        </>
                      );
                    }
                    return (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <Check size={12} color={colors.accent.primary} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                          <Typography variant="body" style={{ fontSize: 12, lineHeight: 1.45, color: 'inherit', margin: 0 }}>
                            {t('why.afterCheck1')}
                          </Typography>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          <Check size={12} color={colors.accent.primary} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                          <Typography variant="body" style={{ fontSize: 12, lineHeight: 1.45, color: 'inherit', margin: 0 }}>
                            {t('why.afterCheck2')}
                          </Typography>
                        </div>
                      </>
                    );
                  };
                  const el = (
                    <div
                      key={panel.id}
                      style={{
                        padding: spacing.md,
                        borderRadius: borderRadius.lg,
                        backdropFilter: BLUR.xl,
                        WebkitBackdropFilter: BLUR.xl,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: spacing.sm,
                        textAlign: 'center',
                        minHeight: 96,
                        justifyContent: 'center',
                        ...panel.style,
                      }}
                      className="transformation-panel"
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: panel.id === 'shift' ? colors.accent.tertiary : colors.text.tertiary,
                          marginBottom: 2,
                        }}
                      >
                        {t(panel.titleKey as 'why.beforeTitle' | 'why.shiftTitle' | 'why.afterTitle')}
                      </span>
                      {renderContent()}
                    </div>
                  );
                  const arrow = (
                    <div
                      key={`arrow-${idx}`}
                      className="transformation-arrow"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: spacing.xs,
                      }}
                    >
                      <ChevronRight size={16} color={colors.accent.primary} style={{ opacity: 0.7 }} />
                    </div>
                  );
                  return idx < 2 ? [el, arrow] : [el];
                })}
              </div>
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes wq-shift-pulse {
                  0%, 100% { opacity: 0.95; }
                  50% { opacity: 1; }
                }
                .wq-shift-bar { animation: wq-shift-pulse 2s ease-in-out infinite; }
                .wq-shift-bar:nth-child(odd) { animation-delay: 0.2s; }
                @media (max-width: 600px) {
                  .transformation-panels {
                    grid-template-columns: 1fr !important;
                    grid-template-rows: auto !important;
                  }
                  .transformation-arrow { display: none !important; }
                  .transformation-panel { min-height: 72px !important; padding: 10px 12px !important; }
                  .transformation-image-wrap { max-height: 120px !important; min-height: 90px !important; }
                  .onboarding-why-section { gap: 12px !important; padding-bottom: 12px !important; }
                }
                @media (max-height: 700px) and (max-width: 600px) {
                  .onboarding-root { padding-top: 16px !important; padding-bottom: 24px !important; gap: 12px !important; }
                  .transformation-panel { min-height: 64px !important; }
                }
              `}} />

              <div
                className="timing-section"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.md,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sun size={16} color="#f59e0b" style={{ flexShrink: 0, opacity: 0.95 }} />
                  <span style={{ fontSize: 13, color: colors.text.secondary, fontWeight: 500 }}>{t('why.timingAfterWaking')}</span>
                </div>
                <span style={{ fontSize: 10, color: colors.text.tertiary, opacity: 0.6 }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Moon size={16} color={colors.accent.tertiary} style={{ flexShrink: 0, opacity: 0.95 }} />
                  <span style={{ fontSize: 13, color: colors.text.secondary, fontWeight: 500 }}>{t('why.timingBeforeSleep')}</span>
                </div>
              </div>

              <div style={{ width: '100%', maxWidth: 400, marginTop: spacing.lg }}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleWhyReady}
                  data-testid="onboarding-continue-button"
                  style={{
                    width: '100%',
                    minHeight: 56,
                    fontSize: 17,
                    fontWeight: 700,
                  }}
                >
                  {t('why.cta')}
                </Button>
              </div>
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
