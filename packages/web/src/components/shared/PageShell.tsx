'use client';

import React from 'react';
import { useTheme } from '@/theme';
import { AnimatedBackground } from './AnimatedBackground';
import { CONTENT_MAX_WIDTH, PAGE_PADDING, PAGE_TOP_PADDING, PAGE_HORIZONTAL_PADDING, HEADER_PADDING_X } from '@/theme';

export interface PageShellProps {
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'strong' | 'high';
  maxWidth?: string | number;
  centered?: boolean;
  bare?: boolean;
  plain?: boolean;
  scrollSnap?: boolean;
  centerVertically?: boolean;
  /** Use layout scroll (AppLayout) — no inner overflow. For long pages with footer. */
  allowDocumentScroll?: boolean;
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  intensity = 'medium',
  maxWidth = CONTENT_MAX_WIDTH,
  centered = false,
  bare = false,
  plain = false,
  scrollSnap = false,
  centerVertically = false,
  allowDocumentScroll = false,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const horizontalPadding =
    centered || (typeof maxWidth === 'number' && maxWidth < 600)
      ? PAGE_PADDING
      : `clamp(${PAGE_PADDING}, 5vw, ${HEADER_PADDING_X})`;

  /** When bare + allowDocumentScroll: page controls layout; minimal wrapper only for stacking. */
  const contentStyle: React.CSSProperties = bare && allowDocumentScroll
    ? { position: 'relative', zIndex: 1, minWidth: 0 }
    : {
        position: 'relative',
        zIndex: 1,
        minHeight: '100dvh',
        paddingTop: centered ? PAGE_PADDING : PAGE_TOP_PADDING,
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        paddingBottom: PAGE_PADDING,
        ...(centered && {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }),
        ...(centerVertically && !centered && {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }),
      };

  const innerStyle: React.CSSProperties =
    bare && !allowDocumentScroll
      ? {}
      : {
          width: '100%',
          maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        };

  const wrapperStyle: React.CSSProperties = allowDocumentScroll
    ? { position: 'relative', minWidth: 0, overflowX: 'hidden' as const }
    : {
        position: 'relative',
        minHeight: '100dvh',
        height: '100dvh',
        width: '100%',
        minWidth: 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        ...(scrollSnap && {
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }),
      };

  return (
    <div style={wrapperStyle}>
      {!plain && <AnimatedBackground intensity={intensity} color="primary" />}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: plain ? colors.background.primary : colors.gradients.mystical,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={contentStyle}>
        {bare ? children : <div style={innerStyle}>{children}</div>}
      </div>
    </div>
  );
};
