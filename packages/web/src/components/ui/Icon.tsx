import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '@/theme';

export type IconName = keyof typeof LucideIcons;

export interface IconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Icon component wrapper for Lucide React icons
 * Provides consistent styling and theme integration
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  strokeWidth = 2,
  className,
  style,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  // Get the icon component from Lucide
  const IconComponent = LucideIcons[name] as React.ComponentType<{
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide React`);
    return null;
  }

  // Use theme color if no color specified
  const iconColor = color || colors.text.primary;

  return (
    <IconComponent
      size={size}
      color={iconColor}
      strokeWidth={strokeWidth}
      className={className}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        ...style,
      }}
    />
  );
};
