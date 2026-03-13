/**
 * CreateMenuSheet — Spotify-style bottom sheet for create options.
 * Maps 1:1 from CreateEntryScreen: Rituals, Affirmations, Meditations.
 */
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Typography } from '@/components';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { CONTENT_TYPE_COPY, CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import type { ContentItemType } from '@waqup/shared/types';
import type { MainStackParamList } from '@/navigation/types';

const CREATE_ORDER: ContentItemType[] = ['ritual', 'affirmation', 'meditation'];

const TYPE_ICONS: Record<ContentItemType, string> = {
  affirmation: '✨',
  meditation: '🧘',
  ritual: '🔮',
};

export interface CreateMenuSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateMenuSheet({ visible, onClose }: CreateMenuSheetProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleSelect = (contentType: ContentItemType) => {
    onClose();
    // Drawer context: navigate to Main stack's ContentCreate
    (navigation as { navigate: (name: string, params?: object) => void }).navigate('Main', {
      screen: 'ContentCreate',
      params: { contentType, mode: 'chat' },
    });
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height="45%" showHandle>
      <View style={styles.content}>
        <Typography variant="h4" style={[styles.title, { color: colors.text.primary }]}>
          Create
        </Typography>
        <Typography variant="caption" style={[styles.subtitle, { color: colors.text.secondary }]}>
          Choose what you'd like to create
        </Typography>

        {CREATE_ORDER.map((contentType) => {
          const copy = CONTENT_TYPE_COPY[contentType];
          const accentColor = CONTENT_TYPE_COLORS[contentType];
          return (
            <TouchableOpacity
              key={contentType}
              style={[
                styles.row,
                { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border },
              ]}
              onPress={() => handleSelect(contentType)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconTile, { backgroundColor: `${accentColor}30` }]}>
                <Typography style={[styles.iconText, { color: accentColor }]}>
                  {TYPE_ICONS[contentType]}
                </Typography>
              </View>
              <View style={styles.rowText}>
                <Typography variant="bodyBold" style={{ color: colors.text.primary }}>
                  {copy.label}s
                </Typography>
                <Typography variant="caption" style={{ color: colors.text.secondary, marginTop: 2 }}>
                  {copy.depth}
                </Typography>
              </View>
              <Typography style={{ color: accentColor, fontSize: 18 }}>›</Typography>
            </TouchableOpacity>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
    gap: spacing.md,
    minHeight: 72,
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  rowText: {
    flex: 1,
  },
});
