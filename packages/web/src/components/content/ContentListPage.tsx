'use client';

import React, { useState } from 'react';
import { Typography, Button, Card, Badge, Loading } from '@/components';
import { spacing, borderRadius } from '@/theme';
import { GRID_CARD_MIN, SEARCH_INPUT_MAX_WIDTH } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
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

  const filteredContent = content.filter((item) =>
    searchQuery ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

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
          <div>
            <Link href={backHref} style={{ textDecoration: 'none', display: 'inline-block', marginBottom: spacing.sm }}>
              <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
                ← Back
              </Typography>
            </Link>
            <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
              {title}
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              {description}
            </Typography>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' }}>
            <Link href={createHref} style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
                {createLabel}
              </Button>
            </Link>
            <div style={{ flex: 1, maxWidth: SEARCH_INPUT_MAX_WIDTH }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: spacing.sm,
                  borderRadius: borderRadius.md,
                  border: `1px solid ${colors.glass.border}`,
                  background: colors.glass.light,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  fontSize: '14px',
                  color: colors.text.primary,
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: `${spacing.xxl} 0` }}>
            <Loading variant="spinner" size="lg" />
          </div>
        ) : error ? (
          <Card
            variant="default"
            style={{
              padding: spacing.xl,
              textAlign: 'center',
              background: colors.glass.light,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.error }}>
              Failed to load {contentType}s
            </Typography>
            <Typography variant="body" style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
              {error}
            </Typography>
            {onRetry && (
              <Button variant="primary" style={{ background: colors.gradients.primary }} onClick={onRetry}>
                Retry
              </Button>
            )}
          </Card>
        ) : null}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${GRID_CARD_MIN}, 1fr))`,
            gap: spacing.lg,
          }}
        >
          <Link href={createHref} style={{ textDecoration: 'none' }}>
            <Card
              variant="default"
              pressable
              style={{
                aspectRatio: '16/9',
                padding: spacing.lg,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                border: `2px dashed ${colors.glass.border}`,
                background: colors.glass.light,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: borderRadius.full,
                  background: colors.gradients.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.md,
                  boxShadow: `0 4px 12px ${colors.accent.primary}60`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>
                  {React.createElement(getContentTypeIcon(contentType), {
                    size: 24,
                    color: colors.text.onDark,
                    strokeWidth: 2.5,
                  })}
                </span>
              </div>
              <Typography variant="h3" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
                {createLabel}
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary }}>
                Add a new {contentType}
              </Typography>
            </Card>
          </Link>

          {filteredContent.map((item) => (
            <Link key={item.id} href={getContentDetailHref(item.type, item.id)} style={{ textDecoration: 'none' }}>
              <Card
                variant="elevated"
                pressable
                style={{
                  aspectRatio: '16/9',
                  padding: spacing.lg,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  background: colors.glass.light,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: `1px solid ${colors.glass.border}`,
                  boxShadow: `0 8px 32px ${colors.accent.primary}40`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                    <Badge variant={getContentTypeBadgeVariant(item.type)} size="sm">
                      {item.type}
                    </Badge>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: borderRadius.full,
                        background: colors.gradients.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: `0 4px 12px ${colors.accent.primary}60`,
                      }}
                    >
                      {React.createElement(getContentTypeIcon(item.type), {
                        size: 20,
                        color: colors.text.onDark,
                        strokeWidth: 2.5,
                        style: { position: 'relative', zIndex: 1 } as React.CSSProperties,
                      })}
                    </div>
                  </div>
                  <Typography variant="h3" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body" style={{ marginBottom: spacing.md, color: colors.text.secondary }}>
                    {item.description}
                  </Typography>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, fontSize: '12px', color: colors.text.tertiary ?? colors.text.secondary }}>
                    {item.frequency && (
                      <>
                        <span style={{ color: colors.accent.primary }}>{item.frequency}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{item.duration}</span>
                  </div>
                  {item.lastPlayed && (
                    <div style={{ fontSize: '12px', color: colors.text.tertiary ?? colors.text.secondary }}>
                      Last played: {new Date(item.lastPlayed).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <Card
            variant="default"
            style={{
              padding: spacing.xl,
              textAlign: 'center',
              marginTop: spacing.xl,
              background: colors.glass.light,
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
              No {contentType}s found
            </Typography>
            <Typography variant="body" style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
              {searchQuery ? `No items match "${searchQuery}"` : `Create your first ${contentType}`}
            </Typography>
            <Link href={createHref} style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ background: colors.gradients.primary }}>
                {createLabel}
              </Button>
            </Link>
          </Card>
        )}
      </PageContent>
    </PageShell>
  );
}
