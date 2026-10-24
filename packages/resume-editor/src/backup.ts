import { useEffect, useState } from 'react';
import type { Json } from './values';

/**
 * Unsaved edits, kept in this browser so a closed tab or a crash doesn't
 * lose them. A convenience only: storage can be unavailable or cleared.
 */
export interface Backup {
  resume: Json;
  at: number;
}

const key = (username: string) => `jr-editor-draft:${username}`;

export function readBackup(username: string): Backup | undefined {
  try {
    const raw = localStorage.getItem(key(username));
    const parsed: unknown = raw ? JSON.parse(raw) : undefined;
    return typeof parsed === 'object' &&
      parsed !== null &&
      'resume' in parsed &&
      'at' in parsed &&
      typeof parsed.at === 'number'
      ? { resume: parsed.resume, at: parsed.at }
      : undefined;
  } catch {
    return undefined;
  }
}

export function clearBackup(username: string) {
  try {
    localStorage.removeItem(key(username));
  } catch {
    // Nothing to clear.
  }
}

/** Keep the draft while there are unsaved changes, a second after each edit. */
export function useBackup(username: string, resume: Json, dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          key(username),
          JSON.stringify({ resume, at: Date.now() })
        );
      } catch {
        // Storage full or blocked: the backup is a convenience.
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [username, resume, dirty]);
}

/** True from lg up, after hydration; false on the server. */
export function useWide(query: string) {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const list = window.matchMedia(query);
    setWide(list.matches);
    const change = () => setWide(list.matches);
    list.addEventListener('change', change);
    return () => list.removeEventListener('change', change);
  }, [query]);
  return wide;
}
