'use client';

import React, { useId } from 'react';
import { useTheme } from '@/theme';

export interface QCoinProps {
  size?: 'sm' | 'md' | 'lg';
  /** When provided, renders the coin inline with a numeric amount beside it */
  showAmount?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_MAP = { sm: 20, md: 28, lg: 48 } as const;
const FONT_MAP = { sm: 9, md: 13, lg: 22 } as const;
const AMOUNT_FONT_MAP = { sm: 12, md: 14, lg: 20 } as const;

/**
 * QCoin — waQup branded credit icon.
 *
 * Mirrors the waQup logo aesthetic: a glowing purple orb with the "Q" mark
 * at its centre. Pass `showAmount` to display a live credit balance inline.
 */
export const QCoin: React.FC<QCoinProps> = ({
  size = 'md',
  showAmount,
  className = '',
  style,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const id = useId().replace(/:/g, '-');
  const px = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];
  const r = 12; // viewBox 0 0 24 24

  const coin = (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0, overflow: 'visible' }}
    >
      <defs>
        {/* Outer glow — soft purple halo */}
        <filter id={`qcoin-halo-${id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" in="SourceGraphic" result="blur" />
          <feFlood floodColor={colors.accent.primary} floodOpacity="0.55" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Main orb gradient — purple core, dark edge */}
        <radialGradient id={`qcoin-face-${id}`} cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor={colors.accent.tertiary} />
          <stop offset="35%" stopColor={colors.accent.primary} />
          <stop offset="70%" stopColor={colors.accent.secondary} />
          <stop offset="100%" stopColor={colors.accent.secondary} />
        </radialGradient>

        {/* Inner shine — top-left white-violet sweep */}
        <radialGradient id={`qcoin-shine-${id}`} cx="30%" cy="28%" r="55%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.40)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>

        {/* Rim gradient — deep purple ring */}
        <linearGradient id={`qcoin-rim-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.accent.primary} />
          <stop offset="100%" stopColor={colors.accent.secondary} />
        </linearGradient>
      </defs>

      {/* Glow wrapper */}
      <g filter={`url(#qcoin-halo-${id})`}>
        {/* Dark outer rim */}
        <circle cx={r} cy={r} r={r - 0.25} fill={`url(#qcoin-rim-${id})`} />

        {/* Purple orb face */}
        <circle cx={r} cy={r} r={r - 1.5} fill={`url(#qcoin-face-${id})`} />

        {/* Shine overlay */}
        <circle cx={r} cy={r} r={r - 1.5} fill={`url(#qcoin-shine-${id})`} />

        {/* Q mark — crisp white */}
        <text
          x={r}
          y={r}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#FFFFFF"
          fontSize={fontSize}
          fontWeight={700}
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          Q
        </text>
      </g>
    </svg>
  );

  if (showAmount !== undefined) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: size === 'lg' ? 8 : 5,
          ...style,
        }}
      >
        {coin}
        <span
          style={{
            fontSize: AMOUNT_FONT_MAP[size],
            fontWeight: 700,
            color: colors.accent.primary,
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          {showAmount}
        </span>
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, ...style }}
    >
      {coin}
    </span>
  );
};
