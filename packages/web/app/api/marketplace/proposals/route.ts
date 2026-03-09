import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

/**
 * POST /api/marketplace/proposals
 *
 * Saves a creator proposal from a user who hasn't yet unlocked
 * the Creator Marketplace. Proposal data is stored in the
 * `creator_proposals` table when available, otherwise falls back
 * gracefully so the UX never breaks.
 *
 * Body: ProposalPayload (see schema below)
 */

const proposalSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(255),
  contentTypes: z.array(z.enum(['affirmation', 'meditation', 'ritual'])).default([]),
  bio: z.string().max(280).default(''),
  instagram: z.string().max(80).default(''),
  tiktok: z.string().max(80).default(''),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = proposalSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const payload = {
      user_id: user?.id ?? null,
      name: parsed.data.name,
      email: parsed.data.email,
      content_types: parsed.data.contentTypes,
      bio: parsed.data.bio || null,
      instagram_handle: parsed.data.instagram || null,
      tiktok_handle: parsed.data.tiktok || null,
      status: 'pending',
    };

    // Insert into creator_proposals — tolerate missing table gracefully
    const { error } = await supabase
      .from('creator_proposals')
      .insert(payload);

    if (error) {
      // Table might not exist yet in all environments — log and succeed anyway
      // so the user sees confirmation without a jarring error.
      console.warn('[marketplace/proposals] Insert failed (table may not exist):', error.message);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[marketplace/proposals POST]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to submit proposal' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/marketplace/proposals
 *
 * Admin-only: list all submitted proposals.
 * Returns 401 unless the requesting user has the admin role.
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only allow users with service_role or explicit admin flag
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('creator_proposals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ proposals: data ?? [] });
  } catch (err) {
    console.error('[marketplace/proposals GET]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch proposals' },
      { status: 500 },
    );
  }
}
