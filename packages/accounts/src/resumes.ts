import { InvalidResume, VersionNotFound } from '@repo/api';
import {
  isRealResume,
  ResumeVersions,
  sectionCount,
  type Actor,
  type SaveOutcome,
} from '@repo/resume-versions';
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

/**
 * Saving a resume, and choosing where the page reads it from. Every save
 * is a version (@repo/resume-versions) with who made it, written in the
 * same transaction as the copy it saves.
 */
export const resumeSaving = (gist: Effect.Success<typeof gistSync>) =>
  Effect.gen(function* () {
    const store = yield* AccountStore;
    const versions = yield* ResumeVersions;
    const listener = yield* Effect.serviceOption(ResumeSaved);

    const save = Effect.fn('Accounts.save')(function* (
      userId: string,
      resume: unknown,
      actor: Actor,
      note: string | null
    ) {
      if (!Predicate.isObject(resume) || Array.isArray(resume)) {
        return yield* new InvalidResume({
          message: 'A resume is one JSON object, starting with {.',
        });
      }
      const account = yield* store.account(userId);
      const record = versions.record(userId, resume, actor, note);
      // A gist that feeds the page stays the source of truth: write to it,
      // then keep what we wrote as its copy here and as a version.
      const recorded =
        account?.source === 'gist' && account.user.githubLogin
          ? yield* gist.writeGist(userId, resume).pipe(
              Effect.flatMap((saved) =>
                versions.inTransaction(
                  store
                    .saveMirrorFor(userId, {
                      githubId: saved.ownerId,
                      gistId: saved.gistId,
                      resume,
                    })
                    .pipe(Effect.andThen(record))
                )
              )
            )
          : yield* versions.inTransaction(
              store
                .saveStoredResume(userId, resume)
                .pipe(Effect.andThen(record))
            );
      if (Option.isSome(listener)) yield* listener.value.saved(userId, resume);
      const outcome: SaveOutcome = {
        version: recorded?.version ?? null,
        // Version 1 of an account that had no resume before it.
        first:
          recorded?.version === 1 &&
          !account?.hasStoredResume &&
          !account?.hasMirror,
        real: isRealResume(resume),
        sections: sectionCount(resume),
      };
      return outcome;
    });

    /** Save as `actor`: the user, an app, an assistant. */
    const saveResume = (userId: string, resume: unknown, actor: Actor) =>
      save(userId, resume, actor, null);

    /**
     * Saves an old version's JSON again, as a new version (actor_kind
     * restore, by `by`'s id and name): history is never rewritten.
     */
    const restoreVersion = Effect.fn('Accounts.restoreVersion')(function* (
      userId: string,
      version: number,
      by: Actor
    ) {
      const found = yield* versions.get(userId, version);
      if (!found) return yield* new VersionNotFound();
      const restore: Actor = { kind: 'restore', id: by.id, name: by.name };
      return yield* save(
        userId,
        found.resume,
        restore,
        `Restored version ${version}`
      );
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

    return { saveResume, restoreVersion, setSource };
  });
