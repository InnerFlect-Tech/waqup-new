import { getAtmospherePreset, getActiveAtmospherePresets, type AtmospherePreset } from '@waqup/shared/constants';

/**
 * Resolves the public Supabase Storage URL for an atmosphere preset.
 *
 * Files live at: atmosphere/{id}.mp3 in the public `atmosphere` bucket.
 * URL format: {SUPABASE_URL}/storage/v1/object/public/atmosphere/{id}.mp3
 *
 * Returns null if:
 *   - The preset ID is 'none'
 *   - NEXT_PUBLIC_SUPABASE_URL is not set
 *   - The preset's fileUrl is explicitly set to null (upload pending)
 *
 * When the preset has a hardcoded fileUrl (e.g. a CDN URL), that takes
 * precedence over the auto-derived Supabase Storage URL.
 */
export function resolveAtmosphereUrl(presetId: string): string | null {
  if (!presetId || presetId === 'none') return null;

  const preset = getAtmospherePreset(presetId);
  if (!preset || preset.id === 'none') return null;

  // If a hardcoded URL has been set on the preset, use it directly
  if (preset.fileUrl) return preset.fileUrl;

  // Auto-derive from Supabase Storage public URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  // Remove trailing slash from base URL
  const base = supabaseUrl.replace(/\/$/, '');
  return `${base}/storage/v1/object/public/atmosphere/${preset.id}.mp3`;
}

/**
 * Returns all active atmosphere presets with their resolved URLs.
 * Presets whose storage files haven't been uploaded yet will have resolvedUrl: null.
 */
export function getResolvedAtmospherePresets(): Array<AtmospherePreset & { resolvedUrl: string | null }> {
  return getActiveAtmospherePresets().map((preset) => ({
    ...preset,
    resolvedUrl: resolveAtmosphereUrl(preset.id),
  }));
}
