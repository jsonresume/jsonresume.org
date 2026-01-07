/**
 * Generate a simple hash from a resume object for cache invalidation
 * Uses djb2 algorithm - fast and good distribution for string hashing
 */
export function hashResume(resume) {
  if (!resume) return null;

  const str = JSON.stringify(resume);
  let hash = 5381;

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }

  // Convert to unsigned 32-bit integer and then to hex string
  return (hash >>> 0).toString(16);
}

const CACHE_KEY = 'pathways_graph_cache';

/**
 * Get cached graph data if resume hash matches
 */
export function getCachedGraphData(currentResumeHash) {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const { resumeHash, data, timestamp } = JSON.parse(cached);

    // Invalidate cache if resume changed
    if (resumeHash !== currentResumeHash) {
      return null;
    }

    // Invalidate cache if older than 1 hour (jobs data may change)
    const ONE_HOUR = 60 * 60 * 1000;
    if (Date.now() - timestamp > ONE_HOUR) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Store graph data in cache with resume hash
 */
export function setCachedGraphData(resumeHash, data) {
  if (typeof window === 'undefined') return;

  try {
    const cacheEntry = {
      resumeHash,
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));
  } catch {
    // localStorage may be full or disabled - silently fail
  }
}

/**
 * Clear the graph cache (useful when user wants to force refresh)
 */
export function clearGraphCache() {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // Silently fail
  }
}
