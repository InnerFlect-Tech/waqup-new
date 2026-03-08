import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button, QCoin } from '@/components';
import { useAuthStore } from '@/stores/authStore';

type Props = BottomTabScreenProps<MainTabParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;

  const MENU_ITEMS: Array<{ label: string; icon?: string; iconNode?: React.ReactNode; description: string }> = [
    { label: 'Account Settings', icon: '⚙️', description: 'Email, password, notifications' },
    { label: 'Qs', iconNode: <QCoin size="md" />, description: 'Balance and purchase history' },
    { label: 'Progress', icon: '📈', description: 'Your practice journey' },
    { label: 'Reminders', icon: '🔔', description: 'Daily practice reminders' },
  ];
  const { user, logout } = useAuthStore();

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'User';
  const displayEmail = user?.email || '';

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
        <View style={styles.header}>
          <Typography
            variant="h1"
            style={{ color: colors.text.primary, fontWeight: '300', letterSpacing: -1 }}
          >
            Profile
          </Typography>
        </View>

        <Card
          variant="elevated"
          style={[
            styles.userCard,
            {
              backgroundColor: colors.glass.opaque,
              borderColor: colors.glass.border,
            },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: colors.accent.primary }]}>
            <Typography variant="h2" style={{ color: colors.text.onDark }}>
              {displayName.charAt(0).toUpperCase()}
            </Typography>
          </View>
          <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.xs }}>
            {displayName}
          </Typography>
          {displayEmail ? (
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              {displayEmail}
            </Typography>
          ) : null}
        </Card>

        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.label} activeOpacity={0.8}>
              <Card
                variant="default"
                style={[
                  styles.menuCard,
                  {
                    backgroundColor: colors.glass.opaque,
                    borderColor: colors.glass.border,
                  },
                ]}
              >
                {item.iconNode ? (
                  <QCoin size="md" />
                ) : (
                  <Typography variant="h2" style={{ fontSize: 24 }}>
                    {item.icon}
                  </Typography>
                )}
                <View style={{ flex: 1 }}>
                  <Typography variant="h4" style={{ color: colors.text.primary }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" style={{ color: colors.text.secondary }}>
                    {item.description}
                  </Typography>
                </View>
                <Typography variant="body" style={{ color: colors.text.tertiary ?? colors.text.secondary }}>
                  →
                </Typography>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          onPress={handleLogout}
          style={{
            borderColor: colors.error,
            marginTop: spacing.md,
          }}
        >
          Sign Out
        </Button>
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
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  menuSection: {
    gap: spacing.md,
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
