#!/usr/bin/env node
/**
 * Verifies atmosphere MP3 files in Supabase Storage.
 * Run: cd packages/web && node scripts/verify-atmosphere.mjs
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, '..');
const PROJ_ROOT = path.resolve(WEB_ROOT, '..', '..');

const EXPECTED = ['rain.mp3', 'forest.mp3', 'ocean.mp3'];
const OPTIONAL = ['white-noise.mp3'];

function loadEnv() {
  for (const p of [path.join(PROJ_ROOT, '.env.local'), path.join(WEB_ROOT, '.env.local')]) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      for (const line of content.split('\n')) {
        const m = line.match(/^([^#=]+)=(.*)$/);
        if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
      }
      break;
    }
  }
}

loadEnv();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

const { data: files, error } = await supabase.storage.from('atmosphere').list('', { limit: 100 });
if (error) {
  console.error('List failed:', error.message);
  process.exit(1);
}

const names = (files || []).map((f) => f.name);
const results = [];
for (const name of EXPECTED) {
  const found = names.includes(name);
  results.push({ name, expected: true, found });
}
for (const name of OPTIONAL) {
  const found = names.includes(name);
  results.push({ name, expected: false, found });
}

console.log('\nAtmosphere bucket verification:\n');
let ok = true;
for (const r of results) {
  const status = r.found ? '✓' : (r.expected ? '✗ MISSING' : '(optional)');
  console.log(`  ${r.found ? '✓' : ' '} ${r.name.padEnd(20)} ${status}`);
  if (r.expected && !r.found) ok = false;
}

if (url) {
  const base = url.replace(/\/$/, '');
  console.log('\nPublic URLs (for HEAD check):');
  for (const name of EXPECTED) {
    const u = `${base}/storage/v1/object/public/atmosphere/${name}`;
    try {
      const res = await fetch(u, { method: 'HEAD' });
      console.log(`  ${res.ok ? '✓' : '✗'} ${name}: ${res.ok ? 'accessible' : res.status}`);
      if (!res.ok) ok = false;
    } catch (e) {
      console.log(`  ✗ ${name}: ${e.message}`);
      ok = false;
    }
  }
}

console.log(ok ? '\n✓ All expected files present and accessible.\n' : '\n✗ Some files missing or inaccessible.\n');
process.exit(ok ? 0 : 1);
