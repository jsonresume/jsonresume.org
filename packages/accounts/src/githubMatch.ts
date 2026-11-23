import { Effect } from 'effect';
import type { AccountStore, GithubIdentity, UserRecord } from './store';

/**
 * A first GitHub sign-in joins the email account it belongs to: one whose
 * verified email is GitHub's verified primary email, with no GitHub linked
 * yet. Without this, someone who signed up by email and later pressed
 * "Continue with GitHub" got a second, empty account. An unverified address
 * proves nothing (anyone can type one in), so such accounts are left alone.
 */
export const joinEmailAccount = (
  store: AccountStore['Service'],
  identity: GithubIdentity
): Effect.Effect<UserRecord | undefined> =>
  Effect.gen(function* () {
    if (identity.email === null) return undefined;
    const found = yield* store.findByEmail(identity.email);
    if (!found?.user.emailVerified || found.user.githubId !== null)
      return undefined;
    // findByGithubId found no one, so the id can't be taken but by a race.
    return yield* Effect.orDie(store.linkGithub(found.user.id, identity));
  });
