import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, borderRadius } from '@/theme';
import { Typography } from './Typography';
import { getTextColor } from '@waqup/shared/utils';

export interface BadgeProps {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'outline';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = memo(({
  variant = 'default',
  size = 'md',
  children,
  style,
}) => {
  const badgeStyle = [
    styles.badge,
    styles[size],
    variant === 'default' && styles.default,
    variant === 'success' && styles.success,
    variant === 'error' && styles.error,
    variant === 'warning' && styles.warning,
    variant === 'info' && styles.info,
    variant === 'outline' && styles.outline,
    style,
  ];

  const textColor = getTextColor(variant);

  return (
    <View style={badgeStyle} accessibilityRole="text" accessibilityLabel={typeof children === 'string' ? children : undefined}>
      <Typography variant="small" color={textColor}>
        {children}
      </Typography>
    </View>
  );
});


const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  default: {
    backgroundColor: colors.accent.primary,
  },
  success: {
    backgroundColor: colors.success,
  },
  error: {
    backgroundColor: colors.error,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  info: {
    backgroundColor: colors.info,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
});
