/**
 * Audio types - shared across platforms
 */

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export type PlaybackSpeed = 0.5 | 0.75 | 1.0 | 1.25 | 1.5 | 2.0;

/** Three-layer audio architecture: Voice + Ambient + Binaural */
export interface AudioLayers {
  voiceUrl: string | null;
  ambientUrl?: string | null;
  /** Binaural beats / frequency tones (e.g. 432Hz, theta, delta) */
  binauralUrl?: string | null;
}

export interface AudioVolumes {
  voice: number;    // 0–100
  ambient: number;  // 0–100
  /** Binaural beats / frequency tones layer */
  binaural: number; // 0–100
  master: number;   // 0–100
}

export interface PlaybackPosition {
  positionMs: number;
  durationMs: number;
}

export const DEFAULT_VOLUMES: AudioVolumes = {
  voice: 80,
  ambient: 40,
  binaural: 30,
  master: 100,
};

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
