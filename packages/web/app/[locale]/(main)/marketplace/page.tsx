'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Typography, Button, Badge } from '@/components';
import { PageShell, PageContent } from '@/components';
import { Link } from '@/i18n/navigation';
import { Play, Clock, Share2, TrendingUp, Zap } from 'lucide-react';
import { spacing, borderRadius, BLUR } from '@/theme';
import { GRID_CARD_MIN, SEARCH_INPUT_MAX_WIDTH } from '@/theme';
import { useTheme } from '@/theme';
import { getContentTypeIcon } from '@/lib';
import { ElevatedBadge, ShareModal } from '@/components/marketplace';
import type { SharePlatform } from '@/components/marketplace';
import { getMarketplaceItems } from '@/lib/api-client';
import type { MarketplaceItem } from '@/lib/api-client';
import { CONTENT_TYPE_COLORS, ELEVATED_BADGE_COLOR, ELEVATED_BADGE_COLOR_SECONDARY } from '@waqup/shared/constants';
import { withOpacity } from '@waqup/shared/theme';

const TYPE_COLORS: Record<string, string> = CONTENT_TYPE_COLORS;

const SORT_OPTIONS = [
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'recent', label: 'Recent', icon: Zap },
  { id: 'top', label: 'Most played', icon: Play },
] as const;

