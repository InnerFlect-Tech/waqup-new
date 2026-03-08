'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Button } from '@/components';
import { PageShell } from '@/components';
import Link from 'next/link';
import { Sparkles, Brain, Music, Send, ArrowLeft, AlertCircle } from 'lucide-react';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { CONTENT_CREDIT_COSTS } from '@waqup/shared/constants';
import { formatQs } from '@waqup/shared/utils';
import { CreditConsentWidget } from '@/components/orb/CreditConsentWidget';
import type {
  OrbMessage,
  OrbAddon,
  OrbAddonKey,
  CreditAction,
  ConversationStep,
  OrbConfigResponse,
  OrbChatResponse,
} from '@waqup/shared/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType = 'affirmation' | 'meditation' | 'ritual';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ConsentMessage {
  id: string;
  type: 'consent';
  actions: CreditAction[];
  totalCostQs: number;
  pendingUserMessage: string;
}

type DisplayMessage = ChatMessage | ConsentMessage;

function isConsentMessage(m: DisplayMessage): m is ConsentMessage {
  return (m as ConsentMessage).type === 'consent';
}

const TYPE_BUTTONS = [
  { type: 'affirmation' as ContentType, label: 'Affirmation', icon: Sparkles, color: '#c084fc' },
  { type: 'meditation' as ContentType, label: 'Meditation', icon: Brain, color: '#60a5fa' },
  { type: 'ritual' as ContentType, label: 'Ritual', icon: Music, color: '#34d399' },
];

