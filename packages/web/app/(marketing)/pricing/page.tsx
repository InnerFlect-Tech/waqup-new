'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Sparkles, Infinity, Zap, ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';
import { useTheme, spacing, borderRadius, CONTENT_MAX_WIDTH } from '@/theme';
import { Typography, Button, PageShell, QCoin } from '@/components';
import { PLANS, type PlanId } from '@waqup/shared/constants';

const STRIPE_PRICE_IDS: Record<PlanId, string> = {
  starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
  growth: process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID || '',
  devotion: process.env.NEXT_PUBLIC_STRIPE_DEVOTION_PRICE_ID || '',
};

const HOW_QS_WORK = [
  {
    icon: Zap,
    title: 'Qs power creation',
    body: 'Every affirmation, meditation, or ritual you create consumes Qs. The deeper the work, the more they cost.',
  },
  {
    icon: Infinity,
    title: 'Practice is always free',
    body: 'Replay your content as many times as you want. Qs are only used when you create something new.',
  },
  {
    icon: Sparkles,
    title: 'Credits never expire',
    body: 'Unused Qs carry forward indefinitely. Your creative momentum is never lost.',
  },
];

function PlanCard({
  plan,
  loading,
  onCheckout,
}: {
  plan: (typeof PLANS)[number];
  loading: boolean;
  onCheckout: () => void;
}) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const isPopular = plan.badge === 'Most Popular';
  const isDevotionTier = plan.id === 'devotion';

  const cardBackground = isDevotionTier
    ? `linear-gradient(145deg, #1a0533 0%, #0d0118 60%, #1a0533 100%)`
    : isPopular
      ? `linear-gradient(145deg, ${colors.accent.primary}22, ${colors.accent.secondary}12)`
      : colors.glass.light;

  const cardBorder = isDevotionTier
    ? `1px solid rgba(168, 85, 247, 0.5)`
    : isPopular
      ? `1px solid ${colors.accent.primary}60`
      : `1px solid ${colors.glass.border}`;

  const cardShadow = isDevotionTier
    ? `0 24px 80px rgba(168, 85, 247, 0.25), 0 0 0 1px rgba(168, 85, 247, 0.1) inset`
    : isPopular
      ? `0 20px 60px ${colors.accent.primary}20`
      : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: plan.id === 'starter' ? 0 : plan.id === 'growth' ? 0.08 : 0.16 }}
      style={{
        position: 'relative',
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
        background: cardBackground,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: cardBorder,
        boxShadow: cardShadow,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Popular badge */}
      {isPopular && !isDevotionTier && (
        <div
          style={{
            position: 'absolute',
            top: -1,
            left: '50%',
            transform: 'translateX(-50%)',
            background: colors.gradients.primary,
            padding: `${spacing.xs} ${spacing.lg}`,
            borderRadius: `0 0 ${borderRadius.md}px ${borderRadius.md}px`,
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Most popular
        </div>
      )}

      {/* Devotion ambient glow */}
      {isDevotionTier && (
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Plan name + description */}
      <div style={{ marginBottom: spacing.lg, marginTop: isPopular ? spacing.md : 0 }}>
        {isDevotionTier && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              marginBottom: spacing.sm,
              padding: `3px ${spacing.sm}`,
              borderRadius: borderRadius.full,
              background: 'rgba(168,85,247,0.15)',
              border: '1px solid rgba(168,85,247,0.3)',
              fontSize: 11,
              fontWeight: 600,
              color: '#C084FC',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <Flame size={11} />
            For committed practitioners
          </div>
        )}
        <Typography
          variant="h3"
          style={{
            color: isDevotionTier ? '#E9D5FF' : colors.text.primary,
            fontWeight: isDevotionTier ? 300 : 300,
            marginBottom: spacing.sm,
            letterSpacing: isDevotionTier ? '-0.02em' : undefined,
          }}
        >
          {plan.name}
        </Typography>
        <Typography
          variant="small"
          style={{
            color: isDevotionTier ? 'rgba(233,213,255,0.65)' : colors.text.secondary,
            lineHeight: 1.55,
          }}
        >
          {isDevotionTier
            ? 'Not a plan. A commitment. Built for those who show up daily with precision and intention.'
            : plan.description}
        </Typography>
      </div>

      {/* Price block */}
      <div style={{ marginBottom: spacing.lg }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: spacing.xs, marginBottom: 4 }}>
          <span
            style={{
              fontSize: 40,
              fontWeight: 200,
              color: isDevotionTier ? '#E9D5FF' : colors.text.primary,
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            €{plan.price}
          </span>
          <span
            style={{
              fontSize: 14,
              color: isDevotionTier ? 'rgba(233,213,255,0.5)' : colors.text.secondary,
              marginBottom: 6,
            }}
          >
            /{plan.billingCycle}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <QCoin size="sm" />
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: isDevotionTier ? '#C084FC' : colors.accent.primary,
            }}
          >
            {plan.creditsPerPeriod} Qs
          </span>
          <span
            style={{
              fontSize: 13,
              color: isDevotionTier ? 'rgba(233,213,255,0.45)' : colors.text.secondary,
            }}
          >
            per {plan.billingCycle}
          </span>
        </div>
        {plan.trialDays && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              marginTop: spacing.sm,
              padding: `3px ${spacing.sm}`,
              borderRadius: borderRadius.full,
              background: isDevotionTier ? 'rgba(52,211,153,0.1)' : `${colors.success}18`,
              border: `1px solid ${isDevotionTier ? 'rgba(52,211,153,0.25)' : `${colors.success}30`}`,
              fontSize: 12,
              fontWeight: 500,
              color: '#34d399',
            }}
          >
            <Sparkles size={11} />
            {plan.trialDays}-day free trial
          </div>
        )}
      </div>

      {/* Feature list */}
      <ul style={{ listStyle: 'none', padding: 0, margin: `0 0 ${spacing.xl} 0`, flex: 1 }}>
        {plan.features.map((feature) => (
          <li
            key={feature}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              marginBottom: 10,
            }}
          >
            <Check
              size={14}
              color={isDevotionTier ? '#C084FC' : colors.accent.primary}
              strokeWidth={2.5}
              style={{ flexShrink: 0 }}
            />
            <Typography
              variant="small"
              style={{
                color: isDevotionTier ? 'rgba(233,213,255,0.75)' : colors.text.secondary,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {feature}
            </Typography>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        variant={isPopular || isDevotionTier ? 'primary' : 'outline'}
        size="lg"
        fullWidth
        loading={loading}
        onClick={onCheckout}
        style={
          isDevotionTier
            ? { background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #4C1D95 100%)', border: 'none' }
            : isPopular
              ? { background: colors.gradients.primary }
              : { borderColor: `${colors.accent.primary}50` }
        }
      >
        {isDevotionTier ? 'Commit to Devotion' : plan.ctaLabel}
      </Button>

      {plan.trialDays && (
        <Typography
          variant="small"
          style={{
            color: isDevotionTier ? 'rgba(233,213,255,0.35)' : colors.text.tertiary,
            textAlign: 'center',
            marginTop: spacing.sm,
            fontSize: 11,
          }}
        >
          No charge for {plan.trialDays} days. Cancel anytime.
        </Typography>
      )}
    </motion.div>
  );
}

export default function PricingPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (planId: PlanId) => {
    const priceId = STRIPE_PRICE_IDS[planId];
    if (!priceId) {
      setError('Checkout is not yet configured for this plan. Please contact support.');
      return;
    }

    try {
      setLoading(planId);
      setError(null);

      const res = await fetch('/api/stripe/checkout/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, planId }),
      });

      if (res.status === 401) {
        router.push('/login?redirect=/pricing');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to start checkout');
      }

      const { url } = await res.json();
      if (!url) throw new Error('No checkout URL returned');

      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <PageShell intensity="medium" bare>
      <div
        style={{
          padding: `${spacing.xxl} ${spacing.xl} ${spacing.xxl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: spacing.xxl }}
        >
          <Typography
            variant="h1"
            style={{
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 200,
              color: colors.text.primary,
              marginBottom: spacing.md,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Build a practice that changes you
          </Typography>
          <Typography
            variant="body"
            style={{
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              color: colors.text.secondary,
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            Subscriptions give you a monthly rhythm of Qs to create affirmations, meditations, and
            rituals. Practice is always free.
          </Typography>
        </motion.div>

        {/* Pricing grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing.xl,
            marginBottom: spacing.xxl,
            alignItems: 'start',
          }}
        >
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              loading={loading === plan.id}
              onCheckout={() => handleCheckout(plan.id)}
            />
          ))}
        </div>

        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              marginBottom: spacing.xl,
              padding: spacing.md,
              background: `${colors.error}15`,
              borderRadius: borderRadius.md,
              border: `1px solid ${colors.error}30`,
            }}
          >
            <Typography variant="small" style={{ color: colors.error }}>
              {error}
            </Typography>
          </motion.div>
        )}

        {/* How Qs work */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: spacing.xxl }}
        >
          <Typography
            variant="small"
            style={{
              textAlign: 'center',
              color: colors.text.secondary,
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: spacing.xl,
            }}
          >
            How Qs work
          </Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: spacing.lg,
            }}
          >
            {HOW_QS_WORK.map((item) => (
              <div
                key={item.title}
                style={{
                  padding: spacing.lg,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `1px solid ${colors.glass.border}`,
                  display: 'flex',
                  gap: spacing.md,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: borderRadius.md,
                    background: `${colors.accent.primary}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <item.icon size={16} color={colors.accent.primary} strokeWidth={1.5} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: colors.text.primary, marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 13, color: colors.text.secondary, lineHeight: 1.55 }}>
                    {item.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: spacing.md,
          }}
        >
          <Typography variant="small" style={{ color: colors.text.tertiary, fontSize: 13 }}>
            Prefer to buy Qs without a subscription?
          </Typography>
          <Link href="/get-qs" style={{ textDecoration: 'none' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                color: colors.accent.tertiary,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Browse one-time Q packs
              <ArrowRight size={14} />
            </span>
          </Link>
        </motion.div>
      </div>
    </PageShell>
  );
}
