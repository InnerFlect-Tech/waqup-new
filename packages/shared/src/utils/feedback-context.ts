/**
 * Feedback context — device, browser, OS, URL for feedback forms.
 * Use getFeedbackContext() from web (browser) or pass env from mobile.
 */

export interface FeedbackContext {
  platform?: string;  // 'web' | 'ios' | 'android'
  browser?: string;
  os?: string;
  viewport?: string;
  url?: string;
  device?: string;
}

/** Environment snapshot from browser (pass from web) or mobile. */
export interface FeedbackEnv {
  userAgent: string;
  vendor?: string;
  href?: string;
  innerWidth?: number;
  innerHeight?: number;
}

function detectBrowser(ua: string, vendor: string): string {
  if (/Edg\//.test(ua)) return 'Edge';
  if (/Chrome\//.test(ua) && /Google Inc/.test(vendor)) return 'Chrome';
  if (/Safari\//.test(ua) && /Apple/.test(vendor) && !/Chrome/.test(ua)) return 'Safari';
  if (/Firefox\//.test(ua)) return 'Firefox';
  const match = ua.match(/(Chrome|Safari|Firefox|Edge|Opera|OPR)\/[\d.]+/);
  return match ? match[1].replace('OPR', 'Opera') : 'Unknown';
}

function detectOS(ua: string): string {
  if (/iPhone|iPad|iPod/.test(ua)) {
    const match = ua.match(/OS (\d+[_.]\d+)/);
    return match ? `iOS ${match[1].replace('_', '.')}` : 'iOS';
  }
  if (/Android/.test(ua)) {
    const match = ua.match(/Android (\d+[.\d]*)/);
    return match ? `Android ${match[1]}` : 'Android';
  }
  if (/Mac OS X/.test(ua)) {
    const match = ua.match(/Mac OS X (\d+[_.]\d+)/);
    return match ? `macOS ${match[1].replace('_', '.')}` : 'macOS';
  }
  if (/Windows/.test(ua)) return 'Windows';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Unknown';
}

function detectPlatform(ua: string): 'web' | 'ios' | 'android' {
  if (/iPhone|iPad|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'web';
}

/**
 * Build feedback context from environment snapshot.
 * Call from web with getBrowserFeedbackEnv() and from mobile with Platform.OS etc.
 */
export function buildFeedbackContext(
  env: FeedbackEnv | null,
  overrides?: Partial<FeedbackContext>
): FeedbackContext {
  const result: FeedbackContext = { ...overrides };

  if (!env?.userAgent) {
    return result;
  }

  const ua = env.userAgent;
  const vendor = env.vendor ?? '';

  if (!overrides?.platform) {
    result.platform = detectPlatform(ua);
  }
  if (!overrides?.browser) {
    result.browser = detectBrowser(ua, vendor);
  }
  if (!overrides?.os) {
    result.os = detectOS(ua);
  }
  if (!overrides?.viewport && env.innerWidth != null) {
    result.viewport = `${env.innerWidth}x${env.innerHeight ?? 0}`;
  }
  if (!overrides?.url && env.href) {
    result.url = env.href;
  }

  return result;
}
