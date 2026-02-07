import React, { useState } from 'react';
import { TextInput, TextInputProps, View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, spacing, borderRadius } from '@/theme';
import { Typography } from './Typography';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const inputContainerStyle = [
    styles.inputContainer,
    focused && styles.inputContainerFocused,
    error && styles.inputContainerError,
    containerStyle,
  ];

  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="captionBold" color="primary" style={styles.label}>
          {label}
        </Typography>
      )}
      <View style={inputContainerStyle}>
        <BlurView intensity={80} style={styles.blurContainer}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <TextInput
            style={[
              styles.input,
              leftIcon ? styles.inputWithLeftIcon : null,
              rightIcon ? styles.inputWithRightIcon : null,
              style,
            ]}
            placeholderTextColor={colors.text.tertiary}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            accessibilityLabel={label}
            accessibilityHint={helperText || error}
            {...props}
          />
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </BlurView>
      </View>
      {error && (
        <Typography variant="small" color="primary" style={[styles.helperText, styles.errorText]}>
          {error}
        </Typography>
      )}
      {helperText && !error && (
        <Typography variant="small" color="secondary" style={styles.helperText}>
          {helperText}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.sm,
  },
  inputContainer: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    overflow: 'hidden',
  },
  inputContainerFocused: {
    borderColor: colors.accent.primary,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.light,
    minHeight: 44,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text.primary,
    minHeight: 44,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: spacing.sm,
  },
  leftIcon: {
    paddingLeft: spacing.md,
    justifyContent: 'center',
  },
  rightIcon: {
    paddingRight: spacing.md,
    justifyContent: 'center',
  },
  helperText: {
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error,
  },
});
