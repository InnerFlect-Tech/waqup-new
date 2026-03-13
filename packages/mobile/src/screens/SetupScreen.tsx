/**
 * SetupScreen — Take a Breath style: "It's time to wake up".
 * Full-screen gradient, centered headline, minimal CTAs.
 */
import React from 'react';
import { View, Text, StyleSheet, Dimensions, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Typography, Button } from '@/components';
import { spacing, authTokens } from '@/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

type SetupNav = NativeStackNavigationProp<RootStackParamList, 'Setup'>;

const { width } = Dimensions.get('window');

/** Minimum touch target - Apple HIG / Android guidelines */
const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };

export default function SetupScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<SetupNav>();

  const handleGetStarted = () => {
    navigation.navigate('Auth', { screen: 'Signup' });
  };

  const handleSignIn = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const gradientColors = [
    colors.background.primary,
    `${colors.accent.primary}15`,
    colors.background.primary,
  ] as const;

  const containerStyle: ViewStyle = {
    flex: 1,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };

  return (
    <View style={containerStyle}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View
        entering={FadeIn.duration(800)}
        style={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        <View style={styles.hero}>
          <Typography
            variant="h1"
            style={[styles.headline, { color: colors.text.primary }]}
          >
            it's time to wake up
          </Typography>
          <Typography
            variant="body"
            style={[styles.subline, { color: colors.text.secondary }]}
          >
            {'wa'}<Text style={{ color: colors.accent.tertiary }}>Q</Text>{'up'}
          </Typography>
        </View>

        <View style={styles.ctaSection}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            hitSlop={HIT_SLOP}
            onPress={handleGetStarted}
            style={styles.ctaButton}
          >
            Get Started
          </Button>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            hitSlop={HIT_SLOP}
            onPress={handleSignIn}
            style={styles.secondaryButton}
          >
            Sign In
          </Button>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  headline: {
    fontSize: authTokens.logoFontSizeHero,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 56,
    letterSpacing: -0.5,
  },
  subline: {
    fontSize: 28,
    marginTop: spacing.lg,
    letterSpacing: -0.5,
  },
  ctaSection: {
    width: '100%',
    maxWidth: width - spacing.xl * 2,
    alignSelf: 'center',
  },
  ctaButton: {
    marginBottom: spacing.md,
  },
  secondaryButton: {
    marginTop: spacing.sm,
  },
});
