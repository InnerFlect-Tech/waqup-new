import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { sendOrbMessage } from '@waqup/shared/services';
import { calcOrbCost } from '@waqup/shared/constants';
import type { OrbChatRequest, OrbChatResponse, OrbAddonKey } from '@waqup/shared/types';

export const dynamic = 'force-dynamic';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';

/**
 * POST /api/orb/chat
 * Handles one Orb conversation exchange:
 * 1. Authenticates user
 * 2. Checks credit balance against requested add-ons
 * 3. Fetches user context (if user_context addon active)
 * 4. Fetches collective wisdom (if collective_wisdom addon active)
 * 5. Calls OpenAI via sendOrbMessage
 * 6. Deducts credits
 * 7. Returns reply + credits used
 */
export async function POST(request: Request) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Set OPENAI_API_KEY in your environment.' },
        { status: 503 }
      );
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as OrbChatRequest;
    const { messages, contentType, step, activeAddons } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages array required' }, { status: 400 });
    }

    // ─── Credit check ─────────────────────────────────────────────────────────
    const totalCost = calcOrbCost(activeAddons);

    let currentBalance = 0;
    try {
      const { data: balanceData } = await supabase.rpc('get_credit_balance', {
        p_user_id: user.id,
      });
      currentBalance = (balanceData as number) ?? 0;
    } catch {
      // Table not yet deployed — allow through with mock balance in dev
      currentBalance = 999;
    }

    if (currentBalance < totalCost) {
      return NextResponse.json(
        {
          error: 'insufficient_credits',
          message: `You need ${totalCost} Qs but have ${currentBalance}. Get more Qs to continue.`,
          required: totalCost,
          balance: currentBalance,
        },
        { status: 402 }
      );
    }

    // ─── Fetch user context ───────────────────────────────────────────────────
    let userContext: string | undefined;
    if (activeAddons.includes('user_context' as OrbAddonKey)) {
      userContext = await buildUserContext(supabase, user.id, contentType);
    }

    // ─── Fetch collective wisdom ──────────────────────────────────────────────
    let collectiveContext: string | undefined;
    if (activeAddons.includes('collective_wisdom' as OrbAddonKey)) {
      collectiveContext = await buildCollectiveContext(supabase, contentType);
    }

    // ─── Call OpenAI ──────────────────────────────────────────────────────────
    const { reply } = await sendOrbMessage({
      messages,
      contentType,
      step,
      activeAddons,
      userContext,
      collectiveContext,
      apiKey: OPENAI_API_KEY,
    });

    // ─── Deduct credits ───────────────────────────────────────────────────────
    if (totalCost > 0) {
      try {
        await supabase.from('credit_transactions').insert({
          user_id: user.id,
          amount: -totalCost,
          reason: `orb_chat:${activeAddons.join(',')}`,
          metadata: { step, contentType, addons: activeAddons },
        });
      } catch (deductErr) {
        // Non-fatal: log but don't fail the response
        console.error('Credit deduction failed:', deductErr);
      }
    }

    // ─── Advance step ─────────────────────────────────────────────────────────
    const nextStep = advanceStep(step, contentType, reply);

    const response: OrbChatResponse = {
      reply,
      step: nextStep,
      creditsUsed: totalCost,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error('POST /api/orb/chat error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function buildUserContext(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  contentType: string | null
): Promise<string> {
  const parts: string[] = [];

  // User profile goals/focus
  try {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('display_name, goals, focus_areas, notes')
      .eq('user_id', userId)
      .single();

    if (profile) {
      if (profile.display_name) parts.push(`User's name: ${profile.display_name}`);
      if (profile.goals?.length) parts.push(`Goals: ${profile.goals.join(', ')}`);
      if (profile.focus_areas?.length) parts.push(`Focus areas: ${profile.focus_areas.join(', ')}`);
      if (profile.notes) parts.push(`Notes: ${profile.notes}`);
    }
  } catch {
    // Profile table not yet deployed
  }

  // Recent content (titles only — gives the Orb a sense of their history)
  try {
    const query = supabase
      .from('content_items')
      .select('type, title, description')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (contentType) query.eq('type', contentType);

    const { data: recentContent } = await query;

    if (recentContent?.length) {
      const items = recentContent
        .map(
          (c: { type: string; title: string; description?: string }) =>
            `- ${c.type}: "${c.title}"${c.description ? ` (${c.description})` : ''}`
        )
        .join('\n');
      parts.push(`User's recent ${contentType ?? 'content'}:\n${items}`);
    }
  } catch {
    // content_items unavailable
  }

  return parts.length > 0 ? parts.join('\n') : 'No personal history available yet.';
}

async function buildCollectiveContext(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  contentType: string | null
): Promise<string> {
  try {
    const query = supabase
      .from('content_items')
      .select('title, description')
      .eq('status', 'complete')
      .order('created_at', { ascending: false })
      .limit(10);

    if (contentType) query.eq('type', contentType);

    const { data: communityContent } = await query;

    if (!communityContent?.length) {
      return 'No collective patterns available yet.';
    }

    const titles = communityContent
      .map((c: { title: string }) => `"${c.title}"`)
      .join(', ');

    return `Community ${contentType ?? 'content'} themes: ${titles}.
Use these as inspiration for themes, language, and structure — but personalise deeply for this user.`;
  } catch {
    return 'Collective patterns unavailable.';
  }
}

/**
 * Heuristic step advancement based on what the Orb just produced.
 * The full state machine lives in ContentCreationContext; this is a lightweight
 * server-side nudge so the client knows when a script has been generated.
 */
function advanceStep(
  current: OrbChatRequest['step'],
  contentType: string | null,
  reply: string
): OrbChatRequest['step'] {
  // If the reply looks like a script (long, no question mark at end) and we're in script step
  if (current === 'script' && reply.length > 200 && !reply.trim().endsWith('?')) {
    return 'voice';
  }

  const stepOrder: OrbChatRequest['step'][] = [
    'init',
    'intent',
    'context',
    'personalization',
    'script',
    'voice',
    'audio',
    'review',
    'complete',
  ];

  // Skip context/personalization for affirmations (they go straight to script)
  if (contentType === 'affirmation' && current === 'intent') return 'script';

  // Skip personalization for meditations
  if (contentType === 'meditation' && current === 'context') return 'script';

  const idx = stepOrder.indexOf(current);
  if (idx === -1 || idx === stepOrder.length - 1) return current;
  return stepOrder[idx + 1];
}
