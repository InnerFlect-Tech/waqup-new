import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createSupabaseAdminClient } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

/**
 * DELETE /api/account/delete
 *
 * Permanently deletes the authenticated user's account.
 * Required by Apple App Store Guideline 5.1.1(v).
 *
 * - Cascades to all user data (profiles, content_items, credit_transactions, etc.)
 * - Uses service role to call auth.admin.deleteUser()
 */
export async function DELETE(): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createSupabaseAdminClient();
    const { error } = await admin.auth.admin.deleteUser(session.user.id);

    if (error) {
      console.error('[account/delete]', error.message);
      return NextResponse.json(
        { error: 'Could not delete account. Please try again or contact support.' },
        { status: 500 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[account/delete]', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
