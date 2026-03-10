import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { logError } from '@waqup/shared/utils';
import { defaultTheme } from '@waqup/shared/theme';
import { spacing, borderRadius } from '@/theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary - catches runtime errors and shows a recovery UI
 * Wrap at the app root or around feature boundaries
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logError('MobileErrorBoundary', error);
    if (__DEV__) {
      console.error('ErrorBoundary caught:', error, info.componentStack);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;

      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.body}>
            An unexpected error occurred. Tap below to try again.
          </Text>
          <TouchableOpacity style={styles.btn} onPress={this.handleReset} activeOpacity={0.8}>
            <Text style={styles.btnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

function getErrorStyles() {
  const colors = defaultTheme.colors;
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xl,
      backgroundColor: colors.background.primary,
    },
    emoji: {
      fontSize: 48,
      marginBottom: spacing.lg,
    },
    title: {
      color: colors.text.primary,
      fontSize: 22,
      fontWeight: '300',
      letterSpacing: -0.5,
      marginBottom: spacing.md,
      textAlign: 'center',
    },
    body: {
      color: colors.text.secondary,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
      marginBottom: spacing.xl,
      maxWidth: 300,
    },
    btn: {
      backgroundColor: colors.accent.light,
      borderColor: colors.glass.border,
      borderWidth: 1,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    btnText: {
      color: colors.accent.primary,
      fontSize: 14,
      fontWeight: '600',
    },
  });
}

// Static ref for render (ErrorBoundary is a class component)
const styles = getErrorStyles();
