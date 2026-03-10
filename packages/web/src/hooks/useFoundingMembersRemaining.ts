'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Fetches founding member spots remaining from the database.
 * Refetches on mount and when refetch() is called (e.g. after form submit).
 */
export function useFoundingMembersRemaining() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);

  const fetchRemaining = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/founding-members/remaining');
      const data = await res.json();
      if (!res.ok) {
        setError(true);
        setRemaining(null);
        return;
      }
      setRemaining(typeof data.remaining === 'number' ? data.remaining : null);
    } catch {
      setError(true);
      setRemaining(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRemaining();
  }, [fetchRemaining]);

  return { remaining, loading, error, refetch: fetchRemaining };
}
