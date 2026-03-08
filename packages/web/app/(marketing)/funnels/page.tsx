'use client';

import React from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing } from '@/theme';
import { CONTENT_MAX_WIDTH } from '@/theme';
import Link from 'next/link';
import {
  TrendingUp,
  Target,
  Users,
  ArrowRight,
  BarChart3,
  Zap,
  Repeat,
} from 'lucide-react';

const funnelStages = [
  { stage: 'Awareness', desc: 'Landing page, social, content', metric: 'Visitors' },
  { stage: 'Consideration', desc: 'How it works, pricing', metric: 'Leads' },
  { stage: 'Trial / Signup', desc: 'Free signup, onboarding', metric: 'Signups' },
  { stage: 'Conversion', desc: 'First content, credits purchase', metric: 'Customers' },
  { stage: 'Retention', desc: 'Daily use, referrals', metric: 'LTV' },
];

const waqupFunnel = [
  { step: 1, name: 'Landing', path: '/', conversion: '100%' },
  { step: 2, name: 'How It Works', path: '/how-it-works', conversion: '~15%' },
  { step: 3, name: 'Pricing', path: '/pricing', conversion: '~25%' },
  { step: 4, name: 'Sign Up', path: '/signup', conversion: '~10%' },
  { step: 5, name: 'Onboarding', path: '/onboarding', conversion: '~80%' },
  { step: 6, name: 'First Content', path: '/sanctuary', conversion: '~50%' },
  { step: 7, name: 'Credits Purchase', path: '/sanctuary/credits', conversion: '~5–15%' },
];

const roiDrivers = [
  { icon: Target, title: 'Personalization', desc: 'Define ideal customer profile; avoid broad segments. Use behavioral data to personalize at each stage.' },
  { icon: Repeat, title: 'Retargeting', desc: 'Up to 7x more effective than new campaigns. Re-engage visitors who did not convert.' },
  { icon: Zap, title: 'Lower CAC', desc: 'Optimize funnel stages to reduce customer acquisition cost without increasing ad spend.' },
  { icon: BarChart3, title: 'Track Metrics', desc: 'Monitor conversion rates, velocity between stages, and CAC to find revenue leaks.' },
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

  return (
    <PageShell intensity="medium" bare>
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: spacing.xl }}>
        <div style={{ marginBottom: spacing.xxl, textAlign: 'center' }}>
          <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
            Sales Funnels & ROI
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Funnel stages, conversion optimization, and ROI drivers for waQup
          </Typography>
        </div>

        <section style={{ marginBottom: spacing.xxl }}>
          <Typography variant="h2" style={{ marginBottom: spacing.md, color: colors.text.primary }}>
            Funnel Stages
          </Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: spacing.md,
            }}
          >
            {funnelStages.map((item, i) => (
              <div
                key={item.stage}
                style={{
                  padding: spacing.md,
                  borderRadius: 8,
                  border: `1px solid ${colors.glass.border}`,
                  background: colors.glass.opaque,
                }}
              >
                <div style={{ color: colors.accent.tertiary, marginBottom: spacing.xs }}>{i + 1}</div>
                <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem' }}>
                  {item.stage}
                </Typography>
                <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '13px', marginTop: spacing.xs }}>
                  {item.desc}
                </Typography>
                <Typography variant="caption" style={{ color: colors.accent.primary, marginTop: spacing.sm }}>
                  {item.metric}
                </Typography>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: spacing.xxl }}>
          <Typography variant="h2" style={{ marginBottom: spacing.md, color: colors.text.primary }}>
            waQup Funnel
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Customer journey from landing to first purchase
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {waqupFunnel.map((item, i) => (
              <div
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.md,
                  padding: spacing.sm,
                  borderRadius: 8,
                  border: `1px solid ${colors.glass.border}`,
                  background: colors.glass.opaque,
                }}
              >
                <span style={{ color: colors.accent.tertiary, fontWeight: 600 }}>{item.step}</span>
                <Link href={item.path} style={{ color: colors.accent.primary, textDecoration: 'none' }}>
                  {item.name}
                </Link>
                <ArrowRight className="w-4 h-4" style={{ color: colors.text.tertiary }} />
                <span style={{ color: colors.text.secondary, fontSize: '13px' }}>{item.conversion}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: spacing.xxl }}>
          <Typography variant="h2" style={{ marginBottom: spacing.md, color: colors.text.primary }}>
            Conversion Benchmarks
          </Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: spacing.md,
            }}
          >
            {benchmarks.map((b) => (
              <div
                key={b.model}
                style={{
                  padding: spacing.md,
                  borderRadius: 8,
                  border: `1px solid ${colors.glass.border}`,
                  background: colors.glass.opaque,
                }}
              >
                <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '0.95rem' }}>
                  {b.model}
                </Typography>
                <Typography variant="body" style={{ color: colors.accent.tertiary, marginTop: spacing.xs }}>
                  {b.range}
                </Typography>
                <Typography variant="caption" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
                  {b.note}
                </Typography>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: spacing.xxl }}>
          <Typography variant="h2" style={{ marginBottom: spacing.md, color: colors.text.primary }}>
            ROI Drivers
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {roiDrivers.map((d) => (
              <div
                key={d.title}
                style={{
                  display: 'flex',
                  gap: spacing.md,
                  padding: spacing.md,
                  borderRadius: 8,
                  border: `1px solid ${colors.glass.border}`,
                  background: colors.glass.opaque,
                }}
              >
                <d.icon className="w-6 h-6 flex-shrink-0" style={{ color: colors.accent.primary }} />
                <div>
                  <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1rem' }}>
                    {d.title}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '14px', marginTop: spacing.xs }}>
                    {d.desc}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Typography variant="h2" style={{ marginBottom: spacing.md, color: colors.text.primary }}>
            Key Metrics
          </Typography>
          <ul style={{ color: colors.text.secondary, paddingLeft: spacing.lg, lineHeight: 1.8 }}>
            <li>Visitor-to-lead conversion rate</li>
            <li>Lead-to-customer conversion rate</li>
            <li>Velocity between funnel stages</li>
            <li>Customer acquisition cost (CAC)</li>
            <li>Customer lifetime value (LTV)</li>
            <li>Churn rate</li>
          </ul>
        </section>

        <div style={{ marginTop: spacing.xxl, textAlign: 'center' }}>
          <Link href="/pricing">
            <Button variant="primary" style={{ background: colors.gradients.primary }}>
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
