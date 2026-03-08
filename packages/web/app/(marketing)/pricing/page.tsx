'use client';

import React, { useState } from 'react';
import { useTheme, spacing, borderRadius, CONTENT_MAX_WIDTH, GRID_CARD_MIN } from '@/theme';
import { Typography, Button, PageShell } from '@/components';
import { loadStripe } from '@stripe/stripe-js';
import { Check } from 'lucide-react';
import { PLANS, type PlanId } from '@waqup/shared/constants';

// Initialize Stripe
const getStripe = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('Stripe publishable key is not set');
  }
  return loadStripe(publishableKey);
};

const STRIPE_PRICE_IDS: Record<PlanId, string> = {
  starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
  growth: process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID || '',
  devotion: process.env.NEXT_PUBLIC_STRIPE_DEVOTION_PRICE_ID || '',
};

export default function PricingPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (planId: PlanId) => {
    const priceId = STRIPE_PRICE_IDS[planId];
    if (!priceId) {
      setError('Checkout is not configured. Please contact support.');
      return;
    }
    try {
      setLoading(planId);
      setError(null);

      const protocol = window.location.protocol;
      const host = window.location.host;
      const apiUrl = `${protocol}//${host}/api/create-checkout-session`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Failed to create checkout session');
      }

      const data = await response.json();

      if (!data.sessionId) {
        throw new Error('No session ID returned from server');
      }

      const stripe = await getStripe();

      if (!stripe) {
        throw new Error('Failed to initialize Stripe');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Failed to redirect to checkout');
      }
    } catch (err: unknown) {
      console.error('Checkout error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <PageShell intensity="medium" bare>
      <div style={{ padding: `${spacing.xxl} ${spacing.xl}`, maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
          <Typography
            variant="h1"
            style={{
              fontSize: 'clamp(48px, 8vw, 96px)',
              color: colors.text.primary,
              letterSpacing: '-2px',
              marginBottom: spacing.md,
            }}
          >
            wa<span style={{ color: colors.accent.primary }}>Q</span>up
          </Typography>
          <Typography
            variant="h2"
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 600,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Choose your plan
          </Typography>
          <Typography
            variant="body"
            style={{
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: colors.text.secondary,
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            Credits power your content creation. Practice is always free.
          </Typography>
        </div>

        {/* Pricing Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(${GRID_CARD_MIN}, 1fr))`,
            gridAutoRows: 'minmax(380px, 1fr)',
            gap: spacing.xl,
            marginBottom: spacing.xxl,
          }}
        >
          {PLANS.map((plan) => {
            const isPopular = plan.badge === 'Most Popular';
            return (
              <div
                key={plan.id}
                style={{
                  padding: spacing.xl,
                  borderRadius: borderRadius.xl,
                  background: colors.glass.light,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: isPopular ? `2px solid ${colors.accent.primary}` : `1px solid ${colors.glass.border}`,
                  boxShadow: isPopular
                    ? `0 16px 64px ${colors.accent.primary}60`
                    : `0 8px 32px ${colors.accent.primary}40`,
                  position: 'relative',
                  overflow: 'hidden',
                  transform: isPopular ? 'scale(1.05)' : undefined,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: spacing.lg,
                      right: `-${spacing.xl}`,
                      transform: 'rotate(45deg)',
                      padding: `${spacing.xs} ${spacing.xl}`,
                      background: `${colors.accent.primary}20`,
                      border: `1px solid ${colors.accent.primary}40`,
                      fontSize: '12px',
                      fontWeight: 600,
                      color: colors.accent.primary,
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
                  {plan.name}
                </Typography>

                <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                  <Typography
                    variant="h1"
                    style={{
                      fontSize: 'clamp(36px, 5vw, 48px)',
                      fontWeight: 700,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    €{plan.price}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary }}>
                    {plan.billingCycle === 'week' ? '/week' : '/month'}
                  </Typography>
                  {plan.trialDays && (
                    <Typography
                      variant="body"
                      style={{
                        color: colors.accent.primary,
                        fontWeight: 600,
                        marginTop: spacing.sm,
                      }}
                    >
                      {plan.trialDays}-day free trial
                    </Typography>
                  )}
                </div>

                <Typography
                  variant="body"
                  style={{
                    color: colors.text.secondary,
                    marginBottom: spacing.lg,
                    lineHeight: 1.5,
                  }}
                >
                  {plan.description}
                </Typography>

                <ul style={{ listStyle: 'none', padding: 0, margin: `0 0 ${spacing.xl} 0` }}>
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.sm,
                        marginBottom: spacing.md,
                        color: colors.text.secondary,
                      }}
                    >
                      <Check size={20} color={colors.accent.primary} />
                      <Typography variant="body">{feature}</Typography>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isPopular ? 'primary' : 'outline'}
                  size="lg"
                  fullWidth
                  loading={loading === plan.id}
                  onClick={() => handleCheckout(plan.id)}
                  style={
                    isPopular
                      ? { background: colors.gradients.primary }
                      : {
                          borderColor: colors.glass.border,
                          background: colors.glass.transparent,
                        }
                  }
                >
                  {loading === plan.id ? 'Processing...' : plan.ctaLabel}
                </Button>
              </div>
            );
          })}
        </div>

        {error && (
          <Typography
            variant="small"
            style={{
              color: colors.error,
              textAlign: 'center',
              marginBottom: spacing.lg,
              padding: spacing.md,
              background: `${colors.error}15`,
              borderRadius: borderRadius.md,
            }}
          >
            {error}
          </Typography>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: spacing.xl }}>
          <Typography variant="body" style={{ color: colors.text.tertiary }}>
            Practice is always free. Credits are only used when you create new content.
          </Typography>
        </div>
      </div>
    </PageShell>
  );
}
