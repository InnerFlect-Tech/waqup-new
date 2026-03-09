/**
 * Curated atmosphere / soundscape presets for waQup.
 *
 * Atmosphere tracks are looping ambient audio files stored in Supabase Storage
 * under the 'atmosphere' public bucket: atmosphere/{id}.mp3
 *
 * NOTE: fileUrl is null for all presets until the actual audio files are uploaded.
 * To activate a preset, upload the corresponding MP3 to Supabase Storage and update
 * the fileUrl field. Existing sessions that reference a deprecated preset ID will
 * receive null for fileUrl and the atmosphere layer will simply be silent —
 * the session remains playable.
 */

export type AtmosphereCategory = 'none' | 'nature' | 'ambient';

export interface AtmospherePreset {
  /** Stable slug — safe to persist in DB. Never rename after initial release. */
  id: string;
  /** Display name */
  label: string;
  /** One-line description shown in UI */
  description: string;
  /** Category for grouping */
  category: AtmosphereCategory;
  /**
   * Absolute URL to the looping audio file, or null if not yet uploaded.
   * Store as a public Supabase Storage URL or CDN URL.
   * Update this field when replacing/updating the audio file.
   */
  fileUrl: string | null;
  /** Whether this preset is available for selection */
  active: boolean;
  /** Display sort order */
  sortOrder: number;
}

export const ATMOSPHERE_PRESETS: AtmospherePreset[] = [
  {
    id: 'none',
    label: 'None',
    description: 'Voice only — no atmosphere layer',
    category: 'none',
    fileUrl: null,
    active: true,
    sortOrder: 0,
  },
  {
    id: 'rain',
    label: 'Rain',
    description: 'Soft, steady rainfall',
    category: 'nature',
    // Upload to Supabase Storage: atmosphere/rain.mp3
    fileUrl: null,
    active: true,
    sortOrder: 1,
  },
  {
    id: 'forest',
    label: 'Forest',
    description: 'Birds, a gentle breeze, and rustling leaves',
    category: 'nature',
    // Upload to Supabase Storage: atmosphere/forest.mp3
    fileUrl: null,
    active: true,
    sortOrder: 2,
  },
  {
    id: 'ocean',
    label: 'Ocean',
    description: 'Slow, rhythmic waves on a calm shore',
    category: 'nature',
    // Upload to Supabase Storage: atmosphere/ocean.mp3
    fileUrl: null,
    active: true,
    sortOrder: 3,
  },
  {
    id: 'white-noise',
    label: 'White Noise',
    description: 'Steady broadband ambient sound',
    category: 'ambient',
    // Upload to Supabase Storage: atmosphere/white-noise.mp3
    fileUrl: null,
    active: true,
    sortOrder: 4,
  },
];

/** Returns only active presets, sorted by sortOrder */
export function getActiveAtmospherePresets(): AtmospherePreset[] {
  return ATMOSPHERE_PRESETS.filter((p) => p.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Look up a preset by stable ID. Falls back to 'none' if ID is deprecated/unknown. */
export function getAtmospherePreset(id: string): AtmospherePreset {
  return ATMOSPHERE_PRESETS.find((p) => p.id === id) ?? ATMOSPHERE_PRESETS[0];
}
