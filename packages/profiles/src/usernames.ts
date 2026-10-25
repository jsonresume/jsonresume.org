import { Context, Effect, Layer, Schema } from 'effect';
import type { GithubUnavailable } from './errors';
import { GithubGists } from './github';
import { RESUME_FILE } from './profiles';
import { ProfileStore } from './store';
import { reservedUsernames, Username } from './username';

export type Availability =
  | { available: true }
  | {
      available: false;
      /** invalid: not a username; reserved: kept by us; taken: an account
       * has it; github: the GitHub user with that login has a resume. */
      reason: 'invalid' | 'reserved' | 'taken' | 'github';
    };

const isUsername = Schema.is(Username);

/**
 * Who may take a username (docs/ACCOUNTS_AND_USERNAMES.md). A name belongs
 * to the GitHub login with a resume gist even before anyone visits it, so
 * this asks GitHub; if GitHub can't answer, the name is not given out.
 */
export class Usernames extends Context.Service<
  Usernames,
  {
    /** `githubId`: the GitHub user signing up, whose own ghost they may claim. */
    check(
      name: string,
      claimant?: { githubId: number; githubLogin: string }
    ): Effect.Effect<Availability, GithubUnavailable>;
  }
>()('@repo/profiles/Usernames') {
  static readonly layer = Layer.effect(
    Usernames,
    Effect.gen(function* () {
      const store = yield* ProfileStore;
      const github = yield* GithubGists;
      const no = (reason: 'invalid' | 'reserved' | 'taken' | 'github') =>
        ({ available: false, reason } as const);
      const yes = { available: true } as const;

      const check = Effect.fn('Usernames.check')(function* (
        name: string,
        claimant?: { githubId: number; githubLogin: string }
      ) {
        if (!isUsername(name)) return no('invalid');
        if (reservedUsernames.has(name)) return no('reserved');
        const profile = yield* store.find(name);
        if (profile?.kind === 'account' || profile?.kind === 'alias')
          return no('taken');
        if (profile?.kind === 'ghost') {
          return profile.githubId === claimant?.githubId ? yes : no('github');
        }
        if (claimant && claimant.githubLogin.toLowerCase() === name) return yes;
        return yield* github.find(name, RESUME_FILE).pipe(
          Effect.as(no('github')),
          Effect.catchTag('ResumeNotJson', () => Effect.succeed(no('github'))),
          Effect.catchTag('ProfileNotFound', () => Effect.succeed(yes))
        );
      });

      return Usernames.of({ check });
    })
  );
}
