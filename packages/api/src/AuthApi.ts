import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { Authentication, SessionUser } from './Authentication';
import {
  EmailTaken,
  GithubUnreachable,
  InvalidCredentials,
  InvalidLink,
  NoPendingSignup,
  TooManyAttempts,
  UsernameUnavailable,
} from './errors';

export const Email = Schema.String.pipe(
  Schema.check(Schema.isMaxLength(254)),
  Schema.check(Schema.isPattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
);
/** Long rather than complicated: at least 10 characters. */
export const Password = Schema.String.pipe(
  Schema.check(Schema.isMinLength(10)),
  Schema.check(Schema.isMaxLength(200))
);

export const UsernameCheck = Schema.Struct({
  available: Schema.Boolean,
  reason: Schema.optionalKey(
    Schema.Literals(['invalid', 'reserved', 'taken', 'github'])
  ),
});

/** A GitHub sign-in waiting for its user to choose a username. */
export const PendingGithub = Schema.Struct({
  login: Schema.String,
  avatarUrl: Schema.NullOr(Schema.String),
});

/**
 * Signing up, in and out. GitHub's OAuth redirects (/api/auth/github and its
 * callback) are plain routes on the server, not part of this contract.
 */
export class AuthApi extends HttpApiGroup.make('auth')
  .add(
    HttpApiEndpoint.get('session', '/session', {
      success: SessionUser,
    }).middleware(Authentication),
    HttpApiEndpoint.post('signUp', '/signup', {
      payload: Schema.Struct({
        email: Email,
        password: Password,
        username: Schema.String,
      }),
      success: SessionUser,
      error: [
        UsernameUnavailable,
        EmailTaken,
        GithubUnreachable,
        TooManyAttempts,
      ],
    }),
    HttpApiEndpoint.post('signIn', '/signin', {
      payload: Schema.Struct({ email: Schema.String, password: Schema.String }),
      success: SessionUser,
      error: [InvalidCredentials, TooManyAttempts],
    }),
    HttpApiEndpoint.post('signOut', '/signout', {}),
    HttpApiEndpoint.get('checkUsername', '/username', {
      query: { name: Schema.String },
      success: UsernameCheck,
      error: GithubUnreachable,
    }),
    HttpApiEndpoint.get('pendingGithub', '/github/pending', {
      success: PendingGithub,
      error: NoPendingSignup,
    }),
    HttpApiEndpoint.post('completeGithub', '/github/complete', {
      payload: Schema.Struct({ username: Schema.String }),
      success: SessionUser,
      error: [UsernameUnavailable, NoPendingSignup, GithubUnreachable],
    }),
    HttpApiEndpoint.post('resendVerification', '/verify/resend', {}).middleware(
      Authentication
    ),
    /** Emails a reset link if an account uses the address; 204 either way. */
    HttpApiEndpoint.post('forgotPassword', '/password/forgot', {
      payload: Schema.Struct({ email: Schema.String }),
      error: TooManyAttempts,
    }),
    HttpApiEndpoint.post('resetPassword', '/password/reset', {
      payload: Schema.Struct({ token: Schema.String, password: Password }),
      success: SessionUser,
      error: [InvalidLink, TooManyAttempts],
    })
  )
  .prefix('/auth') {}
