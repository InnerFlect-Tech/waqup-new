'use client';

import React from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH, CONTENT_MEDIUM } from '@/theme';
import Link from 'next/link';
import {
  Shield,
  TrendingUp,
  Banknote,
  Zap,
  ChevronRight,
  Sparkles,
  PieChart,
  Target,
  Lock,
  Percent,
} from 'lucide-react';

const useOfFunds = [
  { item: 'Development completion', amount: '~€800', pct: 53, color: 'primary' },
  { item: '6–12 months running costs', amount: '~€700', pct: 47, color: 'secondary' },
];

const terms = [
  {
    icon: Shield,
    label: 'Instrument',
    value: 'Revenue share agreement (no equity dilution)',
  },
  {
    icon: Percent,
    label: 'Repayment',
    value: '10–15% of monthly revenue until 1.5× investment repaid',
  },
  {
    icon: Target,
    label: 'Cap',
    value: 'Total repayment capped at 1.5× (e.g. €2,250 for €1,500)',
  },
  {
    icon: Zap,
    label: 'Founder control',
    value: '100% ownership retained; no voting rights, no board seat',
  },
  {
    icon: TrendingUp,
    label: 'Promotion upside',
    value: 'Optional: 5% of LTV for 12 months on referred customers',
  },
];

const paymentOptions = [
  {
    icon: Banknote,
    method: 'Fiat (Stripe)',
    desc: 'Bank transfer, card. Simple, familiar, instant.',
    color: 'primary',
  },
  {
    icon: PieChart,
    method: 'Stablecoins (USDC/USDT)',
    desc: 'Predictable value. Convert to fiat for ops.',
    color: 'secondary',
  },
  {
    icon: Lock,
    method: 'Escrow',
    desc: 'Non-custodial escrow holds funds until milestones.',
    color: 'tertiary',
  },
];

function DonutChart({
  segments,
  colors,
  size = 160,
}: {
  segments: { pct: number; color: string }[];
  colors: { accent: { primary: string; secondary: string; tertiary: string } };
  size?: number;
}) {
  const accentMap: Record<string, string> = {
    primary: colors.accent.primary,
    secondary: colors.accent.secondary,
    tertiary: colors.accent.tertiary,
  };
  const r = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  let offset = 0;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {segments.map((seg, i) => {
        const pct = seg.pct / 100;
        const dashArray = 2 * Math.PI * r * pct;
        const dashOffset = -2 * Math.PI * r * offset;
        offset += pct;
        const stroke = accentMap[seg.color] || colors.accent.primary;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={stroke}
            strokeWidth={16}
            strokeDasharray={`${dashArray} ${2 * Math.PI * r}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r - 12} fill="transparent" />
    </svg>
  );
}

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
          <Typography variant="smallBold" style={{ color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Revenue Share
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
          Revenue share, founder protection, and flexible payment options — no equity dilution
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
            waQup is a voice-first wellness app for personalized affirmations, meditations, and rituals.
            We are in late development: core flows exist; we need capital to finish the product and cover
            running costs for 6–12 months.
          </Typography>
        </div>
      </section>

      {/* Use of Funds - with Donut Chart */}
      <section
        style={{
          padding: `${spacing.xxl} ${spacing.xl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center' }}>
          Use of Funds (€1,500)
        </Typography>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.xxl,
            padding: spacing.xxl,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${colors.glass.border}`,
            boxShadow: `0 16px 64px ${colors.accent.primary}30`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xxl, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DonutChart segments={useOfFunds.map((u) => ({ pct: u.pct, color: u.color }))} colors={colors} />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h1" style={{ color: colors.text.primary, fontSize: '28px', fontWeight: 700 }}>
                  €1,500
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary }}>Total raise</Typography>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, minWidth: 260 }}>
              {useOfFunds.map((u) => {
                const accent = accentMap[u.color as keyof typeof accentMap] || colors.accent.primary;
                return (
                  <div
                    key={u.item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: spacing.lg,
                      borderRadius: borderRadius.lg,
                      background: `${accent}15`,
                      border: `1px solid ${accent}30`,
                    }}
                  >
                    <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 500 }}>
                      {u.item}
                    </Typography>
                    <Typography variant="h4" style={{ color: accent, fontWeight: 700 }}>
                      {u.amount}
                    </Typography>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Investment Terms */}
      <section
        style={{
          padding: `${spacing.xxl} ${spacing.xl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center' }}>
          Investment Terms
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
          Revenue share keeps you aligned with growth while the founder retains full control.
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg }}>
          {terms.map((t) => {
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
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${colors.accent.primary}35`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 8px 32px ${colors.accent.primary}25`;
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
                <div style={{ flex: 1 }}>
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
      </section>

      {/* Payment Options */}
      <section
        style={{
          padding: `${spacing.xxl} ${spacing.xl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        <Typography variant="h2" style={{ marginBottom: spacing.lg, color: colors.text.primary, textAlign: 'center' }}>
          Payment Options
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
          We accept both fiat and crypto. Crypto payments use stablecoins and optional escrow for safety.
        </Typography>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing.xl,
          }}
        >
          {paymentOptions.map((p) => {
            const IconComponent = p.icon;
            const accent = accentMap[p.color as keyof typeof accentMap] || colors.accent.primary;
            return (
              <div
                key={p.method}
                style={{
                  padding: spacing.xl,
                  borderRadius: borderRadius.xl,
                  background: colors.glass.light,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.glass.border}`,
                  boxShadow: `0 8px 32px ${colors.accent.primary}25`,
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
                <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
                  {p.method}
                </Typography>
                <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
                  {p.desc}
                </Typography>
              </div>
            );
          })}
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
            This page is for informational purposes only and does not constitute financial or legal advice.
            A formal revenue share agreement, drafted by a lawyer, is required before any investment.
            Crypto payments carry regulatory and volatility risks; consult a professional before investing.
          </Typography>
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
        <Link href="/how-it-works" style={{ textDecoration: 'none' }}>
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
            Learn About waQup
            <ChevronRight size={20} color={colors.text.onDark} />
          </Button>
        </Link>
      </section>
    </PageShell>
  );
}
