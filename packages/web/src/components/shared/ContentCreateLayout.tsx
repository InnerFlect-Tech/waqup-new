'use client';

import React from 'react';
import { ContentCreationProvider, useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { PageShell } from '@/components';
import { CreateProgressBar } from './CreateProgressBar';
import { spacing } from '@/theme';
import type { ContentItemType } from '@waqup/shared/types';

const PADDING_STYLE: React.CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  paddingTop: spacing.xl,
  paddingBottom: spacing.xl,
  paddingLeft: spacing.md,
  paddingRight: spacing.md,
};

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { currentStep } = useContentCreation();
  return (
    <div style={PADDING_STYLE}>
      <CreateProgressBar currentStep={currentStep} />
      {children}
    </div>
  );
}

export function ContentCreateLayout({
  contentType,
  children,
}: {
  contentType: ContentItemType;
  children: React.ReactNode;
}) {
  return (
    <ContentCreationProvider contentType={contentType}>
      <PageShell intensity="medium">
        <LayoutInner>{children}</LayoutInner>
      </PageShell>
    </ContentCreationProvider>
  );
}
