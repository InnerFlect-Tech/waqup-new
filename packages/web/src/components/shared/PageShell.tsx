'use client';

import React from 'react';
import { useTheme } from '@/theme';
import { AnimatedBackground } from './AnimatedBackground';
import { CONTENT_MAX_WIDTH, PAGE_PADDING, PAGE_TOP_PADDING, HEADER_PADDING_X } from '@/theme';

export interface PageShellProps {
  children: React.ReactNode;
  /** AnimatedBackground intensity */
  intensity?: 'light' | 'medium' | 'strong' | 'high';
  /** Max width of content container (default: 1400px; use 480px for auth) */
  maxWidth?: string | number;
  /** Center content vertically (for auth pages) */
  centered?: boolean;
  /** Skip content container wrapper (use when page needs custom layout) */
  bare?: boolean;
  /** Plain dark background with no animated orbs — used on auth pages */
  plain?: boolean;
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  intensity = 'medium',
  maxWidth = CONTENT_MAX_WIDTH,
  centered = false,
  bare = false,
  plain = false,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  /** Auth/centered pages use smaller padding; main app pages use responsive padding that aligns with header on large screens */
  const horizontalPadding =
    centered || (typeof maxWidth === 'number' && maxWidth < 600)
      ? PAGE_PADDING
      : `clamp(${PAGE_PADDING}, 5vw, ${HEADER_PADDING_X})`;

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
    paddingTop: centered ? PAGE_PADDING : PAGE_TOP_PADDING,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
    paddingBottom: PAGE_PADDING,
    ...(centered && {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),
  };

  const innerStyle: React.CSSProperties = bare
    ? {}
    : {
        width: '100%',
        maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        margin: centered ? '0 auto' : '0 auto',
        position: 'relative',
        zIndex: 1,
      };

  return (
    <div
      style={{
        minHeight: '100vh',
        height: '100vh',
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
      }}
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
