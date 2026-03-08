'use client';

import React from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing } from '@/theme';
import { CONTENT_MAX_WIDTH } from '@/theme';
import Link from 'next/link';
import {
  Shield,
  TrendingUp,
  Banknote,
  Zap,
  FileText,
  Lock,
  Percent,
} from 'lucide-react';

const useOfFunds = [
  { item: 'Development completion', amount: '~€800' },
  { item: '6–12 months running costs', amount: '~€700' },
  { item: 'Hosting, APIs, infra', amount: 'Included' },
];

const terms = [
  { label: 'Instrument', value: 'Revenue share agreement (no equity dilution)' },
  { label: 'Repayment', value: '10–15% of monthly revenue until 1.5× investment repaid' },
  { label: 'Cap', value: 'Total repayment capped at 1.5× (e.g. €2,250 for €1,500)' },
  { label: 'Founder control', value: '100% ownership retained; no voting rights, no board seat' },
  { label: 'Promotion upside', value: 'Optional: 5% of LTV for 12 months on referred customers' },
];

const paymentOptions = [
  { method: 'Fiat (Stripe)', desc: 'Bank transfer, card. Simple, familiar, instant.' },
  { method: 'Stablecoins (USDC/USDT)', desc: 'Predictable value. Convert to fiat for ops.' },
  { method: 'Escrow', desc: 'Non-custodial escrow (e.g. BitEscrow, LiquidTrust) holds funds until milestones.' },
];

export default function InvestorsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium" bare>
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: spacing.xl }}>
        <div style={{ marginBottom: spacing.xxl, textAlign: 'center' }}>
          <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
            Investor Proposition
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Revenue share, founder protection, and payment options
          </Typography>
        </div>

        <section style={{ marginBottom: spacing.xxl }}>
          <Typography variant="h2" style={{ marginBottom: spacing.md, color: colors.text.primary }}>
            What is waQup?
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.7 }}>
            waQup is a voice-first wellness app for personalized affirmations, meditations, and rituals.
            We are in late development: core flows exist; we need capital to finish the product and cover
            running costs for 6–12 months.
          </Typography>
        </section>

        <section style={{ marginBottom: spacing.xxl }}>
          <Typography variant="h2" style={{ marginBottom: spacing.md, color: colors.text.primary }}>
            Use of Funds (€1,500)
          </Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: spacing.md,
            }}
          >
            {useOfFunds.map((u) => (
              <div
                key={u.item}
                style={{
                  padding: spacing.md,
                  borderRadius: 8,
                  border: `1px solid ${colors.glass.border}`,
                  background: colors.glass.opaque,
                }}
              >
                <Typography variant="body" style={{ color: colors.text.primary }}>{u.item}</Typography>
                <Typography variant="h3" style={{ color: colors.accent.tertiary, marginTop: spacing.xs }}>
                  {u.amount}
                </Typography>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: spacing.xxl }}>
          <Typography variant="h2" style={{ marginBottom: spacing.md, color: colors.text.primary }}>
            Investment Terms
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Revenue share keeps you aligned with growth while the founder retains full control.
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {terms.map((t) => (
              <div
                key={t.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: spacing.md,
                  padding: spacing.md,
                  borderRadius: 8,
                  border: `1px solid ${colors.glass.border}`,
                  background: colors.glass.opaque,
                }}
              >
                <Typography variant="body" style={{ color: colors.text.secondary, fontWeight: 600 }}>
                  {t.label}
                </Typography>
                <Typography variant="body" style={{ color: colors.text.primary, textAlign: 'right' }}>
                  {t.value}
                </Typography>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: spacing.xxl }}>
          <Typography variant="h2" style={{ marginBottom: spacing.md, color: colors.text.primary }}>
            Payment Options
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            We accept both fiat and crypto. Crypto payments use stablecoins and optional escrow for safety.
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {paymentOptions.map((p) => (
              <div
                key={p.method}
                style={{
                  display: 'flex',
                  gap: spacing.md,
                  padding: spacing.md,
                  borderRadius: 8,
                  border: `1px solid ${colors.glass.border}`,
                  background: colors.glass.opaque,
                }}
              >
                <Banknote className="w-5 h-5 flex-shrink-0" style={{ color: colors.accent.primary }} />
                <div>
                  <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem' }}>
                    {p.method}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '14px', marginTop: spacing.xs }}>
                    {p.desc}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            padding: spacing.lg,
            borderRadius: 8,
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
        </section>

        <div style={{ marginTop: spacing.xxl, textAlign: 'center' }}>
          <Link href="/how-it-works">
            <Button variant="primary" style={{ background: colors.gradients.primary }}>
              Learn About waQup
            </Button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
