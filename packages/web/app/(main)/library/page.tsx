'use client';

import React, { useState, useMemo } from 'react';
import { Typography, Button, Card, Badge, Loading } from '@/components';
import { spacing, borderRadius, GRID_CARD_MIN, SEARCH_INPUT_MAX_WIDTH } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell, PageContent } from '@/components';
import Link from 'next/link';
import { Music, Sparkles, Brain, Library as LibraryIcon } from 'lucide-react';
import { getContentDetailHref } from '@/components/content';
import type { ContentItem } from '@waqup/shared/types';
import { getContentTypeIcon } from '@/lib';
import { getContentTypeBadgeVariant } from '@waqup/shared/utils';
import { useContent } from '@/hooks';

type ContentType = 'all' | 'rituals' | 'affirmations' | 'meditations';

const FILTERS: { id: ContentType; label: string; icon: typeof Music }[] = [
  { id: 'all', label: 'All', icon: LibraryIcon },
  { id: 'rituals', label: 'Rituals', icon: Music },
  { id: 'affirmations', label: 'Affirmations', icon: Sparkles },
  { id: 'meditations', label: 'Meditations', icon: Brain },
];

const glassCardStyle = (colors: { glass?: { light?: string; border?: string } }) => ({
  background: colors.glass?.light,
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: `1px solid ${colors.glass?.border}`,
});

