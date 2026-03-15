'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { RecordingWaveform } from '@/components/content/RecordingWaveform';
import { Mic, Square, Play, Pause, Trash2, Loader2, AlertCircle } from 'lucide-react';

/** ElevenLabs recommends 30+ seconds; allow up to 3 minutes. */
const MIN_RECORDING_SEC = 30;
const MAX_RECORDING_SEC = 180;

type RecordState = 'idle' | 'recording' | 'recorded' | 'playing';

export interface VoiceSampleRecorderProps {
  /** Called when recording is complete and ready to submit. Blob can be converted to File for API. */
  onRecordingReady: (blob: Blob, mime: string) => void;
  /** Optional: reset external state when user clears recording */
  onReset?: () => void;
  /** Primary label for the record button */
  recordLabel?: string;
}

export function VoiceSampleRecorder({
  onRecordingReady,
  onReset,
  recordLabel = 'Record your voice',
}: VoiceSampleRecorderProps) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingMime, setRecordingMime] = useState<string>('audio/webm');
  const [duration, setDuration] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
            ? 'audio/mp4'
            : '';

      const mr = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      const detectedMime = mr.mimeType || mimeType || 'audio/webm';
      setRecordingMime(detectedMime);

      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        setRecordingStream(null);
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: detectedMime });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordState('recorded');
      };

      mr.start();
      mediaRecorderRef.current = mr;
      setRecordingStream(stream);
      setRecordState('recording');
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration((d) => {
          const next = d + 1;
          if (next >= MAX_RECORDING_SEC) {
            mediaRecorderRef.current?.stop();
            if (timerRef.current) clearInterval(timerRef.current);
            return MAX_RECORDING_SEC;
          }
          return next;
        });
      }, 1000);
    } catch {
      setMicError(
        'Microphone access is required. Please allow access in your browser settings and try again.'
      );
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const playRecording = useCallback(() => {
    if (!audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setRecordState('recorded');
    }
    audioRef.current.play().catch(() => {});
    setRecordState('playing');
  }, [audioUrl]);

  const pauseRecording = useCallback(() => {
    audioRef.current?.pause();
    setRecordState('recorded');
  }, []);

  const deleteRecording = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordState('idle');
    setDuration(0);
    onReset?.();
  }, [audioUrl, onReset]);

  const confirmAndSubmit = useCallback(() => {
    if (audioBlob && duration >= MIN_RECORDING_SEC) {
      onRecordingReady(audioBlob, recordingMime);
    }
  }, [audioBlob, duration, recordingMime, onRecordingReady]);

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      recordingStream?.getTracks().forEach((t) => t.stop());
    };
  }, [audioUrl, recordingStream]);

  if (micError) {
    return (
      <div
        style={{
          padding: spacing.md,
          borderRadius: borderRadius.md,
          background: `${colors.error}18`,
          border: `1px solid ${colors.error}40`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: spacing.sm,
        }}
      >
        <AlertCircle size={16} color={colors.error} style={{ marginTop: 2, flexShrink: 0 }} />
        <Typography variant="small" style={{ color: colors.error }}>
          {micError}
        </Typography>
        <Button variant="ghost" size="sm" onClick={() => { setMicError(null); void startRecording(); }}>
          Try again
        </Button>
      </div>
    );
  }

  if (recordState === 'idle') {
    return (
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={startRecording}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.sm }}
      >
        <Mic size={20} />
        {recordLabel}
      </Button>
    );
  }

  if (recordState === 'recording') {
    return (
      <div
        style={{
          padding: spacing.lg,
          borderRadius: borderRadius.lg,
          background: `${colors.error}0C`,
          border: `1px solid ${colors.error}30`,
        }}
      >
        <RecordingWaveform stream={recordingStream} style={{ marginBottom: spacing.md }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.md,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="body" style={{ color: colors.text.primary }}>
            {formatDuration(duration)}
            {duration < MIN_RECORDING_SEC && (
              <Typography variant="small" as="span" style={{ color: colors.text.secondary, marginLeft: spacing.sm }}>
                (record at least {MIN_RECORDING_SEC}s for best results)
              </Typography>
            )}
          </Typography>
          <Button variant="outline" size="md" onClick={stopRecording}>
            <Square size={16} style={{ marginRight: spacing.xs }} />
            Stop
          </Button>
        </div>
      </div>
    );
  }

  // recorded | playing
  const isPlaying = recordState === 'playing';
  const meetsMinDuration = duration >= MIN_RECORDING_SEC;

  return (
    <div
      style={{
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        background: colors.glass.transparent,
        border: `1px solid ${colors.glass.border}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
          marginBottom: spacing.md,
        }}
      >
        <Typography variant="body" style={{ color: colors.text.primary }}>
          {formatDuration(duration)}
          {!meetsMinDuration && (
            <Typography variant="small" as="span" style={{ color: colors.accent.primary, marginLeft: spacing.sm }}>
              (record at least {MIN_RECORDING_SEC}s for best results)
            </Typography>
          )}
        </Typography>
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={isPlaying ? pauseRecording : playRecording}
          >
            {isPlaying ? (
              <Pause size={16} style={{ marginRight: spacing.xs }} />
            ) : (
              <Play size={16} style={{ marginRight: spacing.xs }} />
            )}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          <Button variant="ghost" size="sm" onClick={deleteRecording}>
            <Trash2 size={16} style={{ marginRight: spacing.xs }} />
            Re-record
          </Button>
        </div>
      </div>
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={confirmAndSubmit}
        disabled={!meetsMinDuration}
      >
        {meetsMinDuration ? 'Use this recording' : `Record at least ${MIN_RECORDING_SEC} seconds`}
      </Button>
    </div>
  );
}
