'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OnboardingStepLayout } from '@/components';
import { Input } from '@/components';
import { useAuthStore } from '@/stores';
import { supabase } from '@/lib/supabase';
import { Analytics } from '@waqup/shared/utils';

export default function OnboardingProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
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
  }, [user?.user_metadata?.full_name, user?.email]);

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
      router.push('/onboarding/preferences');
    } catch {
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingStepLayout
      step={2}
      title="What should we call you?"
      subtitle="We'll use this when we speak to you in your rituals. You can change it anytime."
      primaryLabel="Continue →"
      onSubmit={handleContinue}
      loading={isSubmitting}
      skipHref="/onboarding/preferences"
      skipLabel="Skip for now"
    >
      <Input
        placeholder="e.g. Alex"
        value={preferredName}
        onChange={(e) => setPreferredName(e.target.value)}
        autoComplete="given-name"
        aria-label="Preferred name"
      />
    </OnboardingStepLayout>
  );
}
