import { Context, Schema } from 'effect';
import { HttpApiMiddleware, HttpApiSecurity } from 'effect/http-api';
import { SESSION_COOKIE } from './cookies';
import { Unauthorized } from './errors';

/** The signed-in user, as the API returns it. */
export class SessionUser extends Schema.Class<SessionUser>(
  '@repo/api/SessionUser'
)({
  id: Schema.String,
  username: Schema.String,
  email: Schema.NullOr(Schema.String),
  emailVerified: Schema.Boolean,
  github: Schema.NullOr(
    Schema.Struct({
      login: Schema.String,
      avatarUrl: Schema.NullOr(Schema.String),
    })
  ),
}) {}

/** The session cookie: an opaque token, httpOnly; the server keeps its hash. */
export const sessionCookie = HttpApiSecurity.apiKey({
  key: 'jr_session',
  in: 'cookie',
});

export { SIGNED_IN_HINT } from './cookies';

export class CurrentUser extends Context.Service<CurrentUser, SessionUser>()(
  '@repo/api/CurrentUser'
) {}

/** Requires a valid session cookie; provides CurrentUser. */
export class Authentication extends HttpApiMiddleware.Service<
  Authentication,
  { provides: CurrentUser; requires: never }
>()('@repo/api/Authentication', {
  security: { session: sessionCookie },
  error: Unauthorized,
}) {}
