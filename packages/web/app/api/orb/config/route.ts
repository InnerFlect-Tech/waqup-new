import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import type { OrbAddon, OrbAddonKey, OrbConfigResponse } from '@waqup/shared/types';

export const dynamic = 'force-dynamic';

/**
 * GET /api/orb/config
 * Returns the active Orb add-on configuration for the current user:
 * - Global admin toggles from orb_config
 * - Merged with user's per-addon preferences from user_orb_settings
 * - Current credit balance
 */
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

    // Fetch global orb config
    const { data: globalConfig, error: configError } = await supabase
      .from('orb_config')
      .select('addon_key, enabled, user_configurable, label, description, cost_qs')
      .order('cost_qs', { ascending: true });

    if (configError) {
      console.error('orb_config fetch error:', configError);
      return NextResponse.json({ error: 'Failed to load orb config' }, { status: 500 });
    }

    // Fetch user's personal overrides (only for user_configurable add-ons)
    const { data: userSettings } = await supabase
      .from('user_orb_settings')
      .select('addon_key, enabled')
      .eq('user_id', user.id);

    const userSettingsMap = new Map(
      (userSettings ?? []).map((s: { addon_key: string; enabled: boolean }) => [
        s.addon_key,
        s.enabled,
      ])
    );

    // Merge: global enabled AND (not user_configurable OR user has it on)
    const addons: OrbAddon[] = (globalConfig ?? []).map(
      (row: {
        addon_key: string;
        enabled: boolean;
        user_configurable: boolean;
        label: string;
        description: string;
        cost_qs: number;
      }) => {
        const userOverride = userSettingsMap.get(row.addon_key);
        const effectiveEnabled =
          row.enabled &&
          (row.user_configurable ? (userOverride !== undefined ? userOverride : true) : true);

        return {
          addonKey: row.addon_key as OrbAddonKey,
          enabled: effectiveEnabled,
          userConfigurable: row.user_configurable,
          label: row.label,
          description: row.description,
          costQs: row.cost_qs,
        };
      }
    );

    // Get credit balance via DB function, fall back to 0 gracefully
    let balance = 0;
    try {
      const { data: balanceData } = await supabase.rpc('get_credit_balance', {
        p_user_id: user.id,
      });
      balance = (balanceData as number) ?? 0;
    } catch {
      // Table may not exist yet — return 0, non-blocking
    }

    const response: OrbConfigResponse = { addons, balance };
    return NextResponse.json(response);
  } catch (err) {
    console.error('GET /api/orb/config error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
