import React, { memo } from 'react';
import { useTheme, spacing } from '@/theme';

export interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'secondary';
  style?: React.CSSProperties;
}

export const Loading: React.FC<LoadingProps> = memo(({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  style,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const resolvedColor = {
    primary: colors.accent.primary,
    white: colors.text.inverse,
    secondary: colors.text.secondary,
  }[color];

  const borderColor = colors.border.light;

  if (variant === 'spinner') {
    return <SpinnerLoading size={size} resolvedColor={resolvedColor} style={style} />;
  }

  if (variant === 'dots') {
    return <DotsLoading size={size} resolvedColor={resolvedColor} style={style} />;
  }

  return <SkeletonLoading size={size} borderColor={borderColor} style={style} />;
});
Loading.displayName = 'Loading';

const SpinnerLoading: React.FC<{ size: 'sm' | 'md' | 'lg'; resolvedColor: string; style?: React.CSSProperties }> = ({
  size,
  resolvedColor,
  style,
}) => {
  const sizeMap = { sm: 16, md: 24, lg: 32 };

  return (
    <div
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: `3px solid ${resolvedColor}33`,
        borderTopColor: resolvedColor,
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
        ...style,
      }}
      aria-label="Loading"
      role="status"
    />
  );
};

const DotsLoading: React.FC<{ size: 'sm' | 'md' | 'lg'; resolvedColor: string; style?: React.CSSProperties }> = ({
  size,
  resolvedColor,
  style,
}) => {
  const dotSize = size === 'sm' ? 6 : size === 'md' ? 8 : 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: spacing.xs, ...style }} aria-label="Loading" role="status">
      <div style={{ width: dotSize, height: dotSize, backgroundColor: resolvedColor, borderRadius: '50%', animation: 'dotPulse 1.4s ease-in-out infinite', animationDelay: '0s' }} />
      <div style={{ width: dotSize, height: dotSize, backgroundColor: resolvedColor, borderRadius: '50%', animation: 'dotPulse 1.4s ease-in-out infinite', animationDelay: '0.2s' }} />
      <div style={{ width: dotSize, height: dotSize, backgroundColor: resolvedColor, borderRadius: '50%', animation: 'dotPulse 1.4s ease-in-out infinite', animationDelay: '0.4s' }} />
    </div>
  );
};

const SkeletonLoading: React.FC<{ size: 'sm' | 'md' | 'lg'; borderColor: string; style?: React.CSSProperties }> = ({ size, borderColor, style }) => {
  const height = size === 'sm' ? 12 : size === 'md' ? 16 : 20;

  return (
    <div
      style={{
        height,
        backgroundColor: borderColor,
        borderRadius: '4px',
        width: '100%',
        animation: 'skeletonPulse 1.5s ease-in-out infinite',
        ...style,
      }}
      aria-label="Loading"
      role="status"
    />
  );
};

// CSS animations are imported via animations.css in layout.tsx
