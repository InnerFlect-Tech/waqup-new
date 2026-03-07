'use client';

import React from 'react';
import { ContentCreateLayout } from '@/components';

export default function AffirmationCreateLayout({ children }: { children: React.ReactNode }) {
  return <ContentCreateLayout contentType="affirmation">{children}</ContentCreateLayout>;
}
