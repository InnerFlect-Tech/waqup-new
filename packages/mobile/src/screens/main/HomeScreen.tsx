import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography } from '@/components';

const CONTENT_TYPES = [
  {
    label: 'Affirmations',
    subtitle: 'Rewire your beliefs',
    icon: '☀',
    color: '#c084fc',
    bg: '#3b0764',
    contentType: 'affirmation' as const,
  },
  {
    label: 'Meditations',
    subtitle: 'Induce calm states',
    icon: '☽',
    color: '#818cf8',
    bg: '#1e1b4b',
    contentType: 'meditation' as const,
  },
  {
    label: 'Rituals',
    subtitle: 'Encode identity',
    icon: '◎',
    color: '#a78bfa',
    bg: '#2e1065',
    contentType: 'ritual' as const,
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 17) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const handleTypePress = (contentType: 'affirmation' | 'meditation' | 'ritual') => {
    navigation.navigate('CreateMode', { contentType });
  };

  return (
    <Screen scrollable padding={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.header}>
          <Typography
            variant="small"
            style={[styles.greeting, { color: colors.text.secondary }]}
          >
            {getGreeting()}
          </Typography>
          <Typography
            variant="h1"
            style={[styles.headline, { color: colors.text.primary }]}
          >
            {'Ready to transform? ✨'}
          </Typography>
        </View>

        {/* Content type list */}
        <View style={styles.list}>
          {CONTENT_TYPES.map((item) => (
            <TouchableOpacity
              key={item.contentType}
              activeOpacity={0.75}
              onPress={() => handleTypePress(item.contentType)}
              style={[
                styles.row,
                { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border },
              ]}
            >
              {/* Icon tile */}
              <View style={[styles.iconTile, { backgroundColor: item.bg }]}>
                <Typography style={[styles.iconText, { color: item.color }]}>
                  {item.icon}
                </Typography>
              </View>

              {/* Labels */}
              <View style={styles.rowLabels}>
                <Typography variant="captionBold" style={{ color: colors.text.primary }}>
                  {item.label}
                </Typography>
                <Typography variant="small" style={{ color: colors.text.secondary, marginTop: 2 }}>
                  {item.subtitle}
                </Typography>
              </View>

              {/* Chevron */}
              <Typography style={{ color: colors.text.secondary, fontSize: 18 }}>›</Typography>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xxxl,
  },
  greeting: {
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  headline: {
    fontWeight: '300',
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  list: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    gap: spacing.lg,
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconText: {
    fontSize: 22,
    fontWeight: '300',
  },
  rowLabels: {
    flex: 1,
  },
});
