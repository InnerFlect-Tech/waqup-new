import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

export interface ContainerProps extends ViewProps {
  variant?: 'primary' | 'secondary' | 'transparent';
  padding?: boolean;
  safeArea?: boolean;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  variant = 'primary',
  padding = true,
  safeArea = true,
  children,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    variant === 'primary' && { backgroundColor: colors.background.primary },
    variant === 'secondary' && { backgroundColor: colors.background.secondary },
    variant === 'transparent' && { backgroundColor: 'transparent' },
    padding && styles.padding,
    safeArea && {
      paddingTop: Math.max(insets.top, spacing.md),
      paddingBottom: Math.max(insets.bottom, spacing.md),
      paddingLeft: Math.max(insets.left, spacing.md),
      paddingRight: Math.max(insets.right, spacing.md),
    },
    style,
  ];

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padding: {
    padding: spacing.md,
  },
});
