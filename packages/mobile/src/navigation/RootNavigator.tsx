import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import ShowcaseScreen from '@/screens/ShowcaseScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Deep linking configuration
// Showcase is accessible via URL: waqup://showcase or https://waqup.app/showcase
const linking = {
  prefixes: ['waqup://', 'https://waqup.app', 'https://www.waqup.app'],
  config: {
    screens: {
      Showcase: 'showcase', // Hidden route accessible via URL only
      Auth: 'auth', // Auth navigator routes handled internally
      Main: 'main', // Main navigator routes handled internally
    },
  },
};

export default function RootNavigator() {
  // TODO: Add auth state check to conditionally show Auth or Main navigator
  // For now, showing Auth navigator as default
  const isAuthenticated = false;

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Showcase" component={ShowcaseScreen} />
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
