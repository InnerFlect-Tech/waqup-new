import { NextRequest, NextResponse } from 'next/server';
import { generateConversationReply } from '@waqup/shared/services/ai';
import type { ContentItemType } from '@waqup/shared/types';

const CONVERSATION_SYSTEM_PROMPTS: Record<ContentItemType, string> = {
  affirmation: `You are a supportive creation guide helping someone craft a personal affirmation practice. Your role is to draw out their intent through empathetic, focused questions — one at a time.

Flow:
1. If no intent yet: ask what area of life they want to strengthen
2. Once intent clear: ask what that would feel/look like when achieved
3. After 2 exchanges: say "I have everything I need — generating your script now." and include [GENERATE_SCRIPT] on its own line

Rules:
- One question at a time
- Warm, concise, not therapist-y
- Never give advice — just draw out their truth
- Keep responses under 60 words`,

  meditation: `You are a calm, focused creation guide helping someone design a personal meditation practice. Draw out their intent through precise, gentle questions — one at a time.

Flow:
1. If no intent yet: ask what state they want to access (sleep, calm, focus, etc.)
2. Once intent clear: ask when they'll practice (morning, evening, etc.)
3. After 2 exchanges: say "Perfect — generating your meditation now." and include [GENERATE_SCRIPT] on its own line

Rules:
- One question at a time
- Calm, unhurried tone
- Keep responses under 60 words`,

  ritual: `You are a thoughtful creation guide helping someone build a transformational daily ritual. Draw out their intent, values, and context through grounded questions — one at a time.

Flow:
1. If no intent yet: ask what transformation they are working toward
2. Once intent clear: ask what core values drive this work
3. After values shared: ask why this matters to them deeply
4. After 3 exchanges: say "I have what I need — creating your ritual now." and include [GENERATE_SCRIPT] on its own line

Rules:
- One question at a time
- Grounded, purposeful tone
- Keep responses under 70 words`,
};

interface ConversationRequest {
  type: ContentItemType;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 });
    }

    const body = await req.json() as ConversationRequest;

    if (!body.type || !body.messages) {
      return NextResponse.json({ error: 'type and messages are required' }, { status: 400 });
    }

    const systemPrompt = CONVERSATION_SYSTEM_PROMPTS[body.type];
    const reply = await generateConversationReply(body.messages, systemPrompt, apiKey);

    const shouldGenerateScript = reply.includes('[GENERATE_SCRIPT]');
    const cleanReply = reply.replace('[GENERATE_SCRIPT]', '').trim();

    return NextResponse.json({ reply: cleanReply, shouldGenerateScript });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[conversation]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
