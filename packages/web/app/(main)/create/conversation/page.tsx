'use client';

import React, { useState } from 'react';
import { Typography, Button } from '@/components';
import { PageShell } from '@/components';
import Link from 'next/link';
import { Sparkles, Brain, Music } from 'lucide-react';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  default: "I'd love to help you create something. What kind of content would you like to make? Affirmation, meditation, or ritual?",
  affirmation: "Great choice! Affirmations help with cognitive re-patterning. What area of your life would you like to focus on?",
  meditation: "Meditations are perfect for state induction. What mood or goal are you aiming for?",
  ritual: "Rituals combine voice, intention, and structure. What moment or transition would you like to ritualize?",
};

export default function CreateConversationPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: MOCK_RESPONSES.default },
  ]);
  const [input, setInput] = useState('');
  const [selectedType, setSelectedType] = useState<'affirmation' | 'meditation' | 'ritual' | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: String(Date.now()), role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Mock assistant response
    const type = selectedType ?? (input.toLowerCase().includes('affirmation') ? 'affirmation' : input.toLowerCase().includes('meditation') ? 'meditation' : input.toLowerCase().includes('ritual') ? 'ritual' : 'default');
    const replyContent = MOCK_RESPONSES[type] ?? MOCK_RESPONSES.default;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: String(Date.now() + 1), role: 'assistant', content: replyContent },
      ]);
    }, 500);
  };

  const handleTypeSelect = (type: 'affirmation' | 'meditation' | 'ritual') => {
    setSelectedType(type);
    setInput(`I want to create a ${type}`);
  };

  return (
    <PageShell intensity="medium">
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <Link href="/create" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: spacing.lg }}>
          <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
            ← Back to create
          </Typography>
        </Link>

        <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
          Conversational creation
        </Typography>
        <Typography variant="body" style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
          Chat-like creation for affirmations, meditations, rituals. No static forms.
        </Typography>

        <div style={{ marginBottom: spacing.lg, display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
          <button
            onClick={() => handleTypeSelect('affirmation')}
            style={{
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              border: `1px solid ${selectedType === 'affirmation' ? colors.accent.secondary : colors.glass.border}`,
              background: selectedType === 'affirmation' ? colors.gradients.secondary : colors.glass.light,
              color: selectedType === 'affirmation' ? colors.text.onDark : colors.text.secondary,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
            }}
          >
            <Sparkles size={16} />
            Affirmation
          </button>
          <button
            onClick={() => handleTypeSelect('meditation')}
            style={{
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              border: `1px solid ${selectedType === 'meditation' ? colors.accent.tertiary : colors.glass.border}`,
              background: selectedType === 'meditation' ? colors.gradients.secondary : colors.glass.light,
              color: selectedType === 'meditation' ? colors.text.onDark : colors.text.secondary,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
            }}
          >
            <Brain size={16} />
            Meditation
          </button>
          <button
            onClick={() => handleTypeSelect('ritual')}
            style={{
              padding: `${spacing.xs} ${spacing.md}`,
              borderRadius: borderRadius.full,
              border: `1px solid ${selectedType === 'ritual' ? colors.accent.primary : colors.glass.border}`,
              background: selectedType === 'ritual' ? colors.gradients.primary : colors.glass.light,
              color: selectedType === 'ritual' ? colors.text.onDark : colors.text.primary,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: spacing.xs,
            }}
          >
            <Music size={16} />
            Ritual
          </button>
        </div>

        {/* Message list */}
        <div
          style={{
            minHeight: '200px',
            maxHeight: '400px',
            overflowY: 'auto',
            marginBottom: spacing.lg,
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: spacing.md,
                borderRadius: borderRadius.md,
                background: msg.role === 'user' ? colors.gradients.primary : colors.glass.light,
                color: msg.role === 'user' ? colors.text.onDark : colors.text.primary,
                border: msg.role === 'assistant' ? `1px solid ${colors.glass.border}` : 'none',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="body" style={{ margin: 0 }}>
                {msg.content}
              </Typography>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: spacing.md,
              borderRadius: borderRadius.md,
              border: `1px solid ${colors.glass.border}`,
              background: colors.glass.light,
              fontSize: '14px',
              color: colors.text.primary,
              outline: 'none',
            }}
          />
          <Button
            variant="primary"
            size="md"
            style={{ background: colors.gradients.primary }}
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
