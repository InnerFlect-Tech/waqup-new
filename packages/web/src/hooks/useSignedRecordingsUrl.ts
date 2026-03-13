'use client';

import { useCallback, useEffect, useState } from 'react';

export interface UseSignedRecordingsUrlResult {
  url: string | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

/**
 * Resolves a Supabase public recordings URL to a signed URL.
 * The audio bucket is private, so public URLs (object/public/audio/recordings/...)
 * return 400. This hook fetches a signed URL from /api/audio/signed-url when needed.
 */
export function useSignedRecordingsUrl(inputUrl: string | null): UseSignedRecordingsUrlResult {
  const [resolved, setResolved] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchSignedUrl = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/audio/signed-url?url=${encodeURIComponent(url)}`, {
        credentials: 'include',
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      if (data?.url) {
        setResolved(data.url);
      } else {
        throw new Error('No URL in response');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to load audio';
      setError(msg);
      setResolved(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!inputUrl) {
      setResolved(null);
      setIsLoading(false);
      setError(null);
      return;
    }
    if (!inputUrl.includes('/object/public/audio/recordings/')) {
      setResolved(inputUrl);
      setIsLoading(false);
      setError(null);
      return;
    }
    void fetchSignedUrl(inputUrl);
  }, [inputUrl, retryCount, fetchSignedUrl]);

  const retry = useCallback(() => setRetryCount((c) => c + 1), []);

  return {
    url: resolved,
    isLoading,
    error,
    retry,
  };
}
