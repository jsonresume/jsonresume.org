import { candidateText, type RunOptions } from '@repo/jobs';
import { Duration, Effect, Fiber } from 'effect';
import { createHash } from 'node:crypto';
import { resumeKey } from './resumeEntries';

/** How long after a save to start: a burst of saves settles on its last. */
export const SETTLE = Duration.seconds(25);

/** Why the work is wanted: a save (settles first) or the dashboard opening. */
export type PrepareReason = 'saved' | 'opened';

/** One version's model work as the models see it: its reading and its fits. */
const versionOf = (resume: unknown) =>
  createHash('sha256')
    .update(`${resumeKey(resume)}\n${candidateText(resume)}`)
    .digest('hex');

interface Slot {
  version: string;
  fiber?: Fiber.Fiber<void>;
}

/**
 * Getting a resume version's model work done before anyone asks, at most
 * one run per user. A save replaces the user's pending or running work for
 * another version (interrupting its model calls) and starts after SETTLE;
 * the same version saved again changes nothing. The dashboard opening
 * starts work at once, only when the user has none pending; for a version
 * already read and judged that is a few lookups. Requests for the graph
 * join the same runs, by content hash, so nothing is read twice.
 */
export const preparer = (
  models: (
    userId: string,
    resume: unknown,
    options: RunOptions
  ) => Effect.Effect<unknown>
) => {
  const slots = new Map<string, Slot>();

  return Effect.fn('Careers.prepare')(function* (
    userId: string,
    resume: unknown,
    reason: PrepareReason
  ) {
    const version = versionOf(resume);
    const held = slots.get(userId);
    if (held && (held.version === version || reason === 'opened')) return;
    const slot: Slot = { version };
    slots.set(userId, slot);
    const current = () => slots.get(userId) === slot;
    const run = Effect.gen(function* () {
      if (held?.fiber) yield* Fiber.interrupt(held.fiber);
      if (reason === 'saved') yield* Effect.sleep(SETTLE);
      // Replaced while settling: the newer save does the work.
      if (!current()) return;
      // Owned, so a newer save's interrupt stops these model calls too.
      yield* models(userId, resume, { wait: Duration.infinity, owned: true });
    }).pipe(
      Effect.catchDefect((defect) =>
        Effect.logWarning('Career prepare failed', { defect: String(defect) })
      ),
      Effect.ensuring(
        Effect.sync(() => {
          if (current()) slots.delete(userId);
        })
      )
    );
    slot.fiber = yield* Effect.forkDetach(run);
  });
};
