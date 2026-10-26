import { Context, Schema } from 'effect';
import {
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiMiddleware,
  HttpApiSecurity,
} from 'effect/http-api';
import { SessionUser } from './Authentication';

/** The access token is missing, unknown or expired (RFC 6750). */
export class InvalidToken extends Schema.TaggedError<InvalidToken>()(
  'InvalidToken',
  { error: Schema.Literal('invalid_token'), error_description: Schema.String },
  { httpApiStatus: 401 }
) {}

/** The token is good but wasn't granted this scope. */
export class InsufficientScope extends Schema.TaggedError<InsufficientScope>()(
  'InsufficientScope',
  {
    error: Schema.Literal('insufficient_scope'),
    error_description: Schema.String,
    scope: Schema.String,
  },
  { httpApiStatus: 403 }
) {}

export class ResumeNotSaved extends Schema.TaggedError<ResumeNotSaved>()(
  'ResumeNotSaved',
  { error: Schema.Literal('invalid_resume'), error_description: Schema.String },
  { httpApiStatus: 400 }
) {}

/** Who an OAuth access token speaks for, and what it may do. */
export class CurrentGrant extends Context.Service<
  CurrentGrant,
  { user: SessionUser; scope: string; clientId: string }
>()('@repo/api/CurrentGrant') {}

/** An OAuth access token (jro_…) as a Bearer token; provides CurrentGrant. */
export class OAuthBearer extends HttpApiMiddleware.Service<
  OAuthBearer,
  { provides: CurrentGrant; requires: never }
>()('@repo/api/OAuthBearer', {
  security: { bearer: HttpApiSecurity.bearer },
  error: InvalidToken,
}) {}

/** OIDC's standard claims, as far as the token's scopes allow. */
export const UserInfo = Schema.Struct({
  /** The account's id: stays the same when the username changes. */
  sub: Schema.String,
  preferred_username: Schema.optional(Schema.String),
  name: Schema.optional(Schema.String),
  picture: Schema.optional(Schema.String),
  /** Their public resume page. */
  profile: Schema.optional(Schema.String),
  email: Schema.optional(Schema.String),
  email_verified: Schema.optional(Schema.Boolean),
});
export type UserInfo = typeof UserInfo.Type;

/**
 * What a connected app reads and writes with its access token: who the
 * user is (profile, email) and their resume (resume:read, resume:write).
 */
export class OAuthResourceApi extends HttpApiGroup.make('oauthResource')
  .add(
    HttpApiEndpoint.get('userinfo', '/userinfo', { success: UserInfo }),
    HttpApiEndpoint.get('resume', '/resume', {
      success: Schema.Struct({
        username: Schema.String,
        url: Schema.String,
        resume: Schema.Unknown,
      }),
      error: InsufficientScope,
    }),
    HttpApiEndpoint.put('saveResume', '/resume', {
      payload: Schema.Unknown,
      success: Schema.Struct({ username: Schema.String, url: Schema.String }),
      error: [InsufficientScope, ResumeNotSaved],
    })
  )
  .middleware(OAuthBearer)
  .prefix('/oauth') {}
