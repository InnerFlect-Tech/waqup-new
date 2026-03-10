'use client';

import React from 'react';
import { ContentCreationProvider, useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { PageShell } from '@/components';
import { CreateProgressBar } from './CreateProgressBar';
import { spacing, PAGE_PADDING, HEADER_PADDING_X } from '@/theme';
import type { ContentItemType } from '@waqup/shared/types';

/** Aligns with PageShell responsive horizontal padding; same as main app pages */
const HORIZONTAL_PADDING = `clamp(${PAGE_PADDING}, 5vw, ${HEADER_PADDING_X})`;

const LAYOUT_STYLE: React.CSSProperties = {
  minHeight: '100vh',
  width: '100%',
  paddingTop: spacing.lg,
  paddingBottom: spacing.xl,
  paddingLeft: HORIZONTAL_PADDING,
  paddingRight: HORIZONTAL_PADDING,
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
