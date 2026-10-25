import { GistPermissionNeeded, GithubUnreachable } from '@repo/api';
import { Config, Effect } from 'effect';
import { decrypt, encrypt } from './crypto';
import { GistFiles } from './gists';
import { AccountStore, type GithubIdentity } from './store';

/**
 * Keeping a GitHub user's gist the source of truth: their token is stored
 * (encrypted) at sign-in, the editor's saves are written to the gist (a new
 * one if they have none), and the editor opens on the gist as it is now.
 */
export const gistSync = Effect.gen(function* () {
  const store = yield* AccountStore;
  const gists = yield* GistFiles;
  const secret = yield* Config.Redacted('AUTH_SECRET');

  const keepGrant = (userId: string, identity: GithubIdentity) =>
    identity.grant
      ? store.setGithubGrant(
          userId,
          encrypt(secret, identity.grant.token),
          identity.grant.scopes
        )
      : Effect.void;

  /** The token, only if it may write gists. */
  const writer = (userId: string) =>
    Effect.map(store.githubGrant(userId), (grant) =>
      grant && grant.scopes.includes('gist')
        ? decrypt(secret, grant.sealedToken)
        : undefined
    );

  const canWrite = (userId: string) =>
    Effect.map(writer(userId), (token) => token !== undefined);

  const saveToGist = Effect.fn('Accounts.saveToGist')(function* (
    userId: string,
    resume: unknown
  ) {
    const token = yield* writer(userId);
    if (!token) return yield* new GistPermissionNeeded();
    const current = yield* store.resumeOf(userId);
    const content = `${JSON.stringify(resume, null, 2)}\n`;
    const saved = yield* (
      current?.gistId
        ? gists
            .write(token, current.gistId, content)
            .pipe(
              Effect.catchTag('GistAccess', (e) =>
                e.reason === 'missing'
                  ? gists.create(token, content)
                  : Effect.fail(e)
              )
            )
        : gists.create(token, content)
    ).pipe(
      Effect.catchTag(
        'GistAccess',
        (e): Effect.Effect<never, GistPermissionNeeded | GithubUnreachable> =>
          e.reason === 'unavailable'
            ? Effect.fail(new GithubUnreachable())
            : Effect.fail(new GistPermissionNeeded())
      )
    );
    yield* store.saveMirrorFor(userId, {
      githubId: saved.ownerId,
      gistId: saved.gistId,
      resume,
    });
  });

  /** The gist's resume as it is on GitHub now, or undefined if it can't be read. */
  const readGist = (userId: string, gistId: string) =>
    Effect.gen(function* () {
      const token = (yield* store.githubGrant(userId))
        ? yield* writer(userId)
        : undefined;
      if (!token) return undefined;
      const text = yield* gists
        .read(token, gistId)
        .pipe(Effect.orElseSucceed(() => undefined));
      if (text === undefined) return undefined;
      try {
        const resume: unknown = JSON.parse(text);
        return resume;
      } catch {
        return undefined;
      }
    });

  return { keepGrant, canWrite, saveToGist, readGist };
});
