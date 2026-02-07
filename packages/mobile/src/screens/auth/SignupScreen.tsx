import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { Screen } from '@/components/layout';
import { Button, Input, Typography, Card } from '@/components';
import { signupSchema } from '@waqup/shared/schemas';
import { useAuthStore } from '@/stores';
import { spacing, borderRadius } from '@/theme';
import type { SignupFormData } from '@waqup/shared/schemas';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { signup, isLoading, error, setError, resendVerificationEmail } = useAuthStore();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');

  // Clear error when component mounts
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    const result = await signup(data.email, data.password);
    
    if (result.success) {
      setUserEmail(data.email);
      setSignupSuccess(true);
    }
    // Error is already set in the store
  };

  const handleResendVerification = async () => {
    if (userEmail) {
      await resendVerificationEmail(userEmail);
    }
  };

  if (signupSuccess) {
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
              <Card variant="elevated" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
                <Typography variant="h2" style={[styles.successTitle, { color: colors.text.primary }]}>
                  Check Your Email
                </Typography>
                <Typography variant="body" style={[styles.successMessage, { color: colors.text.secondary }]}>
                  We've sent a verification email to {userEmail}. Please check your inbox and click the verification link to activate your account.
                </Typography>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onPress={handleResendVerification}
                  style={styles.resendButton}
                >
                  Resend Verification Email
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
                Create your account
              </Typography>
            </View>

            {/* Signup Form */}
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

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Password"
                    placeholder="Create a password"
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
                    label="Confirm Password"
                    placeholder="Confirm your password"
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

              <Controller
                control={control}
                name="acceptTerms"
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    onPress={() => onChange(!value)}
                    style={styles.checkboxContainer}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: value ? colors.accent.primary : 'transparent',
                          borderColor: value ? colors.accent.primary : colors.glass.border,
                        },
                      ]}
                    >
                      {value && (
                        <Typography variant="small" style={{ color: colors.text.onDark }}>
                          ✓
                        </Typography>
                      )}
                    </View>
                    <Typography variant="caption" style={[styles.termsText, { color: colors.text.secondary }]}>
                      I accept the Terms of Service and Privacy Policy
                    </Typography>
                  </TouchableOpacity>
                )}
              />
              {errors.acceptTerms && (
                <Typography variant="small" style={{ color: colors.error, marginTop: spacing.xs }}>
                  {errors.acceptTerms.message}
                </Typography>
              )}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                onPress={handleSubmit(onSubmit)}
                style={styles.signupButton}
              >
                Create Account
              </Button>

              <View style={styles.loginContainer}>
                <Typography variant="body" style={{ color: colors.text.secondary }}>
                  Already have an account?{' '}
                </Typography>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Typography variant="bodyBold" style={{ color: colors.accent.tertiary }}>
                    Sign In
                  </Typography>
                </TouchableOpacity>
              </View>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    marginRight: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
  },
  signupButton: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
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
  resendButton: {
    marginBottom: spacing.md,
  },
  backToLogin: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});
