import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { Authentication } from './Authentication';
import {
  GistPermissionNeeded,
  GithubUnreachable,
  InvalidResume,
} from './errors';
import { VersionActor, VersionChange } from './ResumeVersionsApi';

/** A change an app or assistant suggested, and what it would change now. */
export const ProposalSummary = Schema.Struct({
  id: Schema.String,
  by: VersionActor,
  note: Schema.NullOr(Schema.String),
  createdAt: Schema.String,
  changes: Schema.Array(VersionChange),
});
export type ProposalSummary = typeof ProposalSummary.Type;

/** No pending proposal with that id on the signed-in account. */
export class ProposalNotFound extends Schema.TaggedError<ProposalNotFound>()(
  'ProposalNotFound',
  {},
  { httpApiStatus: 404 }
) {}

const id = { id: Schema.String };

/**
 * Proposals waiting for the signed-in person: accept one (saved as a new
 * version, credited to whoever proposed it) or reject it.
 */
export class ProposalsApi extends HttpApiGroup.make('proposals')
  .add(
    HttpApiEndpoint.get('list', '/', {
      success: Schema.Array(ProposalSummary),
    }),
    HttpApiEndpoint.post('accept', '/:id/accept', {
      params: id,
      success: Schema.Struct({ version: Schema.NullOr(Schema.Number) }),
      error: [
        ProposalNotFound,
        InvalidResume,
        GistPermissionNeeded,
        GithubUnreachable,
      ],
    }),
    HttpApiEndpoint.post('reject', '/:id/reject', {
      params: id,
      error: ProposalNotFound,
    })
  )
  .middleware(Authentication)
  .prefix('/resume/proposals') {}
