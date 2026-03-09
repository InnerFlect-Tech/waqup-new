import { NextResponse } from 'next/server';
import { getActiveBinauralPresets } from '@waqup/shared/constants';

export const dynamic = 'force-static';

/**
 * GET /api/audio/binaural-presets
 * Returns the list of active binaural beat presets.
 * No auth required — these are read-only public catalog data.
 */
export function GET() {
  const presets = getActiveBinauralPresets();
  return NextResponse.json({ presets });
}
