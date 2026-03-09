import { useCallback, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricType = 'fingerprint' | 'face' | 'iris' | 'none';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export interface UseBiometricAuthReturn {
  isAvailable: boolean;
  biometricType: BiometricType;
  isEnrolled: boolean;
  authenticate: (reason?: string) => Promise<BiometricAuthResult>;
}

function mapAuthType(
  types: LocalAuthentication.AuthenticationType[],
): BiometricType {
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) return 'face';
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) return 'fingerprint';
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) return 'iris';
  return 'none';
}

/**
 * Hook for biometric (Face ID / Touch ID / fingerprint) authentication on mobile.
 *
 * Usage:
 *   const { isAvailable, authenticate } = useBiometricAuth();
 *   const result = await authenticate('Confirm to unlock your Sanctuary');
 */
export function useBiometricAuth(): UseBiometricAuthReturn {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<BiometricType>('none');
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function probe() {
      const [hasHardware, enrolled, types] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
        LocalAuthentication.supportedAuthenticationTypesAsync(),
      ]);

      if (cancelled) return;

      setIsAvailable(hasHardware);
      setIsEnrolled(enrolled);
      setBiometricType(mapAuthType(types));
    }

    void probe();
    return () => { cancelled = true; };
  }, []);

  const authenticate = useCallback(
    async (reason = 'Authenticate to continue'): Promise<BiometricAuthResult> => {
      if (!isAvailable || !isEnrolled) {
        return { success: false, error: 'Biometrics not available' };
      }

      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: reason,
          cancelLabel: 'Cancel',
          disableDeviceFallback: false,
        });

        return {
          success: result.success,
          error: result.success ? undefined : (result.error ?? 'Authentication failed'),
        };
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        };
      }
    },
    [isAvailable, isEnrolled],
  );

  return { isAvailable, biometricType, isEnrolled, authenticate };
}
