import React from 'react';
import { ThemeSelector } from '@/components';

export default function AuthSegmentLayout({
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
