import type { DecidedJob } from '@repo/api';
import { Effect } from 'effect';
import { digestEmail } from './email';
import { pickJobs } from './pick';
import { digestToken } from './token';

export interface DigestMail {
  to: string;
  subject: string;
  text: string;
  html: string;
  headers: Record<string, string>;
}

/** What a run needs, as plain functions, so it can be tested without a database. */
export interface DigestDeps {
  subscribers: Effect.Effect<
    ReadonlyArray<{ id: string; email: string }>,
    unknown
  >;
  resumeOf: (userId: string) => Effect.Effect<unknown, unknown>;
  decide: (
    userId: string,
    resume: unknown
  ) => Effect.Effect<ReadonlyArray<DecidedJob>, unknown>;
  sent: (userId: string) => Effect.Effect<ReadonlySet<number>, unknown>;
  send: (mail: DigestMail) => Effect.Effect<void, unknown>;
  record: (
    userId: string,
    jobIds: ReadonlyArray<number>
  ) => Effect.Effect<void, unknown>;
}

/**
 * One week's run: each subscriber with something new gets an email of it
 * (pickJobs), then those jobs are recorded as sent. A failure for one
 * person is logged and the rest still go.
 */
export const runDigests = (
  deps: DigestDeps,
  options: { now: Date; secret: string; site: string }
) =>
  Effect.gen(function* () {
    const { now, secret, site } = options;
    const one = (person: { id: string; email: string }) =>
      Effect.gen(function* () {
        const resume = yield* deps.resumeOf(person.id);
        if (resume === null) return 'empty' as const;
        const decided = yield* deps.decide(person.id, resume);
        const jobs = pickJobs(decided, yield* deps.sent(person.id), now);
        if (jobs.length === 0) return 'empty' as const;
        const query = `user=${encodeURIComponent(
          person.id
        )}&token=${digestToken(secret, person.id)}`;
        const email = digestEmail(
          jobs,
          site,
          `${site}/jobs/email/stop?${query}`
        );
        yield* deps.send({
          to: person.email,
          ...email,
          // One click in the mail app stops it (RFC 8058).
          headers: {
            'List-Unsubscribe': `<${site}/api/job-digest/stop?${query}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        });
        yield* deps.record(
          person.id,
          jobs.map((job) => job.id)
        );
        return 'sent' as const;
      });

    const people = yield* deps.subscribers;
    const counts = { subscribers: people.length, sent: 0, empty: 0, failed: 0 };
    for (const person of people) {
      const outcome = yield* one(person).pipe(
        Effect.catchCause((cause) =>
          Effect.as(
            Effect.logError('Job digest failed for one person', {
              userId: person.id,
              cause: String(cause),
            }),
            'failed' as const
          )
        )
      );
      counts[outcome] += 1;
    }
    return counts;
  });
