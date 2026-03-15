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

  /** Safe-area aware padding — required for notched iPhones when viewport-fit=cover. */
  const safePaddingTop = centered
    ? `max(${PAGE_PADDING}, env(safe-area-inset-top, 0px))`
    : `max(${PAGE_TOP_PADDING}, env(safe-area-inset-top, 0px))`;
  const safePaddingBottom = `max(${PAGE_PADDING}, env(safe-area-inset-bottom, 0px))`;

  /** When bare + allowDocumentScroll: page controls layout; apply horizontal padding for header alignment, skip inner maxWidth wrapper. */
  const contentStyle: React.CSSProperties = bare && allowDocumentScroll
    ? {
        position: 'relative',
        zIndex: 1,
        minWidth: 0,
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
      }
    : {
        position: 'relative',
        zIndex: 1,
        minHeight: '100%',
        paddingTop: safePaddingTop,
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        paddingBottom: safePaddingBottom,
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
    <div
      className={!allowDocumentScroll ? 'u-h-dvh' : undefined}
      style={wrapperStyle}
    >
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
