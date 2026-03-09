import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/marketplace/share
 *
 * Records a share event and awards +1 credit to the content creator via the
 * `record_share_and_award_credit` database function.
 *
 * Body: { contentItemId: string; platform: 'instagram' | 'whatsapp' | 'x' | 'copy' | 'other' }
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { contentItemId, platform } = (await req.json()) as {
      contentItemId: string;
      platform: 'instagram' | 'whatsapp' | 'x' | 'copy' | 'other';
    };

    if (!contentItemId || !platform) {
      return NextResponse.json({ error: 'contentItemId and platform are required' }, { status: 400 });
    }

    const { error } = await supabase.rpc('record_share_and_award_credit', {
      p_content_item_id: contentItemId,
      p_platform: platform,
      p_sharer_user_id: user?.id ?? null,
    });

    if (error) {
      console.error('[marketplace/share]', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[marketplace/share]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to record share' },
      { status: 500 },
    );
  }
}
