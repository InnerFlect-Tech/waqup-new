import React from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@/theme';
import { Typography } from '@/components';
import { spacing, borderRadius } from '@/theme';
// Icons will be imported from @expo/vector-icons or custom icon component
// For now, using simple text/emoji as placeholder

export interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  backButtonLabel?: string;
  onBackPress?: () => void;
  rightActions?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Header Component - Navigation header with back button and actions
 * Provides consistent header styling across screens
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  backButtonLabel,
  onBackPress,
  rightActions,
  style,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.primary,
          borderBottomColor: colors.glass.border,
        },
        style,
      ]}
    >
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            accessibilityLabel={backButtonLabel || 'Go back'}
            accessibilityRole="button"
          >
            <Typography variant="body" style={{ color: colors.text.primary, fontSize: 24 }}>
              ←
            </Typography>
            {backButtonLabel && (
              <Typography variant="body" style={{ color: colors.text.primary, marginLeft: spacing.xs }}>
                {backButtonLabel}
              </Typography>
            )}
          </TouchableOpacity>
        )}
      </View>

      {title && (
        <View style={styles.centerSection}>
          <Typography variant="h3" style={{ color: colors.text.primary }}>
            {title}
          </Typography>
        </View>
      )}

      <View style={styles.rightSection}>{rightActions}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    minHeight: 56,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
  },
});
