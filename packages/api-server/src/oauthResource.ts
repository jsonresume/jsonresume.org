import { Accounts, OAuth } from '@repo/accounts';
import {
  allows,
  CurrentGrant,
  InsufficientScope,
  InvalidToken,
  JsonResumeApi,
  OAuthBearer,
  ResumeNotSaved,
  type Scope,
} from '@repo/api';
import { Config, Effect, Layer, Redacted } from 'effect';
import { HttpApiBuilder } from 'effect/http-api';
import { toSessionUser } from './http';

/** An OAuth access token; provides CurrentGrant (the user and the scope). */
export const OAuthBearerLive = Layer.effect(
  OAuthBearer,
  Effect.gen(function* () {
    const oauth = yield* OAuth;
    return OAuthBearer.of({
      bearer: Effect.fn('OAuthBearer.bearer')(function* (
        httpEffect,
        { credential }
      ) {
        const grant = yield* oauth.authenticate(Redacted.value(credential));
        if (!grant) {
          return yield* new InvalidToken({
            error: 'invalid_token',
            error_description: 'The access token is unknown or expired',
          });
        }
        return yield* Effect.provideService(httpEffect, CurrentGrant, {
          user: toSessionUser(grant.user),
          scope: grant.scope,
          clientId: grant.clientId,
        });
      }),
    });
  })
);

const requires = (scope: Scope) =>
  Effect.gen(function* () {
    const grant = yield* CurrentGrant;
    if (allows(grant.scope, scope)) return grant.user;
    return yield* new InsufficientScope({
      error: 'insufficient_scope',
      error_description: `This needs the ${scope} scope`,
      scope,
    });
  });

const text = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

/** What connected apps read and write: who the user is, and their resume. */
export const OAuthResourceHandlers = HttpApiBuilder.group(
  JsonResumeApi,
  'oauthResource',
  (handlers) =>
    Effect.gen(function* () {
      const accounts = yield* Accounts;
      const site = yield* Config.String('SITE_URL').pipe(
        Config.withDefault('https://jsonresume.org')
      );
      const page = (username: string) => `${site}/@${username}`;
      return handlers.handleAll({
        userinfo: () =>
          Effect.gen(function* () {
            const { user, scope } = yield* CurrentGrant;
            const profile = allows(scope, 'profile');
            const basics = profile
              ? (
                  (yield* accounts.currentResume(user.id)).resume as {
                    basics?: Record<string, unknown>;
                  } | null
                )?.basics ?? {}
              : {};
            const picture = text(basics.image) ?? user.github?.avatarUrl;
            return {
              sub: user.id,
              ...(profile && {
                preferred_username: user.username,
                profile: page(user.username),
                ...(text(basics.name) && { name: text(basics.name) }),
                ...(picture && { picture }),
              }),
              ...(allows(scope, 'email') &&
                user.email && {
                  email: user.email,
                  email_verified: user.emailVerified,
                }),
            };
          }),
        resume: () =>
          Effect.gen(function* () {
            const user = yield* requires('resume:read');
            const { resume } = yield* accounts.currentResume(user.id);
            return {
              username: user.username,
              url: page(user.username),
              resume,
            };
          }),
        saveResume: ({ payload }) =>
          Effect.gen(function* () {
            const user = yield* requires('resume:write');
            yield* accounts.saveResume(user.id, payload).pipe(
              Effect.mapError(
                (e) =>
                  new ResumeNotSaved({
                    error: 'invalid_resume',
                    error_description:
                      e._tag === 'InvalidResume'
                        ? e.message
                        : e._tag === 'GistPermissionNeeded'
                        ? 'Their resume comes from a GitHub gist jsonresume.org may not write to yet; they can allow it at https://jsonresume.org/dashboard/resume'
                        : 'GitHub did not answer; try again in a minute',
                  })
              )
            );
            return { username: user.username, url: page(user.username) };
          }),
      });
    })
);
