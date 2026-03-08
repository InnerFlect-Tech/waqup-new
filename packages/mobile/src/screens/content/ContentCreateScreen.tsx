import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button, Progress } from '@/components';

type Props = NativeStackScreenProps<MainStackParamList, 'ContentCreate'>;

const TYPE_LABELS: Record<string, string> = {
  affirmation: 'Affirmation',
  meditation: 'Meditation',
  ritual: 'Ritual',
};

const MODE_LABELS: Record<string, string> = {
  form: 'Quick Form',
  chat: 'Guided Chat',
  agent: 'AI Agent',
};

const TYPE_ICONS: Record<string, string> = {
  affirmation: '✨',
  meditation: '🧘',
  ritual: '🔮',
};

interface FormField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
}

const FORM_FIELDS: Record<string, FormField[]> = {
  affirmation: [
    { key: 'title', label: 'Title', placeholder: 'E.g. Morning Confidence Boost' },
    { key: 'goal', label: 'Goal / Belief to shift', placeholder: 'What belief or pattern do you want to change?', multiline: true },
    { key: 'duration', label: 'Duration (minutes)', placeholder: 'E.g. 5' },
    { key: 'frequency', label: 'Frequency', placeholder: 'E.g. Daily, 3x per week' },
  ],
  meditation: [
    { key: 'title', label: 'Title', placeholder: 'E.g. Deep Ocean Calm' },
    { key: 'intention', label: 'Intention', placeholder: 'What state do you want to reach?', multiline: true },
    { key: 'duration', label: 'Duration (minutes)', placeholder: 'E.g. 20' },
    { key: 'setting', label: 'Setting / Theme', placeholder: 'E.g. Beach, forest, cosmic void' },
  ],
  ritual: [
    { key: 'title', label: 'Title', placeholder: 'E.g. Morning Power Ritual' },
    { key: 'identity', label: 'Identity to embody', placeholder: 'Who do you become through this ritual?', multiline: true },
    { key: 'duration', label: 'Duration (minutes)', placeholder: 'E.g. 30' },
    { key: 'elements', label: 'Key elements', placeholder: 'Breathwork, visualisation, affirmations, etc.' },
    { key: 'frequency', label: 'Frequency', placeholder: 'E.g. Every morning' },
  ],
};

export default function ContentCreateScreen({ navigation, route }: Props) {
  const { contentType, mode } = route.params;
  const { theme } = useTheme();
  const colors = theme.colors;

  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields = FORM_FIELDS[contentType] ?? [];
  const filledCount = fields.filter((f) => (formValues[f.key] ?? '').trim().length > 0).length;
  const progress = fields.length > 0 ? filledCount / fields.length : 0;

  const handleFieldChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const canSubmit = filledCount >= Math.ceil(fields.length * 0.5);

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    // API integration wired in Phase 7/9
    setTimeout(() => {
      setIsSubmitting(false);
      navigation.navigate('Tabs');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen scrollable={false} padding={false}>
        {/* Nav bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Typography variant="body" style={{ color: colors.accent.primary }}>
              ← Back
            </Typography>
          </TouchableOpacity>
          <Typography variant="captionBold" style={{ color: colors.text.secondary }}>
            {MODE_LABELS[mode]}
          </Typography>
        </View>

        {/* Progress bar */}
        <View style={{ paddingHorizontal: spacing.xl, paddingBottom: spacing.md }}>
          <Progress value={progress * 100} color="primary" />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Typography variant="h2" style={{ fontSize: 32 }}>
              {TYPE_ICONS[contentType]}
            </Typography>
            <Typography
              variant="h2"
              style={{ color: colors.text.primary, fontWeight: '300', marginTop: spacing.sm }}
            >
              New {TYPE_LABELS[contentType]}
            </Typography>
          </View>

          {/* Form fields */}
          {mode === 'form' ? (
            <View style={styles.form}>
              {fields.map((field) => (
                <View key={field.key} style={styles.fieldGroup}>
                  <Typography variant="captionBold" style={{ color: colors.text.secondary, marginBottom: spacing.sm }}>
                    {field.label}
                  </Typography>
                  <TextInput
                    value={formValues[field.key] ?? ''}
                    onChangeText={(v) => handleFieldChange(field.key, v)}
                    placeholder={field.placeholder}
                    placeholderTextColor={colors.text.secondary}
                    multiline={field.multiline}
                    numberOfLines={field.multiline ? 4 : 1}
                    style={[
                      styles.textInput,
                      field.multiline && styles.textInputMulti,
                      {
                        color: colors.text.primary,
                        backgroundColor: colors.glass.opaque,
                        borderColor: formValues[field.key]
                          ? colors.accent.primary
                          : colors.glass.border,
                      },
                    ]}
                  />
                </View>
              ))}

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onPress={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                style={{ marginTop: spacing.xl }}
              >
                {isSubmitting ? 'Creating...' : 'Create Practice'}
              </Button>
            </View>
          ) : (
            <Card
              variant="default"
              style={[
                styles.comingSoonCard,
                { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border },
              ]}
            >
              <Typography variant="h2" style={{ fontSize: 40, marginBottom: spacing.md }}>
                {mode === 'chat' ? '💬' : '🤖'}
              </Typography>
              <Typography variant="h4" style={{ color: colors.text.primary, textAlign: 'center' }}>
                {MODE_LABELS[mode]} Coming in Phase 9
              </Typography>
              <Typography
                variant="body"
                style={{ color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm }}
              >
                AI-powered creation will be wired in Phase 9 (AI Integration). Use Quick Form for now.
              </Typography>
              <Button
                variant="outline"
                size="md"
                onPress={() => navigation.navigate('ContentCreate', { contentType, mode: 'form' })}
                style={{ marginTop: spacing.xl }}
              >
                Use Quick Form Instead
              </Button>
            </Card>
          )}
        </ScrollView>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.lg,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    height: 48,
  },
  textInputMulti: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  comingSoonCard: {
    padding: spacing.xxl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
});
