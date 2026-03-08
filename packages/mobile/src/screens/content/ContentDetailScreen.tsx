import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Badge, Button } from '@/components';
import { AudioPlayer } from '@/components/audio';
import { useContentItem } from '@/hooks';

type Props = NativeStackScreenProps<MainStackParamList, 'ContentDetail'>;

const TYPE_CONFIG = {
  affirmation: { icon: '✨', color: '#c084fc', label: 'Affirmation' },
  meditation: { icon: '🧘', color: '#60a5fa', label: 'Meditation' },
  ritual: { icon: '🔮', color: '#34d399', label: 'Ritual' },
};

export default function ContentDetailScreen({ navigation, route }: Props) {
  const { contentId, contentType } = route.params;
  const { theme } = useTheme();
  const colors = theme.colors;
  const config = TYPE_CONFIG[contentType];
  const { data: item, isLoading } = useContentItem(contentId);

  return (
    <Screen scrollable padding={false}>
      {/* Nav bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Typography variant="body" style={{ color: colors.accent.primary }}>
            ← Back
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8}>
          <Typography variant="body" style={{ color: colors.text.secondary }}>
            Edit
          </Typography>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.typeIcon, { backgroundColor: config.color + '22' }]}>
            <Typography variant="h1" style={{ fontSize: 40 }}>
              {config.icon}
            </Typography>
          </View>
          <Badge
            variant="info"
            style={{ marginTop: spacing.md, alignSelf: 'flex-start' }}
          >
            {config.label}
          </Badge>
          <Typography
            variant="h1"
            style={{ color: colors.text.primary, fontWeight: '300', letterSpacing: -1, marginTop: spacing.md }}
          >
            {isLoading ? 'Loading...' : item?.title ?? 'Untitled'}
          </Typography>
          {item?.description ? (
            <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.sm }}>
              {item.description}
            </Typography>
          ) : null}
        </View>

        {/* Placeholder audio player */}
        <Card
          variant="default"
          style={[styles.playerCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}
        >
          <AudioPlayer
            layers={{ voiceUrl: item?.audioUrl ?? null }}
            accentColor={config.color}
            showVolumeControls
            showSpeedControls
          />
        </Card>

        {/* Metadata */}
        <View style={styles.metaSection}>
          <Typography variant="small" style={styles.sectionLabel}>
            DETAILS
          </Typography>
          <Card
            variant="default"
            style={[styles.metaCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}
          >
            <View style={styles.metaRow}>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Duration</Typography>
              <Typography variant="captionBold" style={{ color: colors.text.primary }}>—</Typography>
            </View>
            <View style={[styles.metaDivider, { backgroundColor: colors.glass.border }]} />
            <View style={styles.metaRow}>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Voice</Typography>
              <Typography variant="captionBold" style={{ color: colors.text.primary }}>—</Typography>
            </View>
            <View style={[styles.metaDivider, { backgroundColor: colors.glass.border }]} />
            <View style={styles.metaRow}>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Created</Typography>
              <Typography variant="captionBold" style={{ color: colors.text.primary }}>—</Typography>
            </View>
          </Card>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button variant="outline" size="md" fullWidth>
            Share
          </Button>
          <Button
            variant="outline"
            size="md"
            fullWidth
            style={{ borderColor: colors.error, marginTop: spacing.md }}
          >
            Delete
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  typeIcon: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  playerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  metaSection: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    color: '#ffffff55',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  metaCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  metaDivider: {
    height: 1,
  },
  actions: {
    marginTop: spacing.md,
  },
});
