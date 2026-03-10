import type { Metadata } from 'next';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { PublicPlayerClient } from './PublicPlayerClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('content_items')
    .select('title, description, type')
    .eq('id', params.id)
    .single();

  const title = data?.title ?? 'Listen on waQup';
  const description = data?.description ?? 'A mindfulness experience created with waQup.';
  const ogImageUrl = `/api/og?id=${params.id}`;

  return {
    title: `${title} · waQup`,
    description,
    openGraph: {
      title: `${title} · waQup`,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'music.song',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · waQup`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PublicPlayerPage({ params }: Props) {
  const supabase = await createSupabaseServerClient();

  const { data: mi } = await supabase
    .from('marketplace_items')
    .select(`
      id,
      is_elevated,
      play_count,
      share_count,
      creator_id,
      content_items (
        id, type, title, description, duration,
        voice_url, ambient_url, binaural_url, audio_url
      )
    `)
    .eq('content_item_id', params.id)
    .eq('is_listed', true)
    .single();

  let item = null;
  let creatorName = 'waQup creator';

  if (mi) {
    const ci = (mi as Record<string, unknown>).content_items as Record<string, unknown> | null;
    const creatorId = (mi as Record<string, unknown>).creator_id as string;

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, username')
      .eq('id', creatorId)
      .single();

    creatorName = (profile as { full_name?: string; username?: string } | null)?.full_name
      ?? (profile as { full_name?: string; username?: string } | null)?.username
      ?? creatorName;

    if (ci) {
      item = {
        id: ci.id as string,
        type: ci.type as 'affirmation' | 'meditation' | 'ritual',
        title: ci.title as string,
        description: (ci.description as string) ?? '',
        duration: (ci.duration as string) ?? '',
        voiceUrl: (ci.voice_url as string | null) ?? null,
        ambientUrl: (ci.ambient_url as string | null) ?? null,
        binauralUrl: (ci.binaural_url as string | null) ?? null,
        audioUrl: (ci.audio_url as string | null) ?? null,
        isElevated: (mi as Record<string, unknown>).is_elevated as boolean ?? false,
        playCount: (mi as Record<string, unknown>).play_count as number ?? 0,
        shareCount: (mi as Record<string, unknown>).share_count as number ?? 0,
        creatorName,
      };
    }
  }

  return <PublicPlayerClient item={item} contentId={params.id} />;
}
