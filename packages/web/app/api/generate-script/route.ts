import { NextRequest, NextResponse } from 'next/server';
import { generateScript, type ScriptGenerationInput } from '@waqup/shared/services/ai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 });
    }

    const body = await req.json() as ScriptGenerationInput;

    if (!body.type || !body.intent) {
      return NextResponse.json({ error: 'type and intent are required' }, { status: 400 });
    }

    const script = await generateScript(body, apiKey);
    return NextResponse.json({ script });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[generate-script]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
