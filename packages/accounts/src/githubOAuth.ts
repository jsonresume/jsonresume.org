import {
  Config,
  Context,
  Effect,
  Layer,
  Option,
  Redacted,
  Schema,
} from 'effect';
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from 'effect/http';
import type { GithubIdentity } from './store';

/** The sign-in with GitHub failed: refused, expired, or GitHub was down. */
export class GithubOAuthFailed extends Schema.TaggedError<GithubOAuthFailed>()(
  'GithubOAuthFailed',
  {
    message: Schema.String,
  }
) {}

const Token = Schema.Struct({ access_token: Schema.String });
const User = Schema.Struct({
  id: Schema.Number,
  login: Schema.String,
  avatar_url: Schema.NullOr(Schema.String),
});
const Emails = Schema.Array(
  Schema.Struct({
    email: Schema.String,
    primary: Schema.Boolean,
    verified: Schema.Boolean,
  })
);

/** GitHub's OAuth web flow, with the app's AUTH_GITHUB_ID and AUTH_GITHUB_SECRET. */
export class GithubOAuth extends Context.Service<
  GithubOAuth,
  {
    authorizeUrl(state: string, redirectUri: string): string;
    /** Trade the callback's code for who signed in. */
    identify(
      code: string,
      redirectUri: string
    ): Effect.Effect<GithubIdentity, GithubOAuthFailed>;
  }
>()('@repo/accounts/GithubOAuth') {
  static readonly layer = Layer.effect(
    GithubOAuth,
    Effect.gen(function* () {
      const app = yield* Config.option(
        Config.all({
          id: Config.String('AUTH_GITHUB_ID'),
          secret: Config.Redacted('AUTH_GITHUB_SECRET'),
        })
      );
      // Without an OAuth app (local development), GitHub sign-in says so.
      if (Option.isNone(app)) {
        return GithubOAuth.of({
          authorizeUrl: () => '/signin?error=github-unavailable',
          identify: () =>
            Effect.fail(
              new GithubOAuthFailed({
                message: 'GitHub sign-in is not configured',
              })
            ),
        });
      }
      const { id, secret } = app.value;
      const client = HttpClient.filterStatusOk(yield* HttpClient.HttpClient);
      const failed = (e: { message: string }) =>
        new GithubOAuthFailed({ message: e.message });
      const api = <S extends Schema.Constraint>(
        path: string,
        token: string,
        schema: S
      ) =>
        HttpClientRequest.get(`https://api.github.com${path}`).pipe(
          HttpClientRequest.bearerToken(token),
          HttpClientRequest.setHeaders({
            accept: 'application/vnd.github+json',
            'user-agent': 'jsonresume.org',
          }),
          client.execute,
          Effect.flatMap(HttpClientResponse.schemaBodyJson(schema))
        );

      const identify = Effect.fn('GithubOAuth.identify')(function* (
        code: string,
        redirectUri: string
      ) {
        const { access_token } = yield* HttpClientRequest.post(
          'https://github.com/login/oauth/access_token'
        ).pipe(
          HttpClientRequest.acceptJson,
          HttpClientRequest.bodyJsonUnsafe({
            client_id: id,
            client_secret: Redacted.value(secret),
            code,
            redirect_uri: redirectUri,
          }),
          client.execute,
          Effect.flatMap(HttpClientResponse.schemaBodyJson(Token)),
          Effect.mapError(failed)
        );
        const user = yield* api('/user', access_token, User).pipe(
          Effect.mapError(failed)
        );
        const emails = yield* api('/user/emails', access_token, Emails).pipe(
          Effect.orElseSucceed(() => [])
        );
        const primary = emails.find((e) => e.primary && e.verified);
        return {
          id: user.id,
          login: user.login,
          avatarUrl: user.avatar_url,
          email: primary ? primary.email.toLowerCase() : null,
        } satisfies GithubIdentity;
      });

      return GithubOAuth.of({
        authorizeUrl: (state, redirectUri) => {
          const url = new URL('https://github.com/login/oauth/authorize');
          url.searchParams.set('client_id', id);
          url.searchParams.set('redirect_uri', redirectUri);
          url.searchParams.set('scope', 'read:user user:email');
          url.searchParams.set('state', state);
          url.searchParams.set('allow_signup', 'true');
          return url.toString();
        },
        identify,
      });
    })
  ).pipe(Layer.provide(FetchHttpClient.layer));
}
