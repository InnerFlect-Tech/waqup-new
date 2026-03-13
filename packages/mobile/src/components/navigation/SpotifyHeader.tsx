/**
 * SpotifyHeader — Shared header with avatar (left), title (center), QBalanceBadge + Plus (right).
 * Uses BlurView for professional glass effect; always visible over scrolling content.
 */
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useNavigationState, DrawerActions } from '@react-navigation/native';
import { useTheme, spacing } from '@/theme';
import { Typography, QCoin } from '@/components';
import { useAuthStore } from '@/stores/authStore';
import { useCreditBalance } from '@/hooks';

const TAB_TITLES: Record<string, string> = {
  Ritual: 'Ritual',
  Library: 'Your Library',
  Profile: 'Profile',
};

export interface SpotifyHeaderProps {
  onOpenCreateSheet?: () => void;
}

export function SpotifyHeader({ onOpenCreateSheet }: SpotifyHeaderProps) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { balance } = useCreditBalance();

  const currentTab = useNavigationState((state) => {
    if (!state) return 'Ritual';
    const routes = state.routes;
    const idx = state.index ?? 0;
    const mainRoute = routes[idx];
    if (mainRoute?.name === 'Tabs' && mainRoute.state) {
      const tabRoutes = mainRoute.state.routes ?? [];
      const tabIdx = mainRoute.state.index ?? 0;
      return tabRoutes[tabIdx]?.name ?? 'Ritual';
    }
    return 'Ritual';
  });

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.email?.split('@')[0] ||
    '?';
  const initials = displayName.charAt(0).toUpperCase();

  const title = TAB_TITLES[currentTab ?? ''] ?? 'Ritual';

  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  const headerHeight = insets.top + 56;

  return (
    <View style={[styles.wrapper, { height: headerHeight, backgroundColor: colors.glass.opaque, borderBottomColor: colors.glass.border }]}>
      {Platform.OS === 'ios' && (
        <BlurView
          intensity={60}
          tint="dark"
          style={[StyleSheet.absoluteFill, { opacity: 0.9 }]}
        />
      )}
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={openDrawer}
          style={styles.left}
          activeOpacity={0.8}
        >
          <View style={[styles.avatar, { backgroundColor: colors.accent.primary }]}>
            <Typography variant="captionBold" style={{ color: colors.text.onDark, fontSize: 16 }}>
              {initials}
            </Typography>
          </View>
        </TouchableOpacity>

        <View style={styles.center}>
          <Typography
            variant="h4"
            style={{ color: colors.text.primary }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Typography>
        </View>

        <View style={styles.right}>
          <TouchableOpacity
            onPress={() => (navigation as { navigate: (s: string) => void }).navigate('Credits')}
            style={styles.rightItem}
            activeOpacity={0.75}
          >
            <QCoin size="sm" showAmount={balance} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onOpenCreateSheet}
            style={styles.rightItem}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons name="plus" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    minHeight: 56,
  },
  left: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rightItem: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
