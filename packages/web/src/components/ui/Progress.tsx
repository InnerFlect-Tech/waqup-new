import React, { memo } from 'react';
import { colors, borderRadius } from '@/theme';

export interface ProgressProps {
  variant?: 'linear' | 'circular';
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'error' | 'warning';
  style?: React.CSSProperties;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = memo(({
  variant = 'linear',
  value,
  size = 'md',
  color = 'primary',
  style,
  className,
}) => {
  if (variant === 'linear') {
    return <LinearProgress value={value} size={size} color={color} style={style} className={className} />;
  }

  return <CircularProgress value={value} size={size} color={color} style={style} className={className} />;
});

const LinearProgress: React.FC<{ value: number; size: 'sm' | 'md' | 'lg'; color: string; style?: React.CSSProperties; className?: string }> = ({
  value,
  size,
  color,
  style,
  className,
}) => {
  const height = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
  const colorMap = {
    primary: colors.accent.primary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
  };

  const progressValue = Math.min(Math.max(value, 0), 100);

  return (
    <div
      style={{
        width: '100%',
        height,
        backgroundColor: colors.border.light,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
        ...style,
      }}
      className={className}
      role="progressbar"
      aria-valuenow={progressValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          width: `${progressValue}%`,
          height: '100%',
          backgroundColor: colorMap[color as keyof typeof colorMap],
          borderRadius: borderRadius.sm,
          transition: 'width 0.3s ease-in-out',
        }}
      />
    </div>
  );
};

const CircularProgress: React.FC<{ value: number; size: 'sm' | 'md' | 'lg'; color: string; style?: React.CSSProperties; className?: string }> = ({
  value,
  size,
  color,
  style,
  className,
}) => {
  const sizeMap = { sm: 32, md: 48, lg: 64 };
  const radius = sizeMap[size] / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const progressValue = Math.min(Math.max(value, 0), 100);
  const offset = circumference * (1 - progressValue / 100);
  const colorMap = {
    primary: colors.accent.primary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
  };

  return (
    <div
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        position: 'relative',
        ...style,
      }}
      className={className}
      role="progressbar"
      aria-valuenow={progressValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={sizeMap[size]} height={sizeMap[size]} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          fill="none"
          stroke={colors.border.light}
          strokeWidth="4"
        />
        <circle
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          fill="none"
          stroke={colorMap[color as keyof typeof colorMap]}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease-in-out' }}
        />
      </svg>
    </div>
  );
};
