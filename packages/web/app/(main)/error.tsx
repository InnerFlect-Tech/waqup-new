'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { logError } from '@waqup/shared/utils';

/**
 * Error boundary for (main) app routes (library, create, marketplace, etc).
 * Catches render errors and provides recovery without losing the layout.
 */
export default function MainAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    logError('MainAppError', error);
  }, [error]);

  const handleRetry = () => {
    reset();
    router.refresh();
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.8 }}>⚠️</div>
      <h2
        style={{
          color: 'var(--theme-text-primary, #f1f5f9)',
          fontSize: '1.25rem',
          fontWeight: 500,
          marginBottom: '0.5rem',
        }}
      >
        Something went wrong
      </h2>
      <p
        style={{
          color: 'var(--theme-text-secondary, #94a3b8)',
          fontSize: '0.9rem',
          lineHeight: 1.6,
          maxWidth: 360,
          marginBottom: '1.5rem',
        }}
      >
        This page encountered an error. Try again or head back to the Sanctuary.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handleRetry}
          style={{
            background: 'rgba(168,85,247,0.2)',
            border: '1px solid rgba(168,85,247,0.5)',
            color: '#a855f7',
            padding: '0.6rem 1.25rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <button
          onClick={() => router.push('/sanctuary')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(168,85,247,0.3)',
            color: '#a855f7',
            padding: '0.6rem 1.25rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Go to Sanctuary
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <pre
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 8,
            fontSize: 11,
            color: '#94a3b8',
            textAlign: 'left',
            maxWidth: 480,
            overflow: 'auto',
          }}
        >
          {error.message}
        </pre>
      )}
    </div>
  );
}
