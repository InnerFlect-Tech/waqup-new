import React from 'react';
import { ThemeSelector } from '@/components';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeSelector />
      {children}
    </>
  );
}
