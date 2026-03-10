import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme';
import { MainTabParamList, MainStackParamList } from './types';
import { HomeScreen, LibraryScreen } from '@/screens';
import SpeakScreen from '@/screens/main/SpeakScreen';
import MarketplaceScreen from '@/screens/main/MarketplaceScreen';
import ContentDetailScreen from '@/screens/content/ContentDetailScreen';
import CreateModeScreen from '@/screens/content/CreateModeScreen';
import ContentCreateScreen from '@/screens/content/ContentCreateScreen';
import { CreditsScreen, ProgressScreen, SettingsScreen, RemindersScreen } from '@/screens/sanctuary';
import ProfileScreen from '@/screens/main/ProfileScreen';
import { QCoin } from '@/components';
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
      style={{ marginRight: 16 }}
      activeOpacity={0.75}
    >
      <QCoin size="sm" showAmount={balance} />
    </TouchableOpacity>
  );
}

function MainTabs() {
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
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent.tertiary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarBackground: () => (
          <BlurView intensity={80} style={{ flex: 1 }} tint="dark" />
        ),
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Library" component={LibraryScreen} options={{ tabBarLabel: 'Library' }} />
      <Tab.Screen name="Marketplace" component={MarketplaceScreen} options={{ tabBarLabel: 'Discover' }} />
      <Tab.Screen name="Speak" component={SpeakScreen} options={{ tabBarLabel: 'Speak' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
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
        name="CreateMode"
        component={CreateModeScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />
      <Stack.Screen
        name="ContentCreate"
        component={ContentCreateScreen}
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
  );
}
