'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button, PageShell } from '@/components';
import { ScienceInsight } from '@/components/content/ScienceInsight';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { Mic, Square, MessageSquare, ArrowLeft } from 'lucide-react';
import { VoiceOrb } from '@/components/audio/VoiceOrb';
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import {
  CONTENT_TYPE_META,
  CONTENT_TYPE_ICONS,
  CONVERSATION_STEP_PROMPTS,
  ALL_PIPELINE_STEPS,
  saveCreationHandoff,
} from '@/lib/creation-steps';
import type { CreationStep } from '@/lib/contexts/ContentCreationContext';
import { CONTENT_CREDIT_COSTS } from '@waqup/shared/constants';
import { formatQs } from '@waqup/shared/utils';
import type { ContentItemType } from '@waqup/shared/types';

interface TranscriptLine {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

const STEP_LABELS: Partial<Record<CreationStep, string>> = {
  intent: 'Intent',
  context: 'Context',
  personalization: 'Values',
  script: 'Script',
};

function OrbPageInner() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParam = searchParams.get('type') as ContentItemType | null;

  const [selectedType, setSelectedType] = useState<ContentItemType | null>(typeParam);
  const [orbState, setOrbState] = useState<'user' | 'ai' | 'idle'>('idle');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [currentPartial, setCurrentPartial] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [phase, setPhase] = useState<'type-select' | 'gathering' | 'generating-script' | 'reviewing-script'>(
    typeParam ? 'gathering' : 'type-select',
  );
  const [currentStep, setCurrentStep] = useState<CreationStep>(typeParam ? 'intent' : 'init');
  const [showStepPrompt, setShowStepPrompt] = useState(true);
  const [generatedScript, setGeneratedScript] = useState('');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const conversationRef = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const stepIndexRef = useRef(0);

  // Web Audio for TTS playback + orb reactivity
  const audioCtxRef        = useRef<AudioContext | null>(null);
  const ttsAnalyserRef     = useRef<AnalyserNode | null>(null);
  const ttsFreqDataRef     = useRef<Uint8Array<ArrayBufferLike> | null>(null);
  const ttsRafRef          = useRef<number>(0);
  const ttsCurrentSrcRef   = useRef<AudioBufferSourceNode | null>(null);
  const startListeningRef  = useRef<(() => void) | null>(null);

  // Merged frequency ref: switches between mic and TTS data
  const masterFreqRef = useRef<Uint8Array<ArrayBufferLike> | null>(null);

  // Real microphone frequency data
  const { frequencyDataRef: micFreqRef } = useAudioAnalyzer({ isListening });

  const selectedMeta = selectedType ? CONTENT_TYPE_META[selectedType] : null;
  const orbColor = selectedMeta?.color ?? colors.accent.primary;

  // ── Sync mic data → masterFreqRef when listening ──────────────────────────
  useEffect(() => {
    if (isListening) {
      masterFreqRef.current = micFreqRef.current;
    }
  });

