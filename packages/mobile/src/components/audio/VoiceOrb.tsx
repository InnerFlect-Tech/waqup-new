import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { withOpacity } from '@waqup/shared/theme';

export type OrbState =
  | 'idle'
  | 'listening'
  | 'hearing'
  | 'transcribing'
  | 'thinking'
  | 'speaking'
  | 'complete'
  | 'error';

export type OrbSize = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<OrbSize, number> = {
  sm: 40,
  md: 80,
  lg: 200,
};

function getOrbColors(
  accent: { primary: string; secondary: string; tertiary: string },
  error: string
): Record<OrbState, { inner: string[]; rim: string; glow: string }> {
  return {
    idle: {
      inner: [withOpacity(accent.primary, 0.6), withOpacity(accent.primary, 0.35), withOpacity(accent.primary, 0.1)],
      rim: accent.tertiary,
      glow: accent.secondary,
    },
    listening: {
      inner: [withOpacity(accent.primary, 0.7), withOpacity(accent.primary, 0.45), withOpacity(accent.primary, 0.15)],
      rim: accent.tertiary,
      glow: accent.tertiary,
    },
    hearing: {
      inner: [withOpacity(accent.primary, 0.8), withOpacity(accent.primary, 0.55), withOpacity(accent.primary, 0.2)],
      rim: accent.tertiary,
      glow: accent.tertiary,
    },
    transcribing: {
      inner: [withOpacity(accent.secondary, 0.7), withOpacity(accent.secondary, 0.4), withOpacity(accent.secondary, 0.1)],
      rim: accent.secondary,
      glow: accent.secondary,
    },
    thinking: {
      inner: [withOpacity(accent.primary, 0.35), withOpacity(accent.primary, 0.2), withOpacity(accent.primary, 0.05)],
      rim: accent.primary,
      glow: accent.primary,
    },
    speaking: {
      inner: [withOpacity(accent.secondary, 0.7), withOpacity(accent.secondary, 0.4), withOpacity(accent.secondary, 0.1)],
      rim: accent.secondary,
      glow: accent.secondary,
    },
    complete: {
      inner: [withOpacity(accent.primary, 0.6), withOpacity(accent.primary, 0.35), withOpacity(accent.primary, 0.1)],
      rim: accent.tertiary,
      glow: accent.secondary,
    },
    error: {
      inner: [withOpacity(error, 0.5), withOpacity(error, 0.25), withOpacity(error, 0.05)],
      rim: error,
      glow: error,
    },
  };
}

const BREATH_SPEEDS: Record<OrbState, number> = {
  idle:         2000,
  listening:    800,
  hearing:      400,
  transcribing: 1200,
  thinking:     3000,
  speaking:     600,
  complete:     2000,
  error:        4000,
};

const PULSE_SCALE: Record<OrbState, number> = {
  idle:         0.03,
  listening:    0.08,
  hearing:      0.12,
  transcribing: 0.05,
  thinking:     0.02,
  speaking:     0.10,
  complete:     0.03,
  error:        0.01,
};

export interface VoiceOrbProps {
  size?: OrbSize;
  orbState?: OrbState;
  style?: object;
}

export function VoiceOrb({ size = 'md', orbState = 'idle', style }: VoiceOrbProps) {
  const { theme } = useTheme();
  const colors = useMemo(
    () => getOrbColors(theme.colors.accent, theme.colors.error),
    [theme.colors.accent, theme.colors.error]
  )[orbState];
  const diameter = SIZE_MAP[size];
  const breathSpeed = BREATH_SPEEDS[orbState];
  const pulseScale = PULSE_SCALE[orbState];

  const pulse = useSharedValue(0);
  const ringOpacity = useSharedValue(0);

  useEffect(() => {
    pulse.value = 0;
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: breathSpeed, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: breathSpeed, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );

    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: breathSpeed * 1.2, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: breathSpeed * 0.8, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [orbState, breathSpeed]);

  const containerStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [1, 1 + pulseScale]);
    return { transform: [{ scale }] };
  });

  const glowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(pulse.value, [0, 1], [0.3, 0.7]);
    return { opacity };
  });

  const outerRingStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [1, 1.15]);
    const opacity = interpolate(ringOpacity.value, [0, 1], [0, 0.4]);
    return { transform: [{ scale }], opacity };
  });

  const innerRingStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [1, 1.08]);
    const opacity = interpolate(pulse.value, [0, 1], [0.2, 0.55]);
    return { transform: [{ scale }], opacity };
  });

  const r = diameter / 2;

  return (
    <View style={[styles.wrapper, { width: diameter, height: diameter }, style]}>
      {/* Outer glow */}
      <Animated.View
        style={[
          styles.glowRing,
          glowStyle,
          {
            width: diameter * 1.6,
            height: diameter * 1.6,
            borderRadius: diameter * 0.8,
            backgroundColor: colors.glow,
            top: -(diameter * 0.3),
            left: -(diameter * 0.3),
            opacity: size === 'sm' ? 0 : undefined,
          },
        ]}
      />

      {/* Outer frequency ring */}
      {size !== 'sm' && (
        <Animated.View
          style={[
            styles.ring,
            outerRingStyle,
            {
              width: diameter * 1.22,
              height: diameter * 1.22,
              borderRadius: diameter * 0.61,
              borderColor: colors.rim,
              top: -(diameter * 0.11),
              left: -(diameter * 0.11),
            },
          ]}
        />
      )}

      {/* Inner frequency ring */}
      {size !== 'sm' && (
        <Animated.View
          style={[
            styles.ring,
            innerRingStyle,
            {
              width: diameter * 1.08,
              height: diameter * 1.08,
              borderRadius: diameter * 0.54,
              borderColor: colors.rim,
              top: -(diameter * 0.04),
              left: -(diameter * 0.04),
            },
          ]}
        />
      )}

      {/* Main sphere */}
      <Animated.View style={[{ width: diameter, height: diameter, borderRadius: r }, containerStyle]}>
        <LinearGradient
          colors={colors.inner as [string, string, ...string[]]}
          start={{ x: 0.25, y: 0.1 }}
          end={{ x: 0.85, y: 1 }}
          style={[styles.sphere, { width: diameter, height: diameter, borderRadius: r, borderColor: colors.rim }]}
        >
          {/* Specular highlight */}
          <View
            style={[
              styles.highlight,
              {
                width: diameter * 0.28,
                height: diameter * 0.22,
                borderRadius: diameter * 0.14,
                top: diameter * 0.12,
                left: diameter * 0.18,
              },
            ]}
          />

          {/* Inner dark void */}
          <LinearGradient
            colors={[theme.colors.background.primary, withOpacity(theme.colors.background.primary, 0.95)]}
            style={[
              styles.void,
              {
                width: diameter * 0.42,
                height: diameter * 0.42,
                borderRadius: diameter * 0.21,
              },
            ]}
          />
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    opacity: 0.15,
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  sphere: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: 'rgba(200, 160, 255, 0.18)',
  },
  void: {
    opacity: 0.9,
  },
});
