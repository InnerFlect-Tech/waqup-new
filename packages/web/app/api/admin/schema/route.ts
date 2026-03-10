import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export interface SchemaCheck {
  check_name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  detail: string | null;
}

async function tableExists(db: ReturnType<typeof createSupabaseAdminClient>, table: string): Promise<boolean> {
  const { error } = await db.from(table).select('*').limit(0);
  return !error;
}

async function columnExists(
  db: ReturnType<typeof createSupabaseAdminClient>,
  table: string,
  column: string
): Promise<boolean> {
  const { error } = await db.from(table).select(column).limit(0);
  return !error;
}

/**
 * GET /api/admin/schema
 * Returns live schema verification results. Superadmin only.
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
    const checks: SchemaCheck[] = [];

    const tables: { name: string; detail: string }[] = [
      { name: 'profiles', detail: 'public.profiles' },
      { name: 'content_items', detail: 'public.content_items' },
      { name: 'credit_transactions', detail: 'public.credit_transactions' },
      { name: 'subscriptions', detail: 'public.subscriptions' },
      { name: 'waitlist_signups', detail: 'public.waitlist_signups' },
      { name: 'user_voices', detail: 'public.user_voices' },
      { name: 'iap_purchases', detail: 'Apple IAP receipt tracking (iOS)' },
      { name: 'iap_products', detail: 'Product ID → Qs mapping (iOS)' },
    ];

    for (const t of tables) {
      const exists = await tableExists(db, t.name);
      checks.push({
        check_name: `${t.name} table`,
        status: exists ? 'PASS' : 'FAIL',
        detail: t.detail,
      });
    }

    const profilesCols: [string, string][] = [
      ['role', 'superadmin access'],
      ['access_granted', 'access control'],
      ['elevenlabs_voice_id', 'voice cloning'],
      ['stripe_customer_id', 'Stripe billing'],
    ];
    for (const [col, detail] of profilesCols) {
      const exists = await columnExists(db, 'profiles', col);
      checks.push({
        check_name: `profiles.${col}`,
        status: exists ? 'PASS' : 'FAIL',
        detail,
      });
    }

    const contentCols = ['audio_url', 'voice_url', 'status'];
    for (const col of contentCols) {
      const exists = await columnExists(db, 'content_items', col);
      checks.push({
        check_name: `content_items.${col}`,
        status: exists ? 'PASS' : 'FAIL',
        detail: null,
      });
    }

    return NextResponse.json({
      checks,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[admin/schema] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
