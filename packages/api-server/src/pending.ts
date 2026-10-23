import { sign, unsign, type GithubIdentity } from '@repo/accounts';
import { Clock, Config, Effect, Option, type Redacted, Schema } from 'effect';

const Pending = Schema.fromJsonString(
  Schema.Struct({
    id: Schema.Number,
    login: Schema.String,
    avatarUrl: Schema.NullOr(Schema.String),
    email: Schema.NullOr(Schema.String),
    expires: Schema.Number,
  })
);
const OAuthState = Schema.fromJsonString(
  Schema.Struct({
    state: Schema.String,
    intent: Schema.Literals(['signin', 'link']),
    next: Schema.String,
    expires: Schema.Number,
  })
);
export type OAuthState = Omit<typeof OAuthState.Type, 'expires'>;

export const PENDING_SECONDS = 30 * 60;
export const OAUTH_SECONDS = 10 * 60;

/**
 * Short-lived state kept in signed cookies (AUTH_SECRET): a GitHub sign-in
 * waiting for a username, and an OAuth round trip in progress.
 */
export const sealedCookies = Effect.gen(function* () {
  const secret: Redacted.Redacted = yield* Config.Redacted('AUTH_SECRET');
  const expiresIn = (seconds: number) =>
    Effect.map(Clock.currentTimeMillis, (now) => now + seconds * 1000);
  const fresh = <A extends { expires: number }>(value: Option.Option<A>) =>
    Effect.map(Clock.currentTimeMillis, (now) =>
      Option.filter(value, (v) => v.expires > now)
    );
  const raw = (sealed: string | undefined) =>
    sealed ? unsign(secret, sealed) : undefined;

  return {
    sealPending: (identity: GithubIdentity) =>
      Effect.map(expiresIn(PENDING_SECONDS), (expires) =>
        sign(secret, Schema.encodeSync(Pending)({ ...identity, expires }))
      ),
    openPending: (sealed: string | undefined) =>
      fresh(Schema.decodeUnknownOption(Pending)(raw(sealed))).pipe(
        Effect.map(
          Option.map(({ expires: _, ...identity }): GithubIdentity => identity)
        )
      ),
    sealOAuth: (state: OAuthState) =>
      Effect.map(expiresIn(OAUTH_SECONDS), (expires) =>
        sign(secret, Schema.encodeSync(OAuthState)({ ...state, expires }))
      ),
    openOAuth: (sealed: string | undefined) =>
      fresh(Schema.decodeUnknownOption(OAuthState)(raw(sealed))),
  };
});
