/**
 * DrawerContent — Spotify-style side menu.
 * Maps 1:1 from ProfileScreen: Credits, Progress, Reminders, Settings, View profile, Sign Out.
 * Uses 24px vector icons (Material Design), 52pt min touch targets, glass.opaque background.
 */
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, spacing, borderRadius, buttonTokens, drawerTokens } from '@/theme';
import { Typography, QCoin } from '@/components';
import { useAuthStore } from '@/stores/authStore';
import { useCreditBalance } from '@/hooks';
import { MainStackParamList } from '@/navigation/types';


interface DrawerItem {
  label: string;
  icon: string;
  action: 'navigate' | 'profile' | 'logout';
  screen?: keyof MainStackParamList;
}

const DRAWER_ITEMS: DrawerItem[] = [
  { label: 'Credits', icon: 'circle-multiple-outline', action: 'navigate', screen: 'Credits' },
  { label: 'Progress', icon: 'chart-line', action: 'navigate', screen: 'Progress' },
  { label: 'Reminders', icon: 'bell-outline', action: 'navigate', screen: 'Reminders' },
  { label: 'Settings', icon: 'cog-outline', action: 'navigate', screen: 'Settings' },
];

export function DrawerContent(props: DrawerContentComponentProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { balance } = useCreditBalance();
  const { navigation } = props;

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    'User';
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          navigation.closeDrawer();
          await logout();
        },
      },
    ]);
  };

  const handleItemPress = (item: DrawerItem) => {
    navigation.closeDrawer();
    if (item.action === 'logout') {
      handleLogout();
      return;
    }
    if (item.action === 'profile') {
      navigation.navigate('Main', { screen: 'Tabs', params: { screen: 'Profile' } });
      return;
    }
    if (item.screen) {
      (navigation.navigate as (name: string, params?: object) => void)('Main', {
        screen: item.screen,
      });
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + drawerTokens.padding, paddingBottom: insets.bottom + drawerTokens.padding },
      ]}
      style={{ backgroundColor: colors.glass.opaque }}
    >
      {/* Profile block */}
      <View style={styles.profileBlock}>
        <View style={[styles.avatar, { backgroundColor: colors.accent.primary }]}>
          <Typography variant="h2" style={{ color: colors.text.onDark, fontSize: 28 }}>
            {initials}
          </Typography>
        </View>
        <Typography variant="h3" style={[styles.name, { color: colors.text.primary }]}>
          {displayName}
        </Typography>
        <TouchableOpacity
          onPress={() => handleItemPress({ label: 'View profile', icon: '', action: 'profile' })}
          activeOpacity={0.8}
          style={styles.viewProfileTouch}
        >
          <Typography variant="caption" style={{ color: colors.accent.tertiary }}>
            View profile
          </Typography>
        </TouchableOpacity>
      </View>

      {/* Credits row */}
      <TouchableOpacity
        style={[
          styles.creditsRow,
          { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border },
        ]}
        onPress={() => handleItemPress(DRAWER_ITEMS[0]!)}
        activeOpacity={0.8}
      >
        <QCoin size="sm" showAmount={balance} />
        <Typography variant="captionBold" style={{ color: colors.accent.primary, marginLeft: spacing.sm }}>
          Get Credits →
        </Typography>
      </TouchableOpacity>

      {/* Menu items */}
      <View style={[styles.menuList, { borderTopColor: colors.glass.border }]}>
        {DRAWER_ITEMS.slice(1).map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              { borderBottomColor: colors.glass.border },
            ]}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name={item.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
              size={24}
              color={colors.text.secondary}
            />
            <Typography variant="body" style={{ color: colors.text.primary }}>
              {item.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        style={[styles.signOut, { marginTop: spacing.xl }]}
        onPress={() => handleItemPress({ label: 'Sign Out', icon: '', action: 'logout' })}
        activeOpacity={0.8}
      >
        <Typography variant="bodyBold" style={{ color: colors.error }}>
          Sign Out
        </Typography>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: drawerTokens.padding,
  },
  profileBlock: {
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: {
    marginBottom: spacing.xs,
  },
  viewProfileTouch: {
    alignSelf: 'flex-start',
    minHeight: buttonTokens.iconOnlySize,
    justifyContent: 'center',
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  menuList: {
    borderTopWidth: 1,
    paddingTop: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: buttonTokens.minHeight.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.md,
  },
  signOut: {
    paddingVertical: spacing.md,
  },
});
