import React from 'react';
import { ThemeSelector, AppHeader } from '@/components';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeSelector />
      <AppHeader variant="simplified" />
      {children}
    </>
  );
}
