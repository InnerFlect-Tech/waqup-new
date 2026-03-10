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
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button, QCoin } from '@/components';
import { useCreditBalance } from '@/hooks';
import { PRACTICE_IS_FREE_ONE_LINER } from '@waqup/shared/constants';
import { getOfferings, purchasePackage, restorePurchases } from '@/services/iap';

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
    color: '#60a5fa',
    description: '50 Qs — perfect for exploring',
    popular: false,
  },
  {
    identifier: 'com.waqup.credits.200',
    name: 'Growth',
    qs: 200,
    color: '#c084fc',
    description: '200 Qs — fuel for daily practice',
    popular: true,
  },
  {
    identifier: 'com.waqup.credits.500',
    name: 'Devotion',
    qs: 500,
    color: '#f59e0b',
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
          /* Fallback when StoreKit is unavailable (e.g. simulator without StoreKit config) */
          <View style={styles.unavailableBox}>
            <Typography variant="body" style={{ color: colors.text.secondary, textAlign: 'center' }}>
              Purchases are not available on this device.{'\n'}
              Please use a physical iPhone to purchase Qs.
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
                      <Typography variant="small" style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
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
                      <ActivityIndicator size="small" color="#fff" />
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

        {/* Restore purchases — required by Apple */}
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

        {/* Manage subscriptions link */}
        {Platform.OS === 'ios' && (
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
  unavailableBox: {
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
  },
});
