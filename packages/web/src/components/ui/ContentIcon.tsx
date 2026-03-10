'use client';

import React from 'react';
import Image from 'next/image';

/** Light scale to fill placeholder; source images trimmed and sharpened by icons:crop */
const CROP_SCALE = 1.06;

export interface ContentIconProps {
  src: string;
  alt?: string;
  size?: number;
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Content type icon (affirmations, meditations, rituals, etc.).
 * Crops the outer border from app-icon-style images so only the symbol fills the placeholder.
 */
export const ContentIcon: React.FC<ContentIconProps> = ({
  src,
  alt = '',
  size = 56,
  borderRadius = 14,
  className = '',
  style,
}) => (
  <div
    className={className}
    style={{
      width: size,
      height: size,
      borderRadius,
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
      ...style,
    }}
  >
    <Image
      src={src}
      alt={alt}
      fill
      sizes={`${size}px`}
      unoptimized
      style={{
        objectFit: 'cover',
        transform: `scale(${CROP_SCALE})`,
      }}
    />
  </div>
);
