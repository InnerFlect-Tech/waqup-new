'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { PageShell, WaitlistCTA, FoundingMemberModal, PublicFooter } from '@/components';
import { AppMockup } from '@/components/marketing';
import { spacing, borderRadius, BLUR } from '@/theme';
import { CONTENT_MAX_WIDTH, CONTENT_NARROW, CONTENT_MEDIUM, PAGE_TOP_PADDING } from '@/theme';
import { Link } from '@/i18n/navigation';
import {
  Sparkles,
  Brain,
  Music,
  Zap,
  Shield,
  Heart,
  ArrowRight,
  Check,
  MessageCircle,
  Headphones,
} from 'lucide-react';
import { PRACTICE_IS_FREE_ONE_LINER, VOICE_CLONING_COPY } from '@waqup/shared/constants';

function formatWaitlistCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k+`;
  return count.toLocaleString();
}

export default function LandingPage() {
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

  const features = [
    {
      icon: Music,
      title: 'Your voice, not a generic AI',
      description: VOICE_CLONING_COPY,
      color: colors.accent.tertiary,
      highlight: true,
    },
    {
      icon: Brain,
      title: 'Neuroplasticity-Based',
      description: 'Scientifically designed to rewire your subconscious mind through voice-first experiences',
      color: colors.accent.primary,
    },
    {
      icon: Zap,
      title: 'Practice is Free — Always',
      description: PRACTICE_IS_FREE_ONE_LINER,
      color: colors.accent.secondary,
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Creation',
      description: 'Conversational AI guides you through creating transformative content tailored to your goals',
      color: colors.accent.primary,
    },
    {
      icon: Heart,
      title: 'Three Content Types',
      description: 'Affirmations for cognitive re-patterning, Meditations for state induction, Rituals for identity encoding',
      color: colors.accent.secondary,
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your voice data is encrypted and stored securely. You own your transformation journey',
      color: colors.accent.tertiary,
    },
  ];

  const benefits = [
    'Transform your subconscious mind',
    'Create personalized voice content',
    'Practice unlimited times for free',
    'Science-backed transformation methods',
    'Privacy-first architecture',
    'AI-guided creation process',
  ];

  return (
    <PageShell intensity="high" bare scrollSnap allowDocumentScroll>

      {/* Step 1: Hero */}
        <section
          style={{
            position: 'relative',
            minHeight: '100dvh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            padding: `0 ${spacing.xl}`,
            marginTop: `calc(-1 * ${PAGE_TOP_PADDING} - ${spacing.lg})`,
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
            maxWidth: CONTENT_MAX_WIDTH,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
        >
          {/* Decorative orb — visual accent */}
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
              zIndex: 0,
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
              zIndex: 0,
            }}
          />

          {/* AI POWERED Badge */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              background: `${colors.accent.tertiary}20`,
              border: `1px solid ${colors.accent.tertiary}40`,
              display: 'inline-block',
              marginBottom: spacing.md,
            }}
          >
            <Typography variant="smallBold" style={{ color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              AI POWERED
            </Typography>
          </div>

          {/* Large Logo — Text Only */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              fontSize: 'clamp(52px, 10vw, 100px)',
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

          {/* Slogan */}
          <Typography
            variant="body"
            style={{
              position: 'relative',
              zIndex: 1,
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: colors.text.secondary,
              maxWidth: 420,
              margin: `0 auto ${spacing.md} auto`,
              lineHeight: 1.3,
              fontWeight: 300,
              letterSpacing: '0.01em',
            }}
          >
            Your voice. Your practice. Your transformation.
          </Typography>

          {/* Voice identity proof point */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              padding: `${spacing.sm} ${spacing.lg}`,
              borderRadius: borderRadius.full,
              background: `${colors.accent.tertiary}12`,
              border: `1px solid ${colors.accent.tertiary}30`,
              marginBottom: spacing.xl,
            }}
          >
            <Headphones size={14} color={colors.accent.tertiary} />
            <span style={{ fontSize: 13, color: colors.accent.tertiary, fontWeight: 500 }}>
              Practice in your own voice — not someone else&apos;s
            </span>
          </div>

          {/* Waitlist CTA — minimal, no extra copy */}
          <div style={{ width: '100%', maxWidth: 440, marginBottom: spacing.md }}>
            <WaitlistCTA
              variant="inline"
              subtext="Early access · No card · Practice free"
              compact
            />
          </div>

          {/* One-line social proof */}
          <div
            style={{
              marginBottom: spacing.lg,
              fontSize: 13,
              color: colors.text.tertiary ?? colors.text.secondary,
              fontWeight: 400,
            }}
          >
            {waitlistCount !== null && waitlistCount > 0
              ? `${formatWaitlistCount(waitlistCount)} on the waitlist`
              : 'Be first.'}
          </div>

          {/* Secondary links — subtle, de-emphasized */}
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
            <Link href="/waitlist" style={{ color: 'inherit', textDecoration: 'none' }}>
              Full form →
            </Link>
            <button
              type="button"
              onClick={() => setShowFoundingModal(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, fontSize: 'inherit' }}
            >
              Founding Members →
            </button>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="sm" style={{ color: colors.text.primary, fontSize: 13 }}>
                Member Login
              </Button>
            </Link>
          </div>

          {/* Promoter / creator links */}
          <div
            style={{
              marginTop: spacing.xl,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.md,
              fontSize: 12,
              color: colors.text.tertiary ?? colors.text.secondary,
              opacity: 0.7,
            }}
          >
            <Link href="/for-teachers" style={{ color: 'inherit', textDecoration: 'none' }}>For teachers</Link>
            <span style={{ opacity: 0.4 }}>·</span>
            <Link href="/for-coaches" style={{ color: 'inherit', textDecoration: 'none' }}>For coaches</Link>
            <span style={{ opacity: 0.4 }}>·</span>
            <Link href="/for-studios" style={{ color: 'inherit', textDecoration: 'none' }}>For studios</Link>
            <span style={{ opacity: 0.4 }}>·</span>
            <Link href="/for-creators" style={{ color: 'inherit', textDecoration: 'none' }}>For creators</Link>
          </div>

          <FoundingMemberModal
            isOpen={showFoundingModal}
            onClose={() => setShowFoundingModal(false)}
          />
        </section>

        {/* Step 2: See how it works */}
        <section
          style={{
            minHeight: '100dvh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            padding: `clamp(${spacing.xxxl}, 10vh, 120px) ${spacing.xl}`,
            maxWidth: CONTENT_MAX_WIDTH,
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
            <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
              See how it works
            </Typography>
          </div>

          {/* Visual flow: 1 — 2 — 3 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.md,
              marginBottom: spacing.xxl,
            }}
          >
            {[
              { icon: MessageCircle, label: 'Share' },
              { icon: Sparkles, label: 'Create' },
              { icon: Headphones, label: 'Listen' },
            ].map(({ icon: Icon, label }, i) => (
              <React.Fragment key={label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.xs }}>
                  <div
                    style={{
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
                  <Typography variant="small" style={{ color: colors.text.secondary }}>{label}</Typography>
                </div>
                {i < 2 && (
                  <ArrowRight size={20} color={colors.text.tertiary} style={{ flexShrink: 0, opacity: 0.6 }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mockup — hero visual */}
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
              Full process <ArrowRight size={12} />
            </Link>
          </div>
        </section>

        {/* Step 3: Features */}
        <section
          style={{
            minHeight: '100dvh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            padding: `${spacing.xxl} ${spacing.xl}`,
            maxWidth: CONTENT_MAX_WIDTH,
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
            <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
              Built for voice-first transformation
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, maxWidth: CONTENT_MEDIUM, margin: '0 auto' }}>
              Everything you need to transform your subconscious mind through voice-first experiences
            </Typography>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gridAutoRows: 'minmax(200px, 1fr)',
              gap: spacing.xl,
            }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isHighlight = 'highlight' in feature && feature.highlight;
              return (
                <div
                  key={index}
                  style={{
                    padding: spacing.xl,
                    borderRadius: borderRadius.lg,
                    background: isHighlight
                      ? `linear-gradient(135deg, ${colors.accent.tertiary}15, ${colors.accent.primary}08)`
                      : colors.glass.light,
                    backdropFilter: BLUR.xl,
                    WebkitBackdropFilter: BLUR.xl,
                    border: isHighlight
                      ? `1px solid ${colors.accent.tertiary}40`
                      : `1px solid ${colors.glass.border}`,
                    boxShadow: isHighlight
                      ? `0 8px 40px ${colors.accent.tertiary}30`
                      : `0 8px 32px ${colors.accent.primary}40`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = `0 16px 48px ${colors.accent.primary}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 8px 32px ${colors.accent.primary}40`;
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: borderRadius.full,
                      background: colors.gradients.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: spacing.lg,
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: `0 4px 12px ${colors.accent.primary}60`,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(circle at center, ${colors.accent.primary}40, transparent)`,
                        opacity: 0.6,
                      }}
                    />
                    <span style={{ position: 'relative', zIndex: 1 }}>
                    <IconComponent size={28} color={colors.text.onDark} strokeWidth={2.5} />
                  </span>
                  </div>
                  <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm, flexShrink: 0 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6, flex: 1, minHeight: 0 }}>
                    {feature.description}
                  </Typography>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 4: Benefits */}
        <section
          style={{
            minHeight: '100dvh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            padding: `${spacing.xxl} ${spacing.xl}`,
            maxWidth: CONTENT_MAX_WIDTH,
            margin: '0 auto',
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
              boxShadow: `0 16px 64px ${colors.accent.primary}40`,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gridAutoRows: 'minmax(56px, 1fr)', gap: spacing.lg, alignItems: 'stretch' }}>
              {benefits.map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: spacing.md, height: '100%' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: borderRadius.full,
                      background: colors.gradients.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={18} color={colors.text.onDark} strokeWidth={3} />
                  </div>
                  <Typography variant="body" style={{ color: colors.text.primary }}>
                    {benefit}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step 5: CTA */}
        <section
          style={{
            minHeight: '100dvh',
            scrollSnapAlign: 'start',
            scrollSnapStop: 'always',
            padding: `clamp(${spacing.xxxl}, 12vh, 160px) ${spacing.xxl}`,
            textAlign: 'center',
            maxWidth: CONTENT_MAX_WIDTH,
            margin: '0 auto',
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
            Stop listening. Start creating.
          </h2>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontSize: '18px', maxWidth: 520, margin: `0 auto ${spacing.sm}` }}>
            Calm and Headspace sell someone else&apos;s voice.
            waQup gives you yours.
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, fontSize: '15px', opacity: 0.6 }}>
            {waitlistCount !== null && waitlistCount > 0
              ? `${formatWaitlistCount(waitlistCount)} already on the waitlist. Practice is free.`
              : 'Join the waitlist. Practice is always free.'}
          </Typography>
          <Link href="/waitlist" style={{ textDecoration: 'none' }}>
            <Button
              variant="primary"
              size="lg"
              style={{
                padding: `${spacing.lg} ${spacing.xxl}`,
                fontSize: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.md,
              }}
            >
              Join the Waitlist
              <ArrowRight size={24} color={colors.text.onDark} />
            </Button>
          </Link>
        </section>

        {/* Step 6: Footer — natural continuation, no snap (flows after CTA) */}
        <section
          style={{
            scrollSnapAlign: 'none',
            minHeight: 'auto',
          }}
        >
          <PublicFooter />
        </section>

      {/* Pulse Animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      ` }} />
    </PageShell>
  );
}
