'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH, CONTENT_NARROW, CONTENT_MEDIUM } from '@/theme';
import Link from 'next/link';
import {
  Sunrise,
  Bell,
  Brain,
  Zap,
  Heart,
  Music,
  Clock,
  Download,
  Star,
  Users,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const steps = [
  {
    icon: Sunrise,
    title: 'Morning Ritual',
    description: 'Start your day with intention',
    detail: 'Begin each morning with a personalized combination of meditation and powerful affirmations, designed to align with your energy and goals.',
    highlight: 'AI-powered personalization adapts to your preferences',
  },
  {
    icon: Bell,
    title: 'Daily Reminders',
    description: 'Stay consistent with gentle nudges',
    detail: 'Receive thoughtful notifications at your preferred times, helping you maintain your practice and build lasting habits.',
    highlight: 'Smart scheduling based on your most successful sessions',
  },
  {
    icon: Brain,
    title: 'Sacred Guide',
    description: 'Your personal spiritual companion',
    detail: 'Let our intelligent system guide your growth with personalized recommendations for meditations, affirmations, and practices.',
    highlight: 'Learns and evolves with your spiritual journey',
  },
  {
    icon: Zap,
    title: 'Track Your Growth',
    description: 'Visualize your transformation',
    detail: 'Monitor your progress with beautiful insights, celebrate streaks, and unlock achievements as you deepen your practice.',
    highlight: 'Watch your consistency build lasting change',
  },
];

const benefits = [
  {
    icon: Heart,
    title: 'Personalized Experience',
    description: 'Every aspect of waQup adapts to your unique spiritual journey and preferences.',
  },
  {
    icon: Music,
    title: 'Guided Meditations',
    description: 'Access a growing library of meditations ranging from 5 to 30 minutes.',
  },
  {
    icon: Sparkles,
    title: 'Daily Affirmations',
    description: 'Powerful, personalized affirmations that evolve with your progress.',
  },
  {
    icon: Clock,
    title: 'Flexible Timing',
    description: 'Practice whenever works best for you, with sessions for any schedule.',
  },
  {
    icon: Download,
    title: 'Offline Access',
    description: 'Download your favorite content for practice anywhere, anytime.',
  },
  {
    icon: Star,
    title: 'Expert Content',
    description: 'Access exclusive content from spiritual leaders and wellness experts.',
  },
];

export default function HowItWorksPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [showStepArrow, setShowStepArrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = () => setShowStepArrow(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const journeySteps = [
    { icon: 'join', label: 'Sign Up', sub: 'Free join' },
    { icon: 'chat', label: 'Create', sub: 'AI-guided' },
    { icon: 'voice', label: 'Listen', sub: 'Your voice' },
    { icon: 'grow', label: 'Grow', sub: 'Track progress' },
  ];

  return (
    <PageShell intensity="high" bare>
      {/* Hero Section */}
        <section
          style={{
            padding: `${spacing.xxl} ${spacing.xl}`,
            textAlign: 'center',
            maxWidth: CONTENT_MAX_WIDTH,
            margin: '0 auto',
          }}
        >
          <div
            style={{
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              background: `${colors.accent.tertiary}20`,
              border: `1px solid ${colors.accent.tertiary}40`,
              display: 'inline-block',
              marginBottom: spacing.lg,
            }}
          >
            <Typography variant="smallBold" style={{ color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Your Journey
            </Typography>
          </div>
          <Typography
            variant="h1"
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              color: colors.text.primary,
              marginBottom: spacing.md,
              fontWeight: 300,
            }}
          >
            Your Personal Sanctuary
          </Typography>
          <Typography
            variant="body"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: colors.text.secondary,
              maxWidth: CONTENT_NARROW,
              margin: `0 auto ${spacing.xl} auto`,
              lineHeight: 1.6,
            }}
          >
            waQup is your AI-powered companion for meditation and affirmations, helping you build a consistent spiritual practice that grows with you.
          </Typography>

          {/* Visual Journey Flow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              flexWrap: 'wrap',
              marginTop: spacing.xxl,
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${colors.glass.border}`,
              boxShadow: `0 16px 64px ${colors.accent.primary}30`,
            }}
          >
            {journeySteps.map((step, i) => (
              <React.Fragment key={step.label}>
                <div
                  style={{
                    padding: `${spacing.md} ${spacing.lg}`,
                    borderRadius: borderRadius.lg,
                    background: `${colors.accent.primary}15`,
                    border: `1px solid ${colors.accent.primary}35`,
                    textAlign: 'center',
                    minWidth: 100,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${colors.accent.primary}25`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${colors.accent.primary}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${colors.accent.primary}15`;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                    {step.label}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.accent.tertiary }}>
                    {step.sub}
                  </Typography>
                </div>
                {i < journeySteps.length - 1 && (
                  <ArrowRight size={20} color={colors.accent.tertiary} style={{ opacity: 0.7, flexShrink: 0 }} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.md, marginTop: spacing.xl }}>
            <Link href="/pricing" style={{ textDecoration: 'none' }}>
              <Button
                variant="primary"
                size="lg"
                style={{
                  background: colors.gradients.primary,
                  padding: `${spacing.md} ${spacing.xl}`,
                }}
              >
                Join as Founding Member
              </Button>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.accent.primary }}>
              <Users size={20} color={colors.accent.primary} />
              <Typography variant="body" style={{ color: colors.accent.primary, fontSize: '14px', fontWeight: 500 }}>
                Only 500 spots at special pricing
              </Typography>
            </div>
          </div>
        </section>

        {/* How It Works Steps */}
        <section
          style={{
            padding: `${spacing.xxl} ${spacing.xl}`,
            maxWidth: CONTENT_MAX_WIDTH,
            margin: '0 auto',
          }}
        >
          <Typography
            variant="h2"
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              color: colors.text.primary,
              textAlign: 'center',
              marginBottom: spacing.xxl,
            }}
          >
            Your Daily Journey with wa<span style={{ color: colors.accent.tertiary }}>Q</span>up
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.title}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: spacing.lg,
                    padding: spacing.xl,
                    borderRadius: borderRadius.xl,
                    background: colors.glass.light,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${colors.glass.border}`,
                    boxShadow: `0 8px 32px ${colors.accent.primary}40`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, width: '100%' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: borderRadius.full,
                        background: colors.gradients.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 12px ${colors.accent.primary}60`,
                        position: 'relative',
                        overflow: 'hidden',
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
                      <IconComponent size={32} color={colors.text.onDark} strokeWidth={2.5} />
                    </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body" style={{ color: colors.accent.tertiary, fontSize: '18px', marginBottom: spacing.sm }}>
                        {step.description}
                      </Typography>
                      <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                        {step.detail}
                      </Typography>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        <Sparkles size={16} color={colors.accent.tertiary} />
                        <Typography variant="small" style={{ color: colors.accent.tertiary }}>
                          {step.highlight}
                        </Typography>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div style={{ display: showStepArrow ? 'block' : 'none' }}>
                        <ArrowRight size={24} color={colors.accent.tertiary} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits Grid */}
        <section
          style={{
            padding: `${spacing.xxl} ${spacing.xl}`,
            maxWidth: CONTENT_MAX_WIDTH,
            margin: '0 auto',
          }}
        >
          <Typography
            variant="h2"
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              color: colors.text.primary,
              textAlign: 'center',
              marginBottom: spacing.md,
            }}
          >
            Everything You Need for Your Practice
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              textAlign: 'center',
              maxWidth: CONTENT_NARROW,
              margin: `0 auto ${spacing.xxl} auto`,
            }}
          >
            waQup combines ancient wisdom with modern technology to create a meditation and affirmation experience that evolves with you.
          </Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gridAutoRows: 'minmax(200px, 1fr)',
              gap: spacing.lg,
            }}
          >
            {benefits.map((benefit) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  style={{
                    padding: spacing.xl,
                    borderRadius: borderRadius.lg,
                    background: colors.glass.light,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${colors.glass.border}`,
                    boxShadow: `0 8px 32px ${colors.accent.primary}40`,
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: borderRadius.full,
                      background: colors.gradients.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: spacing.md,
                      boxShadow: `0 4px 12px ${colors.accent.primary}60`,
                      position: 'relative',
                      overflow: 'hidden',
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
                    <IconComponent size={24} color={colors.text.onDark} strokeWidth={2.5} />
                  </span>
                  </div>
                  <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm, flexShrink: 0 }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary, flex: 1, minHeight: 0 }}>
                    {benefit.description}
                  </Typography>
                </div>
              );
            })}
          </div>
        </section>

        {/* Founding Member Offer */}
        <section
          style={{
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
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${colors.glass.border}`,
              boxShadow: `0 16px 64px ${colors.accent.primary}40`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: borderRadius.full,
                background: `${colors.accent.primary}20`,
                border: `1px solid ${colors.accent.primary}40`,
                marginBottom: spacing.lg,
              }}
            >
              <Sparkles size={16} color={colors.accent.tertiary} />
              <Typography variant="small" style={{ color: colors.accent.tertiary, fontWeight: 600 }}>
                Limited Time Offer
              </Typography>
            </div>
            <Typography
              variant="h2"
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Become a Founding Member
            </Typography>
            <Typography
              variant="body"
              style={{
                color: colors.text.secondary,
                maxWidth: CONTENT_MEDIUM,
                margin: `0 auto ${spacing.xl} auto`,
                fontSize: '18px',
              }}
            >
              Join waQup now and lock in special founding member pricing forever. Plus, get early access to new features and exclusive content.
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.md }}>
              <Link href="/pricing" style={{ textDecoration: 'none' }}>
                <Button
                  variant="primary"
                  size="lg"
                  style={{
                    background: colors.gradients.primary,
                    padding: `${spacing.md} ${spacing.xl}`,
                  }}
                >
                  View Founding Member Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Early Access CTA */}
        <section
          style={{
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
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${colors.glass.border}`,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h2"
              style={{
                fontSize: 'clamp(24px, 3vw, 36px)',
                color: colors.text.primary,
                marginBottom: spacing.md,
              }}
            >
              Be Among the First
            </Typography>
            <Typography
              variant="body"
              style={{
                fontSize: '18px',
                color: colors.text.secondary,
                maxWidth: CONTENT_MEDIUM,
                margin: `0 auto ${spacing.xl} auto`,
                lineHeight: 1.7,
              }}
            >
              waQup is launching soon. Become a founding member, experience the app first-hand, and share your story with the community.
            </Typography>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <Button
                variant="primary"
                size="lg"
                style={{
                  background: colors.gradients.primary,
                }}
              >
                Join as a Founding Member
              </Button>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section
          style={{
            padding: `${spacing.xxxl} ${spacing.xl}`,
            textAlign: 'center',
            maxWidth: CONTENT_MAX_WIDTH,
            margin: '0 auto',
          }}
        >
          <Typography
            variant="h2"
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Start Your Journey Today
          </Typography>
          <Typography
            variant="body"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: colors.text.secondary,
              maxWidth: CONTENT_NARROW,
              margin: `0 auto ${spacing.xl} auto`,
            }}
          >
            Join our founding members and lock in our special lifetime pricing. Limited to first 500 members only.
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.md }}>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <Button
                variant="primary"
                size="lg"
                style={{
                  background: colors.gradients.primary,
                  padding: `${spacing.lg} ${spacing.xxl}`,
                  fontSize: '18px',
                }}
              >
                Get Started
              </Button>
            </Link>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button
                variant="ghost"
                size="md"
                style={{
                  color: colors.text.secondary,
                }}
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </section>
    </PageShell>
  );
}
