'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
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
  BarChart3,
  BookOpen,
  Handshake,
  Database,
  Wrench,
  Smartphone,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { PageShell, SuperAdminGate } from '@/components';
import { Typography } from '@/components';
import { useTheme } from '@/theme';
import { spacing, borderRadius } from '@/theme';

interface AdminCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  category: 'strategy' | 'ops' | 'config' | 'docs' | 'system' | 'tools';
}

const ADMIN_CARDS: AdminCard[] = [
  // Strategy — company master plan
  { title: 'Company Strategy', description: 'Internal master plan — thesis, economic engine, flywheel, phase roadmap, risks.', href: '/admin/company-strategy', icon: <Compass />, category: 'strategy' },
  // Operations — day-to-day admin
  { title: 'iOS App Store Release', description: 'Implementation log, setup checklist, DB migration, marketing prompts.', href: '/admin/ios-release', icon: <Smartphone />, category: 'ops' },
  { title: 'User Management', description: 'Users, credit balances, subscriptions, transactions.', href: '/admin/users', icon: <Users />, category: 'ops' },
  { title: 'Waitlist & Access', description: 'Review signups, approve or revoke app access.', href: '/admin/waitlist', icon: <ListChecks />, category: 'ops' },
  { title: 'Founding Partners', description: 'Manage founding partner inquiries and status.', href: '/admin/founding-partners', icon: <Handshake />, category: 'ops' },
  { title: 'Content Overview', description: 'Counts by type/status, recent activity.', href: '/admin/content', icon: <BarChart3 />, category: 'ops' },
  // Configuration
  { title: 'Oracle / AI Config', description: 'System prompt, ElevenLabs voices, live test.', href: '/admin/oracle', icon: <Cpu />, category: 'config' },
  // Documentation — how the solution works
  { title: 'Updates & How-To', description: 'Product updates, beta recruitment, operational guides.', href: '/updates', icon: <FileText />, category: 'docs' },
  { title: 'Pipelines Reference', description: 'Scientific foundations, pipeline comparison.', href: '/system/pipelines', icon: <BookOpen />, category: 'docs' },
  { title: 'Creation Steps', description: 'Step status for form, chat, and orb flows.', href: '/system/creation-steps', icon: <Layout />, category: 'docs' },
  { title: 'Audio & TTS', description: 'ElevenLabs, voice cloning, recording flow.', href: '/system/audio', icon: <Mic />, category: 'docs' },
  { title: 'Conversation Flow', description: 'LLM state machine, chat vs orb, handoff.', href: '/system/conversation', icon: <BookOpen />, category: 'docs' },
  // System & Infrastructure
  { title: 'System Docs', description: 'Architecture, schema, data flow.', href: '/system', icon: <Settings />, category: 'system' },
  { title: 'Schema Live Status', description: 'Live DB checks — tables, columns.', href: '/system/schema', icon: <Database />, category: 'system' },
  { title: 'API Health', description: 'Supabase, OpenAI, ElevenLabs, Stripe status.', href: '/health', icon: <Activity />, category: 'system' },
  // Tools & shortcuts
  { title: 'Restart Onboarding', description: 'Reset onboarding_completed_at and re-run the flow for testing.', href: '/admin/onboarding/reset', icon: <RotateCcw />, category: 'tools' },
  { title: 'All Pages', description: 'Full route index — status, auth, notes.', href: '/pages', icon: <FileText />, category: 'tools' },
  { title: 'Sitemap', description: 'Visual sitemap of all routes.', href: '/sitemap-view', icon: <Map />, category: 'tools' },
  { title: 'Design Showcase', description: 'Component library and design system.', href: '/showcase', icon: <Layout />, category: 'tools' },
  { title: 'Orb Creator', description: 'Voice orb creation flow (shortcut).', href: '/create/orb', icon: <Mic />, category: 'tools' },
  { title: 'Content Library', description: 'Browse content (shortcut).', href: '/library', icon: <Library />, category: 'tools' },
];

const CATEGORY_CONFIG: Record<AdminCard['category'], { label: string; order: number }> = {
  strategy: { label: 'Strategy', order: -1 },
  ops: { label: 'Operations', order: 0 },
  config: { label: 'Configuration', order: 1 },
  docs: { label: 'Documentation', order: 2 },
  system: { label: 'System & Infrastructure', order: 3 },
  tools: { label: 'Tools & Shortcuts', order: 4 },
};

const CATEGORY_ORDER: AdminCard['category'][] = ['strategy', 'ops', 'config', 'docs', 'system', 'tools'];

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
        {React.cloneElement(card.icon as React.ReactElement<{ size?: number }>, { size: 20 })}
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
      <PageShell intensity="medium" bare allowDocumentScroll>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            paddingTop: spacing.xxl,
            paddingBottom: spacing.xxl,
          }}
        >
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
              Operations, configuration, documentation, and internal tools.
            </Typography>
          </div>

          {CATEGORY_ORDER.map((category) => {
            const cards = ADMIN_CARDS.filter((c) => c.category === category);
            const config = CATEGORY_CONFIG[category];
            if (cards.length === 0) return null;
            const sortKey = config.order;
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
                  {config.label}
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
