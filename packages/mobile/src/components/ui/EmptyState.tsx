import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme';
import { spacing } from '@/theme';
import { Card } from './Card';
import { Typography } from './Typography';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

/**
 * Standard empty state for lists, grids, and data views.
 * Use when there is no data to display but the user can take action.
 */
export function EmptyState({ icon, title, body, action, style }: EmptyStateProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <Card variant="default" style={[styles.card, style]} accessibilityLabel={title}>
      <View style={styles.inner}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: colors.glass.light }]}>
            {icon}
          </View>
        )}
        <Typography
          variant="h3"
          style={[
            styles.title,
            { color: colors.text.primary, marginBottom: body ? spacing.sm : action ? spacing.lg : 0 },
          ]}
        >
          {title}
        </Typography>
        {body && (
          <Typography
            variant="body"
            style={[
              styles.body,
              { color: colors.text.secondary, marginBottom: action ? spacing.lg : 0 },
            ]}
          >
            {body}
          </Typography>
        )}
        {action && <View style={styles.action}>{action}</View>}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  inner: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.xs,
  },
});
