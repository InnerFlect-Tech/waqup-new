'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { OnboardingStepLayout } from '@/components';
import { Typography, Button } from '@/components';
import { useTheme, spacing, borderRadius, BLUR } from '@/theme';
import { useAuthStore } from '@/stores';
import { Analytics } from '@waqup/shared/utils';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

const QUICK_START_OPTIONS = [
  {
    id: 'affirmation',
    emoji: '🦁',
    label: 'Create my first affirmation',
    sub: 'Cognitive re-patterning · 1 min · 1 Q',
    href: '/create/orb?type=affirmation',
    color: '#c084fc',
  },
  {
    id: 'meditation',
    emoji: '🌊',
    label: 'Create a short meditation',
    sub: 'State induction · 5 min · 2 Q',
    href: '/create/orb?type=meditation',
    color: '#60a5fa',
  },
  {
    id: 'ritual',
    emoji: '🔥',
    label: 'Build a daily ritual',
    sub: 'Identity encoding · 10 min · 5 Q',
    href: '/create/orb?type=ritual',
    color: '#34d399',
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

  const handleCreateNow = (href: string) => {
    Analytics.onboardingStepCompleted('guide-create', user?.id);
    router.push(href);
  };

  return (
    <OnboardingStepLayout
      step={5}
      title="Create your first practice now"
      primaryLabel="Skip to Sanctuary →"
      onSubmit={handleEnter}
      loading={isSubmitting}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.sm,
          width: '100%',
        }}
      >
        {/* Quick create options */}
        {QUICK_START_OPTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleCreateNow(item.href)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              padding: `${spacing.md} ${spacing.lg}`,
              borderRadius: borderRadius.lg,
              background: `${item.color}10`,
              backdropFilter: BLUR.lg,
              WebkitBackdropFilter: BLUR.lg,
              border: `1px solid ${item.color}30`,
              display: 'flex',
              alignItems: 'center',
              gap: spacing.md,
              transition: 'all 0.2s ease',
              minHeight: '44px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${item.color}20`;
              e.currentTarget.style.borderColor = `${item.color}60`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${item.color}10`;
              e.currentTarget.style.borderColor = `${item.color}30`;
            }}
          >
            <span style={{ fontSize: '24px', lineHeight: 1, width: 36, textAlign: 'center', flexShrink: 0 }}>
              {item.emoji}
            </span>
            <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
              <Typography
                variant="body"
                style={{ color: colors.text.primary, fontWeight: 700, fontSize: '14px', lineHeight: 1.3, marginBottom: '2px' }}
              >
                {item.label}
              </Typography>
              <Typography variant="small" style={{ color: item.color, fontSize: '11px', lineHeight: 1.4, opacity: 0.85 }}>
                {item.sub}
              </Typography>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: borderRadius.full,
                background: `${item.color}20`,
                border: `1px solid ${item.color}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={14} color={item.color} />
            </div>
          </button>
        ))}

        {/* Rules reminder */}
        <div
          style={{
            marginTop: spacing.md,
            padding: `${spacing.sm} ${spacing.md}`,
            borderRadius: borderRadius.md,
            background: colors.glass.light,
            backdropFilter: BLUR.sm,
            WebkitBackdropFilter: BLUR.sm,
            border: `1px solid ${colors.glass.border}`,
          }}
        >
          <Typography
            variant="small"
            style={{ color: colors.text.secondary, fontSize: '12px', textAlign: 'center', lineHeight: 1.6 }}
          >
            Create by talking — no forms. Practice is free. Qs are only used when you create. You start with enough to try everything.
          </Typography>
        </div>
      </div>
    </OnboardingStepLayout>
  );
}
