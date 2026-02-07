import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Button, Card } from '@/components';
import { spacing, borderRadius } from '@/theme';
// Icons will be imported from @expo/vector-icons
// For now, using emoji/text placeholders
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function SetupScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const navigation = useNavigation();

  const features = [
    {
      icon: '🧠',
      title: 'AI-Powered',
      description: 'Personalized content generation',
    },
    {
      icon: '✨',
      title: 'Voice Cloning',
      description: 'Create with your own voice',
    },
    {
      icon: '❤️',
      title: 'Transform Your Mind',
      description: 'Science-backed practices',
    },
  ];

  return (
    <Screen scrollable padding={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View
          entering={FadeInUp.duration(600)}
          style={styles.heroSection}
        >
          <Typography
            variant="h1"
            style={[
              styles.logo,
              {
                color: colors.text.primary,
                fontWeight: '300',
                letterSpacing: -2,
              },
            ]}
          >
            wa<span style={{ color: colors.accent.tertiary }}>Q</span>up
          </Typography>
          <Typography
            variant="body"
            style={[styles.tagline, { color: colors.text.secondary }]}
          >
            Transform Your Mind with Voice and Sacred Frequencies
          </Typography>
        </Animated.View>

        {/* Features Grid */}
        <View style={styles.featuresSection}>
          {features.map((feature, index) => {
            return (
              <Animated.View
                key={feature.title}
                entering={FadeInDown.delay(index * 100).duration(500)}
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
                      {
                        backgroundColor: colors.accent.primary,
                      },
                    ]}
                  >
                    <Typography variant="h1" style={{ fontSize: 32 }}>
                      {feature.icon}
                    </Typography>
                  </View>
                  <Typography
                    variant="h4"
                    style={[styles.featureTitle, { color: colors.text.primary }]}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body"
                    style={[styles.featureDescription, { color: colors.text.secondary }]}
                  >
                    {feature.description}
                  </Typography>
                </Card>
              </Animated.View>
            );
          })}
        </View>

        {/* CTA Section */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.ctaSection}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => {
              // Navigate to signup or main app
              // @ts-ignore - navigation type will be handled by navigation setup
              navigation.navigate('Auth', { screen: 'Signup' });
            }}
            style={styles.ctaButton}
          >
            Get Started →
          </Button>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onPress={() => {
              // @ts-ignore
              navigation.navigate('Auth', { screen: 'Login' });
            }}
            style={styles.secondaryButton}
          >
            Already have an account? Sign In
          </Button>
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: 64,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
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
    width: 64,
    height: 64,
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
    fontSize: 14,
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
