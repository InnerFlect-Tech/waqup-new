'use client';

import React from 'react';
import { PlaceholderPage } from '@/components';
import Link from 'next/link';
import { Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

export default function OnboardingPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PlaceholderPage
      title="Onboarding"
      description="Welcome to waQup. Complete your profile to personalize your experience."
      backHref="/"
    >
      <div style={{ marginTop: spacing.lg }}>
        <Link href="/onboarding/profile" style={{ textDecoration: 'none', marginRight: spacing.md }}>
          <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
            Continue to Profile
          </Button>
        </Link>
      </div>
    </PlaceholderPage>
  );
}
