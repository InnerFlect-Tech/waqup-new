import { NextRequest, NextResponse } from 'next/server';
import { API_ROUTE_COSTS } from '@waqup/shared/constants';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const COST_PER_BUNDLE = API_ROUTE_COSTS.oracleSession;
const REPLIES_PER_Q  = 3;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as { qs?: number };
    const qs = Math.max(1, Math.min(20, Math.round(body.qs ?? 1)));
    const totalCost  = qs * COST_PER_BUNDLE;
    const totalReplies = qs * REPLIES_PER_Q;

    // ─── Atomic credit deduction (before creating session) ───────────────────
    // deduct_credits() checks balance and inserts the debit in one locked transaction.
    const { error: deductError } = await supabase.rpc('deduct_credits', {
      p_user_id:     user.id,
      p_amount:      totalCost,
      p_description: 'oracle_session',
    });

    if (deductError) {
      if (deductError.message?.includes('insufficient_credits')) {
        const { data: balance } = await supabase.rpc('get_credit_balance');
        return NextResponse.json(
          {
            error: 'insufficient_credits',
            message: `This session costs ${totalCost} Q but you only have ${(balance as number) ?? 0}. Get more Qs to continue.`,
            required: totalCost,
            balance: (balance as number) ?? 0,
          },
          { status: 402 },
        );
      }
      console.error('[oracle/session] credit deduction failed:', deductError.message);
      return NextResponse.json({ error: 'Credit service unavailable' }, { status: 503 });
    }

    // ─── Create server-side session record ───────────────────────────────────
    // The session ID is returned to the client and must be passed with every
    // oracle reply request. The server enforces the reply count via consume_oracle_reply().
    const { data: session, error: sessionError } = await supabase
      .from('oracle_sessions')
      .insert({
        user_id:       user.id,
        replies_total: totalReplies,
        replies_used:  0,
      })
      .select('id, replies_total, expires_at')
      .single();

    if (sessionError || !session) {
      // Credits were already deducted — log for reconciliation.
      console.error('[oracle/session] failed to create session record after deduction:', sessionError?.message);
      // Issue a compensating credit to avoid charging for a failed session.
      await supabase.from('credit_transactions').insert({
        user_id:     user.id,
        amount:      totalCost,
        description: 'oracle_session_refund',
      });
      return NextResponse.json({ error: 'Session creation failed. Credits refunded.' }, { status: 500 });
    }

    return NextResponse.json({
      sessionId:     session.id,
      repliesAllowed: totalReplies,
      qs,
      creditsUsed:   totalCost,
      expiresAt:     session.expires_at,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[oracle/session]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
