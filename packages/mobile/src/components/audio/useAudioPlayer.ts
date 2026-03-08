import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import type {
  AudioLayers,
  AudioVolumes,
  PlaybackPosition,
  PlaybackSpeed,
  PlaybackState,
} from '@waqup/shared/types';
import { DEFAULT_VOLUMES } from '@waqup/shared/types';
import { logError } from '@waqup/shared/utils';

interface UseAudioPlayerOptions {
  layers: AudioLayers;
  initialVolumes?: Partial<AudioVolumes>;
  onEnd?: () => void;
}

interface UseAudioPlayerResult {
  state: PlaybackState;
  position: PlaybackPosition;
  volumes: AudioVolumes;
  speed: PlaybackSpeed;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  setVolumes: (v: Partial<AudioVolumes>) => void;
  setSpeed: (s: PlaybackSpeed) => void;
  isReady: boolean;
}

export function useAudioPlayer({
  layers,
  initialVolumes,
  onEnd,
}: UseAudioPlayerOptions): UseAudioPlayerResult {
  const voiceRef = useRef<Audio.Sound | null>(null);
  const ambientRef = useRef<Audio.Sound | null>(null);

  const [state, setState] = useState<PlaybackState>('idle');
  const [position, setPosition] = useState<PlaybackPosition>({ positionMs: 0, durationMs: 0 });
  const [volumes, setVolumesState] = useState<AudioVolumes>({
    ...DEFAULT_VOLUMES,
    ...initialVolumes,
  });
  const [speed, setSpeedState] = useState<PlaybackSpeed>(1.0);
  const [isReady, setIsReady] = useState(false);

  // ── Initialize audio mode ──────────────────────────────────────────────────
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    }).catch((e) => logError('AudioMode', e));
  }, []);

  // ── Load sounds ───────────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setState('loading');
      try {
        // Unload previous sounds
        await voiceRef.current?.unloadAsync();
        await ambientRef.current?.unloadAsync();
        voiceRef.current = null;
        ambientRef.current = null;

        if (!layers.voiceUrl) {
          setState('idle');
          return;
        }

        const voiceVol = (volumes.voice / 100) * (volumes.master / 100);

        const { sound: voiceSound } = await Audio.Sound.createAsync(
          { uri: layers.voiceUrl },
          { volume: voiceVol, rate: speed, shouldCorrectPitch: true },
          (status: AVPlaybackStatus) => {
            if (!mounted) return;
            if (status.isLoaded) {
              setPosition({
                positionMs: status.positionMillis ?? 0,
                durationMs: status.durationMillis ?? 0,
              });
              if (status.didJustFinish) {
                setState('ended');
                onEnd?.();
              }
            }
          },
        );

        if (!mounted) {
          await voiceSound.unloadAsync();
          return;
        }

        voiceRef.current = voiceSound;

        // Load ambient if present
        if (layers.ambientUrl) {
          const ambientVol = (volumes.ambient / 100) * (volumes.master / 100);
          const { sound: ambientSound } = await Audio.Sound.createAsync(
            { uri: layers.ambientUrl },
            { volume: ambientVol, isLooping: true, rate: speed },
          );
          if (!mounted) {
            await ambientSound.unloadAsync();
            return;
          }
          ambientRef.current = ambientSound;
        }

        setIsReady(true);
        setState('paused');
      } catch (e) {
        logError('AudioPlayer.load', e);
        setState('error');
      }
    };

    void load();

    return () => {
      mounted = false;
      void voiceRef.current?.unloadAsync();
      void ambientRef.current?.unloadAsync();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers.voiceUrl, layers.ambientUrl]);

  // ── Volume changes ────────────────────────────────────────────────────────
  useEffect(() => {
    const voiceVol = (volumes.voice / 100) * (volumes.master / 100);
    const ambientVol = (volumes.ambient / 100) * (volumes.master / 100);
    void voiceRef.current?.setVolumeAsync(voiceVol).catch((e) => logError('setVolume.voice', e));
    void ambientRef.current?.setVolumeAsync(ambientVol).catch((e) => logError('setVolume.ambient', e));
  }, [volumes]);

  // ── Speed changes ─────────────────────────────────────────────────────────
  useEffect(() => {
    void voiceRef.current
      ?.setRateAsync(speed, true)
      .catch((e) => logError('setRate.voice', e));
    void ambientRef.current
      ?.setRateAsync(speed, true)
      .catch((e) => logError('setRate.ambient', e));
  }, [speed]);

  // ── Controls ──────────────────────────────────────────────────────────────
  const play = useCallback(async () => {
    try {
      await voiceRef.current?.playAsync();
      await ambientRef.current?.playAsync();
      setState('playing');
    } catch (e) {
      logError('AudioPlayer.play', e);
    }
  }, []);

  const pause = useCallback(async () => {
    try {
      await voiceRef.current?.pauseAsync();
      await ambientRef.current?.pauseAsync();
      setState('paused');
    } catch (e) {
      logError('AudioPlayer.pause', e);
    }
  }, []);

  const seek = useCallback(async (positionMs: number) => {
    try {
      await voiceRef.current?.setPositionAsync(positionMs);
    } catch (e) {
      logError('AudioPlayer.seek', e);
    }
  }, []);

  const setVolumes = useCallback((v: Partial<AudioVolumes>) => {
    setVolumesState((prev) => ({ ...prev, ...v }));
  }, []);

  const setSpeed = useCallback((s: PlaybackSpeed) => {
    setSpeedState(s);
  }, []);

  return { state, position, volumes, speed, play, pause, seek, setVolumes, setSpeed, isReady };
}
