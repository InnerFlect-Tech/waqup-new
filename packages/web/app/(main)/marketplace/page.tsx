'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Typography, Button, Badge } from '@/components';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { Star, Play, Clock, Users } from 'lucide-react';
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
  duration: string;
  plays: number;
  description: string;
  featured?: boolean;
}

const MOCK_ITEMS: MarketplaceItem[] = [
  {
    id: '1',
    type: 'affirmation',
    title: 'Morning Power Activation',
    creator: 'Sarah K.',
    rating: 4.9,
    ratingCount: 234,
    duration: '8 min',
    plays: 1240,
    description: 'Start every morning anchored in your power and purpose.',
    featured: true,
  },
  {
    id: '2',
    type: 'meditation',
    title: 'Deep Calm',
    creator: 'Mindful Studio',
    rating: 4.8,
    ratingCount: 156,
    duration: '20 min',
    plays: 890,
    description: 'A deep descent into stillness for nervous system reset.',
    featured: true,
  },
  {
    id: '3',
    type: 'ritual',
    title: 'New Moon Intention Setting',
    creator: 'Luna Rituals',
    rating: 4.7,
    ratingCount: 89,
    duration: '15 min',
    plays: 567,
    description: 'Harness the new moon energy to plant seeds of transformation.',
    featured: true,
  },
  {
    id: '4',
    type: 'affirmation',
    title: 'Abundance Flow',
    creator: 'Prosperity Co',
    rating: 4.6,
    ratingCount: 312,
    duration: '10 min',
    plays: 1890,
    description: 'Open your mind to receive abundance in all areas of life.',
  },
  {
    id: '5',
    type: 'meditation',
    title: 'Sleep Descent',
    creator: 'Dream Lab',
    rating: 4.9,
    ratingCount: 445,
    duration: '25 min',
    plays: 3200,
    description: 'Drift into deep restorative sleep through guided body relaxation.',
  },
  {
    id: '6',
    type: 'ritual',
    title: 'Confidence Embodiment',
    creator: 'Empowerment Hub',
    rating: 4.7,
    ratingCount: 178,
    duration: '12 min',
    plays: 760,
    description: 'Step into your most confident self through voice and intention.',
  },
  {
    id: '7',
    type: 'affirmation',
    title: 'Anxiety Release',
    creator: 'Calm Collective',
    rating: 4.8,
    ratingCount: 523,
    duration: '6 min',
    plays: 4100,
    description: 'Gentle affirmations to dissolve anxiety and return to centre.',
  },
  {
    id: '8',
    type: 'meditation',
    title: 'Focus Flow State',
    creator: 'Peak Performance',
    rating: 4.6,
    ratingCount: 267,
    duration: '18 min',
    plays: 1450,
    description: 'Enter a state of effortless focus and creative flow.',
  },
  {
    id: '9',
    type: 'ritual',
    title: 'Evening Integration',
    creator: 'Sacred Space Studio',
    rating: 4.5,
    ratingCount: 94,
    duration: '10 min',
    plays: 430,
    description: 'Close the day with gratitude and conscious release.',
  },
  {
    id: '10',
    type: 'affirmation',
    title: 'Body Love',
    creator: 'Wholeness Within',
    rating: 4.8,
    ratingCount: 389,
    duration: '7 min',
    plays: 2100,
    description: 'Cultivate deep appreciation and love for your physical form.',
  },
];

const TYPE_COLORS: Record<string, string> = {
  affirmation: '#c084fc',
  meditation: '#60a5fa',
  ritual: '#34d399',
};

