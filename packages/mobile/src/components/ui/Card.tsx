import React from 'react';
import { View, ViewProps, StyleSheet, Pressable, PressableProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme';
import { spacing, borderRadius, shadows } from '@/theme';

export interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'flat' | 'auth';
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
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const authGlowShadow =
    variant === 'auth'
      ? {
          shadowColor: colors.accent.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 24,
          elevation: 12,
        }
      : {};

  const cardStyle = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'flat' && styles.flat,
    variant === 'auth' && [styles.auth, authGlowShadow],
    style,
  ];

  const content = (
    <>
      {header && <View style={styles.header}>{header}</View>}
      <View style={styles.content}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </>
  );

  const glassStyle = {
    backgroundColor: colors.glass.light,
    borderColor: colors.glass.border,
  };

  const blurContainerStyle = [
    styles.blurContainer,
    glassStyle,
    variant === 'auth' && styles.blurContainerAuth,
  ];

  const innerBlur =
    Platform.OS === 'web' ? (
      <View
        style={[
          blurContainerStyle,
          {
            // @ts-ignore — web-only CSS properties
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          },
        ]}
      >
        {content}
      </View>
    ) : (
      <BlurView intensity={80} tint="dark" style={blurContainerStyle}>
        {content}
      </BlurView>
    );

  if (pressable) {
    return (
      <Pressable onPress={onPress} style={cardStyle} {...(props as PressableProps)}>
        {innerBlur}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {innerBlur}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  elevated: {
    ...shadows.lg,
  },
  flat: {
    ...shadows.sm,
  },
  blurContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  blurContainerAuth: {
    padding: spacing.xl,
  },
  auth: {
    borderRadius: borderRadius.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  content: {
    flex: 1,
  },
  footer: {
    marginTop: spacing.md,
  },
});
