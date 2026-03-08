'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Typography, Button } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { useContentCreation, type CreationMode } from '@/lib/contexts/ContentCreationContext';
import { LayoutList, MessageSquare, Mic } from 'lucide-react';

export interface ContentModeSelectorProps {
  formHref: string;
  orbHref?: string;
  chatHref?: string;
}

export function ContentModeSelector({ formHref, chatHref = '/create/conversation', orbHref }: ContentModeSelectorProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { setCreationMode } = useContentCreation();

  const handleSelect = (mode: CreationMode, href: string) => {
    setCreationMode(mode);
    router.push(href);
  };

  const modes: Array<{
    mode: CreationMode;
    href: string;
    icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
    label: string;
    tagline: string;
    color: string;
  }> = [
    {
      mode: 'form',
      href: formHref,
      icon: LayoutList,
      label: 'Step-by-step',
      tagline: 'Guided prompts — structured and clear',
      color: '#c084fc',
    },
    {
      mode: 'conversation',
      href: chatHref,
      icon: MessageSquare,
      label: 'Chat with AI',
      tagline: 'Conversational — just talk it through',
      color: '#60a5fa',
    },
    {
      mode: 'orb',
      href: orbHref ?? chatHref.replace('conversation', 'orb'),
      icon: Mic,
      label: 'Speak to Orb',
      tagline: 'Voice-first — say it aloud',
      color: '#34d399',
    },
  ];

  return (
    <div style={{ marginTop: spacing.xl }}>
      <Typography
        variant="small"
        style={{
          color: colors.text.secondary,
          textAlign: 'center',
          display: 'block',
          marginBottom: spacing.md,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: 11,
        }}
      >
        Choose how to create
      </Typography>
      <div style={{ display: 'flex', gap: spacing.md }}>
        {modes.map(({ mode, href, icon: Icon, label, tagline, color }, i) => (
          <motion.button
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleSelect(mode, href)}
            style={{
              flex: 1,
              padding: spacing.lg,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${colors.glass.border}`,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.sm,
            }}
            whileHover={{
              borderColor: color + '60',
              background: color + '0a',
              y: -2,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: borderRadius.md,
                background: `${color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon size={20} color={color} strokeWidth={2} />
            </div>
            <Typography variant="h4" style={{ color: colors.text.primary, margin: 0, fontWeight: 500 }}>
              {label}
            </Typography>
            <Typography variant="small" style={{ color: colors.text.secondary, margin: 0, fontSize: 12, lineHeight: 1.5 }}>
              {tagline}
            </Typography>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
