import { Context, Effect, Layer } from 'effect';
import { ProfileNotFound, type ResumeError } from './errors';
import { GithubGists } from './github';
import { makeMirrored } from './mirror';
import { makeMisses } from './misses';
import { redact } from './redact';
import { ProfileStore } from './store';
import type { Username } from './username';

export const RESUME_FILE = 'resume.json';

export { GHOST_STALE, GHOST_TTL } from './mirror';

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

/** Another gist file, a variant, or `owner`: the reader is the signed-in
 * owner, who sees their page before their email is confirmed. */
export interface ResumeOptions {
  file?: string;
  variant?: string;
  owner?: boolean;
}

/**
 * Resolves /@username to a resume (docs/ACCOUNTS_AND_USERNAMES.md): an
 * alias redirects; an account serves its gist or its stored copy once
 * verified; otherwise the GitHub user's resume.json gist, kept as a ghost.
 * Gist copies refresh after GHOST_TTL (in the background, up to
 * GHOST_STALE), go when GitHub says the gist is gone, and are served stale
 * while GitHub is down.
 */
export class Profiles extends Context.Service<
  Profiles,
  {
    resume(
      username: Username,
      options?: ResumeOptions
    ): Effect.Effect<ResolvedResume | MovedResume, ResumeError>;
  }
>()('@repo/profiles/Profiles') {
  static readonly layer = Layer.effect(
    Profiles,
    Effect.gen(function* () {
      const github = yield* GithubGists;
      const store = yield* ProfileStore;

      const mirrored = makeMirrored(github, RESUME_FILE);
      const misses = makeMisses();

      const resume = Effect.fn('Profiles.resume')(function* (
        username: Username,
        options?: ResumeOptions
      ) {
        const file = options?.file ?? RESUME_FILE;
        const profile = yield* store.find(username);
        // An account's choice of what stays off its page applies to every
        // public read: the page, its formats and its feeds.
        const hidden = profile?.kind === 'account' ? profile.hidden ?? [] : [];
        const done = (
          r: { resume: unknown; stale: boolean },
          source: ResolvedResume['source']
        ) =>
          ({
            _tag: 'Resume',
            username,
            source,
            stale: r.stale,
            resume: redact(r.resume, hidden),
          } as const);

        if (profile?.kind === 'alias') {
          return { _tag: 'Moved', username: profile.target } as const;
        }
        // Only accounts have variants.
        if (options?.variant !== undefined && profile?.kind !== 'account')
          return yield* new ProfileNotFound({
            username,
            reason: 'no-variant',
            file: options.variant,
          });
        if (profile?.kind === 'account') {
          const unpublished = new ProfileNotFound({
            username,
            reason: 'unpublished',
            file,
          });
          if (!profile.verified && options?.owner !== true)
            return yield* unpublished;
          // Kept private: every public read (page, formats, variants, other
          // gist files) answers as if there were nothing, except to its owner.
          if (profile.private === true && options?.owner !== true)
            return yield* new ProfileNotFound({
              username,
              reason: 'private',
              file,
            });
          // A variant (/@name/slug): its own copy, published with the account.
          if (options?.variant !== undefined) {
            const found = yield* store.variant(profile.userId, options.variant);
            if (found === undefined)
              return yield* new ProfileNotFound({
                username,
                reason: 'no-variant',
                file: options.variant,
              });
            return done({ resume: found, stale: false }, 'account');
          }
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
          // A gist its owner deleted or hid takes the page down, as for a
          // ghost; the account stays, and a new gist brings the page back.
          // No gist yet is an account with nothing published: its owner
          // writes one in the editor, which makes the gist.
          const result = yield* mirrored(
            login,
            profile.mirror,
            (m) => store.saveMirror(username, m),
            store.dropMirror(username)
          ).pipe(
            Effect.catchIf(
              (e) => e._tag === 'ProfileNotFound' && e.reason === 'no-gist',
              () => Effect.fail(unpublished)
            )
          );
          return done(result, 'account');
        }
        // Other gist files (?gistname=) are read live and not kept.
        if (file !== RESUME_FILE) {
          const found = yield* misses(
            `${username.toLowerCase()}/${file}`,
            github.find(username, file)
          );
          return done({ resume: found.resume, stale: false }, 'gist');
        }
        const ghost = profile?.kind === 'ghost' ? profile : undefined;
        const lookup = mirrored(
          username,
          ghost,
          (m) => store.saveGhost({ username, ...m }),
          store.removeGhost(username)
        );
        // A known ghost has a copy to serve; only unknown logins are misses.
        const result = yield* ghost
          ? lookup
          : misses(`${username.toLowerCase()}/${file}`, lookup);
        return done(result, 'ghost');
      });

      return Profiles.of({ resume });
    })
  );
}
