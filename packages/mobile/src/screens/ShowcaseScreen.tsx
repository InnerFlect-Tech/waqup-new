import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Container } from '@/components';
import {
  Typography,
  Button,
  Input,
  Card,
  Loading,
  Badge,
  Progress,
} from '@/components';
import { spacing, colors, typography, borderRadius, shadows } from '@/theme';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ShowcaseScreen() {
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState('');
  const [progressValue, setProgressValue] = useState(45);
  const [selectedTab, setSelectedTab] = useState('Home');

  return (
    <Container>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            waQup Design System
          </Typography>
          <Typography variant="body" color="secondary" style={styles.subtitle}>
            Complete UI Component Library & Design Tokens
          </Typography>
        </View>

        {/* Navigation Menu Showcase */}
        <Section title="Navigation Menus">
          <Card variant="elevated" style={styles.card}>
            <Typography variant="h3" style={styles.cardTitle}>
              Bottom Tab Navigation
            </Typography>
            <View style={styles.tabBar}>
              {['Home', 'Library', 'Create', 'Profile'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, selectedTab === tab && styles.tabActive]}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Typography
                    variant="small"
                    color={selectedTab === tab ? 'primary' : 'secondary'}
                    style={styles.tabLabel}
                  >
                    {tab}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        </Section>

        {/* Pages Preview */}
        <Section title="Pages & Screens">
          <View style={styles.pagesGrid}>
            <PagePreview title="Login" route="/login" />
            <PagePreview title="Signup" route="/signup" />
            <PagePreview title="Home" route="/home" />
            <PagePreview title="Library" route="/library" />
            <PagePreview title="Create" route="/create" />
            <PagePreview title="Profile" route="/profile" />
          </View>
        </Section>

        {/* Theme Tokens - Colors */}
        <Section title="Theme Tokens - Colors">
          <Card variant="default" style={styles.card}>
            <Typography variant="h4" style={styles.tokenSectionTitle}>
              Background Colors
            </Typography>
            <View style={styles.colorGrid}>
              <ColorSwatch name="Primary" color={colors.background.primary} />
              <ColorSwatch name="Secondary" color={colors.background.secondary} />
              <ColorSwatch name="Tertiary" color={colors.background.tertiary} />
              <ColorSwatch name="Glass" color={colors.background.glass} />
            </View>
          </Card>

          <Card variant="default" style={styles.card}>
            <Typography variant="h4" style={styles.tokenSectionTitle}>
              Text Colors
            </Typography>
            <View style={styles.colorGrid}>
              <ColorSwatch name="Primary" color={colors.text.primary} textColor="inverse" />
              <ColorSwatch name="Secondary" color={colors.text.secondary} textColor="inverse" />
              <ColorSwatch name="Tertiary" color={colors.text.tertiary} textColor="inverse" />
              <ColorSwatch name="Inverse" color={colors.text.inverse} textColor="primary" />
            </View>
          </Card>

          <Card variant="default" style={styles.card}>
            <Typography variant="h4" style={styles.tokenSectionTitle}>
              Accent Colors
            </Typography>
            <View style={styles.colorGrid}>
              <ColorSwatch name="Primary" color={colors.accent.primary} />
              <ColorSwatch name="Secondary" color={colors.accent.secondary} />
              <ColorSwatch name="Tertiary" color={colors.accent.tertiary} />
              <ColorSwatch name="Light" color={colors.accent.light} />
            </View>
          </Card>

          <Card variant="default" style={styles.card}>
            <Typography variant="h4" style={styles.tokenSectionTitle}>
              State Colors
            </Typography>
            <View style={styles.colorGrid}>
              <ColorSwatch name="Error" color={colors.error} />
              <ColorSwatch name="Success" color={colors.success} />
              <ColorSwatch name="Warning" color={colors.warning} />
              <ColorSwatch name="Info" color={colors.info} />
            </View>
          </Card>
        </Section>

        {/* Theme Tokens - Typography */}
        <Section title="Theme Tokens - Typography">
          <Card variant="default" style={styles.card}>
            <Typography variant="h1" style={styles.typographyExample}>
              Heading 1 - {typography.h1.fontSize} / {typography.h1.fontWeight}
            </Typography>
            <Typography variant="h2" style={styles.typographyExample}>
              Heading 2 - {typography.h2.fontSize} / {typography.h2.fontWeight}
            </Typography>
            <Typography variant="h3" style={styles.typographyExample}>
              Heading 3 - {typography.h3.fontSize} / {typography.h3.fontWeight}
            </Typography>
            <Typography variant="h4" style={styles.typographyExample}>
              Heading 4 - {typography.h4.fontSize} / {typography.h4.fontWeight}
            </Typography>
            <Typography variant="body" style={styles.typographyExample}>
              Body - {typography.body.fontSize} / {typography.body.fontWeight}
            </Typography>
            <Typography variant="caption" style={styles.typographyExample}>
              Caption - {typography.caption.fontSize} / {typography.caption.fontWeight}
            </Typography>
            <Typography variant="small" style={styles.typographyExample}>
              Small - {typography.small.fontSize} / {typography.small.fontWeight}
            </Typography>
          </Card>
        </Section>

        {/* Theme Tokens - Spacing */}
        <Section title="Theme Tokens - Spacing">
          <Card variant="default" style={styles.card}>
            {Object.entries(spacing).map(([key, value]) => (
              <View key={key} style={styles.spacingExample}>
                <View style={styles.spacingLabel}>
                  <Typography variant="caption">{key}</Typography>
                  <Typography variant="small" color="secondary">
                    {value}px
                  </Typography>
                </View>
                <View style={[styles.spacingBar, { width: value }]} />
              </View>
            ))}
          </Card>
        </Section>

        {/* UI Components - Typography */}
        <Section title="UI Components - Typography">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="h4">Heading 4</Typography>
          <Typography variant="body">Body text - Regular weight</Typography>
          <Typography variant="bodyBold">Body text - Bold weight</Typography>
          <Typography variant="caption">Caption text</Typography>
          <Typography variant="captionBold">Caption text - Bold</Typography>
          <Typography variant="small">Small text</Typography>
          <Typography variant="smallBold">Small text - Bold</Typography>
          <View style={styles.colorExamples}>
            <Typography variant="body" color="primary">Primary text color</Typography>
            <Typography variant="body" color="secondary">Secondary text color</Typography>
            <Typography variant="body" color="tertiary">Tertiary text color</Typography>
            <View style={[styles.colorBox, { backgroundColor: colors.accent.primary }]}>
              <Typography variant="body" color="inverse">Inverse text color</Typography>
            </View>
          </View>
        </Section>

        {/* UI Components - Buttons */}
        <Section title="UI Components - Buttons">
          <Button variant="primary" size="sm" style={styles.button}>
            Primary Small
          </Button>
          <Button variant="primary" size="md" style={styles.button}>
            Primary Medium
          </Button>
          <Button variant="primary" size="lg" style={styles.button}>
            Primary Large
          </Button>
          <Button variant="secondary" size="md" style={styles.button}>
            Secondary Button
          </Button>
          <Button variant="outline" size="md" style={styles.button}>
            Outline Button
          </Button>
          <Button variant="text" size="md" style={styles.button}>
            Text Button
          </Button>
          <Button variant="ghost" size="md" style={styles.button}>
            Ghost Button
          </Button>
          <Button variant="primary" size="md" loading style={styles.button}>
            Loading Button
          </Button>
          <Button variant="primary" size="md" disabled style={styles.button}>
            Disabled Button
          </Button>
          <Button variant="primary" size="md" fullWidth style={styles.button}>
            Full Width Button
          </Button>
        </Section>

        {/* UI Components - Inputs */}
        <Section title="UI Components - Inputs">
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
          />
          <Input
            label="With Error"
            placeholder="This field has an error"
            error="This field is required"
          />
          <Input
            label="With Helper Text"
            placeholder="This field has helper text"
            helperText="This is helpful information"
          />
          <Input
            label="With Left Icon"
            placeholder="Search..."
            leftIcon={<Typography variant="small">🔍</Typography>}
          />
          <Input
            label="With Right Icon"
            placeholder="Enter value"
            rightIcon={<Typography variant="small">✓</Typography>}
          />
        </Section>

        {/* UI Components - Cards */}
        <Section title="UI Components - Cards">
          <Card variant="default" style={styles.card}>
            <Typography variant="h3">Default Card</Typography>
            <Typography variant="body" color="secondary">
              This is a default card with glass-morphism styling and subtle shadow.
            </Typography>
          </Card>
          <Card variant="elevated" style={styles.card}>
            <Typography variant="h3">Elevated Card</Typography>
            <Typography variant="body" color="secondary">
              This card has more prominent shadow for emphasis.
            </Typography>
          </Card>
          <Card variant="flat" style={styles.card}>
            <Typography variant="h3">Flat Card</Typography>
            <Typography variant="body" color="secondary">
              This card has minimal shadow for a flatter appearance.
            </Typography>
          </Card>
          <Card variant="default" pressable onPress={() => {}} style={styles.card}>
            <Typography variant="h3">Pressable Card</Typography>
            <Typography variant="body" color="secondary">
              Tap this card to see press interaction.
            </Typography>
          </Card>
          <Card
            variant="default"
            header={<Typography variant="h4">Card Header</Typography>}
            footer={<Button variant="outline" size="sm">Action</Button>}
            style={styles.card}
          >
            <Typography variant="body" color="secondary">
              Card with header and footer sections.
            </Typography>
          </Card>
        </Section>

        {/* UI Components - Loading */}
        <Section title="UI Components - Loading">
          <View style={styles.loadingRow}>
            <View style={styles.loadingItem}>
              <Loading variant="spinner" size="sm" />
              <Typography variant="caption" style={styles.loadingLabel}>
                Small
              </Typography>
            </View>
            <View style={styles.loadingItem}>
              <Loading variant="spinner" size="md" />
              <Typography variant="caption" style={styles.loadingLabel}>
                Medium
              </Typography>
            </View>
            <View style={styles.loadingItem}>
              <Loading variant="spinner" size="lg" />
              <Typography variant="caption" style={styles.loadingLabel}>
                Large
              </Typography>
            </View>
          </View>
          <View style={styles.loadingRow}>
            <View style={styles.loadingItem}>
              <Loading variant="dots" size="sm" />
              <Typography variant="caption" style={styles.loadingLabel}>
                Small
              </Typography>
            </View>
            <View style={styles.loadingItem}>
              <Loading variant="dots" size="md" />
              <Typography variant="caption" style={styles.loadingLabel}>
                Medium
              </Typography>
            </View>
            <View style={styles.loadingItem}>
              <Loading variant="dots" size="lg" />
              <Typography variant="caption" style={styles.loadingLabel}>
                Large
              </Typography>
            </View>
          </View>
          <View style={styles.loadingRow}>
            <Loading variant="skeleton" size="sm" style={styles.skeleton} />
            <Loading variant="skeleton" size="md" style={styles.skeleton} />
            <Loading variant="skeleton" size="lg" style={styles.skeleton} />
          </View>
        </Section>

        {/* UI Components - Badges */}
        <Section title="UI Components - Badges">
          <View style={styles.badgeRow}>
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="outline">Outline</Badge>
          </View>
          <View style={styles.badgeRow}>
            <Badge variant="default" size="sm">
              Small Default
            </Badge>
            <Badge variant="success" size="sm">
              Small Success
            </Badge>
            <Badge variant="error" size="sm">
              Small Error
            </Badge>
          </View>
        </Section>

        {/* UI Components - Progress */}
        <Section title="UI Components - Progress">
          <Typography variant="caption" style={styles.progressLabel}>
            Linear Progress ({progressValue}%)
          </Typography>
          <Progress variant="linear" value={progressValue} size="sm" style={styles.progress} />
          <Progress variant="linear" value={progressValue} size="md" style={styles.progress} />
          <Progress variant="linear" value={progressValue} size="lg" style={styles.progress} />
          <View style={styles.progressControls}>
            <Button variant="outline" size="sm" onPress={() => setProgressValue(Math.max(0, progressValue - 10))}>
              -10%
            </Button>
            <Button variant="outline" size="sm" onPress={() => setProgressValue(Math.min(100, progressValue + 10))}>
              +10%
            </Button>
          </View>
          <Typography variant="caption" style={styles.progressLabel}>
            Circular Progress
          </Typography>
          <View style={styles.circularProgressRow}>
            <View style={styles.circularProgressItem}>
              <Progress variant="circular" value={25} size="sm" />
              <Typography variant="caption" style={styles.progressLabel}>
                25%
              </Typography>
            </View>
            <View style={styles.circularProgressItem}>
              <Progress variant="circular" value={50} size="md" />
              <Typography variant="caption" style={styles.progressLabel}>
                50%
              </Typography>
            </View>
            <View style={styles.circularProgressItem}>
              <Progress variant="circular" value={75} size="lg" />
              <Typography variant="caption" style={styles.progressLabel}>
                75%
              </Typography>
            </View>
          </View>
          <View style={styles.progressColors}>
            <View style={styles.progressColorItem}>
              <Progress variant="linear" value={60} color="primary" size="md" />
              <Typography variant="caption">Primary</Typography>
            </View>
            <View style={styles.progressColorItem}>
              <Progress variant="linear" value={60} color="success" size="md" />
              <Typography variant="caption">Success</Typography>
            </View>
            <View style={styles.progressColorItem}>
              <Progress variant="linear" value={60} color="error" size="md" />
              <Typography variant="caption">Error</Typography>
            </View>
            <View style={styles.progressColorItem}>
              <Progress variant="linear" value={60} color="warning" size="md" />
              <Typography variant="caption">Warning</Typography>
            </View>
          </View>
        </Section>

        {/* Layout Components */}
        <Section title="Layout Components">
          <Card variant="default" style={styles.card}>
            <Typography variant="h4" style={styles.cardTitle}>
              Container Variants
            </Typography>
            <View style={[styles.containerExample, { backgroundColor: colors.background.primary }]}>
              <Typography variant="caption">Primary Container</Typography>
            </View>
            <View style={[styles.containerExample, { backgroundColor: colors.background.secondary }]}>
              <Typography variant="caption">Secondary Container</Typography>
            </View>
            <View style={[styles.containerExample, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border.light }]}>
              <Typography variant="caption">Transparent Container</Typography>
            </View>
          </Card>
        </Section>

        {/* Border Radius Tokens */}
        <Section title="Border Radius Tokens">
          <Card variant="default" style={styles.card}>
            {Object.entries(borderRadius).map(([key, value]) => (
              <View key={key} style={styles.borderRadiusExample}>
                <Typography variant="caption" style={styles.borderRadiusLabel}>
                  {key}: {value}px
                </Typography>
                <View style={[styles.borderRadiusBox, { borderRadius: value, backgroundColor: colors.accent.primary }]} />
              </View>
            ))}
          </Card>
        </Section>

        {/* Shadows Tokens */}
        <Section title="Shadow Tokens">
          <Card variant="default" style={styles.card}>
            {Object.entries(shadows).map(([key, shadow]) => (
              <View key={key} style={styles.shadowExample}>
                <Typography variant="caption" style={styles.shadowLabel}>
                  {key}
                </Typography>
                <View style={[styles.shadowBox, shadow]} />
              </View>
            ))}
          </Card>
        </Section>

        {/* Footer */}
        <View style={styles.footer}>
          <Typography variant="body" color="secondary" style={styles.footerText}>
            waQup Design System v1.0
          </Typography>
          <Typography variant="caption" color="tertiary">
            Glass-Morphism Minimalist Design
          </Typography>
        </View>
      </ScrollView>
    </Container>
  );
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <Typography variant="h2" style={styles.sectionTitle}>
      {title}
    </Typography>
    {children}
  </View>
);

