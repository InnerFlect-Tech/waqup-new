import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Linking,
  AppState,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import * as WebBrowser from 'expo-web-browser';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button, QCoin } from '@/components';
import { useCreditBalance } from '@/hooks';
import {
  PRACTICE_IS_FREE_ONE_LINER,
  CONTENT_TYPE_COLORS,
  ELEVATED_BADGE_COLOR,
  CREDIT_PACKS,
  getPackSavings,
  type CreditPackId,
} from '@waqup/shared/constants';
import { getOfferings, purchasePackage, restorePurchases } from '@/services/iap';
import { createCreditCheckoutSession } from '@/services/stripe-checkout';

type Props = NativeStackScreenProps<MainStackParamList, 'Credits'>;

/**
 * Fallback plan metadata for display when RevenueCat offerings are loading.
 * Prices are always sourced from StoreKit at runtime — these are visual placeholders only.
 */
const PLAN_META = [
  {
    identifier: 'com.waqup.credits.50',
    name: 'Starter',
    qs: 50,
    color: CONTENT_TYPE_COLORS.meditation,
    description: '50 Qs — perfect for exploring',
    popular: false,
  },
  {
    identifier: 'com.waqup.credits.200',
    name: 'Growth',
    qs: 200,
    color: CONTENT_TYPE_COLORS.affirmation,
    description: '200 Qs — fuel for daily practice',
    popular: true,
  },
  {
    identifier: 'com.waqup.credits.500',
    name: 'Devotion',
    qs: 500,
    color: ELEVATED_BADGE_COLOR,
    description: '500 Qs — serious transformation',
    popular: false,
  },
];

function getPlanMeta(productId: string) {
  return PLAN_META.find((p) => productId.includes(p.identifier.split('.').pop() ?? ''));
}

