/**
 * Audio types - shared across platforms
 */

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export type PlaybackSpeed = 0.5 | 0.75 | 1.0 | 1.25 | 1.5 | 2.0;

export interface AudioLayers {
  voiceUrl: string | null;
  ambientUrl?: string | null;
}

export interface AudioVolumes {
  voice: number;    // 0–100
  ambient: number;  // 0–100
  master: number;   // 0–100
}

export interface PlaybackPosition {
  positionMs: number;
  durationMs: number;
}

export const DEFAULT_VOLUMES: AudioVolumes = {
  voice: 80,
  ambient: 40,
  master: 100,
};

export const PLAYBACK_SPEEDS: PlaybackSpeed[] = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
