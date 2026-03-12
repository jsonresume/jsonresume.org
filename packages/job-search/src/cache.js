import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const CACHE_DIR = join(homedir(), '.jsonresume', 'cache');
const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours

function ensureDir() {
  try {
    mkdirSync(CACHE_DIR, { recursive: true });
  } catch {}
}

function cacheKey(params) {
  const parts = [`jobs_${params.days || 30}_${params.top || 100}`];
  if (params.searchId) parts.push(`s_${params.searchId.slice(0, 8)}`);
  if (params.mode) parts.push(params.mode);
  return parts.join('_') + '.json';
}

export function getCached(params) {
  try {
    const file = join(CACHE_DIR, cacheKey(params));
    const raw = readFileSync(file, 'utf-8');
    const { timestamp, data } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL) return data;
  } catch {}
  return null;
}

export function setCache(params, data) {
  try {
    ensureDir();
    const file = join(CACHE_DIR, cacheKey(params));
    writeFileSync(file, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {}
}

export function updateCachedJob(params, jobId, updates) {
  try {
    const file = join(CACHE_DIR, cacheKey(params));
    const raw = readFileSync(file, 'utf-8');
    const cache = JSON.parse(raw);
    cache.data = cache.data.map((j) =>
      j.id === jobId ? { ...j, ...updates } : j
    );
    writeFileSync(file, JSON.stringify(cache));
  } catch {}
}
