import { NextResponse } from 'next/server';
import { resolveAtmosphereUrl } from '@/utils/atmosphere';
import { getActiveAtmospherePresets } from '@waqup/shared/constants';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/audio/atmosphere-available
 *
 * Public endpoint — returns whether any atmosphere preset files exist in storage.
 * Used to hide the atmosphere preset selector when no files are uploaded yet.
 */
export async function GET() {
  const presets = getActiveAtmospherePresets().filter((p) => p.id !== 'none');
  if (presets.length === 0) {
    return NextResponse.json({ available: false });
  }

  // Check the first non-none preset; if it exists, atmosphere layer is operational
  const firstPreset = presets[0];
  const url = resolveAtmosphereUrl(firstPreset.id);
  if (!url) {
    return NextResponse.json({ available: false });
  }

  try {
    const res = await fetch(url, { method: 'HEAD' });
    return NextResponse.json({ available: res.ok });
  } catch {
    return NextResponse.json({ available: false });
  }
}
