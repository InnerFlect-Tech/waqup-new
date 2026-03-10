'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { useTheme, spacing, borderRadius } from '@/theme';
import { PageShell, GlassCard } from '@/components';
import { Typography, Button } from '@/components';

const STEPS = [
  {
    icon: '🧠',
    headline: 'Your mind runs on patterns formed early',
    body: 'By age 7, core beliefs about what you deserve and what is possible were often set — by early experiences, not by choice. waQup helps you consciously reshape those patterns.',
  },
  {
    icon: '🔊',
    headline: 'Your voice activates deeper pathways',
    body: 'Research shows that hearing your own voice activates neural pathways that written affirmations or external audio cannot reach. Your subconscious filters out strangers — but it responds to you.',
  },
  {
    icon: '✨',
    headline: 'Change happens in 21–66 days',
    body: 'Neuroplasticity is real. Repeated, emotionally resonant voice experiences can physically reshape your brain. Consistent practice compounds over time.',
  },
];

const SOCIAL_PROOF = [
  '"I stopped self-sabotaging in 3 weeks. I still can\'t explain it."',
  '"My anxiety dropped noticeably. My therapist asked what changed."',
  '"I got the promotion. I genuinely believed I deserved it for the first time."',
];

export default function ExplanationPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % SOCIAL_PROOF.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <PageShell intensity="strong" maxWidth={520} allowDocumentScroll>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: spacing.xl,
          paddingBottom: spacing.xxxl,
          gap: spacing.xl,
        }}
      >
        {/* Logo wordmark */}
        <div style={{ textAlign: 'center', paddingTop: spacing.md }}>
          <Typography
            variant="h3"
            style={{
              color: colors.accent.primary,
              letterSpacing: '0.12em',
              fontWeight: 800,
              fontSize: '13px',
              textTransform: 'uppercase',
            }}
          >
            waQup
          </Typography>
        </div>

        {/* Hero */}
        <GlassCard
          style={{
            textAlign: 'center',
            padding: `${spacing.xxxl} ${spacing.xl}`,
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              marginBottom: spacing.lg,
              lineHeight: 1,
            }}
          >
            💤
          </div>
          <Typography
            variant="h1"
            style={{
              color: colors.text.primary,
              fontSize: 'clamp(26px, 5vw, 36px)',
              lineHeight: 1.2,
              fontWeight: 900,
              marginBottom: spacing.lg,
            }}
          >
            Your mind follows patterns you didn&apos;t choose.
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              fontSize: '17px',
              lineHeight: 1.65,
            }}
          >
            Most of your thoughts, decisions, and self-limits are shaped by subconscious conditioning. waQup helps you reshape them — using the voice your brain trusts most: yours.
          </Typography>
        </GlassCard>

        {/* 3-step psychological framing */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
          }}
        >
          {STEPS.map((step, i) => (
            <GlassCard
              key={i}
              style={{
                display: 'flex',
                gap: spacing.lg,
                alignItems: 'flex-start',
                padding: `${spacing.lg} ${spacing.xl}`,
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  lineHeight: 1,
                  flexShrink: 0,
                  paddingTop: '2px',
                }}
              >
                {step.icon}
              </div>
              <div>
                <Typography
                  variant="h3"
                  style={{
                    color: colors.text.primary,
                    fontWeight: 700,
                    fontSize: '16px',
                    marginBottom: spacing.sm,
                    lineHeight: 1.3,
                  }}
                >
                  {step.headline}
                </Typography>
                <Typography
                  variant="body"
                  style={{
                    color: colors.text.secondary,
                    fontSize: '14px',
                    lineHeight: 1.6,
                  }}
                >
                  {step.body}
                </Typography>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Rotating social proof */}
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            padding: `0 ${spacing.md}`,
          }}
        >
          <Typography
            variant="body"
            key={quoteIndex}
            style={{
              color: colors.text.secondary,
              fontSize: '14px',
              fontStyle: 'italic',
              lineHeight: 1.6,
              opacity: 0.8,
              transition: 'opacity 0.4s ease',
            }}
          >
            {SOCIAL_PROOF[quoteIndex]}
          </Typography>
        </div>

        {/* CTA */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.md, alignItems: 'center' }}>
          <Link href="/onboarding" style={{ width: '100%', textDecoration: 'none' }}>
            <Button
              variant="primary"
              size="lg"
              style={{
                width: '100%',
                minHeight: '56px',
                fontSize: '17px',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              Begin Your Transformation →
            </Button>
          </Link>

          <Link href="/sanctuary" style={{ textDecoration: 'none' }}>
            <Typography
              variant="body"
              style={{
                color: colors.text.secondary,
                fontSize: '13px',
                opacity: 0.6,
                cursor: 'pointer',
                padding: `${spacing.sm} 0`,
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Skip for now
            </Typography>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
