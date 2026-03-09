'use client';

import { useState, useCallback } from 'react';
import type { AvatarOrbColors } from '@/components/ui/AvatarOrb';

const STORAGE_KEY = 'waqup_avatar_colors';
export const DEFAULT_AVATAR_COLORS: AvatarOrbColors = ['#7C3AED', '#4338CA', '#1D4ED8'];

function readFromStorage(): AvatarOrbColors {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (
        Array.isArray(parsed) &&
        parsed.length === 3 &&
        parsed.every((v) => typeof v === 'string')
      ) {
        return parsed as AvatarOrbColors;
      }
    }
  } catch {}
  return DEFAULT_AVATAR_COLORS;
}

export function useAvatarColors() {
  const [colors, setColors] = useState<AvatarOrbColors>(() =>
    typeof window !== 'undefined' ? readFromStorage() : DEFAULT_AVATAR_COLORS
  );

  const setColor = useCallback((slot: 0 | 1 | 2, hex: string) => {
    setColors((prev) => {
      const next: AvatarOrbColors = [...prev] as AvatarOrbColors;
      next[slot] = hex;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return { colors, setColor };
}
