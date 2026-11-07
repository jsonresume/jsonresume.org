import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { Authentication } from './Authentication';
import {
  ConfirmationMismatch,
  GistPermissionNeeded,
  GithubUnreachable,
  InvalidResume,
  NoResume,
  UnknownTheme,
  UsernameUnavailable,
} from './errors';

export const ResumeSource = Schema.Literals(['gist', 'stored']);

/** The signed-in user's account and its public page. */
export class Account extends Schema.Class<Account>('@repo/api/Account')({
  username: Schema.String,
  /** The resume's path, e.g. /@thomasdavis. */
  path: Schema.String,
  /** Whether /@username is live: verified, and a resume to show. */
  public: Schema.Boolean,
  email: Schema.NullOr(Schema.String),
  emailVerified: Schema.Boolean,
  github: Schema.NullOr(
    Schema.Struct({
      login: Schema.String,
      avatarUrl: Schema.NullOr(Schema.String),
    })
  ),
  /** Where /@username reads the resume: the GitHub gist, or the copy saved here. */
  source: ResumeSource,
  hasStoredResume: Schema.Boolean,
  /** False while the server can't send email; verification links are then logged. */
  emailDelivery: Schema.Boolean,
  /** GitHub granted the gist permission, so saves go to their gist. */
  gistWrite: Schema.Boolean,
}) {}

/** Contact details an account can keep off its public page. */
export const HiddenField = Schema.Literals(['email', 'phone', 'address']);
export type HiddenField = typeof HiddenField.Type;
export const Privacy = Schema.Struct({ hidden: Schema.Array(HiddenField) });

export class AccountApi extends HttpApiGroup.make('account')
  .add(
    HttpApiEndpoint.get('get', '/', { success: Account }),
    /** Saves to their gist when it feeds the page (it stays the source), else stores the copy. */
    HttpApiEndpoint.put('saveResume', '/resume', {
      payload: Schema.Struct({ resume: Schema.Unknown }),
      success: Account,
      error: [InvalidResume, GistPermissionNeeded, GithubUnreachable],
    }),
    /** What stays off the public page (and its formats); the owner sees all. */
    HttpApiEndpoint.get('privacy', '/privacy', { success: Privacy }),
    HttpApiEndpoint.put('setPrivacy', '/privacy', {
      payload: Privacy,
      success: Privacy,
    }),
    /** The page's theme (meta.theme), from the gallery: a new version. */
    HttpApiEndpoint.put('setTheme', '/theme', {
      payload: Schema.Struct({ theme: Schema.String }),
      success: Account,
      error: [
        UnknownTheme,
        NoResume,
        InvalidResume,
        GistPermissionNeeded,
        GithubUnreachable,
      ],
    }),
    HttpApiEndpoint.put('setSource', '/source', {
      payload: Schema.Struct({ source: ResumeSource }),
      success: Account,
      error: InvalidResume,
    }),
    /** The old name redirects for 90 days, then is free. */
    HttpApiEndpoint.put('rename', '/username', {
      payload: Schema.Struct({ username: Schema.String }),
      success: Account,
      error: [UsernameUnavailable, GithubUnreachable],
    }),
    /** Deletes the account, its names and its views; `confirm` is the username. */
    HttpApiEndpoint.post('delete', '/delete', {
      payload: Schema.Struct({ confirm: Schema.String }),
      error: ConfirmationMismatch,
    })
  )
  .middleware(Authentication)
  .prefix('/account') {}
