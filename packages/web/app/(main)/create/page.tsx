'use client';

import React, { useState } from 'react';
import { Typography, Button } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Music, CreditCard, Wand2 } from 'lucide-react';

interface ContentTypeCard {
  name: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  href: string;
  credits: number;
  accentColor: string;
  depth: string;
}

const CONTENT_TYPES: ContentTypeCard[] = [
  {
    name: 'Affirmation',
    tagline: 'Cognitive re-patterning',
    description: 'Rewire subconscious beliefs through positive, present-tense statements delivered in your own voice.',
    icon: Sparkles,
    href: '/sanctuary/affirmations/create',
    credits: 5,
    accentColor: '#c084fc',
    depth: 'Shallow → Medium depth',
  },
  {
    name: 'Meditation',
    tagline: 'State induction',
    description: 'Guided visualization and relaxation sequences that shift your mental and emotional state.',
    icon: Brain,
    href: '/sanctuary/meditations/create',
    credits: 8,
    accentColor: '#60a5fa',
    depth: 'Medium depth',
  },
  {
    name: 'Ritual',
    tagline: 'Identity encoding',
    description: 'The deepest practice — combines voice, sacred frequencies, and structured intention for lasting transformation.',
    icon: Music,
    href: '/sanctuary/rituals/create',
    credits: 12,
    accentColor: '#34d399',
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: spacing.xxl }}
        >
          <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontWeight: 300 }}>
            Create New Content
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Choose what you want to create. Each type serves a different depth of transformation.
          </Typography>
        </motion.div>

        {/* Content Type Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: spacing.xl,
            marginBottom: spacing.xxl,
          }}
        >
          {CONTENT_TYPES.map((type, index) => {
            const IconComponent = type.icon;
            const isHovered = hovered === type.name;

            return (
              <Link key={type.name} href={type.href} style={{ textDecoration: 'none' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  onMouseEnter={() => setHovered(type.name)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    padding: spacing.xxl,
                    borderRadius: borderRadius.xl,
                    background: isHovered
                      ? `linear-gradient(145deg, ${type.accentColor}18, ${colors.glass.light})`
                      : colors.glass.light,
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: `1px solid ${isHovered ? type.accentColor + '50' : colors.glass.border}`,
                    boxShadow: isHovered
                      ? `0 16px 48px ${type.accentColor}30`
                      : `0 4px 24px rgba(0,0,0,0.2)`,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 320,
                    transform: isHovered ? 'translateY(-4px)' : 'none',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: borderRadius.xl,
                      background: isHovered
                        ? `linear-gradient(135deg, ${type.accentColor}60, ${type.accentColor}30)`
                        : `${type.accentColor}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: spacing.xl,
                      boxShadow: isHovered ? `0 8px 24px ${type.accentColor}40` : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <IconComponent size={36} color={type.accentColor} strokeWidth={2} />
                  </div>

                  {/* Type badge */}
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: type.accentColor,
                      marginBottom: spacing.sm,
                    }}
                  >
                    {type.tagline}
                  </span>

                  <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.sm, fontWeight: 300 }}>
                    {type.name}
                  </Typography>
                  <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.7, flex: 1 }}>
                    {type.description}
                  </Typography>

                  {/* Footer: depth + credits */}
                  <div
                    style={{
                      marginTop: spacing.xl,
                      paddingTop: spacing.md,
                      borderTop: `1px solid ${colors.glass.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="small" style={{ color: colors.text.secondary }}>
                      {type.depth}
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                      <CreditCard size={13} color={type.accentColor} strokeWidth={2} />
                      <Typography variant="small" style={{ color: type.accentColor, fontWeight: 600 }}>
                        {type.credits} credits
                      </Typography>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Voice alternative */}
        <div
          style={{
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${colors.glass.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: spacing.md,
          }}
        >
          <div>
            <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
              Not sure what to create?
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 14 }}>
              Tell us what you&apos;re going through — we&apos;ll guide you to the right practice.
            </Typography>
          </div>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            <Link href="/create/conversation" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
                <Wand2 size={16} style={{ marginRight: spacing.sm }} />
                Let&apos;s talk
              </Button>
            </Link>
            <Link href="/speak" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="md">
                Voice mode
              </Button>
            </Link>
          </div>
        </div>

        <div style={{ marginTop: spacing.lg, textAlign: 'center' }}>
          <Link href="/sanctuary" style={{ textDecoration: 'none' }}>
            <Button variant="ghost" size="sm" style={{ color: colors.text.secondary }}>
              ← Back to Sanctuary
            </Button>
          </Link>
        </div>
      </PageContent>
    </PageShell>
  );
}
