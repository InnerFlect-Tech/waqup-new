'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Typography, Button, PageShell } from '@/components';
import { spacing, borderRadius, useTheme, BLUR } from '@/theme';
import { Link } from '@/i18n/navigation';
import { Send, ArrowLeft } from 'lucide-react';
import { CONTENT_CREDIT_COSTS } from '@waqup/shared/constants';
import { formatQs } from '@waqup/shared/utils';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { ScienceInsight } from '@/components/content/ScienceInsight';
import { getContentTypeIcon } from '@/lib';
import { CONTENT_TYPE_META, CONVERSATION_STEP_PROMPTS, saveCreationHandoff } from '@/lib/creation-steps';
import type { ContentItemType } from '@waqup/shared/types';
import type { ConversationStep } from '@waqup/shared/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  step?: ConversationStep;
}

const OPENING_MESSAGES: Record<ContentItemType, string> = {
  affirmation: "Let's build your affirmation. What area of your life would you like to strengthen — confidence, abundance, relationships, health, or something else?",
  meditation: "Let's create your meditation. What state are you looking to access — deep sleep, calm focus, stress relief, or something different?",
  ritual: "Let's design your daily ritual. What transformation are you working toward right now?",
};

const DEFAULT_OPENING = "What would you like to create today — an affirmation, a meditation, or a ritual?";

type ConversationPhase = 'type-select' | 'gathering' | 'generating-script' | 'reviewing-script' | 'done';

