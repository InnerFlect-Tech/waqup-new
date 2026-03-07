'use client';

import React, { useState } from 'react';
import { Typography, Button, Card } from '@/components';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { FileText, BarChart3, Plus } from 'lucide-react';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';

type Tab = 'published' | 'drafts' | 'analytics';

export default function MarketplaceCreatorPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [activeTab, setActiveTab] = useState<Tab>('published');

  return (
    <PageShell intensity="medium">
      <PageContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.md,
            marginBottom: spacing.xl,
          }}
        >
          <Link href="/marketplace" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
              ← Back to marketplace
            </Typography>
          </Link>
          <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
            Creator dashboard
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Manage your published content, drafts, and analytics.
          </Typography>

          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('published')}
              style={{
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: borderRadius.full,
                border: `1px solid ${activeTab === 'published' ? colors.accent.primary : colors.glass.border}`,
                background: activeTab === 'published' ? colors.gradients.primary : 'transparent',
                color: activeTab === 'published' ? colors.text.onDark : colors.text.secondary,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              <FileText size={16} />
              Published
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              style={{
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: borderRadius.full,
                border: `1px solid ${activeTab === 'drafts' ? colors.accent.primary : colors.glass.border}`,
                background: activeTab === 'drafts' ? colors.gradients.primary : 'transparent',
                color: activeTab === 'drafts' ? colors.text.onDark : colors.text.secondary,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              Drafts
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: borderRadius.full,
                border: `1px solid ${activeTab === 'analytics' ? colors.accent.primary : colors.glass.border}`,
                background: activeTab === 'analytics' ? colors.gradients.primary : 'transparent',
                color: activeTab === 'analytics' ? colors.text.onDark : colors.text.secondary,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              <BarChart3 size={16} />
              Analytics
            </button>
          </div>
        </div>

        {/* Content area - empty state for now */}
        <Card
          variant="default"
          style={{
            padding: spacing.xxl,
            textAlign: 'center',
            background: colors.glass.light,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid ${colors.glass.border}`,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: borderRadius.full,
              background: colors.glass.light,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: spacing.lg,
            }}
          >
            <Plus size={32} color={colors.text.tertiary ?? colors.text.secondary} strokeWidth={2} />
          </div>
          <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
            No {activeTab} yet
          </Typography>
          <Typography variant="body" style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
            {activeTab === 'published' && 'Publish your first piece of content to share with the community.'}
            {activeTab === 'drafts' && 'Start creating and save as draft to continue later.'}
            {activeTab === 'analytics' && 'Once you publish content, your analytics will appear here.'}
          </Typography>
          <Link href="/create" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
              {activeTab === 'analytics' ? 'Create content' : 'Publish content'}
            </Button>
          </Link>
        </Card>
      </PageContent>
    </PageShell>
  );
}
