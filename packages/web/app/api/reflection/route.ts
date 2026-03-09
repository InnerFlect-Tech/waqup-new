import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { generateConversationReply } from '@waqup/shared/services/ai';
import { createProgressService } from '@waqup/shared/services/supabase';
import type { ReflectionMessage } from '@waqup/shared/types';

export const dynamic = 'force-dynamic';

const REFLECTION_SYSTEM_PROMPT = `You are a compassionate reflection guide helping someone integrate the benefits of their mind-reprogramming practice (affirmations, meditations, and rituals). Your role is to help them surface insights, patterns, and feelings — always from a constructive, growth-oriented perspective.

Your approach:
1. Start by asking how today's practice felt — warm, open, non-judgmental
2. Pick up on emotional cues and reflect them back with curiosity
3. Ask ONE focused follow-up question to draw out the key insight or shift they noticed
4. When a meaningful insight emerges, acknowledge it and gently connect it to their subconscious growth
5. Close with a short, constructive summary starting with "I noticed..." that names: their energy state, the key insight, and what it signals about their inner work

Rules:
- One question at a time — never ask multiple questions
- Warm, grounded, non-therapist tone — like a wise friend
- Never give advice or diagnose — only reflect and draw out
- Frame everything constructively — resistance, difficulty, and confusion are valid and useful signals
- Keep responses under 80 words
- When you have enough to summarize (after 3+ exchanges), include [READY_TO_SUMMARIZE] on its own line at the end`;

const WEEKLY_SYNTHESIS_PROMPT = `You are an insightful reflection synthesizer. You have access to a user's recent daily reflection summaries from their subconscious reprogramming practice.

Your task: write a concise, constructive weekly synthesis with three observations:
1. "Your energy this week:" — 1 sentence about the overall energy pattern
2. "Your recurring theme:" — 1 sentence naming the dominant insight or pattern
3. "Your subconscious is building toward:" — 1 sentence about the deeper identity shift underway

Rules:
- Constructive, forward-looking, never critical
- Grounded in what was actually shared — no fabrication
- Warm but concise — maximum 80 words total
- No preamble or labels — just the three observations as plain sentences`;

interface ChatRequest {
  action: 'chat';
  messages: ReflectionMessage[];
  energyLevel?: number;
}

interface SaveRequest {
  action: 'save';
  messages: ReflectionMessage[];
  energyLevel?: number;
  notes?: string;
  aiSummary?: string;
}

interface SynthesisRequest {
  action: 'weekly_synthesis';
  summaries: string[];
}

type ReflectionRequest = ChatRequest | SaveRequest | SynthesisRequest;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 503 });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as ReflectionRequest;

    // ─── Chat action ─────────────────────────────────────────────────────────
    if (body.action === 'chat') {
      const reply = await generateConversationReply(
        body.messages,
        REFLECTION_SYSTEM_PROMPT,
        apiKey,
        { maxTokens: 200, temperature: 0.75 }
      );

      const readyToSummarize = reply.includes('[READY_TO_SUMMARIZE]');
      const cleanReply = reply.replace('[READY_TO_SUMMARIZE]', '').trim();

      // Auto-extract summary if the flag is present
      let aiSummary: string | null = null;
      if (readyToSummarize) {
        const summaryMessages: ReflectionMessage[] = [
          ...body.messages,
          { role: 'assistant', content: cleanReply },
          {
            role: 'user',
            content: 'Please give me the "I noticed..." summary now.',
          },
        ];
        try {
          aiSummary = await generateConversationReply(
            summaryMessages,
            REFLECTION_SYSTEM_PROMPT,
            apiKey,
            { maxTokens: 120, temperature: 0.5 }
          );
        } catch {
          // Non-fatal — summary can be null
        }
      }

      return NextResponse.json({ reply: cleanReply, readyToSummarize, aiSummary });
    }

    // ─── Save action ─────────────────────────────────────────────────────────
    if (body.action === 'save') {
      const progressService = createProgressService(supabase);
      const result = await progressService.saveReflectionEntry({
        energyLevel: body.energyLevel,
        notes: body.notes,
        messages: body.messages,
        aiSummary: body.aiSummary,
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ entry: result.data });
    }

    // ─── Weekly synthesis action ──────────────────────────────────────────────
    if (body.action === 'weekly_synthesis') {
      if (!body.summaries || body.summaries.length === 0) {
        return NextResponse.json({ synthesis: null });
      }

      const userContent = body.summaries
        .map((s, i) => `Day ${i + 1}: ${s}`)
        .join('\n');

      const synthesis = await generateConversationReply(
        [{ role: 'user', content: userContent }],
        WEEKLY_SYNTHESIS_PROMPT,
        apiKey,
        { maxTokens: 200, temperature: 0.6 }
      );

      return NextResponse.json({ synthesis });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[reflection]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