const PagePreview: React.FC<{ title: string; route: string }> = ({ title, route }) => (
  <Card variant="default" pressable style={styles.pagePreview}>
    <Typography variant="h4" style={styles.pagePreviewTitle}>
      {title}
    </Typography>
    <Typography variant="caption" color="secondary">
      {route}
    </Typography>
  </Card>
);

const ColorSwatch: React.FC<{ name: string; color: string; textColor?: 'primary' | 'inverse' }> = ({
  name,
  color,
  textColor = 'primary',
}) => (
  <View style={styles.colorSwatch}>
    <View style={[styles.colorSwatchBox, { backgroundColor: color }]} />
    <Typography variant="small" color={textColor}>
      {name}
    </Typography>
    <Typography variant="small" color="tertiary">
      {color}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.sm,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginTop: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  tabActive: {
    backgroundColor: colors.accent.primary,
  },
  tabLabel: {
    fontWeight: '600',
  },
  pagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  pagePreview: {
    width: (width - spacing.md * 3) / 2,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagePreviewTitle: {
    marginBottom: spacing.xs,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  colorSwatch: {
    width: (width - spacing.md * 5) / 2,
    alignItems: 'center',
  },
  colorSwatchBox: {
    width: '100%',
    height: 60,
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs,
  },
  tokenSectionTitle: {
    marginBottom: spacing.sm,
  },
  typographyExample: {
    marginBottom: spacing.sm,
  },
  colorExamples: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  colorBox: {
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  button: {
    marginBottom: spacing.sm,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  loadingItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  loadingLabel: {
    marginTop: spacing.xs,
  },
  skeleton: {
    flex: 1,
    height: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  progressLabel: {
    marginBottom: spacing.sm,
  },
  progress: {
    marginBottom: spacing.md,
  },
  progressControls: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  circularProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  circularProgressItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  progressColors: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  progressColorItem: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  containerExample: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  spacingExample: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  spacingLabel: {
    width: 80,
  },
  spacingBar: {
    height: 20,
    backgroundColor: colors.accent.primary,
                    borderRadius: borderRadius.sm,
  },
  borderRadiusExample: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  borderRadiusLabel: {
    width: 120,
  },
  borderRadiusBox: {
    width: 60,
    height: 60,
  },
  shadowExample: {
    marginBottom: spacing.md,
  },
  shadowLabel: {
    marginBottom: spacing.xs,
  },
  shadowBox: {
    width: '100%',
    height: 60,
    backgroundColor: colors.background.glass,
    borderRadius: borderRadius.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  footerText: {
    marginBottom: spacing.xs,
  },
});
