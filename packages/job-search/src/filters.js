import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const DIR = join(homedir(), '.jsonresume');
const FILE = join(DIR, 'filters.json');

function ensureDir() {
  try {
    mkdirSync(DIR, { recursive: true });
  } catch {}
}

/**
 * Filter state shape:
 * {
 *   default: { active: [] },          // filters for default resume search
 *   searches: {
 *     "<search-id>": { active: [] },  // filters per saved search
 *   }
 * }
 */
export function loadFilters() {
  try {
    const raw = JSON.parse(readFileSync(FILE, 'utf-8'));
    // Migrate old format: { active: [] } → { default: { active: [] }, searches: {} }
    if (Array.isArray(raw.active)) {
      return { default: { active: raw.active }, searches: {} };
    }
    return {
      default: raw.default || { active: [] },
      searches: raw.searches || {},
    };
  } catch {
    return { default: { active: [] }, searches: {} };
  }
}

export function saveFilters(state) {
  ensureDir();
  writeFileSync(FILE, JSON.stringify(state, null, 2));
}

/** Get filters for a specific search (or default) */
export function getFiltersForSearch(state, searchId) {
  if (!searchId) return state.default?.active || [];
  return state.searches?.[searchId]?.active || [];
}

/** Set filters for a specific search (or default) */
export function setFiltersForSearch(state, searchId, active) {
  const next = { ...state, searches: { ...state.searches } };
  if (!searchId) {
    next.default = { active };
  } else {
    next.searches[searchId] = { active };
  }
  return next;
}
