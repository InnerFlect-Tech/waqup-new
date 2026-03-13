import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { Typography, Button, Card } from '@/components';
import { spacing, borderRadius, layout, authTokens } from '@/theme';
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

  const features = [
    {
      icon: 'brain' as const,
      title: 'AI-Powered',
      description: 'Personalized content generation',
    },
    {
      icon: 'microphone' as const,
      title: 'Voice Cloning',
      description: 'Create with your own voice',
    },
    {
      icon: 'heart' as const,
      title: 'Transform Your Mind',
      description: 'Science-backed practices',
    },
  ];

  const handleGetStarted = () => {
    navigation.navigate('Auth', { screen: 'Signup' });
  };

  const handleSignIn = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };

  return (
    <View style={containerStyle}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(600)} style={styles.heroSection}>
          <Typography
            variant="h1"
            style={[styles.logo, { color: colors.text.primary }]}
          >
            {'wa'}<Text style={{ color: colors.accent.tertiary }}>Q</Text>{'up'}
          </Typography>
          <Typography
            variant="body"
            style={[styles.tagline, { color: colors.text.secondary }]}
          >
            Transform Your Mind with Voice and Sacred Frequencies
          </Typography>
        </Animated.View>

        <View style={styles.featuresSection}>
          {features.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={FadeInDown.delay(index * 80).duration(450)}
            >
              <Card
                variant="elevated"
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: colors.glass.opaque,
                    borderColor: colors.glass.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.accent.light },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={feature.icon}
                    size={authTokens.featureIconGlyphSize}
                    color={colors.accent.tertiary}
                  />
                </View>
                <Typography variant="h4" style={[styles.featureTitle, { color: colors.text.primary }]}>
                  {feature.title}
                </Typography>
                <Typography variant="body" style={[styles.featureDescription, { color: colors.text.secondary }]}>
                  {feature.description}
                </Typography>
              </Card>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <Animated.View
        entering={FadeInDown.delay(300).duration(450)}
        style={[
          styles.ctaSection,
          {
            paddingBottom: insets.bottom + spacing.md,
            backgroundColor: colors.background.primary,
            paddingHorizontal: spacing.xl,
          },
        ]}
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          hitSlop={HIT_SLOP}
          onPress={handleGetStarted}
          style={styles.ctaButton}
        >
          Get Started →
        </Button>
        <Button
          variant="ghost"
          size="md"
          fullWidth
          hitSlop={HIT_SLOP}
          onPress={handleSignIn}
          style={styles.secondaryButton}
        >
          Already have an account? Sign In
        </Button>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: authTokens.logoFontSizeHero,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  tagline: {
    fontSize: layout.heroBodyFontSizeMin,
    textAlign: 'center',
    maxWidth: width - spacing.xl * 2,
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: spacing.xxl,
    gap: spacing.lg,
  },
  featureCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: authTokens.featureIconSize,
    height: authTokens.featureIconSize,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  featureTitle: {
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  featureDescription: {
    textAlign: 'center',
    fontSize: layout.heroBodyFontSizeMin,
  },
  ctaSection: {
    marginTop: spacing.xl,
  },
  ctaButton: {
    marginBottom: spacing.md,
  },
  secondaryButton: {
    marginTop: spacing.sm,
  },
});
