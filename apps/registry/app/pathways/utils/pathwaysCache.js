/**
 * IndexedDB-based caching for Pathways data
 * Caches both embeddings and graph data keyed by resume hash
 */

const DB_NAME = 'pathways_cache';
const DB_VERSION = 1;
const STORE_NAME = 'cache';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

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

  return (hash >>> 0).toString(16);
}

let dbPromise = null;

function getDB() {
  if (typeof window === 'undefined') return Promise.resolve(null);

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
    });
  }

  return dbPromise;
}

async function getCacheEntry(key) {
  try {
    const db = await getDB();
    if (!db) return null;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        const entry = request.result;
        if (!entry) {
          resolve(null);
          return;
        }

        // Check TTL
        if (Date.now() - entry.timestamp > CACHE_TTL) {
          resolve(null);
          return;
        }

        resolve(entry.data);
      };

      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function setCacheEntry(key, data) {
  try {
    const db = await getDB();
    if (!db) return;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ key, data, timestamp: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // Silently fail
  }
}

/**
 * Get cached embedding for a resume hash
 */
export async function getCachedEmbedding(resumeHash) {
  return getCacheEntry(`embedding_${resumeHash}`);
}

/**
 * Store embedding in cache
 */
export async function setCachedEmbedding(resumeHash, embedding) {
  return setCacheEntry(`embedding_${resumeHash}`, embedding);
}

/**
 * Get cached graph data for a resume hash
 */
export async function getCachedGraphData(resumeHash) {
  return getCacheEntry(`graph_${resumeHash}`);
}

/**
 * Store graph data in cache
 */
export async function setCachedGraphData(resumeHash, data) {
  return setCacheEntry(`graph_${resumeHash}`, data);
}

/**
 * Clear all pathways cache
 */
export async function clearPathwaysCache() {
  try {
    const db = await getDB();
    if (!db) return;

    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // Silently fail
  }
}
