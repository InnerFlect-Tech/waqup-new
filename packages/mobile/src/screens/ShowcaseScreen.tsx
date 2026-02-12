import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import {
  Typography,
  Button,
  Input,
  Card,
  Loading,
  Badge,
  Progress,
} from '@/components';
import { Screen } from '@/components/layout';
import { spacing, typography, borderRadius, shadows } from '@/theme';
import { useTheme } from '@/theme';
import type { Theme } from '@/theme/themes';

const { width } = Dimensions.get('window');

export default function ShowcaseScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const [inputValue, setInputValue] = useState('');
  const [progressValue, setProgressValue] = useState(45);
  const [selectedTab, setSelectedTab] = useState('Home');

  return (
    <Screen scrollable padding>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h1" style={[styles.title, { color: colors.text.primary }]}>
            wa<span style={{ color: colors.accent.tertiary }}>Q</span>up Design System
          </Typography>
          <Typography variant="body" style={[styles.subtitle, { color: colors.text.secondary }]}>
            Complete UI Component Library & Design Tokens
          </Typography>
        </View>

        {/* Navigation Menu Showcase */}
        <Section title="Navigation Menus" colors={colors}>
          <Card variant="elevated" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="h3" style={[styles.cardTitle, { color: colors.text.primary }]}>
              Bottom Tab Navigation
            </Typography>
            <View style={[styles.tabBar, { backgroundColor: colors.background.secondary }]}>
              {['Home', 'Library', 'Create', 'Profile'].map((tab) => {
                const isActive = selectedTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.tab,
                      isActive && { backgroundColor: colors.accent.primary },
                    ]}
                    onPress={() => setSelectedTab(tab)}
                  >
                    <Typography
                      variant="small"
                      style={[styles.tabLabel, { color: isActive ? colors.text.onDark : colors.text.secondary }]}
                    >
                      {tab}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>
        </Section>

        {/* Pages Preview */}
        <Section title="Pages & Screens" colors={colors}>
          <View style={styles.pagesGrid}>
            <PagePreview title="Login" route="/login" colors={colors} />
            <PagePreview title="Signup" route="/signup" colors={colors} />
            <PagePreview title="Home" route="/home" colors={colors} />
            <PagePreview title="Library" route="/library" colors={colors} />
            <PagePreview title="Create" route="/create" colors={colors} />
            <PagePreview title="Profile" route="/profile" colors={colors} />
          </View>
        </Section>

        {/* Theme Tokens - Colors */}
        <Section title="Theme Tokens - Colors" colors={colors}>
          <Card variant="default" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="h4" style={[styles.tokenSectionTitle, { color: colors.text.primary }]}>
              Background Colors
            </Typography>
            <View style={styles.colorGrid}>
              <ColorSwatch name="Primary" color={colors.background.primary} colors={colors} />
              <ColorSwatch name="Secondary" color={colors.background.secondary} colors={colors} />
              <ColorSwatch name="Tertiary" color={colors.background.tertiary} colors={colors} />
              <ColorSwatch name="Glass" color={colors.background.glass} colors={colors} />
            </View>
          </Card>

          <Card variant="default" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="h4" style={[styles.tokenSectionTitle, { color: colors.text.primary }]}>
              Text Colors
            </Typography>
            <View style={styles.colorGrid}>
              <ColorSwatch name="Primary" color={colors.text.primary} textColor="inverse" colors={colors} />
              <ColorSwatch name="Secondary" color={colors.text.secondary} textColor="inverse" colors={colors} />
              <ColorSwatch name="Tertiary" color={colors.text.tertiary} textColor="inverse" colors={colors} />
              <ColorSwatch name="Inverse" color={colors.text.inverse} textColor="primary" colors={colors} />
            </View>
          </Card>

          <Card variant="default" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="h4" style={[styles.tokenSectionTitle, { color: colors.text.primary }]}>
              Accent Colors
            </Typography>
            <View style={styles.colorGrid}>
              <ColorSwatch name="Primary" color={colors.accent.primary} colors={colors} />
              <ColorSwatch name="Secondary" color={colors.accent.secondary} colors={colors} />
              <ColorSwatch name="Tertiary" color={colors.accent.tertiary} colors={colors} />
              <ColorSwatch name="Light" color={colors.accent.light} colors={colors} />
            </View>
          </Card>

          <Card variant="default" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="h4" style={[styles.tokenSectionTitle, { color: colors.text.primary }]}>
              State Colors
            </Typography>
            <View style={styles.colorGrid}>
              <ColorSwatch name="Error" color={colors.error} colors={colors} />
              <ColorSwatch name="Success" color={colors.success} colors={colors} />
              <ColorSwatch name="Warning" color={colors.warning} colors={colors} />
              <ColorSwatch name="Info" color={colors.info} colors={colors} />
            </View>
          </Card>
        </Section>

        {/* Theme Tokens - Typography */}
        <Section title="Theme Tokens - Typography" colors={colors}>
          <Card variant="default" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="h1" style={[styles.typographyExample, { color: colors.text.primary }]}>
              Heading 1 - {typography.h1.fontSize} / {typography.h1.fontWeight}
            </Typography>
            <Typography variant="h2" style={[styles.typographyExample, { color: colors.text.primary }]}>
              Heading 2 - {typography.h2.fontSize} / {typography.h2.fontWeight}
            </Typography>
            <Typography variant="h3" style={[styles.typographyExample, { color: colors.text.primary }]}>
              Heading 3 - {typography.h3.fontSize} / {typography.h3.fontWeight}
            </Typography>
            <Typography variant="h4" style={[styles.typographyExample, { color: colors.text.primary }]}>
              Heading 4 - {typography.h4.fontSize} / {typography.h4.fontWeight}
            </Typography>
            <Typography variant="body" style={[styles.typographyExample, { color: colors.text.primary }]}>
              Body - {typography.body.fontSize} / {typography.body.fontWeight}
            </Typography>
            <Typography variant="caption" style={[styles.typographyExample, { color: colors.text.secondary }]}>
              Caption - {typography.caption.fontSize} / {typography.caption.fontWeight}
            </Typography>
            <Typography variant="small" style={[styles.typographyExample, { color: colors.text.secondary }]}>
              Small - {typography.small.fontSize} / {typography.small.fontWeight}
            </Typography>
          </Card>
        </Section>

        {/* Theme Tokens - Spacing */}
        <Section title="Theme Tokens - Spacing" colors={colors}>
          <Card variant="default" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            {Object.entries(spacing).map(([key, value]) => (
              <View key={key} style={styles.spacingExample}>
                <View style={styles.spacingLabel}>
                  <Typography variant="caption" style={{ color: colors.text.secondary }}>{key}</Typography>
                  <Typography variant="small" style={{ color: colors.text.tertiary }}>
                    {value}px
                  </Typography>
                </View>
                <View style={[styles.spacingBar, { width: value, backgroundColor: colors.accent.primary }]} />
              </View>
            ))}
          </Card>
        </Section>

        {/* UI Components - Typography */}
        <Section title="UI Components - Typography" colors={colors}>
          <Typography variant="h1" style={{ color: colors.text.primary }}>Heading 1</Typography>
          <Typography variant="h2" style={{ color: colors.text.primary }}>Heading 2</Typography>
          <Typography variant="h3" style={{ color: colors.text.primary }}>Heading 3</Typography>
          <Typography variant="h4" style={{ color: colors.text.primary }}>Heading 4</Typography>
          <Typography variant="body" style={{ color: colors.text.primary }}>Body text - Regular weight</Typography>
          <Typography variant="bodyBold" style={{ color: colors.text.primary }}>Body text - Bold weight</Typography>
          <Typography variant="caption" style={{ color: colors.text.secondary }}>Caption text</Typography>
          <Typography variant="captionBold" style={{ color: colors.text.secondary }}>Caption text - Bold</Typography>
          <Typography variant="small" style={{ color: colors.text.secondary }}>Small text</Typography>
          <Typography variant="smallBold" style={{ color: colors.text.secondary }}>Small text - Bold</Typography>
          <View style={styles.colorExamples}>
            <Typography variant="body" style={{ color: colors.text.primary }}>Primary text color</Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>Secondary text color</Typography>
            <Typography variant="body" style={{ color: colors.text.tertiary }}>Tertiary text color</Typography>
            <View style={[styles.colorBox, { backgroundColor: colors.accent.primary }]}>
              <Typography variant="body" style={{ color: colors.text.inverse }}>Inverse text color</Typography>
            </View>
          </View>
        </Section>

        {/* UI Components - Buttons */}
        <Section title="UI Components - Buttons" colors={colors}>
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
        <Section title="UI Components - Inputs" colors={colors}>
          <Card variant="default" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
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
          </Card>
        </Section>

        {/* UI Components - Cards */}
        <Section title="UI Components - Cards" colors={colors}>
          <Card variant="default" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="h3" style={{ color: colors.text.primary }}>Default Card</Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              This is a default card with glass-morphism styling and subtle shadow.
            </Typography>
          </Card>
          <Card variant="elevated" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="h3" style={{ color: colors.text.primary }}>Elevated Card</Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              This card has more prominent shadow for emphasis.
            </Typography>
          </Card>
          <Card variant="flat" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="h3" style={{ color: colors.text.primary }}>Flat Card</Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              This card has minimal shadow for a flatter appearance.
            </Typography>
          </Card>
          <Card variant="default" pressable onPress={() => {}} style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="h3" style={{ color: colors.text.primary }}>Pressable Card</Typography>
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Tap this card to see press interaction.
            </Typography>
          </Card>
          <Card
            variant="default"
            header={<Typography variant="h4" style={{ color: colors.text.primary }}>Card Header</Typography>}
            footer={<Button variant="outline" size="sm">Action</Button>}
            style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}
          >
            <Typography variant="body" style={{ color: colors.text.secondary }}>
              Card with header and footer sections.
            </Typography>
          </Card>
        </Section>

        {/* UI Components - Loading */}
        <Section title="UI Components - Loading" colors={colors}>
          <View style={styles.loadingRow}>
            <View style={styles.loadingItem}>
              <Loading variant="spinner" size="sm" />
              <Typography variant="caption" style={[styles.loadingLabel, { color: colors.text.secondary }]}>
                Small
              </Typography>
            </View>
            <View style={styles.loadingItem}>
              <Loading variant="spinner" size="md" />
              <Typography variant="caption" style={[styles.loadingLabel, { color: colors.text.secondary }]}>
                Medium
              </Typography>
            </View>
            <View style={styles.loadingItem}>
              <Loading variant="spinner" size="lg" />
              <Typography variant="caption" style={[styles.loadingLabel, { color: colors.text.secondary }]}>
                Large
              </Typography>
            </View>
          </View>
          <View style={styles.loadingRow}>
            <View style={styles.loadingItem}>
              <Loading variant="dots" size="sm" />
              <Typography variant="caption" style={[styles.loadingLabel, { color: colors.text.secondary }]}>
                Small
              </Typography>
            </View>
            <View style={styles.loadingItem}>
              <Loading variant="dots" size="md" />
              <Typography variant="caption" style={[styles.loadingLabel, { color: colors.text.secondary }]}>
                Medium
              </Typography>
            </View>
            <View style={styles.loadingItem}>
              <Loading variant="dots" size="lg" />
              <Typography variant="caption" style={[styles.loadingLabel, { color: colors.text.secondary }]}>
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
        <Section title="UI Components - Badges" colors={colors}>
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
        <Section title="UI Components - Progress" colors={colors}>
          <Typography variant="caption" style={[styles.progressLabel, { color: colors.text.secondary }]}>
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
          <Typography variant="caption" style={[styles.progressLabel, { color: colors.text.secondary }]}>
            Circular Progress
          </Typography>
          <View style={styles.circularProgressRow}>
            <View style={styles.circularProgressItem}>
              <Progress variant="circular" value={25} size="sm" />
              <Typography variant="caption" style={[styles.progressLabel, { color: colors.text.secondary }]}>
                25%
              </Typography>
            </View>
            <View style={styles.circularProgressItem}>
              <Progress variant="circular" value={50} size="md" />
              <Typography variant="caption" style={[styles.progressLabel, { color: colors.text.secondary }]}>
                50%
              </Typography>
            </View>
            <View style={styles.circularProgressItem}>
              <Progress variant="circular" value={75} size="lg" />
              <Typography variant="caption" style={[styles.progressLabel, { color: colors.text.secondary }]}>
                75%
              </Typography>
            </View>
          </View>
          <View style={styles.progressColors}>
            <View style={styles.progressColorItem}>
              <Progress variant="linear" value={60} color="primary" size="md" />
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Primary</Typography>
            </View>
            <View style={styles.progressColorItem}>
              <Progress variant="linear" value={60} color="success" size="md" />
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Success</Typography>
            </View>
            <View style={styles.progressColorItem}>
              <Progress variant="linear" value={60} color="error" size="md" />
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Error</Typography>
            </View>
            <View style={styles.progressColorItem}>
              <Progress variant="linear" value={60} color="warning" size="md" />
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Warning</Typography>
            </View>
          </View>
        </Section>

        {/* Layout Components */}
        <Section title="Layout Components" colors={colors}>
          <Card variant="default" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            <Typography variant="h4" style={[styles.cardTitle, { color: colors.text.primary }]}>
              Container Variants
            </Typography>
            <View style={[styles.containerExample, { backgroundColor: colors.background.primary }]}>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Primary Container</Typography>
            </View>
            <View style={[styles.containerExample, { backgroundColor: colors.background.secondary }]}>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Secondary Container</Typography>
            </View>
            <View style={[styles.containerExample, { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border.light }]}>
              <Typography variant="caption" style={{ color: colors.text.secondary }}>Transparent Container</Typography>
            </View>
          </Card>
        </Section>

        {/* Border Radius Tokens */}
        <Section title="Border Radius Tokens" colors={colors}>
          <Card variant="default" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            {Object.entries(borderRadius).map(([key, value]) => (
              <View key={key} style={styles.borderRadiusExample}>
                <Typography variant="caption" style={[styles.borderRadiusLabel, { color: colors.text.secondary }]}>
                  {key}: {value}px
                </Typography>
                <View style={[styles.borderRadiusBox, { borderRadius: value, backgroundColor: colors.accent.primary }]} />
              </View>
            ))}
          </Card>
        </Section>

        {/* Shadows Tokens */}
        <Section title="Shadow Tokens" colors={colors}>
          <Card variant="default" style={[styles.card, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
            {Object.entries(shadows).map(([key, shadow]) => (
              <View key={key} style={styles.shadowExample}>
                <Typography variant="caption" style={[styles.shadowLabel, { color: colors.text.secondary }]}>
                  {key}
                </Typography>
                <View style={[styles.shadowBox, shadow, { backgroundColor: colors.glass.opaque }]} />
              </View>
            ))}
          </Card>
        </Section>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: colors.border.light }]}>
          <Typography variant="body" style={[styles.footerText, { color: colors.text.secondary }]}>
            waQup Design System v1.0
          </Typography>
          <Typography variant="caption" style={{ color: colors.text.tertiary }}>
            Glass-Morphism Minimalist Design
          </Typography>
        </View>
      </View>
    </Screen>
  );
}

