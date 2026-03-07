'use client';

import React, { useState } from 'react';
import { Typography, Button } from '@/components';
import { SpeakingAnimation } from '@/components/audio';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { Mic, MicOff } from 'lucide-react';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';

export default function SpeakPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleMicClick = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate: after "listening" we "speak"
      setTimeout(() => setIsSpeaking(true), 1000);
    } else {
      setIsSpeaking(false);
    }
  };

  const statusText = isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Tap to speak';

  return (
    <PageShell intensity="medium">
      <PageContent width="medium" centered>
        <Link href="/home" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: spacing.lg, textAlign: 'left' }}>
          <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
            ← Back
          </Typography>
        </Link>

        <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
          Speak
        </Typography>
        <Typography variant="body" style={{ marginBottom: spacing.xl, color: colors.text.secondary }}>
          Voice-first conversation — tap to speak
        </Typography>

        <div
          style={{
            marginBottom: spacing.xl,
            borderRadius: borderRadius.lg,
            overflow: 'hidden',
            minHeight: '320px',
          }}
        >
          <SpeakingAnimation isSpeaking={isSpeaking || isListening} style={{ minHeight: '320px' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.lg }}>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            {statusText}
          </Typography>
          <button
            onClick={handleMicClick}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: borderRadius.full,
              border: 'none',
              background: isListening || isSpeaking ? colors.gradients.primary : colors.glass.light,
              color: isListening || isSpeaking ? colors.text.onDark : colors.text.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening || isSpeaking ? `0 4px 20px ${colors.accent.primary}60` : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {isListening || isSpeaking ? <MicOff size={36} strokeWidth={2.5} /> : <Mic size={36} strokeWidth={2.5} />}
          </button>
          <Link href="/create/conversation" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="md">
              Or type to create
            </Button>
          </Link>
        </div>
      </PageContent>
    </PageShell>
  );
}
