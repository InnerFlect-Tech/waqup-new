'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Infinity, ArrowRight, CheckCircle2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useTheme, spacing, borderRadius, CONTENT_MAX_WIDTH } from '@/theme';
import { Typography, Button, PageShell, QCoin } from '@/components';
import { CREDIT_PACKS, getPackSavings, type CreditPackId } from '@waqup/shared/constants';
import { useAuthStore } from '@/stores';

const TRUST_POINTS = [
  { icon: Infinity, text: 'Qs never expire — use them at your own pace' },
  { icon: Sparkles, text: 'Practice is always free — Qs power creation only' },
  { icon: CheckCircle2, text: 'Instant delivery after payment. Secured by Stripe' },
];

function PackCard({
  pack,
  index,
  loading,
  onCheckout,
}: {
  pack: (typeof CREDIT_PACKS)[number];
  index: number;
  loading: boolean;
  onCheckout: () => void;
}) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const isBestValue = pack.badge === 'Best Value';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{
        position: 'relative',
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
        background: isBestValue
          ? `linear-gradient(145deg, ${colors.accent.primary}28, ${colors.accent.secondary}15)`
          : colors.glass.light,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isBestValue
          ? `1px solid ${colors.accent.primary}60`
          : `1px solid ${colors.glass.border}`,
        boxShadow: isBestValue ? `0 20px 60px ${colors.accent.primary}20` : undefined,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
      }}
    >
      {/* Best Value badge — absolute so it doesn't shift layout */}
      {isBestValue && (
        <div
          style={{
            position: 'absolute',
            top: -1,
            left: '50%',
            transform: 'translateX(-50%)',
            background: colors.gradients.primary,
            padding: `3px ${spacing.lg}`,
            borderRadius: `0 0 ${borderRadius.md}px ${borderRadius.md}px`,
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Best Value
        </div>
      )}

      {/* Spacer so all cards align — reserves space for badge overlap */}
      <div style={{ height: spacing.md, flexShrink: 0 }} />

      {/* Q amount — the hero number */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
        <QCoin size="md" />
        <div>
          <span
            style={{
              fontSize: 38,
              fontWeight: 200,
              color: colors.text.primary,
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}
          >
            {pack.credits}
          </span>
          <span
            style={{
              fontSize: 15,
              color: colors.text.secondary,
              marginLeft: 5,
            }}
          >
            Qs
          </span>
        </div>
      </div>

      {/* Pack name */}
      <div>
        <div style={{ fontSize: 16, fontWeight: 500, color: colors.text.primary, marginBottom: 3 }}>
          {pack.name}
        </div>
        <div style={{ fontSize: 13, color: colors.text.secondary, lineHeight: 1.5 }}>
          {pack.description}
        </div>
      </div>

      {/* Price + discount vs baseline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: spacing.sm }}>
          <span
            style={{
              fontSize: 26,
              fontWeight: 300,
              color: colors.text.primary,
              letterSpacing: '-0.02em',
            }}
          >
            €{pack.price.toFixed(2)}
          </span>
        </div>
        {(() => {
          const savings = getPackSavings(pack);
          if (!savings) return null;
          return (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: colors.accent.tertiary,
              }}
            >
              Save {savings.discountPercent}% · €{savings.savedEuros.toFixed(2)} vs Spark
            </span>
          );
        })()}
      </div>

      <Button
        variant={isBestValue ? 'primary' : 'outline'}
        size="md"
        fullWidth
        loading={loading}
        onClick={onCheckout}
        style={isBestValue ? { background: colors.gradients.primary } : { borderColor: `${colors.accent.primary}50` }}
      >
        {pack.ctaLabel}
      </Button>
    </motion.div>
  );
}

export default function GetQsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState<CreditPackId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (packId: CreditPackId) => {
    try {
      setLoading(packId);
      setError(null);

      const res = await fetch('/api/stripe/checkout/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      });

      if (res.status === 401) {
        router.push('/login?next=/get-qs');
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
        {/* Sign-in prompt for unauthenticated visitors */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm,
              padding: `${spacing.md} ${spacing.lg}`,
              marginBottom: spacing.xl,
              borderRadius: borderRadius.lg,
              background: `${colors.accent.primary}12`,
              border: `1px solid ${colors.accent.primary}30`,
              flexWrap: 'wrap',
            }}
          >
            <LogIn size={18} color={colors.accent.primary} strokeWidth={2} />
            <span style={{ fontSize: 14, color: colors.text.secondary, lineHeight: 1.5 }}>
              Sign in to purchase. We&apos;ll bring you back here after you log in.
            </span>
            <Link href="/login?next=/get-qs" style={{ textDecoration: 'none' }}>
              <Button variant="ghost" size="sm" style={{ borderColor: `${colors.accent.primary}50`, color: colors.accent.primary }}>
                Sign in
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: spacing.xxl }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing.md }}>
            <QCoin size="lg" />
          </div>
          <Typography
            variant="h1"
            style={{
              fontSize: 'clamp(28px, 4vw, 50px)',
              fontWeight: 200,
              color: colors.text.primary,
              marginBottom: spacing.md,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Q packs
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
            Qs power affirmations, meditations, and rituals. Buy once — they never expire.
            <br />
            <span style={{ color: colors.text.tertiary ?? colors.text.secondary }}>Practice is always free.</span>
          </Typography>
        </motion.div>

        {/* Pack grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: spacing.lg,
            marginBottom: spacing.xxl,
          }}
        >
          {CREDIT_PACKS.map((pack, index) => (
            <PackCard
              key={pack.id}
              pack={pack}
              index={index}
              loading={loading === pack.id}
              onCheckout={() => handleCheckout(pack.id)}
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

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: spacing.xl,
            marginBottom: spacing.xxl,
            padding: `${spacing.lg} 0`,
            borderTop: `1px solid ${colors.glass.border}`,
            borderBottom: `1px solid ${colors.glass.border}`,
          }}
        >
          {TRUST_POINTS.map((point) => (
            <div
              key={point.text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
              }}
            >
              <point.icon size={15} color={colors.accent.primary} strokeWidth={1.5} />
              <span style={{ fontSize: 13, color: colors.text.secondary }}>
                {point.text}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Link to subscription plans */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.sm }}
        >
          <Typography variant="small" style={{ color: colors.text.tertiary, fontSize: 13 }}>
            Want a recurring monthly allocation instead?
          </Typography>
          <Link href="/pricing" style={{ textDecoration: 'none' }}>
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
              View subscription plans
              <ArrowRight size={14} />
            </span>
          </Link>
        </motion.div>
      </div>
    </PageShell>
  );
}
