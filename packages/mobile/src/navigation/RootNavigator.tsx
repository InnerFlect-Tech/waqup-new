import React, { useEffect, useState } from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import ShowcaseScreen from '@/screens/ShowcaseScreen';
import HealthScreen from '@/screens/HealthScreen';
import SetupScreen from '@/screens/SetupScreen';
import { useAuthStore } from '@/stores';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Deep linking configuration
// waqup://auth/callback is used as the OAuth redirect URI for Google (and future providers)
const linking = {
  prefixes: ['waqup://', 'https://waqup.app', 'https://www.waqup.app'],
  config: {
    screens: {
      Setup: 'onboarding',
      Showcase: 'showcase',
      Health: 'health',
      Auth: {
        screens: {
          Login: 'auth/login',
          Signup: 'auth/signup',
          ForgotPassword: 'auth/forgot-password',
          ResetPassword: 'auth/reset-password',
        },
      },
      Main: 'main',
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
    <NavigationContainer linking={linking as LinkingOptions<RootStackParamList>}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={isAuthenticated ? 'Main' : 'Setup'}
      >
        {/* Onboarding — shown to unauthenticated users before Auth screens */}
        <Stack.Screen name="Setup" component={SetupScreen} />
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
        <Stack.Screen name="Showcase" component={ShowcaseScreen} />
        <Stack.Screen name="Health" component={HealthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
