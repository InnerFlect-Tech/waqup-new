'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Typography, Button, Input, PageShell } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR, CONTENT_MAX_WIDTH, CONTENT_MEDIUM, GRID_CARD_MIN } from '@/theme';
import {
  Sparkles,
  Sprout,
  Factory,
  Megaphone,
  TrendingUp,
  Users,
  PenLine,
  Percent,
  Target,
  Shield,
  Zap,
  ArrowRight,
  BarChart3,
  TrendingDown,
  Lock,
} from 'lucide-react';

/** Repayment scenarios: monthly revenue → months to 1.2× (at 12.5% share) */
const REPAYMENT_SCENARIOS = [
  { label: '€1,000/mo', revenue: 1000, months: 48, share: 0.125 },
  { label: '€2,500/mo', revenue: 2500, months: 19.2, share: 0.125 },
  { label: '€5,000/mo', revenue: 5000, months: 9.6, share: 0.125 },
  { label: '€10,000/mo', revenue: 10000, months: 4.8, share: 0.125 },
  { label: '€25,000/mo', revenue: 25000, months: 1.92, share: 0.125 },
];

const INVESTOR_PACKAGES = [
  {
    id: 'seed',
    name: 'Seed Investor',
    amount: '~€5,000',
    returnExample: '€6,000 back (1.2×)',
    badge: 'Closed package',
    description: 'Helps fast-finish the build, polish, and put waQup in the market.',
    icon: Sprout,
    color: 'primary' as const,
  },
  {
    id: 'production',
    name: 'Production Partner Investor',
    amount: '€50,000',
    returnExample: '€60,000 back (1.2×)',
    badge: 'Closed package',
    description:
      'Must help ensure all production quality: from authentication to build standards and marketplace readiness.',
    icon: Factory,
    color: 'secondary' as const,
  },
  {
    id: 'marketing',
    name: 'Marketing Partner Investor',
    amount: '€100,000',
    returnExample: '€120,000 back (1.2×)',
    badge: 'Closed package',
    description:
      'Knows how to sell fast and strong, stays on the edge of the market. Proof of experience making 1M+ with apps required.',
    icon: Megaphone,
    color: 'tertiary' as const,
  },
  {
    id: 'promotion',
    name: 'Promotion Investor',
    amount: 'No max',
    returnExample: 'ROI per agreement — uncapped',
    badge: 'Open',
    description:
      'Receives over a specific ROI and gets access to decisions on how to promote ads.',
    icon: TrendingUp,
    color: 'primary' as const,
  },
];

const OTHER_WAYS = [
  {
    id: 'influencer',
    name: 'Influencer',
    amount: '€500–5,000+ per campaign',
    howYouEarn: 'Fixed fee per campaign (by reach tier) + 10–30% revenue share on signups you drive. Terms scale with audience size.',
    description: 'Promote waQup to your audience. Limited partner slots — we work with a small number of aligned creators.',
    icon: Users,
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    amount: '70% of every sale',
    howYouEarn: 'You create affirmations, meditations, or rituals. Sell in the waQup marketplace. 70% goes to you — no cap, ongoing passive income.',
    description: 'Create once, earn as long as your content sells. Early creators get featured placement and founding-creator status.',
    icon: PenLine,
  },
];

