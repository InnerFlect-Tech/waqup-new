'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Cpu,
  FileText,
  Activity,
  Layout,
  Map,
  Settings,
  Mic,
  Library,
  Shield,
  ListChecks,
} from 'lucide-react';
import { PageShell, GlassCard, SuperAdminGate } from '@/components';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';

interface AdminCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  category: 'platform' | 'tools' | 'content';
}

const ADMIN_CARDS: AdminCard[] = [
  // Platform operations
  {
    title: 'User Management',
    description: 'View all users, credit balances, subscriptions, and transaction history.',
    href: '/admin/users',
    icon: <Users />,
    category: 'platform',
  },
  {
    title: 'Waitlist & Access',
    description: 'Review waitlist signups and manually approve or revoke app access.',
    href: '/admin/waitlist',
    icon: <ListChecks />,
    category: 'platform',
  },
  {
    title: 'Oracle / AI Config',
    description: 'Configure the Oracle AI system prompt, ElevenLabs voices, and live test.',
    href: '/admin/oracle',
    icon: <Cpu />,
    category: 'platform',
  },
  // Content & creation
  {
    title: 'Orb Creator',
    description: 'Access the voice orb creation flow used for building content.',
    href: '/create/orb',
    icon: <Mic />,
    category: 'content',
  },
  {
    title: 'Content Library',
    description: 'Browse the full content library.',
    href: '/library',
    icon: <Library />,
    category: 'content',
  },
  // Internal tools
  {
    title: 'All Pages',
    description: 'Full index of every route — status, auth requirement, and notes.',
    href: '/pages',
    icon: <FileText />,
    category: 'tools',
  },
  {
    title: 'System Overview',
    description: 'Database schema, table status, and migration state.',
    href: '/system',
    icon: <Settings />,
    category: 'tools',
  },
  {
    title: 'Creation Steps',
    description: 'Pipeline step status for all three content creation flows.',
    href: '/system/creation-steps',
    icon: <Layout />,
    category: 'tools',
  },
  {
    title: 'API Health',
    description: 'Live status of all API integrations: Supabase, OpenAI, ElevenLabs, Stripe.',
    href: '/health',
    icon: <Activity />,
    category: 'tools',
  },
  {
    title: 'Design Showcase',
    description: 'Component library and design system showcase.',
    href: '/showcase',
    icon: <Layout />,
    category: 'tools',
  },
  {
    title: 'Sitemap',
    description: 'Visual sitemap of all public and protected routes.',
    href: '/sitemap-view',
    icon: <Map />,
    category: 'tools',
  },
];

const CATEGORY_LABELS: Record<AdminCard['category'], string> = {
  platform: 'Platform Operations',
  content: 'Content & Creation',
  tools: 'Internal Tools',
};

const CATEGORY_ORDER: AdminCard['category'][] = ['platform', 'content', 'tools'];

function AdminTile({
  card,
  colors,
}: {
  card: AdminCard;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
}) {
  return (
    <Link
      href={card.href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        background: colors.glass.light,
        border: `1px solid ${colors.glass.border}`,
        textDecoration: 'none',
        color: colors.text.primary,
        transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = `${colors.accent.primary}15`;
        e.currentTarget.style.borderColor = `${colors.accent.primary}60`;
        e.currentTarget.style.boxShadow = `0 4px 20px ${colors.accent.primary}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = colors.glass.light;
        e.currentTarget.style.borderColor = colors.glass.border;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: borderRadius.md,
          background: `${colors.accent.primary}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: colors.accent.primary,
        }}
      >
        {React.cloneElement(card.icon as React.ReactElement, { size: 20 })}
      </div>
      <div>
        <Typography
          variant="body"
          style={{ fontWeight: 600, marginBottom: spacing.xs, color: colors.text.primary }}
        >
          {card.title}
        </Typography>
        <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 1.4 }}>
          {card.description}
        </Typography>
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <SuperAdminGate>
      <PageShell intensity="medium" bare>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: spacing.xl,
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: spacing.xl }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: spacing.sm,
                marginBottom: spacing.xs,
              }}
            >
              <Shield size={24} color={colors.accent.primary} />
              <Typography variant="h1" style={{ color: colors.text.primary }}>
                Superadmin Dashboard
              </Typography>
            </div>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Platform operations, configuration, and internal tooling.
            </Typography>
          </div>

          {/* Sections */}
          {CATEGORY_ORDER.map((category) => {
            const cards = ADMIN_CARDS.filter((c) => c.category === category);
            return (
              <div key={category} style={{ marginBottom: spacing.xl }}>
                <Typography
                  variant="small"
                  style={{
                    color: colors.text.secondary,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: spacing.md,
                    fontSize: 11,
                  }}
                >
                  {CATEGORY_LABELS[category]}
                </Typography>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: spacing.md,
                  }}
                >
                  {cards.map((card) => (
                    <AdminTile key={card.href} card={card} colors={colors} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </PageShell>
    </SuperAdminGate>
  );
}
