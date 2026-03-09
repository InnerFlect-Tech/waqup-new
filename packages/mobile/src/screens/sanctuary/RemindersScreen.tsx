import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button } from '@/components';

type Props = NativeStackScreenProps<MainStackParamList, 'Reminders'>;

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMES = ['06:00', '07:00', '08:00', '09:00', '12:00', '18:00', '20:00', '21:00'];

export default function RemindersScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [enabled, setEnabled] = useState(false);
  const [selectedTime, setSelectedTime] = useState('07:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    Alert.alert(
      'Reminders Set',
      enabled
        ? `You'll be reminded at ${selectedTime} on ${selectedDays.join(', ')}.`
        : 'Reminders disabled.',
    );
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
            <Typography variant="captionBold" style={{ color: colors.text.secondary, marginTop: spacing.xl, marginBottom: spacing.sm, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1 }}>
              Reminder Time
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
            <Typography variant="captionBold" style={{ color: colors.text.secondary, marginTop: spacing.xl, marginBottom: spacing.sm, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1 }}>
              Days
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

        <Button variant="primary" size="lg" fullWidth onPress={handleSave} style={{ marginTop: spacing.xl }}>
          {enabled ? 'Save Reminders' : 'Done'}
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
