import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/theme';
import { MainTabParamList } from './types';
import { HomeScreen, LibraryScreen, CreateScreen, ProfileScreen } from '@/screens';
// Icons will be imported from @expo/vector-icons
// For now, using React Navigation's default icons

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
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
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          tabBarLabel: 'Library',
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarLabel: 'Create',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
