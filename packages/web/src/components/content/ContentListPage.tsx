'use client';

import React, { useState, useEffect } from 'react';
import { Typography, Button, Badge, Loading } from '@/components';
import { spacing, borderRadius, BLUR } from '@/theme';
import { GRID_CARD_MIN, SEARCH_INPUT_MAX_WIDTH } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import { Link } from '@/i18n/navigation';
import { Play, Mic, Bot, Clock, Calendar, Plus, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ContentItem, ContentItemType } from './ContentItem';
import { getContentDetailHref } from './getContentDetailHref';
import { getContentTypeIcon } from '@/lib/content-helpers';
import { getContentTypeBadgeVariant, getContentDisplayInfo, formatDate } from '@waqup/shared/utils';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import { withOpacity } from '@waqup/shared/theme';

const formatDateShort = (iso?: string | null) =>
  formatDate(iso, { includeYear: false, fallback: '' });

export interface ContentListPageProps {
  title: string;
  description: string;
  contentType: ContentItemType;
  createHref: string;
  backHref: string;
  content: ContentItem[];
  createLabel?: string;
  /** When true, create action only in header; no create card in grid */
  createInHeaderOnly?: boolean;
  /** When set, show a "Continue listening" row above the grid */
  continueListeningItem?: ContentItem | null;
  /** Use display-title layer (clean titles, draft labels); default true for affirmations */
  useDisplayTitle?: boolean;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Subtitle for create card when in grid */
  createCardSubtitle?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const TYPE_COLOR: Record<ContentItemType, string> = CONTENT_TYPE_COLORS;

function ContinueListeningRow({
  item,
  colors,
  contentType,
  useDisplayTitle,
}: {
  item: ContentItem;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
  contentType: ContentItemType;
  useDisplayTitle?: boolean;
}) {
  const typeColor = TYPE_COLOR[item.type] ?? colors.accent.primary;
  const displayInfo = useDisplayTitle
    ? getContentDisplayInfo({
        title: item.title,
        description: item.description,
        script: item.script,
        status: item.status ?? undefined,
        voiceUrl: item.voiceUrl,
        audioUrl: item.audioUrl,
      })
    : null;
  const title = displayInfo?.displayTitle ?? item.title ?? 'Untitled';
  const detailHref = getContentDetailHref(item.type, item.id);

  return (
    <div style={{ marginBottom: spacing.xl }}>
      <Typography
        variant="small"
        style={{
          color: colors.text.secondary,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontSize: 11,
          marginBottom: spacing.sm,
        }}
      >
        Continue listening
      </Typography>
      <Link href={detailHref} style={{ textDecoration: 'none' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.lg,
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: `linear-gradient(135deg, ${typeColor}15, ${colors.glass.light})`,
            backdropFilter: BLUR.xl,
            WebkitBackdropFilter: BLUR.xl,
            border: `1px solid ${typeColor}40`,
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: `0 8px 32px ${typeColor}25`,
            overflow: 'hidden',
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
            {React.createElement(getContentTypeIcon(item.type), {
              size: 24,
              color: typeColor,
              strokeWidth: 2,
            })}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h3"
              style={{ color: colors.text.primary, fontWeight: 500, marginBottom: 2 }}
            >
              {title}
            </Typography>
            <Typography
              variant="small"
              style={{
                color: typeColor,
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {item.type}
              {item.duration ? ` · ${item.duration}` : ''}
            </Typography>
          </div>
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
              flexShrink: 0,
            }}
          >
            <Play size={18} color={colors.text.onDark} strokeWidth={2} style={{ marginLeft: 2 }} />
          </div>
          <ChevronRight size={16} color={colors.text.secondary} />
        </div>
      </Link>
    </div>
  );
}

function ContentCard({
  item,
  colors,
  useDisplayTitle = false,
}: {
  item: ContentItem;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
  useDisplayTitle?: boolean;
}) {
  const typeColor = TYPE_COLOR[item.type] ?? colors.accent.primary;
  const displayInfo = useDisplayTitle
    ? getContentDisplayInfo({
        title: item.title,
        description: item.description,
        script: item.script,
        status: item.status ?? undefined,
        voiceUrl: item.voiceUrl,
        audioUrl: item.audioUrl,
      })
    : null;
  const title = displayInfo?.displayTitle ?? item.title ?? 'Untitled';
  const subtitle = displayInfo?.subtitle ?? item.description;
  const draftLabel = displayInfo?.draftLabel;

  return (
    <Link href={getContentDetailHref(item.type, item.id)} style={{ textDecoration: 'none' }}>
      <div
        className="clp-card"
        style={{
          position: 'relative',
          borderRadius: borderRadius.xl,
          background: colors.glass.light,
          backdropFilter: BLUR.xl,
          WebkitBackdropFilter: BLUR.xl,
          border: `1px solid ${typeColor}40`,
          boxShadow: `0 8px 32px ${typeColor}18`,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 200,
        }}
      >
        {/* Hero slot — marketplace-style, collectible */}
        <div
          style={{
            height: 72,
            background: `linear-gradient(135deg, ${typeColor}40, ${typeColor}12)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 80% 20%, ${typeColor}20 0%, transparent 55%)`,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: borderRadius.full,
              background: withOpacity(colors.text.onDark, 0.15),
              backdropFilter: BLUR.sm,
              WebkitBackdropFilter: BLUR.sm,
              border: `1px solid ${typeColor}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              boxShadow: `0 4px 12px ${typeColor}30`,
            }}
          >
            <Play size={18} color={typeColor} strokeWidth={2.5} style={{ marginLeft: 2 }} />
          </div>
        </div>

        <div style={{ padding: spacing.lg, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: spacing.sm,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
              {React.createElement(getContentTypeIcon(item.type), { size: 14, color: typeColor, strokeWidth: 2.5 })}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: typeColor,
                }}
              >
                {item.type}
              </span>
              {draftLabel && (
                <span
                  style={{
                    padding: `0 ${spacing.xs}`,
                    borderRadius: borderRadius.sm,
                    background: `${colors.warning}20`,
                    border: `1px solid ${colors.warning}30`,
                    fontSize: 10,
                    color: colors.warning,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  {draftLabel}
                </span>
              )}
            </div>
          </div>

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
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              style={{
                color: colors.text.secondary,
                flex: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </Typography>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: spacing.md,
              flexWrap: 'wrap',
              gap: spacing.xs,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' }}>
              {item.frequency && (
                <span
                  style={{ fontSize: '11px', fontWeight: 600, color: typeColor, letterSpacing: '0.03em' }}
                >
                  {item.frequency}
                </span>
              )}
              {item.duration && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={10} color={colors.text.secondary} strokeWidth={2} />
                  <span style={{ fontSize: 11, color: colors.text.secondary }}>{item.duration}</span>
                </span>
              )}
              {item.voiceType && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {item.voiceType === 'ai' ? (
                    <Bot size={10} color={colors.accent.secondary} strokeWidth={2} />
                  ) : (
                    <Mic size={10} color={colors.accent.primary} strokeWidth={2} />
                  )}
                  <span
                    style={{
                      fontSize: 11,
                      color: item.voiceType === 'ai' ? colors.accent.secondary : colors.accent.primary,
                    }}
                  >
                    {item.voiceType === 'ai' ? 'Professional voice' : 'My voice'}
                  </span>
                </span>
              )}
            </div>
            {(item.createdAt || item.lastPlayed) && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Calendar size={10} color={colors.text.secondary} strokeWidth={2} />
                <span style={{ fontSize: 11, color: colors.text.secondary }}>
                  {item.lastPlayed
                    ? `Played ${formatDateShort(item.lastPlayed)}`
                    : formatDateShort(item.createdAt)}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Hover play overlay */}
        <div
          className="clp-card-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, ${withOpacity(colors.background.primary, 0.75)} 0%, ${withOpacity(colors.background.primary, 0.25)} 50%, transparent 100%)`,
            borderRadius: borderRadius.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.25s ease',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: borderRadius.full,
              background: withOpacity(colors.text.onDark, 0.2),
              backdropFilter: BLUR.sm,
              WebkitBackdropFilter: BLUR.sm,
              border: `1px solid ${withOpacity(colors.text.onDark, 0.35)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${typeColor}50`,
            }}
          >
            <Play size={22} color={colors.text.onDark} strokeWidth={2} style={{ marginLeft: spacing.xs }} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ContentListPage({
  title,
  description,
  contentType,
  createHref,
  backHref,
  content,
  createLabel = 'Create New',
  createInHeaderOnly = false,
  continueListeningItem,
  useDisplayTitle = false,
  searchPlaceholder,
  createCardSubtitle,
  isLoading = false,
  error = null,
  onRetry,
}: ContentListPageProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const typeColor = TYPE_COLOR[contentType] ?? colors.accent.primary;

  // Debounce search input to avoid filtering on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const filteredContent = content.filter((item) =>
    debouncedQuery ? item.title.toLowerCase().includes(debouncedQuery.toLowerCase()) : true
  );

  return (
    <PageShell intensity="medium" allowDocumentScroll>
      <PageContent>
        {/* Back */}
        <Link
          href={backHref}
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.xs,
            marginBottom: spacing.xl,
          }}
        >
          <ChevronLeft size={18} strokeWidth={2} color={colors.text.secondary} />
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Back
          </Typography>
        </Link>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: spacing.lg,
            marginBottom: spacing.xl,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <Typography
              variant="h1"
              style={{ marginBottom: spacing.xs, color: colors.text.primary, fontWeight: 300 }}
            >
              {title}
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              {description}
            </Typography>
          </div>
          <Link href={createHref} style={{ textDecoration: 'none', flexShrink: 0 }}>
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
              {createLabel}
            </Button>
          </Link>
        </div>

        {/* Continue listening */}
        {continueListeningItem && (
          <ContinueListeningRow
            item={continueListeningItem}
            colors={colors}
            contentType={contentType}
            useDisplayTitle={useDisplayTitle}
          />
        )}

        {/* Search */}
        <div style={{ maxWidth: SEARCH_INPUT_MAX_WIDTH, marginBottom: spacing.xl }}>
          <input
            type="text"
            placeholder={searchPlaceholder ?? `Search ${contentType}s...`}
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
              Failed to load {contentType}s
            </Typography>
            <Typography
              variant="body"
              style={{ marginBottom: spacing.lg, color: colors.text.secondary }}
            >
              {error}
            </Typography>
            {onRetry && (
              <Button
                variant="primary"
                style={{
                  background: colors.gradients.primary,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}
                onClick={onRetry}
              >
                <RefreshCw size={14} strokeWidth={2} />
                Retry
              </Button>
            )}
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(auto-fill, minmax(${GRID_CARD_MIN}, 1fr))`,
                gap: spacing.lg,
              }}
            >
              {/* Create card — only when not in header-only mode */}
              {!createInHeaderOnly && (
              <Link href={createHref} style={{ textDecoration: 'none' }}>
                <div
                  className="clp-card"
                  style={{
                    position: 'relative',
                    borderRadius: borderRadius.xl,
                    background: `${typeColor}04`,
                    border: `2px dashed ${typeColor}35`,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    minHeight: 200,
                  }}
                >
                  {/* Hero slot — matches content card structure */}
                  <div
                    style={{
                      height: 72,
                      background: `linear-gradient(135deg, ${typeColor}12, ${typeColor}04)`,
                      borderBottom: `1px dashed ${typeColor}25`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: borderRadius.full,
                        background: `linear-gradient(135deg, ${typeColor}30, ${typeColor}15)`,
                        border: `1px solid ${typeColor}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${typeColor}25`,
                      }}
                    >
                      <Plus size={22} color={typeColor} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div
                    style={{
                      padding: spacing.lg,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="h4"
                      style={{
                        color: colors.text.primary,
                        fontWeight: 500,
                        marginBottom: spacing.xs,
                      }}
                    >
                      {createLabel}
                    </Typography>
                    <Typography variant="caption" style={{ color: colors.text.secondary }}>
                      {createCardSubtitle ?? `Add a new ${contentType} to your collection`}
                    </Typography>
                  </div>
                </div>
              </Link>
              )}

              {filteredContent.map((item) => (
                <ContentCard key={item.id} item={item} colors={colors} useDisplayTitle={useDisplayTitle} />
              ))}
            </div>

            {filteredContent.length === 0 && content.length === 0 && (
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
                <Typography
                  variant="h4"
                  style={{ color: colors.text.primary, marginBottom: spacing.sm }}
                >
                  No {contentType}s yet
                </Typography>
                <Typography
                  variant="body"
                  style={{ marginBottom: spacing.lg, color: colors.text.secondary }}
                >
                  {searchQuery
                    ? `Nothing matches "${searchQuery}"`
                    : `Create your first ${contentType}`}
                </Typography>
                <Link href={createHref} style={{ textDecoration: 'none' }}>
                  <Button
                    variant="primary"
                    style={{
                      background: colors.gradients.primary,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: spacing.xs,
                    }}
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    {createLabel}
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}

        <style>{`
          .clp-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.3);
            border-color: rgba(255,255,255,0.2) !important;
          }
          .clp-card:hover .clp-card-overlay {
            opacity: 1 !important;
          }
        `}</style>
      </PageContent>
    </PageShell>
  );
}
