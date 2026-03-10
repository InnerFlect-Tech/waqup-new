'use client';

import { DEFAULT_BRAND_COLORS, withOpacity } from '@waqup/shared/theme';
import { spacing } from '@/theme';

/**
 * Root-level error boundary — catches errors in app/layout.tsx.
 * Must include its own <html> and <body> (replaces entire document).
 * Cannot use next-intl or other providers.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: DEFAULT_BRAND_COLORS.errorBackground,
          padding: spacing.xl,
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          margin: 0,
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: spacing.lg }}>⚠️</div>
        <h1
          style={{
            color: DEFAULT_BRAND_COLORS.textOnDark,
            fontSize: '1.75rem',
            fontWeight: 300,
            letterSpacing: '-0.5px',
            marginBottom: '0.75rem',
          }}
        >
          Something went wrong
        </h1>
        <p
          style={{
            color: DEFAULT_BRAND_COLORS.textMuted,
            fontSize: '1rem',
            lineHeight: 1.6,
            maxWidth: 480,
            marginBottom: spacing.xl,
          }}
        >
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            background: withOpacity(DEFAULT_BRAND_COLORS.accent, 0.2),
            border: `1px solid ${withOpacity(DEFAULT_BRAND_COLORS.accent, 0.5)}`,
            color: DEFAULT_BRAND_COLORS.accent,
          padding: `${spacing.sm} ${spacing.xl}`,
          borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.025em',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
