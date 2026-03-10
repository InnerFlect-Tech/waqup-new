'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Infinity, Zap, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTheme, spacing, borderRadius, BLUR, CONTENT_MAX_WIDTH, PAGE_TOP_PADDING } from '@/theme';
import { Typography, Button, PageShell, QCoin } from '@/components';
import { PLANS, getPlanById, PRACTICE_IS_FREE_ONE_LINER, type PlanId } from '@waqup/shared/constants';
import { Analytics } from '@waqup/shared/utils';

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
    title: 'Qs never expire',
    body: 'Unused Qs carry forward indefinitely. Your creative momentum is never lost.',
  },
];

const BADGE_SLOT_HEIGHT = 48;
const DISCLAIMER_SLOT_HEIGHT = 36;

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

  const topBadge = isPopular
    ? 'Most popular'
    : isDevotionTier
      ? 'For committed practitioners'
      : null;

  const disclaimerText = isDevotionTier
    ? `No charge for ${plan.trialDays} days. Cancel anytime.`
    : plan.trialDays
      ? `No charge for ${plan.trialDays} days. Cancel anytime.`
      : 'Billed weekly. Cancel anytime.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: plan.id === 'starter' ? 0 : plan.id === 'growth' ? 0.08 : 0.16 }}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: borderRadius.xl,
        background: cardBackground,
        backdropFilter: BLUR.xl,
        WebkitBackdropFilter: BLUR.xl,
        border: cardBorder,
        boxShadow: cardShadow,
        overflow: 'hidden',
      }}
    >
      {/* Unified top badge slot — same height for all cards, inside card */}
      <div
        style={{
          minHeight: BADGE_SLOT_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: spacing.lg,
        }}
      >
        {topBadge && (
          <div
            style={{
              background: isDevotionTier ? 'rgba(168,85,247,0.2)' : colors.gradients.primary,
              padding: `${spacing.xs} ${spacing.lg}`,
              borderRadius: borderRadius.full,
              fontSize: 11,
              fontWeight: 700,
              color: isDevotionTier ? '#C084FC' : '#fff',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {topBadge}
          </div>
        )}
      </div>

      {/* Card content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: spacing.xl,
          paddingTop: spacing.sm,
        }}
      >
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
        <div style={{ marginBottom: spacing.lg }}>
          <Typography
            variant="h3"
            style={{
              color: isDevotionTier ? '#E9D5FF' : colors.text.primary,
              fontWeight: 300,
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
            {plan.description}
          </Typography>
        </div>

        {/* Price block — fixed structure for all */}
        <div style={{ marginBottom: spacing.lg, minHeight: 72 }}>
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

        {/* Feature list — flex: 1 pushes CTA to bottom */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, minHeight: 120 }}>
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

        {/* CTA block — marginTop auto + fixed disclaimer height for button alignment */}
        <div style={{ marginTop: 'auto', paddingTop: spacing.xl }}>
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

          <div
            style={{
              minHeight: DISCLAIMER_SLOT_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: spacing.sm,
            }}
          >
            <Typography
              variant="small"
              style={{
                color: isDevotionTier ? 'rgba(233,213,255,0.35)' : colors.text.tertiary,
                textAlign: 'center',
                margin: 0,
                fontSize: 11,
              }}
            >
              {disclaimerText}
            </Typography>
          </div>
        </div>
      </div>
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
        router.push('/login?next=/pricing');
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to start checkout');
      }

      const { url } = await res.json();
      if (!url) throw new Error('No checkout URL returned');

      const plan = getPlanById(planId);
      Analytics.paymentStarted('subscription', plan?.price ?? 0, plan?.currency ?? 'EUR');
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <PageShell intensity="medium" bare allowDocumentScroll>
      {/* Hero with contemplating sunset background */}
      <div
        style={{
          position: 'relative',
          minHeight: 'min(50dvh, 400px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/images/pricing-hero.png"
            alt=""
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center center' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(6,2,20,0.9) 0%, rgba(6,2,20,0.75) 100%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: `${spacing.xxl} ${spacing.xl}` }}
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
            rituals. {PRACTICE_IS_FREE_ONE_LINER}
          </Typography>
        </motion.div>
      </div>

      <div
        className="pricing-content"
        style={{
          padding: `${spacing.xxl} ${spacing.xl} ${spacing.xxl}`,
          maxWidth: CONTENT_MAX_WIDTH,
          margin: '0 auto',
        }}
      >
        {/* Pricing grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing.xl,
            marginBottom: spacing.xxl,
            alignItems: 'stretch',
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
                  backdropFilter: BLUR.lg,
                  WebkitBackdropFilter: BLUR.lg,
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
            marginBottom: spacing.xxl,
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

        {/* Competitive comparison — SEO: waQup vs Calm & Headspace */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginBottom: spacing.xxl }}
        >
          <Typography
            variant="h3"
            as="h2"
            style={{
              textAlign: 'center',
              color: colors.text.primary,
              fontSize: 22,
              fontWeight: 600,
              marginBottom: spacing.lg,
              letterSpacing: '-0.02em',
            }}
          >
            waQup vs Calm & Headspace
          </Typography>

          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: borderRadius.lg,
              overflow: 'hidden',
              marginBottom: spacing.lg,
            }}
          >
            <Image
              src="/images/pricing-comparison.png"
              alt="Generic meditation app (left) vs personalised waQup experience (right)"
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div
            style={{
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr',
                padding: `${spacing.lg} ${spacing.xl}`,
                background: `${colors.accent.primary}08`,
                borderBottom: `1px solid ${colors.glass.border}`,
                gap: spacing.md,
              }}
            >
              <div />
              <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
                Calm / Headspace
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.xs }}>
                <span
                  style={{
                    background: colors.gradients.primary,
                    padding: '2px 8px',
                    borderRadius: borderRadius.sm,
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.05em',
                  }}
                >
                  You
                </span>
                <Typography variant="small" style={{ color: colors.accent.primary, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>
                  waQup
                </Typography>
              </div>
            </div>

            {[
              { label: 'Content', other: 'Pre-made library', waQup: 'Yours — written for you' },
              { label: 'Voice', other: 'Celebrity or generic voices', waQup: 'Your voice or AI voice' },
              { label: 'Personalisation', other: 'Pre-set programs only', waQup: 'Every session, by design' },
              { label: 'Practice cost', other: '~$70/year subscription', waQup: 'Always free — no catch' },
              { label: 'Creation', other: 'Not available', waQup: 'Create anytime with Qs' },
            ].map((row, i, arr) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.04, duration: 0.25 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 1fr 1fr',
                  padding: `${spacing.lg} ${spacing.xl}`,
                  borderBottom: i < arr.length - 1 ? `1px solid ${colors.glass.border}` : undefined,
                  gap: spacing.md,
                  alignItems: 'center',
                  minHeight: 52,
                }}
              >
                <Typography variant="small" style={{ color: colors.text.primary, fontWeight: 600, fontSize: 14 }}>
                  {row.label}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <X size={14} color={colors.text.tertiary} strokeWidth={2} style={{ flexShrink: 0, opacity: 0.8 }} />
                  <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12, textAlign: 'center', lineHeight: 1.4 }}>
                    {row.other}
                  </Typography>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Check size={14} color={colors.accent.primary} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <Typography variant="small" style={{ color: colors.text.primary, fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>
                    {row.waQup}
                  </Typography>
                </div>
              </motion.div>
            ))}
          </div>

          <Typography
            variant="small"
            style={{
              textAlign: 'center',
              color: colors.text.secondary,
              fontSize: 13,
              marginTop: spacing.lg,
              lineHeight: 1.65,
              maxWidth: 560,
              margin: `${spacing.lg} auto 0`,
            }}
          >
            Calm and Headspace charge you to listen. waQup charges you only to <em>create</em>. Listening is always free.
          </Typography>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: spacing.lg }}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/join')}
            >
              Try waQup free <ArrowRight size={18} strokeWidth={2} />
            </Button>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
}
