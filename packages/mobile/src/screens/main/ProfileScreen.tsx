import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button, QCoin } from '@/components';
import { useAuthStore } from '@/stores/authStore';
import { useCreditBalance } from '@/hooks';
import { MainStackParamList } from '@/navigation/types';

type ProfileNav = NativeStackNavigationProp<MainStackParamList>;

interface MenuItem {
  label: string;
  description: string;
  icon: string;
  screen?: keyof MainStackParamList;
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Account Settings', description: 'Email, password, notifications', icon: '⚙️', screen: 'Settings' },
  { label: 'Progress', description: 'Your practice journey & streaks', icon: '📈', screen: 'Progress' },
  { label: 'Reminders', description: 'Daily practice reminders', icon: '🔔', screen: 'Reminders' },
  { label: 'Voice Settings', description: 'Your cloned ElevenLabs voice', icon: '🎙️', screen: 'Settings' },
  { label: 'Privacy & Data', description: 'Delete account and manage data', icon: '🔒', screen: 'Settings' },
];

export default function ProfileScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { user, logout } = useAuthStore();
  const { balance: creditBalance } = useCreditBalance();
  const navigation = useNavigation<ProfileNav>();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'User';
  const displayEmail = user?.email || '';
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <Screen scrollable padding={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Typography
            variant="h1"
            style={{ color: colors.text.primary, fontWeight: '300', letterSpacing: -1 }}
          >
            Profile
          </Typography>
        </View>

        {/* User card */}
        <Card
          variant="elevated"
          style={[styles.userCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}
        >
          <View style={styles.userCardTop}>
            <View style={[styles.avatar, { backgroundColor: colors.accent.primary }]}>
              <Typography variant="h2" style={{ color: colors.text.onDark, fontSize: 28 }}>
                {initials}
              </Typography>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.lg }}>
              <Typography variant="h3" style={{ color: colors.text.primary }}>
                {displayName}
              </Typography>
              {displayEmail ? (
                <Typography variant="caption" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
                  {displayEmail}
                </Typography>
              ) : null}
            </View>
          </View>

          {/* Credits section */}
          <View
            style={[
              styles.creditsRow,
              { backgroundColor: colors.glass.transparent, borderTopColor: colors.glass.border },
            ]}
          >
            <View style={styles.creditItem}>
              <View style={styles.creditLabel}>
                <QCoin size="sm" />
                <Typography variant="captionBold" style={{ color: colors.text.secondary, marginLeft: spacing.xs }}>
                  Credits
                </Typography>
              </View>
              <Typography variant="h3" style={{ color: colors.text.primary }}>
                {creditBalance}
              </Typography>
            </View>
            <View style={[styles.creditDivider, { backgroundColor: colors.glass.border }]} />
            <View style={styles.creditItem}>
              <Typography variant="captionBold" style={{ color: colors.text.secondary }}>
                Plan
              </Typography>
              <Typography variant="captionBold" style={{ color: colors.accent.tertiary }}>
                Free
              </Typography>
            </View>
            <View style={[styles.creditDivider, { backgroundColor: colors.glass.border }]} />
            <TouchableOpacity style={styles.creditItem} activeOpacity={0.8} onPress={() => navigation.navigate('Credits')}>
              <Typography variant="captionBold" style={{ color: colors.accent.primary }}>
                Get Credits →
              </Typography>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Menu items */}
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.8}
              onPress={() => {
                if (item.screen) {
                  (navigation.navigate as (name: keyof MainStackParamList) => void)(item.screen);
                }
              }}
            >
              <Card
                variant="default"
                style={[
                  styles.menuCard,
                  { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border },
                ]}
              >
                <Typography variant="h2" style={{ fontSize: 24 }}>
                  {item.icon}
                </Typography>
                <View style={{ flex: 1 }}>
                  <Typography variant="captionBold" style={{ color: colors.text.primary }}>
                    {item.label}
                  </Typography>
                  <Typography variant="small" style={{ color: colors.text.secondary, marginTop: 2 }}>
                    {item.description}
                  </Typography>
                </View>
                <Typography variant="body" style={{ color: colors.text.secondary }}>
                  →
                </Typography>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign out */}
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onPress={handleLogout}
          style={{ borderColor: colors.error, marginTop: spacing.xl }}
        >
          Sign Out
        </Button>

        <Typography variant="small" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.lg }}>
          waQup v1.0.0
        </Typography>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  userCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  userCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: spacing.md,
  },
  creditItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  creditLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditDivider: {
    width: 1,
    marginVertical: spacing.sm,
  },
  menuSection: {
    gap: spacing.sm,
  },
  menuCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
});
