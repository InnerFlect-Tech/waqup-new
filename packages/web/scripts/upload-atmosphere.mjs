#!/usr/bin/env node
/**
 * Converts WAV files from project root "untitled folder" to MP3 and uploads to Supabase atmosphere bucket.
 * Run: cd packages/web && node scripts/upload-atmosphere.mjs
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY from .env.local
 */
import { createClient } from '@supabase/supabase-js';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = path.resolve(__dirname, '..');
const PROJ_ROOT = path.resolve(WEB_ROOT, '..', '..');
const SRC = path.join(PROJ_ROOT, 'untitled folder');
const OUT = path.join(WEB_ROOT, 'scripts', '.atmosphere-out');

const MAPPINGS = [
  { src: 'OW_Rain_CT.wav', dest: 'rain.mp3' },
  { src: 'MRS_Ambience_Found_Sound_Timelapse_Nature_Forest_Tropical_1_ST.wav', dest: 'forest.mp3' },
  { src: 'Ocean - sea water lapping 2.wav', dest: 'ocean.mp3' },
];

async function loadEnv() {
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

async function getFfmpegPath() {
  try {
    const mod = await import('@ffmpeg-installer/ffmpeg');
    return mod.default?.path ?? 'ffmpeg';
  } catch {
    return 'ffmpeg';
  }
}

async function convertWavToMp3(wavPath, mp3Path) {
  const ffmpegPath = await getFfmpegPath();
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, [
      '-y', '-i', wavPath,
      '-ar', '44100', '-ac', '2',
      '-c:a', 'libmp3lame', '-q:a', '2',
      mp3Path,
    ]);
    let err = '';
    proc.stderr.on('data', (d) => { err += d.toString(); });
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}: ${err.slice(-300)}`))));
    proc.on('error', reject);
  });
}

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  if (!fs.existsSync(SRC)) {
    console.error('Source folder not found:', SRC);
    process.exit(1);
  }

  fs.mkdirSync(OUT, { recursive: true });

  const supabase = createClient(url, key);

  for (const { src, dest } of MAPPINGS) {
    const wavPath = path.join(SRC, src);
    const mp3Path = path.join(OUT, dest);

    if (!fs.existsSync(wavPath)) {
      console.warn('Skip (file not found):', src);
      continue;
    }

    console.log('Converting', src, '→', dest);
    await convertWavToMp3(wavPath, mp3Path);

    console.log('Uploading', dest);
    const buf = fs.readFileSync(mp3Path);
    const { error } = await supabase.storage.from('atmosphere').upload(dest, buf, {
      contentType: 'audio/mpeg',
      upsert: true,
    });
    if (error) {
      console.error('Upload failed:', error.message);
      process.exit(1);
    }
  }

  console.log('Done. Verify: GET /api/audio/atmosphere-status');
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.rmSync(SRC, { recursive: true, force: true });
  console.log('Removed source folder:', SRC);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
