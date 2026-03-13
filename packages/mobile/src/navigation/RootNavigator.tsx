import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import ShowcaseScreen from '@/screens/ShowcaseScreen';
import HealthScreen from '@/screens/HealthScreen';
import SetupScreen from '@/screens/SetupScreen';
import { useAuthStore } from '@/stores';
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import OnboardingWrapper from './OnboardingWrapper';
import { useTheme } from '@/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function AuthLoadingView() {
  const { theme } = useTheme();
  return (
    <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary }]}>
      <ActivityIndicator size="large" color={theme.colors.accent.primary} />
    </View>
  );
}

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
      Onboarding: 'onboarding-flow',
      Main: 'main',
    },
  },
};

export default function RootNavigator() {
  const { user, isInitialized, initializeAuth } = useAuthStore();
  const { needsOnboarding, isLoading: isOnboardingLoading, refetch: refetchOnboarding } = useOnboardingStatus();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    initializeAuth().then((unsub) => {
      unsubscribe = unsub;
      setIsReady(true);
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initializeAuth]);

  if (!isReady || !isInitialized) {
    return <AuthLoadingView />;
  }

  const isAuthenticated = !!user;

  // Authenticated + needs onboarding → show 4-step onboarding flow
  // Wait for onboarding status to load to avoid flashing wrong screen
  const showOnboarding = isAuthenticated && needsOnboarding && !isOnboardingLoading;
  const onboardingLoading = isAuthenticated && isOnboardingLoading;

  if (onboardingLoading) {
    return <AuthLoadingView />;
  }

  return (
    <NavigationContainer linking={linking as LinkingOptions<RootStackParamList>}>
      <Stack.Navigator
        key={isAuthenticated ? (showOnboarding ? 'onboarding' : 'main') : 'auth'}
        screenOptions={{ headerShown: false }}
        initialRouteName={
          !isAuthenticated ? 'Setup' : showOnboarding ? 'Onboarding' : 'Main'
        }
      >
        <Stack.Screen name="Setup" component={SetupScreen} />
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : showOnboarding ? (
          <Stack.Screen name="Onboarding">
            {() => <OnboardingWrapper onComplete={refetchOnboarding} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
        <Stack.Screen name="Showcase" component={ShowcaseScreen} />
        <Stack.Screen name="Health" component={HealthScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
