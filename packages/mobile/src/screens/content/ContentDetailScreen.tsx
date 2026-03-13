/**
 * ContentDetailScreen — Premium ritual playback experience.
 * Orb-centered, minimal, audio-first. Works with playbackStore + MiniPlayer.
 */
import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Loading } from '@/components';
import { VoiceOrb } from '@/components/audio';
import { useContentItem } from '@/hooks';
import { usePlaybackStore } from '@/stores';
import { formatTime } from '@waqup/shared/utils';
import { API_BASE_URL } from '@/constants/app';
import { CONTENT_TYPE_COPY } from '@waqup/shared/constants';

type Props = NativeStackScreenProps<MainStackParamList, 'ContentDetail'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
// Orb: 52% of width, cap at 220, min 140 for 320px
const ORB_SIZE = Math.min(Math.max(SCREEN_WIDTH * 0.52, 140), 220);
const PADDING_H = Math.max(spacing.lg, SCREEN_WIDTH * 0.06);

export default function ContentDetailScreen({ navigation, route }: Props) {
  const { contentId, contentType } = route.params;
  const { theme } = useTheme();
  const colors = theme.colors;
  const { data: item, isLoading } = useContentItem(contentId);

  const currentItem = usePlaybackStore((s) => s.currentItem);
  const playbackState = usePlaybackStore((s) => s.playbackState);
  const position = usePlaybackStore((s) => s.position);
  const play = usePlaybackStore((s) => s.play);
  const pause = usePlaybackStore((s) => s.pause);
  const seek = usePlaybackStore((s) => s.seek);
  const setCurrentItem = usePlaybackStore((s) => s.setCurrentItem);

  useEffect(() => {
    if (item && currentItem?.id !== contentId) {
      setCurrentItem(item);
    }
  }, [item, contentId, currentItem?.id, setCurrentItem]);

  if (isLoading || !item) {
    return (
      <Screen scrollable={false} padding={false}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xxl }]}>
          <Loading variant="spinner" size="lg" />
        </View>
      </Screen>
    );
  }

  const isPlaying = playbackState === 'playing';
  const hasVoice = !!(item?.voiceUrl ?? item?.audioUrl);
  const isAudioLoading = playbackState === 'loading' || (hasVoice && playbackState === 'idle');
  const progress = position.durationMs > 0 ? position.positionMs / position.durationMs : 0;

  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withTiming(progress, { duration: 200 });
  }, [progress]);

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  const handleSeekBack = () => {
    seek(Math.max(0, position.positionMs - 15000));
  };

  const handleSeekForward = () => {
    seek(Math.min(position.durationMs, position.positionMs + 15000));
  };

  const title = item?.title ?? 'Untitled';
  const duration = position.durationMs > 0 ? formatTime(position.durationMs) : '--:--';
  const intentLine = CONTENT_TYPE_COPY[contentType]?.depth ?? '';

  const handleEdit = () => {
    navigation.navigate('ContentEdit', { contentId, contentType });
  };

  const handleEditAudio = () => {
    const plural = contentType === 'affirmation' ? 'affirmations' : `${contentType}s`;
    const url = `${API_BASE_URL}/en/sanctuary/${plural}/${contentId}/edit-audio`;
    void WebBrowser.openBrowserAsync(url);
  };

  const handleMore = () => {
    Alert.alert(
      'More',
      undefined,
      [
        { text: 'Edit', onPress: handleEdit },
        { text: 'Edit audio', onPress: handleEditAudio },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  return (
    <Screen scrollable={false} padding={false}>
      <View style={[styles.container, { paddingHorizontal: PADDING_H }]}>
        {/* Header: Back + More */}
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.backBtn}
          >
            <Typography variant="body" style={{ color: colors.accent.primary }}>← Back</Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMore} activeOpacity={0.8} style={styles.moreBtn}>
            <Typography variant="small" style={{ color: colors.text.secondary }}>More</Typography>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Typography
            variant="h2"
            style={{ color: colors.text.primary, fontWeight: '400', textAlign: 'center' }}
            numberOfLines={2}
          >
            {title}
          </Typography>
          {intentLine ? (
            <Typography
              variant="caption"
              style={{ color: colors.text.secondary, marginTop: spacing.xs, textAlign: 'center' }}
            >
              {intentLine}
            </Typography>
          ) : null}
        </View>

        {/* Orb */}
        <View style={styles.orbContainer}>
          <VoiceOrb
            size="lg"
            orbState={isAudioLoading ? 'thinking' : isPlaying ? 'speaking' : 'idle'}
            style={{ width: ORB_SIZE, height: ORB_SIZE }}
          />
          {!hasVoice && (
            <Typography
              variant="caption"
              style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.md }}
            >
              No audio yet. Tap More → Edit audio to add it.
            </Typography>
          )}
        </View>

        {/* Progress scrubber */}
        <View style={styles.scrubContainer}>
          <View style={[styles.scrubTrack, { backgroundColor: colors.glass.border }]}>
            <Animated.View
              style={[styles.scrubFill, progressBarStyle, { backgroundColor: colors.accent.primary }]}
            />
            <Animated.View
              style={[
                styles.scrubDot,
                progressBarStyle,
                { backgroundColor: colors.text.onDark, borderColor: colors.accent.primary },
              ]}
            />
          </View>
          <View style={styles.scrubTimes}>
            <Typography variant="caption" style={{ color: colors.text.secondary, fontSize: 11 }}>
              {formatTime(position.positionMs)}
            </Typography>
            <Typography variant="caption" style={{ color: colors.text.secondary, fontSize: 11 }}>
              {duration}
            </Typography>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={hasVoice ? handleSeekBack : undefined}
            activeOpacity={0.75}
            style={[styles.controlBtn, !hasVoice && { opacity: 0.5 }]}
            disabled={!hasVoice}
          >
            <Typography style={[styles.controlIcon, { color: colors.text.secondary }]}>⏮</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={hasVoice ? (isPlaying ? pause : play) : undefined}
            activeOpacity={0.8}
            style={[
              styles.playBtn,
              {
                backgroundColor: hasVoice ? colors.accent.primary : colors.glass.border,
                opacity: hasVoice ? 1 : 0.7,
              },
            ]}
            disabled={!hasVoice}
          >
            {!hasVoice ? (
              <Typography style={[styles.playIcon, { color: colors.text.secondary }]}>▶</Typography>
            ) : isAudioLoading ? (
              <Typography style={{ color: colors.text.onDark, fontSize: 20 }}>…</Typography>
            ) : (
              <Typography style={[styles.playIcon, { color: colors.text.onDark }]}>
                {isPlaying ? '⏸' : '▶'}
              </Typography>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={hasVoice ? handleSeekForward : undefined}
            activeOpacity={0.75}
            style={[styles.controlBtn, !hasVoice && { opacity: 0.5 }]}
            disabled={!hasVoice}
          >
            <Typography style={[styles.controlIcon, { color: colors.text.secondary }]}>⏭</Typography>
          </TouchableOpacity>
        </View>
        {/* TODO: repeat toggle when playbackStore supports loop */}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.lg,
  },
  backBtn: {
    paddingVertical: spacing.sm,
  },
  moreBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.md,
  },
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  scrubContainer: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
  scrubTrack: {
    height: 3,
    borderRadius: 2,
    width: '100%',
    position: 'relative',
  },
  scrubFill: {
    height: '100%',
    borderRadius: 2,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  scrubDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    position: 'absolute',
    top: -4.5,
    marginLeft: -6,
  },
  scrubTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxxl,
  },
  controlBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    fontSize: 22,
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 26,
  },
});
