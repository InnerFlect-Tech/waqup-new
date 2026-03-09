import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/content
 * Returns content stats (counts by type, status). Superadmin only.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const serverClient = await createSupabaseServerClient();
    const { data: { session } } = await serverClient.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await serverClient
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = createSupabaseAdminClient();

    const { data: all, error } = await db
      .from('content_items')
      .select('id, type, status, created_at');

    if (error) {
      return NextResponse.json(
        { error: error.message, stats: null },
        { status: 200 },
      );
    }

    const items = all ?? [];
    const now = new Date();
    const day7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const day30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const byType: Record<string, number> = { affirmation: 0, meditation: 0, ritual: 0 };
    const byStatus: Record<string, number> = {};
    let last7 = 0;
    let last30 = 0;

    for (const item of items) {
      const type = (item.type as string) ?? 'affirmation';
      byType[type] = (byType[type] ?? 0) + 1;

      const status = (item.status as string) ?? 'draft';
      byStatus[status] = (byStatus[status] ?? 0) + 1;

      const created = item.created_at ? new Date(item.created_at as string) : null;
      if (created) {
        if (created >= day7) last7++;
        if (created >= day30) last30++;
      }
    }

    return NextResponse.json({
      stats: {
        total: items.length,
        byType,
        byStatus,
        last7Days: last7,
        last30Days: last30,
      },
      timestamp: now.toISOString(),
    });
  } catch (err) {
    console.error('[admin/content] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
