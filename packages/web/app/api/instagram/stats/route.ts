import { NextResponse } from 'next/server';

// Instagram Graph API — fetches follower count for the connected business/creator account.
// Requires INSTAGRAM_ACCESS_TOKEN (long-lived token) and INSTAGRAM_USER_ID in env vars.
// Revalidates every hour so the marketing page always reflects near-real-time data.
export const revalidate = 3600;

interface InstagramUserResponse {
  followers_count?: number;
  media_count?: number;
  id?: string;
  error?: { message: string; code: number };
}

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!token || !userId) {
    return NextResponse.json(
      { followers: null, configured: false },
      { status: 200, headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    );
  }

  try {
    const url = `https://graph.instagram.com/v21.0/${userId}?fields=followers_count,media_count&access_token=${token}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`Instagram API responded with ${res.status}`);
    }

    const data: InstagramUserResponse = await res.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return NextResponse.json(
      {
        followers: data.followers_count ?? null,
        mediaCount: data.media_count ?? null,
        configured: true,
      },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    );
  } catch (err) {
    console.error('[instagram/stats]', err);
    return NextResponse.json(
      { followers: null, configured: true, error: 'fetch_failed' },
      { status: 200, headers: { 'Cache-Control': 'public, s-maxage=300' } }
    );
  }
}
