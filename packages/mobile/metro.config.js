const path = require('path');
const fs = require('fs');

// Load .env BEFORE Metro starts - ensures EXPO_PUBLIC_* are in process.env for web bundle
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^EXPO_PUBLIC_(\w+)=(.*)$/);
    if (match) {
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env['EXPO_PUBLIC_' + match[1]] = value;
    }
  }
}

const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Monorepo: allow Metro to watch files from the entire workspace
config.watchFolders = [workspaceRoot];

// Monorepo: resolve from workspace root FIRST to avoid duplicate native modules
// (e.g. RNCSafeAreaProvider - must use single hoisted copy)
config.resolver.nodeModulesPaths = [
  path.resolve(workspaceRoot, 'node_modules'),
  path.resolve(projectRoot, 'node_modules'),
];

// Support package.json `exports` field for @waqup/shared sub-path imports
// e.g. @waqup/shared/schemas, @waqup/shared/stores, @waqup/shared/theme
config.resolver.unstable_enablePackageExports = true;

// Force single resolution for react-native-safe-area-context to avoid
// "Tried to register two views with the same name RNCSafeAreaProvider"
const safeAreaPath = path.resolve(
  workspaceRoot,
  'node_modules/react-native-safe-area-context'
);
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-safe-area-context': safeAreaPath,
};

module.exports = config;
