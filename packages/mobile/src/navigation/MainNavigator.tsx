/**
 * MainNavigator — Spotify-style structure: Drawer + Stack + Tabs.
 * Drawer (left) wraps main content; header has avatar, title, QBalanceBadge, Plus.
 * Plus opens CreateMenuSheet; Create tab removed.
 */
import React, { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useTheme, layout, spacing, typography, drawerTokens } from '@/theme';
import { MainTabParamList, MainStackParamList } from './types';
import { LibraryScreen, RitualHomeScreen } from '@/screens';
import ContentDetailScreen from '@/screens/content/ContentDetailScreen';
import ContentEditScreen from '@/screens/content/ContentEditScreen';
import ContentCreateScreen from '@/screens/content/ContentCreateScreen';
import CreateVoiceStepScreen from '@/screens/content/CreateVoiceStepScreen';
import { CreditsScreen, ProgressScreen, SettingsScreen, RemindersScreen } from '@/screens/sanctuary';
import ProfileScreen from '@/screens/main/ProfileScreen';
import { QCoin } from '@/components';
import { DrawerContent } from '@/components/navigation/DrawerContent';
import { SpotifyHeader } from '@/components/navigation/SpotifyHeader';
import { CreateMenuSheet } from '@/components/navigation/CreateMenuSheet';
import { MiniPlayer, PlaybackEngineProvider } from '@/components/audio';
import { useCreditBalance } from '@/hooks';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

/** Purple dot indicator for active tab */
function TabBarIcon({ focused }: { focused: boolean }) {
  const { theme } = useTheme();
  const colors = theme.colors;
  return (
    <View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: focused ? colors.accent.primary : 'transparent',
        marginBottom: 4,
      }}
    />
  );
}

function MainTabs() {
  const { t } = useTranslation('nav');
  const { theme } = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.glass.opaque,
          borderTopWidth: 1,
          borderTopColor: colors.glass.border,
          height: layout.tabBarHeight + insets.bottom,
          paddingBottom: layout.tabBarPaddingY + insets.bottom,
          paddingTop: layout.tabBarPaddingY,
        },
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: {
          fontSize: typography.label.fontSize,
          fontWeight: String(typography.label.fontWeight) as '500',
        },
        tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} />,
        tabBarBackground: () => (
          <BlurView intensity={80} style={{ flex: 1 }} tint="dark" />
        ),
      }}
    >
      <Tab.Screen name="Ritual" component={RitualHomeScreen} options={{ tabBarLabel: t('ritual') }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ tabBarLabel: t('library') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('profile') }} />
    </Tab.Navigator>
  );
}

/** Stack + CreateMenuSheet wrapped for Drawer screen; sheet and header share state */
function MainStackWithSheet() {
  const [createSheetVisible, setCreateSheetVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Tabs"
          component={MainTabs}
          options={{
            headerShown: true,
            headerTitle: '',
            headerTransparent: false,
            header: () => (
              <SpotifyHeader onOpenCreateSheet={() => setCreateSheetVisible(true)} />
            ),
            headerStyle: { backgroundColor: 'transparent' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="ContentDetail"
          component={ContentDetailScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="ContentEdit"
          component={ContentEditScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="ContentCreate"
          component={ContentCreateScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="CreateVoiceStep"
          component={CreateVoiceStepScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Credits"
          component={CreditsScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Progress"
          component={ProgressScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Reminders"
          component={RemindersScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
      <CreateMenuSheet
        visible={createSheetVisible}
        onClose={() => setCreateSheetVisible(false)}
      />
    </View>
  );
}

export default function MainNavigator() {
  return (
    <PlaybackEngineProvider>
      <View style={{ flex: 1 }}>
        <Drawer.Navigator
          drawerContent={(props) => <DrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerType: 'front',
            drawerPosition: 'left',
            swipeEdgeWidth: drawerTokens.swipeEdgeWidth,
            drawerStyle: { width: drawerTokens.width },
          }}
        >
          <Drawer.Screen name="Main" component={MainStackWithSheet} />
        </Drawer.Navigator>
        <MiniPlayer />
      </View>
    </PlaybackEngineProvider>
  );
}
