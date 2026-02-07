'use client';

import React from 'react';
import { useTheme } from '@/theme';
import { Button } from '@/components';
import { spacing, borderRadius } from '@/theme';

export const ThemeSelector: React.FC = () => {
  const { themeName, setTheme, availableThemes, theme } = useTheme();

  const themeNames: Record<string, string> = {
    'mystical-purple': 'Mystical Purple',
    'professional-blue': 'Professional Blue',
    'serene-green': 'Serene Green',
    'golden-sunset': 'Golden Sunset',
    'cosmic-dark': 'Cosmic Dark',
    'minimalist-light': 'Minimalist Light',
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: spacing.md,
        right: spacing.md,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xs,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        background: theme.colors.glass.light,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: `1px solid ${theme.colors.glass.border}`,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.text.secondary, marginBottom: spacing.xs }}>
        Theme
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        {availableThemes.map((name) => (
          <Button
            key={name}
            variant={themeName === name ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setTheme(name)}
            style={{
              fontSize: '11px',
              padding: `${spacing.xs} ${spacing.sm}`,
              whiteSpace: 'nowrap',
            }}
          >
            {themeNames[name] || name}
          </Button>
        ))}
      </div>
    </div>
  );
};
