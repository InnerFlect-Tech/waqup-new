'use client';

import React from 'react';
import { ContentCreateLayout } from '@/components';

export default function MeditationCreateLayout({ children }: { children: React.ReactNode }) {
  return <ContentCreateLayout contentType="meditation">{children}</ContentCreateLayout>;
}
