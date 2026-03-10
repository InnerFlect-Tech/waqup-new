'use client';

import React, { useState, useMemo } from 'react';
import { Typography, Button, Badge, Loading } from '@/components';
import { spacing, borderRadius, GRID_CARD_MIN, SEARCH_INPUT_MAX_WIDTH, BLUR } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import { Link } from '@/i18n/navigation';
import {
  Music,
  Sparkles,
  Wind,
  Library as LibraryIcon,
  Play,
  Mic,
  Bot,
  Clock,
  Calendar,
  Plus,
  RefreshCw,
  Share2,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { getContentDetailHref } from '@/components/content';
import type { ContentItem } from '@waqup/shared/types';
import { getContentTypeIcon } from '@/lib';
import { getContentTypeBadgeVariant } from '@waqup/shared/utils';
import { useContent } from '@/hooks';
import { ShareModal } from '@/components/marketplace';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';

type ContentTypeFilter = 'all' | 'ritual' | 'affirmation' | 'meditation';
type SortOrder = 'recent' | 'most_played';

const FILTERS: { id: ContentTypeFilter; label: string; icon: typeof Music }[] = [
  { id: 'all', label: 'All', icon: LibraryIcon },
  { id: 'affirmation', label: 'Affirmations', icon: Sparkles },
  { id: 'meditation', label: 'Meditations', icon: Wind },
  { id: 'ritual', label: 'Rituals', icon: Music },
];

const TYPE_COLOR: Record<ContentTypeFilter, string> = {
  all: '',
  ...CONTENT_TYPE_COLORS,
};

function formatDate(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function TodaysPractice({
  item,
  colors,
  allCount,
}: {
  item: ContentItem | undefined;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
  allCount: number;
}) {
  if (!item?.id || !item?.type) return null;

  const typeColor = TYPE_COLOR[item.type as ContentTypeFilter] ?? colors.accent.primary;
  const detailHref = getContentDetailHref(item.type, item.id);

  return (
    <div style={{ marginBottom: spacing.xl }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
        <Flame size={14} color="#f97316" />
        <Typography variant="small" style={{ color: colors.text.secondary, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 11 }}>
          Today&apos;s practice
        </Typography>
      </div>
      <Link href={detailHref} style={{ textDecoration: 'none' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: `linear-gradient(135deg, ${typeColor}12, ${colors.glass.light})`,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${typeColor}35`,
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            boxShadow: `0 8px 32px ${typeColor}20`,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: borderRadius.lg,
              background: `${typeColor}25`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {React.createElement(getContentTypeIcon(item.type), { size: 24, color: typeColor, strokeWidth: 2 })}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h3" style={{ color: colors.text.primary, fontWeight: 500, marginBottom: 2 }}>
              {item.title ?? 'Untitled'}
            </Typography>
            <Typography variant="small" style={{ color: typeColor, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {item.type}
              {item.duration ? ` · ${item.duration}` : ''}
            </Typography>
            {allCount > 1 && (
              <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11, marginTop: 2 }}>
                {allCount - 1} more in your library
              </Typography>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexShrink: 0 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: borderRadius.full,
                background: typeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 16px ${typeColor}50`,
              }}
            >
              <Play size={18} color="#fff" strokeWidth={2} style={{ marginLeft: 2 }} />
            </div>
            <ChevronRight size={16} color={colors.text.secondary} />
          </div>
        </div>
      </Link>
    </div>
  );
}

function ContentCard({
  item,
  colors,
  onShare,
}: {
  item: ContentItem;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
  onShare?: (item: ContentItem) => void;
}) {
  if (!item?.id || !item?.type) return null;
  const typeColor = TYPE_COLOR[item.type as ContentTypeFilter] ?? colors.accent.primary;
  const detailHref = getContentDetailHref(item.type, item.id);

  return (
    <Link href={detailHref} style={{ textDecoration: 'none' }}>
      <div
        className="library-card"
        style={{
          position: 'relative',
          borderRadius: borderRadius.xl,
          background: colors.glass.light,
          backdropFilter: BLUR.xl,
          WebkitBackdropFilter: BLUR.xl,
          border: `1px solid ${colors.glass.border}`,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          aspectRatio: '16/9',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: spacing.lg,
        }}
      >
        {/* Ambient glow based on type */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `${typeColor}18`,
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />

        {/* Top row: badge + icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
            <Badge variant={getContentTypeBadgeVariant(item.type)} size="sm">
              {item.type}
            </Badge>
            {item.status === 'draft' && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: `${spacing.xs} ${spacing.sm}`,
                  borderRadius: borderRadius.full,
                  background: `${colors.warning}20`,
                  border: `1px solid ${colors.warning}30`,
                  fontSize: '10px',
                  color: colors.warning,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase' as const,
                }}
              >
                Draft
              </div>
            )}
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: borderRadius.full,
              background: `${typeColor}20`,
              border: `1px solid ${typeColor}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {React.createElement(getContentTypeIcon(item.type), { size: 16, color: typeColor, strokeWidth: 2 })}
          </div>
        </div>

        {/* Title + description */}
        <div style={{ flex: 1, padding: `${spacing.sm} 0`, position: 'relative', zIndex: 1 }}>
          <Typography
            variant="h4"
            style={{
              color: colors.text.primary,
              fontWeight: 500,
              marginBottom: spacing.xs,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
              lineHeight: 1.4,
            }}
          >
            {item.title}
          </Typography>
          {item.description && (
            <Typography
              variant="caption"
              style={{
                color: colors.text.secondary,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
                lineHeight: 1.5,
              }}
            >
              {item.description}
            </Typography>
          )}
        </div>

        {/* Bottom metadata row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1,
            flexWrap: 'wrap',
            gap: spacing.xs,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
            {item.frequency && (
              <span
                style={{ fontSize: '11px', fontWeight: 600, color: typeColor, letterSpacing: '0.03em' }}
              >
                {item.frequency}
              </span>
            )}
            {item.frequency && item.duration && (
              <span style={{ fontSize: '11px', color: colors.text.secondary }}>·</span>
            )}
            {item.duration && (
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                <Clock size={10} color={colors.text.secondary} strokeWidth={2} />
                <span style={{ fontSize: '11px', color: colors.text.secondary }}>{item.duration}</span>
              </div>
            )}
            {item.voiceType && (
              <>
                <span style={{ fontSize: '11px', color: colors.text.secondary }}>·</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  {item.voiceType === 'ai' ? (
                    <Bot size={10} color={colors.accent.secondary} strokeWidth={2} />
                  ) : (
                    <Mic size={10} color={colors.accent.primary} strokeWidth={2} />
                  )}
                  <span
                    style={{
                      fontSize: '11px',
                      color: item.voiceType === 'ai' ? colors.accent.secondary : colors.accent.primary,
                    }}
                  >
                    {item.voiceType === 'ai' ? 'AI voice' : 'My voice'}
                  </span>
                </div>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            {typeof item.playCount === 'number' && item.playCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                <Play size={10} color={colors.text.secondary} strokeWidth={2} />
                <span style={{ fontSize: '11px', color: colors.text.secondary }}>{item.playCount}</span>
              </div>
            )}
            {(item.createdAt || item.lastPlayed) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                <Calendar size={10} color={colors.text.secondary} strokeWidth={2} />
                <span style={{ fontSize: '11px', color: colors.text.secondary }}>
                  {item.lastPlayed
                    ? `Played ${formatDate(item.lastPlayed)}`
                    : formatDate(item.createdAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hover overlay */}
        <div
          className="library-card-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
            borderRadius: borderRadius.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.md,
            opacity: 0,
            transition: 'opacity 0.25s ease',
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: borderRadius.full,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: BLUR.sm,
              WebkitBackdropFilter: BLUR.sm,
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${typeColor}50`,
              pointerEvents: 'none',
            }}
          >
            <Play size={22} color="#fff" strokeWidth={2} style={{ marginLeft: spacing.xs }} />
          </div>
          {onShare && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onShare(item); }}
              style={{
                width: 40,
                height: 40,
                borderRadius: borderRadius.full,
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: BLUR.sm,
                WebkitBackdropFilter: BLUR.sm,
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Share to marketplace"
            >
              <Share2 size={16} color="#fff" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

function CreateCard({
  colors,
}: {
  colors: ReturnType<typeof useTheme>['theme']['colors'];
}) {
  return (
    <Link href="/create" style={{ textDecoration: 'none' }}>
      <div
        className="library-card"
        style={{
          position: 'relative',
          borderRadius: borderRadius.xl,
          background: 'transparent',
          border: `2px dashed ${colors.glass.border}`,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, border-color 0.2s ease',
          aspectRatio: '16/9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.lg,
          gap: spacing.md,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: borderRadius.full,
            background: colors.gradients.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 16px ${colors.accent.primary}50`,
          }}
        >
          <Plus size={22} color="#fff" strokeWidth={2.5} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Typography
            variant="h4"
            style={{ color: colors.text.primary, fontWeight: 500, marginBottom: spacing.xs }}
          >
            Create New
          </Typography>
          <Typography variant="caption" style={{ color: colors.text.secondary }}>
            Add a new affirmation, meditation, or ritual
          </Typography>
        </div>
      </div>
    </Link>
  );
}

export default function LibraryPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [typeFilter, setTypeFilter] = useState<ContentTypeFilter>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);
  const [sharingItem, setSharingItem] = useState<ContentItem | null>(null);
  const { items: allContent, isLoading, error, refetch } = useContent();

  const handleSeed = async () => {
    setSeedLoading(true);
    setSeedError(null);
    try {
      const res = await fetch('/api/dev/seed', { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        await refetch();
      } else {
        setSeedError(json.error || 'Failed to add example content');
      }
    } catch {
      setSeedError('Failed to add example content');
    } finally {
      setSeedLoading(false);
    }
  };

  const filteredContent = useMemo(() => {
    const validItems = allContent.filter((item) => item?.id && item?.type);
    const filtered = validItems.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (searchQuery && !(item.title ?? '').toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    if (sortOrder === 'most_played') {
      return [...filtered].sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0));
    }
    return [...filtered].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
  }, [allContent, typeFilter, searchQuery, sortOrder]);

  return (
    <PageShell intensity="medium">
      <PageContent>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: spacing.lg,
            marginBottom: spacing.lg,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <Typography
              variant="h1"
              style={{ marginBottom: spacing.xs, color: colors.text.primary, fontWeight: 300 }}
            >
              Your Library
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              {allContent.length > 0
                ? `${allContent.length} creation${allContent.length !== 1 ? 's' : ''} in your library`
                : 'All your rituals and affirmations in one place'}
            </Typography>
          </div>
          <Link href="/create" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Button
              variant="primary"
              size="md"
              style={{
                background: colors.gradients.primary,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Create New
            </Button>
          </Link>
        </div>

        {/* Today's Practice — pinned to top when library has content */}
        {allContent.length > 0 && (
          <TodaysPractice
            item={allContent.find((i) => i.lastPlayed) ?? allContent[0]}
            colors={colors}
            allCount={allContent.length}
          />
        )}

        {/* Filters + search */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing.sm,
            marginBottom: spacing.md,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
            {FILTERS.map(({ id, label, icon: Icon }) => {
              const isActive = typeFilter === id;
              const accent = TYPE_COLOR[id] || colors.accent.primary;
              const count = id !== 'all' ? allContent.filter((i) => i.type === id).length : 0;
              return (
                <button
                  key={id}
                  onClick={() => setTypeFilter(id)}
                  style={{
                    padding: `${spacing.xs} ${spacing.md}`,
                    borderRadius: borderRadius.full,
                    border: `1px solid ${isActive ? accent : colors.glass.border}`,
                    background: isActive ? `${accent}20` : colors.glass.light,
                    backdropFilter: BLUR.md,
                    WebkitBackdropFilter: BLUR.md,
                    color: isActive ? accent : colors.text.secondary,
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                  }}
                >
                  <Icon
                    size={13}
                    color={isActive ? accent : colors.text.secondary}
                    strokeWidth={2.5}
                  />
                  {label}
                  {count > 0 && (
                    <span
                      style={{
                        fontSize: '11px',
                        color: isActive ? accent : colors.text.secondary,
                        borderRadius: borderRadius.full,
                        padding: `0 ${spacing.xs}`,
                      }}
                    >
                      {count}
                    </span>
              )}
            </button>
              );
            })}
            </div>

            {/* Sort */}
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs, flexShrink: 0 }}>
              {(['recent', 'most_played'] as SortOrder[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortOrder(s)}
                  style={{
                    padding: `${spacing.xs} ${spacing.sm}`,
                    borderRadius: borderRadius.full,
                    border: `1px solid ${sortOrder === s ? colors.accent.primary : colors.glass.border}`,
                    background: sortOrder === s ? `${colors.accent.primary}15` : 'transparent',
                    color: sortOrder === s ? colors.accent.tertiary : colors.text.secondary,
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {s === 'recent' ? 'Recent' : 'Most played'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ maxWidth: SEARCH_INPUT_MAX_WIDTH }}>
            <input
              type="text"
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: `${spacing.sm} ${spacing.md}`,
                borderRadius: borderRadius.lg,
                border: `1px solid ${colors.glass.border}`,
                background: colors.glass.light,
                backdropFilter: BLUR.md,
                WebkitBackdropFilter: BLUR.md,
                fontSize: '14px',
                color: colors.text.primary,
                outline: 'none',
                boxSizing: 'border-box' as const,
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: `${spacing.xl} 0` }}>
            <Loading variant="spinner" size="lg" />
          </div>
        ) : error ? (
          <div
            style={{
              padding: spacing.xl,
              textAlign: 'center',
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.error }}>
              Failed to load library
            </Typography>
            <Typography
              variant="body"
              style={{ marginBottom: spacing.lg, color: colors.text.secondary }}
            >
              {error}
            </Typography>
            <Button
              variant="primary"
              style={{
                background: colors.gradients.primary,
                display: 'inline-flex',
                alignItems: 'center',
                gap: spacing.xs,
              }}
              onClick={refetch}
            >
              <RefreshCw size={14} strokeWidth={2} />
              Try again
            </Button>
          </div>
        ) : filteredContent.length === 0 && allContent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: `${spacing.xl} 0` }}>
            <LibraryIcon
              size={56}
              color={colors.accent.primary}
              strokeWidth={1}
              style={{ marginBottom: spacing.lg, opacity: 0.4 }}
            />
            <Typography
              variant="h3"
              style={{ color: colors.text.primary, fontWeight: 300, marginBottom: spacing.sm }}
            >
              Your library is empty
            </Typography>
            <Typography
              variant="body"
              style={{
                color: colors.text.secondary,
                marginBottom: spacing.xl,
                maxWidth: 360,
                margin: `0 auto ${spacing.xl}`,
              }}
            >
              Create your first affirmation, meditation, or ritual to start your transformation.
            </Typography>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.md }}>
              <Link href="/sanctuary/affirmations/create/init" style={{ textDecoration: 'none' }}>
                <Button
                  variant="primary"
                  size="md"
                  style={{
                    background: colors.gradients.primary,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing.xs,
                  }}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Create your first affirmation
                </Button>
              </Link>
              {process.env.NODE_ENV === 'development' && (
                <>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={handleSeed}
                    disabled={seedLoading}
                    style={{
                      borderColor: colors.glass.border,
                      color: colors.text.secondary,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                    }}
                  >
                    {seedLoading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                        Adding...
                      </>
                    ) : (
                      <>Add example content</>
                    )}
                  </Button>
                  {seedError && (
                    <Typography variant="caption" style={{ color: colors.error, maxWidth: 320, textAlign: 'center' }}>
                      {seedError}
                    </Typography>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${GRID_CARD_MIN}, 1fr))`,
              gap: spacing.lg,
            }}
          >
            <CreateCard colors={colors} />
            {filteredContent.map((item) => (
              <ContentCard key={item.id} item={item} colors={colors} onShare={(i) => setSharingItem(i)} />
            ))}
          </div>
        )}

        {!isLoading && !error && filteredContent.length === 0 && allContent.length > 0 && (
          <div
            style={{
              padding: spacing.xl,
              textAlign: 'center',
              borderRadius: borderRadius.xl,
              background: colors.glass.light,
              backdropFilter: BLUR.xl,
              WebkitBackdropFilter: BLUR.xl,
              border: `1px solid ${colors.glass.border}`,
              marginTop: spacing.lg,
            }}
          >
            <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.sm }}>
              No results
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              {searchQuery ? `Nothing matches "${searchQuery}"` : `No ${typeFilter}s yet`}
            </Typography>
          </div>
        )}

        {sharingItem && (
          <ShareModal
            isOpen
            onClose={() => setSharingItem(null)}
            contentId={sharingItem.id}
            title={sharingItem.title}
            contentType={sharingItem.type}
          />
        )}

        <style>{`
          .library-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.3);
            border-color: rgba(255,255,255,0.2) !important;
          }
          .library-card:hover .library-card-overlay {
            opacity: 1 !important;
          }
        `}</style>
      </PageContent>
    </PageShell>
  );
}
