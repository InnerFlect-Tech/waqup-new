'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/theme';
import { Button } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { Palette, ChevronDown } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { themeName, setTheme, availableThemes, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const themeNames: Record<string, string> = {
    'mystical-purple': 'Mystical Purple',
    'professional-blue': 'Professional Blue',
    'serene-green': 'Serene Green',
    'golden-sunset': 'Golden Sunset',
    'cosmic-dark': 'Cosmic Dark',
    'minimalist-light': 'Minimalist Light',
  };

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          position: 'fixed',
          top: spacing.md,
          right: spacing.md,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: spacing.xs,
          padding: `${spacing.sm} ${spacing.md}`,
          borderRadius: borderRadius.md,
          background: theme.colors.glass.light,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: `1px solid ${theme.colors.glass.border}`,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          color: theme.colors.text.secondary,
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Palette size={16} />
        Theme
        <ChevronDown size={14} style={{ opacity: open ? 1 : 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: 'fixed',
            top: `calc(${spacing.md} + 40px)`,
            right: spacing.md,
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.xs,
            padding: spacing.md,
            borderRadius: borderRadius.md,
            background: theme.colors.glass.opaque,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${theme.colors.glass.border}`,
            boxShadow: `0 8px 24px ${theme.colors.mystical?.glow ?? 'rgba(0,0,0,0.2)'}40`,
            minWidth: '160px',
          }}
        >
          {availableThemes.map((name) => (
            <Button
              key={name}
              variant={themeName === name ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => {
                setTheme(name);
                setOpen(false);
              }}
              style={{
                fontSize: '12px',
                padding: `${spacing.sm} ${spacing.md}`,
                whiteSpace: 'nowrap',
                justifyContent: 'flex-start',
              }}
            >
              {themeNames[name] || name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
