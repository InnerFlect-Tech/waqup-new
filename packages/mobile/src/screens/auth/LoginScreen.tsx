/**
 * LoginScreen — Minimal Vercel-style: social-first, stacked pill buttons.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';
import { Screen } from '@/components/layout';
import { Button, Input, Typography, GoogleIcon } from '@/components';
import { loginSchema } from '@waqup/shared/schemas';
import { useAuthStore } from '@/stores/authStore';
import { spacing, borderRadius, layout, authTokens } from '@/theme';
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
  const [showEmailForm, setShowEmailForm] = useState(false);
  const message = route.params?.message;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    return () => setError(null);
  }, [setError]);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    await login(data.email, data.password);
  };

  const handleGoogleSignIn = async () => {
    setGoogleError(null);
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    setGoogleLoading(false);
    if (result.error) setGoogleError(result.error);
  };

  return (
    <Screen scrollable padding={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.keyboardView, { backgroundColor: colors.background.primary }]}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
            {/* Centered logo — minimal */}
            <View style={styles.header}>
              <Typography
                variant="h1"
                style={[styles.logo, { color: colors.text.primary, fontWeight: '300', letterSpacing: -2 }]}
              >
                {'wa'}<Text style={{ color: colors.accent.tertiary }}>Q</Text>{'up'}
              </Typography>
            </View>

            {message && (
              <View style={[styles.banner, { backgroundColor: `${colors.success}20`, borderColor: colors.success }]}>
                <Typography variant="body" style={{ color: colors.success }}>{message}</Typography>
              </View>
            )}
            {(error || googleError) && (
              <View style={[styles.banner, { backgroundColor: `${colors.error}20`, borderColor: colors.error }]}>
                <Typography variant="body" style={{ color: colors.error }}>{error || googleError}</Typography>
              </View>
            )}

            {!showEmailForm ? (
              <>
                {/* Social-first: stacked full-width pill buttons */}
                <TouchableOpacity
                  onPress={handleGoogleSignIn}
                  disabled={googleLoading || isLoading}
                  style={[
                    styles.pillButton,
                    { backgroundColor: colors.accent.primary, opacity: googleLoading || isLoading ? 0.6 : 1 },
                  ]}
                  activeOpacity={0.75}
                >
                  <GoogleIcon size={20} />
                  <Typography variant="bodyBold" style={[styles.pillText, { color: colors.text.onDark }]}>
                    {googleLoading ? t('login.connectingToGoogle') : t('login.continueWithGoogle')}
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowEmailForm(true)}
                  disabled={googleLoading || isLoading}
                  style={[styles.pillButtonOutlined, { borderColor: colors.glass.border }]}
                  activeOpacity={0.75}
                >
                  <Typography variant="bodyBold" style={{ color: colors.text.primary }}>
                    Sign in with email
                  </Typography>
                </TouchableOpacity>
              </>
            ) : (
              /* Email/password form when "Sign in with email" tapped */
              <View style={[styles.emailForm, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
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
                  style={styles.submitButton}
                >
                  {t('login.submit')}
                </Button>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotLink}>
                  <Typography variant="body" style={{ color: colors.accent.tertiary }}>{t('login.forgotPassword')}</Typography>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEmailForm(false)} style={styles.backLink}>
                  <Typography variant="caption" style={{ color: colors.text.secondary }}>← Use Google instead</Typography>
                </TouchableOpacity>
              </View>
            )}

            {/* Sign up link */}
            <View style={styles.signupContainer}>
              <Typography variant="body" style={{ color: colors.text.secondary }}>{t('login.noAccount')} </Typography>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Typography variant="bodyBold" style={{ color: colors.accent.tertiary }}>{t('login.signupLink')}</Typography>
              </TouchableOpacity>
            </View>
          </Animated.View>
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
    maxWidth: layout.authCardMaxWidth,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    fontSize: authTokens.logoFontSizeLogin,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  banner: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    minHeight: authTokens.socialButtonMinHeight,
    marginBottom: spacing.md,
  },
  pillText: {
    marginLeft: spacing.sm,
  },
  pillButtonOutlined: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    minHeight: authTokens.socialButtonMinHeight,
    marginBottom: spacing.md,
  },
  emailForm: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  forgotLink: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  backLink: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
});
