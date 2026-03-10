'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/i18n/navigation';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius, BLUR } from '@/theme';
import { useContentCreation } from '@/lib/contexts/ContentCreationContext';
import type { CreationMode } from '@waqup/shared/constants';
import { LayoutList, MessageSquare, Bot, Mic } from 'lucide-react';
import { AI_MODE_COSTS } from '@waqup/shared/constants';

export interface ContentModeSelectorProps {
  formHref: string;
  chatHref?: string;
  /** Explicit href for the voice/orb agent mode. Required when chatHref does not contain 'conversation'. */
  agentHref?: string;
  /** Base path for the content type, used to build agentHref when not provided. E.g. '/create' */
  basePath?: string;
}

const MODES: Array<{
  mode: CreationMode;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  label: string;
  tagline: string;
  color: string;
  cost: number | null;
}> = [
  {
    mode: 'form',
    icon: LayoutList,
    label: 'Step-by-step',
    tagline: 'Guided prompts — structured and clear',
    color: '#c084fc',
    cost: null,
  },
  {
    mode: 'chat',
    icon: MessageSquare,
    label: 'Chat with AI',
    tagline: 'GPT-4o-mini · 1Q per reply · 2Q for script',
    color: '#60a5fa',
    cost: AI_MODE_COSTS.chat,
  },
  {
    mode: 'agent',
    icon: Mic,
    label: 'Speak to Orb',
    tagline: 'Voice-first · GPT-4o-mini · 1Q per reply',
    color: '#34d399',
    cost: AI_MODE_COSTS.agent,
  },
];

export function ContentModeSelector({ formHref, chatHref = '/create/conversation', agentHref, basePath }: ContentModeSelectorProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { setCreationMode } = useContentCreation();

  // Derive agent href: prefer explicit prop, then base path + '/orb', then fall back to /create/orb
  const resolvedAgentHref = agentHref ?? (basePath ? `${basePath}/orb` : '/create/orb');

  const hrefMap: Record<CreationMode, string> = {
    form: formHref,
    chat: chatHref,
    agent: resolvedAgentHref,
  };

  const handleSelect = (mode: CreationMode) => {
    setCreationMode(mode);
    router.push(hrefMap[mode]);
  };

  return (
    <div style={{ marginTop: spacing.lg }}>
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
        {MODES.map(({ mode, icon: Icon, label, tagline, color, cost }, i) => (
          <motion.button
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleSelect(mode)}
            style={{
              flex: 1,
              padding: spacing.md,
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.lg,
              WebkitBackdropFilter: BLUR.lg,
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
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs }}>
              {cost !== null ? (
                <>
                  <Bot size={11} color={color} strokeWidth={2} />
                  <Typography variant="caption" style={{ color, margin: 0, fontSize: 11, fontWeight: 600 }}>
                    {cost} Qs
                  </Typography>
                </>
              ) : (
                <Typography variant="caption" style={{ color: colors.text.secondary, margin: 0, fontSize: 11 }}>
                  Free
                </Typography>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
