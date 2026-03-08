'use client';

import React, { useId } from 'react';
import { useTheme } from '@/theme';

export interface QCoinProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Override color for the Q (defaults to theme accent.tertiary) */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_MAP = {
  sm: 20,
  md: 28,
  lg: 48,
} as const;

/**
 * QCoin - Branded credits icon for waQup
 * Minimalist coin-like shape with Q in the center, using theme accent color.
 * Used for credits/Qs display across the app.
 */
export const QCoin: React.FC<QCoinProps> = ({
  size = 'md',
  color,
  className = '',
  style,
}) => {
  const { theme } = useTheme();
  const id = useId().replace(/:/g, '-');
  const qColor = color ?? theme.colors.accent.tertiary;
  const px = SIZE_MAP[size];
  const r = 12; // viewBox is 0 0 24 24

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
        ...style,
      }}
    >
      <defs>
        <radialGradient id={`qcoin-face-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="70%" stopColor="rgba(220,220,235,0.7)" />
          <stop offset="100%" stopColor="rgba(180,185,210,0.5)" />
        </radialGradient>
      </defs>
      <circle
        cx={r}
        cy={r}
        r={r - 0.5}
        fill={`url(#qcoin-face-${id})`}
        stroke="rgba(0,0,0,0.08)"
        strokeWidth={0.5}
      />
      <text
        x={r}
        y={r}
        textAnchor="middle"
        dominantBaseline="central"
        fill={qColor}
        fontSize={size === 'sm' ? 10 : size === 'md' ? 14 : 20}
        fontWeight={600}
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        Q
      </text>
    </svg>
  );
};
