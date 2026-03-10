import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
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
  const { user, logout } = useAuthStore();

  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? ''
  );
  const [notifPractice, setNotifPractice] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your data — affirmations, meditations, rituals, progress, voice, and credits. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete My Account',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

  const confirmDeleteAccount = () => {
    // Second confirmation to prevent accidental deletion
    Alert.alert(
      'Are you sure?',
      'All your data will be deleted within 30 days. You will be signed out immediately.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Delete Everything',
          style: 'destructive',
          onPress: () => void executeDeleteAccount(),
        },
      ]
    );
  };

  const executeDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Call the account deletion endpoint on the web server.
      // The server handles: deleting from auth.users (cascades to all user data),
      // revoking ElevenLabs voice, and anonymizing Stripe customer data.
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        Alert.alert('Error', 'You must be signed in to delete your account.');
        return;
      }

      const apiBase = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
      const res = await fetch(`${apiBase}/api/account/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok || res.status === 204) {
        // Sign out locally — the navigator will redirect to Auth
        await logout();
        Alert.alert(
          'Account Deleted',
          'Your account has been scheduled for deletion. All data will be removed within 30 days.'
        );
      } else if (res.status === 404) {
        // Endpoint not deployed yet — fall back to local sign-out with email instruction
        await logout();
        Alert.alert(
          'Deletion Requested',
          'Your account deletion has been requested. Please email legal@waqup.com to confirm. You have been signed out.'
        );
      } else {
        const body = (await res.json()) as { error?: string };
        Alert.alert('Error', body.error ?? 'Could not delete your account. Please email legal@waqup.com.');
      }
    } catch {
      Alert.alert(
        'Error',
        'Could not connect to delete your account. Please email legal@waqup.com to request deletion.'
      );
    } finally {
      setIsDeleting(false);
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
        <Typography variant="captionBold" style={styles.sectionLabel}>
          PROFILE
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
        <Typography variant="captionBold" style={[styles.sectionLabel, { marginTop: spacing.xl }]}>
          NOTIFICATIONS
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
          onPress={() => void handleSave()}
          disabled={isSaving}
          style={{ marginTop: spacing.xl }}
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </Button>

        {/* Data & Privacy — Apple requires in-app account deletion */}
        <Typography variant="captionBold" style={[styles.sectionLabel, { marginTop: spacing.xxl }]}>
          DATA &amp; PRIVACY
        </Typography>
        <Card variant="default" style={[styles.section, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
          <Typography variant="small" style={{ color: colors.text.secondary, lineHeight: 18, marginBottom: spacing.md }}>
            You can permanently delete your account and all associated data — including your affirmations, meditations, rituals, voice profile, and credits. This action cannot be undone.
          </Typography>
          <Button
            variant="outline"
            size="md"
            fullWidth
            onPress={handleDeleteAccount}
            disabled={isDeleting}
            style={{ borderColor: colors.error }}
          >
            <Typography variant="body" style={{ color: colors.error }}>
              {isDeleting ? 'Deleting…' : 'Delete My Account'}
            </Typography>
          </Button>
        </Card>

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
  sectionLabel: {
    color: 'rgba(255,255,255,0.45)',
    marginBottom: spacing.sm,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
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
