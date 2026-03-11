#!/usr/bin/env node
/**
 * Verify i18n structural parity: compare all locale message files against en/ as canonical.
 * Exits with code 1 if any locale is missing keys present in en.
 *
 * Usage: node scripts/verify-i18n.mjs
 *        npm run verify:i18n
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MESSAGES_DIR = join(__dirname, '../messages');

const NAMESPACES = [
  'common',
  'nav',
  'auth',
  'onboarding',
  'create',
  'sanctuary',
  'pricing',
  'settings',
  'audio',
  'errors',
  'metadata',
  'marketing',
];

const LOCALES = ['en', 'pt', 'es', 'fr', 'de'];
const CANONICAL_LOCALE = 'en';

/** Recursively collect all key paths (e.g. "waitlist.page.reserveSpot") from an object */
function collectKeys(obj, prefix = '') {
  const keys = [];
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return keys;
  }
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      keys.push(path, ...collectKeys(val, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

/** Load a namespace JSON for a locale */
function loadNamespace(locale, ns) {
  try {
    const p = join(MESSAGES_DIR, locale, `${ns}.json`);
    const raw = readFileSync(p, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

/** Compare locale against canonical, return missing keys */
function findMissingKeys(canonicalObj, localeObj, prefix = '') {
  const missing = [];
  if (canonicalObj === null || typeof canonicalObj !== 'object' || Array.isArray(canonicalObj)) {
    return missing;
  }
  for (const key of Object.keys(canonicalObj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const canonicalVal = canonicalObj[key];
    const localeVal = localeObj?.[key];

    if (canonicalVal !== null && typeof canonicalVal === 'object' && !Array.isArray(canonicalVal)) {
      if (localeVal === null || typeof localeVal !== 'object' || Array.isArray(localeVal)) {
        missing.push(...collectKeys(canonicalVal, path));
      } else {
        missing.push(...findMissingKeys(canonicalVal, localeVal, path));
      }
    } else if (!(key in localeObj)) {
      missing.push(path);
    }
  }
  return missing;
}

function main() {
  let hasErrors = false;
  const report = {};

  for (const ns of NAMESPACES) {
    const canonical = loadNamespace(CANONICAL_LOCALE, ns);
    if (!canonical) {
      console.error(`[verify-i18n] Missing canonical: ${CANONICAL_LOCALE}/${ns}.json`);
      hasErrors = true;
      continue;
    }

    for (const locale of LOCALES) {
      if (locale === CANONICAL_LOCALE) continue;

      const localeData = loadNamespace(locale, ns);
      if (!localeData) {
        console.error(`[verify-i18n] Missing file: ${locale}/${ns}.json`);
        report[ns] = report[ns] || {};
        report[ns][locale] = ['(file missing)'];
        hasErrors = true;
        continue;
      }

      const missing = findMissingKeys(canonical, localeData);
      if (missing.length > 0) {
        hasErrors = true;
        report[ns] = report[ns] || {};
        report[ns][locale] = missing;
      }
    }
  }

  if (hasErrors) {
    console.error('\n[verify-i18n] Missing translation keys (en is canonical):\n');
    for (const ns of Object.keys(report).sort()) {
      console.error(`  ${ns}:`);
      for (const locale of Object.keys(report[ns]).sort()) {
        const keys = report[ns][locale];
        if (keys[0] === '(file missing)') {
          console.error(`    ${locale}: file missing`);
        } else {
          console.error(`    ${locale}: ${keys.length} missing — ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '…' : ''}`);
        }
      }
      console.error('');
    }
    process.exit(1);
  }

  console.log('[verify-i18n] All locales have structural parity with en.');
}

main();
