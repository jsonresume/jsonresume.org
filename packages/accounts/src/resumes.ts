import { InvalidResume } from '@repo/api';
import { Context, Effect, Option, Predicate } from 'effect';
import type { gistSync } from './gistSync';
import { AccountStore } from './store';

/**
 * Told of every resume saved, by any route (the dashboard, the API, OAuth
 * apps, MCP, the gist it is written to), to start work on it before anyone
 * asks: the career graph's readings. Optional; it must return at once.
 */
export class ResumeSaved extends Context.Service<
  ResumeSaved,
  { saved(userId: string, resume: unknown): Effect.Effect<void> }
>()('@repo/accounts/ResumeSaved') {}

/** Saving a resume, and choosing where the page reads it from. */
export const resumeSaving = (gist: Effect.Success<typeof gistSync>) =>
  Effect.gen(function* () {
    const store = yield* AccountStore;
    const listener = yield* Effect.serviceOption(ResumeSaved);

    const saveResume = Effect.fn('Accounts.saveResume')(function* (
      userId: string,
      resume: unknown
    ) {
      if (!Predicate.isObject(resume) || Array.isArray(resume)) {
        return yield* new InvalidResume({
          message: 'A resume is one JSON object, starting with {.',
        });
      }
      // A gist that feeds the page stays the source of truth: write to it.
      const account = yield* store.account(userId);
      if (account?.source === 'gist' && account.user.githubLogin) {
        yield* gist.saveToGist(userId, resume);
      } else {
        yield* store.saveStoredResume(userId, resume);
      }
      if (Option.isSome(listener)) yield* listener.value.saved(userId, resume);
    });

    const setSource = Effect.fn('Accounts.setSource')(function* (
      userId: string,
      source: 'gist' | 'stored'
    ) {
      const account = yield* store.account(userId);
      if (source === 'gist' && !account?.user.githubLogin) {
        return yield* new InvalidResume({
          message: 'Link GitHub first to use your gist.',
        });
      }
      if (source === 'stored' && !account?.hasStoredResume) {
        return yield* new InvalidResume({ message: 'Upload a resume first.' });
      }
      yield* store.setSource(userId, source);
    });

    return { saveResume, setSource };
  });
