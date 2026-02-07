import React, { memo } from 'react';
import { colors } from '@/theme';

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
  if (variant === 'spinner') {
    return <SpinnerLoading size={size} color={color} style={style} />;
  }

  if (variant === 'dots') {
    return <DotsLoading size={size} color={color} style={style} />;
  }

  return <SkeletonLoading size={size} style={style} />;
});

const SpinnerLoading: React.FC<{ size: 'sm' | 'md' | 'lg'; color: 'primary' | 'white' | 'secondary'; style?: React.CSSProperties }> = ({
  size,
  color,
  style,
}) => {
  const sizeMap = { sm: 16, md: 24, lg: 32 };
  const colorMap = {
    primary: colors.accent.primary,
    white: colors.text.inverse,
    secondary: colors.text.secondary,
  };

  return (
    <div
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        border: `3px solid ${colorMap[color]}33`,
        borderTopColor: colorMap[color],
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
        ...style,
      }}
      aria-label="Loading"
      role="status"
    />
  );
};

const DotsLoading: React.FC<{ size: 'sm' | 'md' | 'lg'; color: 'primary' | 'white' | 'secondary'; style?: React.CSSProperties }> = ({
  size,
  color,
  style,
}) => {
  const dotSize = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const colorMap = {
    primary: colors.accent.primary,
    white: colors.text.inverse,
    secondary: colors.text.secondary,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px', ...style }} aria-label="Loading" role="status">
      <div
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: colorMap[color],
          borderRadius: '50%',
          animation: 'dotPulse 1.4s ease-in-out infinite',
          animationDelay: '0s',
        }}
      />
      <div
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: colorMap[color],
          borderRadius: '50%',
          animation: 'dotPulse 1.4s ease-in-out infinite',
          animationDelay: '0.2s',
        }}
      />
      <div
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: colorMap[color],
          borderRadius: '50%',
          animation: 'dotPulse 1.4s ease-in-out infinite',
          animationDelay: '0.4s',
        }}
      />
    </div>
  );
};

const SkeletonLoading: React.FC<{ size: 'sm' | 'md' | 'lg'; style?: React.CSSProperties }> = ({ size, style }) => {
  const height = size === 'sm' ? 12 : size === 'md' ? 16 : 20;

  return (
    <div
      style={{
        height,
        backgroundColor: colors.border.light,
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
