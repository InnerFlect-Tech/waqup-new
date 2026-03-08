'use client';

import React from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH, CONTENT_MEDIUM } from '@/theme';
import Link from 'next/link';
import {
  TrendingUp,
  Target,
  ArrowRight,
  BarChart3,
  Zap,
  Repeat,
  Share2,
  Store,
  Gift,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const funnelStages = [
  { stage: 'Awareness', desc: 'Landing page, social, content', metric: 'Visitors', color: 'primary' },
  { stage: 'Consideration', desc: 'How it works, pricing', metric: 'Leads', color: 'secondary' },
  { stage: 'Trial / Signup', desc: 'Free signup, onboarding', metric: 'Signups', color: 'tertiary' },
  { stage: 'Conversion', desc: 'First content, Qs purchase', metric: 'Customers', color: 'primary' },
  { stage: 'Retention', desc: 'Daily use, referrals', metric: 'LTV', color: 'secondary' },
];

const mainFunnelSteps = [
  { step: 1, name: 'Landing', path: '/', conversion: '100%', width: 100 },
  { step: 2, name: 'How It Works', path: '/how-it-works', conversion: '~15%', width: 15 },
  { step: 3, name: 'Pricing', path: '/pricing', conversion: '~25%', width: 25 },
  { step: 4, name: 'Sign Up', path: '/join', conversion: '~10%', width: 10 },
  { step: 5, name: 'Onboarding', path: '/sanctuary', conversion: '~80%', width: 80 },
  { step: 6, name: 'First Content', path: '/sanctuary', conversion: '~50%', width: 50 },
  { step: 7, name: 'Credits', path: '/sanctuary/credits', conversion: '~5–15%', width: 10 },
];

const roiDrivers = [
  {
    icon: Target,
    title: 'Personalization',
    desc: 'Define ideal customer profile; use behavioral data to personalize at each stage.',
  },
  {
    icon: Repeat,
    title: 'Retargeting',
    desc: 'Up to 7x more effective than new campaigns. Re-engage visitors who did not convert.',
  },
  {
    icon: Zap,
    title: 'Lower CAC',
    desc: 'Optimize funnel stages to reduce customer acquisition cost without increasing ad spend.',
  },
  {
    icon: BarChart3,
    title: 'Track Metrics',
    desc: 'Monitor conversion rates, velocity between stages, and CAC to find revenue leaks.',
  },
];

const profitablePaths = [
  {
    icon: Share2,
    title: 'Referral Loop',
    desc: 'User shares link → Friend signs up → Both earn 10 Qs. Viral coefficient & LTV boost.',
    highlight: 'High margin',
    color: 'tertiary',
  },
  {
    icon: Repeat,
    title: 'Retention & Streaks',
    desc: 'Daily practice builds habits → Streaks unlock rewards → More content creation.',
    highlight: 'Recurring revenue',
    color: 'primary',
  },
  {
    icon: Store,
    title: 'Marketplace (Future)',
    desc: 'Creators publish content → Others discover & buy → 70/30 revenue split.',
    highlight: 'Network effects',
    color: 'secondary',
  },
  {
    icon: Gift,
    title: 'Credits Upsell',
    desc: 'First content hooks → Credits run low → Timely prompts drive repurchase.',
    highlight: 'Conversion lever',
    color: 'tertiary',
  },
];

const benchmarks = [
  { model: 'Freemium', range: '1–10%', note: 'Visitor to lead' },
  { model: 'Free trial (CC required)', range: '~25%', note: 'Trial to paid' },
  { model: 'Free trial (no CC)', range: 'Higher', note: 'More signups, lower conversion' },
  { model: 'B2B SaaS (top)', range: '~11.7%', note: 'Visitor to lead when stages defined' },
];

export default function FunnelsPage() {
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
          <Typography variant="smallBold" style={{ color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Growth & ROI
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
          Sales Funnels & User Flow
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
          Funnel stages, conversion optimization, and profitable growth paths for waQup
        </Typography>
      </section>

      {/* Visual Funnel Diagram */}
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
            color: colors.text.primary,
            marginBottom: spacing.lg,
            textAlign: 'center',
            fontSize: 'clamp(24px, 4vw, 32px)',
          }}
        >
          waQup User Flow
        </Typography>
        <Typography
          variant="body"
          style={{
            color: colors.text.secondary,
            marginBottom: spacing.xxl,
            textAlign: 'center',
            maxWidth: CONTENT_MEDIUM,
            margin: '0 auto',
          }}
        >
          Customer journey from landing to first purchase — with conversion rates at each stage
        </Typography>

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {mainFunnelSteps.map((item, i) => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, flexWrap: 'wrap' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: borderRadius.full,
                    background: colors.gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${colors.accent.primary}50`,
                  }}
                >
                  <Typography variant="smallBold" style={{ color: colors.text.onDark, fontSize: '14px' }}>
                    {item.step}
                  </Typography>
                </div>
                <Link
                  href={item.path}
                  style={{
                    minWidth: 140,
                    color: colors.accent.primary,
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '15px',
                  }}
                >
                  {item.name}
                </Link>
                <div
                  style={{
                    flex: 1,
                    minWidth: 120,
                    height: 28,
                    borderRadius: borderRadius.md,
                    background: `${colors.accent.primary}15`,
                    border: `1px solid ${colors.accent.primary}30`,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'stretch',
                  }}
                >
                  <div
                    style={{
                      width: `${item.width}%`,
                      minWidth: item.width > 5 ? undefined : 4,
                      background: colors.gradients.primary,
                      borderRadius: borderRadius.md,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
                <Typography variant="smallBold" style={{ color: colors.accent.tertiary, minWidth: 56 }}>
                  {item.conversion}
                </Typography>
                {i < mainFunnelSteps.length - 1 && (
                  <ArrowRight size={18} color={colors.text.tertiary} style={{ opacity: 0.5 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profitable Paths */}
      <section
        style={{
          padding: `${spacing.xxl} ${spacing.xl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
            <Sparkles size={24} color={colors.accent.tertiary} />
            <Typography variant="h2" style={{ color: colors.text.primary, fontSize: 'clamp(24px, 4vw, 32px)' }}>
              Profitable Growth Paths
            </Typography>
          </div>
          <Typography variant="body" style={{ color: colors.text.secondary, maxWidth: CONTENT_MEDIUM, margin: '0 auto' }}>
            Multiple revenue streams and viral loops beyond the core funnel
          </Typography>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing.xl,
          }}
        >
          {profitablePaths.map((path) => {
            const IconComponent = path.icon;
            const accent = accentMap[path.color as keyof typeof accentMap] || colors.accent.primary;
            return (
              <div
                key={path.title}
                style={{
                  padding: spacing.xl,
                  borderRadius: borderRadius.xl,
                  background: colors.glass.light,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.glass.border}`,
                  boxShadow: `0 8px 32px ${colors.accent.primary}30`,
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = `0 16px 48px ${accent}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 8px 32px ${colors.accent.primary}30`;
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: spacing.md,
                    right: spacing.md,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    borderRadius: borderRadius.full,
                    background: `${accent}25`,
                    border: `1px solid ${accent}50`,
                  }}
                >
                  <Typography variant="small" style={{ color: accent, fontWeight: 600, fontSize: '11px' }}>
                    {path.highlight}
                  </Typography>
                </div>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: borderRadius.full,
                    background: `${accent}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: spacing.lg,
                    border: `1px solid ${accent}40`,
                  }}
                >
                  <IconComponent size={28} color={accent} strokeWidth={2} />
                </div>
                <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontSize: '1.1rem' }}>
                  {path.title}
                </Typography>
                <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6, flex: 1 }}>
                  {path.desc}
                </Typography>
              </div>
            );
          })}
        </div>
      </section>

      {/* Funnel Stages */}
      <section
        style={{
          padding: `${spacing.xxl} ${spacing.xl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center' }}>
          Funnel Stages
        </Typography>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: spacing.lg,
          }}
        >
          {funnelStages.map((item, i) => {
            const accent = accentMap[item.color as keyof typeof accentMap] || colors.accent.primary;
            return (
              <div
                key={item.stage}
                style={{
                  padding: spacing.xl,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.glass.border}`,
                  boxShadow: `0 8px 32px ${colors.accent.primary}25`,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${accent}35`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 8px 32px ${colors.accent.primary}25`;
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: borderRadius.full,
                    background: `${accent}25`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: spacing.md,
                    border: `1px solid ${accent}40`,
                  }}
                >
                  <Typography variant="smallBold" style={{ color: accent }}>{i + 1}</Typography>
                </div>
                <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem', marginBottom: spacing.xs }}>
                  {item.stage}
                </Typography>
                <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '13px', marginBottom: spacing.sm }}>
                  {item.desc}
                </Typography>
                <Typography variant="caption" style={{ color: accent, fontWeight: 600 }}>
                  {item.metric}
                </Typography>
              </div>
            );
          })}
        </div>
      </section>

      {/* ROI Drivers */}
      <section
        style={{
          padding: `${spacing.xxl} ${spacing.xl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center' }}>
          ROI Drivers
        </Typography>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: spacing.lg,
          }}
        >
          {roiDrivers.map((d) => {
            const IconComponent = d.icon;
            return (
              <div
                key={d.title}
                style={{
                  display: 'flex',
                  gap: spacing.lg,
                  padding: spacing.xl,
                  borderRadius: borderRadius.lg,
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
                    boxShadow: `0 4px 12px ${colors.accent.primary}50`,
                  }}
                >
                  <IconComponent size={24} color={colors.text.onDark} strokeWidth={2} />
                </div>
                <div>
                  <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem', marginBottom: spacing.xs }}>
                    {d.title}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '14px', lineHeight: 1.5 }}>
                    {d.desc}
                  </Typography>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Conversion Benchmarks */}
      <section
        style={{
          padding: `${spacing.xxl} ${spacing.xl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center' }}>
          Conversion Benchmarks
        </Typography>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: spacing.lg,
          }}
        >
          {benchmarks.map((b) => (
            <div
              key={b.model}
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.lg,
                background: colors.glass.light,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${colors.glass.border}`,
                boxShadow: `0 8px 32px ${colors.accent.primary}25`,
              }}
            >
              <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '0.95rem', marginBottom: spacing.xs }}>
                {b.model}
              </Typography>
              <Typography variant="h4" style={{ color: colors.accent.tertiary, marginBottom: spacing.xs }}>
                {b.range}
              </Typography>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>
                {b.note}
              </Typography>
            </div>
          ))}
        </div>
      </section>

      {/* Key Metrics */}
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
          <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center' }}>
            Key Metrics to Track
          </Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: spacing.lg,
              alignItems: 'stretch',
            }}
          >
            {[
              'Visitor-to-lead conversion rate',
              'Lead-to-customer conversion rate',
              'Velocity between funnel stages',
              'Customer acquisition cost (CAC)',
              'Customer lifetime value (LTV)',
              'Churn rate',
            ].map((metric, i) => (
              <div
                key={metric}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: spacing.md,
                  borderRadius: borderRadius.md,
                  background: `${colors.accent.primary}10`,
                  border: `1px solid ${colors.accent.primary}20`,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: borderRadius.full,
                    background: colors.gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Typography variant="smallBold" style={{ color: colors.text.onDark, fontSize: '12px' }}>
                    {i + 1}
                  </Typography>
                </div>
                <Typography variant="body" style={{ color: colors.text.primary }}>
                  {metric}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: `${spacing.xxxl} ${spacing.xl}`,
          textAlign: 'center',
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Link href="/pricing" style={{ textDecoration: 'none' }}>
          <Button
            variant="primary"
            size="lg"
            style={{
              background: colors.gradients.primary,
              padding: `${spacing.lg} ${spacing.xxl}`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            View Pricing
            <ChevronRight size={20} color={colors.text.onDark} />
          </Button>
        </Link>
      </section>
    </PageShell>
  );
}
