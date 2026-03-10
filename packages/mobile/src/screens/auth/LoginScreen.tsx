import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { Screen } from '@/components/layout';
import { Button, Input, Typography, Card } from '@/components';
import { loginSchema } from '@waqup/shared/schemas';
import { useAuthStore } from '@/stores/authStore';
import { spacing, borderRadius } from '@/theme';
import type { LoginFormData } from '@waqup/shared/schemas';
import { signInWithGoogle } from '@/services/googleAuth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation, route }: Props) {
  const { t } = useTranslation(['auth', 'common']);
  const { theme } = useTheme();
  const colors = theme.colors;
  const { login, isLoading, error, setError } = useAuthStore();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const message = route.params?.message;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Clear error when component mounts or when navigating away
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    await login(data.email, data.password);
    // Navigation happens automatically via RootNavigator auth state check
  };

  const handleGoogleSignIn = async () => {
    setGoogleError(null);
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    setGoogleLoading(false);
    if (result.error) {
      setGoogleError(result.error);
    }
    // On success, onAuthStateChange fires SIGNED_IN → RootNavigator navigates automatically
  };

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
                {t('login.subtitle')}
              </Typography>
            </View>

            {/* Login Form */}
            <Card variant="elevated" style={styles.card}>
              {message && (
                <View style={[styles.messageContainer, { backgroundColor: `${colors.success}20`, borderColor: colors.success }]}>
                  <Typography variant="body" style={{ color: colors.success }}>
                    {message}
                  </Typography>
                </View>
              )}
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
                    label={t('fields.email')}
                    placeholder={t('login.emailPlaceholder')}
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
                    label={t('fields.password')}
                    placeholder={t('login.passwordPlaceholder')}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
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
                style={styles.loginButton}
              >
                {t('login.submit')}
              </Button>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotPasswordLink}
              >
                <Typography variant="body" style={{ color: colors.accent.tertiary }}>
                  {t('login.forgotPassword')}
                </Typography>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={[styles.dividerLine, { backgroundColor: colors.glass.border }]} />
                <Typography variant="small" style={[styles.dividerText, { color: colors.text.secondary }]}>
                  {t('common:or')}
                </Typography>
                <View style={[styles.dividerLine, { backgroundColor: colors.glass.border }]} />
              </View>

              {/* Google error */}
              {googleError && (
                <View style={[styles.errorContainer, { backgroundColor: `${colors.error}20`, borderColor: colors.error, marginBottom: spacing.sm }]}>
                  <Typography variant="body" style={{ color: colors.error }}>
                    {googleError}
                  </Typography>
                </View>
              )}

              {/* Google Sign In */}
              <TouchableOpacity
                onPress={handleGoogleSignIn}
                disabled={googleLoading || isLoading}
                style={[
                  styles.googleButton,
                  {
                    borderColor: colors.glass.border,
                    backgroundColor: colors.glass.opaque,
                    opacity: googleLoading || isLoading ? 0.6 : 1,
                  },
                ]}
                activeOpacity={0.75}
              >
                <Typography variant="body" style={{ fontSize: 18, lineHeight: 22 }}>
                  G
                </Typography>
                <Typography variant="bodyBold" style={{ color: colors.text.primary, marginLeft: spacing.sm }}>
                  {googleLoading ? t('login.connectingToGoogle') : t('login.continueWithGoogle')}
                </Typography>
              </TouchableOpacity>
            </Card>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Typography variant="body" style={{ color: colors.text.secondary }}>
                {t('login.noAccount')}{' '}
              </Typography>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Typography variant="bodyBold" style={{ color: colors.accent.tertiary }}>
                  {t('login.signupLink')}
                </Typography>
              </TouchableOpacity>
            </View>
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
  messageContainer: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
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
  loginButton: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  forgotPasswordLink: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
  },
});
