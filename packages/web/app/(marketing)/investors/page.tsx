'use client';

import React from 'react';
import { Typography, Button, PageShell } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, CONTENT_MAX_WIDTH, CONTENT_MEDIUM, GRID_CARD_MIN } from '@/theme';
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
} from 'lucide-react';

const INVESTOR_PACKAGES = [
  {
    id: 'seed',
    name: 'Seed Investor',
    amount: '~€5,000',
    returnExample: '€7,500 back (1.5×)',
    badge: 'Closed package',
    description: 'Helps fast-finish the build, polish, and put waQup in the market.',
    icon: Sprout,
    color: 'primary' as const,
  },
  {
    id: 'production',
    name: 'Production Partner Investor',
    amount: '€50,000',
    returnExample: '€75,000 back (1.5×)',
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
    returnExample: '€150,000 back (1.5×)',
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

const INNERFLECT_URL = 'https://innerflect.tech/book/';

export default function InvestorsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const accentMap = {
    primary: colors.accent.primary,
    secondary: colors.accent.secondary,
    tertiary: colors.accent.tertiary,
  };

  return (
    <PageShell intensity="high" bare>
      {/* Hero */}
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
          padding: `${spacing.xxl} ${spacing.xl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center' }}>
          Investment Packages
        </Typography>
        <Typography
          variant="body"
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            maxWidth: CONTENT_MEDIUM,
            margin: `0 auto ${spacing.xxl} auto`,
          }}
        >
          How you earn: 10–15% of monthly revenue until 1.5× repaid. Clear numbers below. Limited slots per tier.
        </Typography>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(3, minmax(${GRID_CARD_MIN}, 1fr))`,
            gap: spacing.xl,
          }}
        >
          {INVESTOR_PACKAGES.map((pkg) => {
            const IconComponent = pkg.icon;
            const accent = accentMap[pkg.color];
            return (
              <div
                key={pkg.id}
                style={{
                  padding: spacing.xl,
                  borderRadius: borderRadius.xl,
                  background: colors.glass.light,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.glass.border}`,
                  boxShadow: `0 8px 32px ${colors.accent.primary}25`,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  ...(pkg.id === 'promotion' && {
                    gridColumn: '2',
                    textAlign: 'center',
                    alignItems: 'center',
                  }),
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
                    marginBottom: spacing.md,
                  }}
                >
                  {pkg.amount}
                </Typography>
                <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6, flex: 1 }}>
                  {pkg.description}
                </Typography>
              </div>
            );
          })}
        </div>
      </section>

      {/* Investor Return */}
      <section
        style={{
          padding: `${spacing.xxl} ${spacing.xl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center' }}>
          Investor Return
        </Typography>
        <Typography
          variant="body"
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            maxWidth: CONTENT_MEDIUM,
            margin: `0 auto ${spacing.xxl} auto`,
          }}
        >
          Revenue share keeps you aligned with growth. No equity dilution — founder retains full control.
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          {[
            { icon: Shield, label: 'Instrument', value: 'Revenue share agreement (no equity dilution)' },
            { icon: Percent, label: 'Repayment', value: '10–15% of monthly revenue until 1.5× investment repaid' },
            { icon: Target, label: 'Cap', value: 'Total repayment capped at 1.5× (e.g. €7,500 for €5,000)' },
            { icon: Zap, label: 'Founder control', value: '100% ownership retained; no voting rights, no board seat' },
          ].map((t) => {
            const IconComponent = t.icon;
            return (
              <div
                key={t.label}
                style={{
                  display: 'flex',
                  gap: spacing.lg,
                  padding: spacing.xl,
                  borderRadius: borderRadius.xl,
                  background: colors.glass.light,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.glass.border}`,
                  boxShadow: `0 8px 32px ${colors.accent.primary}25`,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: borderRadius.full,
                    background: colors.gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <IconComponent size={24} color={colors.text.onDark} strokeWidth={2} />
                </div>
                <div>
                  <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                    {t.label}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
                    {t.value}
                  </Typography>
                </div>
              </div>
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
          padding: `${spacing.xxl} ${spacing.xl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center' }}>
          Other Ways to Earn
        </Typography>
        <Typography
          variant="body"
          style={{
            color: colors.text.secondary,
            textAlign: 'center',
            maxWidth: CONTENT_MEDIUM,
            margin: `0 auto ${spacing.xxl} auto`,
          }}
        >
          Clear numbers. Passive income. Limited partner slots — one-time opportunity to get in early.
        </Typography>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing.xl,
          }}
        >
          {OTHER_WAYS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                style={{
                  padding: spacing.xl,
                  borderRadius: borderRadius.xl,
                  background: colors.glass.light,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.glass.border}`,
                  boxShadow: `0 8px 32px ${colors.accent.primary}25`,
                  display: 'flex',
                  gap: spacing.lg,
                  alignItems: 'flex-start',
                }}
              >
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
                <div>
                  <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Payment Options - Simplified */}
      <section
        style={{
          padding: `${spacing.xxl} ${spacing.xl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            background: colors.glass.light,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${colors.glass.border}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
            Payment terms (fiat, stablecoins, escrow) discussed per package.
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

      {/* CTA - Innerflect branded */}
      <section
        style={{
          padding: `${spacing.xxxl} ${spacing.xl}`,
          textAlign: 'center',
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography
          variant="body"
          style={{
            color: colors.text.secondary,
            marginBottom: spacing.lg,
            fontSize: '15px',
          }}
        >
          waQup is built by Innerflect
        </Typography>
        <a
          href={INNERFLECT_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          <Button
            variant="outline"
            size="lg"
            style={{
              borderColor: colors.glass.border,
              background: colors.glass.transparent,
              padding: `${spacing.lg} ${spacing.xxl}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.md,
              color: colors.text.primary,
              fontWeight: 500,
            }}
          >
            Ask us to work with you
          </Button>
        </a>
        <Typography
          variant="small"
          style={{
            color: colors.text.tertiary,
            marginTop: spacing.sm,
            display: 'block',
          }}
        >
          innerflect.tech
        </Typography>
      </section>
    </PageShell>
  );
}
