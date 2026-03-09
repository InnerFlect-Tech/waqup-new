'use client';

import React from 'react';

export type AvatarOrbColors = [string, string, string]; // [core, ring, glow]

interface AvatarOrbProps {
  colors: AvatarOrbColors;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const SIZES = { sm: 36, md: 48, lg: 64 } as const;

export const AVATAR_SWATCHES: { name: string; hex: string }[] = [
  { name: 'Cosmic',  hex: '#7C3AED' },
  { name: 'Violet',  hex: '#6D28D9' },
  { name: 'Indigo',  hex: '#4338CA' },
  { name: 'Blue',    hex: '#3B82F6' },
  { name: 'Cyan',    hex: '#06B6D4' },
  { name: 'Teal',    hex: '#14B8A6' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Lime',    hex: '#84CC16' },
  { name: 'Amber',   hex: '#F59E0B' },
  { name: 'Orange',  hex: '#F97316' },
  { name: 'Rose',    hex: '#F43F5E' },
  { name: 'Pink',    hex: '#EC4899' },
];

export function AvatarOrb({
  colors,
  size = 'sm',
  pulse = false,
  style,
  className,
}: AvatarOrbProps) {
  const [core, ring, glow] = colors;
  const px = SIZES[size];

  return (
    <>
      {pulse && (
        <style>{`
          @keyframes avatar-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.06); opacity: 0.88; }
          }
        `}</style>
      )}
      <div
        className={className}
        style={{
          width: px,
          height: px,
          borderRadius: '50%',
          flexShrink: 0,
          background: `radial-gradient(circle at 38% 38%, ${core}ff 0%, ${ring}cc 45%, ${glow}66 100%)`,
          boxShadow: `0 0 ${px * 0.4}px ${glow}55, 0 0 ${px * 0.15}px ${core}88 inset`,
          animation: pulse ? 'avatar-pulse 3.2s ease-in-out infinite' : undefined,
          ...style,
        }}
      />
    </>
  );
}
