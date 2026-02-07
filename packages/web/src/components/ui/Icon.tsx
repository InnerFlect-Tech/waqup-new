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

/**
 * Pre-configured icon components for common use cases
 */
export const IconButton: React.FC<IconProps & { onClick?: () => void }> = ({
  name,
  size = 20,
  color,
  onClick,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = colors.glass.light;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <Icon name={name} size={size} color={color} {...props} />
    </button>
  );
};
