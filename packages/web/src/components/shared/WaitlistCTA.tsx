'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Typography } from '@/components/ui';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR, CARD_PADDING_AUTH, BUTTON_TOKENS } from '@/theme';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';

// ── Types ─────────────────────────────────────────────────────────────────────

export type WaitlistCTAVariant = 'inline' | 'banner';

interface WaitlistCTAProps {
  variant?: WaitlistCTAVariant;
  /** Headline override for the banner variant */
  headline?: string;
  /** Sub-text override */
  subtext?: string;
  className?: string;
  style?: React.CSSProperties;
}

// ── Inline variant ────────────────────────────────────────────────────────────

function InlineCTA({ headline, subtext, style }: { headline?: string; subtext?: string; style?: React.CSSProperties }) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed.split('@')[0], email: trimmed, intentions: [] }),
      });
      if (res.ok) {
        setDone(true);
      } else {
        const data = await res.json();
        // If already signed up, treat as success
        if (res.status === 409 || data?.error?.toLowerCase().includes('already')) {
          setDone(true);
        } else {
          setError(data?.error ?? 'Something went wrong.');
        }
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', ...style }}>
      {headline && (
        <Typography
          variant="h2"
          style={{ color: colors.text.primary, marginBottom: spacing.sm }}
        >
          {headline}
        </Typography>
      )}
      {subtext && (
        <Typography
          variant="body"
          style={{ color: colors.text.secondary, marginBottom: spacing.lg, lineHeight: 1.65 }}
        >
          {subtext}
        </Typography>
      )}

      {done ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.sm,
            padding: `${spacing.md} ${spacing.lg}`,
            borderRadius: borderRadius.full,
            background: `${colors.accent.primary}20`,
            border: `1px solid ${colors.accent.primary}40`,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: colors.gradients.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={13} color={colors.text.onDark} />
          </div>
          <span style={{ color: colors.accent.tertiary, fontSize: 14, fontWeight: 500 }}>
            You&apos;re on the list!
          </span>
          <Link
            href={`/waitlist?email=${encodeURIComponent(email)}`}
            style={{ color: colors.text.tertiary, fontSize: 12, marginLeft: spacing.xs }}
          >
            Complete your profile →
          </Link>
        </motion.div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: spacing.sm,
            width: '100%',
            maxWidth: 480,
            margin: '0 auto',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: '1 1 220px', minWidth: 200 }}>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              wrapperStyle={{ marginBottom: 0 }}
              containerStyle={{ minHeight: BUTTON_TOKENS.minHeight.lg }}
              style={{ width: '100%' }}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            style={{ flexShrink: 0 }}
          >
            {submitting ? 'Joining…' : (
              <>Join waitlist <ArrowRight size={15} style={{ marginLeft: 6 }} /></>
            )}
          </Button>
        </form>
      )}

      {error && (
        <Typography
          variant="small"
          style={{ color: colors.error, marginTop: spacing.sm, display: 'block' }}
        >
          {error}
        </Typography>
      )}

      {!done && (
        <Typography
          variant="small"
          style={{ color: colors.text.tertiary, marginTop: spacing.lg, display: 'block' }}
        >
          Or{' '}
          <Link href="/waitlist" style={{ color: colors.accent.tertiary, textDecoration: 'none' }}>
            fill out the full form
          </Link>{' '}
          to share your intentions and get priority access.
        </Typography>
      )}
    </div>
  );
}

// ── Banner variant ─────────────────────────────────────────────────────────────

function BannerCTA({ headline, subtext, style }: { headline?: string; subtext?: string; style?: React.CSSProperties }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const defaultHeadline = headline ?? 'Ready to rewire your mind?';
  const defaultSubtext = subtext ?? 'Join the waitlist and be first to access waQup when it launches.';

  return (
    <div
      style={{
        position: 'relative',
        padding: CARD_PADDING_AUTH,
        borderRadius: borderRadius.xl,
        background: colors.glass.light,
        backdropFilter: BLUR.xl,
        WebkitBackdropFilter: BLUR.xl,
        border: `1px solid ${colors.glass.border}`,
        boxShadow: `0 16px 64px ${colors.accent.primary}40`,
        overflow: 'hidden',
        textAlign: 'center',
        ...style,
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Early Access badge — matches AI POWERED pattern from landing */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: `${spacing.xs} ${spacing.md}`,
            borderRadius: borderRadius.full,
            background: `${colors.accent.tertiary}20`,
            border: `1px solid ${colors.accent.tertiary}40`,
            marginBottom: spacing.lg,
          }}
        >
          <Sparkles size={12} color={colors.accent.tertiary} />
          <Typography
            variant="smallBold"
            style={{ color: colors.accent.tertiary, textTransform: 'uppercase', letterSpacing: '0.08em' }}
          >
            Early Access
          </Typography>
        </div>

        <InlineCTA headline={defaultHeadline} subtext={defaultSubtext} />
      </div>
    </div>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────

export function WaitlistCTA({
  variant = 'inline',
  headline,
  subtext,
  style,
}: WaitlistCTAProps) {
  if (variant === 'banner') {
    return <BannerCTA headline={headline} subtext={subtext} style={style} />;
  }
  return <InlineCTA headline={headline} subtext={subtext} style={style} />;
}
