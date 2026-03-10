'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Typography, Button, Card, Loading } from '@/components';
import { PageShell, PageContent } from '@/components';
import { Link } from '@/i18n/navigation';
import { FileText, BarChart3, Plus, Share2, Play, Sparkles, TrendingUp, Coins, ExternalLink, Trophy, Zap } from 'lucide-react';
import { spacing, borderRadius, BLUR } from '@/theme';
import { useTheme } from '@/theme';
import { getContentTypeIcon } from '@/lib';
import { ElevatedBadge, ShareModal, CreatorGate } from '@/components/marketplace';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import { supabase } from '@/lib/supabase';

type Tab = 'published' | 'drafts' | 'analytics';

interface PublishedItem {
  marketplaceId: string;
  contentItemId: string;
  type: 'affirmation' | 'meditation' | 'ritual';
  title: string;
  description: string;
  duration: string;
  playCount: number;
  shareCount: number;
  isElevated: boolean;
  listedAt: string;
}

interface DraftItem {
  id: string;
  type: 'affirmation' | 'meditation' | 'ritual';
  title: string;
  description: string;
  duration: string;
  status: string;
  createdAt: string;
}

interface AnalyticsSummary {
  totalPlays: number;
  totalShares: number;
  creditsEarned: number;
  publishedCount: number;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function fetchPublished(userId: string): Promise<PublishedItem[]> {
  const { data } = await supabase
    .from('marketplace_items')
    .select(`
      id, is_elevated, play_count, share_count, listed_at,
      content_items (id, type, title, description, duration)
    `)
    .eq('creator_id', userId)
    .eq('is_listed', true)
    .order('listed_at', { ascending: false });

  if (!data) return [];
  return data.flatMap((row) => {
    const ci = (row as Record<string, unknown>).content_items as Record<string, unknown> | null;
    if (!ci) return [];
    return [{
      marketplaceId: row.id as string,
      contentItemId: ci.id as string,
      type: ci.type as DraftItem['type'],
      title: ci.title as string,
      description: (ci.description as string) ?? '',
      duration: (ci.duration as string) ?? '',
      playCount: (row as Record<string, unknown>).play_count as number ?? 0,
      shareCount: (row as Record<string, unknown>).share_count as number ?? 0,
      isElevated: (row as Record<string, unknown>).is_elevated as boolean ?? false,
      listedAt: (row as Record<string, unknown>).listed_at as string,
    }];
  });
}

async function fetchDrafts(userId: string): Promise<DraftItem[]> {
  // Sanctuary content that isn't yet listed on marketplace
  const { data: listed } = await supabase
    .from('marketplace_items')
    .select('content_item_id')
    .eq('creator_id', userId)
    .eq('is_listed', true);

  const listedIds = (listed ?? []).map((r) => r.content_item_id as string);

  let query = supabase
    .from('content_items')
    .select('id, type, title, description, duration, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (listedIds.length > 0) {
    query = query.not('id', 'in', `(${listedIds.join(',')})`);
  }

  const { data } = await query;
  if (!data) return [];
  return data.map((r) => ({
    id: r.id as string,
    type: r.type as DraftItem['type'],
    title: r.title as string,
    description: (r.description as string) ?? '',
    duration: (r.duration as string) ?? '',
    status: (r.status as string) ?? 'draft',
    createdAt: (r.created_at as string) ?? '',
  }));
}

async function fetchAnalytics(userId: string): Promise<AnalyticsSummary> {
  const { data } = await supabase
    .from('marketplace_items')
    .select('play_count, share_count')
    .eq('creator_id', userId)
    .eq('is_listed', true);

  const items = data ?? [];
  const totalPlays = items.reduce((s, r) => s + ((r as Record<string, unknown>).play_count as number ?? 0), 0);
  const totalShares = items.reduce((s, r) => s + ((r as Record<string, unknown>).share_count as number ?? 0), 0);

  // Credits earned = sum of share reward transactions
  const { data: txData } = await supabase
    .from('credit_transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('description', 'share_reward');

  const creditsEarned = (txData ?? []).reduce((s, r) => s + ((r as Record<string, unknown>).amount as number ?? 0), 0);

  return { totalPlays, totalShares, creditsEarned, publishedCount: items.length };
}

async function publishItem(contentItemId: string) {
  await fetch('/api/marketplace/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentItemId }),
  });
}

async function unpublishItem(marketplaceId: string) {
  await supabase.from('marketplace_items').update({ is_listed: false }).eq('id', marketplaceId);
}

export default function MarketplaceCreatorPage() {
  return (
    <CreatorGate>
      <CreatorDashboard />
    </CreatorGate>
  );
}

function CreatorDashboard() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [activeTab, setActiveTab] = useState<Tab>('published');
  const [published, setPublished] = useState<PublishedItem[]>([]);
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareTarget, setShareTarget] = useState<PublishedItem | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsLoading(false); return; }

    const [pub, dft, stats] = await Promise.all([
      fetchPublished(user.id),
      fetchDrafts(user.id),
      fetchAnalytics(user.id),
    ]);
    setPublished(pub);
    setDrafts(dft);
    setAnalytics(stats);
    setIsLoading(false);
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  const handlePublish = async (contentItemId: string) => {
    setPublishingId(contentItemId);
    await publishItem(contentItemId);
    await loadData();
    setPublishingId(null);
    setActiveTab('published');
  };

  const handleUnpublish = async (marketplaceId: string) => {
    await unpublishItem(marketplaceId);
    await loadData();
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'published', label: `Published${published.length > 0 ? ` (${published.length})` : ''}`, icon: <FileText size={15} /> },
    { id: 'drafts', label: `From Sanctuary${drafts.length > 0 ? ` (${drafts.length})` : ''}`, icon: <Plus size={15} /> },
    { id: 'analytics', label: 'Earnings & stats', icon: <BarChart3 size={15} /> },
  ];

  return (
    <PageShell intensity="medium">
      <PageContent>
        {/* Header */}
        <div style={{ marginBottom: spacing.xl }}>
          <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary, fontWeight: 300 }}>
            Creator Dashboard
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Publish your content, track reach, and earn credits when people share your work.
          </Typography>
        </div>

        {/* Analytics bar */}
        {analytics && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: spacing.md,
              marginBottom: spacing.xl,
            }}
          >
            {[
              { label: 'Published', value: analytics.publishedCount, icon: <FileText size={16} color={colors.accent.primary} />, color: colors.accent.primary },
              { label: 'Total plays', value: formatCount(analytics.totalPlays), icon: <Play size={16} color={CONTENT_TYPE_COLORS.meditation} />, color: CONTENT_TYPE_COLORS.meditation },
              { label: 'Total shares', value: formatCount(analytics.totalShares), icon: <Share2 size={16} color={CONTENT_TYPE_COLORS.ritual} />, color: CONTENT_TYPE_COLORS.ritual },
              { label: 'Credits earned', value: analytics.creditsEarned, icon: <Coins size={16} color="#f59e0b" />, color: '#f59e0b' },
            ].map(({ label, value, icon, color }) => (
              <div
                key={label}
                style={{
                  padding: spacing.lg,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  border: `1px solid ${colors.glass.border}`,
                  backdropFilter: BLUR.md,
                  WebkitBackdropFilter: BLUR.md,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                  {icon}
                  <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12 }}>{label}</Typography>
                </div>
                <Typography variant="h3" style={{ color, fontWeight: 700 }}>{value}</Typography>
              </div>
            ))}
          </motion.div>
        )}

        {/* Milestone progress — next goal for this creator */}
        {analytics && (
          <MilestoneBar analytics={analytics} colors={colors} />
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', marginBottom: spacing.xl }}>
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                padding: `${spacing.xs} ${spacing.md}`,
                borderRadius: borderRadius.full,
                border: `1px solid ${activeTab === id ? colors.accent.primary : colors.glass.border}`,
                background: activeTab === id ? colors.gradients.primary : 'transparent',
                color: activeTab === id ? colors.text.onDark : colors.text.secondary,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {isLoading ? (
          <div style={{ padding: spacing.xxl, textAlign: 'center' }}>
            <Loading variant="spinner" size="lg" />
          </div>
        ) : activeTab === 'published' ? (
          published.length === 0 ? (
            <EmptyState
              icon={<FileText size={32} color={colors.text.secondary} />}
              title="Nothing published yet"
              body="Go to the Sanctuary tab to publish your first piece of content."
              action={<button onClick={() => setActiveTab('drafts')} style={{ background: 'none', border: `1px solid ${colors.glass.border}`, borderRadius: borderRadius.full, padding: `${spacing.xs} ${spacing.md}`, cursor: 'pointer', color: colors.text.primary, fontSize: 14 }}>Browse Sanctuary content</button>}
              colors={colors}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              {published.map((item, index) => {
                const accent = CONTENT_TYPE_COLORS[item.type] ?? colors.accent.primary;
                return (
                  <motion.div
                    key={item.marketplaceId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    style={{
                      padding: spacing.xl,
                      borderRadius: borderRadius.lg,
                      background: colors.glass.light,
                      border: `1px solid ${colors.glass.border}`,
                      backdropFilter: BLUR.md,
                      WebkitBackdropFilter: BLUR.md,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: spacing.lg, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                          {React.createElement(getContentTypeIcon(item.type), { size: 16, color: accent, strokeWidth: 2.5 })}
                          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: accent }}>{item.type}</span>
                          {item.isElevated && <ElevatedBadge size="sm" />}
                        </div>
                        <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>{item.title}</Typography>
                        <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12 }}>Listed {formatDate(item.listedAt)}</Typography>
                      </div>

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: spacing.xl, alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginBottom: 2 }}>
                            <Play size={12} color={colors.text.secondary} />
                            <Typography variant="small" style={{ color: colors.text.primary, fontWeight: 700 }}>{formatCount(item.playCount)}</Typography>
                          </div>
                          <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 10 }}>plays</Typography>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginBottom: 2 }}>
                            <Share2 size={12} color={colors.text.secondary} />
                            <Typography variant="small" style={{ color: colors.text.primary, fontWeight: 700 }}>{formatCount(item.shareCount)}</Typography>
                          </div>
                          <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 10 }}>shares</Typography>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, marginBottom: 2 }}>
                            <Coins size={12} color="#f59e0b" />
                            <Typography variant="small" style={{ color: '#f59e0b', fontWeight: 700 }}>{item.shareCount}</Typography>
                          </div>
                          <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 10 }}>Q earned</Typography>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: spacing.sm, flexShrink: 0, alignItems: 'center' }}>
                        <button
                          onClick={() => setShareTarget(item)}
                          style={{
                            padding: `${spacing.xs} ${spacing.sm}`,
                            borderRadius: borderRadius.md,
                            border: `1px solid ${colors.glass.border}`,
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.xs,
                            color: colors.text.secondary,
                            fontSize: 13,
                          }}
                        >
                          <Share2 size={13} /> Share
                        </button>
                        <Link
                          href={`/marketplace/${item.contentItemId}`}
                          style={{
                            padding: `${spacing.xs} ${spacing.sm}`,
                            borderRadius: borderRadius.md,
                            border: `1px solid ${colors.glass.border}`,
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing.xs,
                            color: colors.text.secondary,
                            fontSize: 13,
                            textDecoration: 'none',
                          }}
                        >
                          <ExternalLink size={13} /> View
                        </Link>
                        <button
                          onClick={() => void handleUnpublish(item.marketplaceId)}
                          style={{
                            padding: `${spacing.xs} ${spacing.sm}`,
                            borderRadius: borderRadius.md,
                            border: `1px solid ${colors.glass.border}`,
                            background: 'transparent',
                            cursor: 'pointer',
                            color: colors.text.secondary,
                            fontSize: 13,
                          }}
                        >
                          Unpublish
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )
        ) : activeTab === 'drafts' ? (
          drafts.length === 0 ? (
            <EmptyState
              icon={<Plus size={32} color={colors.text.secondary} />}
              title="No sanctuary content yet"
              body="Create affirmations, meditations, or rituals in your Sanctuary, then publish them here."
              action={<Link href="/create" style={{ textDecoration: 'none' }}><Button variant="primary" size="md">Create content</Button></Link>}
              colors={colors}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                Your sanctuary content — publish to share with the community and earn credits when it&apos;s shared.
              </Typography>
              {drafts.map((item, index) => {
                const accent = CONTENT_TYPE_COLORS[item.type] ?? colors.accent.primary;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    style={{
                      padding: spacing.xl,
                      borderRadius: borderRadius.lg,
                      background: colors.glass.light,
                      border: `1px solid ${colors.glass.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.lg,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
                        {React.createElement(getContentTypeIcon(item.type), { size: 15, color: accent, strokeWidth: 2.5 })}
                        <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: accent }}>{item.type}</span>
                      </div>
                      <Typography variant="h4" style={{ color: colors.text.primary }}>{item.title}</Typography>
                      {item.duration && (
                        <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12 }}>{item.duration}</Typography>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => void handlePublish(item.id)}
                      disabled={publishingId === item.id}
                      style={{ backgroundColor: accent, borderColor: accent, flexShrink: 0 }}
                    >
                      {publishingId === item.id ? 'Publishing…' : 'Publish to Marketplace'}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          )
        ) : (
          /* Analytics tab */
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xl }}>
            {analytics && analytics.publishedCount > 0 ? (
              <>
                {/* Earnings highlight */}
                <div
                  style={{
                    padding: spacing.xl,
                    borderRadius: borderRadius.xl,
                    background: `linear-gradient(135deg, #f59e0b15, ${colors.glass.light})`,
                    border: `1px solid #f59e0b30`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
                    <Sparkles size={18} color="#f59e0b" />
                    <Typography variant="h3" style={{ color: colors.text.primary }}>How you earn</Typography>
                  </div>
                  <Typography variant="body" style={{ color: colors.text.secondary, lineHeight: 1.6, marginBottom: spacing.md }}>
                    Every time someone shares your content, you earn <strong style={{ color: '#f59e0b' }}>+1 Q (credit)</strong>.
                    Credits can be used to create new content.
                  </Typography>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.lg, flexWrap: 'wrap' }}>
                    <div>
                      <Typography variant="h2" style={{ color: '#f59e0b', fontWeight: 700 }}>{analytics.creditsEarned} Q</Typography>
                      <Typography variant="small" style={{ color: colors.text.secondary }}>Total credits earned</Typography>
                    </div>
                    <div>
                      <Typography variant="h2" style={{ color: '#34d399', fontWeight: 700 }}>{formatCount(analytics.totalShares)}</Typography>
                      <Typography variant="small" style={{ color: colors.text.secondary }}>Total shares</Typography>
                    </div>
                    <div>
                      <Typography variant="h2" style={{ color: CONTENT_TYPE_COLORS.meditation, fontWeight: 700 }}>{formatCount(analytics.totalPlays)}</Typography>
                      <Typography variant="small" style={{ color: colors.text.secondary }}>Total plays</Typography>
                    </div>
                  </div>
                </div>

                {/* Per-content breakdown */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
                    <TrendingUp size={16} color={colors.text.secondary} />
                    <Typography variant="h4" style={{ color: colors.text.primary }}>By content</Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                    {[...published].sort((a, b) => b.shareCount - a.shareCount).map((item) => {
                      const accent = CONTENT_TYPE_COLORS[item.type] ?? colors.accent.primary;
                      const shareBarWidth = published.length > 0 ? (item.shareCount / Math.max(...published.map((p) => p.shareCount), 1)) * 100 : 0;
                      return (
                        <div
                          key={item.marketplaceId}
                          style={{
                            padding: spacing.lg,
                            borderRadius: borderRadius.lg,
                            background: colors.glass.light,
                            border: `1px solid ${colors.glass.border}`,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm }}>
                            <div>
                              <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 500 }}>{item.title}</Typography>
                              <Typography variant="small" style={{ color: accent, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.type}</Typography>
                            </div>
                            <div style={{ display: 'flex', gap: spacing.lg, textAlign: 'right', flexShrink: 0 }}>
                              <div>
                                <Typography variant="small" style={{ color: '#f59e0b', fontWeight: 700 }}>{item.shareCount} Q</Typography>
                                <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 10 }}>earned</Typography>
                              </div>
                              <div>
                                <Typography variant="small" style={{ color: colors.text.primary, fontWeight: 700 }}>{formatCount(item.shareCount)}</Typography>
                                <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 10 }}>shares</Typography>
                              </div>
                              <div>
                                <Typography variant="small" style={{ color: colors.text.primary, fontWeight: 700 }}>{formatCount(item.playCount)}</Typography>
                                <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 10 }}>plays</Typography>
                              </div>
                            </div>
                          </div>
                          {/* Share bar */}
                          <div style={{ height: 3, borderRadius: 2, background: colors.glass.border }}>
                            <div style={{ height: '100%', borderRadius: 2, background: accent, width: `${shareBarWidth}%`, transition: 'width 0.5s ease' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                icon={<BarChart3 size={32} color={colors.text.secondary} />}
                title="No analytics yet"
                body="Publish content and share it to see your stats and earnings here."
                action={<button onClick={() => setActiveTab('drafts')} style={{ background: 'none', border: `1px solid ${colors.glass.border}`, borderRadius: borderRadius.full, padding: `${spacing.xs} ${spacing.md}`, cursor: 'pointer', color: colors.text.primary, fontSize: 14 }}>Publish content</button>}
                colors={colors}
              />
            )}
          </div>
        )}
      </PageContent>

      {shareTarget && (
        <ShareModal
          isOpen={!!shareTarget}
          onClose={() => setShareTarget(null)}
          contentId={shareTarget.contentItemId}
          title={shareTarget.title}
          contentType={shareTarget.type}
          onShare={() => {
            setPublished((prev) =>
              prev.map((i) => i.marketplaceId === shareTarget.marketplaceId ? { ...i, shareCount: i.shareCount + 1 } : i),
            );
          }}
        />
      )}
    </PageShell>
  );
}

