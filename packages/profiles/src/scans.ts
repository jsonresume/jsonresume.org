import { Duration } from 'effect';

/**
 * A full scan that found no gist is trusted as a starting point for this
 * long: later lookups only ask GitHub for gists updated since then.
 */
export const SCAN_TRUST = Duration.days(7);

/** Clocks differ; ask for a little more than strictly needed. */
const SKEW = Duration.minutes(5);

/** Most logins remembered; the oldest is forgotten first. */
const MAX_SCANS = 20_000;

/**
 * When each login's gists were last read in full without finding the file.
 * A resume gist made or renamed since is updated since, so a re-check only
 * needs `?since=`: one request, usually an empty list, instead of a page
 * per hundred gists.
 */
export const makeScans = () => {
  const scans = new Map<string, number>();
  const keyOf = (login: string, file: string) =>
    `${login.toLowerCase()}/${file}`;

  return {
    /** The `since` to ask with, if a full scan is recent enough to build on. */
    since(login: string, file: string, now: number): string | undefined {
      const at = scans.get(keyOf(login, file));
      if (at === undefined || now - at > Duration.toMillis(SCAN_TRUST))
        return undefined;
      return new Date(at - Duration.toMillis(SKEW)).toISOString();
    },
    /** Every gist was read at `at` and none had the file. */
    noGist(login: string, file: string, at: number) {
      const key = keyOf(login, file);
      scans.delete(key);
      scans.set(key, at);
      if (scans.size > MAX_SCANS) {
        const [oldest] = scans.keys();
        if (oldest !== undefined) scans.delete(oldest);
      }
    },
    /** The file was found (or the scan can't be trusted): start over. */
    forget(login: string, file: string) {
      scans.delete(keyOf(login, file));
    },
  };
};
