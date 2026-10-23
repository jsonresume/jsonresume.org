import type { MiddlewareHandler } from 'hono';

const SAFE = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Refuse cross-site writes: a POST, PUT or DELETE under `prefix` must come
 * from a page on this host (its Origin header says so). With SameSite=Lax
 * session cookies this closes CSRF. `exempt` paths take anyone's requests
 * (resume page beacons, which carry no authority).
 */
export function sameOrigin(
  prefix: string,
  exempt: ReadonlyArray<string> = []
): MiddlewareHandler {
  return async (c, next) => {
    const path = c.req.path;
    if (
      SAFE.has(c.req.method) ||
      !path.startsWith(prefix) ||
      exempt.some((p) => path.startsWith(p))
    ) {
      return next();
    }
    const origin = c.req.header('origin');
    const host = c.req.header('host');
    if (!origin || !host || new URL(origin).host !== host) {
      return c.json({ error: 'Cross-site request refused' }, 403);
    }
    return next();
  };
}
