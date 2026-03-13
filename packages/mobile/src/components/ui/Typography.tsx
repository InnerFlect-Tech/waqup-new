import React, { memo } from 'react';
import { Text, TextProps, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/theme';
import { typography } from '@/theme';

type TextColorKey = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'disabled' | 'onDark' | 'onLight';

export interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodyBold' | 'caption' | 'captionBold' | 'small' | 'smallBold';
  color?: TextColorKey;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = memo(({
  variant = 'body',
  color = 'primary',
  style,
  children,
  ...props
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const resolvedColor = colors.text[color as keyof typeof colors.text] ?? colors.text.primary;

  const webSmoothingStyle =
    Platform.OS === 'web'
      ? ({
          // @ts-ignore — web-only CSS properties
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        } as object)
      : {};

  const textStyle = [
    styles.base,
    typography[variant],
    { color: resolvedColor },
    webSmoothingStyle,
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
});

// Convenience components — function declarations avoid React 19 "Cannot call a class as a function"
type TypographyOmitVariant = Omit<TypographyProps, 'variant'>;

export function H1(props: TypographyOmitVariant) {
  return <Typography variant="h1" {...props} />;
}
export function H2(props: TypographyOmitVariant) {
  return <Typography variant="h2" {...props} />;
}
export function H3(props: TypographyOmitVariant) {
  return <Typography variant="h3" {...props} />;
}
export function H4(props: TypographyOmitVariant) {
  return <Typography variant="h4" {...props} />;
}
export function Body(props: TypographyOmitVariant) {
  return <Typography variant="body" {...props} />;
}
export function BodyBold(props: TypographyOmitVariant) {
  return <Typography variant="bodyBold" {...props} />;
}
export function Caption(props: TypographyOmitVariant) {
  return <Typography variant="caption" {...props} />;
}
export function CaptionBold(props: TypographyOmitVariant) {
  return <Typography variant="captionBold" {...props} />;
}
export function Small(props: TypographyOmitVariant) {
  return <Typography variant="small" {...props} />;
}
export function SmallBold(props: TypographyOmitVariant) {
  return <Typography variant="smallBold" {...props} />;
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
