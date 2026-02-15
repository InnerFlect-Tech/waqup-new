import React from 'react';
import { ThemeSelector, AppHeader } from '@/components';

export default function SanctuaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeSelector />
      <AppHeader variant="authenticated" />
      {children}
    </>
  );
}
