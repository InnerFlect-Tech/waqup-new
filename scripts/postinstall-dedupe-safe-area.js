#!/usr/bin/env node
/**
 * Remove nested copies of react-native-safe-area-context to fix
 * "Tried to register two views with the same name RNCSafeAreaProvider" in Expo Go.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const nestedPaths = [
  path.join(root, 'node_modules/expo/node_modules/react-native-safe-area-context'),
  path.join(root, 'node_modules/@react-navigation/elements/node_modules/react-native-safe-area-context'),
  path.join(root, 'packages/mobile/node_modules/react-native-safe-area-context'),
];

for (const p of nestedPaths) {
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true });
      console.log('[postinstall] Removed nested react-native-safe-area-context:', p);
    }
  } catch (e) {
    // Ignore errors (e.g. permissions)
  }
}
