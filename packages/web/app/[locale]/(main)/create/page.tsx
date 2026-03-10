'use client';

import React, { useState } from 'react';
import { Typography, Button } from '@/components';
import { spacing, borderRadius, BLUR, shadows } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Music, Mic, MessageSquare } from 'lucide-react';
import { CONTENT_CREDIT_COSTS, CONTENT_TYPE_COLORS, type ContentItemType } from '@waqup/shared/constants';
import { formatQs } from '@waqup/shared/utils';
import { QCoin } from '@/components';

interface ContentTypeCard {
  type: ContentItemType;
  name: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  href: string;
  accentColor: string;
  depth: string;
}

const CONTENT_TYPES: ContentTypeCard[] = [
  {
    type: 'affirmation',
    name: 'Affirmation',
    tagline: 'Cognitive re-patterning',
    description: 'Rewire subconscious beliefs through positive, present-tense statements.',
    icon: Sparkles,
    href: '/sanctuary/affirmations/create/init',
    accentColor: CONTENT_TYPE_COLORS.affirmation,
    depth: 'Shallow → Medium',
  },
  {
    type: 'meditation',
    name: 'Meditation',
    tagline: 'State induction',
    description: 'Guided visualization and relaxation sequences.',
    icon: Brain,
    href: '/sanctuary/meditations/create/init',
    accentColor: CONTENT_TYPE_COLORS.meditation,
    depth: 'Medium',
  },
  {
    type: 'ritual',
    name: 'Ritual',
    tagline: 'Identity encoding',
    description: 'Voice, sacred frequencies, and structured intention.',
    icon: Music,
    href: '/sanctuary/rituals/create/init',
    accentColor: CONTENT_TYPE_COLORS.ritual,
    depth: 'Deepest',
  },
];

export default function CreatePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <PageShell intensity="medium">
      <PageContent>
        {/* Primary: conversational entry */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginBottom: spacing.xxl,
            padding: spacing.xxl,
            borderRadius: borderRadius.xl,
            background: `linear-gradient(145deg, ${colors.accent.primary}12, ${colors.glass.light})`,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${colors.accent.primary}30`,
            textAlign: 'center',
          }}
        >
          <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontWeight: 300 }}>
            Create by talking
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.xl, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            Tell the orb what you&apos;re going through. No forms — we&apos;ll guide you to the right practice.
          </Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'center', alignItems: 'center' }}>
            <Link href="/create/orb" style={{ textDecoration: 'none' }} data-testid="create-orb-primary">
              <Button variant="primary" size="lg">
                <Mic size={18} />
                Talk to the Orb
              </Button>
            </Link>
            <Link href="/create/conversation" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="lg">
                <MessageSquare size={18} />
                Chat instead
              </Button>
            </Link>
            <Link href="/speak" style={{ textDecoration: 'none' }}>
              <Typography variant="small" style={{ color: colors.accent.tertiary }}>
                Or explore with the Oracle →
              </Typography>
            </Link>
          </div>
        </motion.div>

        {/* Secondary: choose a type (form fallback) */}
        <Typography variant="h4" style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}>
          Or choose a type
        </Typography>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: spacing.lg,
            marginBottom: spacing.xl,
          }}
        >
          {CONTENT_TYPES.map((card, index) => {
            const IconComponent = card.icon;
            const isHovered = hovered === card.name;
            const costs = CONTENT_CREDIT_COSTS[card.type];

            return (
              <Link key={card.name} href={card.href} data-testid={`create-content-type-card-${card.type}`} style={{ textDecoration: 'none', height: '100%', minHeight: 0 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  onMouseEnter={() => setHovered(card.name)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    padding: spacing.xl,
                    borderRadius: borderRadius.xl,
                    background: isHovered
                      ? `linear-gradient(145deg, ${card.accentColor}18, ${colors.glass.light})`
                      : colors.glass.light,
                    backdropFilter: BLUR.xl,
                    WebkitBackdropFilter: BLUR.xl,
                    border: `1px solid ${isHovered ? card.accentColor + '50' : colors.glass.border}`,
                    boxShadow: isHovered ? `0 16px 48px ${card.accentColor}30` : shadows.lg,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 200,
                    height: '100%',
                    transform: isHovered ? 'translateY(-4px)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: borderRadius.lg,
                      background: `${card.accentColor}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: spacing.md,
                    }}
                  >
                    <IconComponent size={24} color={card.accentColor} strokeWidth={2} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: card.accentColor, marginBottom: spacing.xs, display: 'block' }}>
                    {card.tagline}
                  </span>
                  <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 500 }}>
                    {card.name}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.6, flex: 1 }}>
                    {card.description}
                  </Typography>
                  <div style={{ marginTop: spacing.md, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="small" style={{ color: colors.text.secondary }}>{card.depth}</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                      <QCoin size="sm" />
                      <Typography variant="small" style={{ color: card.accentColor, fontWeight: 600 }}>
                        {formatQs(costs.base)}
                        {costs.withAi > costs.base ? ` (${formatQs(costs.withAi)} w/ AI)` : ''}
                      </Typography>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </PageContent>
    </PageShell>
  );
}
