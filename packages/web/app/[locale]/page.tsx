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
  Mic,
  Zap,
  Heart,
  ArrowRight,
  Check,
  MessageCircle,
  Headphones,
  Repeat,
} from 'lucide-react';

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
      icon: Mic,
      title: 'Your voice. Not someone else\'s.',
      description: 'Record 60 seconds. waQup clones your voice — so every practice sounds like you, speaking to yourself from a place of strength.',
      color: colors.accent.tertiary,
      highlight: true,
    },
    {
      icon: Sparkles,
      title: 'You create it — AI just helps',
      description: 'Tell the orb what you\'re working on. It turns your intention into a personalised script you review, adjust, and own completely.',
      color: colors.accent.primary,
    },
    {
      icon: Zap,
      title: 'Practice is always free',
      description: 'Once you\'ve created it, replay your content as many times as you like. Credits are only used during creation — never during practice.',
      color: colors.accent.secondary,
    },
    {
      icon: Heart,
      title: 'Three distinct practices',
      description: 'Affirmations to shift your self-concept. Meditations to access deeper states. Rituals to encode new identity. Each does something different.',
      color: colors.accent.secondary,
    },
    {
      icon: Repeat,
      title: 'Built for your daily rhythm',
      description: 'Pin your most important practice. See your streak. Designed to become part of your morning in under 5 minutes.',
      color: colors.accent.primary,
    },
  ];

  const benefits = [
    'Hear yourself say what you most need to hear',
    'Create personalised practices — not generic content',
    'Practice free, forever — no hidden limits',
    'Works in 3 minutes. Stays with you for life.',
    'Your voice data is encrypted and always yours',
    'Share your practices and earn credits back',
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

          {/* Personal practice studio badge */}
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
              Personal practice studio
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

          {/* Hero headline — transformation promise */}
          <Typography
            variant="body"
            style={{
              position: 'relative',
              zIndex: 1,
              fontSize: 'clamp(20px, 2.8vw, 28px)',
              color: colors.text.primary,
              maxWidth: 480,
              margin: `0 auto ${spacing.sm} auto`,
              lineHeight: 1.25,
              fontWeight: 300,
              letterSpacing: '-0.01em',
            }}
          >
            Your practice, in your voice.
          </Typography>

          {/* Sub-headline — method clarification */}
          <Typography
            variant="body"
            style={{
              position: 'relative',
              zIndex: 1,
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              color: colors.text.secondary,
              maxWidth: 440,
              margin: `0 auto ${spacing.xl} auto`,
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            Create personalised affirmations, meditations, and rituals through conversation — then practice them free, forever.
          </Typography>

          {/* Waitlist CTA — minimal, no extra copy */}
          <div style={{ width: '100%', maxWidth: 440, marginBottom: spacing.md }}>
            <WaitlistCTA
              variant="inline"
              subtext="Early access · No card required · Practice free always"
              compact
            />
          </div>

          {/* One-line social proof + trust signal */}
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
              <span>{formatWaitlistCount(waitlistCount)} on the waitlist</span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Headphones size={12} color={colors.accent.tertiary} />
              <span style={{ color: colors.accent.tertiary }}>Practice in your own voice</span>
            </div>
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

          {/* Visual flow: correct order — Tell, Create, Practice */}
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
              { icon: MessageCircle, label: 'Tell the orb' },
              { icon: Sparkles, label: 'Create yours' },
              { icon: Headphones, label: 'Practice free' },
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
              The only practice that&apos;s actually about your life
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, maxWidth: CONTENT_MEDIUM, margin: '0 auto' }}>
              You created it. It&apos;s in your voice. It reflects your exact intention. That&apos;s why it works.
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
            Hear yourself say what you most need to hear.
          </h2>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md, fontSize: '18px', lineHeight: 1.5 }}>
            Your first practice is free. No credit card. No commitment.
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, fontSize: '15px', opacity: 0.7 }}>
            {waitlistCount !== null && waitlistCount > 0
              ? `Join ${formatWaitlistCount(waitlistCount)} others who are already creating.`
              : 'Join the founding community.'}
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
              Create your first practice free
              <ArrowRight size={22} color={colors.text.onDark} />
            </Button>
          </Link>
          <div style={{ marginTop: spacing.lg, fontSize: 13, color: colors.text.secondary, opacity: 0.6 }}>
            For teachers &amp; coaches: <Link href="/for-teachers" style={{ color: colors.accent.tertiary, textDecoration: 'none' }}>see the creator programme →</Link>
          </div>
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
