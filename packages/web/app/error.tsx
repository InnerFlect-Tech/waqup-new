'use client';

import { useEffect } from 'react';
import { logError } from '@waqup/shared/utils';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError('GlobalErrorBoundary', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 100%)',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>⚠️</div>
      <h1
        style={{
          color: '#f1f5f9',
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
          color: '#94a3b8',
          fontSize: '1rem',
          lineHeight: 1.6,
          maxWidth: '400px',
          marginBottom: '2rem',
        }}
      >
        An unexpected error occurred. This has been logged and we'll look into it.
      </p>
      <button
        onClick={reset}
        style={{
          background: 'rgba(168,85,247,0.2)',
          border: '1px solid rgba(168,85,247,0.5)',
          color: '#a855f7',
          padding: '0.75rem 2rem',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.025em',
        }}
      >
        Try again
      </button>
    </div>
  );
}
