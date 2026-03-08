'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button, PageShell } from '@/components';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { Mic, Square, MessageSquare, ArrowLeft, Sparkles, Brain, Music } from 'lucide-react';
import { VoiceOrb } from '@/components/audio/VoiceOrb';
import { ScienceInsight } from '@/components/content/ScienceInsight';
import { CONTENT_CREDIT_COSTS } from '@waqup/shared/constants';
import { formatQs } from '@waqup/shared/utils';
import type { ContentItemType } from '@waqup/shared/types';

interface TranscriptLine {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

const TYPE_BUTTONS: Array<{
  type: ContentItemType;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
}> = [
  { type: 'affirmation', label: 'Affirmation', icon: Sparkles, color: '#c084fc' },
  { type: 'meditation', label: 'Meditation', icon: Brain, color: '#60a5fa' },
  { type: 'ritual', label: 'Ritual', icon: Music, color: '#34d399' },
];

const OPENING_PROMPTS: Record<ContentItemType, string> = {
  affirmation: "Tell me what area of your life you want to strengthen.",
  meditation: "What state are you looking to access — sleep, calm, focus?",
  ritual: "What transformation are you working toward?",
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
  const [phase, setPhase] = useState<'type-select' | 'gathering' | 'done'>(typeParam ? 'gathering' : 'type-select');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);
  const conversationRef = useRef<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.9;
    utt.pitch = 1;
    utt.volume = 1;
    utt.onstart = () => setOrbState('ai');
    utt.onend = () => setOrbState('idle');
    window.speechSynthesis.speak(utt);
  }, []);

  const addTranscriptLine = useCallback((role: 'user' | 'ai', text: string) => {
    setTranscript((prev) => [...prev, { id: crypto.randomUUID(), role, text }]);
  }, []);

  const callConversationAPI = useCallback(async (type: ContentItemType, messages: Array<{ role: 'user' | 'assistant'; content: string }>) => {
    const res = await fetch('/api/conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, messages }),
    });
    if (!res.ok) throw new Error('API error');
    return res.json() as Promise<{ reply: string; shouldGenerateScript: boolean }>;
  }, []);

  const sendUserMessage = useCallback(async (text: string) => {
    if (!selectedType) return;

    addTranscriptLine('user', text);
    conversationRef.current.push({ role: 'user', content: text });
    setIsAiThinking(true);
    setOrbState('idle');

    try {
      const { reply, shouldGenerateScript } = await callConversationAPI(selectedType, conversationRef.current);
      conversationRef.current.push({ role: 'assistant', content: reply });
      setIsAiThinking(false);
      addTranscriptLine('ai', reply);
      speakText(reply);

      if (shouldGenerateScript) {
        setPhase('done');
        router.push(`/create/conversation?type=${selectedType}`);
      }
    } catch {
      setIsAiThinking(false);
      const errMsg = "I couldn't connect right now. Try again.";
      addTranscriptLine('ai', errMsg);
      speakText(errMsg);
    }
  }, [selectedType, callConversationAPI, addTranscriptLine, speakText, router]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SR() as any;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setOrbState('user');
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
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
      if (orbState === 'user') setOrbState('idle');
    };

    recognition.onerror = () => {
      setIsListening(false);
      setOrbState('idle');
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [sendUserMessage, orbState]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setOrbState('idle');
  }, []);

  const handleTypeSelect = useCallback((type: ContentItemType) => {
    setSelectedType(type);
    setPhase('gathering');
    const prompt = OPENING_PROMPTS[type];
    addTranscriptLine('ai', prompt);
    speakText(prompt);
    conversationRef.current.push({ role: 'assistant', content: prompt });
  }, [addTranscriptLine, speakText]);

  useEffect(() => {
    if (typeParam && phase === 'gathering') {
      const prompt = OPENING_PROMPTS[typeParam];
      addTranscriptLine('ai', prompt);
      speakText(prompt);
      conversationRef.current = [{ role: 'assistant', content: prompt }];
    }
  }, []);

  return (
    <PageShell intensity="medium">
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 80,
          paddingBottom: spacing.xl,
          paddingLeft: spacing.md,
          paddingRight: spacing.md,
          alignItems: 'center',
        }}
      >
        {/* Header */}
        <div style={{ width: '100%', marginBottom: spacing.lg }}>
          <Link
            href="/create"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}
          >
            <ArrowLeft size={16} color={colors.text.secondary} />
            <Typography variant="small" style={{ color: colors.text.secondary }}>Back</Typography>
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: 4, fontWeight: 300 }}>
                Speak to the Orb
              </Typography>
              <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 13 }}>
                Talk — the orb listens and creates
              </Typography>
            </div>
            <Link
              href={`/create/conversation${selectedType ? `?type=${selectedType}` : ''}`}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: spacing.xs }}
            >
              <MessageSquare size={14} color={colors.text.secondary} />
              <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12 }}>Switch to Chat</Typography>
            </Link>
          </div>
        </div>

        {/* Type selector */}
        {phase === 'type-select' && (
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.xl, width: '100%' }}>
            {TYPE_BUTTONS.map(({ type, label, icon: Icon, color }) => {
              const costs = CONTENT_CREDIT_COSTS[type];
              const creditsLabel = costs.base === costs.withAi ? formatQs(costs.base) : `${costs.base}–${costs.withAi} Qs`;
              return (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  style={{
                    padding: `${spacing.xs} ${spacing.md}`,
                    borderRadius: borderRadius.full,
                    border: `1px solid ${selectedType === type ? color + '60' : colors.glass.border}`,
                    background: selectedType === type ? `${color}18` : 'transparent',
                    color: selectedType === type ? color : colors.text.secondary,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={13} color={color} />
                  <span>{label}</span>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>({creditsLabel})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ marginBottom: spacing.xl, position: 'relative' }}
        >
          <VoiceOrb
            isActive={isListening || orbState === 'ai'}
            voiceSource={orbState}
            frequencyDataRef={frequencyDataRef}
            style={{ width: 220, height: 220 }}
          />

          {/* AI thinking pulse */}
          {isAiThinking && (
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{
                position: 'absolute',
                bottom: -spacing.md,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 12,
                color: colors.accent.primary,
                whiteSpace: 'nowrap',
              }}
            >
              thinking…
            </motion.div>
          )}
        </motion.div>

        {/* Partial transcript */}
        <AnimatePresence>
          {currentPartial && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginBottom: spacing.md,
                padding: `${spacing.sm} ${spacing.lg}`,
                borderRadius: borderRadius.full,
                background: colors.glass.light,
                border: `1px solid ${colors.glass.border}`,
              }}
            >
              <Typography variant="small" style={{ color: colors.text.secondary, fontStyle: 'italic' }}>
                {currentPartial}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mic button */}
        {phase !== 'type-select' && (
          <div style={{ marginBottom: spacing.xl }}>
            {isListening ? (
              <motion.button
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                onClick={stopListening}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#ef444420',
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
                disabled={isAiThinking}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: isAiThinking ? colors.glass.light : `${colors.accent.primary}18`,
                  border: `2px solid ${isAiThinking ? colors.glass.border : colors.accent.primary + '60'}`,
                  cursor: isAiThinking ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  opacity: isAiThinking ? 0.5 : 1,
                }}
              >
                <Mic size={22} color={isAiThinking ? colors.text.secondary : colors.accent.primary} />
              </button>
            )}
            <Typography
              variant="small"
              style={{ color: colors.text.secondary, fontSize: 11, textAlign: 'center', display: 'block', marginTop: spacing.sm, opacity: 0.7 }}
            >
              {isListening ? 'Tap to stop' : 'Tap to speak'}
            </Typography>
          </div>
        )}

        {/* Transcript */}
        {transcript.length > 0 && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: spacing.sm, marginBottom: spacing.xl }}>
            {transcript.slice(-6).map((line) => (
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
                  border: line.role === 'ai' ? `1px solid ${colors.glass.border}` : 'none',
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {line.text}
              </motion.div>
            ))}
          </div>
        )}

        <ScienceInsight
          topic="neuroplasticity"
          insight="Speaking your intent aloud — not just thinking it — activates motor cortex alongside language areas, deepening the encoding before the script is even written."
          additionalTopics={['voice-identity']}
        />
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
