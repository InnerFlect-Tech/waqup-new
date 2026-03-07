'use client';

import React from 'react';
import {
  CONTENT_MAX_WIDTH,
  CONTENT_NARROW,
  CONTENT_MEDIUM,
  AUTH_CARD_MAX_WIDTH,
} from '@/theme';

type ContentWidth = 'default' | 'narrow' | 'medium' | 'auth';

const WIDTH_MAP: Record<ContentWidth, string> = {
  default: CONTENT_MAX_WIDTH,
  narrow: CONTENT_NARROW,
  medium: CONTENT_MEDIUM,
  auth: AUTH_CARD_MAX_WIDTH,
};

export interface PageContentProps {
  children: React.ReactNode;
  /** Content width preset - uses design tokens for consistency */
  width?: ContentWidth;
  /** Max width override (px number or string) - overrides width when set */
  maxWidth?: number | string;
  /** Center content block and text */
  centered?: boolean;
  /** Additional styles */
  style?: React.CSSProperties;
}

/**
 * Consistent page content wrapper.
 * Uses design tokens for max-width. Single source of truth for layout consistency.
 */
export const PageContent: React.FC<PageContentProps> = ({
  children,
  width = 'default',
  maxWidth: maxWidthOverride,
  centered = false,
  style,
}) => {
  const maxWidth =
    maxWidthOverride != null
      ? typeof maxWidthOverride === 'number'
        ? `${maxWidthOverride}px`
        : maxWidthOverride
      : WIDTH_MAP[width];

  return (
    <div
      style={{
        width: '100%',
        maxWidth,
        margin: '0 auto',
        ...(centered && { textAlign: 'center' }),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
