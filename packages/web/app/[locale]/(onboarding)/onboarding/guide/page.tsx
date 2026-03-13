'use client';

import React, { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { OnboardingStepLayout } from '@/components';
import { Typography, Button, ContentIcon } from '@/components';
import { useTheme, spacing, borderRadius, BLUR } from '@/theme';
import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@waqup/shared/utils';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

const QUICK_START_OPTIONS = [
  {
    id: 'affirmation',
    iconSrc: '/images/icon-affirmations.png',
    label: 'Create my first affirmation',
    sub: 'Cognitive re-patterning · 1 min · 1 Q',
    href: '/create/orb?type=affirmation',
    color: '#c084fc',
  },
  {
    id: 'meditation',
    iconSrc: '/images/icon-meditations.png',
    label: 'Create a short meditation',
    sub: 'State induction · 5 min · 2 Q',
    href: '/create/orb?type=meditation',
    color: '#60a5fa',
  },
  {
    id: 'ritual',
    iconSrc: '/images/icon-rituals.png',
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
  const t = useTranslations('onboarding.guide');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEnter = async () => {
    setIsSubmitting(true);
    Analytics.onboardingStepCompleted('guide', user?.id);
    if (user?.id) {
      await supabase.from('profiles').update({ onboarding_completed_at: new Date().toISOString() }).eq('id', user.id);
    }
    await new Promise((r) => setTimeout(r, 400));
    router.push('/sanctuary');
  };

  const handleCreateNow = async (href: string) => {
    Analytics.onboardingStepCompleted('guide-create', user?.id);
    if (user?.id) {
      await supabase.from('profiles').update({ onboarding_completed_at: new Date().toISOString() }).eq('id', user.id);
    }
    router.push(href);
  };

  return (
    <OnboardingStepLayout
      step={5}
      title={t('title')}
      primaryLabel={t('primaryLabel')}
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
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background = `${item.color}20`;
              e.currentTarget.style.borderColor = `${item.color}60`;
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.background = `${item.color}10`;
              e.currentTarget.style.borderColor = `${item.color}30`;
            }}
          >
            <ContentIcon src={item.iconSrc} size={40} borderRadius={10} style={{ flexShrink: 0 }} />
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

        {/* Learning teaser */}
        <div
          style={{
            marginTop: spacing.md,
            padding: `${spacing.md} ${spacing.lg}`,
            borderRadius: borderRadius.md,
            background: `${colors.accent.primary}0A`,
            border: `1px solid ${colors.accent.primary}20`,
          }}
        >
          <Typography
            variant="small"
            style={{ color: colors.text.secondary, fontSize: '13px', lineHeight: 1.6 }}
          >
            {t('learningTeaser')}{' '}
            <Link href="/sanctuary/learn" style={{ color: colors.accent.tertiary, textDecoration: 'none', fontWeight: 600 }}>
              Learn →
            </Link>
          </Typography>
        </div>

        {/* Community block */}
        <div
          style={{
            marginTop: spacing.sm,
            padding: `${spacing.md} ${spacing.lg}`,
            borderRadius: borderRadius.md,
            background: colors.glass.light,
            backdropFilter: BLUR.sm,
            WebkitBackdropFilter: BLUR.sm,
            border: `1px solid ${colors.glass.border}`,
          }}
        >
          <Typography
            variant="small"
            style={{ color: colors.text.secondary, fontSize: '13px', lineHeight: 1.6, marginBottom: spacing.xs }}
          >
            {t('communityBlock')}
          </Typography>
          <Link
            href="/community"
            style={{
              color: colors.accent.tertiary,
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            {t('communityLink')}
          </Link>
        </div>
      </div>
    </OnboardingStepLayout>
  );
}
