import React from 'react';
import { View, ViewProps, StyleSheet, Pressable, PressableProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme';
import { spacing, borderRadius, shadows } from '@/theme';

export interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'flat';
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
  
  const cardStyle = [
    styles.card,
    variant === 'elevated' && styles.elevated,
    variant === 'flat' && styles.flat,
    style,
  ];

  const content = (
    <>
      {header && <View style={styles.header}>{header}</View>}
      <View style={styles.content}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </>
  );

  if (pressable) {
    return (
      <Pressable onPress={onPress} style={cardStyle} {...(props as PressableProps)}>
        <BlurView intensity={80} style={[styles.blurContainer, { backgroundColor: colors.glass.light, borderColor: colors.glass.border }]}>
          {content}
        </BlurView>
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      <BlurView intensity={80} style={[styles.blurContainer, { backgroundColor: colors.glass.light, borderColor: colors.glass.border }]}>
        {content}
      </BlurView>
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
