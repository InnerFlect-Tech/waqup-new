'use client';

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button } from '@/components';
import { PageShell } from '@/components';
import Link from 'next/link';
import { Sparkles, Brain, Music, Send, ArrowLeft } from 'lucide-react';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { CONTENT_CREDIT_COSTS } from '@waqup/shared/constants';
import { formatQs } from '@waqup/shared/utils';
import { useSearchParams, useRouter } from 'next/navigation';
import { ScienceInsight } from '@/components/content/ScienceInsight';
import type { ContentItemType } from '@waqup/shared/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
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

const OPENING_MESSAGES: Record<ContentItemType, string> = {
  affirmation: "Let's build your affirmation. What area of your life would you like to strengthen — confidence, abundance, relationships, health, or something else?",
  meditation: "Let's create your meditation. What state are you looking to access — deep sleep, calm focus, stress relief, or something different?",
  ritual: "Let's design your daily ritual. What transformation are you working toward right now?",
};

const DEFAULT_OPENING = "What would you like to create today — an affirmation, a meditation, or a ritual?";

type ConversationPhase = 'type-select' | 'gathering' | 'generating-script' | 'reviewing-script' | 'done';

function ConversationPageInner() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParam = searchParams.get('type') as ContentItemType | null;

  const [selectedType, setSelectedType] = useState<ContentItemType | null>(typeParam);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: typeParam ? OPENING_MESSAGES[typeParam] : DEFAULT_OPENING,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState<ConversationPhase>(typeParam ? 'gathering' : 'type-select');
  const [generatedScript, setGeneratedScript] = useState('');

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<Message[]>(messages);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const appendMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleTypeSelect = useCallback((type: ContentItemType) => {
    setSelectedType(type);
    setPhase('gathering');
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: `I want to create a ${type}` };
    appendMessage(userMsg);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: OPENING_MESSAGES[type] });
    }, 700);
  }, []);

  const callConversationAPI = useCallback(async (allMessages: Message[], type: ContentItemType) => {
    const res = await fetch('/api/conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
    if (!res.ok) throw new Error('API call failed');
    return res.json() as Promise<{ reply: string; shouldGenerateScript: boolean }>;
  }, []);

  const generateScript = useCallback(async (allMessages: Message[], type: ContentItemType) => {
    setPhase('generating-script');
    appendMessage({
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '✦ Generating your script — this takes just a moment…',
    });

    const intent = allMessages
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
      appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: reply });

      if (shouldGenerateScript) {
        await generateScript(updatedMessages, selectedType);
      }
    } catch {
      setIsTyping(false);
      appendMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again.",
      });
    }
  }, [input, isTyping, phase, selectedType, callConversationAPI, generateScript, handleTypeSelect]);

  const handleUseScript = () => {
    router.push(
      selectedType
        ? `/sanctuary/${selectedType}s/create/voice`
        : '/sanctuary',
    );
  };

  return (
    <PageShell intensity="medium">
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 80,
          paddingBottom: spacing.xl,
          paddingLeft: spacing.md,
          paddingRight: spacing.md,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: spacing.lg }}>
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

        {/* Type selector */}
        {phase === 'type-select' && (
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.lg }}>
            {TYPE_BUTTONS.map(({ type, label, icon: Icon, color }) => {
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
                  <Icon size={14} color={color} />
                  <span>{label}</span>
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
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
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
                border: msg.role === 'assistant' ? `1px solid ${colors.glass.border}` : 'none',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                lineHeight: 1.6,
                fontSize: 15,
              }}
            >
              {msg.content}
            </motion.div>
          ))}

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
                    style={{ width: 7, height: 7, borderRadius: '50%', background: colors.accent.primary }}
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
                    border: `1px solid ${colors.accent.primary}40`,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                >
                  <Typography variant="small" style={{ color: colors.accent.primary, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11, display: 'block', marginBottom: spacing.md }}>
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
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${colors.glass.border}`,
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
