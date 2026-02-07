import React, { memo } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors, borderRadius } from '@/theme';

export interface ProgressProps {
  variant?: 'linear' | 'circular';
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'error' | 'warning';
  style?: ViewStyle;
}

export const Progress: React.FC<ProgressProps> = memo(({
  variant = 'linear',
  value,
  size = 'md',
  color = 'primary',
  style,
}) => {
  if (variant === 'linear') {
    return <LinearProgress value={value} size={size} color={color} style={style} />;
  }

  return <CircularProgress value={value} size={size} color={color} style={style} />;
});

const LinearProgress: React.FC<{ value: number; size: 'sm' | 'md' | 'lg'; color: string; style?: ViewStyle }> = ({
  value,
  size,
  color,
  style,
}) => {
  const height = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
  const colorMap = {
    primary: colors.accent.primary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
  };

  const progressStyle = useAnimatedStyle(() => {
    const progressValue = Math.min(Math.max(value, 0), 100);
    return {
      width: `${progressValue}%`,
    };
  }, [value]);

  const progressValue = Math.min(Math.max(value, 0), 100);

  return (
    <View
      style={[styles.linearContainer, { height }, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: progressValue }}
      accessibilityLabel={`Progress: ${progressValue}%`}
    >
      <Animated.View
        style={[
          styles.linearProgress,
          {
            backgroundColor: colorMap[color as keyof typeof colorMap],
            height,
            borderRadius: borderRadius.sm,
          },
          progressStyle,
        ]}
      />
    </View>
  );
};

const CircularProgress: React.FC<{ value: number; size: 'sm' | 'md' | 'lg'; color: string; style?: ViewStyle }> = ({
  value,
  size,
  color,
  style,
}) => {
  const sizeMap = { sm: 32, md: 48, lg: 64 };
  const colorMap = {
    primary: colors.accent.primary,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
  };

  // Simplified circular progress - for full SVG support, use react-native-svg
  const progressValue = Math.min(Math.max(value, 0), 100);
  const rotation = (progressValue / 100) * 360 - 90;

  return (
    <View
      style={[styles.circularContainer, { width: sizeMap[size], height: sizeMap[size] }, style]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: progressValue }}
      accessibilityLabel={`Progress: ${progressValue}%`}
    >
      <View
        style={[
          styles.circularTrack,
          {
            width: sizeMap[size],
            height: sizeMap[size],
            borderRadius: sizeMap[size] / 2,
            borderWidth: 4,
            borderColor: colors.border.light,
          },
        ]}
      />
      <View
        style={[
          styles.circularProgress,
          {
            width: sizeMap[size],
            height: sizeMap[size],
            borderRadius: sizeMap[size] / 2,
            borderWidth: 4,
            borderColor: colorMap[color as keyof typeof colorMap],
            borderTopColor: progressValue > 50 ? colorMap[color as keyof typeof colorMap] : 'transparent',
            borderRightColor: progressValue > 50 ? colorMap[color as keyof typeof colorMap] : 'transparent',
            borderBottomColor: progressValue > 25 ? colorMap[color as keyof typeof colorMap] : 'transparent',
            borderLeftColor: 'transparent',
            transform: [{ rotate: `${rotation}deg` }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  linearContainer: {
    width: '100%',
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  linearProgress: {
    borderRadius: borderRadius.sm,
  },
  circularContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularTrack: {
    position: 'absolute',
  },
  circularProgress: {
    position: 'absolute',
  },
});
