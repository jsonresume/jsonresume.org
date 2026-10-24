import {
  decrypt,
  encrypt,
  sign,
  unsign,
  type GithubIdentity,
} from '@repo/accounts';
import { Clock, Config, Effect, Option, type Redacted, Schema } from 'effect';

const Pending = Schema.fromJsonString(
  Schema.Struct({
    id: Schema.Number,
    login: Schema.String,
    avatarUrl: Schema.NullOr(Schema.String),
    email: Schema.NullOr(Schema.String),
    /** The OAuth token, encrypted: this cookie is signed, not secret. */
    grant: Schema.optionalKey(
      Schema.Struct({
        sealed: Schema.String,
        scopes: Schema.Array(Schema.String),
      })
    ),
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
    sealPending: ({ grant, ...identity }: GithubIdentity) =>
      Effect.map(expiresIn(PENDING_SECONDS), (expires) =>
        sign(
          secret,
          Schema.encodeSync(Pending)({
            ...identity,
            ...(grant
              ? {
                  grant: {
                    sealed: encrypt(secret, grant.token),
                    scopes: grant.scopes,
                  },
                }
              : {}),
            expires,
          })
        )
      ),
    openPending: (sealed: string | undefined) =>
      fresh(Schema.decodeUnknownOption(Pending)(raw(sealed))).pipe(
        Effect.map(
          Option.map(({ expires: _, grant, ...identity }): GithubIdentity => {
            const token = grant ? decrypt(secret, grant.sealed) : undefined;
            return token && grant
              ? { ...identity, grant: { token, scopes: grant.scopes } }
              : identity;
          })
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
