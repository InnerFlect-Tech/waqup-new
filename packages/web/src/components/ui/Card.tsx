import React from 'react';
import { spacing, borderRadius, BLUR } from '@/theme';
import { useTheme } from '@/theme';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'flat';
  pressable?: boolean;
  onPress?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  pressable = false,
  onPress,
  header,
  footer,
  children,
  style,
  className,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const cardStyle: React.CSSProperties = {
    borderRadius: borderRadius.lg,
    background: colors.glass.light, // rgba(255,255,255,0.05) — matches reference
    backdropFilter: BLUR.xl,
    WebkitBackdropFilter: BLUR.xl,
    border: `1px solid ${colors.glass.border}`, // border-white/10 (matches old app)
    padding: spacing.md,
    boxShadow: variant === 'elevated' 
      ? `0 8px 32px ${colors.accent.primary}40` 
      : variant === 'flat' 
        ? `0 2px 8px ${colors.accent.primary}20` 
        : `0 4px 16px ${colors.accent.primary}30`,
    transition: 'all 0.2s ease-in-out',
    ...(pressable && {
      cursor: 'pointer',
    }),
    ...style,
  };

  const content = (
    <>
      {header && <div style={{ marginBottom: spacing.md }}>{header}</div>}
      <div style={{ flex: 1 }}>{children}</div>
      {footer && <div style={{ marginTop: spacing.md }}>{footer}</div>}
    </>
  );

  if (pressable) {
    return (
      <div
        style={cardStyle}
        className={className}
        onClick={onPress}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 8px 32px ${colors.accent.primary}60`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = variant === 'elevated' 
            ? `0 8px 32px ${colors.accent.primary}40` 
            : variant === 'flat' 
              ? `0 2px 8px ${colors.accent.primary}20` 
              : `0 4px 16px ${colors.accent.primary}30`;
        }}
        {...props}
      >
        {content}
      </div>
    );
  }

  return (
    <div style={cardStyle} className={className} {...props}>
      {content}
    </div>
  );
};
