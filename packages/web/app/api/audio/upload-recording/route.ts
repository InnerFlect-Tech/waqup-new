import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/audio/upload-recording
 *
 * Uploads a user-recorded audio blob to Supabase Storage and returns its URL.
 * Called from ContentVoiceStep when the user records their own voice.
 *
 * Body: multipart/form-data
 *   file      — audio blob (audio/webm or audio/mp4)
 *   contentId — (optional) content item ID for namespacing; falls back to timestamp
 *
 * Returns: { url: string; storagePath: string }
 *
 * The returned URL is stored in ContentCreationContext.ownVoiceUrl and later
 * passed to /api/ai/render as ownVoiceUrl. When that field is present, the
 * render route skips ElevenLabs TTS and uses the recording directly as voice_url.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const contentId = (formData.get('contentId') as string | null) ?? `tmp_${Date.now()}`;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Derive extension from MIME type — webm on Chrome, mp4 on Safari
    const mimeType = file.type || 'audio/webm';
    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
    const storagePath = `recordings/${user.id}/${contentId}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from('audio')
      .upload(storagePath, arrayBuffer, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error('[upload-recording] storage upload failed:', uploadError.message);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Try public URL first; fall back to 7-day signed URL
    const { data: urlData } = supabase.storage.from('audio').getPublicUrl(storagePath);
    if (urlData?.publicUrl) {
      return NextResponse.json({ url: urlData.publicUrl, storagePath });
    }

    const { data: signedData } = await supabase.storage
      .from('audio')
      .createSignedUrl(storagePath, 7 * 24 * 60 * 60);

    if (!signedData?.signedUrl) {
      return NextResponse.json({ error: 'Failed to generate URL for uploaded recording' }, { status: 500 });
    }

    return NextResponse.json({ url: signedData.signedUrl, storagePath });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[upload-recording]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
