import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createProgressService } from '@waqup/shared/services/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const progressService = createProgressService(supabase);

    const [statsResult, heatmapResult, recentResult] = await Promise.all([
      progressService.getProgressStats(),
      progressService.getPracticeHeatmap(16),
      progressService.getRecentSessions(7),
    ]);

    if (!statsResult.success) {
      return NextResponse.json({ error: statsResult.error }, { status: 500 });
    }

    return NextResponse.json({
      stats: statsResult.data,
      heatmap: heatmapResult.data,
      recentSessions: recentResult.data ?? [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[progress/stats]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
