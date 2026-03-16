/**
 * Canonical layer resolution — derives playable AudioLayers from a content item.
 *
 * Used by web and (later) mobile to resolve voice, ambient, and binaural URLs
 * from content_items + audio_settings + storage.
 */

import type { ContentItem } from '../types/content';
import type { AudioLayers } from '../types/audio';
import { getAtmospherePreset } from '../constants/atmosphere-presets';
import { getBinauralPreset } from '../constants/binaural-presets';

export interface ResolveLayersOptions {
  /**
   * Base URL for Supabase (e.g. https://xxx.supabase.co).
   * When provided, atmosphere URLs are built as:
   *   {supabaseUrl}/storage/v1/object/public/atmosphere/{presetId}.mp3
   */
  supabaseUrl?: string;
  /**
   * Optional custom resolver for atmosphere URLs.
   * When provided, overrides built-in URL resolution.
   */
  resolveAtmosphereUrl?: (presetId: string) => string | null;
  /**
   * Optional custom resolver for binaural URLs (pre-rendered files).
   * When provided, used instead of preset.fileUrl.
   */
  resolveBinauralUrl?: (presetId: string) => string | null;
}

/**
 * Builds atmosphere URL from preset ID when supabaseUrl is provided.
 */
function buildAtmosphereUrl(presetId: string, supabaseUrl: string): string | null {
  if (!presetId || presetId === 'none') return null;
  const preset = getAtmospherePreset(presetId);
  if (!preset || preset.id === 'none') return null;
  if (preset.fileUrl) return preset.fileUrl;
  const base = supabaseUrl.replace(/\/$/, '');
  return `${base}/storage/v1/object/public/atmosphere/${preset.id}.mp3`;
}

/**
 * Resolves playable audio layers from a content item.
 *
 * Voice: content.voiceUrl ?? content.audioUrl
 * Ambient: content.ambientUrl ?? resolved from audio_settings.atmospherePresetId
 * Binaural: content.binauralUrl ?? resolved from audio_settings.binauralPresetId (when preset has fileUrl)
 */
export function resolveLayersFromContent(
  contentItem: ContentItem,
  options: ResolveLayersOptions = {}
): AudioLayers {
  const { supabaseUrl, resolveAtmosphereUrl: customAmbient, resolveBinauralUrl: customBinaural } = options;

  const voiceUrl = contentItem.voiceUrl ?? contentItem.audioUrl ?? null;

  let ambientUrl: string | null = contentItem.ambientUrl ?? null;
  if (!ambientUrl) {
    const presetId = contentItem.audioSettings?.atmospherePresetId ?? 'none';
    if (customAmbient) {
      ambientUrl = customAmbient(presetId);
    } else if (supabaseUrl) {
      ambientUrl = buildAtmosphereUrl(presetId, supabaseUrl);
    }
  }

  let binauralUrl: string | null = contentItem.binauralUrl ?? null;
  if (!binauralUrl) {
    const presetId = contentItem.audioSettings?.binauralPresetId ?? 'none';
    if (customBinaural) {
      const resolved = customBinaural(presetId);
      binauralUrl = resolved !== null && typeof resolved === 'string' ? resolved : null;
    } else {
      const preset = getBinauralPreset(presetId);
      if (preset && preset.id !== 'none' && preset.fileUrl) {
        binauralUrl = preset.fileUrl;
      }
    }
  }

  return {
    voiceUrl,
    ambientUrl,
    binauralUrl,
  };
}
