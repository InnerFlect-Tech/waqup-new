'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, WaitlistCTA, FoundingMemberModal, PublicFooter } from '@/components';
import { AppMockup, LandingSection, LandingCard } from '@/components/marketing';
import { spacing, borderRadius, BLUR } from '@/theme';
import { CONTENT_MAX_WIDTH, NAV_TOP_OFFSET } from '@/theme';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import {
  Sparkles,
  Mic,
  Zap,
  ArrowRight,
  Check,
  MessageCircle,
  Headphones,
  Clock,
  Sun,
  Moon,
  Flame,
  Brain,
  User,
  Shield,
  Gift,
  Share2,
} from 'lucide-react';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';

function formatWaitlistCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k+`;
  return count.toLocaleString();
}

export default function LandingPage() {
  const t = useTranslations('marketing');
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

  const benefits = [
    { text: t('landing.benefitsSection.benefit1'), icon: Brain },
    { text: t('landing.benefitsSection.benefit2'), icon: User },
    { text: t('landing.benefitsSection.benefit3'), icon: Clock },
    { text: t('landing.benefitsSection.benefit4'), icon: Shield },
    { text: t('landing.benefitsSection.benefit5'), icon: Gift },
    { text: t('landing.benefitsSection.benefit6'), icon: Share2 },
  ];

  return (
    <PageShell intensity="high" bare scrollSnap allowDocumentScroll>

      {/* Hero — keep existing structure */}
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
        {/* Background image — full viewport width (escapa do maxWidth da section) */}
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
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,2,20,0.85) 0%, rgba(6,2,20,0.6) 50%, rgba(6,2,20,0.9) 100%)' }} />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(400px, 80vw)',
            height: 'min(400px, 80vw)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.accent.primary}15 0%, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '42%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'min(200px, 40vw)',
            height: 'min(200px, 40vw)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.accent.tertiary}08 0%, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Main content — vertically centered */}
        <div
          className="landing-hero-content"
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              background: `${colors.accent.tertiary}20`,
              border: `1px solid ${colors.accent.tertiary}40`,
              display: 'inline-block',
              marginBottom: spacing.md,
            }}
          >
            <Typography variant="smallBold" style={{ color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('landing.badge')}
            </Typography>
          </div>

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              fontSize: 'clamp(32px, 8vw, 100px)',
              fontWeight: 300,
              lineHeight: 1,
              marginBottom: spacing.md,
              color: colors.text.primary,
              letterSpacing: '-2px',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
            }}
          >
            <span style={{ fontWeight: 300, color: colors.text.primary }}>wa</span>
            <span style={{ color: colors.accent.tertiary, fontWeight: 300 }}>Q</span>
            <span style={{ fontWeight: 300, color: colors.text.primary }}>up</span>
          </div>

          <Typography
            variant="body"
            style={{
              position: 'relative',
              zIndex: 2,
              fontSize: 'clamp(20px, 2.8vw, 28px)',
              color: colors.text.primary,
              maxWidth: 480,
              margin: `0 auto ${spacing.sm} auto`,
              lineHeight: 1.25,
              fontWeight: 300,
              letterSpacing: '-0.01em',
            }}
          >
            {t('landing.headline')}
          </Typography>

          <Typography
            variant="body"
            style={{
              position: 'relative',
              zIndex: 2,
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              color: colors.text.secondary,
              maxWidth: 440,
              margin: `0 auto ${spacing.xl} auto`,
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            {t('landing.subheadline')}
          </Typography>

          <div style={{ width: '100%', maxWidth: 440, marginBottom: spacing.md }}>
            <WaitlistCTA
              variant="inline"
              subtext={t('landing.earlyAccess')}
            />
          </div>

          <div
            style={{
              marginBottom: spacing.lg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.md,
              flexWrap: 'wrap',
              fontSize: 13,
              color: colors.text.tertiary ?? colors.text.secondary,
              fontWeight: 400,
            }}
          >
            {waitlistCount !== null && waitlistCount > 0 && (
              <span>{t('landing.waitlistCount', { count: formatWaitlistCount(waitlistCount) })}</span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Headphones size={12} color={colors.accent.tertiary} />
              <span style={{ color: colors.accent.tertiary }}>{t('landing.practiceInYourVoice')}</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.lg,
              fontSize: 13,
              color: colors.text.tertiary ?? colors.text.secondary,
            }}
          >
            <button
              type="button"
              onClick={() => setShowFoundingModal(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 'inherit' }}
            >
              {t('landing.foundingMembersLink')}
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: spacing.md,
            }}
          >
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Button
                variant="outline"
                size="md"
                style={{
                  borderColor: colors.accent.primary,
                  color: colors.accent.tertiary,
                  padding: `${spacing.sm} ${spacing.lg}`,
                  boxShadow: `0 0 0 1px ${colors.accent.primary}40`,
                }}
              >
                {t('landing.signInButton')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer links — anchored at bottom, safe-area aware on mobile */}
        <div
          className="landing-hero-footer-links"
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
            gap: spacing.sm,
            paddingTop: 0,
            paddingLeft: spacing.md,
            paddingRight: spacing.md,
            paddingBottom: `max(${spacing.xl}, env(safe-area-inset-bottom, 0px))`,
            fontSize: 13,
            color: colors.text.tertiary ?? colors.text.secondary,
            opacity: 0.85,
          }}
        >
          <Link href="/for-teachers" style={{ color: 'inherit', textDecoration: 'none', padding: `${spacing.xs} ${spacing.sm}` }}>{t('landing.forTeachers')}</Link>
          <span style={{ opacity: 0.35 }}>·</span>
          <Link href="/for-coaches" style={{ color: 'inherit', textDecoration: 'none', padding: `${spacing.xs} ${spacing.sm}` }}>{t('landing.forCoaches')}</Link>
          <span style={{ opacity: 0.35 }}>·</span>
          <Link href="/for-studios" style={{ color: 'inherit', textDecoration: 'none', padding: `${spacing.xs} ${spacing.sm}` }}>{t('landing.forStudios')}</Link>
          <span style={{ opacity: 0.35 }}>·</span>
          <Link href="/for-creators" style={{ color: 'inherit', textDecoration: 'none', padding: `${spacing.xs} ${spacing.sm}` }}>{t('landing.forCreators')}</Link>
        </div>

        <FoundingMemberModal
          isOpen={showFoundingModal}
          onClose={() => setShowFoundingModal(false)}
        />
      </section>

      {/* Section 1 — Core Value (hero + 2 cards, then Minutes full-width) */}
      <LandingSection
        title={t('landing.coreValue.title')}
        subtitle={t('landing.coreValue.subtitle')}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
          }}
          className="core-value-grid"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.9fr)',
              gap: spacing.md,
              alignItems: 'stretch',
            }}
          >
            <div style={{ minWidth: 0, height: '100%', display: 'flex' }} className="core-value-hero-wrap">
              <LandingCard
                icon={Mic}
                title={t('landing.coreValue.yourVoice.title')}
                description={t('landing.coreValue.yourVoice.desc')}
                imageSrc="/images/landing-your-voice.png"
                iconSize="hero"
                layout="horizontal"
                highlight
                priority
                fillHeight
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.md,
                    marginTop: spacing.sm,
                    flex: 1,
                    minHeight: 0,
                  }}
                >
                  <ul
                    style={{
                      listStyle: 'none',
                      margin: 0,
                      padding: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: spacing.sm,
                    }}
                  >
                    <li
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: spacing.sm,
                        fontSize: 'clamp(14px, 1.3vw, 15px)',
                        lineHeight: 1.4,
                        color: colors.text.secondary,
                      }}
                    >
                      <span style={{ flexShrink: 0, marginTop: 2 }}>
                        <Check size={16} color={colors.accent.primary} strokeWidth={2.5} />
                      </span>
                      <span>{t('landing.coreValue.yourVoice.benefit1')}</span>
                    </li>
                    <li
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: spacing.sm,
                        fontSize: 'clamp(14px, 1.3vw, 15px)',
                        lineHeight: 1.4,
                        color: colors.text.secondary,
                      }}
                    >
                      <span style={{ flexShrink: 0, marginTop: 2 }}>
                        <Check size={16} color={colors.accent.primary} strokeWidth={2.5} />
                      </span>
                      <span>{t('landing.coreValue.yourVoice.benefit2')}</span>
                    </li>
                  </ul>
                  <Link
                    href="/create"
                    style={{
                      alignSelf: 'stretch',
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: spacing.sm,
                      padding: '12px 18px',
                      borderRadius: 14,
                      background: colors.gradients.primary,
                      color: colors.text.onDark ?? '#fff',
                      fontWeight: 600,
                      fontSize: 'clamp(14px, 1.2vw, 15px)',
                      boxShadow: `0 4px 20px ${colors.accent.primary}50`,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      marginTop: 'auto',
                      lineHeight: 1.3,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = `0 6px 24px ${colors.accent.primary}55`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `0 4px 20px ${colors.accent.primary}50`;
                    }}
                  >
                    {t('landing.coreValue.yourVoice.cta')}
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </Link>
                </div>
              </LandingCard>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.sm,
                minWidth: 0,
                minHeight: 0,
                height: '100%',
              }}
            >
              <div style={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <LandingCard
                  icon={Sparkles}
                  title={t('landing.coreValue.aiHelps.title')}
                  description={t('landing.coreValue.aiHelps.desc')}
                  compact
                  fillHeight
                />
              </div>
              <div style={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <LandingCard
                  icon={Headphones}
                  title={t('landing.coreValue.replay.title')}
                  description={t('landing.coreValue.replay.desc')}
                  compact
                  fillHeight
                />
              </div>
            </div>
          </div>
          {/* Minutes — full width banner card */}
          <LandingCard
            icon={Clock}
            title={t('landing.coreValue.minutes.title')}
            description={t('landing.coreValue.minutes.desc')}
            badge={t('landing.coreValue.minutes.badge')}
            featured
            layout="banner"
            minHeight={120}
            className="landing-card-minutes"
          />
        </div>
      </LandingSection>

      {/* Section 2 — How It Works (3 steps) + Phone showcase */}
      <LandingSection
        title={t('landing.howItWorks.title')}
        subtitle={t('landing.howItWorks.subtitle')}
      >
        <div
          className="how-it-works-steps"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr auto 1fr',
            gridTemplateRows: 'auto auto auto',
            alignItems: 'start',
            justifyItems: 'center',
            columnGap: spacing.md,
            rowGap: spacing.sm,
            marginBottom: spacing.xxl,
            maxWidth: 720,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {[
            { icon: MessageCircle, titleKey: 'landing.howItWorks.step1.title' as const, descKey: 'landing.howItWorks.step1.desc' as const },
            { icon: Sparkles, titleKey: 'landing.howItWorks.step2.title' as const, descKey: 'landing.howItWorks.step2.desc' as const },
            { icon: Headphones, titleKey: 'landing.howItWorks.step3.title' as const, descKey: 'landing.howItWorks.step3.desc' as const },
          ].map(({ icon: Icon, titleKey, descKey }, i) => (
            <React.Fragment key={titleKey}>
              <div
                style={{
                  gridColumn: i * 2 + 1,
                  gridRow: 1,
                  width: 56,
                  height: 56,
                  borderRadius: borderRadius.full,
                  background: colors.gradients.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 20px ${colors.accent.primary}50`,
                }}
              >
                <Icon size={24} color={colors.text.onDark} strokeWidth={2.5} />
              </div>
              {i < 2 && (
                <div
                  style={{
                    gridColumn: i * 2 + 2,
                    gridRow: '1 / -1',
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: 28,
                  }}
                >
                  <ArrowRight size={20} color={colors.text.tertiary} style={{ opacity: 0.6 }} />
                </div>
              )}
              <Typography
                variant="h4"
                style={{
                  gridColumn: i * 2 + 1,
                  gridRow: 2,
                  color: colors.text.primary,
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  textAlign: 'center',
                  minHeight: '2.6em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  maxWidth: 200,
                }}
              >
                {t(titleKey)}
              </Typography>
              <Typography
                variant="caption"
                style={{
                  gridColumn: i * 2 + 1,
                  gridRow: 3,
                  color: colors.text.secondary,
                  lineHeight: 1.5,
                  fontSize: 14,
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: 200,
                }}
              >
                {t(descKey)}
              </Typography>
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <AppMockup />
          <Link
            href="/how-it-works"
            style={{
              marginTop: spacing.md,
              fontSize: 13,
              color: colors.accent.tertiary,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {t('landing.fullProcess')} <ArrowRight size={12} />
          </Link>
        </div>
      </LandingSection>

      {/* Section 3 — Product Differentiation */}
      <LandingSection
        title={t('landing.differentiation.title')}
        subtitle={t('landing.differentiation.subtitle')}
      >
        <div
          className="differentiation-section"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.lg,
            maxWidth: 560,
            margin: '0 auto',
          }}
        >
          <div
            className="differentiation-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.md,
              padding: spacing.xl,
              borderRadius: borderRadius.lg,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <Typography variant="body" style={{ color: colors.text.tertiary, fontSize: 15 }}>
              {t('landing.differentiation.genericVs')}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <ArrowRight size={18} color={colors.accent.tertiary} strokeWidth={2} />
              <Typography variant="body" style={{ color: colors.accent.tertiary, fontWeight: 600, fontSize: 16 }}>
                {t('landing.differentiation.yourVoiceVs')}
              </Typography>
            </div>
          </div>
          <div
            className="differentiation-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.md,
              padding: spacing.xl,
              borderRadius: borderRadius.lg,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
              borderLeft: `3px solid ${colors.accent.primary}`,
            }}
          >
            <Typography variant="body" style={{ color: colors.text.tertiary, fontSize: 15 }}>
              {t('landing.differentiation.genericAffirm')}
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              <ArrowRight size={18} color={colors.accent.tertiary} strokeWidth={2} />
              <Typography variant="body" style={{ color: colors.accent.tertiary, fontWeight: 600, fontSize: 16 }}>
                {t('landing.differentiation.personalisedVs')}
              </Typography>
            </div>
          </div>
        </div>
      </LandingSection>

      {/* Section 4 — Key Product Pillars */}
      <LandingSection
        title={t('landing.pillars.title')}
        subtitle={t('landing.pillars.subtitle')}
      >
        <div
          className="pillars-section"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing.xl,
            width: '100%',
          }}
        >
          <LandingCard
            icon={Sun}
            title={t('landing.pillars.affirmations.title')}
            description={t('landing.pillars.affirmations.desc')}
            accentColor={CONTENT_TYPE_COLORS.affirmation}
            iconVariant="solid"
          />
          <LandingCard
            icon={Moon}
            title={t('landing.pillars.meditations.title')}
            description={t('landing.pillars.meditations.desc')}
            accentColor={CONTENT_TYPE_COLORS.meditation}
            iconVariant="solid"
          />
          <LandingCard
            icon={Flame}
            title={t('landing.pillars.rituals.title')}
            description={t('landing.pillars.rituals.desc')}
            accentColor={CONTENT_TYPE_COLORS.ritual}
            iconVariant="solid"
          />
        </div>
      </LandingSection>

      {/* Section 5 — Psychological Reinforcement (benefits) */}
      <LandingSection
        title={t('landing.benefitsSection.title')}
      >
        <div
          className="landing-benefits-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: spacing.lg,
            width: '100%',
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="landing-benefit-card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.md,
                  padding: spacing.lg,
                  minHeight: 88,
                  borderRadius: borderRadius.lg,
                  background: `linear-gradient(145deg, ${colors.glass.light} 0%, ${colors.glass.dark} 100%)`,
                  backdropFilter: BLUR.xl,
                  WebkitBackdropFilter: BLUR.xl,
                  border: `1px solid ${colors.glass.border}`,
                  boxShadow: `0 4px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.06)`,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: borderRadius.md,
                    background: `linear-gradient(135deg, ${colors.accent.primary}30, ${colors.accent.tertiary}20)`,
                    border: `1px solid ${colors.accent.primary}35`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} color={colors.accent.primary} strokeWidth={2} />
                </div>
                <Typography
                  variant="body"
                  style={{
                    color: colors.text.primary,
                    fontSize: 15,
                    fontWeight: 500,
                    lineHeight: 1.45,
                    flex: 1,
                    paddingTop: 2,
                  }}
                >
                  {benefit.text}
                </Typography>
              </div>
            );
          })}
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            .landing-benefits-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 480px) {
            .landing-benefits-grid {
              grid-template-columns: 1fr !important;
            }
          }
          .landing-benefit-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.08);
          }
        `}} />
      </LandingSection>

      {/* Final CTA */}
      <section
        className="landing-section"
        style={{
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          padding: `clamp(${spacing.xxl}, 12vh, 160px) clamp(16px, 4vw, 48px)`,
          textAlign: 'center',
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
          width: '100%',
          minWidth: 0,
        }}
      >
        <h2
          style={{
            margin: 0,
            marginBottom: spacing.md,
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 300,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            background: colors.gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('landing.ctaHeadline')}
        </h2>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md, fontSize: '18px', lineHeight: 1.5 }}>
          {t('landing.ctaSubline1')}
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, fontSize: '15px', opacity: 0.7 }}>
          {t('landing.ctaSubline2Default')}
        </Typography>
        <Link href="/waitlist" style={{ textDecoration: 'none' }}>
          <Button
            variant="primary"
            size="lg"
            style={{
              padding: `${spacing.lg} ${spacing.xxl}`,
              fontSize: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            {t('landing.ctaButton')}
            <ArrowRight size={22} color={colors.text.onDark} />
          </Button>
        </Link>
        <div
          style={{
            marginTop: spacing.lg,
            fontSize: 13,
            color: colors.text.secondary,
            opacity: 0.6,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.sm,
          }}
        >
          <span>{t('landing.creatorProgrammePrefix')}</span>
          <Link href="/for-creators" style={{ color: colors.accent.tertiary, textDecoration: 'none' }}>
            {t('landing.creatorProgrammeLink')}
          </Link>
        </div>
      </section>

      <section style={{ scrollSnapAlign: 'none', minHeight: 'auto' }}>
        <PublicFooter />
      </section>
    </PageShell>
  );
}
