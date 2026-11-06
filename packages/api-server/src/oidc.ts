import { Accounts, atHash, OAuth } from '@repo/accounts';
import { allows, type SessionUser, type UserInfo } from '@repo/api';
import { Clock, Config, Effect } from 'effect';
import { toSessionUser } from './http';

const text = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

export const siteUrl = Config.String('SITE_URL').pipe(
  Config.withDefault('https://jsonresume.org')
);

/**
 * OIDC for the OAuth handlers: the standard claims about a user, as far as
 * a scope allows (the same for /api/oauth/userinfo and the ID token; name
 * and photo from the resume, else their GitHub avatar), and tokens with an
 * ID token (RS256, an hour) when the app asked for the openid scope.
 */
export const oidc = Effect.gen(function* () {
  const accounts = yield* Accounts;
  const oauth = yield* OAuth;
  const site = yield* siteUrl;

  const userClaims = Effect.fn('OAuth.userClaims')(function* (
    user: SessionUser,
    scope: string
  ) {
    const profile = allows(scope, 'profile');
    const basics = profile
      ? (
          (yield* accounts.currentResume(user.id)).resume as {
            basics?: Record<string, unknown>;
          } | null
        )?.basics ?? {}
      : {};
    const picture = text(basics.image) ?? user.github?.avatarUrl;
    const claims: UserInfo = {
      sub: user.id,
      ...(profile && {
        preferred_username: user.username,
        profile: `${site}/@${user.username}`,
        ...(text(basics.name) && { name: text(basics.name) }),
        ...(picture && { picture }),
      }),
      ...(allows(scope, 'email') &&
        user.email && {
          email: user.email,
          email_verified: user.emailVerified,
        }),
    };
    return claims;
  });

  const withIdToken = <T extends { access_token: string; scope: string }>({
    tokens,
    grant,
  }: {
    tokens: T;
    grant: { clientId: string; userId: string; nonce: string | null };
  }) =>
    Effect.gen(function* () {
      if (!tokens.scope.split(' ').includes('openid')) return tokens;
      const record = yield* oauth.user(grant.userId);
      if (!record) return tokens;
      const now = Math.floor((yield* Clock.currentTimeMillis) / 1000);
      const claims = yield* userClaims(toSessionUser(record), tokens.scope);
      const id_token = oauth.signJwt({
        iss: site,
        aud: grant.clientId,
        iat: now,
        exp: now + 3600,
        ...(grant.nonce !== null && { nonce: grant.nonce }),
        at_hash: atHash(tokens.access_token),
        ...claims,
      });
      return { ...tokens, id_token };
    });

  return { site, userClaims, withIdToken };
});
