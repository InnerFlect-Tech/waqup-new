import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { Screen } from '@/components/layout';
import { Button, Input, Typography, Card } from '@/components';
import { forgotPasswordSchema } from '@waqup/shared/schemas';
import { useAuthStore } from '@/stores';
import { spacing, borderRadius } from '@/theme';
import type { ForgotPasswordFormData } from '@waqup/shared/schemas';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { requestPasswordReset, isLoading, error, setError } = useAuthStore();
  const [emailSent, setEmailSent] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Clear error when component mounts
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    // For mobile, use deep linking URL
    const redirectTo = 'waqup://reset-password';
    const result = await requestPasswordReset(data.email, redirectTo);
    
    if (result.success) {
      setUserEmail(data.email);
      setEmailSent(true);
    }
    // Error is already set in the store
  };

  if (emailSent) {
    return (
      <Screen scrollable padding={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <Card variant="elevated" style={styles.card}>
                <Typography variant="h2" style={[styles.successTitle, { color: colors.text.primary }]}>
                  Check Your Email
                </Typography>
                <Typography variant="body" style={[styles.successMessage, { color: colors.text.secondary }]}>
                  We've sent a password reset link to {userEmail}. Please check your inbox and follow the instructions to reset your password.
                </Typography>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={() => navigation.navigate('Login')}
                  style={styles.backButton}
                >
                  Back to Login
                </Button>
              </Card>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Screen>
    );
  }

  return (
    <Screen scrollable padding={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Typography
                variant="h1"
                style={[
                  styles.logo,
                  {
                    color: colors.text.primary,
                    fontWeight: '300',
                    letterSpacing: -2,
                  },
                ]}
              >
                {'wa'}<Text style={{ color: colors.accent.tertiary }}>Q</Text>{'up'}
              </Typography>
              <Typography variant="body" style={[styles.subtitle, { color: colors.text.secondary }]}>
                Reset your password
              </Typography>
            </View>

            {/* Forgot Password Form */}
            <Card variant="elevated" style={styles.card}>
              {error && (
                <View style={[styles.errorContainer, { backgroundColor: `${colors.error}20`, borderColor: colors.error }]}>
                  <Typography variant="body" style={{ color: colors.error }}>
                    {error}
                  </Typography>
                </View>
              )}

              <Typography variant="body" style={[styles.instructions, { color: colors.text.secondary }]}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Email"
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    containerStyle={styles.input}
                  />
                )}
              />

              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
              >
                Send Reset Link
              </Button>

              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.backToLogin}
              >
                <Typography variant="body" style={{ color: colors.accent.tertiary }}>
                  Back to Login
                </Typography>
              </TouchableOpacity>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: 48,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  errorContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  instructions: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  input: {
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  backToLogin: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  successTitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  successMessage: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  backButton: {
    marginTop: spacing.md,
  },
});
