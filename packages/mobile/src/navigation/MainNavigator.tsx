import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useTheme, layout, spacing, typography } from '@/theme';
import { MainTabParamList, MainStackParamList } from './types';
import { LibraryScreen, RitualHomeScreen } from '@/screens';
import ContentDetailScreen from '@/screens/content/ContentDetailScreen';
import ContentEditScreen from '@/screens/content/ContentEditScreen';
import ContentCreateScreen from '@/screens/content/ContentCreateScreen';
import CreateEntryScreen from '@/screens/content/CreateEntryScreen';
import CreateVoiceStepScreen from '@/screens/content/CreateVoiceStepScreen';
import { CreditsScreen, ProgressScreen, SettingsScreen, RemindersScreen } from '@/screens/sanctuary';
import ProfileScreen from '@/screens/main/ProfileScreen';
import { QCoin } from '@/components';
import { MiniPlayer, PlaybackEngineProvider } from '@/components/audio';
import { useCreditBalance } from '@/hooks';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

/** Persistent Q balance badge shown in the top-right corner across all tabs */
function QBalanceBadge() {
  const navigation = useNavigation();
  const { balance } = useCreditBalance();

  return (
    <TouchableOpacity
      onPress={() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (navigation as any).navigate('Credits');
      }}
      style={{ marginRight: layout.headerRightMargin }}
      activeOpacity={0.75}
    >
      <QCoin size="sm" showAmount={balance} />
    </TouchableOpacity>
  );
}

function MainTabs() {
  const { t } = useTranslation('nav');
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.glass.opaque,
          borderTopWidth: 1,
          borderTopColor: colors.glass.border,
          height: layout.tabBarHeight,
          paddingBottom: layout.tabBarPaddingY,
          paddingTop: layout.tabBarPaddingY,
        },
        tabBarActiveTintColor: colors.accent.tertiary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: {
          fontSize: typography.label.fontSize,
          fontWeight: String(typography.label.fontWeight) as '500',
        },
        tabBarBackground: () => (
          <BlurView intensity={80} style={{ flex: 1 }} tint="dark" />
        ),
      }}
    >
      <Tab.Screen name="Ritual" component={RitualHomeScreen} options={{ tabBarLabel: t('ritual') }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ tabBarLabel: t('library') }} />
      <Tab.Screen name="Create" component={CreateEntryScreen} options={{ tabBarLabel: t('create') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: t('profile') }} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <PlaybackEngineProvider>
      <View style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Tabs"
        component={MainTabs}
        options={{
          headerShown: true,
          headerTitle: '',
          headerTransparent: true,
          headerRight: () => <QBalanceBadge />,
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerShadowVisible: false,
          headerTintColor: colors.text.primary,
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
        <MiniPlayer />
      </View>
    </PlaybackEngineProvider>
  );
}
