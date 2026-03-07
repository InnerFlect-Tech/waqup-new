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

// Convenience components
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body" {...props} />
);

export const BodyBold: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyBold" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const CaptionBold: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="captionBold" {...props} />
);

export const Small: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="small" {...props} />
);

export const SmallBold: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="smallBold" {...props} />
);

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
