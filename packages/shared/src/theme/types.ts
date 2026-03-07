/**
 * Theme types - shared across web, iOS, Android
 */

export interface ThemeVariables {
  primary: string;
  secondary: string;
  base: string;
  text: string;
  glass: number;
  mystical: number;
}

export interface Theme {
  name: string;
  variables: ThemeVariables;
  colors: {
    background: { primary: string; secondary: string; tertiary: string; glass: string; glassDark: string; glassOpaque: string; glassTransparent: string };
    text: { primary: string; secondary: string; tertiary: string; inverse: string; disabled: string; onDark: string; onLight: string };
    accent: { primary: string; secondary: string; tertiary: string; light: string };
    glass: { light: string; medium: string; dark: string; border: string; borderDark: string; opaque: string; transparent: string };
    error: string;
    success: string;
    warning: string;
    info: string;
    border: { light: string; medium: string; dark: string };
    gradients: { primary: string; primaryHover: string; secondary: string; background: string; mystical: string };
    mystical: { glow: string; blur: string; orb: string };
  };
}
