'use client';

import React, { useState } from 'react';
import { Typography, Button, Badge, Loading } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { GRID_CARD_MIN, SEARCH_INPUT_MAX_WIDTH } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { Play, Mic, Bot, Clock, Calendar, Plus, RefreshCw, ChevronLeft } from 'lucide-react';
import type { ContentItem, ContentItemType } from './ContentItem';
import { getContentDetailHref } from './getContentDetailHref';
import { getContentTypeIcon } from '@/lib/content-helpers';
import { getContentTypeBadgeVariant } from '@waqup/shared/utils';

export interface ContentListPageProps {
  title: string;
  description: string;
  contentType: ContentItemType;
  createHref: string;
  backHref: string;
  content: ContentItem[];
  createLabel?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const TYPE_COLOR: Record<ContentItemType, string> = {
  affirmation: '#c084fc',
  meditation: '#60a5fa',
  ritual: '#34d399',
};

function formatDate(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function ContentCard({
  item,
  colors,
}: {
  item: ContentItem;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
}) {
  const typeColor = TYPE_COLOR[item.type] ?? '#9333EA';

  return (
    <Link href={getContentDetailHref(item.type, item.id)} style={{ textDecoration: 'none' }}>
      <div
        className="clp-card"
        style={{
          position: 'relative',
          borderRadius: borderRadius.xl,
          background: colors.glass.light,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
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
        {/* Ambient glow */}
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

        {/* Top row */}
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

        {/* Bottom metadata */}
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
                      color:
                        item.voiceType === 'ai' ? colors.accent.secondary : colors.accent.primary,
                    }}
                  >
                    {item.voiceType === 'ai' ? 'AI voice' : 'My voice'}
                  </span>
                </div>
              </>
            )}
          </div>
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

        {/* Hover play overlay */}
        <div
          className="clp-card-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
            borderRadius: borderRadius.xl,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.25s ease',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: borderRadius.full,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${typeColor}50`,
            }}
          >
            <Play size={22} color="#fff" strokeWidth={2} style={{ marginLeft: spacing.xs }} />
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
  isLoading = false,
  error = null,
  onRetry,
}: ContentListPageProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [searchQuery, setSearchQuery] = useState('');
  const typeColor = TYPE_COLOR[contentType] ?? '#9333EA';

  const filteredContent = content.filter((item) =>
    searchQuery ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <PageShell intensity="medium">
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

        {/* Search */}
        <div style={{ maxWidth: SEARCH_INPUT_MAX_WIDTH, marginBottom: spacing.xl }}>
          <input
            type="text"
            placeholder={`Search ${contentType}s...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: `${spacing.sm} ${spacing.md}`,
              borderRadius: borderRadius.lg,
              border: `1px solid ${colors.glass.border}`,
              background: colors.glass.light,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
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
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
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
              {/* Create card */}
              <Link href={createHref} style={{ textDecoration: 'none' }}>
                <div
                  className="clp-card"
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
                      background: `${typeColor}20`,
                      border: `1px solid ${typeColor}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.createElement(getContentTypeIcon(contentType), {
                      size: 22,
                      color: typeColor,
                      strokeWidth: 2,
                    })}
                  </div>
                  <div style={{ textAlign: 'center' }}>
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
                      Create a new {contentType}
                    </Typography>
                  </div>
                </div>
              </Link>

              {filteredContent.map((item) => (
                <ContentCard key={item.id} item={item} colors={colors} />
              ))}
            </div>

            {filteredContent.length === 0 && content.length === 0 && (
              <div
                style={{
                  padding: spacing.xl,
                  textAlign: 'center',
                  borderRadius: borderRadius.xl,
                  background: colors.glass.light,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
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