  // ── Web Audio TTS: plays audio through AnalyserNode → orb reactivity ──────
  const initTtsAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const ctx      = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize               = 2048;
    analyser.smoothingTimeConstant = 0.4;
    analyser.connect(ctx.destination);
    audioCtxRef.current    = ctx;
    ttsAnalyserRef.current = analyser;
    ttsFreqDataRef.current = new Uint8Array(analyser.frequencyBinCount);
  }, []);

  const onTtsEnded = useCallback(() => {
    cancelAnimationFrame(ttsRafRef.current);
    masterFreqRef.current    = null;
    ttsCurrentSrcRef.current = null;
    setOrbState('idle');
    // Auto-start listening after AI speaks (uses stable ref to avoid circular dep)
    setTimeout(() => startListeningRef.current?.(), 200);
  }, []);

  // ── TTS: reads admin config from localStorage ──────────────────────────────
  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined') return;

    let cfg: Record<string, unknown> = {};
    try {
      cfg = JSON.parse(localStorage.getItem('elevenlabs-config') ?? '{}') as Record<string, unknown>;
    } catch { /* ignore */ }

    const useElevenLabs = cfg.contentEngine === 'elevenlabs' && typeof cfg.contentVoiceId === 'string' && cfg.contentVoiceId;

    if (useElevenLabs) {
      setOrbState('ai');
      initTtsAudio();

      fetch('/api/oracle/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: cfg.contentVoiceId,
          model: cfg.contentModel ?? 'eleven_flash_v2_5',
          voiceSettings: {
            stability:         cfg.contentStability       ?? 0.5,
            similarity_boost:  cfg.contentSimilarityBoost ?? 0.75,
            style:             cfg.contentStyle           ?? 0,
            use_speaker_boost: cfg.contentSpeakerBoost    ?? true,
            speed:             cfg.contentSpeed           ?? 1,
          },
        }),
      })
        .then((res) => (res.ok ? res.arrayBuffer() : null))
        .then(async (ab) => {
          const ctx = audioCtxRef.current;
          if (!ab || !ctx || !ttsAnalyserRef.current) { onTtsEnded(); return; }

          try {
            const buffer = await ctx.decodeAudioData(ab);
            const src    = ctx.createBufferSource();
            src.buffer   = buffer;
            src.connect(ttsAnalyserRef.current);
            src.start();
            ttsCurrentSrcRef.current = src;

            // RAF loop: read TTS analyser into masterFreqRef
            const tick = () => {
              if (ttsAnalyserRef.current && ttsFreqDataRef.current) {
                ttsAnalyserRef.current.getByteFrequencyData(ttsFreqDataRef.current as Uint8Array<ArrayBuffer>);
                masterFreqRef.current = ttsFreqDataRef.current;
              }
              ttsRafRef.current = requestAnimationFrame(tick);
            };
            ttsRafRef.current = requestAnimationFrame(tick);

            src.onended = onTtsEnded;
          } catch {
            onTtsEnded();
          }
        })
        .catch(() => onTtsEnded());
    } else {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 0.9;
      utt.pitch = 1;
      utt.volume = 1;
      utt.onstart = () => setOrbState('ai');
      utt.onend   = onTtsEnded;
      utt.onerror = onTtsEnded;
      window.speechSynthesis.speak(utt);
    }
  }, [initTtsAudio, onTtsEnded]);

  const addTranscriptLine = useCallback((role: 'user' | 'ai', text: string) => {
    setTranscript((prev) => [...prev, { id: crypto.randomUUID(), role, text }]);
  }, []);

  const callConversationAPI = useCallback(
    async (type: ContentItemType, messages: Array<{ role: 'user' | 'assistant'; content: string }>) => {
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, messages }),
      });
      if (!res.ok) throw new Error('API error');
      return res.json() as Promise<{ reply: string; shouldGenerateScript: boolean }>;
    },
    [],
  );

  const generateScript = useCallback(
    async (type: ContentItemType, messages: Array<{ role: 'user' | 'assistant'; content: string }>) => {
      setPhase('generating-script');
      const intent = messages
        .filter((m) => m.role === 'user')
        .map((m) => m.content)
        .join('. ');
      try {
        const res = await fetch('/api/generate-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, intent }),
        });
        if (!res.ok) throw new Error('Generation failed');
        const { script } = (await res.json()) as { script: string };
        setGeneratedScript(script);
        setPhase('reviewing-script');
      } catch {
        const errMsg = "I couldn't generate your script right now. Say something to continue.";
        addTranscriptLine('ai', errMsg);
        speakText(errMsg);
        setPhase('gathering');
      }
    },
    [addTranscriptLine, speakText],
  );

  const advanceStep = useCallback((type: ContentItemType) => {
    const steps = CONVERSATION_STEP_PROMPTS[type];
    const nextIdx = stepIndexRef.current + 1;
    if (nextIdx < steps.length) {
      stepIndexRef.current = nextIdx;
      setCurrentStep(steps[nextIdx].step);
      setShowStepPrompt(false);
      setTimeout(() => setShowStepPrompt(true), 300);
    }
  }, []);

  const sendUserMessage = useCallback(
    async (text: string) => {
      if (!selectedType) return;

      addTranscriptLine('user', text);
      conversationRef.current.push({ role: 'user', content: text });
      setIsAiThinking(true);
      setOrbState('idle');
      setShowStepPrompt(false);

      try {
        const { reply, shouldGenerateScript } = await callConversationAPI(selectedType, conversationRef.current);
        conversationRef.current.push({ role: 'assistant', content: reply });
        setIsAiThinking(false);
        addTranscriptLine('ai', reply);

        if (shouldGenerateScript) {
          speakText(reply);
          await generateScript(selectedType, conversationRef.current);
        } else {
          speakText(reply);
          advanceStep(selectedType);
        }
      } catch {
        setIsAiThinking(false);
        const errMsg = "I couldn't connect right now. Try again.";
        addTranscriptLine('ai', errMsg);
        speakText(errMsg);
        setShowStepPrompt(true);
      }
    },
    [selectedType, callConversationAPI, addTranscriptLine, speakText, generateScript, advanceStep],
  );

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    // Stop any AI audio before listening
    if (ttsCurrentSrcRef.current) {
      try { ttsCurrentSrcRef.current.stop(); } catch { /* ignore */ }
      ttsCurrentSrcRef.current = null;
    }
    cancelAnimationFrame(ttsRafRef.current);
    masterFreqRef.current = null;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setOrbState('user');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) final += result[0].transcript;
        else interim += result[0].transcript;
      }
      setCurrentPartial(interim || final);
      if (final) {
        setCurrentPartial('');
        sendUserMessage(final.trim());
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setCurrentPartial('');
      setOrbState((prev) => (prev === 'user' ? 'idle' : prev));
    };

    recognition.onerror = () => {
      setIsListening(false);
      setOrbState('idle');
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [sendUserMessage]);

  // Keep stable ref for onTtsEnded to call without circular dep
  useEffect(() => { startListeningRef.current = startListening; }, [startListening]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setOrbState('idle');
  }, []);

  const getOrbPromptForStep = useCallback((type: ContentItemType, stepSlug: CreationStep): string => {
    const pipelineStep = ALL_PIPELINE_STEPS.find((s) => s.step === stepSlug);
    return pipelineStep?.orbPrompt ?? `Tell me more about your ${type}.`;
  }, []);

  const handleTypeSelect = useCallback(
    (type: ContentItemType) => {
      setSelectedType(type);
      setPhase('gathering');
      setCurrentStep('intent');
      stepIndexRef.current = 0;
      setShowStepPrompt(true);
      const prompt = getOrbPromptForStep(type, 'intent');
      addTranscriptLine('ai', prompt);
      speakText(prompt);
      conversationRef.current = [{ role: 'assistant', content: prompt }];
    },
    [addTranscriptLine, speakText, getOrbPromptForStep],
  );

  // Greet on mount if type was pre-selected via URL param
  useEffect(() => {
    if (typeParam && phase === 'gathering' && conversationRef.current.length === 0) {
      const prompt = getOrbPromptForStep(typeParam, 'intent');
      addTranscriptLine('ai', prompt);
      speakText(prompt);
      conversationRef.current = [{ role: 'assistant', content: prompt }];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChooseVoice = useCallback(() => {
    if (selectedType && generatedScript) {
      const intent = conversationRef.current
        .filter((m) => m.role === 'user')
        .map((m) => m.content)
        .join('. ');
      saveCreationHandoff(selectedType, generatedScript, intent);
    }
    router.push(selectedType ? `/sanctuary/${selectedType}s/create/voice` : '/sanctuary');
  }, [selectedType, generatedScript, router]);

  const currentStepPipelineData = selectedType ? ALL_PIPELINE_STEPS.find((s) => s.step === currentStep) : null;

  const isGathering = phase === 'gathering';
  const isGenerating = phase === 'generating-script';
  const isReviewing = phase === 'reviewing-script';

  return (
    <PageShell intensity="medium">
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 72,
          paddingBottom: spacing.xl,
          paddingLeft: spacing.md,
          paddingRight: spacing.md,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <Link
            href="/create"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: spacing.sm }}
          >
            <ArrowLeft size={16} color={colors.text.secondary} />
            <Typography variant="small" style={{ color: colors.text.secondary }}>Back</Typography>
          </Link>
          <div style={{ textAlign: 'center' }}>
            <Typography variant="h3" style={{ color: colors.text.primary, fontWeight: 300, marginBottom: 2 }}>
              Speak to the Orb
            </Typography>
            <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12, opacity: 0.7 }}>
              Talk — the orb listens and creates
            </Typography>
          </div>
          <Link
            href={`/create/conversation${selectedType ? `?type=${selectedType}` : ''}`}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: spacing.xs }}
          >
            <MessageSquare size={14} color={colors.text.secondary} />
            <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12 }}>Chat</Typography>
          </Link>
        </div>

        {/* Type selector — only before a type is chosen */}
        {phase === 'type-select' && (
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center', marginBottom: spacing.xl }}>
            {(Object.entries(CONTENT_TYPE_META) as [ContentItemType, typeof CONTENT_TYPE_META[ContentItemType]][]).map(([type, meta]) => {
              const Icon = CONTENT_TYPE_ICONS[type];
              const costs = CONTENT_CREDIT_COSTS[type];
              const creditsLabel = costs.base === costs.withAi ? formatQs(costs.base) : `${costs.base}–${costs.withAi} Qs`;
              return (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  style={{
                    padding: `${spacing.xs} ${spacing.md}`,
                    borderRadius: borderRadius.full,
                    border: `1px solid ${meta.color}60`,
                    background: `${meta.color}12`,
                    color: meta.color,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={13} color={meta.color} />
                  <span>{meta.label}</span>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>({creditsLabel})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Main orb area — centered ─────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.lg,
          }}
        >
          {/* Step prompt card — floats above orb */}
          <AnimatePresence>
            {isGathering && currentStepPipelineData && showStepPrompt && selectedMeta && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{
                  maxWidth: 420,
                  width: '100%',
                  padding: spacing.lg,
                  borderRadius: borderRadius.xl,
                  background: `${selectedMeta.color}0d`,
                  border: `1px solid ${selectedMeta.color}30`,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: spacing.sm,
                    marginBottom: spacing.sm,
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: selectedMeta.color }} />
                  <Typography
                    variant="small"
                    style={{
                      color: selectedMeta.color,
                      fontSize: 10,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {STEP_LABELS[currentStep] ?? currentStep}
                  </Typography>
                  {/* Progress dots */}
                  <div style={{ display: 'flex', gap: 3 }}>
                    {CONVERSATION_STEP_PROMPTS[selectedType!].map((s, i) => (
                      <div
                        key={s.step}
                        style={{
                          width: 14,
                          height: 3,
                          borderRadius: 2,
                          background: i <= stepIndexRef.current ? selectedMeta.color : colors.glass.border,
                          transition: 'background 0.3s',
                        }}
                      />
                    ))}
                  </div>
                </div>
                <Typography
                  variant="body"
                  style={{ color: colors.text.primary, fontSize: 15, lineHeight: 1.65, fontWeight: 300 }}
                >
                  {currentStepPipelineData.orbPrompt}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <VoiceOrb
              orbState={
                orbState === 'ai'   ? 'speaking'
                : orbState === 'user' ? (isListening ? 'listening' : 'idle')
                : isAiThinking || isGenerating ? 'thinking'
                : 'idle'
              }
              frequencyDataRef={masterFreqRef}
              style={{
                width:  'min(260px, 42vmin)',
                height: 'min(260px, 42vmin)',
              }}
            />

            {/* AI thinking pulse */}
            <AnimatePresence>
              {(isAiThinking || isGenerating) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{
                    position: 'absolute',
                    bottom: -spacing.md,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: 12,
                    color: orbColor,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isGenerating ? 'crafting script…' : 'thinking…'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Partial transcript pill */}
          <AnimatePresence>
            {currentPartial && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: `${spacing.sm} ${spacing.lg}`,
                  borderRadius: borderRadius.full,
                  background: colors.glass.light,
                  border: `1px solid ${orbColor}40`,
                  maxWidth: 380,
                }}
              >
                <Typography variant="small" style={{ color: colors.text.secondary, fontStyle: 'italic' }}>
                  {currentPartial}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mic button */}
          {phase !== 'type-select' && !isReviewing && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.sm }}>
              {isListening ? (
                <motion.button
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  onClick={stopListening}
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    background: '#ef444418',
                    border: '2px solid #ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Square size={22} color="#ef4444" />
                </motion.button>
              ) : (
                <button
                  onClick={startListening}
                  disabled={isAiThinking || isGenerating}
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    background: isAiThinking || isGenerating ? colors.glass.light : `${orbColor}18`,
                    border: `2px solid ${isAiThinking || isGenerating ? colors.glass.border : `${orbColor}60`}`,
                    cursor: isAiThinking || isGenerating ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    opacity: isAiThinking || isGenerating ? 0.45 : 1,
                  }}
                >
                  <Mic size={22} color={isAiThinking || isGenerating ? colors.text.secondary : orbColor} />
                </button>
              )}
              <Typography
                variant="small"
                style={{
                  color: colors.text.secondary,
                  fontSize: 11,
                  opacity: 0.65,
                }}
              >
                {isListening ? 'Tap to stop' : isAiThinking || isGenerating ? '' : 'Tap to speak'}
              </Typography>
            </div>
          )}

          {/* Transcript bubbles */}
          {transcript.length > 0 && !isReviewing && (
            <div
              style={{
                width: '100%',
                maxWidth: 480,
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.sm,
              }}
            >
              {transcript.slice(-5).map((line) => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: line.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    padding: `${spacing.sm} ${spacing.md}`,
                    borderRadius: borderRadius.lg,
                    background: line.role === 'user' ? colors.gradients.primary : colors.glass.light,
                    color: line.role === 'user' ? colors.text.onDark : colors.text.primary,
                    border: line.role === 'ai' ? `1px solid ${orbColor}25` : 'none',
                    fontSize: 14,
                    lineHeight: 1.55,
                  }}
                >
                  {line.text}
                </motion.div>
              ))}
            </div>
          )}

          {/* Script review panel — inline, no redirect */}
          <AnimatePresence>
            {isReviewing && generatedScript && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%', maxWidth: 520 }}
              >
                <div
                  style={{
                    padding: spacing.xl,
                    borderRadius: borderRadius.xl,
                    background: colors.glass.light,
                    border: `1px solid ${orbColor}40`,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <Typography
                    variant="small"
                    style={{
                      color: orbColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontSize: 10,
                      display: 'block',
                      marginBottom: spacing.md,
                      fontWeight: 600,
                    }}
                  >
                    Your script is ready
                  </Typography>
                  <Typography
                    variant="body"
                    style={{ color: colors.text.primary, lineHeight: 1.9, whiteSpace: 'pre-wrap', fontSize: 14 }}
                  >
                    {generatedScript}
                  </Typography>

                  <ScienceInsight
                    topic="voice-identity"
                    insight="This script is yours — edit it freely before recording. The more it sounds like you, the more powerfully it lands."
                  />

                  <div style={{ display: 'flex', gap: spacing.md, marginTop: spacing.lg }}>
                    <Button variant="primary" size="md" onClick={handleChooseVoice}>
                      Choose Voice →
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      style={{ color: colors.text.secondary }}
                      onClick={() => {
                        setPhase('gathering');
                        setShowStepPrompt(true);
                        const refinePrompt = "What would you like to change? I'll generate a new version.";
                        addTranscriptLine('ai', refinePrompt);
                        speakText(refinePrompt);
                      }}
                    >
                      Refine it
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Science insight — at the bottom when not reviewing */}
        {!isReviewing && (
          <ScienceInsight
            topic="neuroplasticity"
            insight="Speaking your intent aloud — not just thinking it — activates motor cortex alongside language areas, deepening the encoding before the script is even written."
            additionalTopics={['voice-identity']}
          />
        )}
      </div>
    </PageShell>
  );
}

export default function OrbPage() {
  return (
    <Suspense fallback={null}>
      <OrbPageInner />
    </Suspense>
  );
}
