import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getActiveAtmospherePresets } from '@waqup/shared/constants';
import { resolveAtmosphereUrl } from '@/utils/atmosphere';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/audio/atmosphere-status
 *
 * Admin health check — reports which atmosphere audio files are present
 * in Supabase Storage and which are missing.
 * Used to verify the atmosphere layer is operational.
 */
export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'superadmin') {
    return NextResponse.json({ error: 'Forbidden — superadmin only' }, { status: 403 });
  }

  const presets = getActiveAtmospherePresets().filter((p) => p.id !== 'none');
  const results = await Promise.all(
    presets.map(async (preset) => {
      const url = resolveAtmosphereUrl(preset.id);
      if (!url) {
        return { id: preset.id, label: preset.label, url: null, accessible: false };
      }
      try {
        const res = await fetch(url, { method: 'HEAD' });
        return { id: preset.id, label: preset.label, url, accessible: res.ok };
      } catch {
        return { id: preset.id, label: preset.label, url, accessible: false };
      }
    }),
  );

  const allReady = results.every((r) => r.accessible);
  return NextResponse.json({ allReady, presets: results });
}
