import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme';
import { MainTabParamList, MainStackParamList } from './types';
import { HomeScreen, LibraryScreen, CreateScreen, ProfileScreen } from '@/screens';
import ContentDetailScreen from '@/screens/content/ContentDetailScreen';
import CreateModeScreen from '@/screens/content/CreateModeScreen';
import ContentCreateScreen from '@/screens/content/ContentCreateScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainStackParamList>();

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
      <Tab.Screen name="Create" component={CreateScreen} options={{ tabBarLabel: 'Create' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainTabs} />
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
    </Stack.Navigator>
  );
}
