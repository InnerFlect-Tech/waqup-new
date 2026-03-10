'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { logError } from '@waqup/shared/utils';
import { DEFAULT_BRAND_COLORS } from '@waqup/shared/theme';
import { CONTENT_READABLE } from '@/theme';

const CHUNK_RETRY_KEY = 'waqup-chunk-retry';
const CHUNK_RETRY_MAX = 1;

function isChunkLoadError(error: Error): boolean {
  const msg = error.message ?? '';
  return (
    error.name === 'ChunkLoadError' ||
    msg.includes('Loading chunk') ||
    msg.includes('ChunkLoadError')
  );
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errors.pages');

  useEffect(() => {
    if (isChunkLoadError(error)) {
      const retries = parseInt(
        typeof window !== 'undefined' ? sessionStorage.getItem(CHUNK_RETRY_KEY) ?? '0' : '0',
        10,
      );
      if (retries < CHUNK_RETRY_MAX) {
        sessionStorage.setItem(CHUNK_RETRY_KEY, String(retries + 1));
        window.location.reload();
        return;
      }
      sessionStorage.removeItem(CHUNK_RETRY_KEY);
    }
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
        {t('title')}
      </h1>
      <p
        style={{
          color: '#94a3b8',
          fontSize: '1rem',
          lineHeight: 1.6,
          maxWidth: CONTENT_READABLE,
          marginBottom: '2rem',
        }}
      >
        {t('description')}
      </p>
      <button
        onClick={reset}
        style={{
          background: `${DEFAULT_BRAND_COLORS.accent}33`,
          border: `1px solid ${DEFAULT_BRAND_COLORS.accent}80`,
          color: DEFAULT_BRAND_COLORS.accent,
          padding: '0.75rem 2rem',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '0.025em',
        }}
      >
        {t('refresh')}
      </button>
    </div>
  );
}
