import type { EmailLinks, Mail } from '@repo/accounts';
import type { Overview } from '@repo/api';
import { Effect } from 'effect';
import { reportEmail } from './email';

/** At most this many reports a day, so a month's run fits any sending plan. */
export const DAILY_CAP = 60;

/**
 * The month whose report is due at `now`, as YYYY-MM: from 09:00 UTC on the
 * 1st through the 7th (catching up after downtime), else none.
 */
export const reportMonth = (now: Date): string | undefined => {
  const day = now.getUTCDate();
  if (day > 7 || (day === 1 && now.getUTCHours() < 9)) return undefined;
  return now.toISOString().slice(0, 7);
};

export interface Reader {
  userId: string;
  email: string;
  username: string;
  /** When the resume last changed, if known. */
  updated: Date | null;
}

/** A resume not changed in this long gets a word about it in the report. */
export const STALE_DAYS = 183;

/** What a run needs, as plain functions, so it is tested without a database. */
export interface ReportDeps {
  /** Accounts that want the report, had page views since `since`, and haven't got `kind`. */
  due: (
    kind: string,
    since: Date,
    limit: number
  ) => Effect.Effect<ReadonlyArray<Reader>>;
  /** How many `kind` reports went out since `since`. */
  sentSince: (kind: string, since: Date) => Effect.Effect<number>;
  overview: (username: string) => Effect.Effect<Overview>;
  /** Takes the send first (false: another server has it). */
  claim: (userId: string, kind: string) => Effect.Effect<boolean>;
  links: (userId: string) => EmailLinks;
  send: (mail: Mail) => Effect.Effect<void>;
}

/** Sends the reports due at `now`, within today's cap; how many went. */
export const runReports = (deps: ReportDeps, now: Date, site: string) =>
  Effect.gen(function* () {
    const month = reportMonth(now);
    if (!month) return 0;
    const kind = `report:${month}`;
    const today = new Date(now.toISOString().slice(0, 10));
    const room = DAILY_CAP - (yield* deps.sentSince(kind, today));
    if (room <= 0) return 0;
    const since = new Date(now.getTime() - 30 * 86_400_000);
    let sent = 0;
    for (const reader of yield* deps.due(kind, since, room)) {
      const overview = yield* deps.overview(reader.username);
      if (overview.totals.visitors === 0) continue;
      if (!(yield* deps.claim(reader.userId, kind))) continue;
      yield* deps.send(
        reportEmail(
          { to: reader.email, username: reader.username, site },
          overview,
          deps.links(reader.userId),
          reader.updated &&
            now.getTime() - reader.updated.getTime() > STALE_DAYS * 86_400_000
            ? reader.updated
            : undefined
        )
      );
      sent += 1;
    }
    return sent;
  });
