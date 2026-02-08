'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { AnimatedBackground, Logo } from '@/components';
import { spacing, borderRadius } from '@/theme';
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
  Check,
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

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground intensity="medium" color="primary" />
      
      {/* Mystical Radial Gradient Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: colors.gradients.mystical,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Navigation */}
        <nav
          style={{
            padding: `${spacing.lg} ${spacing.xl}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <Logo size="md" />
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg }}>
            <Link href="/how-it-works" style={{ textDecoration: 'none' }}>
              <Typography variant="body" style={{ color: colors.accent.primary, fontWeight: 600 }}>
                How It Works
              </Typography>
            </Link>
            <Link href="/pricing" style={{ textDecoration: 'none' }}>
              <Typography variant="body" style={{ color: colors.text.secondary, fontWeight: 400 }}>
                Pricing
              </Typography>
            </Link>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="md" style={{ borderColor: colors.glass.border }}>
                Sign In
              </Button>
            </Link>
            <Link href="/signup" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section
          style={{
            padding: `${spacing.xxl} ${spacing.xl}`,
            textAlign: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <Typography
            variant="h1"
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 300,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Your Personal Sanctuary
          </Typography>
          <Typography
            variant="body"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: colors.text.secondary,
              maxWidth: '800px',
              margin: `0 auto ${spacing.xl} auto`,
              lineHeight: 1.6,
            }}
          >
            waQup is your AI-powered companion for meditation and affirmations, helping you build a consistent spiritual practice that grows with you.
          </Typography>
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
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <Typography
            variant="h2"
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 300,
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
                    background: colors.glass.opaque,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${colors.glass.border}`,
                    boxShadow: `0 8px 32px ${colors.mystical.glow}40`,
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
                        boxShadow: `0 4px 12px ${colors.mystical.glow}60`,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `radial-gradient(circle at center, ${colors.mystical.glow}40, transparent)`,
                          opacity: 0.6,
                        }}
                      />
                      <IconComponent size={32} color={colors.text.onDark} strokeWidth={2.5} style={{ position: 'relative', zIndex: 1 }} />
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
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <Typography
            variant="h2"
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 300,
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
              maxWidth: '800px',
              margin: `0 auto ${spacing.xxl} auto`,
            }}
          >
            waQup combines ancient wisdom with modern technology to create a meditation and affirmation experience that evolves with you.
          </Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
                    background: colors.glass.opaque,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${colors.glass.border}`,
                    boxShadow: `0 8px 32px ${colors.mystical.glow}40`,
                    transition: 'all 0.3s ease',
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
                      boxShadow: `0 4px 12px ${colors.mystical.glow}60`,
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(circle at center, ${colors.mystical.glow}40, transparent)`,
                        opacity: 0.6,
                      }}
                    />
                    <IconComponent size={24} color={colors.text.onDark} strokeWidth={2.5} style={{ position: 'relative', zIndex: 1 }} />
                  </div>
                  <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary }}>
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
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              padding: spacing.xxl,
              borderRadius: borderRadius.xl,
              background: colors.glass.opaque,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${colors.glass.border}`,
              boxShadow: `0 16px 64px ${colors.mystical.glow}40`,
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
                fontWeight: 300,
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
                maxWidth: '600px',
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

        {/* Testimonials */}
        <section
          style={{
            padding: `${spacing.xxl} ${spacing.xl}`,
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: spacing.lg,
            }}
          >
            <div
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.xl,
                background: colors.glass.opaque,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${colors.glass.border}`,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="body"
                style={{
                  fontSize: '20px',
                  color: colors.text.primary,
                  fontStyle: 'italic',
                  marginBottom: spacing.lg,
                  lineHeight: 1.6,
                }}
              >
                "waQup has transformed my morning routine. The personalized guidance and beautiful meditations have helped me stay consistent with my practice."
              </Typography>
              <Typography variant="body" style={{ color: colors.accent.tertiary, fontWeight: 600 }}>
                Sarah M. - Founding Member
              </Typography>
            </div>
            <div
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.xl,
                background: colors.glass.opaque,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${colors.glass.border}`,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="body"
                style={{
                  fontSize: '20px',
                  color: colors.text.primary,
                  fontStyle: 'italic',
                  marginBottom: spacing.lg,
                  lineHeight: 1.6,
                }}
              >
                "The AI-powered recommendations are incredible. It's like having a spiritual guide that truly understands my journey and growth."
              </Typography>
              <Typography variant="body" style={{ color: colors.accent.tertiary, fontWeight: 600 }}>
                Michael R. - Founding Member
              </Typography>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section
          style={{
            padding: `${spacing.xxxl} ${spacing.xl}`,
            textAlign: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <Typography
            variant="h2"
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 300,
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
              maxWidth: '800px',
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
      </div>
    </div>
  );
}
