import { Clock, Config, Effect, Option, Redacted } from 'effect';
import {
  HttpClient,
  HttpClientRequest,
  type HttpClientResponse,
} from 'effect/http';
import { GithubUnavailable } from './errors';

export interface GithubCredentials {
  token: Option.Option<Redacted.Redacted>;
  /** The OAuth app's id and secret, used as Basic auth (5000 requests/hour). */
  app: Option.Option<{ id: string; secret: Redacted.Redacted }>;
}

/** GITHUB_TOKEN and AUTH_GITHUB_ID/AUTH_GITHUB_SECRET, all optional. */
export const githubCredentials = Config.all({
  token: Config.option(Config.Redacted('GITHUB_TOKEN')),
  app: Config.option(
    Config.all({
      id: Config.String('AUTH_GITHUB_ID'),
      secret: Config.Redacted('AUTH_GITHUB_SECRET'),
    })
  ),
});

interface Auth {
  readonly name: string;
  readonly sign: (
    request: HttpClientRequest.HttpClientRequest
  ) => HttpClientRequest.HttpClientRequest;
}

/** Below this many requests left, `spare` says no: keep them for lookups. */
export const QUOTA_RESERVE = 500;
/** A credential GitHub rejected is left alone this long. */
const REJECTED_MS = 60 * 60 * 1000;

interface Quota {
  /** Requests left, as GitHub last said; unknown until the first answer. */
  remaining: number | undefined;
  /** When `remaining` starts again, in ms; 0 when GitHub hasn't said. */
  resetAt: number;
  /** Until when the credential is skipped after a 401, in ms. */
  rejectedUntil: number;
}

const header = (r: HttpClientResponse.HttpClientResponse, name: string) => {
  const value = Number(r.headers[name]);
  return Number.isFinite(value) ? value : undefined;
};

/** GitHub's rate limit answers: 429, or 403 with nothing left. */
const rateLimited = (r: HttpClientResponse.HttpClientResponse) =>
  r.status === 429 ||
  (r.status === 403 && header(r, 'x-ratelimit-remaining') === 0);

export const unavailable = (message: string, status?: number) =>
  new GithubUnavailable(
    status === undefined ? { message } : { status, message }
  );

/**
 * GETs against api.github.com with the first credential that can answer:
 * GITHUB_TOKEN, then the OAuth app as Basic auth, then anonymous (60
 * requests an hour). A credential GitHub rejects (401) is skipped for an
 * hour, and one out of requests until its limit resets, so neither costs a
 * round trip per call. `get` succeeds with the JSON body, or undefined for
 * a 404; anything else is GithubUnavailable. `spare` says whether requests
 * are left beyond the reserve, for work that can wait.
 */
export const makeGithubApi = (
  client: HttpClient.HttpClient,
  credentials: GithubCredentials
) => {
  const auths: ReadonlyArray<Auth> = [
    ...Option.toArray(credentials.token).map(
      (token): Auth => ({
        name: 'GITHUB_TOKEN',
        sign: (r) => HttpClientRequest.bearerToken(r, Redacted.value(token)),
      })
    ),
    ...Option.toArray(credentials.app).map(
      ({ id, secret }): Auth => ({
        name: 'the OAuth app',
        sign: (r) => HttpClientRequest.basicAuth(r, id, Redacted.value(secret)),
      })
    ),
    { name: 'anonymous', sign: (r) => r },
  ];
  const quotas = new Map<Auth, Quota>(
    auths.map((a) => [
      a,
      { remaining: undefined, resetAt: 0, rejectedUntil: 0 },
    ])
  );
  const quotaOf = (auth: Auth): Quota =>
    quotas.get(auth) ?? { remaining: undefined, resetAt: 0, rejectedUntil: 0 };
  const usable = (q: Quota, now: number) =>
    q.rejectedUntil <= now && (q.remaining !== 0 || q.resetAt <= now);

  const note = (auth: Auth, r: HttpClientResponse.HttpClientResponse) =>
    Effect.gen(function* () {
      const now = yield* Clock.currentTimeMillis;
      const q = quotaOf(auth);
      const reset = header(r, 'x-ratelimit-reset');
      const remaining = rateLimited(r) ? 0 : header(r, 'x-ratelimit-remaining');
      if (remaining !== undefined) q.remaining = remaining;
      if (reset !== undefined) q.resetAt = reset * 1000;
      else if (remaining === 0) q.resetAt = now + 60_000;
      if (r.status === 401) {
        q.rejectedUntil = now + REJECTED_MS;
        yield* Effect.logWarning(
          `GitHub rejected ${auth.name}; skipping it for an hour`
        );
      }
    });

  const get = Effect.fn('GithubApi.get')(function* (path: string) {
    const request = HttpClientRequest.get(`https://api.github.com${path}`).pipe(
      HttpClientRequest.setHeaders({
        accept: 'application/vnd.github+json',
        'user-agent': 'jsonresume.org',
      })
    );
    const now = yield* Clock.currentTimeMillis;
    let response: HttpClientResponse.HttpClientResponse | undefined;
    for (const auth of auths) {
      if (!usable(quotaOf(auth), now)) continue;
      response = yield* client
        .execute(auth.sign(request))
        .pipe(Effect.mapError((e) => unavailable(e.message)));
      yield* note(auth, response);
      if (response.status !== 401 && !rateLimited(response)) break;
    }
    if (!response) return yield* unavailable('GitHub rate limit reached');
    if (response.status === 404) return undefined;
    if (response.status !== 200) {
      return yield* unavailable(
        `GitHub answered ${response.status}`,
        response.status
      );
    }
    return yield* response.json.pipe(
      Effect.mapError((e) => unavailable(e.message))
    );
  });

  // Anonymous requests (60 an hour) are a last resort, not spare.
  const counted = auths.length > 1 ? auths.slice(0, -1) : auths;
  const spare = Effect.map(Clock.currentTimeMillis, (now) =>
    counted.some((a) => {
      const q = quotaOf(a);
      return (
        usable(q, now) &&
        (q.remaining === undefined ||
          q.remaining > QUOTA_RESERVE ||
          (q.resetAt > 0 && q.resetAt <= now))
      );
    })
  );

  return { get, spare };
};
