import React, { createContext, useContext, useCallback } from 'react';

export interface OnboardingCompletionContextValue {
  completeOnboarding: () => Promise<void>;
}

const Context = createContext<OnboardingCompletionContextValue | null>(null);

export function OnboardingCompletionProvider({
  children,
  onComplete,
}: {
  children: React.ReactNode;
  onComplete: () => Promise<void>;
}) {
  const completeOnboarding = useCallback(async () => {
    await onComplete();
  }, [onComplete]);

  return (
    <Context.Provider value={{ completeOnboarding }}>
      {children}
    </Context.Provider>
  );
}

export function useOnboardingCompletion(): OnboardingCompletionContextValue {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error('useOnboardingCompletion must be used within OnboardingCompletionProvider');
  }
  return ctx;
}
