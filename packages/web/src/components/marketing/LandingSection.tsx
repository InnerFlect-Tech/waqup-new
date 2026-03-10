'use client';

import React from 'react';
import { useTheme } from '@/theme';
import { CONTENT_MAX_WIDTH, LANDING_SECTION_PADDING_Y, spacing } from '@/theme';

export interface LandingSectionProps {
  children: React.ReactNode;
  /** Optional section heading */
  title?: string;
  /** Optional section subtitle */
  subtitle?: string;
  /** Center title/subtitle text */
  centered?: boolean;
  /** Skip bottom padding (when section flows into next) */
  noBottomPadding?: boolean;
}

export function LandingSection({
  children,
  title,
  subtitle,
  centered = true,
  noBottomPadding = false,
}: LandingSectionProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <section
      className="landing-section"
      style={{
        paddingTop: LANDING_SECTION_PADDING_Y,
        paddingBottom: noBottomPadding ? 0 : LANDING_SECTION_PADDING_Y,
        paddingLeft: 'clamp(16px, 4vw, 32px)',
        paddingRight: 'clamp(16px, 4vw, 32px)',
        maxWidth: CONTENT_MAX_WIDTH,
        margin: '0 auto',
        width: '100%',
        minWidth: 0,
      }}
    >
      {(title || subtitle) && (
        <div
          style={{
            textAlign: centered ? 'center' : 'left',
            marginBottom: spacing.xxl,
            maxWidth: CONTENT_MAX_WIDTH,
          }}
        >
          {title && (
            <h2
              style={{
                margin: 0,
                marginBottom: subtitle ? spacing.sm : 0,
                fontSize: 'clamp(24px, 4vw, 32px)',
                fontWeight: 300,
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: colors.text.primary,
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(15px, 1.8vw, 17px)',
                lineHeight: 1.5,
                color: colors.text.secondary,
                maxWidth: 560,
                ...(centered && { margin: '0 auto' }),
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
