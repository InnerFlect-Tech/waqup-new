'use client';

import React from 'react';
import Link from 'next/link';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

export interface LogoProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show icon - DEPRECATED: Logo is now text-only */
  showIcon?: boolean;
  /** Link href (default: '/') */
  href?: string;
  /** Custom className */
  className?: string;
}

/**
 * Logo Component - waQup text-only logo
 * 
 * Features:
 * - Text-only logo (no icon/image)
 * - Very thin font weight (300 - light) for elegant, minimal appearance
 * - Q letter highlighted in purple gradient
 * - Matches the thin, elegant logo style from design reference
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showIcon = false, // Default to false - logo is now text-only
  href = '/',
  className = '',
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const sizeMap = {
    sm: { icon: '24px', fontSize: '20px', gap: spacing.sm },
    md: { icon: '32px', fontSize: '24px', gap: spacing.md },
    lg: { icon: '48px', fontSize: '32px', gap: spacing.lg },
  };

  const { icon, fontSize, gap } = sizeMap[size];

  const logoContent = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className={className}
    >
      {/* Text-only logo - no icon/image */}
      <div
        style={{
          color: colors.text.primary,
          fontWeight: 300, // Very thin weight (light) - matches example
          letterSpacing: '-1px', // Tighter letter spacing like the large centered logo
          fontSize: fontSize,
          lineHeight: 1,
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
          // Ensure consistent thin thickness across all characters
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          fontFeatureSettings: '"liga" 1, "kern" 1', // Enable ligatures and kerning for consistent rendering
          textRendering: 'optimizeLegibility',
          // Match the style from the example - very thin, elegant, consistent
        }}
      >
        <span style={{ fontWeight: 300, color: colors.text.primary }}>wa</span>
        <span style={{ color: colors.accent.tertiary, fontWeight: 300 }}>Q</span>
        <span style={{ fontWeight: 300, color: colors.text.primary }}>up</span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'inline-block' }}>
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};
