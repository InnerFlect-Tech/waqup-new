'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
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
export const Logo: React.FC<LogoProps> = (props) => {
  const {
    size = 'md',
    showIcon = false, // Default to false - logo is now text-only
    href,
    className = '',
  } = props;
  const { theme } = useTheme();
  const colors = theme.colors;

  // When href is omitted, default to '/'. When href={undefined} is passed (e.g. parent wraps in Link), render no link to avoid nested <a>.
  const hasHrefProp = 'href' in props;
  const linkHref = !hasHrefProp ? '/' : (href ?? '/');
  const renderAsLink = !hasHrefProp || (href != null && href !== '');

  const sizeMap = {
    sm: { icon: '24px', fontSize: '20px', gap: spacing.sm },
    md: { icon: '32px', fontSize: '24px', gap: spacing.md },
    lg: { icon: '48px', fontSize: '32px', gap: spacing.lg },
  };

  const { fontSize } = sizeMap[size];

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
          fontWeight: 300,
          letterSpacing: size === 'lg' ? '-2px' : '-1px',
          fontSize: fontSize,
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
          transform: 'translateY(-1px)', /* optical centering: font metrics make text appear low */
        }}
      >
        <span style={{ fontWeight: 300, color: colors.text.primary }}>wa</span>
        {size === 'lg' ? (
          // Hero logo: gradient Q from purple-400 to indigo-400
          <span
            style={{
              fontWeight: 300,
              background: 'linear-gradient(to right, #c084fc, #818cf8)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            Q
          </span>
        ) : (
          <span style={{ color: colors.accent.tertiary, fontWeight: 300 }}>Q</span>
        )}
        <span style={{ fontWeight: 300, color: colors.text.primary }}>up</span>
      </div>
    </div>
  );

  if (renderAsLink) {
    return (
      <Link
        href={linkHref}
        className="waqup-logo-link"
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};