export default function InvestorsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [formState, setFormState] = useState<{
    name: string;
    email: string;
    interest: string;
    message: string;
    status: 'idle' | 'loading' | 'success' | 'error';
    error?: string;
  }>({
    name: '',
    email: '',
    interest: '',
    message: '',
    status: 'idle',
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState((s) => ({ ...s, status: 'loading', error: undefined }));
    try {
      const res = await fetch('/api/investors/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          interest: formState.interest || undefined,
          message: formState.message || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormState((s) => ({ ...s, status: 'error', error: data.error || 'Something went wrong' }));
        return;
      }
      setFormState({ name: '', email: '', interest: '', message: '', status: 'success' });
    } catch {
      setFormState((s) => ({ ...s, status: 'error', error: 'Failed to send. Please try again.' }));
    }
  };

  const accentMap = {
    primary: colors.accent.primary,
    secondary: colors.accent.secondary,
    tertiary: colors.accent.tertiary,
  };

  return (
    <PageShell intensity="high" bare allowDocumentScroll>
      {/* Hero */}
      <section
        style={{
          padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl}) clamp(${spacing.md}, 4vw, ${spacing.xl})`,
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
          <Typography
            variant="smallBold"
            style={{ color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.5px' }}
          >
            Limited Founding Partner Slots
          </Typography>
        </div>
        <Typography
          variant="h1"
          style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            color: colors.text.primary,
            marginBottom: spacing.md,
            fontWeight: 300,
          }}
        >
          Investor Proposition
        </Typography>
        <Typography
          variant="body"
          style={{
            color: colors.text.secondary,
            maxWidth: CONTENT_MEDIUM,
            margin: '0 auto',
            fontSize: 'clamp(16px, 2vw, 20px)',
            lineHeight: 1.6,
          }}
        >
          Clear numbers. Real returns. One-time opportunity — get in before launch. Strategic partners who bring
          expertise and capital earn revenue share with no equity dilution.
        </Typography>
      </section>

      {/* What is waQup */}
      <section
        style={{
          padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl}) clamp(${spacing.md}, 4vw, ${spacing.xl})`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl})`,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${colors.glass.border}`,
            boxShadow: `0 16px 64px ${colors.accent.primary}30`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
            <Sparkles size={24} color={colors.accent.tertiary} />
            <Typography variant="h2" style={{ color: colors.text.primary, fontSize: 'clamp(24px, 4vw, 32px)' }}>
              What is waQup?
            </Typography>
          </div>
          <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.7, fontSize: '17px' }}>
            waQup is a voice-first wellness app for personalized affirmations, meditations, and rituals. We are in
            late development: core flows exist; we need strategic partners to finish the product, ensure production
            quality, and bring it to market.
          </Typography>
        </div>
      </section>

      {/* Market Opportunity */}
      <section
        style={{
          padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl}) clamp(${spacing.md}, 4vw, ${spacing.xl})`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl})`,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${colors.glass.border}`,
            boxShadow: `0 16px 64px ${colors.accent.secondary}25`,
          }}
        >
          <Typography
            variant="h2"
            style={{ marginBottom: spacing.lg, color: colors.text.primary, fontSize: 'clamp(24px, 4vw, 32px)' }}
          >
            Why Now — Market Opportunity
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.7, fontSize: '17px' }}>
            The wellness app market is $12B+ and growing 15% annually. Voice-first, personalized content is still
            underserved — Calm and Headspace proved demand; waQup fills the gap with AI-powered, deeply personal
            experiences. Early partners capture upside before the market saturates.
          </Typography>
        </div>
      </section>

      {/* Investment Packages */}
      <section
        style={{
          padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl}) clamp(${spacing.md}, 4vw, ${spacing.xl})`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center', fontSize: 'clamp(22px, 5vw, 28px)' }}>
          Investment Packages
        </Typography>
        <Typography
          variant="body"
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            maxWidth: CONTENT_MEDIUM,
            margin: `0 auto clamp(${spacing.lg}, 4vw, ${spacing.xxl}) auto`,
            fontSize: 'clamp(15px, 2vw, 17px)',
          }}
        >
          How you earn: 10–15% of monthly revenue until 1.2× repaid. Clear numbers below. Limited slots per tier.
        </Typography>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(min(${GRID_CARD_MIN}, 100%), 1fr))`,
            gap: `clamp(${spacing.lg}, 3vw, ${spacing.xl})`,
          }}
        >
          {INVESTOR_PACKAGES.filter((p) => p.id !== 'promotion').map((pkg) => {
            const IconComponent = pkg.icon;
            const accent = accentMap[pkg.color];
            return (
              <div
                key={pkg.id}
                style={{
                  padding: `clamp(${spacing.lg}, 4vw, ${spacing.xl})`,
                  borderRadius: borderRadius.xl,
                  background: colors.glass.light,
                  backdropFilter: BLUR.xl,
                  WebkitBackdropFilter: BLUR.xl,
                  border: `1px solid ${colors.glass.border}`,
                  boxShadow: `0 8px 32px ${colors.accent.primary}25`,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 16px 48px ${accent}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 8px 32px ${colors.accent.primary}25`;
                }}
              >
                {pkg.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: spacing.lg,
                      right: spacing.lg,
                      padding: `${spacing.xs} ${spacing.sm}`,
                      borderRadius: borderRadius.sm,
                      background: `${accent}20`,
                      border: `1px solid ${accent}40`,
                    }}
                  >
                    <Typography variant="smallBold" style={{ color: accent }}>
                      {pkg.badge}
                    </Typography>
                  </div>
                )}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: borderRadius.full,
                    background: `${accent}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: spacing.lg,
                    border: `1px solid ${accent}40`,
                  }}
                >
                  <IconComponent size={24} color={accent} strokeWidth={2} />
                </div>
                <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
                  {pkg.name}
                </Typography>
                <Typography
                  variant="h1"
                  style={{
                    fontSize: 'clamp(24px, 4vw, 32px)',
                    fontWeight: 700,
                    color: accent,
                    marginBottom: spacing.xs,
                  }}
                >
                  {pkg.amount}
                </Typography>
                {'returnExample' in pkg && pkg.returnExample && (
                  <Typography
                    variant="smallBold"
                    style={{ color: accent, marginBottom: spacing.md, opacity: 0.95 }}
                  >
                    {pkg.returnExample}
                  </Typography>
                )}
                <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6, flex: 1 }}>
                  {pkg.description}
                </Typography>
              </div>
            );
          })}
        </div>

        {/* Promotion Investor - full-width banner */}
        {(() => {
          const pkg = INVESTOR_PACKAGES.find((p) => p.id === 'promotion');
          if (!pkg) return null;
          const IconComponent = pkg.icon;
          const accent = colors.accent.primary;
          return (
            <div
              style={{
                marginTop: spacing.xl,
                padding: `${spacing.xl} ${spacing.xl}`,
                borderRadius: borderRadius.xl,
                background: `linear-gradient(90deg, ${accent}08 0%, ${colors.glass.light} 30%, ${accent}06 100%)`,
                backdropFilter: BLUR.xl,
                WebkitBackdropFilter: BLUR.xl,
                border: `1px solid ${accent}40`,
                borderLeft: `4px solid ${accent}`,
                boxShadow: `0 4px 24px ${accent}25`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xl,
                flexWrap: 'wrap',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 8px 32px ${accent}40`;
                e.currentTarget.style.borderColor = `${accent}80`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `0 4px 24px ${accent}25`;
                e.currentTarget.style.borderColor = `${accent}40`;
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: borderRadius.full,
                  background: `${accent}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: `1px solid ${accent}40`,
                }}
              >
                <IconComponent size={24} color={accent} strokeWidth={2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                  {pkg.name}
                </Typography>
                <Typography
                  variant="h1"
                  style={{
                    fontSize: 'clamp(20px, 3vw, 26px)',
                    fontWeight: 700,
                    color: accent,
                    display: 'inline',
                    marginRight: spacing.sm,
                  }}
                >
                  {pkg.amount}
                </Typography>
                {'returnExample' in pkg && pkg.returnExample && (
                  <Typography variant="smallBold" style={{ color: accent, opacity: 0.95, display: 'inline' }}>
                    — {pkg.returnExample}
                  </Typography>
                )}
              </div>
              <Typography
                variant="body"
                style={{
                  color: colors.text.secondary,
                  lineHeight: 1.6,
                  flex: '1 1 200px',
                  fontSize: 'clamp(14px, 2vw, 15px)',
                }}
              >
                {pkg.description}
              </Typography>
            </div>
          );
        })()}
      </section>

      {/* Terms reduce over time — stepped decay graphic */}
      <section
        style={{
          padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl}) clamp(${spacing.md}, 4vw, ${spacing.xl})`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{
            padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl})`,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${colors.glass.border}`,
            boxShadow: `0 16px 64px ${colors.accent.tertiary}20`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
            <TrendingDown size={24} color={colors.accent.tertiary} />
            <Typography variant="h3" style={{ color: colors.text.primary }}>
              Terms reduce every 3 months
            </Typography>
          </div>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, lineHeight: 1.6 }}>
            Return cap steps down every quarter until ~1.5%. Then the opportunity closes — no more investors accepted.
          </Typography>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: spacing.sm,
              marginBottom: spacing.lg,
              minHeight: 140,
              overflowX: 'auto',
              paddingBottom: spacing.sm,
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {[
              { label: 'Now', return: '1.2×', pct: 100, color: colors.accent.primary },
              { label: '+3 mo', return: '1.15×', pct: 85, color: colors.accent.primary },
              { label: '+6 mo', return: '1.1×', pct: 70, color: colors.accent.secondary },
              { label: '+9 mo', return: '1.05×', pct: 55, color: colors.accent.secondary },
              { label: '+12 mo', return: '~1.5%', pct: 25, color: colors.accent.tertiary },
            ].map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: 'auto' }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                style={{
                  flex: '1 1 0',
                  minWidth: 44,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}
              >
                <Typography variant="caption" style={{ color: colors.text.tertiary, fontSize: '11px' }}>
                  {step.label}
                </Typography>
                <div
                  style={{
                    width: '100%',
                    height: `${step.pct}px`,
                    minHeight: 24,
                    borderRadius: `${borderRadius.sm} ${borderRadius.sm} 0 0`,
                    background: `linear-gradient(180deg, ${step.color} 0%, ${step.color}80 100%)`,
                    border: `1px solid ${step.color}60`,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: spacing.xs,
                  }}
                >
                  <Typography variant="smallBold" style={{ color: colors.text.onDark || '#fff', fontSize: '11px' }}>
                    {step.return}
                  </Typography>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              style={{
                flex: '1 1 0',
                minWidth: 44,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              <Typography variant="caption" style={{ color: colors.text.tertiary, fontSize: '11px' }}>
                Closed
              </Typography>
              <div
                style={{
                  width: '100%',
                  height: 24,
                  borderRadius: borderRadius.sm,
                  background: `${colors.text.tertiary}30`,
                  border: `1px dashed ${colors.glass.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: spacing.xs,
                }}
              >
                <Lock size={14} color={colors.text.tertiary} />
                <Typography variant="smallBold" style={{ color: colors.text.tertiary, fontSize: '11px' }}>
                  No more investors
                </Typography>
              </div>
            </motion.div>
          </div>
          <Typography variant="caption" style={{ color: colors.text.tertiary, display: 'block', textAlign: 'center' }}>
            Early investors get the best terms. Act now.
          </Typography>
        </motion.div>
      </section>

      {/* Investor Return — profit-focused, graphic, multi-perspective */}
      <section
        style={{
          padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl}) clamp(${spacing.md}, 4vw, ${spacing.xl})`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center', fontSize: 'clamp(22px, 5vw, 28px)' }}>
          Investor Return
        </Typography>
        <Typography
          variant="body"
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            maxWidth: CONTENT_MEDIUM,
            margin: `0 auto clamp(${spacing.lg}, 4vw, ${spacing.xxl}) auto`,
            fontSize: 'clamp(15px, 2vw, 17px)',
          }}
        >
          Revenue share keeps you aligned with growth. No equity dilution — founder retains full control.
        </Typography>

        {/* Profit projection: Investment → 1.2× return */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{
            padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl})`,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${colors.glass.border}`,
            boxShadow: `0 16px 64px ${colors.accent.primary}25`,
            marginBottom: spacing.xl,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
            <BarChart3 size={24} color={colors.accent.primary} />
            <Typography variant="h3" style={{ color: colors.text.primary, fontSize: 'clamp(18px, 3vw, 20px)' }}>
              Your profit path
            </Typography>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: spacing.lg,
              marginBottom: spacing.xl,
            }}
          >
            <div style={{ textAlign: 'center', minWidth: 0 }}>
              <Typography variant="caption" style={{ color: colors.text.tertiary, display: 'block', marginBottom: spacing.xs }}>
                You invest
              </Typography>
              <Typography variant="h1" style={{ color: colors.text.primary, fontWeight: 700, fontSize: 'clamp(24px, 4vw, 32px)' }}>
                €5,000
              </Typography>
            </div>
            <ArrowRight size={28} color={colors.accent.primary} style={{ flexShrink: 0, opacity: 0.8 }} />
            <div
              style={{
                flex: 1,
                minWidth: 0,
                height: 48,
                borderRadius: borderRadius.md,
                background: `${colors.accent.primary}15`,
                border: `1px solid ${colors.accent.primary}40`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '66.67%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  background: colors.gradients.primary,
                  borderRadius: borderRadius.md,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: spacing.md,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}
              >
                <Typography variant="bodyBold" style={{ color: colors.text.onDark }}>
                  1.2× = €6,000
                </Typography>
              </div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 0 }}>
              <Typography variant="caption" style={{ color: colors.text.tertiary, display: 'block', marginBottom: spacing.xs }}>
                You get back
              </Typography>
              <Typography variant="h1" style={{ color: colors.accent.primary, fontWeight: 700, fontSize: 'clamp(24px, 4vw, 32px)' }}>
                €6,000
              </Typography>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: spacing.xl,
              flexWrap: 'wrap',
              marginTop: spacing.lg,
            }}
          >
            <div
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                borderRadius: borderRadius.full,
                background: `${colors.accent.primary}25`,
                border: `1px solid ${colors.accent.primary}50`,
              }}
            >
              <Typography variant="smallBold" style={{ color: colors.accent.primary }}>
                +20% ROI
              </Typography>
            </div>
            <div
              style={{
                padding: `${spacing.sm} ${spacing.lg}`,
                borderRadius: borderRadius.full,
                background: `${colors.accent.tertiary}20`,
                border: `1px solid ${colors.accent.tertiary}40`,
              }}
            >
              <Typography variant="smallBold" style={{ color: colors.accent.tertiary }}>
                €1,000 profit on €5,000
              </Typography>
            </div>
          </div>
          <Typography variant="caption" style={{ color: colors.text.tertiary, display: 'block', textAlign: 'center', marginTop: spacing.sm }}>
            Capped. No equity given away.
          </Typography>
        </motion.div>

        {/* Repayment timeline by revenue scenario — bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl})`,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${colors.glass.border}`,
            boxShadow: `0 16px 64px ${colors.accent.secondary}20`,
            marginBottom: spacing.xl,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
            <Target size={24} color={colors.accent.secondary} />
            <Typography variant="h3" style={{ color: colors.text.primary, fontSize: 'clamp(18px, 3vw, 20px)' }}>
              How fast you get repaid
            </Typography>
          </div>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, lineHeight: 1.6 }}>
            At 12.5% of monthly revenue until 1.2× repaid. Higher revenue → faster return.
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {REPAYMENT_SCENARIOS.map((s, i) => {
              const minMonths = Math.min(...REPAYMENT_SCENARIOS.map((x) => x.months));
              const maxMonths = Math.max(...REPAYMENT_SCENARIOS.map((x) => x.months));
              const pct = maxMonths > minMonths ? ((maxMonths - s.months) / (maxMonths - minMonths)) * 80 + 20 : 100;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => setSelectedScenario(selectedScenario === s.label ? null : s.label)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedScenario(selectedScenario === s.label ? null : s.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.lg,
                    flexWrap: 'wrap',
                    cursor: 'pointer',
                    padding: spacing.sm,
                    borderRadius: borderRadius.md,
                    background: selectedScenario === s.label ? `${colors.accent.secondary}20` : 'transparent',
                    border: selectedScenario === s.label ? `1px solid ${colors.accent.secondary}50` : '1px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Typography variant="bodyBold" style={{ color: colors.text.primary, minWidth: 100 }}>
                    {s.label}
                  </Typography>
                  <div
                    style={{
                      flex: 1,
                      minWidth: 120,
                      height: 28,
                      borderRadius: borderRadius.sm,
                      background: `${colors.accent.secondary}15`,
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        background: colors.gradients.secondary || colors.gradients.primary,
                        borderRadius: borderRadius.sm,
                      }}
                    />
                  </div>
                  <Typography variant="smallBold" style={{ color: colors.accent.secondary, minWidth: 80 }}>
                    ~{s.months >= 12 ? `${Math.round(s.months / 12)} yr` : `${Math.round(s.months)} mo`}
                  </Typography>
                </motion.div>
              );
            })}
          </div>
          <Typography variant="caption" style={{ color: colors.text.tertiary, marginTop: spacing.md, display: 'block' }}>
            Click a scenario to see your timeline. Bar length = speed to full repayment (€5,000 at 12.5%).
          </Typography>
        </motion.div>

        {/* Two perspectives: Optimistic vs Conservative */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.12 }}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(min(220px, 100%), 1fr))`,
            gap: spacing.lg,
            marginBottom: spacing.xl,
          }}
        >
          <div
            style={{
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              background: `linear-gradient(135deg, ${colors.accent.tertiary}15 0%, ${colors.glass.light} 100%)`,
              border: `1px solid ${colors.accent.tertiary}40`,
            }}
          >
            <Typography variant="smallBold" style={{ color: colors.accent.tertiary, marginBottom: spacing.xs }}>
              Optimistic
            </Typography>
            <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
              ~2.4 months
            </Typography>
            <Typography variant="caption" style={{ color: colors.text.secondary }}>
              At €25k/mo revenue — full 1.2× repaid
            </Typography>
          </div>
          <div
            style={{
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              background: colors.glass.light,
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <Typography variant="smallBold" style={{ color: colors.text.tertiary, marginBottom: spacing.xs }}>
              Conservative
            </Typography>
            <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
              ~12 months
            </Typography>
            <Typography variant="caption" style={{ color: colors.text.secondary }}>
              At €5k/mo revenue — full 1.2× repaid
            </Typography>
          </div>
        </motion.div>

        {/* Comparative perspective: Revenue share vs equity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(min(260px, 100%), 1fr))`,
            gap: spacing.lg,
            marginBottom: spacing.xl,
          }}
        >
          <div
            style={{
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: `linear-gradient(135deg, ${colors.accent.primary}18 0%, ${colors.glass.light} 100%)`,
              border: `1px solid ${colors.accent.primary}40`,
              boxShadow: `0 8px 32px ${colors.accent.primary}20`,
            }}
          >
            <Typography variant="h4" style={{ color: colors.accent.primary, marginBottom: spacing.sm }}>
              Revenue share (waQup)
            </Typography>
            <ul style={{ margin: 0, paddingLeft: spacing.lg, color: colors.text.secondary, lineHeight: 1.8, fontSize: '14px' }}>
              <li>Predictable 1.2× cap</li>
              <li>Aligned with growth</li>
              <li>No dilution, no exit needed</li>
            </ul>
          </div>
          <div
            style={{
              padding: spacing.xl,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              border: `1px solid ${colors.glass.border}`,
              opacity: 0.85,
            }}
          >
            <Typography variant="h4" style={{ color: colors.text.tertiary, marginBottom: spacing.sm }}>
              Traditional equity
            </Typography>
            <ul style={{ margin: 0, paddingLeft: spacing.lg, color: colors.text.tertiary, lineHeight: 1.8, fontSize: '14px' }}>
              <li>Uncertain exit value</li>
              <li>Dilution, board seats</li>
              <li>Exit event required</li>
            </ul>
          </div>
        </motion.div>

        {/* Term cards — compact grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(min(240px, 100%), 1fr))`,
            gap: spacing.lg,
          }}
        >
          {[
            { icon: Shield, label: 'Instrument', value: 'Revenue share (no equity dilution)' },
            { icon: Percent, label: 'Repayment', value: '10–15% of monthly revenue until 1.2×' },
            { icon: Target, label: 'Cap', value: 'Capped at 1.2× (e.g. €6,000 for €5,000)' },
            { icon: Zap, label: 'Founder control', value: '100% ownership; no voting, no board' },
          ].map((t, i) => {
            const IconComponent = t.icon;
            return (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{
                  display: 'flex',
                  gap: spacing.md,
                  padding: spacing.lg,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  backdropFilter: BLUR.xl,
                  WebkitBackdropFilter: BLUR.xl,
                  border: `1px solid ${colors.glass.border}`,
                  boxShadow: `0 8px 32px ${colors.accent.primary}20`,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: borderRadius.full,
                    background: colors.gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComponent size={20} color={colors.text.onDark} strokeWidth={2} />
                </div>
                <div>
                  <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs, fontSize: '16px' }}>
                    {t.label}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.5, fontSize: '14px' }}>
                    {t.value}
                  </Typography>
                </div>
              </motion.div>
            );
          })}
        </div>
        <Typography
          variant="caption"
          style={{
            color: colors.text.tertiary,
            textAlign: 'center',
            marginTop: spacing.lg,
            display: 'block',
          }}
        >
          Promotion Investor: specific ROI terms discussed separately.
        </Typography>
      </section>

      {/* Other Ways to Earn */}
      <section
        style={{
          padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl}) clamp(${spacing.md}, 4vw, ${spacing.xl})`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center', fontSize: 'clamp(22px, 5vw, 28px)' }}>
          Other Ways to Earn
        </Typography>
        <Typography
          variant="body"
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            maxWidth: CONTENT_MEDIUM,
            margin: `0 auto clamp(${spacing.lg}, 4vw, ${spacing.xxl}) auto`,
            fontSize: 'clamp(15px, 2vw, 17px)',
          }}
        >
          Clear numbers. Passive income. Limited partner slots — one-time opportunity to get in early.
        </Typography>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(min(280px, 100%), 1fr))`,
            gap: `clamp(${spacing.lg}, 3vw, ${spacing.xl})`,
          }}
        >
          {OTHER_WAYS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                style={{
                  padding: `clamp(${spacing.lg}, 4vw, ${spacing.xl})`,
                  borderRadius: borderRadius.xl,
                  background: colors.glass.light,
                  backdropFilter: BLUR.xl,
                  WebkitBackdropFilter: BLUR.xl,
                  border: `1px solid ${colors.glass.border}`,
                  boxShadow: `0 8px 32px ${colors.accent.primary}25`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.md,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: borderRadius.full,
                      background: `${colors.accent.secondary}25`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: `1px solid ${colors.accent.secondary}40`,
                    }}
                  >
                    <IconComponent size={24} color={colors.accent.secondary} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                      {item.name}
                    </Typography>
                    <Typography
                      variant="h1"
                      style={{
                        fontSize: 'clamp(20px, 3vw, 26px)',
                        fontWeight: 700,
                        color: colors.accent.secondary,
                        marginBottom: spacing.sm,
                      }}
                    >
                      {item.amount}
                    </Typography>
                  </div>
                </div>
                {'howYouEarn' in item && item.howYouEarn && (
                  <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6, fontWeight: 500 }}>
                    {item.howYouEarn}
                  </Typography>
                )}
                <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6, opacity: 0.9 }}>
                  {item.description}
                </Typography>
              </div>
            );
          })}
        </div>
      </section>

      {/* Payment Options - Simplified */}
      <section
        style={{
          padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl}) clamp(${spacing.md}, 4vw, ${spacing.xl})`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            background: colors.glass.light,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${colors.glass.border}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
            We accept fiat (euro, USD), stablecoins, or escrow. Specific terms are agreed when you choose your investment package.
          </Typography>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section
        style={{
          padding: `${spacing.xxl} ${spacing.xl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            border: `1px solid ${colors.warning || colors.accent.secondary}40`,
            background: `${colors.warning || colors.accent.secondary}12`,
          }}
        >
          <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
            Legal Disclaimer
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '14px', lineHeight: 1.6 }}>
            This page is for informational purposes only and does not constitute financial or legal advice. A formal
            agreement, drafted by a lawyer, is required before any investment or partnership. Consult a professional
            before investing.
          </Typography>
        </div>
      </section>

      {/* Talk to us — contact the builders */}
      <section
        style={{
          padding: `clamp(${spacing.lg}, 5vw, ${spacing.xxl}) clamp(${spacing.md}, 4vw, ${spacing.xl})`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: CONTENT_MEDIUM,
            margin: '0 auto',
            padding: spacing.xxl,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${colors.glass.border}`,
            boxShadow: `0 8px 32px ${colors.accent.primary}20`,
          }}
        >
          <Typography
            variant="h2"
            style={{
              color: colors.text.primary,
              marginBottom: spacing.sm,
              textAlign: 'center',
              fontSize: 'clamp(24px, 4vw, 32px)',
            }}
          >
            Talk to us
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              textAlign: 'center',
              marginBottom: spacing.xxl,
              maxWidth: CONTENT_MEDIUM,
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.6,
            }}
          >
            waQup is built by Daniel Indias Fernandes and a small dedicated team. If you&apos;re interested in partnering or investing, reach out directly — we read every message.
          </Typography>
          {formState.status === 'success' ? (
            <div style={{ textAlign: 'center', padding: spacing.xl }}>
              <Typography variant="h4" style={{ color: colors.accent.primary, marginBottom: spacing.sm }}>
                Message sent
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary }}>
                We&apos;ll get back to you soon.
              </Typography>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} style={{ maxWidth: 480, margin: '0 auto' }}>
              <div style={{ marginBottom: spacing.lg }}>
                <Input
                  label="Name"
                  type="text"
                  placeholder="Your name"
                  value={formState.name}
                  onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                  required
                  disabled={formState.status === 'loading'}
                />
              </div>
              <div style={{ marginBottom: spacing.lg }}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={formState.email}
                  onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                  required
                  disabled={formState.status === 'loading'}
                />
              </div>
              <div style={{ marginBottom: spacing.lg }}>
                <label>
                  <Typography variant="caption" style={{ fontWeight: 500, marginBottom: spacing.sm, display: 'block', color: colors.text.secondary }}>
                    Interest
                  </Typography>
                  <select
                    value={formState.interest}
                    onChange={(e) => setFormState((s) => ({ ...s, interest: e.target.value }))}
                    disabled={formState.status === 'loading'}
                    style={{
                      width: '100%',
                      padding: `${spacing.sm} ${spacing.md}`,
                      minHeight: 48,
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.glass.border}`,
                      background: colors.glass.light,
                      color: colors.text.primary,
                      fontSize: 15,
                    }}
                  >
                    <option value="">Select an option</option>
                    <option value="seed">Seed Investor</option>
                    <option value="production">Production Partner Investor</option>
                    <option value="marketing">Marketing Partner Investor</option>
                    <option value="promotion">Promotion Investor</option>
                    <option value="influencer">Influencer</option>
                    <option value="content-creator">Content Creator</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>
              <div style={{ marginBottom: spacing.xl }}>
                <label>
                  <Typography variant="caption" style={{ fontWeight: 500, marginBottom: spacing.sm, display: 'block', color: colors.text.secondary }}>
                    Message
                  </Typography>
                  <textarea
                    value={formState.message}
                    onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                    disabled={formState.status === 'loading'}
                    placeholder="Tell us about your interest..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: `${spacing.sm} ${spacing.md}`,
                      minHeight: 100,
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.glass.border}`,
                      background: colors.glass.light,
                      color: colors.text.primary,
                      fontSize: 15,
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </label>
              </div>
              {formState.error && (
                <Typography variant="small" style={{ color: colors.error || colors.accent.secondary, marginBottom: spacing.md, display: 'block' }}>
                  {formState.error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={formState.status === 'loading'}
                style={{ padding: `${spacing.lg} ${spacing.xxl}` }}
              >
                {formState.status === 'loading' ? 'Sending...' : 'Talk to us'}
              </Button>
            </form>
          )}
          <Typography
            variant="small"
            style={{
              color: colors.text.tertiary,
              marginTop: spacing.xl,
              display: 'block',
              textAlign: 'center',
            }}
          >
            Daniel Indias Fernandes · Founder, waQup · Innerflect · innerflect.tech
          </Typography>
        </motion.div>
      </section>
    </PageShell>
  );
}
