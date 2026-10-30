import {
  Accounts,
  ApiKeys,
  GithubOAuth,
  OAuth,
  Mailer,
  RateLimiter,
  type GithubIdentity,
  type Mail,
} from '@repo/accounts';
import { PgAccountStore } from '@repo/accounts/sql';
import { fakeGists } from '@repo/accounts/testing';
import { Analytics } from '@repo/analytics';
import { PgAnalyticsStore } from '@repo/analytics/sql';
import { TestDatabase } from '@repo/database/testing';
import { Explore } from '@repo/explore';
import { embedderFrom, JobBoard, JobMatcher } from '@repo/jobs';
import { Copilot } from '@repo/pathways';
import { Profiles, Usernames } from '@repo/profiles';
import { PgProfileStore } from '@repo/profiles/sql';
import { fakeGithub } from '@repo/profiles/testing';
import { ConfigProvider, Effect, Layer, Stream } from 'effect';
import { HttpRouter, HttpServer } from 'effect/http';
import { apiRoutes } from '../index';
import { plainCareers } from '@repo/careers/testing';

/**
 * The whole API as a web handler over a fresh in-memory Postgres, with
 * GitHub (gists and OAuth) faked and mail captured. `fetch` keeps cookies
 * between calls, like a browser would.
 */
export function testServer() {
  const github = fakeGithub();
  github.state.users.set('ghosty', {
    id: 5,
    gists: [
      { id: 'g5', files: { 'resume.json': '{"basics":{"name":"Ghosty"}}' } },
    ],
  });
  const identities = new Map<string, GithubIdentity>();
  const gists = fakeGists();
  const mail: Mail[] = [];
  const config = ConfigProvider.layer(
    ConfigProvider.fromEnvRecord({
      AUTH_SECRET: 'test secret',
      SITE_URL: 'https://jsonresume.test',
    })
  );
  const stores = Layer.mergeAll(
    PgAccountStore,
    PgProfileStore,
    PgAnalyticsStore,
    ApiKeys.layer,
    OAuth.layer,
    // The copilot answers as the user it was given, without a model.
    Layer.succeed(
      Copilot,
      Copilot.of({
        reply: (user) =>
          Stream.make(
            { type: 'text', delta: `Hello @${user.username}` },
            { type: 'done' }
          ),
      })
    ),
    JobBoard.layer,
    Explore.layer,
    JobMatcher.layer.pipe(
      Layer.provide(embedderFrom(() => new Float32Array(3072).fill(1)))
    )
  ).pipe(Layer.provideMerge(TestDatabase));
  const careers = plainCareers.pipe(Layer.provide(stores));
  const profiles = Layer.mergeAll(Usernames.layer, Profiles.layer).pipe(
    Layer.provideMerge(Layer.mergeAll(github.layer(), stores))
  );
  const services = Layer.mergeAll(Accounts.layer, Analytics.layer).pipe(
    Layer.provideMerge(
      Layer.mergeAll(
        profiles,
        RateLimiter.layer,
        gists.layer,
        Layer.succeed(
          Mailer,
          Mailer.of({
            enabled: true,
            send: (m) => Effect.sync(() => void mail.push(m)),
          })
        ),
        Layer.succeed(
          GithubOAuth,
          GithubOAuth.of({
            authorizeUrl: (state) =>
              `https://github.test/authorize?state=${state}`,
            identify: (code) => {
              const identity = identities.get(code);
              return identity
                ? Effect.succeed(identity)
                : Effect.die('unknown code');
            },
          })
        )
      )
    ),
    Layer.provideMerge(config)
  );
  const app = apiRoutes('test').pipe(
    Layer.provide(careers),
    Layer.provide(services),
    Layer.provide(HttpServer.layerServices)
  );
  const { handler, dispose } = HttpRouter.toWebHandler(app, {
    disableLogger: true,
  });

  const jar = new Map<string, string>();
  const fetch = async (path: string, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    headers.set('cookie', [...jar].map(([k, v]) => `${k}=${v}`).join('; '));
    if (init.body && !headers.has('content-type'))
      headers.set('content-type', 'application/json');
    headers.set('user-agent', 'Mozilla/5.0 (X11; Linux x86_64) Firefox/130.0');
    const response = await handler(
      new Request(`https://jsonresume.test${path}`, { ...init, headers })
    );
    for (const line of response.headers.getSetCookie()) {
      const [pair = '', ...attributes] = line.split(';');
      const [name = '', value = ''] = pair.split('=');
      const expired = attributes.some((a) =>
        /max-age=0|expires=thu, 01 jan 1970/i.test(a.trim())
      );
      if (expired || value === '') jar.delete(name.trim());
      else jar.set(name.trim(), value);
    }
    return response;
  };
  const post = (path: string, body: unknown) =>
    fetch(path, { method: 'POST', body: JSON.stringify(body) });
  return {
    fetch,
    post,
    jar,
    mail,
    github,
    gists: gists.state,
    identities,
    dispose,
  };
}