type SortId = 'trending' | 'recent' | 'top';

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function MarketplacePage() {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [filter, setFilter] = useState<'all' | 'affirmation' | 'ritual' | 'meditation'>('all');
  const [sort, setSort] = useState<SortId>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [elevatedItems, setElevatedItems] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareTarget, setShareTarget] = useState<MarketplaceItem | null>(null);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    const [all, elevated] = await Promise.all([
      getMarketplaceItems({ type: filter === 'all' ? undefined : filter, sort }),
      filter === 'all' ? getMarketplaceItems({ elevated: true, sort: 'trending' }) : Promise.resolve([]),
    ]);
    setItems(all);
    setElevatedItems(elevated);
    setIsLoading(false);
  }, [filter, sort]);

  useEffect(() => { void loadItems(); }, [loadItems]);

  const filteredItems = searchQuery
    ? items.filter((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  const showElevated = filter === 'all' && !searchQuery && elevatedItems.length > 0;
  const uniqueCreators = new Set(items.map((i) => i.creatorId)).size;

  return (
    <PageShell intensity="medium" allowDocumentScroll>
      <PageContent>
        {/* Hero */}
        <div style={{ marginBottom: spacing.xxl }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.xl }}>
            <div>
              <Typography variant="h1" style={{ marginBottom: spacing.sm, color: colors.text.primary, fontWeight: 300 }}>
                Affirmations, meditations & rituals that actually work
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
                Listen. Practice. Transform — from the waQup community.
              </Typography>
              {items.length > 0 && (
                <Typography variant="small" style={{ color: colors.text.tertiary, fontSize: 13 }}>
                  {uniqueCreators} creators · {items.length}+ practices
                </Typography>
              )}
            </div>
            <Link href="/marketplace/creator" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <Button variant="outline" size="md">Creator Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Elevated section */}
        {showElevated && (
          <div style={{ marginBottom: spacing.xxl }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg }}>
              <ElevatedBadge size="md" />
              <Typography
                variant="small"
                style={{ color: colors.text.secondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}
              >
                Curated by waQup
              </Typography>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gridAutoRows: 'minmax(220px, 1fr)',
                gap: spacing.lg,
              }}
            >
              {elevatedItems.map((item, index) => {
                const accent = TYPE_COLORS[item.type] ?? colors.accent.primary;
                return (
                  <Link key={item.id} href={`/marketplace/${item.contentItemId}`} style={{ textDecoration: 'none' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ y: -4, boxShadow: `0 12px 40px ${accent}25` }}
                      style={{
                        borderRadius: borderRadius.xl,
                        background: colors.glass.light,
                        backdropFilter: BLUR.xl,
                        WebkitBackdropFilter: BLUR.xl,
                        border: `1px solid ${accent}40`,
                        boxShadow: `0 8px 32px ${accent}20`,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                      }}
                    >
                      {/* Image slot — accent gradient */}
                      <div
                        style={{
                          height: 80,
                          background: `linear-gradient(135deg, ${accent}40, ${accent}15)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Play size={28} color={accent} strokeWidth={2} style={{ opacity: 0.9 }} />
                      </div>
                      <div style={{ padding: spacing.lg, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                            {React.createElement(getContentTypeIcon(item.type), { size: 16, color: accent, strokeWidth: 2.5 })}
                            <Badge size="sm" variant="default" style={{ color: accent, background: `${accent}20`, border: 'none' }}>
                              {item.type}
                            </Badge>
                          </div>
                          <ElevatedBadge size="sm" />
                        </div>
                        <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                          {item.title}
                        </Typography>
                        <Typography variant="small" style={{ color: colors.text.secondary, flex: 1, lineHeight: 1.5 }}>
                          {item.description}
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                            {item.duration && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={11} color={colors.text.secondary} />
                                <Typography variant="small" style={{ color: colors.text.secondary }}>{item.duration}</Typography>
                              </span>
                            )}
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Share2 size={11} color={colors.text.secondary} />
                              <Typography variant="small" style={{ color: colors.text.secondary }}>{formatCount(item.shareCount)} shares</Typography>
                            </span>
                          </div>
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShareTarget(item); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.xs, color: accent }}
                          >
                            <Share2 size={15} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Browse — filters + sort + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap', marginBottom: spacing.xl }}>
          <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
            {(['all', 'affirmation', 'meditation', 'ritual'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  borderRadius: borderRadius.full,
                  border: `1px solid ${filter === f ? colors.accent.primary : colors.glass.border}`,
                  background: filter === f ? colors.gradients.primary : 'transparent',
                  color: filter === f ? colors.text.onDark : colors.text.secondary,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: spacing.xs }}>
            {SORT_OPTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSort(id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: `${spacing.xs} ${spacing.sm}`,
                  borderRadius: borderRadius.full,
                  border: `1px solid ${sort === id ? colors.accent.secondary ?? colors.accent.primary : colors.glass.border}`,
                  background: sort === id ? `${colors.accent.primary}15` : 'transparent',
                  color: sort === id ? colors.accent.primary : colors.text.secondary,
                  fontSize: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              maxWidth: SEARCH_INPUT_MAX_WIDTH,
              padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: borderRadius.full,
              border: `1px solid ${colors.glass.border}`,
              background: colors.glass.light,
              fontSize: 14,
              color: colors.text.primary,
              outline: 'none',
            }}
          />
        </div>

        {/* All items grid */}
        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${GRID_CARD_MIN}, 1fr))`, gap: spacing.lg }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 200,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  border: `1px solid ${colors.glass.border}`,
                  opacity: 0.5,
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${GRID_CARD_MIN}, 1fr))`,
              gridAutoRows: 'minmax(200px, 1fr)',
              gap: spacing.lg,
            }}
          >
            {filteredItems.map((item, index) => {
              const accent = TYPE_COLORS[item.type] ?? colors.accent.primary;
              return (
                <Link key={item.id} href={`/marketplace/${item.contentItemId}`} style={{ textDecoration: 'none' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ y: -4, boxShadow: `0 8px 24px ${accent}15` }}
                    style={{
                      borderRadius: borderRadius.lg,
                      background: colors.glass.light,
                      backdropFilter: BLUR.lg,
                      WebkitBackdropFilter: BLUR.lg,
                      border: `1px solid ${item.isElevated ? accent + '40' : colors.glass.border}`,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      position: 'relative',
                    }}
                  >
                    {/* Image slot — accent gradient + play affordance */}
                    <div
                      style={{
                        height: 64,
                        background: item.isElevated
                          ? `linear-gradient(180deg, ${withOpacity(ELEVATED_BADGE_COLOR, 0.4)} 0%, ${withOpacity(ELEVATED_BADGE_COLOR_SECONDARY, 0.15)} 100%)`
                          : `linear-gradient(135deg, ${accent}30, ${accent}08)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {item.isElevated && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            background: `linear-gradient(90deg, ${ELEVATED_BADGE_COLOR}, ${ELEVATED_BADGE_COLOR_SECONDARY})`,
                          }}
                        />
                      )}
                      <Play size={22} color={accent} strokeWidth={2} style={{ opacity: 0.85 }} />
                    </div>
                    <div style={{ padding: spacing.lg, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                          {React.createElement(getContentTypeIcon(item.type), { size: 14, color: accent, strokeWidth: 2.5 })}
                          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: accent }}>
                            {item.type}
                          </span>
                        </div>
                        {item.isElevated && <ElevatedBadge size="sm" />}
                      </div>
                      <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                        {item.title}
                      </Typography>
                      <Typography variant="small" style={{ color: colors.text.secondary, flex: 1, lineHeight: 1.5 }}>
                        {item.description}
                      </Typography>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                          {item.duration && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock size={10} color={colors.text.secondary} />
                              <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11 }}>{item.duration}</Typography>
                            </span>
                          )}
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Play size={10} color={colors.text.secondary} />
                            <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11 }}>{formatCount(item.playCount)}</Typography>
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Share2 size={10} color={colors.text.secondary} />
                            <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11 }}>{formatCount(item.shareCount)}</Typography>
                          </span>
                        </div>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShareTarget(item); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: spacing.xs, color: accent }}
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: spacing.xxl,
              textAlign: 'center',
              borderRadius: borderRadius.xl,
              border: `1px solid ${colors.glass.border}`,
              background: colors.glass.light,
            }}
          >
            <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
              {searchQuery ? 'No results found' : 'Nothing here yet'}
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              {searchQuery ? 'Try a different search or filter.' : 'Be the first to publish your content.'}
            </Typography>
            {!searchQuery && (
              <Link href="/marketplace/creator" style={{ textDecoration: 'none', display: 'inline-block', marginTop: spacing.lg }}>
                <Button variant="primary" size="md">Publish content</Button>
              </Link>
            )}
          </div>
        )}

        {/* Creator CTA */}
        <div
          style={{
            marginTop: spacing.xxl,
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: `${colors.accent.primary}08`,
            border: `1px solid ${colors.accent.primary}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.lg,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
              Create once. Earn when they share.
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 14 }}>
              Publish your affirmations, meditations, or rituals. Every share earns you Qs to create more.
            </Typography>
          </div>
          <Link href="/marketplace/creator" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Button variant="outline" size="md">Creator Dashboard</Button>
          </Link>
        </div>

        {/* Final CTA */}
        <div
          style={{
            marginTop: spacing.xl,
            padding: spacing.xxl,
            textAlign: 'center',
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            border: `1px solid ${colors.glass.border}`,
          }}
        >
          <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.md, fontWeight: 400 }}>
            Ready to transform your mind?
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.lg }}>
            Pick a practice above and hit play — or create your own.
          </Typography>
          <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/create" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md">Create content</Button>
            </Link>
            <Link href="/library" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="md">My Library</Button>
            </Link>
          </div>
        </div>
      </PageContent>

      {/* Share modal */}
      {shareTarget && (
        <ShareModal
          isOpen={!!shareTarget}
          onClose={() => setShareTarget(null)}
          contentId={shareTarget.contentItemId}
          title={shareTarget.title}
          contentType={shareTarget.type}
          onShare={(_platform: SharePlatform) => {
            setItems((prev) =>
              prev.map((i) =>
                i.id === shareTarget.id ? { ...i, shareCount: i.shareCount + 1 } : i,
              ),
            );
          }}
        />
      )}
    </PageShell>
  );
}
