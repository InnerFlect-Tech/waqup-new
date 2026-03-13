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
  /** Icon/image size: default 48/88, large 72, hero = full-width image */
  iconSize?: 'default' | 'large' | 'hero';
  /** Horizontal layout: image left, content right (hero) | banner: icon left, text right (full-width) */
  layout?: 'vertical' | 'horizontal' | 'banner';
  /** Featured card — dramatic gradient, badge, stronger glow */
  featured?: boolean;
  /** Badge text for featured card (e.g. "5 min") */
  badge?: string;
  /** Compact professional style for supporting cards */
  compact?: boolean;
  /** Min height for consistent card layout */
  minHeight?: number;
  /** Load image with priority (above-fold, no lazy blur) */
  priority?: boolean;
  /** Optional content below description (e.g. benefits + CTA for hero) */
  children?: React.ReactNode;
  /** Fill parent height (for grid alignment) */
  fillHeight?: boolean;
  /** Icon circle style: gradient (default) or solid color (pillar/category cards) */
  iconVariant?: 'gradient' | 'solid';
  /** Optional class for root element (e.g. custom animations) */
  className?: string;
}

const HERO_IMAGE_HEIGHT = 240;

export function LandingCard({
  icon: Icon,
  title,
  description,
  imageSrc,
  accentColor,
  highlight = false,
  iconSize = 'default',
  layout = 'vertical',
  featured = false,
  badge,
  compact = false,
  minHeight = 200,
  priority = false,
  children,
  fillHeight = false,
  iconVariant = 'gradient',
  className,
}: LandingCardProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const accent = accentColor ?? colors.accent.primary;

  const isHighlighted = highlight || featured;
  const isHorizontal = layout === 'horizontal' && imageSrc;
  const isBanner = layout === 'banner';
  const isHero = iconSize === 'hero' && imageSrc;

  const iconBoxSize =
    isHero ? 0 : compact ? 44 : iconSize === 'large' ? 72 : imageSrc ? 88 : 48;
  const iconPx = compact ? 20 : iconSize === 'large' ? 36 : 24;

  const imageArea = isHero ? (
    <div
      className="hero-mic-image"
      style={{
        flex: isHorizontal ? '0 0 360px' : undefined,
        width: isHorizontal ? 360 : undefined,
        height: isHorizontal ? (fillHeight ? '100%' : 360) : undefined,
        minHeight: isHorizontal ? (fillHeight ? 200 : 360) : HERO_IMAGE_HEIGHT,
        aspectRatio: isHorizontal && !fillHeight ? '1' : undefined,
        position: 'relative',
        borderRadius: isHorizontal
          ? `${borderRadius.lg} 0 0 ${borderRadius.lg}`
          : `${borderRadius.lg} ${borderRadius.lg} 0 0`,
        overflow: 'hidden',
        boxShadow: `0 8px 32px ${accent}35`,
      }}
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 360px"
        quality={94}
        priority={priority}
        className="hero-mic-img"
        style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
      />
      {/* Simple hover interaction: pulsing "live" indicator */}
      <div
        className="hero-mic-live"
        style={{
          position: 'absolute',
          bottom: spacing.md,
          right: spacing.md,
          width: 8,
          height: 8,
          borderRadius: 9999,
          background: colors.accent.primary,
          boxShadow: `0 0 12px ${colors.accent.primary}`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        }}
        aria-hidden
      />
    </div>
  ) : imageSrc ? (
    <div
      style={{
        width: iconBoxSize,
        height: iconBoxSize,
        borderRadius: borderRadius.lg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 4px 20px ${accent}40`,
        overflow: 'hidden',
        position: 'relative',
        marginBottom: spacing.md,
      }}
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        sizes="176px"
        quality={92}
        priority={priority}
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />
    </div>
  ) : (
    <div
      style={{
        width: iconBoxSize,
        height: iconBoxSize,
        borderRadius: borderRadius.full,
        background: compact
          ? 'transparent'
          : iconVariant === 'solid'
            ? accent
            : colors.gradients.primary,
        border: compact
          ? `1px solid ${colors.glass.border}`
          : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginBottom: compact ? spacing.lg : spacing.md,
        boxShadow: compact ? 'none' : `0 4px 12px ${accent}50`,
      }}
    >
      <Icon
        size={iconPx}
        color={compact ? colors.accent.primary : colors.text.onDark}
        strokeWidth={compact ? 2 : 2.5}
      />
    </div>
  );

  const bannerIcon = isBanner ? (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: borderRadius.full,
        background: colors.gradients.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 4px 20px ${accent}50`,
      }}
    >
      <Icon size={28} color={colors.text.onDark} strokeWidth={2.5} />
    </div>
  ) : null;

  const contentArea = (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: isBanner ? 'row' : 'column',
        alignItems: isBanner ? 'center' : undefined,
        gap: isBanner ? spacing.lg : isHero && isHorizontal ? spacing.md : spacing.sm,
        minWidth: 0,
        minHeight: 0,
        padding: compact ? spacing.lg : spacing.xl,
        overflow: 'hidden',
      }}
    >
      {isBanner && bannerIcon}
      {/* Text column for banner — minWidth: 0 so it can shrink on mobile */}
      {isBanner ? (
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          <Typography
            variant="h3"
            style={{
              color: colors.text.primary,
              fontSize: 'clamp(17px, 1.4vw, 19px)',
              fontWeight: 500,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              lineHeight: 1.4,
              fontSize: 'clamp(14px, 1.1vw, 16px)',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {description}
          </Typography>
          {children}
        </div>
      ) : null}
      {isBanner && badge ? (
        <div
          data-badge
          style={{
            flexShrink: 0,
            alignSelf: 'center',
            padding: `4px ${spacing.sm}`,
            borderRadius: borderRadius.full,
            background: colors.gradients.primary,
            boxShadow: `0 2px 12px ${accent}50`,
            fontSize: 12,
            fontWeight: 600,
            color: colors.text.onDark,
            letterSpacing: '0.3px',
          }}
        >
          {badge}
        </div>
      ) : null}
      {badge && !isBanner && (
        <div
          data-badge
          style={{
            position: 'absolute',
            top: compact ? spacing.sm : spacing.md,
            right: compact ? spacing.sm : spacing.md,
            padding: compact ? `2px ${spacing.xs}` : `4px ${spacing.sm}`,
            borderRadius: borderRadius.full,
            background: compact
              ? `${colors.accent.primary}18`
              : colors.gradients.primary,
            border: compact ? `1px solid ${colors.accent.primary}40` : undefined,
            boxShadow: compact ? 'none' : `0 2px 12px ${accent}50`,
            fontSize: compact ? 11 : 12,
            fontWeight: 600,
            color: compact ? colors.accent.primary : colors.text.onDark,
            letterSpacing: '0.3px',
          }}
        >
          {badge}
        </div>
      )}
      {!isHero && !isBanner && imageArea}
      {!isBanner && (
        <>
          <Typography
            variant="h3"
            style={{
              color: colors.text.primary,
              marginBottom: compact ? spacing.xs : spacing.sm,
              marginTop: isHero && !isHorizontal ? spacing.lg : 0,
              fontSize: compact
                ? 'clamp(15px, 1.3vw, 18px)'
                : isHero
                  ? 'clamp(18px, 2vw, 24px)'
                  : 'clamp(17px, 1.5vw, 20px)',
              fontWeight: compact ? 500 : undefined,
              flexShrink: 0,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body"
            style={{
              color: colors.text.secondary,
              lineHeight: compact ? 1.55 : 1.6,
              fontSize: compact
                ? 'clamp(14px, 1.1vw, 15px)'
                : isHero
                  ? 'clamp(15px, 1.3vw, 17px)'
                  : 'clamp(14px, 1.2vw, 16px)',
              flex: children ? '0 0 auto' : 1,
              flexShrink: 0,
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {description}
          </Typography>
          {children}
        </>
      )}
      </div>
  );

  const cardBg = compact
    ? colors.glass.light
    : featured
      ? `linear-gradient(160deg, ${colors.accent.tertiary}20 0%, ${colors.accent.primary}10 50%, ${colors.accent.secondary}06 100%)`
      : isHighlighted
        ? `linear-gradient(135deg, ${colors.accent.tertiary}15, ${colors.accent.primary}08)`
        : colors.glass.light;
  const cardBorder = compact
    ? `1px solid ${colors.glass.border}`
    : featured
      ? `1px solid ${colors.accent.primary}40`
      : isHighlighted
        ? `1px solid ${colors.accent.tertiary}40`
        : `1px solid ${colors.glass.border}`;
  const cardShadow = compact
    ? `0 2px 16px ${colors.accent.primary}12`
    : featured
      ? `0 0 0 1px ${colors.accent.primary}15, 0 8px 40px ${colors.accent.primary}28`
      : isHighlighted
        ? `0 8px 40px ${colors.accent.tertiary}30`
        : `0 8px 32px ${colors.accent.primary}20`;

  return (
    <div
      data-layout={isHorizontal ? 'horizontal' : undefined}
      className={[isHero && isHorizontal ? 'landing-card-hero-mic' : null, className].filter(Boolean).join(' ') || undefined}
      style={{
        borderRadius: borderRadius.lg,
        background: cardBg,
        backdropFilter: BLUR.xl,
        WebkitBackdropFilter: BLUR.xl,
        border: cardBorder,
        boxShadow: cardShadow,
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        display: 'flex',
        flexDirection: isHorizontal || isBanner ? 'row' : 'column',
        minHeight: isHero && !fillHeight ? (isHorizontal ? 360 : 380) : minHeight,
        height: fillHeight ? '100%' : undefined,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = compact
          ? `0 4px 24px ${colors.accent.primary}18`
          : featured
            ? `0 0 0 1px ${colors.accent.primary}25, 0 12px 52px ${colors.accent.primary}38`
            : isHighlighted
              ? `0 12px 48px ${colors.accent.tertiary}40`
              : `0 12px 40px ${colors.accent.primary}30`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = cardShadow;
      }}
    >
      {isHero && imageArea}
      {contentArea}
    </div>
  );
}
