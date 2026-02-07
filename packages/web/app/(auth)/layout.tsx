import React from 'react';
import { ThemeProvider } from '@/theme';
import { ThemeSelector } from '@/components';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider defaultThemeName="mystical-purple">
      <ThemeSelector />
      {children}
    </ThemeProvider>
  );
}
