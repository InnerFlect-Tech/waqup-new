import { NextResponse } from 'next/server';
import { getActiveAtmospherePresets } from '@waqup/shared/constants';

export const dynamic = 'force-static';

/**
 * GET /api/audio/atmosphere-presets
 * Returns the list of active atmosphere / soundscape presets.
 * No auth required — these are read-only public catalog data.
 */
export function GET() {
  const presets = getActiveAtmospherePresets();
  return NextResponse.json({ presets });
}