function StepBadge({ type, step }: { type: ContentItemType; step: ConversationStep }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const meta = CONTENT_TYPE_META[type];
  const steps = CONVERSATION_STEP_PROMPTS[type];
  const stepIndex = steps.findIndex((s) => s.step === step);
  const stepTotal = steps.length;

  const stepLabels: Partial<Record<ConversationStep, string>> = {
    intent: 'Intent',
    context: 'Context',
    personalization: 'Values',
    script: 'Script',
    voice: 'Voice',
    audio: 'Audio',
    review: 'Review',
  };

  if (stepIndex === -1) return null;

  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.sm,
        padding: `${spacing.xs} ${spacing.md}`,
        borderRadius: borderRadius.full,
        background: `${meta.color}15`,
        border: `1px solid ${meta.color}40`,
        marginBottom: spacing.md,
      }}
    >
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: meta.color,
        }}
      />
      <Typography variant="small" style={{ color: meta.color, fontSize: 12, fontWeight: 600, letterSpacing: '0.03em' }}>
        Step {stepIndex + 1} of {stepTotal} · {stepLabels[step] ?? step}
      </Typography>
      <div style={{ display: 'flex', gap: 3 }}>
        {steps.map((s, i) => (
          <div
            key={s.step}
            style={{
              width: 16,
              height: 3,
              borderRadius: 2,
              background: i <= stepIndex ? meta.color : colors.glass.border,
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ConversationPageInner() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const typeParam = searchParams.get('type') as ContentItemType | null;

  const [selectedType, setSelectedType] = useState<ContentItemType | null>(typeParam);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: typeParam ? OPENING_MESSAGES[typeParam] : DEFAULT_OPENING,
      step: typeParam ? 'intent' : undefined,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<ConversationPhase>(typeParam ? 'gathering' : 'type-select');
  const [generatedScript, setGeneratedScript] = useState('');
  const [currentStep, setCurrentStep] = useState<ConversationStep>(typeParam ? 'intent' : 'init');

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<Message[]>(messages);
  const stepIndexRef = useRef(0);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const appendMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const advanceStep = useCallback((type: ContentItemType) => {
    const steps = CONVERSATION_STEP_PROMPTS[type];
    const nextIdx = stepIndexRef.current + 1;
    if (nextIdx < steps.length) {
      stepIndexRef.current = nextIdx;
      setCurrentStep(steps[nextIdx].step);
    }
  }, []);

  const handleTypeSelect = useCallback((type: ContentItemType) => {
    setSelectedType(type);
    setPhase('gathering');
    setCurrentStep('intent');
    stepIndexRef.current = 0;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: `I want to create a ${type}` };
    appendMessage(userMsg);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: OPENING_MESSAGES[type],
        step: 'intent',
      });
    }, 700);
  }, []);

  const callConversationAPI = useCallback(async (allMessages: Message[], type: ContentItemType) => {
    const res = await fetch('/api/conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
        locale,
      }),
    });
    if (!res.ok) throw new Error('API call failed');
    return res.json() as Promise<{ reply: string; shouldGenerateScript: boolean }>;
  }, []);

  const generateScript = useCallback(async (allMessages: Message[], type: ContentItemType) => {
    setPhase('generating-script');
    setCurrentStep('script');
    appendMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '✦ Generating your script — this takes just a moment…',
      step: 'script',
    });

    const intent = allMessages
      .filter((m) => m.role === 'user')
      .map((m) => m.content)
      .join('. ');

    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, intent, locale }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const { script } = await res.json() as { script: string };
      setGeneratedScript(script);
      setPhase('reviewing-script');
    } catch {
      appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Something went wrong generating your script. Please try sending a message to continue.',
      });
      setPhase('gathering');
    }
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    const updatedMessages = [...messagesRef.current, userMsg];

    appendMessage(userMsg);
    setInput('');

    if (phase === 'type-select') {
      const lower = trimmed.toLowerCase();
      const detected: ContentItemType | null =
        lower.includes('affirmation') ? 'affirmation'
        : lower.includes('meditation') ? 'meditation'
        : lower.includes('ritual') ? 'ritual'
        : null;

      if (detected) {
        handleTypeSelect(detected);
      } else {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          appendMessage({
            id: crypto.randomUUID(),
            role: 'assistant',
            content: "What would you like to create — an affirmation, a meditation, or a ritual?",
          });
        }, 600);
      }
      return;
    }

    if (!selectedType) return;
    setIsTyping(true);

    try {
      const { reply, shouldGenerateScript } = await callConversationAPI(updatedMessages, selectedType);
      setIsTyping(false);

      if (shouldGenerateScript) {
        appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: reply });
        await generateScript(updatedMessages, selectedType);
      } else {
        advanceStep(selectedType);
        const steps = CONVERSATION_STEP_PROMPTS[selectedType];
        const nextStep = steps[stepIndexRef.current]?.step;
        appendMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: reply,
          step: nextStep,
        });
      }
    } catch {
      setIsTyping(false);
      appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again.",
      });
    }
  }, [input, isTyping, phase, selectedType, callConversationAPI, generateScript, handleTypeSelect, advanceStep]);

  const handleUseScript = () => {
    if (selectedType && generatedScript) {
      const intent = messagesRef.current
        .filter((m) => m.role === 'user')
        .map((m) => m.content)
        .join('. ');
      saveCreationHandoff(selectedType, generatedScript, intent);
    }
    router.push(selectedType ? `/sanctuary/${selectedType}s/create/voice` : '/sanctuary');
  };

  const selectedMeta = selectedType ? CONTENT_TYPE_META[selectedType] : null;

  return (
    <PageShell intensity="medium">
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: spacing.lg,
          paddingBottom: `max(${spacing.xl}, env(safe-area-inset-bottom, 0px))`,
          paddingLeft: spacing.md,
          paddingRight: spacing.md,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: spacing.md }}>
          <Link
            href={selectedType ? `/sanctuary/${selectedType}s/create/init` : '/create'}
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}
          >
            <ArrowLeft size={16} color={colors.text.secondary} />
            <Typography variant="small" style={{ color: colors.text.secondary }}>
              Back
            </Typography>
          </Link>
          <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.xs, fontWeight: 300 }}>
            Let&apos;s create together
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 14 }}>
            No forms — just conversation
          </Typography>
        </div>

        {/* Step badge */}
        <AnimatePresence mode="wait">
          {selectedType && phase === 'gathering' && (
            <StepBadge key={currentStep} type={selectedType} step={currentStep} />
          )}
          {selectedType && phase === 'reviewing-script' && (
            <motion.div
              key="script-ready"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.sm,
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: borderRadius.full,
                background: `${selectedMeta?.color ?? colors.accent.primary}15`,
                border: `1px solid ${selectedMeta?.color ?? colors.accent.primary}40`,
                marginBottom: spacing.md,
              }}
            >
              <div
                style={{ width: 7, height: 7, borderRadius: '50%', background: selectedMeta?.color ?? colors.accent.primary }}
              />
              <Typography variant="small" style={{ color: selectedMeta?.color ?? colors.accent.primary, fontSize: 12, fontWeight: 600 }}>
                Script ready — choose your voice
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Type selector */}
        {phase === 'type-select' && (
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.lg }}>
            {(Object.entries(CONTENT_TYPE_META) as [ContentItemType, typeof CONTENT_TYPE_META[ContentItemType]][]).map(([type, meta]) => {
              const Icon = getContentTypeIcon(type);
              const costs = CONTENT_CREDIT_COSTS[type];
              const creditsLabel =
                costs.base === costs.withAi ? formatQs(costs.base) : `${costs.base}–${costs.withAi} Qs`;
              return (
                <button
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  style={{
                    padding: `${spacing.xs} ${spacing.md}`,
                    borderRadius: borderRadius.full,
                    border: `1px solid ${colors.glass.border}`,
                    background: 'transparent',
                    color: colors.text.secondary,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.sm,
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={14} color={meta.color} />
                  <span>{meta.label}</span>
                  <span style={{ fontSize: 11, opacity: 0.7 }}>({creditsLabel})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
            paddingBottom: spacing.md,
            scrollbarWidth: 'none',
          }}
        >
          {messages.map((msg) => {
            const stepMeta = msg.step && selectedType ? CONTENT_TYPE_META[selectedType] : null;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                {/* Step label on first message of a new step */}
                {msg.role === 'assistant' && msg.step && msg.step !== 'init' && stepMeta && (
                  <div style={{ marginBottom: spacing.xs }}>
                    <Typography variant="small" style={{ color: stepMeta.color, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {msg.step === 'intent' ? 'Intent'
                        : msg.step === 'context' ? 'Context'
                        : msg.step === 'personalization' ? 'Values'
                        : msg.step === 'script' ? 'Script'
                        : msg.step}
                    </Typography>
                  </div>
                )}
                <div
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    padding: `${spacing.md} ${spacing.lg}`,
                    borderRadius:
                      msg.role === 'user'
                        ? `${borderRadius.xl} ${borderRadius.xl} ${spacing.xs} ${borderRadius.xl}`
                        : `${borderRadius.xl} ${borderRadius.xl} ${borderRadius.xl} ${spacing.xs}`,
                    background: msg.role === 'user' ? colors.gradients.primary : colors.glass.light,
                    color: msg.role === 'user' ? colors.text.onDark : colors.text.primary,
                    border: msg.role === 'assistant'
                      ? `1px solid ${stepMeta ? stepMeta.color + '30' : colors.glass.border}`
                      : 'none',
                    backdropFilter: BLUR.lg,
                    WebkitBackdropFilter: BLUR.lg,
                    lineHeight: 1.6,
                    fontSize: 15,
                  }}
                >
                  {msg.content}
                </div>
              </motion.div>
            );
          })}

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                style={{
                  alignSelf: 'flex-start',
                  padding: `${spacing.md} ${spacing.lg}`,
                  borderRadius: `${borderRadius.xl} ${borderRadius.xl} ${borderRadius.xl} ${spacing.xs}`,
                  background: colors.glass.light,
                  border: `1px solid ${colors.glass.border}`,
                  display: 'flex',
                  gap: spacing.sm,
                  alignItems: 'center',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: selectedMeta?.color ?? colors.accent.primary,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Script review panel */}
          <AnimatePresence>
            {phase === 'reviewing-script' && generatedScript && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  alignSelf: 'flex-start',
                  width: '100%',
                  maxWidth: '100%',
                }}
              >
                <div
                  style={{
                    padding: spacing.xl,
                    borderRadius: borderRadius.xl,
                    background: colors.glass.light,
                    border: `1px solid ${selectedMeta ? selectedMeta.color + '40' : colors.accent.primary + '40'}`,
                    backdropFilter: BLUR.lg,
                    WebkitBackdropFilter: BLUR.lg,
                  }}
                >
                  <Typography
                    variant="small"
                    style={{
                      color: selectedMeta?.color ?? colors.accent.primary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      fontSize: 11,
                      display: 'block',
                      marginBottom: spacing.md,
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
                    <Button variant="primary" size="md" onClick={handleUseScript}>
                      Choose Voice →
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      style={{ color: colors.text.secondary }}
                      onClick={() => {
                        setPhase('gathering');
                        appendMessage({
                          id: crypto.randomUUID(),
                          role: 'assistant',
                          content: 'What would you like to change? Tell me and I\'ll regenerate.',
                        });
                      }}
                    >
                      Refine it
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          style={{
            display: 'flex',
            gap: spacing.sm,
            padding: spacing.sm,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.lg,
            WebkitBackdropFilter: BLUR.lg,
            border: `1px solid ${selectedMeta ? selectedMeta.color + '30' : colors.glass.border}`,
            transition: 'border-color 0.3s',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={phase === 'reviewing-script' ? 'Tell me what to change…' : 'Type your message…'}
            disabled={phase === 'generating-script'}
            style={{
              flex: 1,
              padding: `${spacing.sm} ${spacing.md}`,
              background: 'transparent',
              border: 'none',
              fontSize: 15,
              color: colors.text.primary,
              outline: 'none',
            }}
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleSend}
            disabled={!input.trim() || isTyping || phase === 'generating-script'}
            style={{
              background: input.trim() ? colors.gradients.primary : colors.glass.medium,
              minWidth: 44,
              padding: `0 ${spacing.md}`,
              transition: 'background 0.2s',
            }}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

export default function CreateConversationPage() {
  return (
    <Suspense fallback={null}>
      <ConversationPageInner />
    </Suspense>
  );
}
