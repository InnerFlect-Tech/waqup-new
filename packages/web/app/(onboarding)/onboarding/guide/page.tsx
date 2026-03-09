'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingStepLayout } from '@/components';
import { Typography } from '@/components';
import { useTheme, spacing, borderRadius, BLUR } from '@/theme';
import { useAuthStore } from '@/stores';
import { Analytics } from '@waqup/shared/utils';

const CONTENT_TYPES = [
  {
    id: 'affirmation',
    label: 'Affirmations',
    desc: 'Short, powerful statements. Replay daily.',
    emoji: '🦁',
  },
  {
    id: 'meditation',
    label: 'Meditations',
    desc: 'Guided journeys. Set the scene, then relax.',
    emoji: '🌊',
  },
  {
    id: 'ritual',
    label: 'Rituals',
    desc: 'Deeper work. Your values, your voice.',
    emoji: '🔥',
  },
] as const;

export default function OnboardingGuidePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEnter = async () => {
    setIsSubmitting(true);
    Analytics.onboardingStepCompleted('guide', user?.id);
    await new Promise((r) => setTimeout(r, 400));
    router.push('/sanctuary');
  };

  return (
    <OnboardingStepLayout
      step={4}
      title="You're ready. Here's the quick version."
      primaryLabel="Enter Your Sanctuary →"
      onSubmit={handleEnter}
      loading={isSubmitting}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.md,
          width: '100%',
        }}
      >
        {CONTENT_TYPES.map((item) => (
          <div
            key={item.id}
            style={{
              padding: spacing.lg,
              borderRadius: borderRadius.lg,
              background: colors.glass.light,
              backdropFilter: BLUR.lg,
              WebkitBackdropFilter: BLUR.lg,
              border: `1px solid ${colors.glass.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: borderRadius.md,
                background: `${colors.accent.primary}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
              }}
            >
              {item.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body"
                style={{
                  color: colors.text.primary,
                  fontWeight: 700,
                  fontSize: '15px',
                  marginBottom: spacing.xs,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                variant="body"
                style={{
                  color: colors.text.secondary,
                  fontSize: '13px',
                  lineHeight: 1.5,
                }}
              >
                {item.desc}
              </Typography>
            </div>
          </div>
        ))}

        <Typography
          variant="body"
          style={{
            color: colors.text.secondary,
            fontSize: '14px',
            textAlign: 'center',
            marginTop: spacing.sm,
            lineHeight: 1.6,
          }}
        >
          Create by talking — no forms. Practice is free.
        </Typography>
      </div>
    </OnboardingStepLayout>
  );
}
