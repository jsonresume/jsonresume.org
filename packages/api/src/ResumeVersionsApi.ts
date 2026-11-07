import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { Authentication } from './Authentication';
import {
  GistPermissionNeeded,
  GithubUnreachable,
  InvalidResume,
  VersionNotFound,
} from './errors';

/**
 * Who made a version: the user, an app (OAuth client or API key), an
 * assistant (MCP), or a restore. `id` is the client or key id; `name`
 * what to call it ("Claude", the key's name).
 */
export const VersionActor = Schema.Struct({
  kind: Schema.Literals(['user', 'app', 'assistant', 'restore']),
  id: Schema.NullOr(Schema.String),
  name: Schema.NullOr(Schema.String),
});
export type VersionActor = typeof VersionActor.Type;

/** One field that differs, at a path like `work[0].highlights`. */
export const VersionChange = Schema.Struct({
  path: Schema.String,
  kind: Schema.Literals(['added', 'removed', 'changed']),
});
export type VersionChange = typeof VersionChange.Type;

const versionFields = {
  version: Schema.Number,
  /** ISO 8601. */
  createdAt: Schema.String,
  actor: VersionActor,
  note: Schema.NullOr(Schema.String),
};

/** A version in the history: what changed since the one before. */
export const ResumeVersionSummary = Schema.Struct({
  ...versionFields,
  /** The first few changes; `changeCount` says how many in all. */
  changes: Schema.Array(VersionChange),
  changeCount: Schema.Number,
});
export type ResumeVersionSummary = typeof ResumeVersionSummary.Type;

/** A page of history, newest first; `next` is the `before` for the next page. */
export const ResumeVersionPage = Schema.Struct({
  versions: Schema.Array(ResumeVersionSummary),
  next: Schema.NullOr(Schema.Number),
});
export type ResumeVersionPage = typeof ResumeVersionPage.Type;

/** One version, with the resume as it was saved. */
export const ResumeVersion = Schema.Struct({
  ...versionFields,
  resume: Schema.Unknown,
});
export type ResumeVersion = typeof ResumeVersion.Type;

export const ResumeVersionDiff = Schema.Struct({
  from: Schema.Number,
  to: Schema.Number,
  changes: Schema.Array(VersionChange),
});
export type ResumeVersionDiff = typeof ResumeVersionDiff.Type;

/** A restore: the version it brought back, and the one it saved (null when already current). */
export const RestoredVersion = Schema.Struct({
  restored: Schema.Number,
  version: Schema.NullOr(Schema.Number),
});
export type RestoredVersion = typeof RestoredVersion.Type;

const version = { version: Schema.NumberFromString };

/** The signed-in user's resume history (VER-1): list, read, compare, restore. */
export class ResumeVersionsApi extends HttpApiGroup.make('resumeVersions')
  .add(
    HttpApiEndpoint.get('list', '/', {
      query: {
        before: Schema.optional(Schema.NumberFromString),
        limit: Schema.optional(Schema.NumberFromString),
      },
      success: ResumeVersionPage,
    }),
    /** From `from` (0: an empty resume; default the one before `to`) to `to`. */
    HttpApiEndpoint.get('diff', '/diff', {
      query: {
        from: Schema.optional(Schema.NumberFromString),
        to: Schema.NumberFromString,
      },
      success: ResumeVersionDiff,
      error: VersionNotFound,
    }),
    HttpApiEndpoint.get('get', '/:version', {
      params: version,
      success: ResumeVersion,
      error: VersionNotFound,
    }),
    /** Saves the version's JSON again as the newest (to the gist when it feeds the page). */
    HttpApiEndpoint.post('restore', '/:version/restore', {
      params: version,
      success: RestoredVersion,
      error: [
        VersionNotFound,
        InvalidResume,
        GistPermissionNeeded,
        GithubUnreachable,
      ],
    })
  )
  .middleware(Authentication)
  .prefix('/resume/versions') {}
