'use client';

import { spacing } from '@/theme';

interface MenuDividerProps {
  background: string;
  /** Vertical margin, default uses spacing.sm */
  margin?: string;
}

export function MenuDivider({ background, margin = `${spacing.sm} 0` }: MenuDividerProps) {
  return <div style={{ height: 1, background, margin }} />;
}
