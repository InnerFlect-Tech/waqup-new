/**
 * Curated binaural beat presets for waQup.
 *
 * Binaural beats are generated client-side via Web Audio API oscillators —
 * no stored audio files are needed for this layer.
 *
 * IMPORTANT: Copy is intentionally wellness-oriented, not medical.
 * Do not claim clinical outcomes, guaranteed brain entrainment, or
 * therapeutic/healing effects. These are guided experience presets.
 */

export type BinauralBand = 'none' | 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';

export interface BinauralPreset {
  /** Stable slug — safe to persist in DB. Never rename after initial release. */
  id: string;
  /** Display name */
  label: string;
  /** Frequency band category */
  band: BinauralBand;
  /**
   * The binaural beat frequency (Hz) — the perceived difference tone.
   * Left ear receives: carrierFrequencyHz + beatFrequencyHz / 2
   * Right ear receives: carrierFrequencyHz - beatFrequencyHz / 2
   */
  beatFrequencyHz: number;
  /**
   * Carrier tone frequency (Hz) — the base sine wave frequency.
   * 200 Hz is a comfortable, non-fatiguing carrier for most listeners.
   */
  carrierFrequencyHz: number;
  /** One-line wellness-safe description shown in UI */
  description: string;
  /** Short mood/state label, e.g. "Deep rest" */
  mood: string;
  /** Whether this preset is available for selection */
  active: boolean;
  /** Display sort order */
  sortOrder: number;
  /** Optional pre-rendered WAV/FLAC URL — when set, used instead of oscillators for more stable playback */
  fileUrl?: string | null;
}

export const BINAURAL_PRESETS: BinauralPreset[] = [
  {
    id: 'none',
    label: 'None',
    band: 'none',
    beatFrequencyHz: 0,
    carrierFrequencyHz: 0,
    description: 'Voice only — no binaural layer',
    mood: '',
    active: true,
    sortOrder: 0,
  },
  {
    id: 'delta',
    label: 'Delta',
    band: 'delta',
    beatFrequencyHz: 2,
    carrierFrequencyHz: 200,
    description: '~2 Hz · supportive of deep rest and grounding',
    mood: 'Deep rest',
    active: true,
    sortOrder: 1,
    fileUrl: '/audio/binaural/delta.mp3',
  },
  {
    id: 'theta',
    label: 'Theta',
    band: 'theta',
    beatFrequencyHz: 6,
    carrierFrequencyHz: 200,
    description: '~6 Hz · associated with inward reflection and creative states',
    mood: 'Meditation',
    active: true,
    sortOrder: 2,
    fileUrl: '/audio/binaural/theta.mp3',
  },
  {
    id: 'alpha',
    label: 'Alpha',
    band: 'alpha',
    beatFrequencyHz: 10,
    carrierFrequencyHz: 200,
    description: '~10 Hz · supportive of relaxed, open attention',
    mood: 'Calm focus',
    active: true,
    sortOrder: 3,
    fileUrl: '/audio/binaural/alpha.mp3',
  },
  {
    id: 'beta',
    label: 'Beta',
    band: 'beta',
    beatFrequencyHz: 15,
    carrierFrequencyHz: 200,
    description: '~15 Hz · associated with alert, engaged attention',
    mood: 'Active focus',
    active: true,
    sortOrder: 4,
    fileUrl: '/audio/binaural/beta.mp3',
  },
  {
    id: 'gamma',
    label: 'Gamma',
    band: 'gamma',
    beatFrequencyHz: 40,
    carrierFrequencyHz: 200,
    description: '~40 Hz · associated with heightened cognitive engagement',
    mood: 'Peak focus',
    active: true,
    sortOrder: 5,
    fileUrl: '/audio/binaural/gamma.mp3',
  },
];

/** Returns only active presets, sorted by sortOrder */
export function getActiveBinauralPresets(): BinauralPreset[] {
  return BINAURAL_PRESETS.filter((p) => p.active).sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Look up a preset by stable ID. Falls back to 'none' if ID is deprecated/unknown. */
export function getBinauralPreset(id: string): BinauralPreset {
  return BINAURAL_PRESETS.find((p) => p.id === id) ?? BINAURAL_PRESETS[0];
}
