import React from 'react';
import { View, ViewStyle, StyleSheet, ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';

export interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollViewProps?: ScrollViewProps;
  safeAreaTop?: boolean;
  safeAreaBottom?: boolean;
  padding?: boolean;
}

/**
 * Screen Component - Handles safe areas and padding
 * Wraps content with proper safe area insets and theme-based styling
 */
export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  scrollViewProps,
  safeAreaTop = true,
  safeAreaBottom = true,
  padding = true,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background.primary,
    paddingTop: safeAreaTop ? insets.top : 0,
    paddingBottom: safeAreaBottom ? insets.bottom : 0,
    ...style,
  };

  const contentStyle: ViewStyle = {
    flex: 1,
    ...(padding && { padding: spacing.md }),
    ...contentContainerStyle,
  };

  if (scrollable) {
    return (
      <View style={containerStyle}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={contentStyle}
          showsVerticalScrollIndicator={false}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <View style={contentStyle}>{children}</View>
    </View>
  );
};
