'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button } from '@/components';
import { PageShell } from '@/components';
import Link from 'next/link';
import { Sparkles, Brain, Music, Send, ArrowLeft } from 'lucide-react';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { CONTENT_CREDIT_COSTS } from '@waqup/shared/constants';
import { formatQs } from '@waqup/shared/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  default: "I'd love to help you create something meaningful. What would you like to make today — an affirmation, a meditation, or a ritual?",
  affirmation: "Affirmations are powerful for cognitive re-patterning. What area of your life would you like to focus on — confidence, abundance, relationships, or something else?",
  meditation: "Meditations are perfect for shifting your state. What are you looking for — better sleep, calm focus, stress relief, or something else?",
  ritual: "Rituals combine voice, intention, and structure for the deepest transformation. What moment or transition in your life would you like to ritualize?",
};

const TYPE_BUTTONS = [
  { type: 'affirmation' as const, label: 'Affirmation', icon: Sparkles, color: '#c084fc' },
  { type: 'meditation' as const, label: 'Meditation', icon: Brain, color: '#60a5fa' },
  { type: 'ritual' as const, label: 'Ritual', icon: Music, color: '#34d399' },
];

export default function CreateConversationPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: MOCK_RESPONSES.default },
  ]);
  const [input, setInput] = useState('');
  const [selectedType, setSelectedType] = useState<'affirmation' | 'meditation' | 'ritual' | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const type =
      selectedType ??
      (trimmed.toLowerCase().includes('affirmation')
        ? 'affirmation'
        : trimmed.toLowerCase().includes('meditation')
        ? 'meditation'
        : trimmed.toLowerCase().includes('ritual')
        ? 'ritual'
        : 'default');
    const replyContent = MOCK_RESPONSES[type] ?? MOCK_RESPONSES.default;

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: replyContent },
      ]);
    }, 900);
  };

  const handleTypeSelect = (type: 'affirmation' | 'meditation' | 'ritual') => {
    setSelectedType(type);
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    const msg: Message = { id: crypto.randomUUID(), role: 'user', content: `I want to create a ${label}` };
    setMessages((prev) => [...prev, msg]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: MOCK_RESPONSES[type] },
      ]);
    }, 800);
    inputRef.current?.focus();
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
          <Link href="/create" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
            <ArrowLeft size={16} color={colors.text.secondary} />
            <Typography variant="small" style={{ color: colors.text.secondary }}>
              Back to Create
            </Typography>
          </Link>
          <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.xs, fontWeight: 300 }}>
            Let&apos;s create together
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 14 }}>
            Tell us what you need — no forms, just conversation
          </Typography>
        </div>

        {/* Type selector */}
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.lg }}>
          {TYPE_BUTTONS.map(({ type, label, icon: Icon, color }) => {
            const costs = CONTENT_CREDIT_COSTS[type];
            const creditsLabel =
              costs.base === costs.withAi
                ? formatQs(costs.base)
                : `${costs.base}–${costs.withAi} Qs`;
            return (
              <button
                key={type}
                onClick={() => handleTypeSelect(type)}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  borderRadius: borderRadius.full,
                  border: `1px solid ${selectedType === type ? color : colors.glass.border}`,
                  background: selectedType === type ? `${color}20` : 'transparent',
                  color: selectedType === type ? color : colors.text.secondary,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={14} />
                <span>{label}</span>
                <span style={{ fontSize: 11, opacity: 0.8 }}>({creditsLabel})</span>
              </button>
            );
          })}
        </div>

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
                borderRadius: msg.role === 'user' ? `${borderRadius.xl} ${borderRadius.xl} ${spacing.xs} ${borderRadius.xl}` : `${borderRadius.xl} ${borderRadius.xl} ${borderRadius.xl} ${spacing.xs}`,
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
            placeholder="Type your message..."
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
            disabled={!input.trim() || isTyping}
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
