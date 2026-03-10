import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Share,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button } from '@/components';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';

type ContentType = 'affirmation' | 'meditation' | 'ritual';
type SortType = 'trending' | 'recent' | 'top';
type FilterType = 'all' | ContentType;

interface MarketplaceItem {
  id: string;
  contentItemId: string;
  title: string;
  type: ContentType;
  creatorName: string;
  duration: string | null;
  playCount: number;
  shareCount: number;
  isElevated: boolean;
}

const FILTERS: Array<{ key: FilterType; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'affirmation', label: 'Affirmations' },
  { key: 'meditation', label: 'Meditations' },
  { key: 'ritual', label: 'Rituals' },
];

const SORTS: Array<{ key: SortType; label: string }> = [
  { key: 'trending', label: 'Trending' },
  { key: 'recent', label: 'Recent' },
  { key: 'top', label: 'Top' },
];

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://waqup.app';

async function fetchMarketplaceItems(params: {
  type?: ContentType;
  sort: SortType;
  limit?: number;
  offset?: number;
}): Promise<MarketplaceItem[]> {
  const url = new URL(`${API_BASE}/api/marketplace/items`);
  if (params.type) url.searchParams.set('type', params.type);
  url.searchParams.set('sort', params.sort);
  url.searchParams.set('limit', String(params.limit ?? 20));
  url.searchParams.set('offset', String(params.offset ?? 0));

  const res = await fetch(url.toString());
  if (!res.ok) return [];
  const data = await res.json();
  const rawItems = (data.items ?? data ?? []) as Array<Record<string, unknown> & {
    content_items?: { title?: string; type?: string; duration?: string | null };
    profiles?: { preferred_name?: string };
  }>;
  return rawItems.map((item) => ({
    id: (item.id ?? '') as string,
    contentItemId: (item.content_item_id ?? item.contentItemId ?? '') as string,
    title: (item.title ?? item.content_items?.title ?? 'Untitled') as string,
    type: (item.type ?? item.content_items?.type ?? 'affirmation') as ContentType,
    creatorName: (item.creator_name ?? item.profiles?.preferred_name ?? 'Creator') as string,
    duration: (item.duration ?? item.content_items?.duration ?? null) as string | null,
    playCount: (item.play_count ?? 0) as number,
    shareCount: (item.share_count ?? 0) as number,
    isElevated: (item.is_elevated ?? false) as boolean,
  }));
}

