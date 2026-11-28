import { Clock, Duration, Effect } from 'effect';
import type { ResumeError } from './errors';
import type { GithubGists, GistResume } from './github';
import type { GistMirror } from './store';

/** How long a gist copy is served before GitHub is asked again. */
export const GHOST_TTL = Duration.seconds(60);

/**
 * How long an older copy is still served at once, while GitHub is asked in
 * the background: the next visit sees the update. Older copies wait for
 * GitHub. Without this, nearly every visit (crawlers spread over thousands
 * of resumes) waited ~0.4s on GitHub.
 */
export const GHOST_STALE = Duration.days(7);

export interface Mirrored {
  resume: unknown;
  stale: boolean;
}

/**
 * The resume.json gist of a GitHub login, kept as a copy (a ghost's or an
 * account's). A known gist is one request; if it moved or went, search
 * again. `onGone` runs when GitHub says there is none; the copy covers
 * GitHub outages.
 */
export const makeMirrored = (github: GithubGists['Service'], file: string) => {
  const refreshing = new Set<string>();

  const toMirror = (found: GistResume) =>
    Effect.map(
      Clock.currentTimeMillis,
      (now): GistMirror => ({
        githubId: found.githubId,
        gistId: found.gistId,
        resume: found.resume,
        fetchedAt: new Date(now),
        ...(found.updatedAt ? { updatedAt: found.updatedAt } : {}),
      })
    );

  const fetch = (
    login: string,
    known: GistMirror | undefined,
    save: (mirror: GistMirror) => Effect.Effect<void>,
    onGone: Effect.Effect<void>
  ): Effect.Effect<GistMirror, ResumeError> =>
    (known
      ? github
          .read(login, known.gistId, file)
          .pipe(
            Effect.catchTag('ProfileNotFound', () => github.find(login, file))
          )
      : github.find(login, file)
    ).pipe(
      Effect.flatMap(toMirror),
      Effect.tap(save),
      Effect.tapError((e) =>
        e._tag === 'ProfileNotFound' && known ? onGone : Effect.void
      )
    );

  /** Refreshes the copy after this visit, once at a time per login. */
  const refreshLater = (
    refresh: Effect.Effect<unknown, ResumeError>,
    login: string
  ) =>
    Effect.suspend(() => {
      if (refreshing.has(login)) return Effect.void;
      refreshing.add(login);
      return refresh.pipe(
        Effect.catchTag('GithubUnavailable', () =>
          Effect.logWarning('GitHub unavailable; gist copy not refreshed', {
            login,
          })
        ),
        Effect.ignore,
        Effect.ensuring(Effect.sync(() => refreshing.delete(login))),
        Effect.forkDetach,
        Effect.asVoid
      );
    });

  return (
    login: string,
    known: GistMirror | undefined,
    save: (mirror: GistMirror) => Effect.Effect<void>,
    onGone: Effect.Effect<void>
  ): Effect.Effect<Mirrored, ResumeError> =>
    Effect.gen(function* () {
      const refresh = fetch(login, known, save, onGone);
      if (known) {
        const age =
          (yield* Clock.currentTimeMillis) - known.fetchedAt.getTime();
        if (age < Duration.toMillis(GHOST_TTL))
          return { resume: known.resume, stale: false };
        if (age < Duration.toMillis(GHOST_STALE)) {
          // Low on GitHub requests (a crawler sweeping resumes), keep the
          // rest for resumes with no copy yet: this one waits.
          if (yield* github.spare) yield* refreshLater(refresh, login);
          return { resume: known.resume, stale: false };
        }
      }
      return yield* refresh.pipe(
        Effect.map((m) => ({ resume: m.resume, stale: false })),
        Effect.catchTag('GithubUnavailable', (error) =>
          known
            ? Effect.as(
                Effect.logWarning('GitHub unavailable; serving the last copy', {
                  login,
                }),
                { resume: known.resume, stale: true }
              )
            : Effect.fail(error)
        )
      );
    });
};
