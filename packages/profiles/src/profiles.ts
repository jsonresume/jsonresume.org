import { Clock, Context, Duration, Effect, Layer } from 'effect';
import { ProfileNotFound, type ResumeError } from './errors';
import { GithubGists, type GistResume } from './github';
import { ProfileStore, type GistMirror } from './store';
import type { Username } from './username';

export const RESUME_FILE = 'resume.json';

/** How long a gist copy is served before GitHub is asked again. */
export const GHOST_TTL = Duration.seconds(60);

export interface ResolvedResume {
  _tag: 'Resume';
  username: Username;
  resume: unknown;
  /** A ghost (mirrored gist), an account, or another gist file read live. */
  source: 'ghost' | 'account' | 'gist';
  /** True when GitHub was unreachable and the last copy was served. */
  stale: boolean;
}

/** The name now belongs to another one (a merged ghost): redirect there. */
export interface MovedResume {
  _tag: 'Moved';
  username: string;
}

/**
 * Resolves /@username to a resume (docs/ACCOUNTS_AND_USERNAMES.md): an
 * alias redirects; an account serves its gist or its stored copy once
 * verified; otherwise the GitHub user's resume.json gist, kept as a ghost.
 * Gist copies refresh after GHOST_TTL, go when GitHub says the gist is
 * gone, and are served stale while GitHub is down.
 */
export class Profiles extends Context.Service<
  Profiles,
  {
    resume(
      username: Username,
      options?: { file?: string }
    ): Effect.Effect<ResolvedResume | MovedResume, ResumeError>;
  }
>()('@repo/profiles/Profiles') {
  static readonly layer = Layer.effect(
    Profiles,
    Effect.gen(function* () {
      const github = yield* GithubGists;
      const store = yield* ProfileStore;

      const fresh = (mirror: GistMirror | undefined) =>
        Effect.map(
          Clock.currentTimeMillis,
          (now) =>
            mirror !== undefined &&
            now - mirror.fetchedAt.getTime() < Duration.toMillis(GHOST_TTL)
        );

      const toMirror = (found: GistResume) =>
        Effect.map(
          Clock.currentTimeMillis,
          (now): GistMirror => ({
            githubId: found.githubId,
            gistId: found.gistId,
            resume: found.resume,
            fetchedAt: new Date(now),
          })
        );

      /**
       * The resume.json gist of `login`, from `known` while fresh. A known
       * gist is one request; if it moved or went, search again. `onGone`
       * runs when GitHub says there is none; stale copies cover outages.
       */
      const mirrored = (
        login: string,
        known: GistMirror | undefined,
        save: (mirror: GistMirror) => Effect.Effect<void>,
        onGone: Effect.Effect<void>
      ) =>
        Effect.gen(function* () {
          if (known && (yield* fresh(known)))
            return { resume: known.resume, stale: false };
          const lookup = known
            ? github
                .read(login, known.gistId, RESUME_FILE)
                .pipe(
                  Effect.catchTag('ProfileNotFound', () =>
                    github.find(login, RESUME_FILE)
                  )
                )
            : github.find(login, RESUME_FILE);
          return yield* lookup.pipe(
            Effect.flatMap(toMirror),
            Effect.tap(save),
            Effect.map((m) => ({ resume: m.resume, stale: false })),
            Effect.tapError((e) =>
              e._tag === 'ProfileNotFound' && known ? onGone : Effect.void
            ),
            Effect.catchTag('GithubUnavailable', (error) =>
              known
                ? Effect.as(
                    Effect.logWarning(
                      'GitHub unavailable; serving the last copy',
                      { login }
                    ),
                    { resume: known.resume, stale: true }
                  )
                : Effect.fail(error)
            )
          );
        });

      const resume = Effect.fn('Profiles.resume')(function* (
        username: Username,
        options?: { file?: string }
      ) {
        const file = options?.file ?? RESUME_FILE;
        const profile = yield* store.find(username);
        const done = (
          r: { resume: unknown; stale: boolean },
          source: ResolvedResume['source']
        ) => ({ _tag: 'Resume', username, source, ...r } as const);

        if (profile?.kind === 'alias') {
          return { _tag: 'Moved', username: profile.target } as const;
        }
        if (profile?.kind === 'account') {
          const unpublished = new ProfileNotFound({
            username,
            reason: 'unpublished',
            file,
          });
          if (!profile.verified) return yield* unpublished;
          if (profile.source === 'stored') {
            if (profile.stored === null || profile.stored === undefined)
              return yield* unpublished;
            return done({ resume: profile.stored, stale: false }, 'account');
          }
          const login = profile.githubLogin;
          if (login === undefined) return yield* unpublished;
          if (file !== RESUME_FILE) {
            const found = yield* github.find(login, file);
            return done({ resume: found.resume, stale: false }, 'gist');
          }
          const result = yield* mirrored(
            login,
            profile.mirror,
            (m) => store.saveMirror(username, m),
            Effect.void
          );
          return done(result, 'account');
        }
        // Other gist files (?gistname=) are read live and not kept.
        if (file !== RESUME_FILE) {
          const found = yield* github.find(username, file);
          return done({ resume: found.resume, stale: false }, 'gist');
        }
        const ghost = profile?.kind === 'ghost' ? profile : undefined;
        const result = yield* mirrored(
          username,
          ghost,
          (m) => store.saveGhost({ username, ...m }),
          store.removeGhost(username)
        );
        return done(result, 'ghost');
      });

      return Profiles.of({ resume });
    })
  );
}
