import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/marketplace/items
 *
 * Returns a list of marketplace items joined with their content_item data.
 * Supports filtering and sorting via query params:
 *   ?type=affirmation|meditation|ritual
 *   ?elevated=true
 *   ?sort=trending|recent|top
 *   ?limit=20&offset=0
 *
 * POST /api/marketplace/items
 *
 * Publishes an existing content item to the marketplace.
 * Body: { contentItemId: string }
 */

export async function GET(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { searchParams } = new URL(req.url);

    const type = searchParams.get('type');
    const elevated = searchParams.get('elevated') === 'true';
    const sort = searchParams.get('sort') ?? 'trending';
    const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 50);
    const offset = Number(searchParams.get('offset') ?? '0');

    let query = supabase
      .from('marketplace_items')
      .select(`
        id,
        content_item_id,
        creator_id,
        is_elevated,
        is_listed,
        play_count,
        share_count,
        listed_at,
        content_items (
          id,
          type,
          title,
          description,
          duration,
          voice_url,
          ambient_url,
          binaural_url,
          audio_url,
          status
        )
      `)
      .eq('is_listed', true);

    if (elevated) {
      query = query.eq('is_elevated', true);
    }

    if (type) {
      query = query.eq('content_items.type', type);
    }

    if (sort === 'trending') {
      query = query.order('share_count', { ascending: false });
    } else if (sort === 'top') {
      query = query.order('play_count', { ascending: false });
    } else {
      query = query.order('listed_at', { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data ?? [] });
  } catch (err) {
    console.error('[marketplace/items GET]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch marketplace items' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { contentItemId } = (await req.json()) as { contentItemId: string };

    if (!contentItemId) {
      return NextResponse.json({ error: 'contentItemId is required' }, { status: 400 });
    }

    // Verify the user owns this content item
    const { data: contentItem, error: fetchErr } = await supabase
      .from('content_items')
      .select('id, user_id, status')
      .eq('id', contentItemId)
      .eq('user_id', user.id)
      .single();

    if (fetchErr || !contentItem) {
      return NextResponse.json({ error: 'Content item not found or not owned by user' }, { status: 404 });
    }

    // Upsert marketplace listing
    const { data, error } = await supabase
      .from('marketplace_items')
      .upsert({
        content_item_id: contentItemId,
        creator_id: user.id,
        is_listed: true,
      }, { onConflict: 'content_item_id' })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: data });
  } catch (err) {
    console.error('[marketplace/items POST]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to publish item' },
      { status: 500 },
    );
  }
}
