import React, { useState } from 'react';
import { TextInput, TextInputProps, View, Platform, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
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
  const { theme } = useTheme();
  const colors = theme.colors;
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
      ? colors.accent.primary
      : colors.border.light;

  const inputContainerStyle: ViewStyle = {
    borderRadius: borderRadius.md,
    borderWidth: focused ? 2 : 1,
    borderColor,
    overflow: 'hidden',
    ...containerStyle,
  };

  const innerContent = (
    <>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      <TextInput
        style={[
          styles.input,
          leftIcon ? styles.inputWithLeftIcon : null,
          rightIcon ? styles.inputWithRightIcon : null,
          { color: colors.text.primary },
          style,
        ]}
        placeholderTextColor={colors.text.secondary}
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
    </>
  );

  return (
    <View style={styles.container}>
      {label && (
        <Typography
          variant="caption"
          color="secondary"
          style={[styles.label, { fontWeight: '500' }]}
        >
          {label}
        </Typography>
      )}
      <View style={inputContainerStyle}>
        {Platform.OS === 'web' ? (
          <View
            style={[
              styles.blurContainer,
              {
                backgroundColor: colors.glass.light,
                // @ts-ignore — web-only CSS property
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              },
            ]}
          >
            {innerContent}
          </View>
        ) : (
          <BlurView
            intensity={80}
            tint="dark"
            style={[styles.blurContainer, { backgroundColor: colors.glass.light }]}
          >
            {innerContent}
          </BlurView>
        )}
      </View>
      {error && (
        <Typography variant="caption" style={[styles.helperText, { color: colors.error }]}>
          {error}
        </Typography>
      )}
      {helperText && !error && (
        <Typography variant="caption" color="secondary" style={styles.helperText}>
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
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  input: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
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
});
