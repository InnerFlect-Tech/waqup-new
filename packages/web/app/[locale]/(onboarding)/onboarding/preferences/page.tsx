'use client';

import React, { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

/**
 * Preferences step removed from onboarding flow.
 * Redirects to guide so old links and bookmarks still work.
 */
export default function OnboardingPreferencesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/onboarding/guide');
  }, [router]);

  return null;
}
