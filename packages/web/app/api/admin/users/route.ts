import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

/**
 * Admin-only API route. Returns user data for the admin dashboard.
 *
 * Authentication: requires valid Supabase session and profile.role === 'superadmin'.
 * Uses Supabase service role key (bypasses RLS) to query across users.
 */
export async function GET(): Promise<NextResponse> {
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

  try {
    const supabase = createSupabaseAdminClient();

    // Fetch all auth users (admin API)
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
      perPage: 200,
    });

    if (authError) {
      throw authError;
    }

    const userIds = authData.users.map((u) => u.id);

    // Fetch profiles (stripe_customer_id)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, stripe_customer_id')
      .in('id', userIds);

    // Fetch active subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('user_id, plan_id, status, current_period_end, trial_end, cancel_at_period_end')
      .in('user_id', userIds)
      .in('status', ['active', 'trialing', 'past_due']);

    // Fetch current credit balances via RPC for each user is expensive;
    // instead sum from credit_transactions directly
    const { data: balances } = await supabase
      .from('credit_transactions')
      .select('user_id, amount')
      .in('user_id', userIds);

    // Fetch last 5 transactions per user (we'll send the full list and let client page)
    const { data: transactions } = await supabase
      .from('credit_transactions')
      .select('id, user_id, amount, description, source, created_at')
      .in('user_id', userIds)
      .order('created_at', { ascending: false })
      .limit(500);

    // Build lookup maps
    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const subMap = new Map((subscriptions ?? []).map((s) => [s.user_id, s]));

    const balanceMap = new Map<string, number>();
    for (const tx of balances ?? []) {
      balanceMap.set(tx.user_id, (balanceMap.get(tx.user_id) ?? 0) + tx.amount);
    }

    const txByUser = new Map<string, typeof transactions>();
    for (const tx of transactions ?? []) {
      if (!txByUser.has(tx.user_id)) txByUser.set(tx.user_id, []);
      txByUser.get(tx.user_id)!.push(tx);
    }

    // Shape the response
    const users = authData.users.map((u) => {
      const sub = subMap.get(u.id);
      const userTxs = (txByUser.get(u.id) ?? []).slice(0, 10);
      return {
        id: u.id,
        email: u.email ?? '—',
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        stripe_customer_id: profileMap.get(u.id)?.stripe_customer_id ?? null,
        subscription: sub
          ? {
              plan_id: sub.plan_id,
              status: sub.status,
              current_period_end: sub.current_period_end,
              trial_end: sub.trial_end,
              cancel_at_period_end: sub.cancel_at_period_end,
            }
          : null,
        credit_balance: balanceMap.get(u.id) ?? 0,
        recent_transactions: userTxs,
      };
    });

    // Sort by most recently active
    users.sort((a, b) => {
      const aTime = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : 0;
      const bTime = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : 0;
      return bTime - aTime;
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error('[admin/users] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
