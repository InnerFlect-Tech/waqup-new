/**
 * Mobile audio services — upload recording to the web API.
 * Used by the creation flow for own-voice rituals.
 */
import { API_BASE_URL } from '@/constants/app';

export interface UploadRecordingResponse {
  url: string;
  storagePath: string;
}

/**
 * Uploads a local recording to the server.
 * Returns the signed URL to pass to render API as ownVoiceUrl.
 */
export async function uploadRecording(
  uri: string,
  contentId: string,
  getSession: () => Promise<{ data: { session: { access_token: string } | null } }>
): Promise<UploadRecordingResponse> {
  const { data: { session } } = await getSession();
  const headers: Record<string, string> = {};
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }
  // Do NOT set Content-Type — FormData sets multipart boundary automatically

  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'audio/m4a', // expo-av records as m4a on iOS
    name: 'recording.m4a',
  } as unknown as Blob);
  formData.append('contentId', contentId);

  const res = await fetch(`${API_BASE_URL}/api/audio/upload-recording`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (res.status === 401) {
    throw new Error('Please sign in to upload your recording.');
  }
  if (res.status === 400) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? 'Invalid recording.');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? 'Upload failed. Please try again.');
  }

  const data = (await res.json()) as { url?: string; storagePath?: string };
  if (!data.url) {
    throw new Error('Upload succeeded but no URL was returned.');
  }

  return { url: data.url, storagePath: data.storagePath ?? '' };
}
