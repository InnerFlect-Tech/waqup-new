'use client';

import React from 'react';
import { ContentCreationProvider } from '@/lib/contexts/ContentCreationContext';
import { PageShell } from '@/components';
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
        <div style={PADDING_STYLE}>
          {children}
        </div>
      </PageShell>
    </ContentCreationProvider>
  );
}