export default function CreditsScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { balance, refetch: refreshBalance } = useCreditBalance();

  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loadingOffering, setLoadingOffering] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [stripePurchasingId, setStripePurchasingId] = useState<CreditPackId | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    let mounted = true;
    getOfferings().then((o) => {
      if (mounted) {
        setOffering(o);
        setLoadingOffering(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  // Refetch balance when app comes to foreground (e.g. after Stripe checkout in browser)
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refreshBalance();
    });
    return () => sub.remove();
  }, [refreshBalance]);

  const handlePurchase = async (pkg: PurchasesPackage) => {
    if (purchasingId) return;
    setPurchasingId(pkg.identifier);
    try {
      const result = await purchasePackage(pkg);
      if (result.success) {
        await refreshBalance();
        Alert.alert('Purchase Successful', 'Your Qs have been added to your balance.');
      } else if (!result.userCancelled) {
        Alert.alert('Purchase Failed', result.error ?? 'Something went wrong. Please try again.');
      }
    } finally {
      setPurchasingId(null);
    }
  };

  const handleStripeCheckout = async (packId: CreditPackId) => {
    if (stripePurchasingId) return;
    setStripePurchasingId(packId);
    try {
      const result = await createCreditCheckoutSession(packId);
      if (!result.success) {
        Alert.alert('Checkout', result.error ?? 'Something went wrong. Please try again.');
        return;
      }
      if (!result.url) return;
      await WebBrowser.openBrowserAsync(result.url);
      await refreshBalance();
      Alert.alert('Purchase Complete', 'Your Qs have been added to your balance.');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to open checkout.');
    } finally {
      setStripePurchasingId(null);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const result = await restorePurchases();
      if (result.success) {
        await refreshBalance();
        Alert.alert('Restore Complete', 'Your previous purchases have been restored.');
      } else {
        Alert.alert('Restore Failed', result.error ?? 'No previous purchases found.');
      }
    } finally {
      setIsRestoring(false);
    }
  };

  const handleManageSubscriptions = () => {
    if (Platform.OS === 'ios') {
      void Linking.openURL('https://apps.apple.com/account/subscriptions');
    }
  };

  const packages: PurchasesPackage[] = offering?.availablePackages ?? [];

  return (
    <Screen scrollable padding={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Typography variant="body" style={{ color: colors.accent.primary }}>← Back</Typography>
          </TouchableOpacity>
          <Typography variant="h2" style={{ color: colors.text.primary, fontWeight: '300', marginTop: spacing.lg }}>
            Qs
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
            {PRACTICE_IS_FREE_ONE_LINER}
          </Typography>
        </View>

        {/* Balance card */}
        <Card variant="elevated" style={[styles.balanceCard, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
          <View style={{ alignItems: 'center', padding: spacing.xl }}>
            <QCoin size="lg" showAmount={balance} />
            <Typography variant="h1" style={{ color: colors.text.primary, marginTop: spacing.md, fontWeight: '300' }}>
              {balance} Qs
            </Typography>
            <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
              Available balance
            </Typography>
          </View>
        </Card>

        {/* Plans */}
        <Typography variant="h3" style={{ color: colors.text.primary, marginTop: spacing.xl, marginBottom: spacing.md, fontWeight: '400' }}>
          Get more Qs
        </Typography>

        {loadingOffering ? (
          <View style={{ alignItems: 'center', paddingVertical: spacing.xxl }}>
            <ActivityIndicator size="large" color={colors.accent.primary} />
            <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.md }}>
              Loading plans…
            </Typography>
          </View>
        ) : packages.length === 0 ? (
          /* Fallback: Stripe checkout when RevenueCat/StoreKit unavailable (e.g. simulator) */
          <View style={{ gap: spacing.md }}>
            <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.xs }}>
              Buy Qs with your card
            </Typography>
            {CREDIT_PACKS.map((pack) => {
              const savings = getPackSavings(pack);
              const isBestValue = pack.badge === 'Best Value';
              const isPurchasing = stripePurchasingId === pack.id;

              return (
                <Card
                  key={pack.id}
                  variant="default"
                  style={[
                    styles.planCard,
                    {
                      backgroundColor: isBestValue ? `${colors.accent.primary}18` : colors.glass.opaque,
                      borderColor: isBestValue ? `${colors.accent.primary}50` : colors.glass.border,
                    },
                  ]}
                >
                  {isBestValue && (
                    <View style={[styles.popularBadge, { backgroundColor: colors.accent.primary }]}>
                      <Typography variant="small" style={{ color: colors.text.onDark, fontSize: 10, fontWeight: '700' }}>
                        BEST VALUE
                      </Typography>
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                    <Typography variant="h3" style={{ color: colors.text.primary, fontWeight: '500' }}>
                      {pack.name}
                    </Typography>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                      <QCoin size="sm" />
                      <Typography variant="h3" style={{ color: colors.accent.primary, fontWeight: '700' }}>
                        {pack.credits}
                      </Typography>
                    </View>
                  </View>
                  <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
                    {pack.description}
                  </Typography>
                  {savings && (
                    <Typography variant="small" style={{ color: colors.accent.tertiary, marginBottom: spacing.sm }}>
                      Save {savings.discountPercent}% · €{savings.savedEuros.toFixed(2)} vs Spark
                    </Typography>
                  )}
                  <Button
                    variant={isBestValue ? 'primary' : 'outline'}
                    size="md"
                    fullWidth
                    onPress={() => void handleStripeCheckout(pack.id)}
                    disabled={!!stripePurchasingId}
                  >
                    {isPurchasing ? (
                      <ActivityIndicator size="small" color={colors.text.onDark} />
                    ) : (
                      `${pack.ctaLabel} · €${pack.price.toFixed(2)}`
                    )}
                  </Button>
                </Card>
              );
            })}
            <Typography variant="small" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm }}>
              Opens in browser. Return to the app to see your balance.
            </Typography>
          </View>
        ) : (
          <View style={{ gap: spacing.md }}>
            {packages.map((pkg) => {
              const meta = getPlanMeta(pkg.product.identifier) ?? {
                name: pkg.product.title,
                qs: 0,
                color: colors.accent.primary,
                description: pkg.product.description,
                popular: false,
              };
              const isPurchasing = purchasingId === pkg.identifier;

              return (
                <Card
                  key={pkg.identifier}
                  variant="default"
                  style={[
                    styles.planCard,
                    {
                      backgroundColor: meta.popular ? `${meta.color}12` : colors.glass.opaque,
                      borderColor: meta.popular ? `${meta.color}50` : colors.glass.border,
                    },
                  ]}
                >
                  {meta.popular && (
                    <View style={[styles.popularBadge, { backgroundColor: meta.color }]}>
                      <Typography variant="small" style={{ color: colors.text.onDark, fontSize: 10, fontWeight: '700' }}>
                        MOST POPULAR
                      </Typography>
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                    <Typography variant="h3" style={{ color: colors.text.primary, fontWeight: '500' }}>
                      {meta.name}
                    </Typography>
                    {meta.qs > 0 && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                        <QCoin size="sm" />
                        <Typography variant="h3" style={{ color: meta.color, fontWeight: '700' }}>
                          {meta.qs}
                        </Typography>
                      </View>
                    )}
                  </View>
                  <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
                    {meta.description}
                  </Typography>
                  <Button
                    variant={meta.popular ? 'primary' : 'outline'}
                    size="md"
                    fullWidth
                    onPress={() => void handlePurchase(pkg)}
                    disabled={!!purchasingId}
                  >
                    {isPurchasing ? (
                      <ActivityIndicator size="small" color={colors.text.onDark} />
                    ) : (
                      `${pkg.product.priceString} / month`
                    )}
                  </Button>
                </Card>
              );
            })}
          </View>
        )}

        {/* Apple subscription disclosure — required by App Store Guidelines */}
        {packages.length > 0 && (
          <Typography variant="small" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.lg, lineHeight: 18 }}>
            Payment will be charged to your Apple ID account. Subscriptions automatically renew unless auto-renewal is turned off at least 24 hours before the end of the current period. You can manage and cancel your subscriptions in your App Store account settings.
          </Typography>
        )}

        {/* Restore purchases — required by Apple (only when IAP available) */}
        {packages.length > 0 && (
          <TouchableOpacity
            onPress={() => void handleRestore()}
            disabled={isRestoring}
            style={{ marginTop: spacing.xl, alignItems: 'center', paddingVertical: spacing.md }}
            activeOpacity={0.7}
          >
            {isRestoring ? (
              <ActivityIndicator size="small" color={colors.accent.primary} />
            ) : (
              <Typography variant="body" style={{ color: colors.accent.primary }}>
                Restore Purchases
              </Typography>
            )}
          </TouchableOpacity>
        )}

        {/* Manage subscriptions link (only when IAP available) */}
        {packages.length > 0 && Platform.OS === 'ios' && (
          <TouchableOpacity
            onPress={handleManageSubscriptions}
            style={{ alignItems: 'center', paddingVertical: spacing.sm }}
            activeOpacity={0.7}
          >
            <Typography variant="small" style={{ color: colors.text.secondary }}>
              Manage Subscriptions
            </Typography>
          </TouchableOpacity>
        )}

        <Typography variant="small" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.lg, lineHeight: 18 }}>
          {PRACTICE_IS_FREE_ONE_LINER}
        </Typography>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  balanceCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  planCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomLeftRadius: borderRadius.md,
  },
});
