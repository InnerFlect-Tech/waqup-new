#!/usr/bin/env node
/**
 * Create a Stripe webhook endpoint for production and print the signing secret.
 * Run once per environment (e.g. production). Add the printed whsec_... to Vercel
 * as STRIPE_WEBHOOK_SECRET.
 *
 * Prerequisites:
 *   - STRIPE_SECRET_KEY and NEXT_PUBLIC_APP_URL in .env.local (or env)
 *   - Run from packages/web: npm run stripe:webhook:create
 *   - Or: node --env-file=.env.local scripts/create-stripe-webhook.mjs
 *
 * Uses the same events as packages/web/app/api/stripe/webhook/route.ts.
 */

import Stripe from 'stripe';

const EVENTS = [
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
];

const secretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
if (!secretKey) {
  console.error('Missing STRIPE_SECRET_KEY. Set it in .env.local or pass it when running.');
  process.exit(1);
}
if (!appUrl || appUrl === 'http://localhost:3000') {
  console.error('Set NEXT_PUBLIC_APP_URL to your production URL (e.g. https://waqup.app).');
  process.exit(1);
}

const webhookUrl = `${appUrl}/api/stripe/webhook`;

const stripe = new Stripe(secretKey, { apiVersion: '2026-02-25.clover' });

try {
  const endpoint = await stripe.webhookEndpoints.create({
    url: webhookUrl,
    enabled_events: EVENTS,
    description: 'waQup production webhook (created by scripts/create-stripe-webhook.mjs)',
  });
  console.log('Webhook endpoint created.');
  console.log('URL:', webhookUrl);
  console.log('ID:', endpoint.id);
  console.log('');
  console.log('Add this to Vercel (and .env.production) as STRIPE_WEBHOOK_SECRET:');
  console.log(endpoint.secret || '(no secret in response — use Dashboard → Webhooks → Reveal)');
} catch (err) {
  if (err.code === 'url_invalid' || err.message?.includes('url')) {
    console.error('Invalid webhook URL:', webhookUrl);
    console.error('Set NEXT_PUBLIC_APP_URL to your live site (e.g. https://waqup.app).');
  } else {
    console.error(err.message || err);
  }
  process.exit(1);
}
