/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach per IP.
 */

const windowMs = 60_000; // 1 minute
const maxRequests = 30; // 30 requests per minute per IP

const ipRequestMap = new Map();

// Periodically clean up expired entries (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of ipRequestMap) {
    const valid = timestamps.filter((t) => now - t < windowMs);
    if (valid.length === 0) {
      ipRequestMap.delete(ip);
    } else {
      ipRequestMap.set(ip, valid);
    }
  }
}, 300_000);

/**
 * Check rate limit for an IP address.
 * @returns {{ limited: boolean, remaining: number }} rate limit status
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  const timestamps = ipRequestMap.get(ip) || [];

  // Remove expired timestamps
  const valid = timestamps.filter((t) => now - t < windowMs);
  valid.push(now);
  ipRequestMap.set(ip, valid);

  return {
    limited: valid.length > maxRequests,
    remaining: Math.max(0, maxRequests - valid.length),
  };
}

/**
 * Returns a 429 response if rate limited, or null if allowed.
 */
export function rateLimitResponse(request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const { limited, remaining } = checkRateLimit(ip);

  if (limited) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
          'X-RateLimit-Remaining': String(remaining),
        },
      }
    );
  }

  return null;
}
