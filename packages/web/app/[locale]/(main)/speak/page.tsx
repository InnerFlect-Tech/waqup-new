'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useCreditBalance } from '@/hooks';
import { useTheme, NAV_TOP_OFFSET, SPEAK_BOTTOM_UI_HEIGHT, spacing, borderRadius } from '@/theme';
import { withOpacity } from '@waqup/shared/theme';
import type { OrbState } from '@/components/audio';
import { ORB_INTRO_SHORT } from '@waqup/shared/constants';

const VoiceOrb = dynamic(
  () => import('@/components/orb').then((mod) => ({ default: mod.VoiceOrb })),
  { ssr: false }
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id:      string;
  role:    'user' | 'assistant';
  content: string;
}

interface ElevenLabsConfig {
  oracleEngine?:    'browser' | 'elevenlabs';
  oracleVoiceId?:   string;
  oracleModel?:     string;
  stability?:       number;
  similarityBoost?: number;
  style?:           number;
  useSpeakerBoost?: boolean;
  speed?:           number;
  optimizeLatency?: number;
}

interface OracleConfig {
  systemPrompt?: string;
  temperature?:  number;
  maxTokens?:    number;
}

interface SessionInfo {
  id:           string;
  repliesTotal: number;
  repliesUsed:  number;
  expiresAt:    string;
}

const EL_KEY     = 'elevenlabs-config';
const CONFIG_KEY = 'oracle-config';

const Q_OPTIONS = [
  { qs: 1, replies: 3 },
  { qs: 2, replies: 6 },
  { qs: 5, replies: 15 },
];

