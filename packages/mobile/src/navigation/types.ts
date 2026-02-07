/**
 * Navigation Type Definitions for Mobile App
 * Defines all navigation routes and their parameters
 */

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Showcase: undefined;
};

export type AuthStackParamList = {
  Login: { message?: string } | undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string } | undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Library: undefined;
  Create: undefined;
  Profile: undefined;
};

// Helper type for navigation props
export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: {
    navigate: (screen: T, params?: RootStackParamList[T]) => void;
    goBack: () => void;
  };
  route: {
    params: RootStackParamList[T];
  };
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = {
  navigation: {
    navigate: (screen: T, params?: AuthStackParamList[T]) => void;
    goBack: () => void;
  };
  route: {
    params: AuthStackParamList[T];
  };
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = {
  navigation: {
    navigate: (screen: T, params?: MainTabParamList[T]) => void;
    jumpTo: (screen: T) => void;
  };
  route: {
    params: MainTabParamList[T];
  };
};