async function recordShare(contentItemId: string, platform: string) {
  try {
    await fetch(`${API_BASE}/api/marketplace/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentItemId, platform: 'other' }),
    });
  } catch {
    // non-critical
  }
}

export default function MarketplaceScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeSort, setActiveSort] = useState<SortType>('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadItems = useCallback(
    async (reset = true) => {
      const offset = reset ? 0 : items.length;
      if (!reset) setLoadingMore(true);

      try {
        const data = await fetchMarketplaceItems({
          type: activeFilter === 'all' ? undefined : activeFilter,
          sort: activeSort,
          limit: 20,
          offset,
        });

        if (reset) {
          setItems(data);
        } else {
          setItems((prev) => [...prev, ...data]);
        }
        setHasMore(data.length === 20);
      } catch {
        // silent
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [activeFilter, activeSort, items.length],
  );

  useEffect(() => {
    setLoading(true);
    loadItems(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, activeSort]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadItems(true);
  }, [loadItems]);

  const handleShare = useCallback(async (item: MarketplaceItem) => {
    const url = `https://waqup.app/play/${item.contentItemId}`;
    await Share.share({
      message: `"${item.title}" by ${item.creatorName} on waQup\n${url}`,
      url,
    });
    await recordShare(item.contentItemId, 'native_share');
  }, []);

  const filteredItems = searchQuery.trim()
    ? items.filter((i) => i.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  const elevatedItems = filteredItems.filter((i) => i.isElevated);
  const regularItems = filteredItems.filter((i) => !i.isElevated);

  const renderItem = useCallback(
    ({ item }: { item: MarketplaceItem }) => {
      const tc = CONTENT_TYPE_COLORS[item.type] ?? colors.accent.primary;
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ContentDetail', { contentId: item.contentItemId, contentType: item.type })}
        >
          <Card variant="default" style={[styles.itemCard, { backgroundColor: colors.glass.opaque, borderColor: tc + '30' }]}>
            {item.isElevated && (
              <View style={[styles.elevatedBadge, { backgroundColor: '#F59E0B22', borderColor: '#F59E0B40' }]}>
                <Typography variant="small" style={{ color: '#F59E0B', fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Curated
                </Typography>
              </View>
            )}
            <View style={[styles.typeBar, { backgroundColor: tc }]} />
            <View style={styles.itemBody}>
              <View style={styles.itemInfo}>
                <Typography variant="captionBold" style={{ color: colors.text.primary, marginBottom: 2, fontSize: 14 }}>
                  {item.title}
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 11, marginBottom: 6 }}>
                  by {item.creatorName}
                </Typography>
                <View style={styles.statsRow}>
                  <Typography variant="small" style={{ color: tc, fontSize: 10, fontWeight: '700', textTransform: 'capitalize' }}>
                    {item.type}
                  </Typography>
                  {item.duration && (
                    <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 10 }}>
                      · {item.duration}
                    </Typography>
                  )}
                  <Typography variant="small" style={{ color: colors.text.secondary, fontSize: 10 }}>
                    · {item.playCount} plays
                  </Typography>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleShare(item)}
                style={[styles.shareBtn, { borderColor: tc + '40', backgroundColor: tc + '15' }]}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Typography variant="small" style={{ color: tc, fontSize: 11, fontWeight: '600' }}>
                  Share
                </Typography>
              </TouchableOpacity>
            </View>
          </Card>
        </TouchableOpacity>
      );
    },
    [colors, navigation, handleShare],
  );

  return (
    <Screen>
      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search practices..."
          placeholderTextColor={colors.text.secondary}
          style={[styles.searchInput, { color: colors.text.primary }]}
        />
      </View>

      {/* Filter chips */}
      <FlatList
        data={FILTERS}
        keyExtractor={(i) => i.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        renderItem={({ item: f }) => {
          const isActive = activeFilter === f.key;
          return (
            <TouchableOpacity
              onPress={() => setActiveFilter(f.key)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? colors.accent.primary + '22' : colors.glass.opaque,
                  borderColor: isActive ? colors.accent.primary : colors.glass.border,
                },
              ]}
            >
              <Typography
                variant="small"
                style={{ color: isActive ? colors.accent.primary : colors.text.secondary, fontSize: 12, fontWeight: isActive ? '700' : '400' }}
              >
                {f.label}
              </Typography>
            </TouchableOpacity>
          );
        }}
      />

      {/* Sort chips */}
      <FlatList
        data={SORTS}
        keyExtractor={(i) => i.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.filterRow, { paddingTop: 0 }]}
        renderItem={({ item: s }) => {
          const isActive = activeSort === s.key;
          return (
            <TouchableOpacity
              onPress={() => setActiveSort(s.key)}
              style={[
                styles.chip,
                { paddingHorizontal: 10, paddingVertical: 4 },
                {
                  backgroundColor: isActive ? colors.accent.secondary + '22' : 'transparent',
                  borderColor: isActive ? colors.accent.secondary : colors.glass.border,
                },
              ]}
            >
              <Typography
                variant="small"
                style={{ color: isActive ? colors.accent.secondary : colors.text.secondary, fontSize: 11, fontWeight: isActive ? '700' : '400' }}
              >
                {s.label}
              </Typography>
            </TouchableOpacity>
          );
        }}
      />

      {/* Main list */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent.primary} />
        </View>
      ) : (
        <FlatList
          data={[
            ...(elevatedItems.length > 0 ? [{ type: 'section', title: 'Curated by waQup', items: elevatedItems }] : []),
            ...(regularItems.length > 0 ? [{ type: 'section', title: 'All practices', items: regularItems }] : []),
          ]}
          keyExtractor={(_, index) => String(index)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent.primary} />}
          onEndReached={() => { if (hasMore && !loadingMore) void loadItems(false); }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.accent.primary} style={{ marginVertical: 16 }} /> : null}
          renderItem={({ item: section }) => {
            if (!('items' in section)) return null;
            return (
              <View>
                <Typography
                  variant="small"
                  style={{ color: colors.text.secondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm, marginHorizontal: spacing.md }}
                >
                  {section.title}
                </Typography>
                {section.items.map((item) => (
                  <View key={item.id}>
                    {renderItem({ item })}
                  </View>
                ))}
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center' }}>
                No practices found
              </Typography>
            </View>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  searchInput: {
    fontSize: 14,
  },
  filterRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: spacing.xs,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  itemCard: {
    marginBottom: spacing.sm,
    padding: 0,
    overflow: 'hidden',
    flexDirection: 'row',
    borderWidth: 1,
  },
  elevatedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    zIndex: 1,
  },
  typeBar: {
    width: 4,
    borderRadius: 4,
    marginVertical: 12,
    marginLeft: 12,
    marginRight: 0,
  },
  itemBody: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemInfo: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  shareBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    flexShrink: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  empty: {
    paddingTop: 60,
    alignItems: 'center',
  },
});
