import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button } from '@/components';

type Props = NativeStackScreenProps<MainStackParamList, 'Reminders'>;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = ['06:00', '07:00', '08:00', '09:00', '12:00', '18:00', '20:00', '21:00'];

// Weekday index mapping (0 = Sunday in JS, 1 = Monday, etc.)
const DAY_TO_WEEKDAY: Record<string, number> = {
  Sun: 1, Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6, Sat: 7,
};

async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

async function scheduleReminders(
  time: string,
  days: string[],
): Promise<void> {
  // Cancel all existing waQup reminder notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  for (const day of days) {
    const weekday = DAY_TO_WEEKDAY[day];
    if (!weekday) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'waQup — Time to practice 🧘',
        body: 'Your daily practice is waiting. A few minutes can shift your whole day.',
        sound: true,
        data: { type: 'practice_reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday,
        hour,
        minute,
      },
    });
  }
}

export default function RemindersScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [enabled, setEnabled] = useState(false);
  const [selectedTime, setSelectedTime] = useState('07:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!enabled) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        Alert.alert('Reminders Disabled', 'All practice reminders have been turned off.');
        return;
      }

      if (selectedDays.length === 0) {
        Alert.alert('No Days Selected', 'Please select at least one day for your reminders.');
        return;
      }

      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          'Notifications Blocked',
          'waQup needs notification permission to send practice reminders. Enable it in Settings → Notifications → waQup.',
          [{ text: 'OK' }]
        );
        return;
      }

      await scheduleReminders(selectedTime, selectedDays);

      Alert.alert(
        'Reminders Set ✓',
        `You'll be reminded at ${selectedTime} on ${selectedDays.join(', ')}.`,
      );
    } catch (err) {
      console.error('[RemindersScreen] schedule error:', err);
      Alert.alert('Error', 'Could not save reminders. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Screen scrollable padding={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Typography variant="body" style={{ color: colors.accent.primary }}>← Back</Typography>
          </TouchableOpacity>
          <Typography variant="h2" style={{ color: colors.text.primary, fontWeight: '300', marginTop: spacing.lg }}>
            Reminders
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
            Daily nudges for consistent practice
          </Typography>
        </View>

        {/* Master toggle */}
        <Card variant="default" style={[styles.section, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Typography variant="captionBold" style={{ color: colors.text.primary }}>Daily Practice Reminder</Typography>
              <Typography variant="small" style={{ color: colors.text.secondary, marginTop: 2 }}>
                A gentle nudge to stay consistent
              </Typography>
            </View>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: colors.glass.border, true: colors.accent.primary }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        {enabled && (
          <>
            {/* Time picker */}
            <Typography variant="captionBold" style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
              REMINDER TIME
            </Typography>
            <View style={styles.timeGrid}>
              {TIMES.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSelectedTime(t)}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: selectedTime === t ? colors.accent.primary : colors.glass.opaque,
                      borderColor: selectedTime === t ? colors.accent.primary : colors.glass.border,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Typography variant="captionBold" style={{ color: selectedTime === t ? '#fff' : colors.text.primary }}>
                    {t}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>

            {/* Day picker */}
            <Typography variant="captionBold" style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
              DAYS
            </Typography>
            <View style={styles.dayRow}>
              {DAYS.map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => toggleDay(d)}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: selectedDays.includes(d) ? colors.accent.primary : colors.glass.opaque,
                      borderColor: selectedDays.includes(d) ? colors.accent.primary : colors.glass.border,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Typography variant="small" style={{ color: selectedDays.includes(d) ? '#fff' : colors.text.primary, fontSize: 11, fontWeight: '600' }}>
                    {d}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => void handleSave()}
          disabled={isSaving}
          style={{ marginTop: spacing.xl }}
        >
          {isSaving ? 'Saving…' : enabled ? 'Save Reminders' : 'Done'}
        </Button>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.45)',
    marginBottom: spacing.sm,
    fontSize: 11,
    letterSpacing: 1,
  },
  section: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  dayRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dayChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
});
