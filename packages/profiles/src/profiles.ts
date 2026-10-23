import { Clock, Context, Duration, Effect, Layer } from 'effect';
import type { ResumeError } from './errors';
import { GithubGists, type GistResume } from './github';
import { ProfileStore } from './store';
import type { Username } from './username';

export const RESUME_FILE = 'resume.json';

/** How long a ghost's copy is served before GitHub is asked again. */
export const GHOST_TTL = Duration.seconds(60);

export interface ResolvedResume {
  username: Username;
  resume: unknown;
  /** Where it came from: a ghost (mirrored gist) or another gist file, live. */
  source: 'ghost' | 'gist';
  /** True when GitHub was unreachable and the last copy was served. */
  stale: boolean;
}

/**
 * Resolves /@username to a resume (docs/ACCOUNTS_AND_USERNAMES.md). Today
 * that is a ghost: the user's resume.json gist, refreshed after GHOST_TTL,
 * removed when GitHub says it is gone, and served stale when GitHub is down.
 * Accounts will be looked up first, once they exist.
 */
export class Profiles extends Context.Service<
  Profiles,
  {
    resume(
      username: Username,
      options?: { file?: string }
    ): Effect.Effect<ResolvedResume, ResumeError>;
  }
>()('@repo/profiles/Profiles') {
  static readonly layer = Layer.effect(
    Profiles,
    Effect.gen(function* () {
      const github = yield* GithubGists;
      const store = yield* ProfileStore;

      const save = (username: Username, found: GistResume) =>
        Effect.gen(function* () {
          const now = yield* Clock.currentTimeMillis;
          yield* store.saveGhost({
            username,
            githubId: found.githubId,
            gistId: found.gistId,
            resume: found.resume,
            fetchedAt: new Date(now),
          });
          return {
            username,
            resume: found.resume,
            source: 'ghost',
            stale: false,
          } as const;
        });

      const ghost = Effect.fn('Profiles.ghost')(function* (username: Username) {
        const known = yield* store.findGhost(username);
        const now = yield* Clock.currentTimeMillis;
        if (
          known &&
          now - known.fetchedAt.getTime() < Duration.toMillis(GHOST_TTL)
        ) {
          return {
            username,
            resume: known.resume,
            source: 'ghost',
            stale: false,
          } as const;
        }
        // A known gist is one request; if it moved or went, search again.
        const lookup = known
          ? github
              .read(username, known.gistId, RESUME_FILE)
              .pipe(
                Effect.catchTag('ProfileNotFound', () =>
                  github.find(username, RESUME_FILE)
                )
              )
          : github.find(username, RESUME_FILE);
        return yield* lookup.pipe(
          Effect.flatMap((found) => save(username, found)),
          Effect.tapError((error) =>
            error._tag === 'ProfileNotFound' && known
              ? store.removeGhost(username)
              : Effect.void
          ),
          Effect.catchTag('GithubUnavailable', (error) =>
            known
              ? Effect.as(
                  Effect.logWarning(
                    'GitHub unavailable; serving the last copy',
                    { username }
                  ),
                  {
                    username,
                    resume: known.resume,
                    source: 'ghost',
                    stale: true,
                  } as const
                )
              : Effect.fail(error)
          )
        );
      });

      const resume = Effect.fn('Profiles.resume')(function* (
        username: Username,
        options?: { file?: string }
      ) {
        const file = options?.file;
        if (file === undefined || file === RESUME_FILE)
          return yield* ghost(username);
        // Other gist files (?gistname=) are read live and not kept.
        const found = yield* github.find(username, file);
        return {
          username,
          resume: found.resume,
          source: 'gist',
          stale: false,
        } as const;
      });

      return Profiles.of({ resume });
    })
  );
}
