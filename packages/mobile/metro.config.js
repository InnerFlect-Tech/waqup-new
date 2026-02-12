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
module.exports = getDefaultConfig(__dirname);
