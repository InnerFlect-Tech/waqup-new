'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { Plus, GripVertical, Trash2, ArrowLeft, Share2 } from 'lucide-react';
import { useTheme, spacing, borderRadius, BLUR, CONTENT_MAX_WIDTH } from '@/theme';
import { Typography, Button, PageShell } from '@/components';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores';
import { ShareModal } from '@/components/marketplace';
import { Link } from '@/i18n/navigation';

interface SeriesItem {
  id: string;
  content_item_id: string;
  order_index: number;
  title: string;
  type: string;
  duration: string | null;
}

interface ContentSeries {
  id: string;
  title: string;
  description: string | null;
  cover_emoji: string | null;
  is_published: boolean;
  is_listed: boolean;
}

interface OwnedContent {
  id: string;
  title: string;
  type: string;
  duration: string | null;
}

const TYPE_COLOR: Record<string, string> = {
  affirmation: '#c084fc',
  meditation: '#60a5fa',
  ritual: '#34d399',
};

export default function SeriesDetailPage() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const params = useParams();
  const id = params.id as string;
  const user = useAuthStore((s) => s.user);

  const [series, setSeries] = useState<ContentSeries | null>(null);
  const [items, setItems] = useState<SeriesItem[]>([]);
  const [ownedContent, setOwnedContent] = useState<OwnedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !user?.id) return;

    const loadData = async () => {
      const [seriesRes, itemsRes, contentRes] = await Promise.all([
        supabase.from('content_series').select('*').eq('id', id).single(),
        supabase
          .from('content_series_items')
          .select('id, content_item_id, order_index, content_items(id, title, type, duration)')
          .eq('series_id', id)
          .order('order_index'),
        supabase
          .from('content_items')
          .select('id, title, type, duration')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ]);

      if (seriesRes.data) setSeries(seriesRes.data);

      if (itemsRes.data) {
        const mapped: SeriesItem[] = itemsRes.data.map((row) => {
          const ci = row.content_items as { id: string; title: string; type: string; duration: string | null } | null;
          return {
            id: row.id as string,
            content_item_id: row.content_item_id as string,
            order_index: row.order_index as number,
            title: ci?.title ?? 'Untitled',
            type: ci?.type ?? 'affirmation',
            duration: ci?.duration ?? null,
          };
        });
        setItems(mapped);
      }

      if (contentRes.data) setOwnedContent(contentRes.data);
      setLoading(false);
    };

    loadData();
  }, [id, user?.id]);

  const handleSaveField = async (field: 'title' | 'description' | 'cover_emoji', value: string) => {
    if (!series) return;
    await supabase.from('content_series').update({ [field]: value }).eq('id', series.id);
    setSeries((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleAddItem = async (contentId: string) => {
    if (!series) return;
    setAddingId(contentId);
    const nextOrder = items.length;
    const contentMeta = ownedContent.find((c) => c.id === contentId);
    const { data } = await supabase
      .from('content_series_items')
      .insert({ series_id: series.id, content_item_id: contentId, order_index: nextOrder })
      .select('id, content_item_id, order_index')
      .single();
    if (data) {
      setItems((prev) => [...prev, {
        id: data.id as string,
        content_item_id: data.content_item_id as string,
        order_index: data.order_index as number,
        title: contentMeta?.title ?? 'Untitled',
        type: contentMeta?.type ?? 'affirmation',
        duration: contentMeta?.duration ?? null,
      }]);
    }
    setAddingId(null);
  };

  const handleRemoveItem = async (itemId: string) => {
    await supabase.from('content_series_items').delete().eq('id', itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  const handlePublish = async () => {
    if (!series) return;
    setSaving(true);
    const updated = { is_published: true, is_listed: true };
    await supabase.from('content_series').update(updated).eq('id', series.id);
    setSeries((prev) => prev ? { ...prev, ...updated } : prev);
    setSaving(false);
  };

  const alreadyInSeries = new Set(items.map((i) => i.content_item_id));
  const availableToAdd = ownedContent.filter((c) => !alreadyInSeries.has(c.id));

  if (loading || !series) {
    return (
      <PageShell intensity="low" allowDocumentScroll>
        <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: `${spacing.xxl} ${spacing.xl}`, textAlign: 'center' }}>
          <Typography variant="body" style={{ color: colors.text.secondary }}>Loading...</Typography>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell intensity="low" allowDocumentScroll>
      <div style={{ maxWidth: CONTENT_MAX_WIDTH, margin: '0 auto', padding: `${spacing.xxl} ${spacing.xl}` }}>
        <Link href="/sanctuary/series" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: spacing.xs, color: colors.text.secondary, fontSize: 13, marginBottom: spacing.xl }}>
          <ArrowLeft size={14} />
          All series
        </Link>

        {/* Series header */}
        <div style={{ marginBottom: spacing.xxl }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' }}>
            <input
              defaultValue={series.cover_emoji ?? '🎵'}
              onBlur={(e) => handleSaveField('cover_emoji', e.target.value)}
              style={{ fontSize: 32, background: 'none', border: 'none', outline: 'none', width: 48, cursor: 'text' }}
            />
            <input
              defaultValue={series.title}
              onBlur={(e) => handleSaveField('title', e.target.value)}
              style={{ flex: 1, minWidth: 200, fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 200, letterSpacing: '-0.02em', background: 'none', border: 'none', borderBottom: `1px solid ${colors.glass.border}`, outline: 'none', color: colors.text.primary, padding: `${spacing.xs} 0` }}
            />
          </div>
          <input
            defaultValue={series.description ?? ''}
            placeholder="Short description..."
            onBlur={(e) => handleSaveField('description', e.target.value)}
            style={{ width: '100%', padding: `${spacing.sm} 0`, background: 'none', border: 'none', borderBottom: `1px solid ${colors.glass.border}`, outline: 'none', color: colors.text.secondary, fontSize: 14, boxSizing: 'border-box' as const }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: spacing.xxl, alignItems: 'start' }}>
          {/* Left: session order */}
          <div>
            <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 700, marginBottom: spacing.lg }}>
              Sessions in this series ({items.length})
            </Typography>

            {items.length === 0 ? (
              <div style={{ padding: spacing.xl, borderRadius: borderRadius.lg, border: `1px dashed ${colors.glass.border}`, textAlign: 'center' }}>
                <Typography variant="small" style={{ color: colors.text.secondary, opacity: 0.6 }}>
                  Add sessions from your library →
                </Typography>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {items.map((item, idx) => {
                  const tc = TYPE_COLOR[item.type] ?? colors.accent.primary;
                  return (
                    <div
                      key={item.id}
                      style={{ padding: `${spacing.md} ${spacing.lg}`, borderRadius: borderRadius.lg, background: colors.glass.light, backdropFilter: BLUR.md, WebkitBackdropFilter: BLUR.md, border: `1px solid ${colors.glass.border}`, display: 'flex', alignItems: 'center', gap: spacing.md }}
                    >
                      <GripVertical size={14} color={colors.text.secondary} style={{ opacity: 0.4, flexShrink: 0 }} />
                      <div style={{ width: 6, height: 32, borderRadius: 3, background: tc, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="small" style={{ color: colors.text.primary, fontWeight: 600, fontSize: 13 }}>
                          {idx + 1}. {item.title}
                        </Typography>
                        <Typography variant="small" style={{ color: tc, fontSize: 11, textTransform: 'capitalize' as const }}>
                          {item.type}{item.duration ? ` · ${item.duration}` : ''}
                        </Typography>
                      </div>
                      <button onClick={() => handleRemoveItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.text.secondary, opacity: 0.5, padding: spacing.xs }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: add from library */}
          <div>
            <Typography variant="body" style={{ color: colors.text.primary, fontWeight: 700, marginBottom: spacing.lg }}>
              Add from your library
            </Typography>

            {availableToAdd.length === 0 ? (
              <Typography variant="small" style={{ color: colors.text.secondary, opacity: 0.6 }}>
                All your sessions are already in this series.
              </Typography>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {availableToAdd.map((content) => {
                  const tc = TYPE_COLOR[content.type] ?? colors.accent.primary;
                  return (
                    <div key={content.id} style={{ padding: `${spacing.md} ${spacing.lg}`, borderRadius: borderRadius.lg, background: colors.glass.light, border: `1px solid ${colors.glass.border}`, display: 'flex', alignItems: 'center', gap: spacing.md }}>
                      <div style={{ width: 6, height: 32, borderRadius: 3, background: tc, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="small" style={{ color: colors.text.primary, fontWeight: 600, fontSize: 13 }}>{content.title}</Typography>
                        <Typography variant="small" style={{ color: tc, fontSize: 11, textTransform: 'capitalize' as const }}>{content.type}</Typography>
                      </div>
                      <button
                        onClick={() => handleAddItem(content.id)}
                        disabled={addingId === content.id}
                        style={{ padding: `${spacing.xs} ${spacing.sm}`, borderRadius: borderRadius.md, background: `${tc}18`, border: `1px solid ${tc}30`, color: tc, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Plus size={12} />
                        Add
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Publish / share bar */}
        <div style={{ marginTop: spacing.xxl, padding: spacing.lg, borderRadius: borderRadius.lg, background: colors.glass.light, backdropFilter: BLUR.md, WebkitBackdropFilter: BLUR.md, border: `1px solid ${colors.glass.border}`, display: 'flex', gap: spacing.md, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 13 }}>
              {series.is_listed
                ? 'This series is listed on the marketplace. Share the link to earn Qs.'
                : `Publish to make this series discoverable. ${items.length} session${items.length !== 1 ? 's' : ''} will be visible.`}
            </Typography>
          </div>
          {series.is_listed ? (
            <Button variant="ghost" size="sm" onClick={() => setShareOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xs }}>
              <Share2 size={14} />
              Share series
            </Button>
          ) : (
            <Button variant="primary" size="sm" loading={saving} disabled={items.length === 0} onClick={handlePublish}>
              Publish series
            </Button>
          )}
        </div>
      </div>

      {series.is_listed && (
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          contentId={series.id}
          title={series.title}
          contentType="ritual"
        />
      )}
    </PageShell>
  );
}
