import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button } from '@/components';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/services/supabase';

type Props = NativeStackScreenProps<MainStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { user } = useAuthStore();

  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? ''
  );
  const [notifPractice, setNotifPractice] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await supabase.auth.updateUser({ data: { full_name: displayName } });
      Alert.alert('Saved', 'Your settings have been updated.');
    } catch {
      Alert.alert('Error', 'Could not save settings. Please try again.');
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
            Account Settings
          </Typography>
        </View>

        {/* Profile */}
        <Typography variant="captionBold" style={{ color: colors.text.secondary, marginBottom: spacing.sm, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1 }}>
          Profile
        </Typography>
        <Card variant="default" style={[styles.section, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
          <View style={styles.field}>
            <Typography variant="captionBold" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
              Display Name
            </Typography>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              style={[styles.input, { color: colors.text.primary, backgroundColor: colors.glass.transparent, borderColor: colors.glass.border }]}
              placeholderTextColor={colors.text.secondary}
              placeholder="Your name"
            />
          </View>
          <View style={styles.field}>
            <Typography variant="captionBold" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
              Email
            </Typography>
            <Typography variant="body" style={{ color: colors.text.primary }}>
              {user?.email ?? '—'}
            </Typography>
          </View>
        </Card>

        {/* Notifications */}
        <Typography variant="captionBold" style={{ color: colors.text.secondary, marginBottom: spacing.sm, marginTop: spacing.xl, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1 }}>
          Notifications
        </Typography>
        <Card variant="default" style={[styles.section, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Typography variant="captionBold" style={{ color: colors.text.primary }}>Practice Reminders</Typography>
              <Typography variant="small" style={{ color: colors.text.secondary, marginTop: 2 }}>Daily nudge to keep your practice going</Typography>
            </View>
            <Switch
              value={notifPractice}
              onValueChange={setNotifPractice}
              trackColor={{ false: colors.glass.border, true: colors.accent.primary }}
              thumbColor="#fff"
            />
          </View>
        </Card>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSave}
          disabled={isSaving}
          style={{ marginTop: spacing.xl }}
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </Button>

        <Typography variant="small" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xl }}>
          waQup v1.0.0 · Data processed securely
        </Typography>
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
    gap: spacing.lg,
  },
  field: {
    gap: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
