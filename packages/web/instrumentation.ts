/**
 * Runs once when the Next.js server starts.
 * Raises EventEmitter limit to avoid MaxListenersExceededWarning when many
 * concurrent requests hit dev (e.g. warmup batches of 12+).
 */
export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { EventEmitter } = require('events');
    EventEmitter.defaultMaxListeners = 20;
  }
}
