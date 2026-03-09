'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Typography } from '@/components/ui';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
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
            gap: 10,
            padding: '14px 24px',
            borderRadius: borderRadius.full,
            background: 'rgba(147,51,234,0.12)',
            border: '1px solid rgba(147,51,234,0.35)',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #9333EA, #6366F1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={13} color="#fff" />
          </div>
          <span style={{ color: '#A855F7', fontSize: 14, fontWeight: 500 }}>
            You&apos;re on the list!
          </span>
          <Link
            href={`/waitlist?email=${encodeURIComponent(email)}`}
            style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginLeft: 4 }}
          >
            Complete your profile →
          </Link>
        </motion.div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            gap: spacing.md,
            maxWidth: 440,
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div style={{ flex: '1 1 240px', minWidth: 200 }}>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
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
          style={{ color: '#ef4444', marginTop: spacing.sm, display: 'block' }}
        >
          {error}
        </Typography>
      )}

      {!done && (
        <Typography
          variant="small"
          style={{ color: 'rgba(255,255,255,0.2)', marginTop: spacing.lg, display: 'block' }}
        >
          Or{' '}
          <Link href="/waitlist" style={{ color: 'rgba(147,51,234,0.6)', textDecoration: 'none' }}>
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
  const defaultHeadline = headline ?? 'Ready to rewire your mind?';
  const defaultSubtext = subtext ?? 'Join the waitlist and be first to access waQup when it launches.';

  return (
    <div
      style={{
        position: 'relative',
        padding: `${spacing.xxl}px ${spacing.xl}px`,
        borderRadius: borderRadius.xl,
        background: 'linear-gradient(135deg, rgba(147,51,234,0.15) 0%, rgba(99,102,241,0.12) 100%)',
        border: '1px solid rgba(147,51,234,0.2)',
        overflow: 'hidden',
        textAlign: 'center',
        ...style,
      }}
    >
      {/* Glow orbs */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          left: '30%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147,51,234,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -40,
          right: '20%',
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 14px',
            borderRadius: 999,
            background: 'rgba(147,51,234,0.15)',
            border: '1px solid rgba(147,51,234,0.3)',
            marginBottom: spacing.md,
          }}
        >
          <Sparkles size={12} color="#A855F7" />
          <span style={{ fontSize: 11, color: '#A855F7', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
            Early Access
          </span>
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
