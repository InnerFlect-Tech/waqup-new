import React, { useEffect } from 'react';
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

const STATE_COLORS: Record<OrbState, { inner: string[]; rim: string; glow: string }> = {
  idle:         { inner: ['#3b0764', '#1e0438', '#0a0014'], rim: '#7c3aed', glow: '#6d28d9' },
  listening:    { inner: ['#4c1d95', '#2e0f6b', '#0d0030'], rim: '#a855f7', glow: '#a855f7' },
  hearing:      { inner: ['#5b21b6', '#3b0d82', '#120040'], rim: '#c084fc', glow: '#c084fc' },
  transcribing: { inner: ['#4338ca', '#1e1b6b', '#06052a'], rim: '#818cf8', glow: '#6366f1' },
  thinking:     { inner: ['#1e0438', '#0d0025', '#000010'], rim: '#4c1d95', glow: '#4c1d95' },
  speaking:     { inner: ['#1e3a8a', '#0c1f5c', '#000620'], rim: '#60a5fa', glow: '#3b82f6' },
  complete:     { inner: ['#3b0764', '#1e0438', '#0a0014'], rim: '#7c3aed', glow: '#6d28d9' },
  error:        { inner: ['#450a0a', '#1c0404', '#050000'], rim: '#ef4444', glow: '#dc2626' },
};

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
  const diameter = SIZE_MAP[size];
  const colors = STATE_COLORS[orbState];
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
            colors={['#000000', '#0a0014']}
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
    backgroundColor: '#000000',
  },
});
