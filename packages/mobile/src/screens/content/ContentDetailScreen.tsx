import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Loading } from '@/components';
import { VoiceOrb } from '@/components/audio';
import { useAudioPlayer } from '@/components/audio';
import { useContentItem } from '@/hooks';
import { formatTime } from '@waqup/shared/utils';
import { API_BASE_URL } from '@/constants/app';

type Props = NativeStackScreenProps<MainStackParamList, 'ContentDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ORB_SIZE = Math.min(SCREEN_WIDTH * 0.52, 220);
const BAR_COUNT = 28;

function WaveformBar({
  isPlaying,
  index,
  colors,
}: {
  isPlaying: boolean;
  index: number;
  colors: { accent: { primary: string; secondary: string } };
}) {
  const phase = useSharedValue(0);

  useEffect(() => {
    const speed = isPlaying ? 280 + (index * 37) % 350 : 1000 + (index * 73) % 600;
    const offset = (index / BAR_COUNT) * 1000;

    phase.value = withRepeat(
      withSequence(
        withTiming(0, { duration: offset }),
        withTiming(1, { duration: speed, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: speed, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [isPlaying, index]);

  const animStyle = useAnimatedStyle(() => ({
    height: interpolate(phase.value, [0, 1], [4, 32]),
    opacity: isPlaying ? interpolate(phase.value, [0, 1], [0.35, 1]) : 0.2,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        animStyle,
        { backgroundColor: isPlaying ? colors.accent.primary : colors.accent.secondary },
      ]}
    />
  );
}

function WaveformBars({
  isPlaying,
  colors,
}: {
  isPlaying: boolean;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
}) {
  return (
    <View style={styles.waveform}>
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <WaveformBar key={i} isPlaying={isPlaying} index={i} colors={colors} />
      ))}
    </View>
  );
}

export default function ContentDetailScreen({ navigation, route }: Props) {
  const { contentId, contentType } = route.params;
  const { theme } = useTheme();
  const colors = theme.colors;
  const { data: item, isLoading } = useContentItem(contentId);

  const { state, position, play, pause, seek, isReady } = useAudioPlayer({
    layers: { voiceUrl: item?.audioUrl ?? null },
  });

  if (isLoading || !item) {
    return (
      <Screen scrollable={false} padding={false}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', paddingTop: spacing.xxl }]}>
          <Loading variant="spinner" size="lg" />
        </View>
      </Screen>
    );
  }

  const isPlaying = state === 'playing';
  const isAudioLoading = state === 'loading' || (!isReady && !!item?.audioUrl);
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

  const handleEdit = () => {
    navigation.navigate('ContentEdit', { contentId, contentType });
  };

  const handleEditAudio = () => {
    const plural = contentType === 'affirmation' ? 'affirmations' : `${contentType}s`;
    const url = `${API_BASE_URL}/en/sanctuary/${plural}/${contentId}/edit-audio`;
    void WebBrowser.openBrowserAsync(url);
  };

  return (
    <Screen scrollable={false} padding={false}>
      <View style={styles.container}>
        {/* Back button and actions */}
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            style={styles.backBtn}
          >
            <Typography variant="body" style={{ color: colors.accent.primary }}>← Back</Typography>
          </TouchableOpacity>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleEdit} activeOpacity={0.8} style={styles.actionBtn}>
              <Typography variant="small" style={{ color: colors.accent.primary }}>Edit</Typography>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEditAudio} activeOpacity={0.8} style={styles.actionBtn}>
              <Typography variant="small" style={{ color: colors.accent.primary }}>Edit audio</Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* NOW PLAYING label */}
        <Typography style={[styles.nowPlayingLabel, { color: colors.text.secondary }]}>
          NOW PLAYING
        </Typography>

        {/* Orb */}
        <View style={styles.orbContainer}>
          <VoiceOrb
            size="lg"
            orbState={isAudioLoading ? 'thinking' : isPlaying ? 'speaking' : 'idle'}
            style={{ width: ORB_SIZE, height: ORB_SIZE }}
          />
        </View>

        {/* Track info */}
        <View style={styles.trackInfo}>
          <Typography variant="h2" style={{ color: colors.text.primary, fontWeight: '400', textAlign: 'center' }}>
            {title}
          </Typography>
          <Typography variant="caption" style={{ color: colors.text.secondary, marginTop: spacing.xs, textAlign: 'center' }}>
            Your Voice · {duration}
          </Typography>
        </View>

        {/* Waveform */}
        <WaveformBars isPlaying={isPlaying} colors={colors} />

        {/* Progress scrub */}
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
          <TouchableOpacity onPress={handleSeekBack} activeOpacity={0.75} style={styles.controlBtn}>
            <Typography style={[styles.controlIcon, { color: colors.text.secondary }]}>⏮</Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={isPlaying ? pause : play}
            activeOpacity={0.8}
            style={[styles.playBtn, { backgroundColor: colors.accent.primary }]}
          >
            {isAudioLoading ? (
              <Typography style={{ color: colors.text.onDark, fontSize: 20 }}>…</Typography>
            ) : (
              <Typography style={[styles.playIcon, { color: colors.text.onDark }]}>
                {isPlaying ? '⏸' : '▶'}
              </Typography>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSeekForward} activeOpacity={0.75} style={styles.controlBtn}>
            <Typography style={[styles.controlIcon, { color: colors.text.secondary }]}>⏭</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: spacing.md,
  },
  backBtn: {
    paddingVertical: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  actionBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  nowPlayingLabel: {
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: spacing.xl,
  },
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  trackInfo: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 40,
    marginBottom: spacing.xl,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
  scrubContainer: {
    width: '100%',
    marginBottom: spacing.xxxl,
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
