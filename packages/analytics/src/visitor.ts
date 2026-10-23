import { Redacted } from 'effect';
import { createHmac } from 'node:crypto';

const BOT =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|curl|wget|python|httpclient|monitor/i;

export const isBot = (userAgent: string) =>
  userAgent === '' || BOT.test(userAgent);

/** desktop, mobile or tablet, from the user agent; and viewport width when sent. */
export function device(
  userAgent: string,
  width?: number
): 'desktop' | 'mobile' | 'tablet' {
  if (/ipad|tablet|kindle|silk/i.test(userAgent)) return 'tablet';
  if (/mobi|iphone|ipod|android/i.test(userAgent)) return 'mobile';
  if (width !== undefined && width < 768) return 'mobile';
  return 'desktop';
}

export function browser(userAgent: string): string {
  if (/edg\//i.test(userAgent)) return 'Edge';
  if (/opr\/|opera/i.test(userAgent)) return 'Opera';
  if (/firefox|fxios/i.test(userAgent)) return 'Firefox';
  if (/chrome|crios|chromium/i.test(userAgent)) return 'Chrome';
  if (/safari/i.test(userAgent)) return 'Safari';
  return 'Other';
}

/**
 * Where a reader came from, as a host ("linkedin.com"), or null for direct
 * visits and links from this site itself.
 */
export function referrerHost(
  referrer: string | null,
  siteHost: string
): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase();
    if (host === '' || host === siteHost.replace(/^www\./, '')) return null;
    return host;
  } catch {
    return null;
  }
}

/**
 * The same person on the same day, without knowing who: a hash of the day,
 * address, browser and resume under a server secret. Tomorrow it changes,
 * and the address itself is never stored.
 */
export function visitorId(
  secret: Redacted.Redacted,
  parts: { day: string; address: string; userAgent: string; username: string }
): string {
  return createHmac('sha256', Redacted.value(secret))
    .update(
      [parts.day, parts.address, parts.userAgent, parts.username].join('\n')
    )
    .digest('hex')
    .slice(0, 32);
}
