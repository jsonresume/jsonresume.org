import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const DIR = join(homedir(), '.jsonresume');
const FILE = join(DIR, 'last-seen-jobs.json');

function ensureDir() {
  try {
    mkdirSync(DIR, { recursive: true });
  } catch {}
}

/**
 * Job ids seen on the previous visit, as a Set of strings.
 * Used to compute the "N new since last visit" header digest.
 */
export function loadLastSeenIds() {
  try {
    const raw = JSON.parse(readFileSync(FILE, 'utf-8'));
    return new Set((raw.ids || []).map(String));
  } catch {
    return new Set();
  }
}

/** Persist the ids visible this session for the next visit's digest. */
export function saveLastSeenIds(ids) {
  ensureDir();
  writeFileSync(
    FILE,
    JSON.stringify(
      { ids: [...ids].map(String), updatedAt: new Date().toISOString() },
      null,
      2
    )
  );
}
