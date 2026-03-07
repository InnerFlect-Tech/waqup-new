'use client';

import React from 'react';
import { ContentCreateLayout } from '@/components';

export default function RitualCreateLayout({ children }: { children: React.ReactNode }) {
  return <ContentCreateLayout contentType="ritual">{children}</ContentCreateLayout>;
}
