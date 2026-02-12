import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import ShowcaseScreen from '@/screens/ShowcaseScreen';
import { useAuthStore } from '@/stores';

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
  const { user, isInitialized, initializeAuth } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize auth state on mount
    let unsubscribe: (() => void) | null = null;
    
    initializeAuth().then((unsub) => {
      unsubscribe = unsub;
      setIsReady(true);
    });
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [initializeAuth]);

  // Show nothing while initializing
  if (!isReady || !isInitialized) {
    return null; // Or a loading screen
  }

  const isAuthenticated = !!user;

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isAuthenticated ? 'Main' : 'Auth'}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
        <Stack.Screen name="Showcase" component={ShowcaseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