function uid(): string {
  return Math.random().toString(36).slice(2);
}

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const buf    = new ArrayBuffer(binary.length);
  const view   = new Uint8Array(buf);
  for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
  return buf;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SpeakPage() {
  const { theme } = useTheme();
  const c = theme.colors;
  const { balance: creditBalance, refetch: refetchBalance } = useCreditBalance();
  const locale = useLocale();

  // ── Core state ───────────────────────────────────────────────────────────
  const [orbState, setOrbState]       = useState<OrbState>('idle');
  const [messages, setMessages]       = useState<Message[]>([]);
  const [streamingText, setStreamingText] = useState('');   // assistant text streaming in
  const [interimText, setInterimText] = useState('');       // user partial transcript
  const [hasSupport, setHasSupport]   = useState(true);

  // ── Session state ────────────────────────────────────────────────────────
  const [session, setSession]         = useState<SessionInfo | null>(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError]     = useState('');
  const [oracleError, setOracleError]       = useState('');
  const [selectedQs, setSelectedQs]   = useState(1);
  const [autoRefill, setAutoRefill]   = useState(false);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const orbStateRef      = useRef<OrbState>('idle');
  const messagesRef      = useRef<Message[]>([]);
  const sessionRef       = useRef<SessionInfo | null>(null);
  const autoRefillRef    = useRef(false);
  const selectedQsRef    = useRef(1);
  const elConfigRef      = useRef<ElevenLabsConfig>({});
  const oracleConfigRef  = useRef<OracleConfig>({});

  // Speech recognition
  const recognitionRef   = useRef<SpeechRecognition | null>(null);
  const recognitionActive = useRef(false);
  const sendTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Web Audio (TTS playback + analyser for orb reactivity)
  const audioCtxRef      = useRef<AudioContext | null>(null);
  const analyserRef      = useRef<AnalyserNode | null>(null);
  const audioQueueRef    = useRef<AudioBuffer[]>([]);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isPlayingRef     = useRef(false);
  const pendingChunksRef = useRef<ArrayBuffer[]>([]); // raw chunks before decoding

  // Frequency data for orb — we write either mic or TTS data here
  const ttsFreqDataRef   = useRef<Uint8Array<ArrayBufferLike> | null>(null);
  const masterFreqRef    = useRef<Uint8Array<ArrayBufferLike> | null>(null);

  // Mic analyser (from browser API)
  const micAnalyserRef   = useRef<AnalyserNode | null>(null);
  const micStreamRef     = useRef<MediaStream | null>(null);
  const micFreqDataRef   = useRef<Uint8Array<ArrayBufferLike> | null>(null);
  const micRafRef        = useRef<number>(0);

  // Streaming state machine
  const streamAbortRef   = useRef<AbortController | null>(null);
  const scrollRef        = useRef<HTMLDivElement>(null);
  const transcriptRef    = useRef<HTMLDivElement>(null);

  // Stable self-reference for session refill
  const doStartSessionRef = useRef<((qs: number) => Promise<void>) | null>(null);

  // ── Keep refs in sync with state ─────────────────────────────────────────
  useEffect(() => { orbStateRef.current = orbState; }, [orbState]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { sessionRef.current = session; }, [session]);
  useEffect(() => { autoRefillRef.current = autoRefill; }, [autoRefill]);
  useEffect(() => { selectedQsRef.current = selectedQs; }, [selectedQs]);

  // ── Load configs from localStorage ───────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(EL_KEY);
      if (raw) elConfigRef.current = JSON.parse(raw) as ElevenLabsConfig;
    } catch { /* ignore */ }
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (raw) oracleConfigRef.current = JSON.parse(raw) as OracleConfig;
    } catch { /* ignore */ }
  }, []);

  // ── Auto-scroll transcript to bottom ─────────────────────────────────────
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  // ── Web Audio: initialise TTS audio context ───────────────────────────────
  const initAudioContext = useCallback(() => {
    if (audioCtxRef.current) return;
    const ctx      = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize               = 2048;
    analyser.smoothingTimeConstant = 0.4;
    analyser.connect(ctx.destination);
    audioCtxRef.current  = ctx;
    analyserRef.current  = analyser;
    ttsFreqDataRef.current = new Uint8Array(analyser.frequencyBinCount);
  }, []);

  // RAF loop: read TTS analyser into masterFreqRef when speaking
  const ttsRafRef = useRef<number>(0);
  const startTtsAnalyserLoop = useCallback(() => {
    const tick = () => {
      if (analyserRef.current && ttsFreqDataRef.current) {
        analyserRef.current.getByteFrequencyData(ttsFreqDataRef.current as Uint8Array<ArrayBuffer>);
        masterFreqRef.current = ttsFreqDataRef.current;
      }
      ttsRafRef.current = requestAnimationFrame(tick);
    };
    ttsRafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTtsAnalyserLoop = useCallback(() => {
    cancelAnimationFrame(ttsRafRef.current);
  }, []);

  // ── Play next buffer from queue ───────────────────────────────────────────
  const onQueueDrained = useCallback(() => {
    isPlayingRef.current = false;
    stopTtsAnalyserLoop();
    masterFreqRef.current = null;

    // After orb finishes speaking, return to listening if session has replies
    const s = sessionRef.current;
    if (s && s.repliesUsed < s.repliesTotal) {
      setOrbState('listening');
      // re-enable speech recognition
      if (recognitionRef.current && !recognitionActive.current) {
        try {
          recognitionRef.current.start();
          recognitionActive.current = true;
        } catch { /* already running */ }
      }
    } else if (autoRefillRef.current) {
      void doStartSessionRef.current?.(selectedQsRef.current);
    } else {
      setOrbState('idle');
    }
  }, [stopTtsAnalyserLoop]);

  const playNextFromQueue = useCallback(() => {
    const ctx      = audioCtxRef.current;
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    if (audioQueueRef.current.length === 0) {
      // Check if stream is still sending chunks
      if (!isPlayingRef.current) return;
      // All current buffers played but stream may still be arriving — wait.
      // onended will re-trigger this when called.
      onQueueDrained();
      return;
    }

    isPlayingRef.current = true;
    const buffer = audioQueueRef.current.shift()!;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(analyser);
    source.start();
    currentSourceRef.current = source;

    source.onended = () => {
      currentSourceRef.current = null;
      playNextFromQueue();
    };
  }, [onQueueDrained]);

  const enqueueAudioChunk = useCallback(async (base64: string) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    try {
      const ab     = base64ToArrayBuffer(base64);
      const buffer = await ctx.decodeAudioData(ab);
      audioQueueRef.current.push(buffer);

      if (!isPlayingRef.current) {
        isPlayingRef.current = true;
        startTtsAnalyserLoop();
        setOrbState('speaking');
        playNextFromQueue();
      }
    } catch {
      // MP3 frame boundaries can sometimes cause decode errors on partial chunks.
      // Silently drop — the next chunk will continue playback.
    }
  }, [playNextFromQueue, startTtsAnalyserLoop]);

  // ── Interrupt current TTS audio (user spoke mid-reply) ───────────────────
  const interruptTts = useCallback(() => {
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch { /* already stopped */ }
      currentSourceRef.current = null;
    }
    audioQueueRef.current = [];
    isPlayingRef.current  = false;
    stopTtsAnalyserLoop();
    masterFreqRef.current = null;

    if (streamAbortRef.current) {
      streamAbortRef.current.abort();
      streamAbortRef.current = null;
    }

    setStreamingText('');
    setOrbState('interrupted');
    setTimeout(() => setOrbState('listening'), 300);
  }, [stopTtsAnalyserLoop]);

  // ── Browser TTS fallback ──────────────────────────────────────────────────
  const speakBrowserFallback = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88; utterance.pitch = 0.85;
    utterance.onend = () => onQueueDrained();
    utterance.onerror = () => setOrbState('error');
    window.speechSynthesis.speak(utterance);
    setOrbState('speaking');
  }, [onQueueDrained]);

  // ── Send transcript to oracle via streaming SSE ───────────────────────────
  const sendToOracle = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const s = sessionRef.current;
    if (!s) return;

    setOracleError('');
    const userMsg: Message = { id: uid(), role: 'user', content: text.trim() };
    const nextMessages     = [...messagesRef.current, userMsg];
    setMessages(nextMessages);
    setInterimText('');
    setStreamingText('');
    setOrbState('thinking');

    // Stop listening while oracle processes
    recognitionActive.current = false;
    recognitionRef.current?.abort();

    const abort = new AbortController();
    streamAbortRef.current = abort;

    const el    = elConfigRef.current;
    const cfg   = oracleConfigRef.current;
    const voiceId = el.oracleVoiceId ?? '';

    try {
      const res = await fetch('/api/oracle/stream', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        signal:  abort.signal,
        body: JSON.stringify({
          sessionId:    s.id,
          messages:     nextMessages.map(m => ({ role: m.role, content: m.content })),
          voiceId,
          locale,
          ...(cfg.systemPrompt !== undefined && { systemPrompt: cfg.systemPrompt }),
          ...(cfg.temperature  !== undefined && { temperature:  cfg.temperature }),
          ...(cfg.maxTokens    !== undefined && { maxTokens:    cfg.maxTokens }),
          voiceSettings: {
            stability:         el.stability        ?? 0.5,
            similarity_boost:  el.similarityBoost  ?? 0.75,
            style:             el.style            ?? 0.0,
            use_speaker_boost: el.useSpeakerBoost  ?? true,
            speed:             el.speed            ?? 1.0,
          },
        }),
      });

      if (!res.ok || !res.body) {
        let errMsg = 'Something went wrong. Please try again.';
        try {
          const text = await res.text();
          const line = text.split('\n').find((l) => l.startsWith('data: '));
          if (line) {
            const raw = line.slice(6).trim();
            const ev = JSON.parse(raw) as { message?: string };
            if (ev.message) errMsg = ev.message;
          }
        } catch { /* ignore parse */ }
        setOracleError(errMsg);
        setOrbState('error');
        return;
      }

      setOracleError('');
      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = '';
      let   fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          if (!part.startsWith('data: ')) continue;
          const raw = part.slice(6).trim();
          if (!raw) continue;

          let event: Record<string, unknown>;
          try { event = JSON.parse(raw); } catch { continue; }

          switch (event.type) {
            case 'session_info': {
              setSession(prev => prev ? {
                ...prev,
                repliesUsed: event.repliesUsed as number,
              } : null);
              break;
            }

            case 'text_delta': {
              fullText += event.content as string;
              setStreamingText(fullText);
              break;
            }

            case 'text_done': {
              const finalText = (event.content as string) || fullText;
              const aiMsg: Message = { id: uid(), role: 'assistant', content: finalText };
              setMessages(prev => [...prev, aiMsg]);
              setStreamingText('');
              fullText = '';
              break;
            }

            case 'audio_chunk': {
              if (!audioCtxRef.current) initAudioContext();
              void enqueueAudioChunk(event.data as string);
              break;
            }

            case 'audio_done':
              // Stream finished sending audio — playNextFromQueue handles the rest
              if (!isPlayingRef.current) onQueueDrained();
              break;

            case 'audio_error':
              // ElevenLabs unavailable — fallback to browser TTS
              if (fullText) speakBrowserFallback(fullText);
              break;

            case 'error': {
              const code = event.code as string | undefined;
              if (code === 'session_exhausted') {
                setSession(prev => prev ? { ...prev, repliesUsed: prev.repliesTotal } : null);
                if (autoRefillRef.current) {
                  void doStartSessionRef.current?.(selectedQsRef.current);
                } else {
                  setOrbState('low_credits');
                }
              } else {
                setOrbState('error');
              }
              break;
            }
          }
        }
      }
    } catch (err) {
      if ((err as { name?: string }).name === 'AbortError') return;
      setOrbState('error');
    } finally {
      streamAbortRef.current = null;
      refetchBalance();
    }
  }, [enqueueAudioChunk, initAudioContext, locale, onQueueDrained, refetchBalance, speakBrowserFallback]);

  // ── Mic analyser loop (for listening/hearing states) ─────────────────────
  const startMicAnalyser = useCallback(async () => {
    if (micAnalyserRef.current) return; // already running
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const ctx      = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize               = 2048;
      analyser.smoothingTimeConstant = 0.4;
      micAnalyserRef.current = analyser;
      micFreqDataRef.current = new Uint8Array(analyser.frequencyBinCount);
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const tick = () => {
        if (micAnalyserRef.current && micFreqDataRef.current) {
          micAnalyserRef.current.getByteFrequencyData(micFreqDataRef.current as Uint8Array<ArrayBuffer>);
          // Only route mic data to masterFreqRef when in mic-active states
          const s = orbStateRef.current;
          if (s === 'listening' || s === 'hearing' || s === 'transcribing') {
            masterFreqRef.current = micFreqDataRef.current;
          }
        }
        micRafRef.current = requestAnimationFrame(tick);
      };
      micRafRef.current = requestAnimationFrame(tick);
    } catch {
      // Mic permission denied — handled at recognition level
    }
  }, []);

  const stopMicAnalyser = useCallback(() => {
    cancelAnimationFrame(micRafRef.current);
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    micStreamRef.current = null;
    micAnalyserRef.current = null;
  }, []);

  // ── Speech recognition ────────────────────────────────────────────────────
  const initRecognition = useCallback(() => {
    if (typeof window === 'undefined') return;
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) { setHasSupport(false); return; }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    const rec              = new SR();
    rec.continuous         = true;
    rec.interimResults     = true;
    rec.lang               = 'en-US';
    recognitionRef.current = rec;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      let interim = '';
      let final   = '';

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }

      // Interrupt if user speaks while oracle is replying
      const curState = orbStateRef.current;
      if (
        (curState === 'speaking' || curState === 'thinking') &&
        (final.trim().length > 2 || interim.trim().length > 6)
      ) {
        interruptTts();
      }

      if (interim) {
        setInterimText(interim);
        if (curState === 'listening') setOrbState('hearing');
      }

      if (final.trim()) {
        setInterimText('');
        if (sendTimerRef.current) clearTimeout(sendTimerRef.current);
        sendTimerRef.current = setTimeout(() => {
          void sendToOracle(final.trim());
        }, 250);
      }
    };

    rec.onend = () => {
      recognitionActive.current = false;
      // Auto-restart if we should still be listening
      const s = orbStateRef.current;
      if (s === 'listening' || s === 'hearing') {
        try {
          rec.start();
          recognitionActive.current = true;
        } catch { /* already running */ }
      }
    };

    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      recognitionActive.current = false;
      if (e.error === 'not-allowed') {
        setOrbState('error');
      } else if (e.error !== 'no-speech' && e.error !== 'aborted') {
        setTimeout(() => {
          if (orbStateRef.current === 'listening') {
            try { rec.start(); recognitionActive.current = true; } catch { /* ignore */ }
          }
        }, 1200);
      }
    };
  }, [interruptTts, sendToOracle]);

  // ── Start oracle session ──────────────────────────────────────────────────
  const doStartSession = useCallback(async (qs: number) => {
    setSessionError('');
    setSessionLoading(true);
    setOrbState('idle');

    try {
      const res  = await fetch('/api/oracle/session', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ qs }),
      });
      const data = await res.json() as {
        sessionId?:     string;
        repliesAllowed?: number;
        expiresAt?:     string;
        message?:       string;
        error?:         string;
      };

      if (!res.ok) {
        const msg = data.message ?? data.error ?? (res.status === 402
          ? 'Not enough Qs. Get more to continue.'
          : 'Failed to start session. Please try again.');
        setSessionError(msg);
        setOrbState('idle');
        return;
      }

      const newSession: SessionInfo = {
        id:           data.sessionId!,
        repliesTotal: data.repliesAllowed ?? qs * 3,
        repliesUsed:  0,
        expiresAt:    data.expiresAt ?? '',
      };
      setSession(newSession);
      refetchBalance();

      // Start mic analyser + recognition
      await startMicAnalyser();
      initRecognition();
      initAudioContext();

      setOrbState('listening');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          recognitionActive.current = true;
        } catch { /* ignore */ }
      }
    } catch {
      setSessionError('Something went wrong. Please try again.');
      setOrbState('idle');
    } finally {
      setSessionLoading(false);
    }
  }, [initAudioContext, initRecognition, refetchBalance, startMicAnalyser]);

  useEffect(() => {
    doStartSessionRef.current = doStartSession;
  }, [doStartSession]);

  // ── End session ───────────────────────────────────────────────────────────
  const endSession = useCallback(() => {
    streamAbortRef.current?.abort();
    recognitionRef.current?.abort();
    recognitionActive.current = false;
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch { /* ignore */ }
    }
    stopTtsAnalyserLoop();
    stopMicAnalyser();
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    masterFreqRef.current = null;
    window.speechSynthesis?.cancel();
    setSession(null);
    setOracleError('');
    setStreamingText('');
    setInterimText('');
    setOrbState('idle');
  }, [stopMicAnalyser, stopTtsAnalyserLoop]);

  // ── Reset scroll on mount (prevents wrong orb position when navigating back) ─
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ── Cleanup on unmount: stop TTS, recognition, and release audio resources ─
  useEffect(() => {
    return () => {
      streamAbortRef.current?.abort();
      recognitionRef.current?.abort();
      recognitionActive.current = false;
      cancelAnimationFrame(micRafRef.current);
      cancelAnimationFrame(ttsRafRef.current);
      micStreamRef.current?.getTracks().forEach(t => t.stop());
      if (sendTimerRef.current) clearTimeout(sendTimerRef.current);
      window.speechSynthesis?.cancel();
      // Stop Web Audio TTS and release resources
      if (currentSourceRef.current) {
        try { currentSourceRef.current.stop(); } catch { /* ignore */ }
        currentSourceRef.current = null;
      }
      audioQueueRef.current = [];
      pendingChunksRef.current = [];
      isPlayingRef.current = false;
      masterFreqRef.current = null;
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, []);

  // ── Orb tap handler ───────────────────────────────────────────────────────
  const handleOrbTap = useCallback(() => {
    const s = orbStateRef.current;
    if (s === 'speaking') { interruptTts(); return; }
    if (s === 'error')    { setOrbState('idle'); return; }
    if (s === 'low_credits') { /* let upsell handle */ return; }
  }, [interruptTts]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const inSession       = session !== null;
  const repliesLeft     = session ? session.repliesTotal - session.repliesUsed : 0;
  const isLowCredits    = creditBalance !== undefined && creditBalance < 1;

  const orbSize = `min(calc(100dvh - ${NAV_TOP_OFFSET} - ${SPEAK_BOTTOM_UI_HEIGHT}), 72vmin, 460px)`;

  return (
    <div
      style={{
        position: 'fixed',
        top:    NAV_TOP_OFFSET,
        left:   0,
        right:  0,
        bottom: 0,
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'flex-end',
        overflow:       'hidden',
        background:     'transparent',
      }}
    >
      {/* ── Background glow ── */}
      <div
        style={{
          position:  'absolute',
          inset:     0,
          background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${withOpacity(c.accent.primary, 0.12)} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Transcript (behind orb when empty, scrolls in session) ── */}
      <AnimatePresence>
        {inSession && (messages.length > 0 || streamingText) && (
          <motion.div
            ref={transcriptRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position:   'absolute',
              left:       '50%',
              transform:  'translateX(-50%)',
              width:      'min(640px, 90vw)',
              maxHeight:  '30vh',
              overflowY:  'auto',
              bottom:     `calc(${SPEAK_BOTTOM_UI_HEIGHT} + 8px)`,
              zIndex:     2,
              display:    'flex',
              flexDirection: 'column',
              gap: 6,
              paddingBottom: 8,
              scrollbarWidth: 'none',
            }}
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  alignSelf:    msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth:     '80%',
                  padding:      '6px 12px',
                  borderRadius: 12,
                  fontSize:     13,
                  lineHeight:   1.5,
                  background:   msg.role === 'user'
                    ? withOpacity(c.accent.primary, 0.2)
                    : c.glass.dark,
                  border:       msg.role === 'user'
                    ? `1px solid ${withOpacity(c.accent.secondary, 0.25)}`
                    : `1px solid ${c.glass.borderDark}`,
                  color:        msg.role === 'user'
                    ? withOpacity(c.accent.tertiary ?? c.accent.primary, 0.9)
                    : withOpacity(c.text.onDark, 0.7),
                }}
              >
                {msg.content}
              </motion.div>
            ))}

            {/* Streaming assistant reply */}
            {streamingText && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  alignSelf:    'flex-start',
                  maxWidth:     '80%',
                  padding:      '6px 12px',
                  borderRadius: 12,
                  fontSize:     13,
                  lineHeight:   1.5,
                  background:   c.glass.dark,
                  border:       `1px solid ${c.glass.borderDark}`,
                  color:        c.glass.light,
                }}
              >
                {streamingText}
                <span
                  style={{
                    display:          'inline-block',
                    width:            2,
                    height:           '1em',
                    background:       withOpacity(c.accent.secondary, 0.7),
                    marginLeft:       3,
                    verticalAlign:    'text-bottom',
                    animation:        'speak-cursor-blink 0.7s steps(1) infinite',
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Orb: centered in full viewport (true center of screen) ──
          Positioned relative to entire fixed area, not just space above bottom UI */}
      <div
        style={{
          position:       'absolute',
          inset:          0,
          pointerEvents:  'none',
          zIndex:         3,
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={handleOrbTap}
          onKeyDown={(e) => e.key === 'Enter' && handleOrbTap()}
          style={{
            position:       'absolute',
            left:           '50%',
            top:            '50%',
            transform:      'translate(-50%, -50%)',
            width:          orbSize,
            height:         orbSize,
            pointerEvents:  'auto',
            cursor:         orbState === 'speaking' ? 'pointer' : 'default',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', height: '100%' }}
          >
            <VoiceOrb
              orbState={isLowCredits && !inSession ? 'low_credits' : orbState}
              frequencyDataRef={masterFreqRef as React.RefObject<Uint8Array | null>}
            />
          </motion.div>
        </div>
      </div>

      {/* ── Interim transcript (partial user speech) ── */}
      <AnimatePresence mode="wait">
        {interimText && (
          <motion.p
            key="interim"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              position:   'absolute',
              bottom:     `calc(${SPEAK_BOTTOM_UI_HEIGHT} - 4px)`,
              left:       '50%',
              transform:  'translateX(-50%)',
              whiteSpace: 'nowrap',
              overflow:   'hidden',
              textOverflow: 'ellipsis',
              maxWidth:   'min(500px, 85vw)',
              fontSize:   13,
              fontStyle:  'italic',
              color:      withOpacity(c.accent.secondary, 0.7),
              zIndex:     4,
            }}
          >
            {interimText}
            <span style={{ animation: 'speak-cursor-blink 0.7s steps(1) infinite', marginLeft: 2 }}>|</span>
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Bottom UI panel ── */}
      <div
        style={{
          flex:         0,
          flexShrink:   0,
          height:       SPEAK_BOTTOM_UI_HEIGHT,
          display:      'flex',
          flexDirection: 'column',
          alignItems:   'center',
          justifyContent: 'flex-end',
          paddingBottom: 28,
          gap:          12,
          zIndex:       5,
        }}
      >
        <AnimatePresence mode="wait">
          {/* ── Not in session: session start UI ── */}
          {!inSession && (
            <motion.div
              key="start-ui"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4 }}
              style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:           14,
                width:         '100%',
              }}
            >
              {/* Status label */}
              <p
                style={{
                  fontSize:      11,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color:         c.text.tertiary,
                  margin:        0,
                }}
              >
                SPEAK TO THE ORB
              </p>
              <p
                style={{
                  fontSize:   12,
                  color:      withOpacity(c.text.onDark, 0.5),
                  margin:     '4px 0 0',
                  maxWidth:   320,
                  lineHeight: 1.4,
                  textAlign:  'center',
                }}
              >
                {ORB_INTRO_SHORT}
              </p>

              {/* Session error */}
              {sessionError && (
                <p style={{ fontSize: 13, color: withOpacity(c.error, 0.85), margin: 0, textAlign: 'center', maxWidth: 320 }}>
                  {sessionError}
                </p>
              )}

              {/* No support warning */}
              {!hasSupport && (
                <p style={{ fontSize: 12, color: withOpacity(c.error, 0.7), margin: 0 }}>
                  Speech recognition not supported in this browser.
                </p>
              )}

              {/* Insufficient credits */}
              {isLowCredits ? (
                <Link
                  href="/sanctuary/credits/buy"
                  style={{
                    display:       'flex',
                    alignItems:    'center',
                    gap:           8,
                    padding:       '11px 28px',
                    borderRadius:  32,
                    background:    withOpacity(c.accent.primary, 0.18),
                    border:        `1px solid ${withOpacity(c.accent.secondary, 0.3)}`,
                    color:         withOpacity(c.accent.tertiary ?? c.accent.primary, 0.9),
                    fontSize:      14,
                    fontWeight:    500,
                    textDecoration: 'none',
                    letterSpacing: '0.02em',
                  }}
                >
                  Get Qs
                </Link>
              ) : (
                <>
                  {/* Q selector */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {Q_OPTIONS.map((opt) => (
                      <button
                        key={opt.qs}
                        onClick={() => setSelectedQs(opt.qs)}
                        style={{
                          padding:      '6px 14px',
                          borderRadius: 20,
                          border:       `1px solid ${selectedQs === opt.qs ? withOpacity(c.accent.secondary, 0.5) : withOpacity(c.text.onDark, 0.1)}`,
                          background:   selectedQs === opt.qs ? withOpacity(c.accent.primary, 0.2) : 'transparent',
                          color:        selectedQs === opt.qs ? withOpacity(c.accent.tertiary ?? c.accent.primary, 0.9) : withOpacity(c.text.onDark, 0.4),
                          fontSize:     13,
                          cursor:       'pointer',
                          transition:   'all 0.15s',
                        }}
                      >
                        {opt.qs}Q · {opt.replies} replies
                      </button>
                    ))}
                  </div>

                  {/* Begin button */}
                  <button
                    onClick={() => void doStartSession(selectedQs)}
                    disabled={sessionLoading || !hasSupport}
                    data-testid="speak-begin-button"
                    style={{
                      padding:      '12px 40px',
                      borderRadius: 32,
                      background:   sessionLoading ? withOpacity(c.accent.primary, 0.1) : withOpacity(c.accent.primary, 0.22),
                      border:       `1px solid ${withOpacity(c.accent.secondary, 0.35)}`,
                      color:        sessionLoading ? withOpacity(c.accent.tertiary ?? c.accent.primary, 0.45) : withOpacity(c.accent.tertiary ?? c.accent.primary, 0.92),
                      fontSize:     15,
                      fontWeight:   500,
                      cursor:       sessionLoading ? 'wait' : 'pointer',
                      letterSpacing: '0.03em',
                      transition:   'all 0.2s',
                    }}
                  >
                    {sessionLoading ? 'Opening…' : 'Begin'}
                  </button>

                  {/* Credit balance */}
                  <p style={{ fontSize: 12, color: withOpacity(c.text.onDark, 0.25), margin: 0 }}>
                    {creditBalance ?? '—'} Q available
                  </p>
                </>
              )}
            </motion.div>
          )}

          {/* ── In session: active session UI ── */}
          {inSession && (
            <motion.div
              key="session-ui"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4 }}
              style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    'center',
                gap:           12,
              }}
            >
              {/* Oracle error (e.g. session expired, server error) */}
              {oracleError && (
                <p style={{ fontSize: 12, color: withOpacity(c.error, 0.85), margin: 0, textAlign: 'center', maxWidth: 320 }}>
                  {oracleError}
                </p>
              )}
              {/* Low credits mid-session — upsell so user isn't stranded */}
              {isLowCredits && (
                <Link
                  href="/sanctuary/credits/buy"
                  style={{
                    display:        'flex',
                    alignItems:     'center',
                    gap:            8,
                    padding:        '9px 22px',
                    borderRadius:   32,
                    background:    withOpacity(c.accent.primary, 0.18),
                    border:        `1px solid ${withOpacity(c.accent.secondary, 0.3)}`,
                    color:         withOpacity(c.accent.tertiary ?? c.accent.primary, 0.9),
                    fontSize:       13,
                    fontWeight:     500,
                    textDecoration: 'none',
                    letterSpacing:  '0.02em',
                  }}
                >
                  Get Qs →
                </Link>
              )}
              {/* Reply dots */}
              <div style={{ display: 'flex', gap: 5 }}>
                {Array.from({ length: Math.min(session!.repliesTotal, 15) }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width:        6,
                      height:       6,
                      borderRadius: '50%',
                      background:   i < repliesLeft
                        ? withOpacity(c.accent.secondary, 0.7)
                        : withOpacity(c.text.onDark, 0.12),
                      transition: 'background 0.3s',
                    }}
                  />
                ))}
              </div>

              {/* Session status + leave */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
                  {repliesLeft} {repliesLeft === 1 ? 'reply' : 'replies'} left
                </p>
                <span style={{ color: withOpacity(c.text.onDark, 0.1) }}>·</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <label
                    style={{
                      display:       'flex',
                      alignItems:    'center',
                      gap:           spacing.sm,
                      fontSize:      12,
                      color:         c.text.tertiary,
                      cursor:        'pointer',
                      letterSpacing: '0.02em',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={autoRefill}
                      onChange={(e) => setAutoRefill(e.target.checked)}
                      style={{
                        appearance:         'none',
                        WebkitAppearance:   'none',
                        width:              14,
                        height:             14,
                        minWidth:           14,
                        minHeight:          14,
                        margin:             0,
                        borderRadius:       borderRadius.xs,
                        border:             `1px solid ${withOpacity(c.text.onDark, 0.25)}`,
                        background:         autoRefill ? c.accent.primary : withOpacity(c.text.onDark, 0.06),
                        backgroundSize:      'contain',
                        backgroundPosition: 'center',
                        cursor:             'pointer',
                        flexShrink:         0,
                        transition:         'background 0.15s, border-color 0.15s',
                        backgroundImage:    autoRefill
                          ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14'%3E%3Cpath fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' d='M2 7l3.5 3.5L12 3'/%3E%3C/svg%3E")`
                          : 'none',
                      }}
                    />
                    Auto-refill
                  </label>
                </div>
                <span style={{ color: withOpacity(c.text.onDark, 0.1) }}>·</span>
                <button
                  onClick={endSession}
                  style={{
                    background:    'none',
                    border:        'none',
                    color:         c.text.tertiary,
                    fontSize:      12,
                    cursor:        'pointer',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Leave
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CSS for blinking cursor ── */}
      <style>{`
        @keyframes speak-cursor-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        /* Hide scrollbar on transcript */
        [data-transcript]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
