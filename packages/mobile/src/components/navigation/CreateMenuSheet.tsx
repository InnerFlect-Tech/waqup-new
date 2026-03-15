/**
 * CreateMenuSheet — Spotify-style bottom sheet for create options.
 * Maps 1:1 from CreateEntryScreen: Rituals, Affirmations, Meditations.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Typography, ListRow } from '@/components';
import { BottomSheet } from '@/components/layout/BottomSheet';
import { CONTENT_TYPE_COPY, CONTENT_TYPE_COLORS } from '@waqup/shared/constants';
import type { ContentItemType } from '@waqup/shared/types';
import type { MainStackParamList } from '@/navigation/types';

const CREATE_ORDER: ContentItemType[] = ['ritual', 'affirmation', 'meditation'];

const TYPE_ICONS: Record<ContentItemType, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  affirmation: 'white-balance-sunny',
  meditation: 'meditation',
  ritual: 'crystal-ball',
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
            <View key={contentType} style={[styles.rowWrap, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
              <ListRow
                icon={TYPE_ICONS[contentType]}
                iconColor={accentColor}
                label={`${copy.label}s`}
                description={copy.depth}
                chevron
                onPress={() => handleSelect(contentType)}
                children={
                  <MaterialCommunityIcons name="chevron-right" size={20} color={accentColor} />
                }
              />
            </View>
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
  rowWrap: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
});
