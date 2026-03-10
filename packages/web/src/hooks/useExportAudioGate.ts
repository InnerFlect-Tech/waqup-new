'use client';

import { useEffect, useState } from 'react';
import { createProgressService } from '@waqup/shared/services';
import { UNLOCK_THRESHOLDS } from '@waqup/shared/types';
import { supabase } from '@/lib/supabase';

export interface UseExportAudioGateResult {
  canExport: boolean;
  xpNeeded: number;
  loading: boolean;
  totalXp: number;
}

/**
 * Hook for gating the Export audio feature at Explorer level (50 XP).
 * Use when implementing the Export/Download audio button on content detail or ContentAudioStep.
 */
export function useExportAudioGate(): UseExportAudioGateResult {
  const [totalXp, setTotalXp] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const progressService = createProgressService(supabase);
    progressService.getProgressStats().then(({ data }) => {
      setTotalXp(data?.totalXp ?? 0);
      setLoading(false);
    });
  }, []);

  const xp = totalXp ?? 0;
  const canExport = xp >= UNLOCK_THRESHOLDS.exportAudio;
  const xpNeeded = Math.max(0, UNLOCK_THRESHOLDS.exportAudio - xp);

  return {
    canExport,
    xpNeeded,
    loading,
    totalXp: xp,
  };
}
