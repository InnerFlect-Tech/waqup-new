'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { locales, localeNames, type Locale } from '@/i18n/routing';
import { useTheme, spacing, BLUR, borderRadius } from '@/theme';
import { withOpacity } from '@waqup/shared/theme';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  /** Render as a compact icon-only button (used in nav) vs full-width row (used in footer) */
  compact?: boolean;
}

export function LanguageSwitcher({ compact = true }: LanguageSwitcherProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (next: Locale) => {
    setOpen(false);
    router.replace(pathname, { locale: next });
  };

  if (compact) {
    return (
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          type="button"
          aria-label="Switch language"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.xs,
            padding: `${spacing.xs} ${spacing.sm}`,
            borderRadius: borderRadius.sm,
            border: `1px solid ${open ? withOpacity(colors.accent.tertiary, 0.35) : withOpacity(colors.accent.tertiary, 0.15)}`,
            background: open ? withOpacity(colors.accent.primary, 0.15) : 'transparent',
            color: colors.text.secondary,
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 500,
            transition: 'all 0.15s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = withOpacity(colors.accent.primary, 0.12);
            (e.currentTarget as HTMLButtonElement).style.borderColor = withOpacity(colors.accent.tertiary, 0.3);
          }}
          onMouseLeave={(e) => {
            if (!open) {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.borderColor = withOpacity(colors.accent.tertiary, 0.15);
            }
          }}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{locale.toUpperCase()}</span>
        </button>

        {open && (
          <div
            role="listbox"
            aria-label="Select language"
            style={{
              position: 'absolute',
              top: `calc(100% + ${spacing.xs})`,
              right: 0,
              minWidth: 160,
              borderRadius: borderRadius.sm,
              border: `1px solid ${withOpacity(colors.accent.tertiary, 0.2)}`,
              background: colors.glass.opaque,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
              zIndex: 200,
              overflow: 'hidden',
            }}
          >
            {locales.map((l) => {
              const isActive = l === locale;
              return (
                <button
                  key={l}
                  role="option"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => handleSelect(l)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: `${spacing.sm} ${spacing.md}`,
                    border: 0,
                    background: isActive ? withOpacity(colors.accent.primary, 0.2) : 'transparent',
                    color: isActive ? colors.accent.tertiary : colors.text.onDark,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = withOpacity(colors.text.onDark, 0.05);
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  <span>{localeNames[l]}</span>
                  {isActive && (
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.accent.tertiary, flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Full (footer / settings) layout — horizontal pill list
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing.sm,
        alignItems: 'center',
      }}
    >
      {locales.map((l) => {
        const isActive = l === locale;
        return (
          <button
            key={l}
            type="button"
            aria-pressed={isActive}
            onClick={() => handleSelect(l)}
            style={{
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.xl,
              border: `1px solid ${isActive ? withOpacity(colors.accent.tertiary, 0.5) : withOpacity(colors.accent.tertiary, 0.15)}`,
              background: isActive ? withOpacity(colors.accent.primary, 0.2) : 'transparent',
              color: isActive ? colors.accent.tertiary : colors.text.secondary,
              cursor: isActive ? 'default' : 'pointer',
              fontSize: '0.8rem',
              fontWeight: isActive ? 600 : 400,
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = withOpacity(colors.accent.primary, 0.1);
                (e.currentTarget as HTMLButtonElement).style.borderColor = withOpacity(colors.accent.tertiary, 0.3);
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.borderColor = withOpacity(colors.accent.tertiary, 0.15);
              }
            }}
          >
            {localeNames[l]}
          </button>
        );
      })}
    </div>
  );
}
