import React, { memo } from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, interpolate } from 'react-native-reanimated';
import { colors, spacing } from '@/theme';

export interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'secondary';
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = memo(({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  style,
}) => {
  if (variant === 'spinner') {
    const sizeMap = { sm: 'small' as const, md: 'small' as const, lg: 'large' as const };
    const colorMap = {
      primary: colors.accent.primary,
      white: colors.text.inverse,
      secondary: colors.text.secondary,
    };

  return (
    <ActivityIndicator size={sizeMap[size]} color={colorMap[color]} style={style} accessibilityRole="progressbar" accessibilityLabel="Loading" />
  );
  }

  if (variant === 'dots') {
    return <DotsLoading size={size} color={color} style={style} />;
  }

  return <SkeletonLoading size={size} style={style} />;
});

const DotsLoading: React.FC<{ size: 'sm' | 'md' | 'lg'; color: 'primary' | 'white' | 'secondary'; style?: ViewStyle }> = ({
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

  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  React.useEffect(() => {
    dot1.value = withRepeat(withTiming(1, { duration: 600 }), -1, false);
    dot2.value = withRepeat(withTiming(1, { duration: 600 }), -1, false);
    dot3.value = withRepeat(withTiming(1, { duration: 600 }), -1, false);
  }, [dot1, dot2, dot3]);

  const dot1Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot1.value, [0, 0.5, 1], [0.3, 1, 0.3]),
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot2.value, [0, 0.5, 1], [0.3, 1, 0.3]),
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: interpolate(dot3.value, [0, 0.5, 1], [0.3, 1, 0.3]),
  }));

  return (
    <View style={[styles.dotsContainer, style]} accessibilityRole="progressbar" accessibilityLabel="Loading">
      <Animated.View style={[styles.dot, { width: dotSize, height: dotSize, backgroundColor: colorMap[color], borderRadius: dotSize / 2 }, dot1Style]} />
      <Animated.View style={[styles.dot, { width: dotSize, height: dotSize, backgroundColor: colorMap[color], borderRadius: dotSize / 2, marginLeft: spacing.xs }, dot2Style]} />
      <Animated.View style={[styles.dot, { width: dotSize, height: dotSize, backgroundColor: colorMap[color], borderRadius: dotSize / 2, marginLeft: spacing.xs }, dot3Style]} />
    </View>
  );
};

const SkeletonLoading: React.FC<{ size: 'sm' | 'md' | 'lg'; style?: ViewStyle }> = ({ size, style }) => {
  const height = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.skeleton, { height }, animatedStyle, style]} accessibilityRole="progressbar" accessibilityLabel="Loading" />
  );
};

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    // Styles applied inline
  },
  skeleton: {
    backgroundColor: colors.border.light,
    borderRadius: 4,
    width: '100%',
  },
});
