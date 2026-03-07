'use client';

import React, { useState } from 'react';
import { Typography, Button, Card, Badge } from '@/components';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { Music, Sparkles, Brain, Star } from 'lucide-react';
import { spacing, borderRadius } from '@/theme';
import { GRID_CARD_MIN, SEARCH_INPUT_MAX_WIDTH } from '@/theme';
import { useTheme } from '@/theme';
import { getContentTypeIcon } from '@/lib';

interface MarketplaceItem {
  id: string;
  type: 'affirmation' | 'ritual' | 'meditation';
  title: string;
  creator: string;
  rating: number;
  ratingCount: number;
}

const MOCK_ITEMS: MarketplaceItem[] = [
  { id: '1', type: 'affirmation', title: 'Morning Power', creator: 'Sarah K.', rating: 4.9, ratingCount: 234 },
  { id: '2', type: 'meditation', title: 'Deep Calm', creator: 'Mindful Studio', rating: 4.8, ratingCount: 156 },
  { id: '3', type: 'ritual', title: 'New Moon Intention', creator: 'Luna Rituals', rating: 4.7, ratingCount: 89 },
  { id: '4', type: 'affirmation', title: 'Abundance Flow', creator: 'Prosperity Co', rating: 4.6, ratingCount: 312 },
];

export default function MarketplacePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [filter, setFilter] = useState<'all' | 'affirmation' | 'ritual' | 'meditation'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = MOCK_ITEMS.filter((item) => {
    if (filter !== 'all' && item.type !== filter) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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
          <Link href="/home" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
              ← Back
            </Typography>
          </Link>
          <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
            Marketplace
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Discover, search, and browse content from creators.
          </Typography>

          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
              {(['all', 'affirmation', 'ritual', 'meditation'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: `${spacing.xs} ${spacing.md}`,
                    borderRadius: borderRadius.full,
                    border: `1px solid ${filter === f ? colors.accent.primary : colors.glass.border}`,
                    background: filter === f ? colors.gradients.primary : colors.glass.light,
                    color: filter === f ? colors.text.onDark : colors.text.primary,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
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
                padding: spacing.sm,
                borderRadius: borderRadius.md,
                border: `1px solid ${colors.glass.border}`,
                background: colors.glass.light,
                fontSize: '14px',
                color: colors.text.primary,
                outline: 'none',
              }}
            />
            <Link href="/marketplace/creator" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="md">
                Creator dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${GRID_CARD_MIN}, 1fr))`,
            gap: spacing.lg,
          }}
        >
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              variant="elevated"
              pressable
              style={{
                padding: spacing.lg,
                background: colors.glass.light,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: `1px solid ${colors.glass.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                {React.createElement(getContentTypeIcon(item.type), { size: 20, color: colors.accent.primary, strokeWidth: 2.5 })}
                <Badge size="sm" variant="default">
                  {item.type}
                </Badge>
              </div>
              <Typography variant="h3" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
                {item.title}
              </Typography>
              <Typography variant="small" style={{ marginBottom: spacing.sm, color: colors.text.secondary }}>
                by {item.creator}
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                <Star size={14} fill={colors.accent.primary} color={colors.accent.primary} />
                <Typography variant="small" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
                  {item.rating} ({item.ratingCount})
                </Typography>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card
            variant="default"
            style={{
              padding: spacing.xl,
              textAlign: 'center',
              background: colors.glass.light,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${colors.glass.border}`,
            }}
          >
            <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
              No results found
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Try a different search or filter.
          </Typography>
        </Card>
      )}
      </PageContent>
    </PageShell>
  );
}
