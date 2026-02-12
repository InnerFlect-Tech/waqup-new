const path = require('path');
const fs = require('fs');

// Read .env directly - Expo may eval config before loading env, EXPO_PUBLIC_* can miss web bundle
function loadEnv() {
  const envPath = path.resolve(__dirname, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^EXPO_PUBLIC_(\w+)=(.*)$/);
    if (match) env['EXPO_PUBLIC_' + match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
  }
  return env;
}
const env = loadEnv();

module.exports = {
  name: 'waQup',
  slug: 'waqup',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'waqup',
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
