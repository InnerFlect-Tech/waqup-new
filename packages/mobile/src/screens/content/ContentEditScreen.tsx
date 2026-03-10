import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Button, Input, Card, Loading } from '@/components';
import { useContentItemQuery, useUpdateContent } from '@/hooks';
import { MainStackParamList } from '@/navigation/types';
import type { ContentItemType } from '@waqup/shared/types';

type Props = NativeStackScreenProps<MainStackParamList, 'ContentEdit'>;

export default function ContentEditScreen({ navigation, route }: Props) {
  const { contentId, contentType } = route.params;
  const { theme } = useTheme();
  const colors = theme.colors;
  const { data: item, isLoading } = useContentItemQuery(contentId);
  const updateMutation = useUpdateContent(contentId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [script, setScript] = useState('');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description ?? '');
      setScript(item.script ?? '');
    }
  }, [item]);

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ title, description, script });
      Alert.alert('Saved', 'Your changes have been saved.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to save');
    }
  };

  if (isLoading || !item) {
    return (
      <Screen scrollable padding={false}>
        <View style={styles.loading}>
          <Loading variant="spinner" size="lg" />
        </View>
      </Screen>
    );
  }

  const label = contentType.charAt(0).toUpperCase() + contentType.slice(1);

  return (
    <Screen scrollable padding={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back} activeOpacity={0.8}>
          <Typography variant="body" style={{ color: colors.accent.primary }}>← Back</Typography>
        </TouchableOpacity>

        <Typography variant="h2" style={[styles.header, { color: colors.text.primary }]}>
          Edit {label}
        </Typography>
        <Typography variant="body" style={[styles.subheader, { color: colors.text.secondary }]}>
          Update the details of your {contentType}.
        </Typography>

        <Card variant="default" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
          />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter description"
          />
          <Input
            label="Script"
            value={script}
            onChangeText={setScript}
            placeholder="Enter script"
            multiline
            style={{ minHeight: 120, textAlignVertical: 'top' }}
          />
        </Card>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => void handleSave()}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saving…' : 'Save changes'}
        </Button>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  back: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  subheader: {
    marginBottom: spacing.xl,
  },
  card: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.xl,
  },
});
