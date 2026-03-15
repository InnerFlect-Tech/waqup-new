import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';
import { Typography } from './Typography';

export interface SectionHeaderProps {
  title: string;
  caption?: string;
  style?: ViewStyle;
}

/**
 * Section header: h4 title + optional caption.
 * Use for grouping lists, settings sections, etc.
 */
export function SectionHeader({ title, caption, style }: SectionHeaderProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <View style={[styles.container, style]}>
      <Typography variant="h4" style={{ color: colors.text.primary }}>
        {title}
      </Typography>
      {caption && (
        <Typography variant="caption" style={[styles.caption, { color: colors.text.secondary }]}>
          {caption}
        </Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  caption: {
    marginTop: spacing.xs,
  },
});
