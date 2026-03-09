/**
 * Content types - shared across web, iOS, Android
 */

export type ContentItemType = 'affirmation' | 'ritual' | 'meditation';

export type ContentStatus = 'draft' | 'processing' | 'ready' | 'failed';

export type VoiceType = 'elevenlabs' | 'tts' | 'recorded' | 'ai';

/**
 * Per-content audio mix settings stored in content_items.audio_settings JSONB.
 * Preset IDs use stable slugs from BINAURAL_PRESETS / ATMOSPHERE_PRESETS constants.
 */
export interface AudioSettings {
  /** Layer volumes 0–100 */
  volumeVoice: number;
  volumeAmbient: number;
  volumeBinaural: number;
  volumeMaster: number;
  /** Preset selections (stable slugs — see binaural-presets / atmosphere-presets constants) */
  binauralPresetId: string;    // e.g. 'none' | 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'
  atmospherePresetId: string;  // e.g. 'none' | 'rain' | 'forest' | 'ocean' | 'white-noise'
  /** Playback effects */
  fadeIn: boolean;
  fadeOut: boolean;
}

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  volumeVoice: 80,
  volumeAmbient: 40,
  volumeBinaural: 30,
  volumeMaster: 100,
  binauralPresetId: 'none',
  atmospherePresetId: 'none',
  fadeIn: true,
  fadeOut: true,
};

export interface ContentItem {
  id: string;
  type: ContentItemType;
  title: string;
  description: string;
  duration: string;
  frequency?: string;
  lastPlayed?: string;
  script?: string;
  status?: ContentStatus;

  /** Legacy single-track URL (kept for backward compat) */
  audioUrl?: string;

  /** Three-layer audio URLs (normalized to -14 LUFS) */
  voiceUrl?: string;
  ambientUrl?: string;
  binauralUrl?: string;

  /** Per-content default volume mix */
  defaultVolVoice?: number;
  defaultVolAmbient?: number;
  defaultVolBinaural?: number;

  voiceType?: VoiceType;
  audioSettings?: AudioSettings;
  createdAt?: string;
  updatedAt?: string;

  /** Marketplace fields */
  isElevated?: boolean;
  isListed?: boolean;
  playCount?: number;
  shareCount?: number;
  marketplaceItemId?: string;
  creatorId?: string;
}
