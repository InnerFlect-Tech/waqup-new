import React, { memo } from 'react';
import { typography, colors } from '@/theme';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodyBold' | 'caption' | 'captionBold' | 'small' | 'smallBold';
  color?: keyof typeof colors.text;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = memo(({
  variant = 'body',
  color = 'primary',
  as,
  style,
  children,
  className,
  ...props
}) => {
  const Tag = (as || getDefaultTag(variant)) as React.ElementType;
  
  // Filter out invalid CSS values (NaN, undefined, null)
  const cleanStyle = style ? Object.fromEntries(
    Object.entries(style).filter(([_, value]) => 
      value !== null && value !== undefined && !Number.isNaN(value)
    )
  ) : {};
  
  const textStyle = {
    ...typography[variant],
    color: colors.text[color],
    ...cleanStyle,
  };

  return (
    <Tag style={textStyle} className={className} {...props}>
      {children}
    </Tag>
  );
});

function getDefaultTag(variant: string): string {
  switch (variant) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    case 'h4':
      return 'h4';
    default:
      return 'p';
  }
}

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
