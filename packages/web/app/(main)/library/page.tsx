'use client';

import React, { useState } from 'react';
import { Typography, Button, Card, Badge } from '@/components';
import { Icon } from '@/components/ui/Icon';
import { spacing, borderRadius } from '@/theme';
import { useTheme } from '@/theme';
import { PageShell } from '@/components';
import Link from 'next/link';
import { Music, Sparkles, Brain, Library as LibraryIcon } from 'lucide-react';

type ContentType = 'all' | 'rituals' | 'affirmations' | 'meditations';

interface ContentItem {
  id: string;
  type: 'ritual' | 'affirmation' | 'meditation';
  title: string;
  description: string;
  frequency?: string;
  duration: string;
  lastPlayed?: string;
}

export default function LibraryPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [contentType, setContentType] = useState<ContentType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data - replace with actual data from backend
  const content: ContentItem[] = [
    {
      id: '1',
      type: 'ritual',
      title: 'Morning Empowerment',
      description: 'Start your day with confidence and purpose',
      frequency: '432Hz',
      duration: '10:00',
      lastPlayed: '2024-03-10',
    },
    {
      id: '2',
      type: 'affirmation',
      title: 'Abundance Mindset',
      description: 'Attract prosperity and success',
      frequency: '528Hz',
      duration: '5:00',
      lastPlayed: '2024-03-12',
    },
    {
      id: '3',
      type: 'meditation',
      title: 'Deep Relaxation',
      description: 'Find peace and tranquility',
      duration: '15:00',
      lastPlayed: '2024-03-11',
    },
  ];

  const filteredContent = content.filter((item) => {
    if (contentType !== 'all' && item.type !== contentType.slice(0, -1)) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ritual':
        return Music;
      case 'affirmation':
        return Sparkles;
      case 'meditation':
        return Brain;
      default:
        return LibraryIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ritual':
        return 'primary';
      case 'affirmation':
        return 'success';
      case 'meditation':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <PageShell intensity="medium">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.md,
              marginBottom: spacing.xl,
            }}
          >
            <div>
              <Typography variant="h1" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
                Your Library
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary }}>
                All your rituals and affirmations in one place
              </Typography>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
              <Link href="/create" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="md" style={{ background: colors.gradients.primary }}>
                  Create New
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.md,
              marginBottom: spacing.xl,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
              {/* All - More opaque, darker */}
              <button
                onClick={() => setContentType('all')}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  borderRadius: borderRadius.full,
                  border: `1px solid ${contentType === 'all' ? colors.accent.primary : colors.glass.border}`,
                  background: contentType === 'all' 
                    ? colors.gradients.primary 
                    : colors.glass.opaque, // More opaque
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: contentType === 'all' ? colors.text.onDark : colors.text.primary,
                  fontSize: '14px',
                  fontWeight: contentType === 'all' ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: contentType === 'all' ? `0 4px 12px ${colors.mystical.glow}60` : 'none',
                }}
              >
                All
              </button>
              
              {/* Rituals - More opaque, darker */}
              <button
                onClick={() => setContentType('rituals')}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  borderRadius: borderRadius.full,
                  border: `1px solid ${contentType === 'rituals' ? colors.accent.primary : colors.glass.border}`,
                  background: contentType === 'rituals' 
                    ? colors.gradients.primary 
                    : colors.glass.opaque, // More opaque
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: contentType === 'rituals' ? colors.text.onDark : colors.text.primary,
                  fontSize: '14px',
                  fontWeight: contentType === 'rituals' ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: contentType === 'rituals' ? `0 4px 12px ${colors.mystical.glow}60` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}
              >
                <Music 
                  size={16} 
                  color={contentType === 'rituals' ? colors.text.onDark : colors.text.primary}
                  strokeWidth={2.5}
                />
                Rituals
              </button>
              
              {/* Affirmations - More transparent, lighter */}
              <button
                onClick={() => setContentType('affirmations')}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  borderRadius: borderRadius.full,
                  border: `1px solid ${contentType === 'affirmations' ? colors.accent.secondary : colors.glass.border}`,
                  background: contentType === 'affirmations' 
                    ? colors.gradients.secondary 
                    : colors.glass.transparent, // More transparent
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: contentType === 'affirmations' ? colors.text.onDark : colors.text.secondary,
                  fontSize: '14px',
                  fontWeight: contentType === 'affirmations' ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: contentType === 'affirmations' ? `0 4px 12px ${colors.mystical.glow}40` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}
              >
                <Sparkles 
                  size={16} 
                  color={contentType === 'affirmations' ? colors.text.onDark : colors.text.secondary}
                  strokeWidth={2.5}
                />
                Affirmations
              </button>
              
              {/* Meditations - More transparent, lighter */}
              <button
                onClick={() => setContentType('meditations')}
                style={{
                  padding: `${spacing.xs} ${spacing.md}`,
                  borderRadius: borderRadius.full,
                  border: `1px solid ${contentType === 'meditations' ? colors.accent.tertiary : colors.glass.border}`,
                  background: contentType === 'meditations' 
                    ? `linear-gradient(to right, ${colors.accent.tertiary}, ${colors.accent.secondary})`
                    : colors.glass.transparent, // More transparent
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: contentType === 'meditations' ? colors.text.onDark : colors.text.secondary,
                  fontSize: '14px',
                  fontWeight: contentType === 'meditations' ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: contentType === 'meditations' ? `0 4px 12px ${colors.mystical.glow}40` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing.xs,
                }}
              >
                <Brain 
                  size={16} 
                  color={contentType === 'meditations' ? colors.text.onDark : colors.text.secondary}
                  strokeWidth={2.5}
                />
                Meditations
              </button>
            </div>

            <div style={{ flex: 1, maxWidth: '400px' }}>
              <input
                type="text"
                placeholder="Search your library..."
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

          {/* Content Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: spacing.lg,
            }}
          >
            {/* Create New Card */}
            <Link href="/create" style={{ textDecoration: 'none' }}>
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
                    boxShadow: `0 4px 12px ${colors.mystical.glow}60`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(circle at center, ${colors.mystical.glow}40, transparent)`,
                      opacity: 0.6,
                    }}
                  />
                  <span style={{ position: 'relative', zIndex: 1 }}>
                  <Sparkles 
                    size={24} 
                    color={colors.text.onDark}
                    strokeWidth={2.5}
                  />
                </span>
                </div>
                <Typography variant="h3" style={{ marginBottom: spacing.xs, color: colors.text.primary }}>
                  Create New
                </Typography>
                <Typography variant="body" style={{ color: colors.text.secondary }}>
                  Add a new ritual or affirmation
                </Typography>
              </Card>
            </Link>

            {/* Content Cards */}
            {filteredContent.map((item) => (
              <Card
                key={item.id}
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
                  boxShadow: `0 8px 32px ${colors.mystical.glow}40`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                    <Badge variant={getTypeColor(item.type) as any} size="sm">
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
                        boxShadow: `0 4px 12px ${colors.mystical.glow}60`,
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `radial-gradient(circle at center, ${colors.mystical.glow}40, transparent)`,
                          opacity: 0.6,
                        }}
                      />
                      {React.createElement(getTypeIcon(item.type), {
                        size: 20,
                        color: colors.text.onDark,
                        strokeWidth: 2.5,
                        style: { position: 'relative', zIndex: 1 },
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, fontSize: '12px', color: colors.text.tertiary }}>
                    {item.frequency && (
                      <>
                        <span style={{ color: colors.accent.primary }}>{item.frequency}</span>
                        <span>•</span>
                      </>
                    )}
                    <span>{item.duration}</span>
                  </div>
                  {item.lastPlayed && (
                    <div style={{ fontSize: '12px', color: colors.text.tertiary }}>
                      Last played: {new Date(item.lastPlayed).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Hover Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `linear-gradient(to top, ${colors.background.primary}80, transparent)`,
                    borderRadius: borderRadius.md,
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    padding: spacing.md,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                  }}
                  className="hover-overlay"
                >
                  <Button variant="primary" size="sm" style={{ background: colors.gradients.primary }}>
                    Play Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredContent.length === 0 && (
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
              <Typography variant="h3" style={{ marginBottom: spacing.sm, color: colors.text.primary }}>
                No content found
              </Typography>
              <Typography variant="body" style={{ marginBottom: spacing.lg, color: colors.text.secondary }}>
                {searchQuery
                  ? `No items match "${searchQuery}"`
                  : 'Start creating your first ritual or affirmation'}
              </Typography>
              <Link href="/create" style={{ textDecoration: 'none' }}>
                <Button variant="primary" style={{ background: colors.gradients.primary }}>
                  Create New
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* CSS for hover effect */}
        <style jsx>{`
          .hover-overlay {
            pointer-events: none;
          }
          [class*='Card']:hover .hover-overlay {
            opacity: 1;
          }
        `}</style>
    </PageShell>
  );
}
