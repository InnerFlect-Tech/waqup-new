import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { spawn } from 'child_process';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * POST /api/audio/normalize
 *
 * Normalizes an audio file to -14 LUFS using FFmpeg's loudnorm filter.
 * All three audio layers (voice, ambient, binaural) pass through this endpoint
 * before being stored in Supabase Storage.
 *
 * Body (JSON): { url: string; layer: 'voice' | 'ambient' | 'binaural'; contentItemId?: string }
 * Returns: { normalizedUrl: string }
 */

// Target loudness level — matches Spotify / Apple Music standard
const TARGET_LUFS = -14;
const TRUE_PEAK = -1.0;

function runFfmpeg(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ffmpegPath: string = ffmpegInstaller.path;

    const args = [
      '-y',
      '-i', inputPath,
      '-af', `loudnorm=I=${TARGET_LUFS}:TP=${TRUE_PEAK}:LRA=11:print_format=summary`,
      '-ar', '44100',
      '-ac', '2',
      '-c:a', 'libmp3lame',
      '-q:a', '2',
      outputPath,
    ];

    const proc = spawn(ffmpegPath, args);
    let stderr = '';
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}. stderr: ${stderr.slice(-500)}`));
    });
    proc.on('error', reject);
  });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, layer, contentItemId } = (await req.json()) as {
      url: string;
      layer: 'voice' | 'ambient' | 'binaural';
      contentItemId?: string;
    };

    if (!url || !layer) {
      return NextResponse.json({ error: 'url and layer are required' }, { status: 400 });
    }

    // Download source audio to a temp file
    const tmpDir = os.tmpdir();
    const inputPath = path.join(tmpDir, `waqup_in_${Date.now()}.mp3`);
    const outputPath = path.join(tmpDir, `waqup_norm_${Date.now()}.mp3`);

    const audioRes = await fetch(url);
    if (!audioRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch source audio' }, { status: 400 });
    }
    const audioBuffer = Buffer.from(await audioRes.arrayBuffer());
    await fs.writeFile(inputPath, audioBuffer);

    // Run FFmpeg normalization
    await runFfmpeg(inputPath, outputPath);

    // Upload normalized file to Supabase Storage
    const normalizedBuffer = await fs.readFile(outputPath);
    const storagePath = `audio/${user.id}/${contentItemId ?? 'unsaved'}/${layer}_norm_${Date.now()}.mp3`;

    const { error: uploadError } = await supabase.storage
      .from('audio')
      .upload(storagePath, normalizedBuffer, {
        contentType: 'audio/mpeg',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from('audio').getPublicUrl(storagePath);

    // Cleanup temp files
    await Promise.allSettled([fs.unlink(inputPath), fs.unlink(outputPath)]);

    return NextResponse.json({ normalizedUrl: publicUrl });
  } catch (err) {
    console.error('[audio/normalize]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Normalization failed' },
      { status: 500 },
    );
  }
}
