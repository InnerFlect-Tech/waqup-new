import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '@/navigation/types';
import { useTheme, spacing, borderRadius } from '@/theme';
import { Screen } from '@/components/layout';
import { Typography, Card, Button } from '@/components';

type Props = BottomTabScreenProps<MainTabParamList, 'Library'>;

export default function LibraryScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <Screen scrollable padding={false}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Typography
            variant="h1"
            style={{ color: colors.text.primary, fontWeight: '300', letterSpacing: -1 }}
          >
            Your Library
          </Typography>
          <Typography variant="body" style={{ color: colors.text.secondary, marginTop: spacing.xs }}>
            All your rituals and affirmations in one place
          </Typography>
        </View>

        <Card
          variant="default"
          style={{
            padding: spacing.xxl,
            backgroundColor: colors.glass.opaque,
            borderColor: colors.glass.border,
            alignItems: 'center',
            borderWidth: 1,
            borderRadius: borderRadius.xl,
          }}
        >
          <Typography variant="h2" style={{ fontSize: 48, marginBottom: spacing.md }}>
            📚
          </Typography>
          <Typography variant="h3" style={{ color: colors.text.primary, marginBottom: spacing.sm, textAlign: 'center' }}>
            Your library is empty
          </Typography>
          <Typography
            variant="body"
            style={{ color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xl, lineHeight: 22 }}
          >
            Create your first affirmation, meditation, or ritual and it will appear here
          </Typography>
          <Button
            variant="primary"
            size="md"
            onPress={() => navigation.navigate('Create')}
          >
            Create Content
          </Button>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.xl,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
});
