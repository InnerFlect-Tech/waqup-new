import React from 'react';
import { ThemeSelector, AppHeader } from '@/components';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeSelector />
      <AppHeader variant="public" />
      {children}
    </>
  );
}
