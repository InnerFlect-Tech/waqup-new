/**
 * In-App Purchase Service — RevenueCat
 *
 * All digital goods and subscriptions on iOS must be purchased through
 * Apple StoreKit via RevenueCat. Stripe is used only on the web platform.
 *
 * Setup required before using:
 * 1. Set EXPO_PUBLIC_REVENUECAT_IOS_KEY in packages/mobile/.env
 * 2. Create products in App Store Connect:
 *    - com.waqup.credits.50   (Consumable — Starter 50 Qs)
 *    - com.waqup.credits.200  (Consumable — Growth 200 Qs)
 *    - com.waqup.credits.500  (Consumable — Devotion 500 Qs)
 * 3. Create offerings in RevenueCat dashboard mapping to the above product IDs
 * 4. Configure RevenueCat webhook → your backend to grant Qs after purchase
 */
import { Platform } from 'react-native';
import Purchases, {
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import Constants from 'expo-constants';

const RC_IOS_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY ||
  Constants.expoConfig?.extra?.revenueCatIosKey ||
  '';

let _initialized = false;

/**
 * Initialize RevenueCat. Call once at app startup (in App.tsx) after the
 * user's Supabase session is known.
 */
export function initRevenueCat(userId?: string): void {
  if (_initialized) return;
  if (!RC_IOS_KEY) {
    if (__DEV__) {
      console.warn('[iap] EXPO_PUBLIC_REVENUECAT_IOS_KEY not set — IAP disabled');
    }
    return;
  }

  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  const apiKey = Platform.OS === 'ios' ? RC_IOS_KEY : RC_IOS_KEY;
  Purchases.configure({ apiKey });

  if (userId) {
    void Purchases.logIn(userId);
  }

  _initialized = true;
}

/**
 * Set/update the RevenueCat user ID after login.
 */
export async function identifyIAPUser(userId: string): Promise<void> {
  if (!_initialized) return;
  try {
    await Purchases.logIn(userId);
  } catch (err) {
    if (__DEV__) console.error('[iap] identifyIAPUser error:', err);
  }
}

/**
 * Reset user identity on logout.
 */
export async function resetIAPUser(): Promise<void> {
  if (!_initialized) return;
  try {
    await Purchases.logOut();
  } catch (err) {
    if (__DEV__) console.error('[iap] resetIAPUser error:', err);
  }
}

/**
 * Fetch the current offerings from RevenueCat / App Store Connect.
 * Returns null when IAP is not available (web, simulator without StoreKit config).
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  if (!_initialized) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current ?? null;
  } catch (err) {
    if (__DEV__) console.error('[iap] getOfferings error:', err);
    return null;
  }
}

export interface IAPResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
  userCancelled?: boolean;
}

/**
 * Purchase a specific package from the current offering.
 * Handles the full StoreKit purchase flow including the native payment sheet.
 */
export async function purchasePackage(pkg: PurchasesPackage): Promise<IAPResult> {
  if (!_initialized) {
    return { success: false, error: 'Purchases not initialized' };
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { success: true, customerInfo };
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'userCancelled' in err &&
      (err as { userCancelled: boolean }).userCancelled
    ) {
      return { success: false, userCancelled: true };
    }
    const message = err instanceof Error ? err.message : 'Purchase failed';
    if (__DEV__) console.error('[iap] purchasePackage error:', err);
    return { success: false, error: message };
  }
}

/**
 * Restore previous purchases. Required by Apple for all apps with IAP.
 */
export async function restorePurchases(): Promise<IAPResult> {
  if (!_initialized) {
    return { success: false, error: 'Purchases not initialized' };
  }
  try {
    const customerInfo = await Purchases.restorePurchases();
    return { success: true, customerInfo };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Restore failed';
    if (__DEV__) console.error('[iap] restorePurchases error:', err);
    return { success: false, error: message };
  }
}

/**
 * Get current customer info (entitlements, active subscriptions).
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  if (!_initialized) return null;
  try {
    return await Purchases.getCustomerInfo();
  } catch (err) {
    if (__DEV__) console.error('[iap] getCustomerInfo error:', err);
    return null;
  }
}
