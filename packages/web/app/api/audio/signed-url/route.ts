import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SUPABASE_PUBLIC_RECORDINGS =
  /\/storage\/v1\/object\/public\/audio\/(recordings\/[^/]+\/[^?#]+)/;

/**
 * GET /api/audio/signed-url?url=<encoded-url>
 *
 * Converts a Supabase public recordings URL to a signed URL.
 * The audio bucket is private, so public URLs return 400. This endpoint
 * returns a 7-day signed URL for playback (edit-audio, detail page, etc).
 *
 * Requires auth. Only returns signed URLs for recordings in the caller's folder.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const urlParam = req.nextUrl.searchParams.get('url');
    if (!urlParam) {
      return NextResponse.json({ error: 'url query param required' }, { status: 400 });
    }

    let url: URL;
    try {
      url = new URL(decodeURIComponent(urlParam));
    } catch {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
    }

    const match = url.pathname.match(SUPABASE_PUBLIC_RECORDINGS);
    if (!match) {
      return NextResponse.json({ error: 'Not a recordings URL' }, { status: 400 });
    }

    const storagePath = match[1];
    // recordings/{userId}/file.webm — ensure user owns this
    const pathUserId = storagePath.split('/')[1];
    if (pathUserId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { data, error: signError } = await supabase.storage
      .from('audio')
      .createSignedUrl(storagePath, 7 * 24 * 60 * 60);

    if (signError) {
      console.error('[signed-url] createSignedUrl failed:', signError.message);
      return NextResponse.json(
        { error: signError.message || 'Failed to create signed URL. Ensure migration 20260324000001_audio_system_buckets.sql has been applied.' },
        { status: 500 },
      );
    }

    if (!data?.signedUrl) {
      return NextResponse.json({ error: 'Failed to create signed URL' }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[signed-url]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
