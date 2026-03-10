'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import { useTheme, spacing } from '@/theme';
import { PageShell, GlassCard, Logo } from '@/components';
import { Typography, Button } from '@/components';

/**
 * Our Story — Founder narrative
 *
 * Purpose: Trust-building, legitimacy, why waQup exists.
 * Visitor intent: "Who's behind this? Can I trust them?"
 *
 * Best practices (River, Cobloom): Lead with problem → failed solutions → insight → our approach.
 * Founder credibility connects to the customer problem.
 */
export default function OurStoryPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="strong" maxWidth={560} allowDocumentScroll>
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
        {/* Proper Logo */}
        <div style={{ textAlign: 'center', paddingTop: spacing.md }}>
          <Logo size="lg" showIcon={false} href="/" />
        </div>

        {/* Hero — founder story */}
        <GlassCard
          style={{
            textAlign: 'center',
            padding: `${spacing.xxxl} ${spacing.xl}`,
            width: '100%',
          }}
        >
          <Typography
            variant="h1"
            style={{
              color: colors.text.primary,
              fontSize: 'clamp(24px, 4.5vw, 32px)',
              lineHeight: 1.25,
              fontWeight: 700,
              marginBottom: spacing.lg,
            }}
          >
            I did this manually. It changed my life. I built waQup to share it with the world.
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              fontSize: '16px',
              lineHeight: 1.7,
            }}
          >
            Most tools give you someone else&apos;s voice telling you what to believe. I found that speaking my own words — in my own voice — to myself was what actually rewired my subconscious. It wasn&apos;t easy. I had to write scripts, record them, structure my practice. But it worked. waQup is that process, made simple for everyone.
          </Typography>
        </GlassCard>

        {/* Who I am */}
        <GlassCard
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
            padding: `${spacing.xl} ${spacing.xl}`,
            width: '100%',
          }}
        >
          <Typography
            variant="h3"
            style={{
              color: colors.text.primary,
              fontWeight: 700,
              fontSize: '16px',
              marginBottom: spacing.xs,
            }}
          >
            Daniel Indias Fernandes
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              fontSize: '15px',
              lineHeight: 1.65,
            }}
          >
            Founder of waQup. I built this because the practice that changed my life shouldn&apos;t require manual setup, scripting, and guesswork. waQup guides you through creating affirmations, meditations, and rituals in your voice — so you can focus on the practice, not the process.
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.tertiary,
              fontSize: '14px',
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}
          >
            You can find me online — I&apos;m happy to connect.
          </Typography>
        </GlassCard>

        {/* CTA */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.md, alignItems: 'center' }}>
          <Link href="/how-it-works" style={{ width: '100%', textDecoration: 'none' }}>
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
              See how it works →
            </Button>
          </Link>
          <Link href="/waitlist" style={{ textDecoration: 'none' }}>
            <Typography
              variant="body"
              style={{
                color: colors.text.secondary,
                fontSize: '14px',
                opacity: 0.8,
                cursor: 'pointer',
                padding: `${spacing.sm} 0`,
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Join the waitlist
            </Typography>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
