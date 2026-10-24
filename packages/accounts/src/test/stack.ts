import { TestDatabase } from '@repo/database/testing';
import { Profiles, Usernames } from '@repo/profiles';
import { PgProfileStore } from '@repo/profiles/sql';
import { fakeGithub } from '@repo/profiles/testing';
import { ConfigProvider, Effect, Layer } from 'effect';
import { Accounts } from '../accounts';
import { Mailer, type Mail } from '../mailer';
import { PgAccountStore } from '../sql';
import { fakeGists } from './fakeGists';

/**
 * Accounts on a fresh in-memory Postgres, GitHub faked, mail captured.
 * GitHub user `ghosty` (id 5) has a resume gist; `plain` (id 6) has none.
 */
export function accountsStack() {
  const github = fakeGithub();
  github.state.users.set('ghosty', {
    id: 5,
    gists: [
      { id: 'g5', files: { 'resume.json': '{"basics":{"name":"Ghosty"}}' } },
    ],
  });
  github.state.users.set('plain', { id: 6, gists: [] });
  const mail: Mail[] = [];
  const mailer = Layer.succeed(
    Mailer,
    Mailer.of({
      enabled: true,
      send: (m) => Effect.sync(() => void mail.push(m)),
    })
  );
  const stores = Layer.mergeAll(PgAccountStore, PgProfileStore).pipe(
    Layer.provideMerge(TestDatabase)
  );
  const profiles = Layer.mergeAll(Usernames.layer, Profiles.layer).pipe(
    Layer.provideMerge(Layer.mergeAll(github.layer(), stores))
  );
  const gists = fakeGists();
  const config = ConfigProvider.layer(
    ConfigProvider.fromEnvRecord({ AUTH_SECRET: 'test secret' })
  );
  const layer = Accounts.layer.pipe(
    Layer.provideMerge(Layer.mergeAll(profiles, mailer, gists.layer, config))
  );
  const run = <A, E>(
    effect: Effect.Effect<A, E, Layer.Success<typeof layer>>
  ) => Effect.runPromise(effect.pipe(Effect.provide(layer), Effect.scoped));
  /** The token in the last verification email. */
  const lastToken = () =>
    /token=([\w-]+)/.exec(mail.at(-1)?.text ?? '')?.[1] ?? '';
  return { github, gists: gists.state, mail, run, lastToken, layer };
}
