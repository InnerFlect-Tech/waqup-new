'use client';

import React from 'react';
import { useTheme } from '@/theme';
import { CONTENT_MAX_WIDTH, LANDING_SECTION_PADDING_Y, PAGE_HORIZONTAL_PADDING, SECTION_TITLE_FONT_SIZE, SECTION_SUBTITLE_FONT_SIZE, spacing } from '@/theme';

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
        paddingLeft: PAGE_HORIZONTAL_PADDING,
        paddingRight: PAGE_HORIZONTAL_PADDING,
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
                fontSize: SECTION_TITLE_FONT_SIZE,
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
                margin: centered ? '0 auto' : 0,
                fontSize: SECTION_SUBTITLE_FONT_SIZE,
                lineHeight: 1.5,
                color: colors.text.secondary,
                maxWidth: 560,
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
