import { createHash } from 'crypto';

/** Entries kept per process; the oldest go first. */
const MAX_ENTRIES = 500;
const caches = new Map();

const cacheFor = (namespace) => {
  if (!caches.has(namespace)) caches.set(namespace, new Map());
  return caches.get(namespace);
};

/**
 * Memoize an expensive result (LLM output, embeddings) in memory, keyed by a
 * hash of `input`. Callers include whatever the result depends on (resume
 * content, prompt version), so changed input recomputes.
 *
 * @param {string} namespace - Cache namespace, e.g. 'agent-spec'
 * @param {unknown} input - JSON-serializable value the result depends on
 * @param {() => Promise<unknown>} compute - Produces the value on a miss
 * @param {{ ttl?: number }} [options] - ttl in seconds
 */
export async function cachedByContent(namespace, input, compute, options = {}) {
  const cache = cacheFor(namespace);
  const key = createHash('sha256').update(JSON.stringify(input)).digest('hex');

  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  cache.delete(key);

  const value = await compute();
  const ttlMs = (options.ttl ?? Infinity) * 1000;
  cache.set(key, { value, expires: Date.now() + ttlMs });
  if (cache.size > MAX_ENTRIES) cache.delete(cache.keys().next().value);
  return value;
}
