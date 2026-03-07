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

// Monorepo: resolve modules from workspace root node_modules first, then project
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Support package.json `exports` field for @waqup/shared sub-path imports
// e.g. @waqup/shared/schemas, @waqup/shared/stores, @waqup/shared/theme
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
