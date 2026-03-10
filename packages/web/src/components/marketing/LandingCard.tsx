'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/theme';
import { Typography } from '@/components';
import { spacing, borderRadius, BLUR } from '@/theme';

export interface LandingCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Optional image path; when set, shows image instead of icon */
  imageSrc?: string;
  /** Accent color for icon background; defaults to theme accent */
  accentColor?: string;
  /** Slightly elevated / highlighted card */
  highlight?: boolean;
  /** Min height for consistent card layout */
  minHeight?: number;
}

export function LandingCard({
  icon: Icon,
  title,
  description,
  imageSrc,
  accentColor,
  highlight = false,
  minHeight = 200,
}: LandingCardProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const accent = accentColor ?? colors.accent.primary;

  return (
    <div
      style={{
        padding: spacing.xl,
        borderRadius: borderRadius.lg,
        background: highlight
          ? `linear-gradient(135deg, ${colors.accent.tertiary}15, ${colors.accent.primary}08)`
          : colors.glass.light,
        backdropFilter: BLUR.xl,
        WebkitBackdropFilter: BLUR.xl,
        border: highlight
          ? `1px solid ${colors.accent.tertiary}40`
          : `1px solid ${colors.glass.border}`,
        boxShadow: highlight
          ? `0 8px 40px ${colors.accent.tertiary}30`
          : `0 8px 32px ${colors.accent.primary}20`,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = highlight
          ? `0 12px 48px ${colors.accent.tertiary}40`
          : `0 12px 40px ${colors.accent.primary}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = highlight
          ? `0 8px 40px ${colors.accent.tertiary}30`
          : `0 8px 32px ${colors.accent.primary}20`;
      }}
    >
      <div
        style={{
          width: imageSrc ? 72 : 48,
          height: imageSrc ? 72 : 48,
          borderRadius: imageSrc ? borderRadius.lg : borderRadius.full,
          background: imageSrc ? 'transparent' : colors.gradients.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.md,
          flexShrink: 0,
          boxShadow: imageSrc ? `0 4px 20px ${accent}40` : `0 4px 12px ${accent}50`,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt=""
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Icon size={24} color={colors.text.onDark} strokeWidth={2.5} />
        )}
      </div>
      <Typography
        variant="h3"
        style={{
          color: colors.text.primary,
          marginBottom: spacing.sm,
          fontSize: 'clamp(18px, 1.5vw, 20px)',
          flexShrink: 0,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body"
        style={{
          color: colors.text.secondary,
          lineHeight: 1.6,
          fontSize: 'clamp(14px, 1.2vw, 16px)',
          flex: 1,
          minHeight: 0,
        }}
      >
        {description}
      </Typography>
    </div>
  );
}
