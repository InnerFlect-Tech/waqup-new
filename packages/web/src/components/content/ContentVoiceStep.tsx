'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { ScienceInsight } from './ScienceInsight';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { Mic, Sparkles, Square, Play, Pause, Trash2 } from 'lucide-react';

type VoiceChoice = 'record' | 'ai' | null;
type RecordState = 'idle' | 'recording' | 'recorded' | 'playing';

export interface ContentVoiceStepProps {
  backHref: string;
  nextHref: string;
}

export function ContentVoiceStep({ backHref, nextHref }: ContentVoiceStepProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { setCurrentStep } = useContentCreation();

  const [choice, setChoice] = useState<VoiceChoice>(null);
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordState('recorded');
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecordState('recording');
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      alert('Microphone access is required to record your voice. Please allow access in your browser settings.');
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
    audioRef.current.play();
    setRecordState('playing');
  }, [audioUrl]);

  const pauseRecording = useCallback(() => {
    audioRef.current?.pause();
    setRecordState('recorded');
  }, []);

  const deleteRecording = useCallback(() => {
    audioRef.current?.pause();
    audioRef.current = null;
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordState('idle');
    setDuration(0);
  }, []);

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleContinue = () => {
    setCurrentStep('voice');
    router.push(nextHref);
  };

  const canContinue = choice === 'ai' || (choice === 'record' && audioBlob !== null);

  return (
    <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: spacing.xl, textAlign: 'center' }}
      >
        <Typography variant="h1" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
          Choose your voice
        </Typography>
        <Typography variant="body" style={{ color: colors.text.secondary }}>
          Your own voice carries the highest neural impact — but AI voice is still powerful.
        </Typography>
      </motion.div>

      {/* Voice choice cards */}
      <div style={{ display: 'flex', gap: spacing.md, marginBottom: spacing.xl }}>
        {/* Record */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setChoice('record')}
          style={{
            flex: 1,
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: choice === 'record' ? `#60a5fa18` : colors.glass.light,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${choice === 'record' ? '#60a5fa60' : colors.glass.border}`,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: borderRadius.md,
              background: '#60a5fa20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Mic size={22} color="#60a5fa" strokeWidth={2} />
          </div>
          <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, fontWeight: 500 }}>
            My Voice
          </Typography>
          <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.5 }}>
            Hear your own voice — the most powerful form of identity encoding.
          </Typography>
        </motion.button>

        {/* AI Voice */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => setChoice('ai')}
          style={{
            flex: 1,
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: choice === 'ai' ? `#c084fc18` : colors.glass.light,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${choice === 'ai' ? '#c084fc60' : colors.glass.border}`,
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: borderRadius.md,
              background: '#c084fc20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={22} color="#c084fc" strokeWidth={2} />
          </div>
          <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, fontWeight: 500 }}>
            AI Voice
          </Typography>
          <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.5 }}>
            ElevenLabs neural voice — clear, warm, and professionally produced.
          </Typography>
        </motion.button>
      </div>

      {/* Recording interface */}
      <AnimatePresence>
        {choice === 'record' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: spacing.xl, overflow: 'hidden' }}
          >
            <div
              style={{
                padding: spacing.xl,
                borderRadius: borderRadius.xl,
                background: colors.glass.light,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${colors.glass.border}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.lg,
              }}
            >
              {recordState === 'idle' && (
                <>
                  <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center' }}>
                    Read your script aloud in a calm, intentional voice. Take a breath before you start.
                  </Typography>
                  <Button variant="primary" size="lg" onClick={startRecording} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <Mic size={18} />
                    Start Recording
                  </Button>
                </>
              )}

              {recordState === 'recording' && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: `#ef444420`,
                      border: `2px solid #ef4444`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Mic size={28} color="#ef4444" />
                  </motion.div>
                  <Typography variant="h3" style={{ color: '#ef4444', margin: 0 }}>
                    {formatDuration(duration)}
                  </Typography>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={stopRecording}
                    style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, color: colors.text.secondary }}
                  >
                    <Square size={14} />
                    Stop Recording
                  </Button>
                </>
              )}

              {(recordState === 'recorded' || recordState === 'playing') && (
                <>
                  <Typography variant="body" style={{ color: colors.text.secondary }}>
                    Recording saved · {formatDuration(duration)}
                  </Typography>
                  <div style={{ display: 'flex', gap: spacing.md }}>
                    {recordState === 'playing' ? (
                      <Button variant="ghost" size="md" onClick={pauseRecording} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        <Pause size={14} /> Pause
                      </Button>
                    ) : (
                      <Button variant="ghost" size="md" onClick={playRecording} style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        <Play size={14} /> Play back
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={deleteRecording}
                      style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, color: colors.text.secondary, opacity: 0.6 }}
                    >
                      <Trash2 size={13} /> Re-record
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI voice info */}
      <AnimatePresence>
        {choice === 'ai' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: spacing.xl, overflow: 'hidden' }}
          >
            <div
              style={{
                padding: spacing.lg,
                borderRadius: borderRadius.xl,
                background: `#c084fc0a`,
                border: `1px solid #c084fc30`,
              }}
            >
              <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
                We'll generate your audio using ElevenLabs' neural voice. You can swap to your own recorded voice at any time from the audio studio.
              </Typography>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScienceInsight
        topic="voice-identity"
        insight="Your own voice speaking affirmations activates auditory, motor, and emotional regions simultaneously — deepening the neural encoding beyond what any external voice can achieve."
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xl }}>
        <Link href={backHref} style={{ textDecoration: 'none' }}>
          <Button variant="ghost" size="md" style={{ color: colors.text.secondary }}>
            ← Back
          </Button>
        </Link>
        <Button variant="primary" size="lg" disabled={!canContinue} onClick={handleContinue}>
          Continue to Audio →
        </Button>
      </div>
    </div>
  );
}
