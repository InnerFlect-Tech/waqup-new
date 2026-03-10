import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateScript } from '@waqup/shared/services/ai';
import { contentTypeSchema, contextSchema, personalizationSchema } from '@waqup/shared/schemas';
import { API_ROUTE_COSTS } from '@waqup/shared/constants';
import { getAuthenticatedUserForApi } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const COST = API_ROUTE_COSTS.generateScript;
const MAX_INTENT_LENGTH = 5000;

/** Language instructions for AI script generation */
const LANGUAGE_INSTRUCTION: Record<string, string> = {
  en: '',
  pt: 'Write the script in European Portuguese (Portugal). ',
  es: 'Escribe el guion en español. ',
  fr: 'Écris le script en français. ',
  de: 'Schreibe das Skript auf Deutsch. ',
};

const generateScriptRequestSchema = z.object({
  type: contentTypeSchema,
  intent: z.string().min(1, 'Intent is required').max(MAX_INTENT_LENGTH),
  context: contextSchema,
  personalization: personalizationSchema.optional(),
  locale: z.string().optional().default('en'),
});

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 });
    }

    // ─── Auth ───────────────────────────────────────────────────────────────
    const auth = await getAuthenticatedUserForApi(req);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { supabase, user } = auth;

    const parsed = generateScriptRequestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const body = parsed.data;

    // ─── Atomic credit deduction (before calling OpenAI) ─────────────────────
    // deduct_credits() checks balance and deducts in a single locked transaction,
    // preventing concurrent requests from both passing the balance check.
    const { error: deductError } = await supabase.rpc('deduct_credits', {
      p_user_id:     user.id,
      p_amount:      COST,
      p_description: 'generate_script',
    });

    if (deductError) {
      if (deductError.message?.includes('insufficient_credits')) {
        const { data: balance } = await supabase.rpc('get_credit_balance');
        return NextResponse.json(
          {
            error: 'insufficient_credits',
            message: `Generating a script costs ${COST} Qs but you have ${(balance as number) ?? 0}. Get more Qs to continue.`,
            required: COST,
            balance: (balance as number) ?? 0,
          },
          { status: 402 },
        );
      }
      console.error('[generate-script] credit deduction failed:', deductError.message);
      return NextResponse.json({ error: 'Credit service error. Please try again.' }, { status: 503 });
    }

    const langInstruction = LANGUAGE_INSTRUCTION[body.locale] ?? '';
    const localizedInput = langInstruction
      ? { ...body, intent: langInstruction + body.intent }
      : body;

    console.log('[generate-script] type=%s intent_len=%d locale=%s', body.type, body.intent.length, body.locale);

    try {
      const script = await generateScript(localizedInput, apiKey);
      if (!script) {
        throw new Error('AI returned empty content');
      }
      console.log('[generate-script] ok script_len=%d', script.length);
      return NextResponse.json({ script, creditsUsed: COST });
    } catch (genErr) {
      // Generation failed after we already deducted — log for reconciliation.
      // In a future version, a compensating credit could be issued here.
      console.error('[generate-script] generation failed after credit deduction:', genErr);
      const message = genErr instanceof Error ? genErr.message : 'Generation failed';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[generate-script] error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
