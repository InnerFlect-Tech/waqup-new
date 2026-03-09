import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button, QCoin } from '@/components';
import { useCreditBalance } from '@/hooks';

type Props = NativeStackScreenProps<MainStackParamList, 'Credits'>;

const PLANS = [
  { name: 'Starter', qs: 50, price: '$4.99', color: '#60a5fa', description: '50 Qs monthly — perfect for exploring' },
  { name: 'Growth', qs: 200, price: '$14.99', color: '#c084fc', description: '200 Qs monthly — daily practice', popular: true },
  { name: 'Devotion', qs: 500, price: '$29.99', color: '#f59e0b', description: '500 Qs monthly — serious transformation' },
];

export default function CreditsScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { balance } = useCreditBalance();

  return (
    <Screen scrollable padding={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Typography variant="body" style={{ color: colors.accent.primary }}>← Back</Typography>
          </TouchableOpacity>
          <Typography variant="h2" style={{ color: colors.text.primary, fontWeight: '300', marginTop: spacing.lg }}>
            Credits
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
            Qs power your AI content creation
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

        <View style={{ gap: spacing.md }}>
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              variant="default"
              style={[
                styles.planCard,
                {
                  backgroundColor: plan.popular ? `${plan.color}12` : colors.glass.opaque,
                  borderColor: plan.popular ? `${plan.color}50` : colors.glass.border,
                },
              ]}
            >
              {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                  <Typography variant="small" style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
                    MOST POPULAR
                  </Typography>
                </View>
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm }}>
                <Typography variant="h3" style={{ color: colors.text.primary, fontWeight: '500' }}>
                  {plan.name}
                </Typography>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                  <QCoin size="sm" />
                  <Typography variant="h3" style={{ color: plan.color, fontWeight: '700' }}>
                    {plan.qs}
                  </Typography>
                </View>
              </View>
              <Typography variant="small" style={{ color: colors.text.secondary, marginBottom: spacing.md }}>
                {plan.description}
              </Typography>
              <Button variant={plan.popular ? 'primary' : 'outline'} size="md" fullWidth>
                {plan.price} / month
              </Button>
            </Card>
          ))}
        </View>

        <Typography variant="small" style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.xl, lineHeight: 18 }}>
          Qs are used for AI-powered creation.{'\n'}Practice is always free — unlimited replays.
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
