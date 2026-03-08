'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AudioLayers,
  AudioVolumes,
  PlaybackPosition,
  PlaybackSpeed,
  PlaybackState,
} from '@waqup/shared/types';
import { DEFAULT_VOLUMES } from '@waqup/shared/types';
import { logError } from '@waqup/shared/utils';

interface UseWebAudioPlayerResult {
  state: PlaybackState;
  position: PlaybackPosition;
  volumes: AudioVolumes;
  speed: PlaybackSpeed;
  analyserNode: AnalyserNode | null;
  play: () => void;
  pause: () => void;
  seek: (positionMs: number) => void;
  setVolumes: (v: Partial<AudioVolumes>) => void;
  setSpeed: (s: PlaybackSpeed) => void;
  isReady: boolean;
}

export function useWebAudioPlayer(
  layers: AudioLayers,
  initialVolumes?: Partial<AudioVolumes>,
): UseWebAudioPlayerResult {
  const [state, setState] = useState<PlaybackState>('idle');
  const [position, setPosition] = useState<PlaybackPosition>({ positionMs: 0, durationMs: 0 });
  const [volumes, setVolumesState] = useState<AudioVolumes>({ ...DEFAULT_VOLUMES, ...initialVolumes });
  const [speed, setSpeedState] = useState<PlaybackSpeed>(1.0);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);
  const [isReady, setIsReady] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const voiceSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const ambientSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const voiceGainRef = useRef<GainNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const voiceBufferRef = useRef<AudioBuffer | null>(null);
  const ambientBufferRef = useRef<AudioBuffer | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  // ── Build graph ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!layers.voiceUrl) return;
    let cancelled = false;

    const load = async () => {
      setState('loading');
      try {
        const ctx = new AudioContext();
        ctxRef.current = ctx;

        const masterGain = ctx.createGain();
        const voiceGain = ctx.createGain();
        const ambientGain = ctx.createGain();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;

        masterGain.gain.value = volumes.master / 100;
        voiceGain.gain.value = volumes.voice / 100;
        ambientGain.gain.value = volumes.ambient / 100;

        voiceGain.connect(analyser);
        analyser.connect(masterGain);
        ambientGain.connect(masterGain);
        masterGain.connect(ctx.destination);

        masterGainRef.current = masterGain;
        voiceGainRef.current = voiceGain;
        ambientGainRef.current = ambientGain;
        analyserRef.current = analyser;

        // Fetch and decode voice
        const voiceRes = await fetch(layers.voiceUrl as string);
        const voiceArr = await voiceRes.arrayBuffer();
        const voiceBuffer = await ctx.decodeAudioData(voiceArr);
        voiceBufferRef.current = voiceBuffer;

        // Fetch ambient if present
        if (layers.ambientUrl) {
          const ambRes = await fetch(layers.ambientUrl);
          const ambArr = await ambRes.arrayBuffer();
          ambientBufferRef.current = await ctx.decodeAudioData(ambArr);
        }

        if (cancelled) return;

        setPosition({ positionMs: 0, durationMs: voiceBuffer.duration * 1000 });
        setAnalyserNode(analyser);
        setIsReady(true);
        setState('paused');
      } catch (e) {
        logError('WebAudioPlayer.load', e);
        if (!cancelled) setState('error');
      }
    };

    void load();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      void ctxRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers.voiceUrl, layers.ambientUrl]);

  // ── Volume sync ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (masterGainRef.current) masterGainRef.current.gain.value = volumes.master / 100;
    if (voiceGainRef.current) voiceGainRef.current.gain.value = volumes.voice / 100;
    if (ambientGainRef.current) ambientGainRef.current.gain.value = volumes.ambient / 100;
  }, [volumes]);

  // ── Position tick ───────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || state !== 'playing') return;
    const elapsed = ctx.currentTime - startTimeRef.current + pausedAtRef.current;
    const dur = voiceBufferRef.current?.duration ?? 0;
    setPosition({ positionMs: elapsed * 1000, durationMs: dur * 1000 });
    if (elapsed >= dur && dur > 0) {
      setState('ended');
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [state]);

  useEffect(() => {
    if (state === 'playing') {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [state, tick]);

  // ── Controls ─────────────────────────────────────────────────────────────
  const play = useCallback(() => {
    const ctx = ctxRef.current;
    const vBuf = voiceBufferRef.current;
    if (!ctx || !vBuf) return;

    void ctx.resume();

    const vs = ctx.createBufferSource();
    vs.buffer = vBuf;
    vs.playbackRate.value = speed;
    vs.connect(voiceGainRef.current!);
    voiceSourceRef.current = vs;
    vs.start(0, pausedAtRef.current);

    if (ambientBufferRef.current) {
      const as = ctx.createBufferSource();
      as.buffer = ambientBufferRef.current;
      as.loop = true;
      as.playbackRate.value = speed;
      as.connect(ambientGainRef.current!);
      ambientSourceRef.current = as;
      as.start(0, pausedAtRef.current % ambientBufferRef.current.duration);
    }

    startTimeRef.current = ctx.currentTime;
    setState('playing');
  }, [speed]);

  const pause = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    pausedAtRef.current += ctx.currentTime - startTimeRef.current;
    voiceSourceRef.current?.stop();
    ambientSourceRef.current?.stop();
    voiceSourceRef.current = null;
    ambientSourceRef.current = null;
    void ctx.suspend();
    setState('paused');
  }, []);

  const seek = useCallback((positionMs: number) => {
    const ctx = ctxRef.current;
    const vBuf = voiceBufferRef.current;
    if (!ctx || !vBuf) return;

    const wasPlaying = state === 'playing';
    if (wasPlaying) {
      voiceSourceRef.current?.stop();
      ambientSourceRef.current?.stop();
    }
    pausedAtRef.current = positionMs / 1000;
    setPosition((prev) => ({ ...prev, positionMs }));

    if (wasPlaying) {
      const vs = ctx.createBufferSource();
      vs.buffer = vBuf;
      vs.playbackRate.value = speed;
      vs.connect(voiceGainRef.current!);
      voiceSourceRef.current = vs;
      vs.start(0, pausedAtRef.current);
      startTimeRef.current = ctx.currentTime;
    }
  }, [state, speed]);

  const setVolumes = useCallback((v: Partial<AudioVolumes>) => {
    setVolumesState((prev) => ({ ...prev, ...v }));
  }, []);

  const setSpeed = useCallback((s: PlaybackSpeed) => {
    setSpeedState(s);
    if (voiceSourceRef.current) voiceSourceRef.current.playbackRate.value = s;
    if (ambientSourceRef.current) ambientSourceRef.current.playbackRate.value = s;
  }, []);

  return { state, position, volumes, speed, analyserNode, play, pause, seek, setVolumes, setSpeed, isReady };
}
