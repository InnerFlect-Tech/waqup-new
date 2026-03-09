'use client';

import React from 'react';
import { ContentCreationProvider, useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { PageShell } from '@/components';
import { CreateProgressBar } from './CreateProgressBar';
import { spacing } from '@/theme';
import type { ContentItemType } from '@waqup/shared/types';

const LAYOUT_STYLE: React.CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  paddingTop: spacing.lg,
  paddingBottom: spacing.xl,
  paddingLeft: spacing.md,
  paddingRight: spacing.md,
  display: 'flex',
  flexDirection: 'column',
};

const CONTENT_WRAPPER_STYLE: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { currentStep } = useContentCreation();
  return (
    <div style={LAYOUT_STYLE}>
      <CreateProgressBar currentStep={currentStep} />
      <div style={CONTENT_WRAPPER_STYLE}>{children}</div>
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