export default function LibraryPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [contentType, setContentType] = useState<ContentType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { items: allContent, isLoading, error, refetch } = useContent();

  const filteredContent = useMemo(
    () =>
      allContent.filter((item) => {
        if (contentType !== 'all' && item.type !== contentType.slice(0, -1)) return false;
        if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      }),
    [allContent, contentType, searchQuery]
  );

  const getFilterStyle = (id: ContentType) => {
    const isActive = contentType === id;
    const accent = id === 'meditations' ? colors.accent.tertiary : id === 'affirmations' ? colors.accent.secondary : colors.accent.primary;
    const bg = id === 'meditations' && isActive ? `linear-gradient(to right, ${colors.accent.tertiary}, ${colors.accent.secondary})` : isActive ? (id === 'affirmations' ? colors.gradients.secondary : colors.gradients.primary) : id === 'affirmations' || id === 'meditations' ? colors.glass.transparent : colors.glass.opaque;
    return {
      padding: `${spacing.xs} ${spacing.md}`,
      borderRadius: borderRadius.full,
      border: `1px solid ${isActive ? accent : colors.glass.border}`,
      background: bg,
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      color: isActive ? colors.text.onDark : (id === 'affirmations' || id === 'meditations' ? colors.text.secondary : colors.text.primary),
      fontSize: '14px',
      fontWeight: isActive ? 600 : 400,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: isActive ? `0 4px 12px ${colors.accent.primary}${id === 'all' || id === 'rituals' ? '60' : '40'}` : 'none',
      display: 'flex',
      alignItems: 'center',
      gap: spacing.xs,
    } as React.CSSProperties;
  };

  return (
    <PageShell intensity="medium">
      <PageContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.xl }}>
          <div>
            <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>Your Library</Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>All your rituals and affirmations in one place</Typography>
          </div>
          <Link href="/create" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>Create New</Button>
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md, marginBottom: spacing.xl }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
            {FILTERS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setContentType(id)} style={getFilterStyle(id)}>
                <Icon size={16} color={contentType === id ? colors.text.onDark : (id === 'affirmations' || id === 'meditations' ? colors.text.secondary : colors.text.primary)} strokeWidth={2.5} />
                {label}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, maxWidth: SEARCH_INPUT_MAX_WIDTH }}>
            <input
              type="text"
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: spacing.sm, borderRadius: borderRadius.md, fontSize: '14px', color: colors.text.primary, outline: 'none', ...glassCardStyle(colors) }}
            />
          </div>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: `${spacing.xxl} 0` }}>
            <Loading variant="spinner" size="lg" />
          </div>
        ) : error ? (
          <Card variant="default" style={{ padding: spacing.xl, textAlign: 'center', ...glassCardStyle(colors) }}>
            <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.error }}>Failed to load library</Typography>
            <Typography variant="body" style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>{error}</Typography>
            <Button variant="primary" style={{ background: colors.gradients.primary }} onClick={refetch}>Retry</Button>
          </Card>
        ) : filteredContent.length === 0 ? (
          <Card variant="default" style={{ padding: spacing.xl, textAlign: 'center', ...glassCardStyle(colors) }}>
            <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
              {searchQuery || contentType !== 'all' ? 'No content found' : 'Your library is empty'}
            </Typography>
            <Typography variant="body" style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
              {searchQuery ? `No items match "${searchQuery}"` : contentType !== 'all' ? `No ${contentType} yet` : 'Start creating your first ritual or affirmation'}
            </Typography>
            <Link href="/create" style={{ textDecoration: 'none' }}>
              <Button variant="primary" style={{ background: colors.gradients.primary }}>Create New</Button>
            </Link>
          </Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fill, minmax(${GRID_CARD_MIN}, 1fr))`, gap: spacing.lg }}>
            <Link href="/create" style={{ textDecoration: 'none' }}>
              <Card variant="default" pressable style={{ aspectRatio: '16/9', padding: spacing.lg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', boxShadow: `0 4px 12px ${colors.accent.primary}60`, ...glassCardStyle(colors), border: `2px dashed ${colors.glass.border}` }}>
                <IconCircle colors={colors} icon={Sparkles} iconSize={24} boxSize={48} />
                <Typography variant="h3" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>Create New</Typography>
                <Typography variant="body" style={{ color: colors.text.secondary }}>Add a new ritual or affirmation</Typography>
              </Card>
            </Link>
            {filteredContent.map((item) => (
              <Link key={item.id} href={getContentDetailHref(item.type, item.id)} style={{ textDecoration: 'none' }}>
                <Card variant="elevated" pressable style={{ aspectRatio: '16/9', padding: spacing.lg, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s ease', cursor: 'pointer', boxShadow: `0 8px 32px ${colors.accent.primary}40`, background: colors.glass.light, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: `1px solid ${colors.glass.border}` }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                      <Badge variant={getContentTypeBadgeVariant(item.type)} size="sm">{item.type}</Badge>
                      <IconCircle colors={colors} icon={getContentTypeIcon(item.type)} iconSize={20} boxSize={40} />
                    </div>
                    <Typography variant="h3" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>{item.title}</Typography>
                    <Typography variant="body" style={{ marginBottom: spacing.md, color: colors.text.secondary }}>{item.description}</Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, fontSize: '12px', color: colors.text.tertiary }}>
                      {item.frequency && <><span style={{ color: colors.accent.primary }}>{item.frequency}</span><span>•</span></>}
                      <span>{item.duration}</span>
                    </div>
                    {item.lastPlayed && <div style={{ fontSize: '12px', color: colors.text.tertiary }}>Last played: {new Date(item.lastPlayed).toLocaleDateString()}</div>}
                  </div>
                  <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${colors.background.primary}80, transparent)`, borderRadius: borderRadius.md, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: spacing.md, opacity: 0, transition: 'opacity 0.3s ease', pointerEvents: 'none' }} className="library-hover-overlay">
                    <Button variant="primary" size="sm" style={{ background: colors.gradients.primary }}>Play Now</Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <style dangerouslySetInnerHTML={{ __html: '.library-hover-overlay { pointer-events: none; } [class*="Card"]:hover .library-hover-overlay { opacity: 1; }' }} />
      </PageContent>
    </PageShell>
  );
}

function IconCircle({ colors, icon: Icon, iconSize, boxSize }: { colors: Record<string, unknown>; icon: typeof Music; iconSize: number; boxSize: number }) {
  const c = colors as { gradients?: { primary: string }; mystical?: { glow: string }; text?: { onDark: string } };
  return (
    <div style={{ width: boxSize, height: boxSize, borderRadius: borderRadius.full, background: c.gradients?.primary ?? '', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${c.mystical?.glow ?? ''}60`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at center, ${c.mystical?.glow ?? ''}40, transparent)`, opacity: 0.6 }} />
      <span style={{ position: 'relative', zIndex: 1 }}>
        <Icon size={iconSize} color={c.text?.onDark ?? '#fff'} strokeWidth={2.5} />
      </span>
    </div>
  );
}
