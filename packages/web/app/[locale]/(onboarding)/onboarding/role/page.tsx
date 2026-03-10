'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { OnboardingStepLayout } from '@/components';
import { Typography } from '@/components';
import { useTheme, spacing, borderRadius, BLUR } from '@/theme';
import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@waqup/shared/utils';

export type UserRole = 'personal' | 'teacher' | 'coach' | 'studio' | 'creator';

const ROLES: Array<{
  id: UserRole;
  emoji: string;
  label: string;
  sub: string;
}> = [
  {
    id: 'personal',
    emoji: '🌱',
    label: 'Personal practice',
    sub: 'I want to build a daily practice for myself',
  },
  {
    id: 'teacher',
    emoji: '🎙️',
    label: 'Meditation or breathwork teacher',
    sub: 'I teach classes and want to create a session library',
  },
  {
    id: 'coach',
    emoji: '🧠',
    label: 'Coach or facilitator',
    sub: 'I work with clients and want to create audio homework',
  },
  {
    id: 'studio',
    emoji: '🏛️',
    label: 'Yoga studio or retreat',
    sub: 'I run a space and want take-home rituals for students',
  },
  {
    id: 'creator',
    emoji: '✨',
    label: 'Creator or influencer',
    sub: 'I have an audience and want to drop audio content',
  },
];

const ROLE_DESTINATIONS: Record<UserRole, string> = {
  personal: '/onboarding/preferences',
  teacher: '/onboarding/preferences',
  coach: '/onboarding/preferences',
  studio: '/onboarding/preferences',
  creator: '/onboarding/preferences',
};

export default function OnboardingRolePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      if (user?.id) {
        await supabase.from('profiles').upsert({
          id: user.id,
          user_role: selected,
        });
      }
      Analytics.onboardingStepCompleted('role', user?.id);
      await new Promise((r) => setTimeout(r, 300));
      router.push(ROLE_DESTINATIONS[selected]);
    } catch {
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingStepLayout
      step={3}
      title="How will you use waQup?"
      subtitle="This helps us set up the right experience for you. You can always change this later."
      primaryLabel="Continue →"
      onSubmit={handleContinue}
      loading={isSubmitting}
      primaryDisabled={!selected}
      skipHref="/onboarding/preferences"
      skipLabel="Skip for now"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.sm,
          width: '100%',
        }}
      >
        {ROLES.map((role) => {
          const isActive = selected === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelected(role.id)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                padding: `${spacing.md} ${spacing.lg}`,
                borderRadius: borderRadius.lg,
                background: isActive ? `${colors.accent.primary}20` : colors.glass.light,
                backdropFilter: BLUR.lg,
                WebkitBackdropFilter: BLUR.lg,
                border: `1px solid ${isActive ? colors.accent.primary : colors.glass.border}`,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.md,
                transition: 'all 0.2s ease',
                boxShadow: isActive ? `0 0 20px ${colors.accent.primary}30` : undefined,
                minHeight: '44px',
              }}
            >
              <span
                style={{
                  fontSize: '24px',
                  lineHeight: 1,
                  width: 40,
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                {role.emoji}
              </span>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <Typography
                  variant="body"
                  style={{
                    color: isActive ? colors.accent.primary : colors.text.primary,
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: 1.3,
                    transition: 'color 0.2s ease',
                    marginBottom: '2px',
                  }}
                >
                  {role.label}
                </Typography>
                <Typography
                  variant="small"
                  style={{
                    color: colors.text.secondary,
                    fontSize: '12px',
                    lineHeight: 1.4,
                  }}
                >
                  {role.sub}
                </Typography>
              </div>
              {isActive && (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: colors.accent.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </OnboardingStepLayout>
  );
}
