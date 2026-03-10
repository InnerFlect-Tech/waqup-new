'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface UseAudioAnalyzerOptions {
  /** Use microphone input when true */
  isListening: boolean;
  /** Audio element for TTS/playback - when provided and playing, analyze this instead of mic */
  audioElement?: HTMLAudioElement | null;
  /** Whether the analyzer should be active (e.g. when orb is visible) */
  enabled?: boolean;
  /** FFT size - must be power of 2 (256 to 32768). Default 2048. */
  fftSize?: number;
  /** Smoothing (0-1). Higher = smoother but less responsive. Default 0.7 */
  smoothingTimeConstant?: number;
}

export interface UseAudioAnalyzerResult {
  /** Ref updated each frame with raw frequency data - read in useFrame to avoid re-renders */
  frequencyDataRef: React.MutableRefObject<Uint8Array | null>;
  /** Average volume (0-255), throttled to reduce re-renders */
  averageLevel: number;
  /** Whether the analyzer is ready and receiving data */
  isReady: boolean;
  /** Error message if setup failed */
  error: string | null;
  /** Resume AudioContext (call on user gesture if suspended) */
  resume: () => Promise<void>;
}

const DEFAULT_FFT_SIZE = 2048;
const DEFAULT_SMOOTHING = 0.7;

/**
 * useAudioAnalyzer - Web Audio API hook for real-time frequency analysis.
 * Connects to microphone (when isListening) or audio element (when playing).
 * AudioContext is created on first user gesture to satisfy browser autoplay policies.
 */
export function useAudioAnalyzer({
  isListening,
  audioElement,
  enabled = true,
  fftSize = DEFAULT_FFT_SIZE,
  smoothingTimeConstant = DEFAULT_SMOOTHING,
}: UseAudioAnalyzerOptions): UseAudioAnalyzerResult {
  const [averageLevel, setAverageLevel] = useState(0);
  const lastAvgUpdateRef = useRef(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null>(null);
  const rafRef = useRef<number>(0);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const resume = useCallback(async () => {
    const ctx = contextRef.current;
    if (ctx?.state === 'suspended') {
      await ctx.resume();
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) {
      return;
    }

    const hasAudioSource = isListening || (audioElement && !audioElement.paused);

    if (!hasAudioSource) {
      if (contextRef.current?.state === 'running') {
        contextRef.current.suspend();
      }
      queueMicrotask(() => {
        setIsReady(false);
        setAverageLevel(0);
      });
      dataArrayRef.current = null;
      return;
    }

    let cancelled = false;

    const setup = async () => {
      try {
        setError(null);

        if (!contextRef.current) {
          contextRef.current = new AudioContext();
        }

        const ctx = contextRef.current;

        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        if (!analyserRef.current) {
          const analyser = ctx.createAnalyser();
          analyser.fftSize = fftSize;
          analyser.smoothingTimeConstant = smoothingTimeConstant;
          analyser.minDecibels = -90;
          analyser.maxDecibels = -10;
          analyserRef.current = analyser;
        }

        const analyser = analyserRef.current;
        analyser.smoothingTimeConstant = smoothingTimeConstant;

        if (dataArrayRef.current?.length !== analyser.frequencyBinCount) {
          dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        }

        const dataArray = dataArrayRef.current;

        analyser.disconnect();

        if (sourceRef.current) {
          try {
            sourceRef.current.disconnect();
          } catch {
            /* ignore */
          }
          sourceRef.current = null;
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }

        if (isListening) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: false,
            },
          });

          if (cancelled) {
            stream.getTracks().forEach((t) => t.stop());
            return;
          }

          streamRef.current = stream;
          const source = ctx.createMediaStreamSource(stream);
          source.connect(analyser);
          const gain = ctx.createGain();
          gain.gain.value = 0;
          analyser.connect(gain);
          gain.connect(ctx.destination);
          sourceRef.current = source;
        } else if (audioElement) {
          const source = ctx.createMediaElementSource(audioElement);
          source.connect(analyser);
          analyser.connect(ctx.destination);
          sourceRef.current = source;
        }

        setIsReady(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to setup audio';
        setError(msg);
        setIsReady(false);
      }
    };

    setup();

    return () => {
      cancelled = true;
    };
  }, [enabled, isListening, audioElement, fftSize, smoothingTimeConstant]);

  useEffect(() => {
    if (!enabled || !isReady || !analyserRef.current || !dataArrayRef.current) {
      return;
    }

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    const tick = (now: number) => {
      analyser.getByteFrequencyData(dataArray as Uint8Array<ArrayBuffer>);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = dataArray.length > 0 ? sum / dataArray.length : 0;

      if (now - lastAvgUpdateRef.current > 100) {
        lastAvgUpdateRef.current = now;
        setAverageLevel(avg);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [enabled, isReady]);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch {
          /* ignore */
        }
        sourceRef.current = null;
      }
      // Close the AudioContext to release the browser resource slot.
      // Suspending without closing causes a leak — Chrome allows ~6 contexts.
      void contextRef.current?.close();
      contextRef.current = null;
    };
  }, []);

  return {
    frequencyDataRef: dataArrayRef,
    averageLevel,
    isReady,
    error,
    resume,
  };
}
