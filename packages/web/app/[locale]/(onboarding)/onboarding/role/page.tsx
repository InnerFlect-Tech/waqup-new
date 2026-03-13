'use client';

import React, { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

/**
 * Role step removed from onboarding flow.
 * Redirects to guide so old links and bookmarks still work.
 */
export default function OnboardingRolePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/onboarding/guide');
  }, [router]);

  return null;
}
