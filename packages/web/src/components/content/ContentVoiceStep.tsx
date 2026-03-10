'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { ScienceInsight } from './ScienceInsight';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import { Mic, Sparkles, Square, Play, Pause, Trash2, BookAudio, Check, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import type { UserVoice } from '@waqup/shared/types';
import { RELATIONSHIP_META } from '@waqup/shared/types';
import { getVoices } from '@/lib/api-client';

type VoiceChoice = 'record' | 'ai' | 'library' | null;
type RecordState = 'idle' | 'recording' | 'recorded' | 'playing';

export interface ContentVoiceStepProps {
  backHref: string;
  nextHref: string;
}

export function ContentVoiceStep({ backHref, nextHref }: ContentVoiceStepProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { setCurrentStep, setVoiceId, setVoiceType, setOwnVoiceUrl } = useContentCreation();

  const [choice, setChoice] = useState<VoiceChoice>(null);
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingMime, setRecordingMime] = useState<string>('audio/webm');
  const [duration, setDuration] = useState(0);
  const [uploadingRecording, setUploadingRecording] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [libraryVoices, setLibraryVoices] = useState<UserVoice[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [selectedLibraryVoice, setSelectedLibraryVoice] = useState<UserVoice | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Detect the best supported MIME type — Safari doesn't support audio/webm
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
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };

      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: detectedMime });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordState('recorded');
        setUploadError(null);

        // Upload the recording to Supabase Storage so it can be used by the render route
        setUploadingRecording(true);
        const formData = new FormData();
        formData.append('file', blob, `recording.${detectedMime.includes('mp4') ? 'mp4' : 'webm'}`);
        fetch('/api/audio/upload-recording', { method: 'POST', body: formData })
          .then(async (res) => {
            const data = (await res.json()) as { url?: string; error?: string };
            if (!res.ok || !data.url) {
              setUploadError(data.error ?? 'Upload failed — you can still continue, but playback may not work until re-recorded.');
            } else {
              setUploadedUrl(data.url);
            }
          })
          .catch(() => {
            setUploadError('Recording could not be uploaded. Please check your connection and try again.');
          })
          .finally(() => {
            setUploadingRecording(false);
          });
      };

      mr.start();
      mediaRecorderRef.current = mr;
      setRecordState('recording');
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      setMicError('Microphone access is required. Please allow access in your browser settings and try again.');
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
    setUploadedUrl(null);
    setUploadError(null);
    setRecordState('idle');
    setDuration(0);
  }, []);

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  useEffect(() => {
    if (choice !== 'library') return;
    if (libraryVoices.length > 0) return;

    const load = async () => {
      setLibraryLoading(true);
      try {
        const voices = await getVoices();
        setLibraryVoices(voices);
      } catch {}
      setLibraryLoading(false);
    };

    void load();
  }, [choice, libraryVoices.length]);

  const DEFAULT_AI_VOICE_ID = '21m00Tcm4TlvDq8ikWAM';

  const handleContinue = () => {
    if (choice === 'ai') {
      setVoiceType('ai');
      setVoiceId(DEFAULT_AI_VOICE_ID);
      setOwnVoiceUrl(null);
    } else if (choice === 'record') {
      setVoiceType('own');
      setVoiceId(null);
      // ownVoiceUrl is set asynchronously after the upload completes (see startRecording).
      // It may already be populated by the time the user clicks Continue.
      setOwnVoiceUrl(uploadedUrl);
    } else if (choice === 'library' && selectedLibraryVoice) {
      setVoiceType('own');
      setVoiceId(selectedLibraryVoice.elevenlabs_voice_id ?? null);
      setOwnVoiceUrl(null);
    }
    setCurrentStep('voice');
    router.push(nextHref);
  };

  const canContinue =
    choice === 'ai' ||
    // Own voice: blob must be recorded AND upload must have completed (uploadedUrl set)
    (choice === 'record' && audioBlob !== null && uploadedUrl !== null && !uploadingRecording) ||
    (choice === 'library' && selectedLibraryVoice !== null);

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
          Your own voice is the most powerful option. A professional voice works beautifully too.
        </Typography>
      </motion.div>

      {/* Voice choice cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.md, marginBottom: spacing.xl }}>
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
            backdropFilter: BLUR.lg,
            WebkitBackdropFilter: BLUR.lg,
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
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: choice === 'ai' ? `#c084fc18` : colors.glass.light,
            backdropFilter: BLUR.lg,
            WebkitBackdropFilter: BLUR.lg,
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
            Professional Voice
          </Typography>
          <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.5 }}>
            ElevenLabs neural voice — clear, warm, and professionally produced.
          </Typography>
        </motion.button>

        {/* Voice Library */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setChoice('library')}
          style={{
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: choice === 'library' ? `#f43f5e18` : colors.glass.light,
            backdropFilter: BLUR.lg,
            WebkitBackdropFilter: BLUR.lg,
            border: `1px solid ${choice === 'library' ? '#f43f5e60' : colors.glass.border}`,
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
              background: '#f43f5e20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookAudio size={22} color="#f43f5e" strokeWidth={2} />
          </div>
          <Typography variant="h3" style={{ color: colors.text.primary, margin: 0, fontWeight: 500 }}>
            Voice Library
          </Typography>
          <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, lineHeight: 1.5 }}>
            Use a saved voice — a parent, mentor, partner, or friend.
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
                backdropFilter: BLUR.lg,
                WebkitBackdropFilter: BLUR.lg,
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
                  {micError && (
                    <div
                      style={{
                        padding: `${spacing.sm} ${spacing.md}`,
                        borderRadius: borderRadius.md,
                        background: `${colors.error}12`,
                        border: `1px solid ${colors.error}30`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.sm,
                      }}
                    >
                      <Typography variant="small" style={{ color: colors.error, margin: 0 }}>
                        {micError}
                      </Typography>
                      <button
                        onClick={() => setMicError(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.error, flexShrink: 0, padding: 0, lineHeight: 1 }}
                      >
                        ✕
                      </button>
                    </div>
                  )}
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

                  {/* Upload status */}
                  {uploadingRecording && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                      <Loader2 size={14} color={colors.accent.primary} className="animate-spin" />
                      <Typography variant="small" style={{ color: colors.text.secondary, margin: 0 }}>
                        Saving recording…
                      </Typography>
                    </div>
                  )}
                  {uploadError && !uploadingRecording && (
                    <div style={{
                      display: 'flex', alignItems: 'flex-start', gap: spacing.sm,
                      padding: `${spacing.sm} ${spacing.md}`,
                      borderRadius: 8, background: `${colors.error}12`,
                      border: `1px solid ${colors.error}30`,
                    }}>
                      <AlertCircle size={14} color={colors.error} style={{ flexShrink: 0, marginTop: 2 }} />
                      <Typography variant="small" style={{ color: colors.error, margin: 0 }}>
                        {uploadError}
                      </Typography>
                    </div>
                  )}
                  {uploadedUrl && !uploadingRecording && !uploadError && (
                    <Typography variant="small" style={{ color: '#4ade80', margin: 0 }}>
                      ✓ Recording ready
                    </Typography>
                  )}

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
                We&apos;ll produce your audio using a professional ElevenLabs voice. You can swap to your own recorded voice anytime from the audio studio.
              </Typography>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Library picker */}
      <AnimatePresence>
        {choice === 'library' && (
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
                background: `#f43f5e08`,
                border: `1px solid #f43f5e30`,
              }}
            >
              <AnimatePresence>
                {libraryLoading && (
                  <motion.div
                    key="voice-step-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: `${spacing.xl} 0`,
                    }}
                  >
                    <Loader2 size={24} color={colors.accent.primary} className="animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>
              {!libraryLoading && libraryVoices.length === 0 && (
                <div style={{ textAlign: 'center' }}>
                  <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md, lineHeight: 1.6 }}>
                    Your voice library is empty. Add voices of people who matter in the Sanctuary.
                  </Typography>
                  <a
                    href="/sanctuary/voices"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#f43f5e', fontSize: 14, textDecoration: 'none' }}
                  >
                    Go to Voice Library →
                  </a>
                </div>
              )}
              {!libraryLoading && libraryVoices.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                  <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
                    Choose a voice:
                  </Typography>
                  {libraryVoices.map((v) => {
                    const meta = RELATIONSHIP_META[v.relationship];
                    const isSelected = selectedLibraryVoice?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedLibraryVoice(v)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.md,
                          padding: `${spacing.md} ${spacing.lg}`,
                          borderRadius: borderRadius.lg,
                          border: `1px solid ${isSelected ? meta.color + '80' : colors.glass.border}`,
                          background: isSelected ? `${meta.color}15` : colors.glass.transparent,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: `${meta.color}20`,
                            border: `1.5px solid ${meta.color}50`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            flexShrink: 0,
                          }}
                        >
                          {meta.emoji}
                        </div>
                        <div style={{ flex: 1 }}>
                          <Typography variant="body" style={{ color: colors.text.primary, margin: 0, fontWeight: isSelected ? 500 : 400 }}>
                            {v.name}
                          </Typography>
                          <Typography variant="small" style={{ color: meta.color, fontSize: 11 }}>
                            {meta.label}
                          </Typography>
                        </div>
                        {isSelected && <Check size={16} color={meta.color} />}
                      </button>
                    );
                  })}
                </div>
              )}
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
          <Button variant="ghost" size="md" style={{ color: colors.text.secondary, display: 'flex', alignItems: 'center', gap: 4 }}>
            <ChevronLeft size={16} /> Back
          </Button>
        </Link>
        <Button
          variant="primary"
          size="lg"
          disabled={!canContinue}
          onClick={handleContinue}
          style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}
        >
          {choice === 'record' && uploadingRecording ? (
            <><Loader2 size={16} className="animate-spin" /> Saving…</>
          ) : (
            'Continue to Audio →'
          )}
        </Button>
      </div>
    </div>
  );
}
