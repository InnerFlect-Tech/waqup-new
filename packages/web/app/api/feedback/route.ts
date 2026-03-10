import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES = ['bug', 'feature', 'content', 'billing', 'general'] as const;

interface FeedbackPayload {
  message?: string;
  category?: string;
  platform?: string;
  browser?: string;
  os?: string;
  viewport?: string;
  url?: string;
  device?: string;
}

async function createClickUpTask(payload: {
  message: string;
  category: string;
  userId: string | null;
  context: Record<string, string | undefined>;
  submittedAt: string;
}) {
  const apiKey = process.env.CLICKUP_API_KEY;
  const listId = process.env.CLICKUP_FEEDBACK_LIST_ID;

  if (!apiKey || !listId) {
    return;
  }

  const name = `[${payload.category}] ${payload.message.slice(0, 50)}${payload.message.length > 50 ? '…' : ''}`;

  const descriptionLines = [
    '## Feedback',
    '',
    payload.message,
    '',
    '---',
    `**Platform**: ${payload.context.platform ?? '—'}`,
    `**Browser**: ${payload.context.browser ?? '—'}`,
    `**OS**: ${payload.context.os ?? '—'}`,
    `**Viewport**: ${payload.context.viewport ?? '—'}`,
    `**URL**: ${payload.context.url ?? '—'}`,
    `**Device**: ${payload.context.device ?? '—'}`,
    `**User ID**: ${payload.userId ?? 'anonymous'}`,
    `**Submitted**: ${payload.submittedAt}`,
  ];

  const description = descriptionLines.join('\n');

  try {
    const res = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('[feedback] ClickUp create task failed:', res.status, text);
    }
  } catch (err) {
    console.error('[feedback] ClickUp request error:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FeedbackPayload;
    const {
      message,
      category = 'general',
      platform,
      browser,
      os,
      viewport,
      url,
      device,
    } = body;

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json({ error: 'Message is required (minimum 5 characters).' }, { status: 400 });
    }

    const categoryVal = VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])
      ? category
      : 'general';

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const context = { platform, browser, os, viewport, url, device };
    const contextJson = Object.fromEntries(
      Object.entries(context).filter(([, v]) => v != null && v !== '')
    );

    const { error } = await supabase.from('feedback').insert({
      user_id: user?.id ?? null,
      message: message.trim(),
      category: categoryVal,
      context: Object.keys(contextJson).length > 0 ? contextJson : null,
    });

    if (error) {
      console.error('[feedback] insert error:', error.message);
      return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 });
    }

    const submittedAt = new Date().toISOString();
    await createClickUpTask({
      message: message.trim(),
      category: categoryVal,
      userId: user?.id ?? null,
      context,
      submittedAt,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[feedback] route error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
