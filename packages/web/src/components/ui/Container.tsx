'use client';

import React from 'react';
import { spacing } from '@/theme';
import { useTheme } from '@/theme';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'transparent';
  padding?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  variant = 'primary',
  padding = true,
  maxWidth = 'lg',
  children,
  style,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const containerStyle: React.CSSProperties = {
    width: '100%',
    ...(variant === 'primary' && { background: colors.background.primary }),
    ...(variant === 'secondary' && { background: colors.background.secondary }),
    ...(variant === 'transparent' && { background: 'transparent' }),
    ...(padding && { padding: spacing.md }),
    ...(maxWidth !== 'full' && {
      maxWidth: getMaxWidth(maxWidth),
      marginLeft: 'auto',
      marginRight: 'auto',
    }),
    ...style,
  };

  return (
    <div style={containerStyle} className={className} {...props}>
      {children}
    </div>
  );
};

function getMaxWidth(size: string): string {
  switch (size) {
    case 'sm':
      return '640px';
    case 'md':
      return '768px';
    case 'lg':
      return '1024px';
    case 'xl':
      return '1280px';
    default:
      return '1024px';
  }
}