function formatPlays(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function MarketplacePage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [filter, setFilter] = useState<'all' | 'affirmation' | 'ritual' | 'meditation'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const featured = MOCK_ITEMS.filter((i) => i.featured);
  const filteredItems = MOCK_ITEMS.filter((item) => {
    if (filter !== 'all' && item.type !== filter) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <PageShell intensity="medium">
      <PageContent>
        {/* Header */}
        <div style={{ marginBottom: spacing.xl }}>
          <Link href="/sanctuary" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: spacing.md }}>
            <Typography variant="small" style={{ color: colors.text.secondary }}>
              ← Sanctuary
            </Typography>
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: spacing.md }}>
            <div>
              <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary, fontWeight: 300 }}>
                Marketplace
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary }}>
                Discover transformation content from the community
              </Typography>
            </div>
            <Link href="/marketplace/creator" style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="md">
                Creator Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured section */}
        {filter === 'all' && !searchQuery && (
          <div style={{ marginBottom: spacing.xxl }}>
            <Typography
              variant="h4"
              style={{ color: colors.text.secondary, marginBottom: spacing.lg, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 11 }}
            >
              Featured
            </Typography>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gridAutoRows: 'minmax(200px, 1fr)',
                gap: spacing.lg,
              }}
            >
              {featured.map((item, index) => {
                const accent = TYPE_COLORS[item.type] ?? colors.accent.primary;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    style={{
                      padding: spacing.xl,
                      borderRadius: borderRadius.xl,
                      background: `linear-gradient(145deg, ${accent}18, ${colors.glass.light})`,
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: `1px solid ${accent}40`,
                      boxShadow: `0 8px 32px ${accent}20`,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md }}>
                      {React.createElement(getContentTypeIcon(item.type), { size: 18, color: accent, strokeWidth: 2.5 })}
                      <Badge size="sm" variant="default" style={{ color: accent, background: `${accent}20`, border: 'none' }}>
                        {item.type}
                      </Badge>
                    </div>
                    <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                      {item.title}
                    </Typography>
                    <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.md, display: 'block', flex: 1, minHeight: 0 }}>
                      {item.description}
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                      <Typography variant="small" style={{ color: colors.text.secondary }}>
                        by {item.creator}
                      </Typography>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                          <Star size={12} fill={accent} color={accent} />
                          <Typography variant="small" style={{ color: colors.text.secondary }}>
                            {item.rating}
                          </Typography>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                          <Clock size={12} color={colors.text.secondary} />
                          <Typography variant="small" style={{ color: colors.text.secondary }}>
                            {item.duration}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filters + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap', marginBottom: spacing.xl }}>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
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
          <input
            type="text"
            placeholder="Search content..."
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
        {filteredItems.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fill, minmax(${GRID_CARD_MIN}, 1fr))`,
              gridAutoRows: 'minmax(180px, 1fr)',
              gap: spacing.lg,
            }}
          >
            {filteredItems.map((item, index) => {
              const accent = TYPE_COLORS[item.type] ?? colors.accent.primary;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  style={{
                    padding: spacing.lg,
                    borderRadius: borderRadius.lg,
                    background: colors.glass.light,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: `1px solid ${colors.glass.border}`,
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                    {React.createElement(getContentTypeIcon(item.type), { size: 16, color: accent, strokeWidth: 2.5 })}
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        color: accent,
                      }}
                    >
                      {item.type}
                    </span>
                  </div>
                  <Typography variant="h4" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
                    {item.title}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.md, display: 'block', lineHeight: 1.5, flex: 1, minHeight: 0 }}>
                    {item.description}
                  </Typography>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <Typography variant="small" style={{ color: colors.text.secondary }}>
                      by {item.creator}
                    </Typography>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        <Star size={11} fill={accent} color={accent} />
                        <Typography variant="small" style={{ color: colors.text.secondary }}>{item.rating}</Typography>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        <Play size={11} color={colors.text.secondary} />
                        <Typography variant="small" style={{ color: colors.text.secondary }}>{formatPlays(item.plays)}</Typography>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                        <Clock size={11} color={colors.text.secondary} />
                        <Typography variant="small" style={{ color: colors.text.secondary }}>{item.duration}</Typography>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
              No results found
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Try a different search or filter.
            </Typography>
          </div>
        )}

        {/* Coming soon notice */}
        <div
          style={{
            marginTop: spacing.xxl,
            padding: spacing.lg,
            borderRadius: borderRadius.lg,
            background: `${colors.accent.primary}10`,
            border: `1px solid ${colors.accent.primary}25`,
            textAlign: 'center',
          }}
        >
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            <span style={{ color: colors.accent.primary, fontWeight: 600 }}>Creator publishing coming soon.</span>
            {' '}Share your own content and earn Qs when others practice with it.
          </Typography>
        </div>
      </PageContent>
    </PageShell>
  );
}
