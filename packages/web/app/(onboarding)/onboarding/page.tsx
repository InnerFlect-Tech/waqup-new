'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme, spacing, borderRadius } from '@/theme';
import { PageShell, GlassCard } from '@/components';
import { Typography, Button } from '@/components';
import { useAuthStore } from '@/stores';

const INTENTIONS = [
  { id: 'confidence', emoji: '🦁', label: 'Confidence & Self-Worth', sub: 'Own who you are, fully' },
  { id: 'abundance', emoji: '💎', label: 'Abundance & Wealth', sub: 'Rewire your money beliefs' },
  { id: 'peace', emoji: '🌊', label: 'Inner Peace & Calm', sub: 'Quiet the noise inside' },
  { id: 'love', emoji: '❤️', label: 'Love & Relationships', sub: 'Open your heart completely' },
  { id: 'purpose', emoji: '🔥', label: 'Purpose & Direction', sub: 'Live with total clarity' },
  { id: 'health', emoji: '⚡', label: 'Health & Vitality', sub: 'Heal from the inside out' },
];

export default function OnboardingPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'there';

  const handleContinue = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    // Small delay for UX feel, then enter the Sanctuary
    await new Promise((r) => setTimeout(r, 600));
    router.push('/sanctuary');
  };

  return (
    <PageShell intensity="strong" maxWidth={520}>
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
        {/* Progress indicator */}
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            paddingTop: spacing.md,
          }}
        >
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                height: '3px',
                width: '32px',
                borderRadius: borderRadius.full,
                background: i === 0 ? colors.accent.primary : `${colors.accent.primary}30`,
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Header */}
        <GlassCard
          style={{
            textAlign: 'center',
            padding: `${spacing.xxl} ${spacing.xl}`,
            width: '100%',
          }}
        >
          <Typography
            variant="h1"
            style={{
              color: colors.text.primary,
              fontSize: 'clamp(22px, 5vw, 30px)',
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: spacing.md,
            }}
          >
            Hey {firstName}, what matters most to you right now?
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              fontSize: '15px',
              lineHeight: 1.6,
            }}
          >
            We&apos;ll personalise your voice experience around this. You can always change it later.
          </Typography>
        </GlassCard>

        {/* Intention grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: spacing.md,
          }}
        >
          {INTENTIONS.map((intention) => {
            const isActive = selected === intention.id;
            return (
              <button
                key={intention.id}
                onClick={() => setSelected(intention.id)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  padding: `${spacing.lg} ${spacing.md}`,
                  borderRadius: borderRadius.lg,
                  background: isActive ? `${colors.accent.primary}25` : colors.glass.light,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `1px solid ${isActive ? colors.accent.primary : colors.glass.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: spacing.sm,
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive
                    ? `0 0 24px ${colors.accent.primary}40`
                    : `0 4px 16px ${colors.accent.primary}15`,
                  minHeight: '44px',
                }}
              >
                <span style={{ fontSize: '28px', lineHeight: 1 }}>{intention.emoji}</span>
                <Typography
                  variant="body"
                  style={{
                    color: isActive ? colors.accent.primary : colors.text.primary,
                    fontWeight: 700,
                    fontSize: '13px',
                    lineHeight: 1.3,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {intention.label}
                </Typography>
                <Typography
                  variant="body"
                  style={{
                    color: colors.text.secondary,
                    fontSize: '11px',
                    lineHeight: 1.4,
                    opacity: 0.8,
                  }}
                >
                  {intention.sub}
                </Typography>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.md, alignItems: 'center' }}>
          <Button
            variant="primary"
            size="lg"
            disabled={!selected || isSubmitting}
            onClick={handleContinue}
            style={{
              width: '100%',
              minHeight: '56px',
              fontSize: '17px',
              fontWeight: 700,
              opacity: selected ? 1 : 0.45,
              transition: 'opacity 0.2s ease',
            }}
          >
            {isSubmitting ? 'Setting up your Sanctuary…' : 'Enter Your Sanctuary →'}
          </Button>

          <button
            onClick={() => router.push('/sanctuary')}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: `${spacing.sm} 0`,
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="body"
              style={{
                color: colors.text.secondary,
                fontSize: '13px',
                opacity: 0.55,
              }}
            >
              Skip for now
            </Typography>
          </button>
        </div>
      </div>
    </PageShell>
  );
}
