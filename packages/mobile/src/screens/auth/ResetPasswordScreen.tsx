import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { Screen } from '@/components/layout';
import { Button, Input, Typography, Card } from '@/components';
import { resetPasswordSchema } from '@waqup/shared/schemas';
import { useAuthStore } from '@/stores';
import { spacing, borderRadius } from '@/theme';
import type { ResetPasswordFormData } from '@waqup/shared/schemas';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export default function ResetPasswordScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { resetPassword, isLoading, error, setError } = useAuthStore();
  const token = route.params?.token || '';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      token: token,
    },
  });

  // Clear error when component mounts
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    // Supabase handles token from URL/deep link automatically
    const result = await resetPassword(data.password);
    
    if (result.success) {
      // Navigate to login with success message
      navigation.navigate('Login', { message: 'Password reset successful. Please sign in with your new password.' });
    }
    // Error is already set in the store
  };

  if (!token) {
    return (
      <Screen scrollable padding={false}>
        <View style={styles.container}>
          <Card variant="elevated" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="h2" style={[styles.errorTitle, { color: colors.error }]}>
              Invalid Reset Link
            </Typography>
            <Typography variant="body" style={[styles.errorMessage, { color: colors.text.secondary }]}>
              This password reset link is invalid or has expired. Please request a new password reset.
            </Typography>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.requestButton}
            >
              Request New Reset Link
            </Button>
          </Card>
        </View>
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
                wa<span style={{ color: colors.accent.tertiary }}>Q</span>up
              </Typography>
              <Typography variant="body" style={[styles.subtitle, { color: colors.text.secondary }]}>
                Create new password
              </Typography>
            </View>

            {/* Reset Password Form */}
            <Card variant="elevated" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
              {error && (
                <View style={[styles.errorContainer, { backgroundColor: `${colors.error}20`, borderColor: colors.error }]}>
                  <Typography variant="body" style={{ color: colors.error }}>
                    {error}
                  </Typography>
                </View>
              )}

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="New Password"
                    placeholder="Enter new password"
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    helperText="Must contain uppercase, lowercase, and number"
                    containerStyle={styles.input}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
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
                Reset Password
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
  errorTitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  requestButton: {
    marginTop: spacing.md,
  },
});
