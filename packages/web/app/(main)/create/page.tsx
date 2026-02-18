'use client';

import React from 'react';
import { Typography, Button, Card } from '@/components';
import { spacing, borderRadius, SAFE_AREA_RIGHT } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import Link from 'next/link';
import { 
  Sparkles, 
  Brain,
  Music,
  Wand2,
} from 'lucide-react';

interface ContentType {
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  href: string;
  color: string;
}

const CONTENT_TYPES: ContentType[] = [
  {
    name: 'Create Affirmation',
    description: 'Powerful statements to rewire your subconscious mind',
    icon: Sparkles,
    href: '/sanctuary/affirmations/create',
    color: 'primary',
  },
  {
    name: 'Create Meditation',
    description: 'Guided meditations for deep relaxation and transformation',
    icon: Brain,
    href: '/sanctuary/meditations/create',
    color: 'secondary',
  },
  {
    name: 'Create Ritual',
    description: 'Personalized rituals combining voice, frequencies, and intention',
    icon: Music,
    href: '/sanctuary/rituals/create',
    color: 'tertiary',
  },
];

export default function CreatePage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium">
      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: spacing.md, paddingRight: SAFE_AREA_RIGHT }}>
          {/* Header */}
          <div style={{ marginBottom: spacing.xl }}>
            <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
              Create New Content
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Choose the type of content you want to create
            </Typography>
          </div>

          {/* Content Type Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: spacing.xl,
            }}
          >
            {CONTENT_TYPES.map((type) => {
              const IconComponent = type.icon;
              return (
                <Link key={type.name} href={type.href} style={{ textDecoration: 'none' }}>
                  <Card
                    variant="elevated"
                    pressable
                    style={{
                      padding: spacing.xxl,
                      height: '100%',
                      minHeight: '300px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      background: colors.glass.opaque,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.glass.border}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: borderRadius.lg,
                        background: colors.background.tertiary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: spacing.lg,
                        flexShrink: 0,
                      }}
                    >
                      <IconComponent size={40} color={colors.accent.primary} strokeWidth={2.5} />
                    </div>
                    <Typography variant="h2" style={{ color: colors.text.primary, marginBottom: spacing.md }}>
                      {type.name}
                    </Typography>
                    <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6 }}>
                      {type.description}
                    </Typography>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Back Link */}
          <div style={{ marginTop: spacing.xl, textAlign: 'center' }}>
            <Link href="/home" style={{ textDecoration: 'none' }}>
              <Button
                variant="ghost"
                size="md"
                style={{
                  color: colors.text.secondary,
                }}
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
    </PageShell>
  );
}
