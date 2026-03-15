import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ViewStyle, View, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme';
import { spacing, buttonTokens } from '@/theme';
import { Typography } from './Typography';
import { Loading } from './Loading';
import { getTextColor, getTextVariant } from '@waqup/shared/utils';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  style,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const pressed = useSharedValue(false);

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<TouchableOpacityProps['onPressIn']>>[0]) => {
      pressed.value = true;
      if (variant === 'primary' || variant === 'secondary') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPressIn?.(e);
    },
    [onPressIn, variant]
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<TouchableOpacityProps['onPressOut']>>[0]) => {
      pressed.value = false;
      onPressOut?.(e);
    },
    [onPressOut]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(pressed.value ? 0.98 : 1, { duration: 100 }) }],
    opacity: withTiming(disabled || loading ? 0.6 : 1, { duration: 100 }),
  }));

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.accent.primary,
        };
      case 'secondary':
        return {
          backgroundColor: colors.glass.light,
          borderWidth: 1,
          borderColor: colors.glass.border,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.accent.primary,
        };
      case 'text':
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {};
    }
  };

  const buttonStyle: ViewStyle[] = [
    styles.base,
    styles[size],
    fullWidth && styles.fullWidth,
    getVariantStyle(),
    variant === 'text' && styles.text,
    variant === 'ghost' && styles.ghost,
    style,
  ].filter(Boolean) as ViewStyle[];

  const textColor = useMemo(() => getTextColor(variant), [variant]);
  const textVariant = useMemo(() => getTextVariant(size), [size]);

  const content = (
    <>
      {loading ? (
        <Loading variant="spinner" size="sm" color={variant === 'primary' ? 'white' : 'primary'} />
      ) : (
        <>
          {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}
          <Typography variant={textVariant} color={textColor} style={styles.buttonText}>
            {children}
          </Typography>
        </>
      )}
    </>
  );

  if (variant === 'primary' || variant === 'secondary') {
    const webPrimaryStyle: ViewStyle =
      Platform.OS === 'web' && variant === 'primary'
        ? ({
            // @ts-ignore — web-only CSS property
            background: `linear-gradient(to right, ${colors.accent.primary}, ${colors.accent.secondary})`,
            backgroundColor: undefined,
          } as ViewStyle)
        : {};

    return (
      <AnimatedTouchableOpacity
        style={[animatedStyle, buttonStyle, webPrimaryStyle]}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityState={{ disabled: disabled || loading, busy: loading }}
        accessibilityLabel={typeof children === 'string' ? children : undefined}
        {...props}
      >
        {Platform.OS === 'web' ? (
          <View style={styles.webContainer}>{content}</View>
        ) : (
          <BlurView intensity={80} style={styles.blurContainer}>
            {content}
          </BlurView>
        )}
      </AnimatedTouchableOpacity>
    );
  }

  return (
    <AnimatedTouchableOpacity
      style={[animatedStyle, buttonStyle]}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      accessibilityLabel={typeof children === 'string' ? children : undefined}
      {...props}
    >
      {content}
    </AnimatedTouchableOpacity>
  );
};


const styles = StyleSheet.create({
  base: {
    borderRadius: buttonTokens.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 32,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 44,
  },
  lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 52,
  },
  fullWidth: {
    width: '100%',
  },
  // Dynamic styles will be applied via inline styles
  text: {
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: buttonTokens.borderRadius,
    overflow: 'hidden',
  },
  webContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: buttonTokens.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: buttonTokens.iconGap,
  },
});
