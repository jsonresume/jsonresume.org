import { Config, Effect, Option, Redacted } from 'effect';
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

type Auth = (
  request: HttpClientRequest.HttpClientRequest
) => HttpClientRequest.HttpClientRequest;

export const unavailable = (message: string, status?: number) =>
  new GithubUnavailable(
    status === undefined ? { message } : { status, message }
  );

/**
 * A GET against api.github.com that tries GITHUB_TOKEN first; if GitHub
 * rejects it (401) or it is unset, the OAuth app as Basic auth; then
 * anonymous (60 requests an hour). Succeeds with the JSON body, or
 * undefined for a 404; anything else is GithubUnavailable.
 */
export const makeGithubApi = (
  client: HttpClient.HttpClient,
  credentials: GithubCredentials
) => {
  const auths: ReadonlyArray<Auth> = [
    ...Option.toArray(credentials.token).map(
      (token): Auth =>
        (r) =>
          HttpClientRequest.bearerToken(r, Redacted.value(token))
    ),
    ...Option.toArray(credentials.app).map(
      ({ id, secret }): Auth =>
        (r) =>
          HttpClientRequest.basicAuth(r, id, Redacted.value(secret))
    ),
    (r) => r,
  ];

  return Effect.fn('GithubApi.get')(function* (path: string) {
    const request = HttpClientRequest.get(`https://api.github.com${path}`).pipe(
      HttpClientRequest.setHeaders({
        accept: 'application/vnd.github+json',
        'user-agent': 'jsonresume.org',
      })
    );
    let response: HttpClientResponse.HttpClientResponse | undefined;
    for (const auth of auths) {
      response = yield* client
        .execute(auth(request))
        .pipe(Effect.mapError((e) => unavailable(e.message)));
      if (response.status !== 401) break;
    }
    if (!response) return yield* unavailable('no request made');
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
};
