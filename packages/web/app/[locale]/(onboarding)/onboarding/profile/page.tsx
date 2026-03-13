'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { OnboardingStepLayout } from '@/components';
import { Input, Typography } from '@/components';
import { Link } from '@/i18n/navigation';
import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@waqup/shared/utils';
import { useTranslations } from 'next-intl';
import { useTheme, spacing, borderRadius, BLUR } from '@/theme';

const APPLICATION_LINKS = [
  { id: 'teachers', href: '/for-teachers', key: 'teachers' as const },
  { id: 'coaches', href: '/for-coaches', key: 'coaches' as const },
  { id: 'creators', href: '/for-creators', key: 'creators' as const },
  { id: 'studios', href: '/for-studios', key: 'studios' as const },
] as const;

export default function OnboardingProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const { theme } = useTheme();
  const colors = theme.colors;
  const t = useTranslations('onboarding.profile');
  const [preferredName, setPreferredName] = useState('');
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

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      if (user?.id) {
        const updates: { preferred_name?: string; onboarding_intention?: string } = {};
        if (preferredName.trim()) {
          updates.preferred_name = preferredName.trim();
        }
        if (intentionParam) {
          updates.onboarding_intention = intentionParam;
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
            {APPLICATION_LINKS.map(({ id, href, key }) => (
              <Link
                key={id}
                href={href}
                style={{
                  padding: `${spacing.md} ${spacing.lg}`,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  backdropFilter: BLUR.lg,
                  WebkitBackdropFilter: BLUR.lg,
                  border: `1px solid ${colors.glass.border}`,
                  textDecoration: 'none',
                  color: colors.text.primary,
                  fontSize: 14,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${colors.accent.primary}15`;
                  e.currentTarget.style.borderColor = colors.accent.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = colors.glass.light;
                  e.currentTarget.style.borderColor = colors.glass.border;
                }}
              >
                {t(`applications.${key}`)}
              </Link>
            ))}
          </div>
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
