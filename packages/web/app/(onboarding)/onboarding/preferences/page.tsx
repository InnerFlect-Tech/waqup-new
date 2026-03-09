'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingStepLayout } from '@/components';
import { Typography } from '@/components';
import { useTheme, spacing, borderRadius, BLUR } from '@/theme';
import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@waqup/shared/utils';

const PRESETS = [
  {
    id: 'voice',
    label: 'Voice-focused',
    sub: 'Clear and upfront',
    emoji: '🎤',
    values: { voice: 90, ambient: 20, binaural: 10 },
  },
  {
    id: 'balanced',
    label: 'Balanced',
    sub: 'Mix of all layers',
    emoji: '⚖️',
    values: { voice: 70, ambient: 40, binaural: 30 },
  },
  {
    id: 'ambient',
    label: 'Ambient-first',
    sub: 'Soothing background',
    emoji: '🌊',
    values: { voice: 50, ambient: 60, binaural: 40 },
  },
] as const;

export default function OnboardingPreferencesPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      const preset = PRESETS.find((p) => p.id === selected);
      if (preset && user?.id) {
        await supabase.from('profiles').upsert({
          id: user.id,
          pref_vol_voice: preset.values.voice,
          pref_vol_ambient: preset.values.ambient,
          pref_vol_binaural: preset.values.binaural,
          pref_vol_master: 100,
        });
      }
      Analytics.onboardingStepCompleted('preferences', user?.id);
      await new Promise((r) => setTimeout(r, 300));
      router.push('/onboarding/guide');
    } catch {
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingStepLayout
      step={3}
      title="How do you like your audio?"
      subtitle="Choose a preset. You can fine-tune later in settings."
      primaryLabel="Continue →"
      onSubmit={handleContinue}
      loading={isSubmitting}
      primaryDisabled={!selected}
      skipHref="/onboarding/guide"
      skipLabel="Use defaults"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: spacing.md,
          width: '100%',
        }}
      >
        {PRESETS.map((preset) => {
          const isActive = selected === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSelected(preset.id)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: `${spacing.lg} ${spacing.md}`,
                borderRadius: borderRadius.lg,
                background: isActive ? `${colors.accent.primary}25` : colors.glass.light,
                backdropFilter: BLUR.lg,
                WebkitBackdropFilter: BLUR.lg,
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
              <span style={{ fontSize: '28px', lineHeight: 1 }}>{preset.emoji}</span>
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
                {preset.label}
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
                {preset.sub}
              </Typography>
            </button>
          );
        })}
      </div>
    </OnboardingStepLayout>
  );
}
