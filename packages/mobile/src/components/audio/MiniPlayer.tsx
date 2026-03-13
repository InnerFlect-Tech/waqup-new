/**
 * MiniPlayer — Persistent bar above tab bar when playback is active.
 * Tap to open full ContentDetailScreen; play/pause control.
 */
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, spacing, borderRadius, layout } from '@/theme';
import { Typography } from '@/components/ui';
import { usePlaybackStore } from '@/stores';
const MINI_PLAYER_HEIGHT = 56;

export function MiniPlayer() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const currentItem = usePlaybackStore((s) => s.currentItem);
  const playbackState = usePlaybackStore((s) => s.playbackState);
  const play = usePlaybackStore((s) => s.play);
  const pause = usePlaybackStore((s) => s.pause);

  const isVisible =
    currentItem !== null &&
    (playbackState === 'playing' || playbackState === 'paused');

  if (!isVisible || !currentItem) return null;

  const isPlaying = playbackState === 'playing';

  const handlePress = () => {
    (navigation as { navigate: (a: string, b?: { screen: string; params: { contentId: string; contentType: string } }) => void }).navigate('Main', {
      screen: 'ContentDetail',
      params: {
        contentId: currentItem.id,
        contentType: currentItem.contentType,
      },
    });
  };

  const handlePlayPause = () => {
    void (isPlaying ? pause() : play());
  };

  const bottomOffset = layout.tabBarHeight + insets.bottom;

  return (
    <View
      style={[
        styles.container,
        {
          bottom: bottomOffset,
          height: MINI_PLAYER_HEIGHT,
          borderRadius: borderRadius.xl,
          overflow: 'hidden',
        },
      ]}
      pointerEvents="box-none"
    >
      <TouchableOpacity
        style={styles.touchable}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        <View
          style={[
            styles.inner,
            {
              backgroundColor: colors.glass.opaque,
              borderColor: colors.glass.border,
            },
          ]}
        >
          <View style={styles.content}>
            <Typography
              variant="bodyBold"
              style={[styles.title, { color: colors.text.primary }]}
              numberOfLines={1}
            >
              {currentItem.title}
            </Typography>
            <TouchableOpacity
              onPress={handlePlayPause}
              activeOpacity={0.8}
              style={[styles.playBtn, { backgroundColor: colors.accent.primary }]}
            >
              <Typography style={[styles.playIcon, { color: colors.text.onDark }]}>
                {isPlaying ? '⏸' : '▶'}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
  },
  touchable: {
    flex: 1,
    borderRadius: borderRadius.xl,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  title: {
    flex: 1,
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 16,
  },
});