const WELCOME_MESSAGE =
  "I'm the Orb. Tell me what you'd like to create — an affirmation, a meditation, or a ritual — and I'll guide you through it.";

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateConversationPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [messages, setMessages] = useState<DisplayMessage[]>([
    { id: '1', role: 'assistant', content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('init');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Orb config (add-ons + balance)
  const [orbConfig, setOrbConfig] = useState<OrbAddon[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Conversation history sent to the API (no consent messages)
  const orbHistoryRef = useRef<OrbMessage[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Scroll to bottom on new messages ──────────────────────────────────────

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ─── Load orb config on mount ───────────────────────────────────────────────

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/orb/config');
        if (!res.ok) throw new Error('Failed to load config');
        const data = (await res.json()) as OrbConfigResponse;
        setOrbConfig(data.addons ?? []);
        setBalance(data.balance ?? 0);
      } catch {
        // Use defaults — allow conversation to proceed
        setOrbConfig([
          { addonKey: 'base_llm', enabled: true, userConfigurable: false, label: 'Orb responds', description: '', costQs: 1 },
          { addonKey: 'user_context', enabled: true, userConfigurable: true, label: 'Access your personal journey', description: '', costQs: 1 },
          { addonKey: 'collective_wisdom', enabled: true, userConfigurable: true, label: 'Draw from the collective', description: '', costQs: 1 },
        ]);
        setBalance(0);
      } finally {
        setConfigLoaded(true);
      }
    }
    loadConfig();
  }, []);

  // ─── Build consent actions from active add-ons ──────────────────────────────

  const buildConsentActions = useCallback((): CreditAction[] => {
    return orbConfig
      .filter((addon) => addon.enabled)
      .map((addon) => ({
        addonKey: addon.addonKey,
        label: addon.label,
        costQs: addon.costQs,
      }));
  }, [orbConfig]);

  // ─── Send a message through the real API ────────────────────────────────────

  const callOrbChat = useCallback(
    async (userText: string, activeAddons: OrbAddonKey[]) => {
      setIsLoading(true);
      setIsTyping(true);
      setError(null);

      // Add user message to history ref
      const userMsg: OrbMessage = { role: 'user', content: userText };
      orbHistoryRef.current = [...orbHistoryRef.current, userMsg];

      try {
        const res = await fetch('/api/orb/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: orbHistoryRef.current,
            contentType: selectedType,
            step: currentStep,
            activeAddons,
          }),
        });

        const data = (await res.json()) as OrbChatResponse & { error?: string; message?: string };

        if (!res.ok) {
          if (res.status === 402) {
            setError(data.message ?? 'Not enough Qs. Visit the credits page to get more.');
          } else {
            setError(data.error ?? 'Something went wrong. Please try again.');
          }
          // Remove the user message we optimistically added to history
          orbHistoryRef.current = orbHistoryRef.current.slice(0, -1);
          return;
        }

        // Add assistant reply to history
        const assistantMsg: OrbMessage = { role: 'assistant', content: data.reply };
        orbHistoryRef.current = [...orbHistoryRef.current, assistantMsg];

        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', content: data.reply },
        ]);

        setCurrentStep(data.step);

        // Update balance optimistically
        setBalance((prev) => Math.max(0, prev - data.creditsUsed));
      } catch {
        setError('Connection failed. Please check your internet and try again.');
        orbHistoryRef.current = orbHistoryRef.current.slice(0, -1);
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    },
    [selectedType, currentStep]
  );

  // ─── Handle send: show consent widget before calling API ───────────────────

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Add user message visually
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: trimmed },
    ]);
    setInput('');
    setError(null);

    const actions = buildConsentActions();
    const totalCost = actions.reduce((s, a) => s + a.costQs, 0);

    // If no add-ons cost anything, skip consent
    if (totalCost === 0 || !configLoaded) {
      callOrbChat(trimmed, []);
      return;
    }

    // Show the consent widget as an inline message
    const consentId = crypto.randomUUID();
    const consentMsg: ConsentMessage = {
      id: consentId,
      type: 'consent',
      actions,
      totalCostQs: totalCost,
      pendingUserMessage: trimmed,
    };
    setMessages((prev) => [...prev, consentMsg]);
  }, [input, isLoading, buildConsentActions, callOrbChat, configLoaded]);

  // ─── Consent confirmed ──────────────────────────────────────────────────────

  const handleConsentConfirm = useCallback(
    (consentId: string, pendingText: string) => {
      // Remove the consent widget
      setMessages((prev) => prev.filter((m) => m.id !== consentId));

      const activeAddons = orbConfig
        .filter((a) => a.enabled)
        .map((a) => a.addonKey);

      callOrbChat(pendingText, activeAddons);
    },
    [orbConfig, callOrbChat]
  );

  // ─── Consent skipped ────────────────────────────────────────────────────────

  const handleConsentSkip = useCallback(
    (consentId: string, pendingText: string) => {
      setMessages((prev) => prev.filter((m) => m.id !== consentId));
      // Proceed with only base_llm (no extra context)
      callOrbChat(pendingText, ['base_llm']);
    },
    [callOrbChat]
  );

  // ─── Type selector ──────────────────────────────────────────────────────────

  const handleTypeSelect = useCallback(
    (type: ContentType) => {
      if (isLoading) return;
      setSelectedType(type);
      setCurrentStep('intent');

      const label = type.charAt(0).toUpperCase() + type.slice(1);
      const userText = `I want to create a ${label}`;

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'user', content: userText },
      ]);

      const actions = buildConsentActions();
      const totalCost = actions.reduce((s, a) => s + a.costQs, 0);

      if (totalCost === 0 || !configLoaded) {
        callOrbChat(userText, []);
        return;
      }

      const consentId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        {
          id: consentId,
          type: 'consent' as const,
          actions,
          totalCostQs: totalCost,
          pendingUserMessage: userText,
        },
      ]);

      inputRef.current?.focus();
    },
    [isLoading, buildConsentActions, callOrbChat, configLoaded]
  );

  // ─── Render ─────────────────────────────────────────────────────────────────

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
            href="/create"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.sm,
              marginBottom: spacing.md,
            }}
          >
            <ArrowLeft size={16} color={colors.text.secondary} />
            <Typography variant="small" style={{ color: colors.text.secondary }}>
              Back to Create
            </Typography>
          </Link>
          <Typography
            variant="h2"
            style={{ color: colors.text.primary, marginBottom: spacing.xs, fontWeight: 300 }}
          >
            Let&apos;s create together
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 14 }}>
            Tell the Orb what you need — no forms, just conversation
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
                disabled={isLoading}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  borderRadius: borderRadius.full,
                  border: `1px solid ${selectedType === type ? color : colors.glass.border}`,
                  background: selectedType === type ? `${color}20` : 'transparent',
                  color: selectedType === type ? color : colors.text.secondary,
                  fontSize: 13,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.sm,
                  transition: 'all 0.2s',
                  opacity: isLoading ? 0.5 : 1,
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
          {messages.map((msg) => {
            if (isConsentMessage(msg)) {
              return (
                <CreditConsentWidget
                  key={msg.id}
                  actions={msg.actions}
                  totalCostQs={msg.totalCostQs}
                  balance={balance}
                  isLoading={isLoading}
                  onConfirm={() => handleConsentConfirm(msg.id, msg.pendingUserMessage)}
                  onSkip={() => handleConsentSkip(msg.id, msg.pendingUserMessage)}
                />
              );
            }

            return (
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
                  background:
                    msg.role === 'user' ? colors.gradients.primary : colors.glass.light,
                  color: msg.role === 'user' ? colors.text.onDark : colors.text.primary,
                  border: msg.role === 'assistant' ? `1px solid ${colors.glass.border}` : 'none',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  lineHeight: 1.6,
                  fontSize: 15,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
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
                      background: colors.accent.primary,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: '82%',
                  padding: `${spacing.sm} ${spacing.md}`,
                  borderRadius: borderRadius.lg,
                  background: `${colors.error}18`,
                  border: `1px solid ${colors.error}30`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.sm,
                }}
              >
                <AlertCircle size={14} color={colors.error} style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 13, color: colors.error, lineHeight: 1.5 }}>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
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
            placeholder="Type your message…"
            disabled={isLoading}
            style={{
              flex: 1,
              padding: `${spacing.sm} ${spacing.md}`,
              background: 'transparent',
              border: 'none',
              fontSize: 15,
              color: colors.text.primary,
              outline: 'none',
              opacity: isLoading ? 0.5 : 1,
            }}
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{
              background: input.trim() && !isLoading ? colors.gradients.primary : colors.glass.medium,
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