const MILESTONES = [
  { shares: 5, label: '5 shares — Founding spark', bonus: '+5 bonus Qs' },
  { shares: 25, label: '25 shares — Community voice', bonus: '+15 bonus Qs' },
  { shares: 100, label: '100 shares — Rising creator', bonus: '+50 bonus Qs' },
  { shares: 500, label: '500 shares — Marketplace featured', bonus: 'Elevated placement' },
];

function MilestoneBar({ analytics, colors }: { analytics: AnalyticsSummary; colors: Record<string, unknown> }) {
  const totalShares = analytics.totalShares;
  const next = MILESTONES.find((m) => m.shares > totalShares);
  const prev = [...MILESTONES].reverse().find((m) => m.shares <= totalShares);

  if (!next) return null;

  const base = prev?.shares ?? 0;
  const progress = Math.min(((totalShares - base) / (next.shares - base)) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        background: `linear-gradient(135deg, ${(colors.accent as Record<string, string>).primary}08, ${(colors.glass as Record<string, string>).light})`,
        border: `1px solid ${(colors.accent as Record<string, string>).primary}25`,
        marginBottom: spacing.xl,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
        <Trophy size={16} color={(colors.accent as Record<string, string>).tertiary} />
        <Typography variant="small" style={{ color: (colors.text as Record<string, string>).secondary, fontWeight: 600 }}>
          Next milestone
        </Typography>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: (colors.text as Record<string, string>).secondary, opacity: 0.6 }}>
          {totalShares} / {next.shares} shares
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: (colors.glass as Record<string, string>).border, marginBottom: spacing.sm }}>
        <div
          style={{
            height: '100%',
            borderRadius: 2,
            background: (colors.gradients as Record<string, string>).primary,
            width: `${progress}%`,
            transition: 'width 0.8s ease',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="small" style={{ color: (colors.text as Record<string, string>).primary, fontWeight: 500, fontSize: 13 }}>
          {next.label}
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Zap size={12} color="#f59e0b" />
          <Typography variant="small" style={{ color: '#f59e0b', fontWeight: 600, fontSize: 12 }}>
            {next.bonus}
          </Typography>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({
  icon, title, body, action, colors,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action: React.ReactNode;
  colors: Record<string, unknown>;
}) {
  return (
    <Card
      variant="default"
      style={{
        padding: (colors.spacing as Record<string, unknown>)?.xxl as number ?? 40,
        textAlign: 'center',
        background: (colors.glass as Record<string, string>)?.light,
        backdropFilter: BLUR.md,
        WebkitBackdropFilter: BLUR.md,
        border: `1px solid ${(colors.glass as Record<string, string>)?.border}`,
      }}
    >
      <div
        style={{
          width: 64, height: 64, borderRadius: '50%',
          background: (colors.glass as Record<string, string>)?.light,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto', marginBottom: 24,
        }}
      >
        {icon}
      </div>
      <Typography variant="h3" style={{ marginBottom: 8, color: (colors.text as Record<string, string>)?.primary }}>{title}</Typography>
      <Typography variant="body" style={{ marginBottom: 24, color: (colors.text as Record<string, string>)?.secondary }}>{body}</Typography>
      {action}
    </Card>
  );
}
