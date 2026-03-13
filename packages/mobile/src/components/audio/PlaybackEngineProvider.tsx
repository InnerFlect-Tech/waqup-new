/**
 * PlaybackEngineProvider — Owns the global useAudioPlayer instance.
 * Connects it to playbackStore: registers controls and syncs state/position.
 */
import React, { useEffect } from 'react';
import { usePlaybackStore } from '@/stores/playbackStore';
import { useAudioPlayer } from './useAudioPlayer';

const EMPTY_LAYERS = { voiceUrl: null, ambientUrl: null, binauralUrl: null };

export function PlaybackEngineProvider({ children }: { children: React.ReactNode }) {
  const currentItem = usePlaybackStore((s) => s.currentItem);
  const currentLayers = currentItem?.layers ?? EMPTY_LAYERS;
  const setState = usePlaybackStore((s) => s.setState);
  const setPosition = usePlaybackStore((s) => s.setPosition);
  const registerEngine = usePlaybackStore((s) => s.registerEngine);

  const player = useAudioPlayer({
    layers: currentLayers,
    onEnd: () => setState('ended'),
  });

  // Sync player state and position to store
  useEffect(() => {
    setState(player.state);
  }, [player.state, setState]);

  useEffect(() => {
    setPosition(player.position);
  }, [player.position.positionMs, player.position.durationMs, setPosition]);

  // Register engine controls for store.play(), store.pause(), store.seek()
  useEffect(() => {
    registerEngine({
      play: player.play,
      pause: player.pause,
      seek: player.seek,
    });
    return () => registerEngine(null);
  }, [player.play, player.pause, player.seek, registerEngine]);

  return <>{children}</>;
}
