/**
 * Meta (Facebook / Instagram) Webhook handler.
 *
 * Handles:
 * - GET: Verification request (Meta sends hub.mode, hub.challenge, hub.verify_token)
 * - POST: Event notifications (comments, mentions, story_insights, etc.)
 *
 * Env vars:
 *   META_WEBHOOK_VERIFY_TOKEN — Token you set in Meta Dashboard; must match hub.verify_token
 *   META_APP_SECRET — App Secret from Meta Dashboard; used to validate X-Hub-Signature-256
 *
 * Configure in Meta: developers.facebook.com → Your App → Use cases → Instagram (or Page) → Webhooks
 *   Callback URL: https://your-domain.com/api/webhooks/meta
 *   Verify Token: same value as META_WEBHOOK_VERIFY_TOKEN
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Meta webhook verification (GET) */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;

  if (mode !== 'subscribe') {
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
  }

  if (!verifyToken || token !== verifyToken) {
    return NextResponse.json({ error: 'Invalid verify token' }, { status: 403 });
  }

  if (!challenge) {
    return NextResponse.json({ error: 'Missing challenge' }, { status: 400 });
  }

  return new NextResponse(challenge, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  });
}

/** Meta webhook event notifications (POST) */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const appSecret = process.env.META_APP_SECRET;
  const rawBody = await req.text();

  // Validate signature if app secret is configured
  if (appSecret) {
    const signature = req.headers.get('x-hub-signature-256');
    if (!signature || !signature.startsWith('sha256=')) {
      console.error('[meta/webhook] Missing or invalid X-Hub-Signature-256');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const expectedSig = signature.slice(7);
    const computedSig = crypto
      .createHmac('sha256', appSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSig !== computedSig) {
      console.error('[meta/webhook] Signature mismatch');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Meta formats: { object, entry } or array of such objects (Instagram)
  const payloads = Array.isArray(parsed) ? parsed : [parsed];

  for (const payload of payloads) {
    const p = payload as MetaWebhookPayload;
    const object = p.object ?? (p as { hub?: { object?: string } }).hub?.object;

    if (object === 'page' || object === 'instagram' || object === 'user') {
      const entry = p.entry ?? (p as { entry?: MetaWebhookEntry[] }).entry;
      if (Array.isArray(entry)) {
        for (const item of entry) {
          console.log(`[meta/webhook] ${object} event:`, JSON.stringify(item, null, 2));
        }
      }
    } else {
      console.log('[meta/webhook] Received:', object ?? 'unknown');
    }
  }

  return NextResponse.json({ received: true });
}

type MetaWebhookPayload = {
  object?: string;
  entry?: MetaWebhookEntry[];
};

type MetaWebhookEntry = {
  id?: string;
  time?: number;
  changes?: Array<{ field: string; value?: unknown }>;
};
