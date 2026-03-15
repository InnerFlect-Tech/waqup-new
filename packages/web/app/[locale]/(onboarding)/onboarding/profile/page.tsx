'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { OnboardingStepLayout } from '@/components';
import { Input, Typography } from '@/components';
import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@waqup/shared/utils';
import { useTranslations } from 'next-intl';
import { useTheme, spacing, borderRadius, BLUR } from '@/theme';

const APPLICATION_KEYS = ['teachers', 'coaches', 'creators', 'studios'] as const;

export default function OnboardingProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const { theme } = useTheme();
  const colors = theme.colors;
  const t = useTranslations('onboarding.profile');
  const [preferredName, setPreferredName] = useState('');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [focusedApplication, setFocusedApplication] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const intentionParam = searchParams.get('intention') ?? undefined;

  useEffect(() => {
    const firstName =
      user?.user_metadata?.full_name?.split(' ')[0] ||
      user?.email?.split('@')[0] ||
      '';
    if (firstName && !preferredName) {
      setPreferredName(firstName);
    }
  }, [user?.user_metadata?.full_name, user?.email, preferredName]);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('profiles')
      .select('preferred_name, onboarding_applications')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setPreferredName((prev) => (data?.preferred_name && !prev ? data.preferred_name : prev));
        setSelectedApplications((prev) =>
          data?.onboarding_applications?.length && prev.length === 0 ? data.onboarding_applications : prev
        );
      })
      .catch(() => {});
  }, [user?.id]);

  const toggleApplication = (key: string) => {
    setSelectedApplications((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      if (user?.id) {
        const updates: {
          preferred_name?: string;
          onboarding_intention?: string;
          onboarding_applications?: string[];
        } = {};
        if (preferredName.trim()) {
          updates.preferred_name = preferredName.trim();
        }
        if (intentionParam) {
          updates.onboarding_intention = intentionParam;
        }
        if (selectedApplications.length > 0) {
          updates.onboarding_applications = selectedApplications;
        }
        if (Object.keys(updates).length > 0) {
          await supabase.from('profiles').upsert({
            id: user.id,
            ...updates,
          });
        }
      }
      Analytics.onboardingStepCompleted('profile', user?.id);
      await new Promise((r) => setTimeout(r, 300));
      router.push('/onboarding/guide');
    } catch {
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showExplanation = focusedApplication ?? (selectedApplications.length === 1 ? selectedApplications[0] : null);

  return (
    <OnboardingStepLayout
      step={4}
      title={t('title')}
      subtitle={t('subtitle')}
      primaryLabel={t('primaryLabel')}
      onSubmit={handleContinue}
      loading={isSubmitting}
      skipHref="/onboarding/guide"
      skipLabel={t('skipLabel')}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.lg, width: '100%' }}>
        <Input
          placeholder={t('placeholder')}
          value={preferredName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPreferredName(e.target.value)}
          autoComplete="given-name"
          aria-label={t('title')}
        />

        <div>
          <Typography
            variant="small"
            style={{
              color: colors.text.secondary,
              fontWeight: 600,
              marginBottom: spacing.sm,
              display: 'block',
            }}
          >
            {t('applicationsTitle')}
          </Typography>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: spacing.sm,
            }}
          >
            {APPLICATION_KEYS.map((key) => {
              const isSelected = selectedApplications.includes(key);
              const showExp = showExplanation === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleApplication(key)}
                  onFocus={() => setFocusedApplication(key)}
                  onBlur={() => setFocusedApplication(null)}
                  onMouseEnter={() => setFocusedApplication(key)}
                  onMouseLeave={() => setFocusedApplication(null)}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: `${spacing.md} ${spacing.lg}`,
                    borderRadius: borderRadius.lg,
                    background: isSelected ? `${colors.accent.primary}20` : colors.glass.light,
                    backdropFilter: BLUR.lg,
                    WebkitBackdropFilter: BLUR.lg,
                    border: `1px solid ${isSelected ? colors.accent.primary : colors.glass.border}`,
                    color: colors.text.primary,
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    boxShadow: showExp ? `0 0 20px ${colors.accent.primary}25` : undefined,
                  }}
                >
                  {t(`applications.${key}.label`)}
                </button>
              );
            })}
          </div>
          {showExplanation && (
            <div
              style={{
                marginTop: spacing.sm,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                background: `${colors.accent.primary}12`,
                border: `1px solid ${colors.accent.primary}30`,
              }}
            >
              <Typography
                variant="body"
                style={{
                  color: colors.text.secondary,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {t(`applications.${showExplanation}.explanation`)}
              </Typography>
            </div>
          )}
          <Typography
            variant="small"
            style={{
              color: colors.text.tertiary ?? colors.text.secondary,
              marginTop: spacing.sm,
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            {t('applicationsNote')}
          </Typography>
        </div>
      </div>
    </OnboardingStepLayout>
  );
}