const Section: React.FC<{ title: string; children: React.ReactNode; colors: Theme['colors'] }> = ({ title, children, colors }) => (
  <View style={styles.section}>
    <Typography variant="h2" style={[styles.sectionTitle, { color: colors.text.primary }]}>
      {title}
    </Typography>
    {children}
  </View>
);

const PagePreview: React.FC<{ title: string; route: string; colors: Theme['colors'] }> = ({ title, route, colors }) => (
  <Card variant="default" pressable style={[styles.pagePreview, { backgroundColor: colors.glass.opaque, borderColor: colors.glass.border }]}>
    <Typography variant="h4" style={[styles.pagePreviewTitle, { color: colors.text.primary }]}>
      {title}
    </Typography>
    <Typography variant="caption" style={{ color: colors.text.secondary }}>
      {route}
    </Typography>
  </Card>
);

const ColorSwatch: React.FC<{
  name: string;
  color: string;
  textColor?: 'primary' | 'inverse';
  colors: Theme['colors'];
}> = ({ name, color, textColor = 'primary', colors }) => (
  <View style={styles.colorSwatch}>
    <View style={[styles.colorSwatchBox, { backgroundColor: color }]} />
    <Typography variant="small" style={{ color: textColor === 'inverse' ? colors.text.inverse : colors.text.primary }}>
      {name}
    </Typography>
    <Typography variant="small" style={{ color: colors.text.tertiary }}>
      {color}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
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
    backgroundColor: 'transparent', // overridden inline
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
    borderRadius: borderRadius.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
  },
  footerText: {
    marginBottom: spacing.xs,
  },
});
