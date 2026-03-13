'use client';

import React, { useEffect, useRef, useState } from 'react';

const BAR_COUNT = 16;
const FFT_SIZE = 256;

export interface RecordingWaveformProps {
  stream: MediaStream | null;
  style?: React.CSSProperties;
}

/**
 * Live waveform during recording. Uses AudioContext + AnalyserNode + MediaStreamSource.
 */
export function RecordingWaveform({ stream, style }: RecordingWaveformProps) {
  const [levels, setLevels] = useState<number[]>(Array(BAR_COUNT).fill(0.1));
  const rafRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    if (!stream || stream.getAudioTracks().length === 0) {
      setLevels(Array(BAR_COUNT).fill(0.1));
      return;
    }

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0.25; // Lower = snappier response to voice
    analyser.minDecibels = -70;
    analyser.maxDecibels = -15;

    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);
    // Connect analyser to destination so the graph runs (AnalyserNode passes through).
    // Use GainNode (gain=0) to avoid feedback — mic is heard only in recording, not speakers.
    const gain = ctx.createGain();
    gain.gain.value = 0;
    analyser.connect(gain);
    gain.connect(ctx.destination);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    contextRef.current = ctx;
    analyserRef.current = analyser;
    sourceRef.current = source;

    // Resume if suspended (browser autoplay policy)
    void ctx.resume();

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      const step = Math.floor(dataArray.length / BAR_COUNT);
      const next: number[] = [];
      for (let i = 0; i < BAR_COUNT; i++) {
        const idx = i * step;
        const v = dataArray[idx] ?? 0;
        next.push(v / 255);
      }
      setLevels(next);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      source.disconnect();
      gain.disconnect();
      analyser.disconnect();
      void ctx.close();
      contextRef.current = null;
      analyserRef.current = null;
      sourceRef.current = null;
    };
  }, [stream]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        height: 48,
        ...style,
      }}
    >
      {levels.map((h, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: Math.max(6, h * 36),
            borderRadius: 3,
            background: '#ef4444',
            opacity: 0.7 + h * 0.3,
            transition: 'height 0.05s ease-out',
          }}
        />
      ))}
    </div>
  );
}
