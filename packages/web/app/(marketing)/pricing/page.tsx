'use client';

import React, { useState } from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import { spacing, borderRadius, SAFE_AREA_RIGHT } from '@/theme';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Users, Music, Heart, Puzzle, Check } from 'lucide-react';

// Initialize Stripe
const getStripe = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error('Stripe publishable key is not set');
  }
  return loadStripe(publishableKey);
};

export default function PricingPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(true);
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
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell intensity="medium" bare>
      {/* Content */}
        <div style={{ padding: `${spacing.xxl} ${spacing.xl}`, paddingRight: SAFE_AREA_RIGHT, maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: spacing.xxl }}>
            <Typography
              variant="h1"
              style={{
                fontSize: 'clamp(48px, 8vw, 96px)',
                fontWeight: 300,
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
              Founding Members Special
            </Typography>
            <Typography
              variant="body"
              style={{
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                color: colors.text.secondary,
                maxWidth: '800px',
                margin: `0 auto ${spacing.md} auto`,
              }}
            >
              Daily rituals and unlimited affirmations to transform your consciousness
            </Typography>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.sm} ${spacing.lg}`,
                borderRadius: borderRadius.full,
                background: `${colors.accent.primary}20`,
                border: `1px solid ${colors.accent.primary}40`,
                marginTop: spacing.lg,
              }}
            >
              <Users size={20} color={colors.accent.primary} />
              <Typography variant="body" style={{ color: colors.accent.primary, fontWeight: 600 }}>
                Only <span style={{ fontWeight: 700 }}>500</span> spots available at this price
              </Typography>
            </div>
          </div>

          {/* Pricing Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: spacing.xl,
              marginBottom: spacing.xxl,
            }}
          >
            {/* Free Trial */}
            <div
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.xl,
                background: colors.glass.opaque,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${colors.glass.border}`,
                boxShadow: `0 8px 32px ${colors.mystical.glow}40`,
              }}
            >
              <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
                Free Trial
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
                  $0
                </Typography>
                <Typography variant="body" style={{ color: colors.accent.primary }}>
                  7 Days Access
                </Typography>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: `0 0 ${spacing.xl} 0` }}>
                {[
                  '1 Daily Ritual',
                  '5 Affirmations Daily',
                  'Basic Meditation Library',
                  'Featured Creator Content',
                ].map((feature) => (
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

              <Link href="/signup" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outline"
                  size="lg"
                  fullWidth
                  style={{
                    borderColor: colors.glass.border,
                    background: colors.glass.transparent,
                  }}
                >
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Regular Monthly (Coming Soon) */}
            <div
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.xl,
                background: colors.glass.opaque,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${colors.glass.border}`,
                boxShadow: `0 8px 32px ${colors.mystical.glow}40`,
                position: 'relative',
                overflow: 'hidden',
                opacity: 0.7,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: spacing.lg,
                  right: `-${spacing.xl}`,
                  transform: 'rotate(45deg)',
                  padding: `${spacing.xs} ${spacing.xl}`,
                  background: colors.glass.opaque,
                  border: `1px solid ${colors.glass.border}`,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: colors.text.primary,
                }}
              >
                Coming Soon
              </div>

              <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
                Regular Monthly
              </Typography>
              <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                <Typography
                  variant="h1"
                  style={{
                    fontSize: 'clamp(48px, 6vw, 64px)',
                    fontWeight: 700,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  $16.99
                </Typography>
                <Typography variant="body" style={{ color: colors.accent.primary }}>
                  per month
                </Typography>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: `0 0 ${spacing.xl} 0` }}>
                {[
                  { icon: Music, text: '1 Daily Ritual + History Access' },
                  { icon: Heart, text: 'Unlimited Affirmations' },
                  { icon: Puzzle, text: 'Create Custom Meditations' },
                  { text: 'Full Creator Library Access' },
                  { text: 'Download for Offline Use' },
                ].map((feature, index) => (
                  <li
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      marginBottom: spacing.md,
                      color: colors.text.secondary,
                    }}
                  >
                    {feature.icon ? (
                      <feature.icon size={20} color={colors.accent.primary} />
                    ) : (
                      <Check size={20} color={colors.accent.primary} />
                    )}
                    <Typography variant="body">{feature.text}</Typography>
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                size="lg"
                fullWidth
                disabled
                style={{
                  borderColor: colors.glass.border,
                  background: colors.glass.transparent,
                  opacity: 0.5,
                  cursor: 'not-allowed',
                }}
              >
                Not Available Yet
              </Button>
            </div>

            {/* Founding Member */}
            <div
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.xl,
                background: colors.glass.opaque,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `2px solid ${colors.accent.primary}`,
                boxShadow: `0 16px 64px ${colors.mystical.glow}60`,
                position: 'relative',
                overflow: 'hidden',
                transform: 'scale(1.05)',
              }}
            >
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
                Limited Time
              </div>

              <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
                Founding Member
              </Typography>
              <div style={{ textAlign: 'center', marginBottom: spacing.xl }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                  <Typography
                    variant="body"
                    style={{
                      fontSize: '24px',
                      fontWeight: 300,
                      color: colors.text.tertiary,
                      textDecoration: 'line-through',
                    }}
                  >
                    $16.99/mo
                  </Typography>
                  <Typography
                    variant="h1"
                    style={{
                      fontSize: 'clamp(48px, 6vw, 64px)',
                      fontWeight: 700,
                      color: colors.text.primary,
                    }}
                  >
                    $6.99
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.tertiary }}>
                    /mo
                  </Typography>
                </div>
                <Typography variant="body" style={{ color: colors.accent.primary, fontWeight: 700 }}>
                  Locked-in For Life
                </Typography>
                <Typography variant="small" style={{ color: colors.text.tertiary, marginTop: spacing.xs }}>
                  First 500 Members Only
                </Typography>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: `0 0 ${spacing.xl} 0` }}>
                {[
                  'Everything in Regular Plan',
                  'Priority Support',
                  'Early Access to New Features',
                  'Exclusive Founding Member Badge',
                  'Price Never Increases',
                ].map((feature) => (
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
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onClick={() => handleCheckout('price_1RYGUgA4pDi5qYtD9ETC1zev')}
                style={{
                  background: colors.gradients.primary,
                  marginBottom: spacing.md,
                }}
              >
                {loading ? 'Processing...' : 'Become a Founding Member'}
              </Button>

              {error && (
                <Typography variant="small" style={{ color: colors.error, textAlign: 'center', marginTop: spacing.sm }}>
                  {error}
                </Typography>
              )}

              <Typography variant="small" style={{ color: colors.text.tertiary, textAlign: 'center', marginTop: spacing.md }}>
                30-day money-back guarantee
              </Typography>
            </div>
          </div>

          {/* Social Proof */}
          <div style={{ textAlign: 'center', marginTop: spacing.xl }}>
            <Typography variant="body" style={{ color: colors.text.tertiary }}>
              Join 1,000+ users transforming their consciousness
            </Typography>
          </div>
        </div>
    </PageShell>
  );
}
