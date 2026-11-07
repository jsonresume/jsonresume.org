import { Predicate } from 'effect';
import type { Json } from '../values';

/**
 * A resume made on /start before its owner has an account, kept in this
 * browser through sign-up; the editor saves it as the account's first
 * version. A convenience: storage can be unavailable or cleared.
 */
export interface StartDraft {
  resume: Json;
  at: number;
}

const KEY = 'jr-start-draft';

/** Drafts older than this are left, not saved: they may be someone else's. */
const FRESH_MS = 24 * 60 * 60 * 1000;

export function writeStartDraft(resume: Json) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ resume, at: Date.now() }));
  } catch {
    // Storage blocked: sign-up still works, the editor just opens empty.
  }
}

export function readStartDraft(now = Date.now()): StartDraft | undefined {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : undefined;
    if (
      !Predicate.isObject(parsed) ||
      !Predicate.isObject(parsed['resume']) ||
      !Predicate.isNumber(parsed['at']) ||
      now - parsed['at'] > FRESH_MS
    )
      return undefined;
    return { resume: parsed['resume'], at: parsed['at'] };
  } catch {
    return undefined;
  }
}

export function clearStartDraft() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
