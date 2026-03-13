const path = require('path');
const fs = require('fs');

// Read .env and .env.local — ensures EXPO_PUBLIC_* and SENTRY_* are in process.env before config
function loadEnv() {
  const env = {};
  for (const filename of ['.env', '.env.local']) {
    const envPath = path.resolve(__dirname, filename);
    if (!fs.existsSync(envPath)) continue;
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const match = trimmed.match(/^(EXPO_PUBLIC_\w+|SENTRY_\w+)=(.*)$/);
      if (match) {
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        env[match[1]] = value;
        process.env[match[1]] = value;
      }
    }
  }
  return env;
}
const env = loadEnv();

// Sentry plugin config — org/project silence "Missing config" warning; auth via SENTRY_AUTH_TOKEN
const sentryOrg = env.SENTRY_ORG || process.env.SENTRY_ORG || 'waqup';
const sentryProject = env.SENTRY_PROJECT || process.env.SENTRY_PROJECT || 'waqup-mobile';

module.exports = {
  name: 'waQup',
  slug: 'waqup',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'waqup',
  plugins: [
    [
      '@sentry/react-native',
      { organization: sentryOrg, project: sentryProject },
    ],
    'expo-localization',
    'expo-web-browser',
  ],
  extra: {
    supabaseUrl: env.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabasePublishableKey: env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#000000',
    },
    ios: {
      bundleIdentifier: 'com.waqup.app',
      supportsTablet: true,
    },
    android: {
      package: 'com.waqup.app',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#000000',
      },
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            { scheme: 'waqup' },
            { scheme: 'https', host: 'waqup.app', pathPrefix: '/' },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
  web: {
    favicon: './assets/favicon.png',
  },
};
