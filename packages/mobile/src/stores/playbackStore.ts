/**
 * Global playback store — Zustand
 * Holds now-playing state across navigation. PlaybackEngineProvider owns the actual audio.
 */
import { create } from 'zustand';
import type { ContentItem, ContentItemType } from '@waqup/shared/types';
import type {
  AudioLayers,
  AudioVolumes,
  PlaybackPosition,
  PlaybackSpeed,
  PlaybackState,
} from '@waqup/shared/types';
import { DEFAULT_VOLUMES } from '@waqup/shared/types';

export type PlaybackCurrentItem = {
  id: string;
  contentType: ContentItemType;
  title: string;
  layers: AudioLayers;
};

export interface PlaybackStore {
  currentItem: PlaybackCurrentItem | null;
  playbackState: PlaybackState;
  position: PlaybackPosition;
  volumes: AudioVolumes;
  speed: PlaybackSpeed;
  isVisible: boolean;

  setCurrentItem: (item: ContentItem | null) => void;
  clear: () => void;
  setState: (state: PlaybackState) => void;
  setPosition: (position: PlaybackPosition) => void;
  setVolumes: (v: Partial<AudioVolumes>) => void;
  setSpeed: (s: PlaybackSpeed) => void;
  registerEngine: (controls: { play: () => Promise<void>; pause: () => Promise<void>; seek: (ms: number) => Promise<void> } | null) => void;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (ms: number) => Promise<void>;
}

function buildLayersFromItem(item: ContentItem): AudioLayers {
  const voiceUrl = item.voiceUrl ?? item.audioUrl ?? null;
  return {
    voiceUrl,
    ambientUrl: item.ambientUrl ?? null,
    binauralUrl: item.binauralUrl ?? null,
  };
}

const initialState = {
  currentItem: null as PlaybackCurrentItem | null,
  playbackState: 'idle' as PlaybackState,
  position: { positionMs: 0, durationMs: 0 } as PlaybackPosition,
  volumes: { ...DEFAULT_VOLUMES } as AudioVolumes,
  speed: 1.0 as PlaybackSpeed,
};

let engineRef: { play: () => Promise<void>; pause: () => Promise<void>; seek: (ms: number) => Promise<void> } | null = null;

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  ...initialState,
  isVisible: false,

  setCurrentItem: (item: ContentItem | null) => {
    if (!item) {
      set({ currentItem: null, playbackState: 'idle', position: { positionMs: 0, durationMs: 0 }, isVisible: false });
      return;
    }
    const layers = buildLayersFromItem(item);
    const currentItem: PlaybackCurrentItem = {
      id: item.id,
      contentType: item.type,
      title: item.title ?? 'Untitled',
      layers,
    };
    set({
      currentItem,
      playbackState: 'loading',
      position: { positionMs: 0, durationMs: 0 },
      isVisible: false,
    });
  },

  clear: () => {
    set({
      currentItem: null,
      playbackState: 'idle',
      position: { positionMs: 0, durationMs: 0 },
      isVisible: false,
    });
  },

  setState: (state: PlaybackState) => {
    const { currentItem } = get();
    const isVisible =
      currentItem !== null && (state === 'playing' || state === 'paused');
    set({ playbackState: state, isVisible });
  },

  setPosition: (position: PlaybackPosition) => {
    set({ position });
  },

  setVolumes: (v: Partial<AudioVolumes>) => {
    set((s) => ({ volumes: { ...s.volumes, ...v } }));
  },

  setSpeed: (s: PlaybackSpeed) => {
    set({ speed: s });
  },

  registerEngine: (controls) => {
    engineRef = controls;
  },

  play: async () => {
    await engineRef?.play();
  },

  pause: async () => {
    await engineRef?.pause();
  },

  seek: async (ms: number) => {
    await engineRef?.seek(ms);
  },
}));
