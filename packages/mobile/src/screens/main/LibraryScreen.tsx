import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList, ContentItemType } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button, Loading } from '@/components';
import { useContent } from '@/hooks';
import { CONTENT_TYPE_COLORS } from '@waqup/shared/constants';

type FilterType = 'all' | ContentItemType;

const FILTERS: Array<{ key: FilterType; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'affirmation', label: 'Affirmations' },
  { key: 'meditation', label: 'Meditations' },
  { key: 'ritual', label: 'Rituals' },
];


export default function LibraryScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search to avoid re-filtering on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const queryType = activeFilter === 'all' ? undefined : activeFilter;
  const { data: allItems = [], isLoading, error } = useContent(queryType);

  const filteredItems = allItems.filter((item) =>
    debouncedQuery
      ? item.title.toLowerCase().includes(debouncedQuery.toLowerCase())
      : true,
  );

  const isEmpty = filteredItems.length === 0;

  const renderItem = useCallback(({ item }: { item: (typeof filteredItems)[number] }) => {
    const tc = CONTENT_TYPE_COLORS[item.type as keyof typeof CONTENT_TYPE_COLORS] ?? colors.accent.primary;
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('ContentDetail', { contentId: item.id, contentType: item.type })}
      >
        <Card
          variant="default"
          style={[styles.itemCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}
        >
          <View style={[styles.typeIndicator, { backgroundColor: tc }]} />
          <View style={{ flex: 1 }}>
            <Typography variant="captionBold" style={{ color: colors.text.primary, marginBottom: 2 }}>
              {item.title}
            </Typography>
            <Typography variant="small" style={{ color: tc, textTransform: 'capitalize', fontSize: 11 }}>
              {item.type}
            </Typography>
          </View>
          <Typography variant="body" style={{ color: colors.text.secondary }}>→</Typography>
        </Card>
      </TouchableOpacity>
    );
  }, [colors, navigation]);

  return (
    <Screen scrollable={false} padding={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: spacing.xl }]}>
          <View>
            <Typography
              variant="h1"
              style={{ color: colors.text.primary, fontWeight: '300', letterSpacing: -1 }}
            >
              Library
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
              Your practices in one place
            </Typography>
          </View>
        </View>

        {/* Search bar */}
        <View style={[styles.searchContainer, { marginHorizontal: spacing.xl }]}>
          <View
            style={[
              styles.searchInput,
              { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border },
            ]}
          >
            <Typography variant="body" style={{ color: colors.text.secondary, marginRight: spacing.sm }}>
              🔍
            </Typography>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search your library..."
              placeholderTextColor={colors.text.secondary}
              style={[styles.textInput, { color: colors.text.primary }]}
            />
          </View>
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
          style={styles.filtersScroll}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setActiveFilter(filter.key)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.filterChip,
                  {
                    backgroundColor:
                      activeFilter === filter.key
                        ? colors.accent.primary
                        : colors.glass.opaque,
                    borderColor:
                      activeFilter === filter.key
                        ? colors.accent.primary
                        : colors.glass.border,
                  },
                ]}
              >
                <Typography
                  variant="captionBold"
                  style={{
                    color:
                      activeFilter === filter.key
                        ? colors.text.onDark
                        : colors.text.secondary,
                  }}
                >
                  {filter.label}
                </Typography>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content — FlatList for performance */}
        {isLoading ? (
          <View style={{ alignItems: 'center', paddingTop: spacing.xxl, flex: 1 }}>
            <Loading variant="spinner" size="lg" />
          </View>
        ) : error ? (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
            <Card
              variant="default"
              style={[styles.emptyCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}
            >
              <Typography variant="h2" style={{ fontSize: 40, marginBottom: spacing.md }}>⚠️</Typography>
              <Typography variant="h4" style={{ color: colors.text.primary, textAlign: 'center' }}>
                Could not load library
              </Typography>
              <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm }}>
                {error.message}
              </Typography>
            </Card>
          </ScrollView>
        ) : isEmpty ? (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
            <Card
              variant="default"
              style={[
                styles.emptyCard,
                { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border },
              ]}
            >
              <Typography variant="h2" style={{ fontSize: 48, marginBottom: spacing.md }}>
                📚
              </Typography>
              <Typography
                variant="h3"
                style={{ color: colors.text.primary, marginBottom: spacing.sm, textAlign: 'center' }}
              >
                {debouncedQuery
                  ? 'No results found'
                  : activeFilter !== 'all'
                  ? `No ${activeFilter}s yet`
                  : 'Your library is empty'}
              </Typography>
              <Typography
                variant="body"
                style={{
                  color: colors.text.secondary,
                  textAlign: 'center',
                  marginBottom: spacing.xl,
                  lineHeight: 22,
                }}
              >
                {debouncedQuery
                  ? 'Try different keywords or clear the search'
                  : 'Create your first practice and it will appear here'}
              </Typography>
              {!debouncedQuery && (
                <Button variant="primary" size="md" onPress={() => navigation.navigate('ContentCreate', { contentType: 'affirmation', mode: 'chat' })}>
                  Create Practice
                </Button>
              )}
            </Card>
          </ScrollView>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            windowSize={5}
            maxToRenderPerBatch={10}
            initialNumToRender={8}
            removeClippedSubviews
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  searchContainer: {
    marginBottom: spacing.md,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  filtersScroll: {
    flexGrow: 0,
    marginBottom: spacing.lg,
  },
  filtersContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingTop: 0,
    paddingBottom: spacing.xxxl,
  },
  emptyCard: {
    padding: spacing.xxl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
  itemCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  typeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
});
