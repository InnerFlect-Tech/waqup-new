import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

const WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET ?? '';

interface RevenueCatEvent {
  type: string;
  app_user_id?: string;
  product_id?: string;
  transaction_id?: string;
  original_transaction_id?: string;
  environment?: string;
  store?: string;
}

/**
 * POST /api/webhooks/revenuecat
 *
 * Receives purchase events from RevenueCat and credits Qs via grant_iap_credits().
 *
 * Events handled:
 *  - INITIAL_PURCHASE   → consumable or first subscription
 *  - NON_RENEWING_PURCHASE → consumable credit packs
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get('authorization');
  const expectedAuth = `Bearer ${WEBHOOK_SECRET}`;

  if (!WEBHOOK_SECRET) {
    console.error('[webhook/revenuecat] REVENUECAT_WEBHOOK_SECRET not set');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  if (authHeader !== expectedAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let event: RevenueCatEvent;
  try {
    event = (await req.json()) as RevenueCatEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { type, app_user_id, product_id, transaction_id, environment } = event;

  // Only process purchase events that grant credits
  if (!['INITIAL_PURCHASE', 'NON_RENEWING_PURCHASE'].includes(type)) {
    return NextResponse.json({ status: 'ignored', reason: `Event type ${type} not handled` });
  }

  if (!app_user_id || !product_id || !transaction_id) {
    console.warn('[webhook/revenuecat] Missing required fields:', { app_user_id, product_id, transaction_id });
    return NextResponse.json({ error: 'Missing app_user_id, product_id, or transaction_id' }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();
  const env = environment === 'SANDBOX' ? 'sandbox' : 'production';

  const { data, error } = await supabase.rpc('grant_iap_credits', {
    p_user_id: app_user_id,
    p_product_id: product_id,
    p_transaction_id: transaction_id,
    p_environment: env,
  });

  // Idempotency: already processed = success
  if (data && typeof data === 'object' && (data as { status?: string }).status === 'already_processed') {
    return NextResponse.json({ status: 'already_processed' });
  }

  if (error) {
    console.error('[webhook/revenuecat] grant_iap_credits failed:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data as object) ?? { status: 'ok' });
}
