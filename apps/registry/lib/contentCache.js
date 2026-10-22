import { createHash } from 'crypto';
import { getCache } from '@vercel/functions';
import logger from './logger';

const runtimeCache = (namespace) => {
  try {
    return getCache({ namespace });
  } catch {
    return null;
  }
};

/**
 * Memoize an expensive result (LLM output, embeddings) in Vercel's Runtime
 * Cache, keyed by a hash of `input`. Callers include whatever the result
 * depends on (resume content, prompt version), so changed input recomputes.
 * Cache failures are logged and never block `compute`. Falls back to an
 * in-memory cache outside Vercel.
 *
 * @param {string} namespace - Cache namespace, e.g. 'agent-spec'
 * @param {unknown} input - JSON-serializable value the result depends on
 * @param {() => Promise<unknown>} compute - Produces the value on a miss
 * @param {{ ttl?: number, name?: string }} [options] - ttl in seconds
 */
export async function cachedByContent(namespace, input, compute, options = {}) {
  const cache = runtimeCache(namespace);
  const key = createHash('sha256').update(JSON.stringify(input)).digest('hex');

  const hit = await cache?.get(key).catch((error) => {
    logger.warn({ error: error.message, namespace }, 'Cache read failed');
    return null;
  });
  if (hit !== null && hit !== undefined) return hit;

  const value = await compute();
  await cache
    ?.set(key, value, { ttl: options.ttl, name: options.name })
    .catch((error) =>
      logger.warn({ error: error.message, namespace }, 'Cache write failed')
    );
  return value;
}
