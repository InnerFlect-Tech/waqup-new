import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { spacing, iconTokens } from '@/theme';
import { Typography } from './Typography';

export interface ListRowProps {
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconColor?: string;
  label: string;
  description?: string;
  chevron?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
}

/**
 * Standard list row: icon + label (+ optional description) + optional chevron.
 * 52pt minimum height for touch target. Use for menu items, settings, etc.
 */
export function ListRow({
  icon,
  iconColor,
  label,
  description,
  chevron = false,
  onPress,
  style,
  children,
}: ListRowProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const resolvedIconColor = iconColor ?? colors.text.secondary;

  const content = (
    <>
      {icon && (
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons
            name={icon}
            size={iconTokens.lg}
            color={resolvedIconColor}
          />
        </View>
      )}
      <View style={styles.textWrap}>
        <Typography variant="bodyBold" style={{ color: colors.text.primary }}>
          {label}
        </Typography>
        {description && (
          <Typography variant="small" style={[styles.description, { color: colors.text.secondary }]}>
            {description}
          </Typography>
        )}
      </View>
      {children ?? (chevron && (
        <MaterialCommunityIcons
          name="chevron-right"
          size={iconTokens.md}
          color={colors.text.secondary}
        />
      ))}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.row, style]}
        onPress={onPress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.row, style]}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
    gap: spacing.md,
  },
  iconWrap: {
    width: iconTokens.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  description: {
    marginTop: 2,
  },
});
