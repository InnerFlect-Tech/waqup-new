'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Infinity } from 'lucide-react';
import { Typography, Button, QCoin } from '@/components';
import { PageShell, PageContent } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import Link from 'next/link';
import { CREDIT_PACKS, getPackSavings, type CreditPackId } from '@waqup/shared/constants';

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
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
        background: isBestValue
          ? `linear-gradient(145deg, ${colors.accent.primary}22, ${colors.accent.secondary}12)`
          : hovered
            ? colors.glass.medium
            : colors.glass.light,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isBestValue
          ? `1px solid ${colors.accent.primary}60`
          : `1px solid ${colors.glass.border}`,
        boxShadow: isBestValue ? `0 20px 60px ${colors.accent.primary}20` : undefined,
        transition: 'background 0.2s ease',
        position: 'relative',
        marginBottom: spacing.md,
      }}
    >
      {isBestValue && (
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
            color: colors.text.onDark,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Best value
        </div>
      )}

      <div style={{ height: spacing.md, flexShrink: 0 }} />

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: spacing.md,
        }}
      >
        <div>
          <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs, fontWeight: 400 }}>
            {pack.name}
          </Typography>
          <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.5, maxWidth: 240 }}>
            {pack.description}
          </Typography>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: spacing.lg }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
              justifyContent: 'flex-end',
              marginBottom: spacing.xs,
            }}
          >
            <QCoin size="sm" />
            <span style={{ fontSize: 28, fontWeight: 200, color: colors.text.primary, lineHeight: 1 }}>
              {pack.credits}
            </span>
          </div>
          <Typography variant="small" style={{ color: colors.text.secondary }}>
            €{pack.price.toFixed(2)}
          </Typography>
          {(() => {
            const savings = getPackSavings(pack);
            if (!savings) return null;
            return (
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: colors.accent.tertiary,
                  marginTop: 2,
                }}
              >
                Save {savings.discountPercent}% · €{savings.savedEuros.toFixed(2)} vs Spark
              </div>
            );
          })()}
        </div>
      </div>

      <Button
        variant={isBestValue ? 'primary' : 'outline'}
        size="lg"
        fullWidth
        loading={loading}
        onClick={onCheckout}
        style={isBestValue ? undefined : { borderColor: `${colors.accent.primary}50` }}
      >
        {pack.ctaLabel}
      </Button>
    </motion.div>
  );
}

export default function BuyQsPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
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
        router.push('/login?next=/sanctuary/credits/buy');
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
    <PageShell intensity="medium">
      <PageContent width="narrow">
        <Link
          href="/sanctuary/credits"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl }}
        >
          <ArrowLeft size={14} color={colors.text.secondary} />
          <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
            Your Qs
          </Typography>
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
            Get Qs
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
            Qs power your creation.{' '}
            <Link href="/sanctuary" style={{ color: colors.accent.tertiary, textDecoration: 'none' }}>
              Practice is always free.
            </Link>
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: spacing.xl }}>
            <Infinity size={13} color={colors.text.secondary} style={{ opacity: 0.6 }} />
            <Typography variant="small" style={{ color: colors.text.secondary, opacity: 0.6, margin: 0 }}>
              Your Qs don&apos;t expire — use them at your own pace.
            </Typography>
          </div>
        </motion.div>

        {CREDIT_PACKS.map((pack, index) => (
          <PackCard
            key={pack.id}
            pack={pack}
            index={index}
            loading={loading === pack.id}
            onCheckout={() => handleCheckout(pack.id)}
          />
        ))}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: spacing.md,
              borderRadius: borderRadius.md,
              background: `${colors.error}15`,
              border: `1px solid ${colors.error}30`,
              marginBottom: spacing.md,
            }}
          >
            <Typography variant="small" style={{ color: colors.error, margin: 0 }}>
              {error}
            </Typography>
          </motion.div>
        )}

        {/* Confirm indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: `${spacing.md} ${spacing.lg}`,
            borderRadius: borderRadius.lg,
            background: colors.glass.light,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${colors.glass.border}`,
            marginBottom: spacing.md,
          }}
        >
          <CheckCircle2 size={14} color="#34d399" />
          <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.5 }}>
            Qs are added instantly after payment. Secured by Stripe.
          </Typography>
        </motion.div>

        {/* Link to subscription plans */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{
            padding: spacing.xl,
            borderRadius: borderRadius.lg,
            background: colors.glass.light,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${colors.glass.border}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.6, marginBottom: spacing.sm }}>
            Want a monthly rhythm of Qs instead?
          </Typography>
          <Link href="/pricing" style={{ textDecoration: 'none' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                color: colors.accent.tertiary,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              View subscription plans
              <ArrowRight size={13} />
            </span>
          </Link>
        </motion.div>
      </PageContent>
    </PageShell>
  );
}
