'use client';

import React from 'react';
import { Typography, PageShell, GlassCard } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';
import { CONTENT_MAX_WIDTH } from '@/theme';
import { Link } from '@/i18n/navigation';
import { FileText, Sparkles, Shield, Mic, Globe, ListTodo } from 'lucide-react';

const UPDATE_DOCS = [
  {
    slug: 'open-items',
    title: 'Open Items',
    description: 'Unresolved work requiring attention before launch. Single source of truth for what still needs to be done.',
    icon: ListTodo,
  },
  {
    slug: 'multilingual-i18n-implementation',
    title: 'Full Multilingual (i18n) Implementation',
    description: 'Everything about the 5-language rollout: what was built, how to use it, required database migrations, improvement suggestions, and ChatGPT prompts for multilingual social content.',
    icon: Globe,
  },
  {
    slug: 'beta-readiness-implementation',
    title: 'Beta Readiness Implementation',
    description: 'What was done in the beta audit, how to use it, database migrations, suggestions to improve, and ChatGPT prompts for copyrights and socials.',
    icon: Shield,
  },
  {
    slug: 'beta-tester-recruitment',
    title: 'Beta Tester Recruitment',
    description: 'How to recruit beta testers online: ChatGPT image prompts, onboarding links, and database setup.',
    icon: Sparkles,
  },
  {
    slug: 'audio-system-implementation',
    title: 'Audio System Implementation',
    description: 'Full audio audit fixes: own-voice recording, atmosphere presets, Safari compatibility, migrations, and ChatGPT prompts for social assets.',
    icon: Mic,
  },
];

export default function UpdatesIndexPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PageShell intensity="medium" bare allowDocumentScroll>
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', paddingTop: spacing.xxl, paddingBottom: spacing.xxl }}>
        <div style={{ marginBottom: spacing.xl }}>
          <Typography
            variant="h1"
            style={{ marginBottom: spacing.sm, color: colors.text.primary, fontSize: '1.75rem' }}
          >
            Updates & How-To Guides
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
            Internal documentation of features, changes, and operational guides. Superadmin only.
          </Typography>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: spacing.md,
          }}
        >
          {UPDATE_DOCS.map((doc) => {
            const Icon = doc.icon ?? FileText;
            return (
              <Link
                key={doc.slug}
                href={`/updates/${doc.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 24px ${colors.accent.primary}20`;
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                <GlassCard
                  variant="content"
                  style={{
                    padding: spacing.lg,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing.sm,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <div
                      style={{
                        padding: spacing.sm,
                        borderRadius: borderRadius.md,
                        background: `${colors.accent.primary}20`,
                        color: colors.accent.primary,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <Typography variant="h3" style={{ color: colors.text.primary, fontSize: '1.1rem' }}>
                      {doc.title}
                    </Typography>
                  </div>
                  <Typography variant="body" style={{ color: colors.text.secondary, fontSize: '0.9rem' }}>
                    {doc.description}
                  </Typography>
                </GlassCard>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
