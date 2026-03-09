import type { SupabaseClient } from '@supabase/supabase-js';

const AUDIO_BUCKET = 'audio';

/**
 * Uploads an audio buffer to the private Supabase `audio` bucket.
 *
 * File path convention: `{userId}/{contentId}.mp3`
 *
 * Returns the public URL if the file is marketplace-enabled (bucket is configured
 * to allow public reads for such files), otherwise returns a 1-hour signed URL.
 *
 * Callers should handle the case where the bucket does not yet exist gracefully.
 */
export async function uploadAudio(
  client: SupabaseClient,
  userId: string,
  contentId: string,
  buffer: ArrayBuffer,
): Promise<string> {
  const path = `${userId}/${contentId}.mp3`;

  const { error: uploadError } = await client.storage
    .from(AUDIO_BUCKET)
    .upload(path, buffer, {
      contentType: 'audio/mpeg',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Audio upload failed: ${uploadError.message}`);
  }

  // Try signed URL (1 week) for private access
  const { data: signedData, error: signedError } = await client.storage
    .from(AUDIO_BUCKET)
    .createSignedUrl(path, 60 * 60 * 24 * 7); // 1 week

  if (signedError || !signedData?.signedUrl) {
    // Fallback: try public URL (works if marketplace RLS policy allows it)
    const { data: publicData } = client.storage.from(AUDIO_BUCKET).getPublicUrl(path);
    if (publicData?.publicUrl) return publicData.publicUrl;
    throw new Error('Could not generate audio URL after upload');
  }

  return signedData.signedUrl;
}

/**
 * Returns a fresh signed URL for an existing audio file (1 hour).
 * Use this when re-playing content that was uploaded previously.
 */
export async function getAudioSignedUrl(
  client: SupabaseClient,
  userId: string,
  contentId: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const path = `${userId}/${contentId}.mp3`;
  const { data, error } = await client.storage
    .from(AUDIO_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

/**
 * Deletes the audio file for a content item from storage.
 * Called when content is permanently deleted.
 */
export async function deleteAudio(
  client: SupabaseClient,
  userId: string,
  contentId: string,
): Promise<void> {
  const path = `${userId}/${contentId}.mp3`;
  await client.storage.from(AUDIO_BUCKET).remove([path]);
}
