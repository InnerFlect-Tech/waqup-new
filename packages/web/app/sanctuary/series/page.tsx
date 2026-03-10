'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Plus, Layers, Play, Share2, Eye, EyeOff, Trash2, ArrowRight } from 'lucide-react';
import { useTheme, spacing, borderRadius, BLUR, CONTENT_MAX_WIDTH } from '@/theme';
import { Typography, Button, PageShell } from '@/components';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';

interface ContentSeries {
  id: string;
  title: string;
  description: string | null;
  cover_emoji: string | null;
  is_published: boolean;
  is_listed: boolean;
  play_count: number;
  share_count: number;
  created_at: string;
  item_count?: number;
}

export default function SeriesPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const user = useAuthStore((s) => s.user);
  const [series, setSeries] = useState<ContentSeries[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('content_series')
      .select('id, title, description, cover_emoji, is_published, is_listed, play_count, share_count, created_at')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setSeries(data ?? []);
        setLoading(false);
      });
  }, [user?.id]);

  const handleCreate = async () => {
    if (!newTitle.trim() || !user?.id) return;
    setCreating(true);
    const { data } = await supabase
      .from('content_series')
      .insert({ creator_id: user.id, title: newTitle.trim(), description: newDesc.trim() || null })
      .select()
      .single();
    if (data) {
      setSeries((prev) => [{ ...data, item_count: 0 }, ...prev]);
    }
    setNewTitle('');
    setNewDesc('');
    setCreating(false);
  };

  const handleToggleList = async (s: ContentSeries) => {
    const updated = { is_listed: !s.is_listed, is_published: !s.is_listed || s.is_published };
    await supabase.from('content_series').update(updated).eq('id', s.id);
    setSeries((prev) => prev.map((item) => (item.id === s.id ? { ...item, ...updated } : item)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this series? The individual sessions will not be deleted.')) return;
    await supabase.from('content_series').delete().eq('id', id);
    setSeries((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <PageShell intensity="low" allowDocumentScroll>
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: `${spacing.xxl} ${spacing.xl}` }}>
        <div style={{ marginBottom: spacing.xxl }}>
          <Typography variant="h2" style={{ color: colors.text.primary, fontWeight: 200, letterSpacing: '-0.02em', marginBottom: spacing.xs }}>
            Series
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, fontSize: 14 }}>
            Group your sessions into themed series for drops, courses, and client programmes.
          </Typography>
        </div>

        {/* Create new series */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: spacing.xl,
            borderRadius: borderRadius.xl,
            background: colors.glass.light,
            backdropFilter: BLUR.lg,
            WebkitBackdropFilter: BLUR.lg,
            border: `1px solid ${colors.glass.border}`,
            marginBottom: spacing.xxl,
          }}
        >
          <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 700, marginBottom: spacing.md }}>
            New series
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            <input
              placeholder="Series title — e.g. 7-Day Morning Ritual"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              style={{
                padding: `${spacing.md} ${spacing.lg}`,
                borderRadius: borderRadius.lg,
                background: colors.glass.light,
                border: `1px solid ${colors.glass.border}`,
                color: colors.text.primary,
                fontSize: 14,
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
            <input
              placeholder="Short description (optional)"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              style={{
                padding: `${spacing.md} ${spacing.lg}`,
                borderRadius: borderRadius.lg,
                background: colors.glass.light,
                border: `1px solid ${colors.glass.border}`,
                color: colors.text.primary,
                fontSize: 14,
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
            <Button
              variant="primary"
              size="md"
              onClick={handleCreate}
              loading={creating}
              disabled={!newTitle.trim()}
              style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: spacing.xs }}
            >
              <Plus size={16} />
              Create Series
            </Button>
          </div>
        </motion.div>

        {/* Series list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl }}>
            <Typography variant="body" style={{ color: colors.text.secondary }}>Loading...</Typography>
          </div>
        ) : series.length === 0 ? (
          <div style={{ textAlign: 'center', padding: spacing.xxl, borderRadius: borderRadius.xl, border: `1px dashed ${colors.glass.border}` }}>
            <Layers size={32} color={colors.text.secondary} style={{ marginBottom: spacing.md, opacity: 0.4 }} />
            <Typography variant="body" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
              No series yet
            </Typography>
            <Typography variant="small" style={{ color: colors.text.secondary, opacity: 0.6 }}>
              Create your first series above to group sessions for your audience.
            </Typography>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {series.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: spacing.xl,
                  borderRadius: borderRadius.lg,
                  background: colors.glass.light,
                  backdropFilter: BLUR.lg,
                  WebkitBackdropFilter: BLUR.lg,
                  border: `1px solid ${s.is_listed ? colors.accent.primary + '40' : colors.glass.border}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: spacing.md,
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs, flexWrap: 'wrap' }}>
                    <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 700 }}>
                      {s.cover_emoji} {s.title}
                    </Typography>
                    {s.is_listed && (
                      <span style={{ padding: '2px 8px', borderRadius: borderRadius.full, background: `${colors.accent.primary}20`, border: `1px solid ${colors.accent.primary}40`, fontSize: 10, fontWeight: 700, color: colors.accent.primary, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                        Listed
                      </span>
                    )}
                  </div>
                  {s.description && (
                    <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 13, marginBottom: spacing.sm }}>
                      {s.description}
                    </Typography>
                  )}
                  <div style={{ display: 'flex', gap: spacing.lg, flexWrap: 'wrap' }}>
                    <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12 }}>
                      <Play size={11} style={{ display: 'inline' as const, marginRight: 3 }} />
                      {s.play_count} plays
                    </Typography>
                    <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 12 }}>
                      <Share2 size={11} style={{ display: 'inline' as const, marginRight: 3 }} />
                      {s.share_count} shares
                    </Typography>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: spacing.sm, alignItems: 'center', flexShrink: 0 }}>
                  <Link href={`/sanctuary/series/${s.id}`} style={{ textDecoration: 'none' }}>
                    <button style={{ padding: `${spacing.sm} ${spacing.md}`, borderRadius: borderRadius.md, background: colors.glass.light, border: `1px solid ${colors.glass.border}`, color: colors.text.secondary, cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                      Edit <ArrowRight size={12} />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleToggleList(s)}
                    style={{ padding: `${spacing.sm} ${spacing.md}`, borderRadius: borderRadius.md, background: s.is_listed ? `${colors.accent.primary}15` : colors.glass.light, border: `1px solid ${s.is_listed ? colors.accent.primary + '40' : colors.glass.border}`, color: s.is_listed ? colors.accent.primary : colors.text.secondary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: spacing.xs, fontSize: 13 }}
                  >
                    {s.is_listed ? <Eye size={14} /> : <EyeOff size={14} />}
                    {s.is_listed ? 'Listed' : 'List'}
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    style={{ padding: spacing.sm, borderRadius: borderRadius.md, background: 'transparent', border: 'none', color: colors.text.secondary, cursor: 'pointer', opacity: 0.5 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
