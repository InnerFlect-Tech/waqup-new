'use client';

import React from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { AppHeader, PageShell, ThemeSelector } from '@/components';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import {
  Sparkles,
  Brain,
  Music,
  Zap,
  Shield,
  Heart,
  ArrowRight,
  Check,
  Play,
  Users,
  Star,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const features = [
    {
      icon: Brain,
      title: 'Neuroplasticity-Based',
      description: 'Scientifically designed to rewire your subconscious mind through voice-first experiences',
      color: colors.accent.primary,
    },
    {
      icon: Music,
      title: 'Voice Cloning',
      description: 'Create personalized affirmations and rituals with your own voice or choose from our library',
      color: colors.accent.secondary,
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Creation',
      description: 'Conversational AI guides you through creating transformative content tailored to your goals',
      color: colors.accent.tertiary,
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your voice data is encrypted and stored securely. You own your transformation journey',
      color: colors.accent.primary,
    },
    {
      icon: Heart,
      title: 'Three Content Types',
      description: 'Affirmations for cognitive re-patterning, Meditations for state induction, Rituals for identity encoding',
      color: colors.accent.secondary,
    },
    {
      icon: Zap,
      title: 'Practice is Free',
      description: 'Unlimited replay of your content. Credits only used for creation, never for practice',
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
    <PageShell intensity="high" bare>
      <ThemeSelector />
      <AppHeader />

      {/* Hero Section */}
        <section
          style={{
            padding: `${spacing.xxl} ${spacing.xl}`,
            textAlign: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* AI POWERED Badge */}
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
            <Typography variant="small" style={{ color: colors.accent.tertiary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              AI POWERED
            </Typography>
          </div>

          {/* Large Logo - Text Only, Very Thin Font Weight */}
          <div
            style={{
              fontSize: 'clamp(64px, 12vw, 120px)',
              fontWeight: 300, // Very thin weight (light) - matches example
              lineHeight: 1,
              marginBottom: spacing.lg,
              color: colors.text.primary,
              letterSpacing: '-2px',
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
            }}
          >
            <span style={{ fontWeight: 300, color: colors.text.primary }}>wa</span>
            <span style={{ color: colors.accent.tertiary, fontWeight: 300 }}>Q</span>
            <span style={{ fontWeight: 300, color: colors.text.primary }}>up</span>
          </div>

          {/* Tagline */}
          <Typography
            variant="body"
            style={{
              fontSize: 'clamp(20px, 3vw, 32px)',
              color: colors.text.secondary,
              maxWidth: '800px',
              margin: `0 auto ${spacing.xxl} auto`,
              lineHeight: 1.4,
              fontWeight: 300,
            }}
          >
            Transform Your Mind with Voice and Sacred Frequencies
          </Typography>

          {/* Founding Member Card */}
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              padding: `${spacing.xxl} ${spacing.xl}`,
              borderRadius: borderRadius.xl,
              background: colors.glass.opaque,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${colors.glass.border}`,
              boxShadow: `0 16px 64px ${colors.mystical.glow}40`,
              marginBottom: spacing.xxl,
            }}
          >
            {/* LIMITED TIME OFFER Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: borderRadius.full,
                  background: colors.success,
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              <Typography variant="small" style={{ color: colors.success, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                LIMITED TIME OFFER
              </Typography>
            </div>

            {/* Become a Founding Member */}
            <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.lg, fontWeight: 300, fontSize: 'clamp(24px, 4vw, 32px)' }}>
              Become a Founding Member
            </Typography>

            {/* Benefits */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, flexWrap: 'wrap', marginBottom: spacing.xl }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <Shield size={16} color={colors.text.secondary} />
                <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '14px' }}>
                  Lifetime Access
                </Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <Star size={16} color={colors.text.secondary} />
                <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '14px' }}>
                  Special Pricing
                </Typography>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                <Users size={16} color={colors.text.secondary} />
                <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '14px' }}>
                  500 Spots Only
                </Typography>
              </div>
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  style={{
                    background: colors.gradients.primary,
                    padding: `${spacing.md} ${spacing.xl}`,
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing.sm,
                  }}
                >
                  Join as Founding Member
                  <ChevronRight size={20} color={colors.text.onDark} />
                </Button>
              </Link>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button
                  variant="ghost"
                  size="md"
                  fullWidth
                  style={{
                    color: colors.text.primary,
                  }}
                >
                  Member Login
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          style={{
            padding: `${spacing.xxl} ${spacing.xl}`,
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
            <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md, fontWeight: 300 }}>
              Powerful Features for Transformation
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, maxWidth: '600px', margin: '0 auto' }}>
              Everything you need to transform your subconscious mind through voice-first experiences
            </Typography>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: spacing.xl,
            }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  style={{
                    padding: spacing.xl,
                    borderRadius: borderRadius.lg,
                    background: colors.glass.opaque,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${colors.glass.border}`,
                    boxShadow: `0 8px 32px ${colors.mystical.glow}40`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = `0 16px 48px ${colors.mystical.glow}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 8px 32px ${colors.mystical.glow}40`;
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
                      boxShadow: `0 4px 12px ${colors.mystical.glow}60`,
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
                    <span style={{ position: 'relative', zIndex: 1 }}>
                    <IconComponent size={28} color={colors.text.onDark} strokeWidth={2.5} />
                  </span>
                  </div>
                  <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </div>
              );
            })}
          </div>
        </section>

        {/* Benefits Section */}
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
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: spacing.lg }}>
              {benefits.map((benefit, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
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

        {/* CTA Section */}
        <section
          style={{
            padding: `${spacing.xxxl} ${spacing.xl}`,
            textAlign: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <Typography
            variant="h2"
            style={{
              color: colors.text.primary,
              marginBottom: spacing.md,
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 300,
            }}
          >
            Ready to Transform Your Mind?
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, fontSize: '20px' }}>
            Join thousands of users transforming their subconscious mind through voice
          </Typography>
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <Button
              variant="primary"
              size="lg"
              style={{
                background: colors.gradients.primary,
                padding: `${spacing.lg} ${spacing.xxl}`,
                fontSize: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.md,
              }}
            >
              Get Started Free
              <ArrowRight size={24} color={colors.text.onDark} />
            </Button>
          </Link>
        </section>

        {/* Footer */}
        <footer
          style={{
            padding: `${spacing.xl} ${spacing.xl}`,
            borderTop: `1px solid ${colors.glass.border}`,
            marginTop: spacing.xxl,
          }}
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
            <Typography variant="body" style={{ color: colors.text.tertiary }}>
              © 2026 waQup. Transform your mind through voice.
            </Typography>
          </div>
        </footer>

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
