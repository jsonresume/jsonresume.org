import { Schema } from 'effect';
import {
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiMiddleware,
  HttpApiSecurity,
} from 'effect/http-api';
import { CurrentUser } from './Authentication';

/*
 * /api/v1: the registry's API, as the jobs CLI (@jsonresume/jobs) and the
 * jsonresume-hunt skill call it. Errors carry `error`, which the CLI shows.
 */

export class V1Unauthorized extends Schema.TaggedError<V1Unauthorized>()(
  'V1Unauthorized',
  { error: Schema.String },
  { httpApiStatus: 401 }
) {}
export class V1NotFound extends Schema.TaggedError<V1NotFound>()(
  'V1NotFound',
  { error: Schema.String },
  { httpApiStatus: 404 }
) {}
export class V1BadRequest extends Schema.TaggedError<V1BadRequest>()(
  'V1BadRequest',
  { error: Schema.String },
  { httpApiStatus: 400 }
) {}
export class V1TooMany extends Schema.TaggedError<V1TooMany>()(
  'V1TooMany',
  { error: Schema.String },
  { httpApiStatus: 429 }
) {}
/** A registry feature not ported yet. */
export class V1NotYet extends Schema.TaggedError<V1NotYet>()(
  'V1NotYet',
  { error: Schema.String },
  { httpApiStatus: 501 }
) {}

/** An API key from jsonresume.org (Settings, API keys) as a Bearer token. */
export class ApiKeyAuthentication extends HttpApiMiddleware.Service<
  ApiKeyAuthentication,
  { provides: CurrentUser; requires: never }
>()('@repo/api/ApiKeyAuthentication', {
  security: { bearer: HttpApiSecurity.bearer },
  error: V1Unauthorized,
}) {}

const Text = Schema.NullOr(Schema.String);

/** A job as the registry's API served it. */
export const V1Job = Schema.Struct({
  id: Schema.Number,
  uuid: Schema.String,
  title: Schema.String,
  company: Schema.String,
  location: Schema.Struct({ city: Text, region: Text, countryCode: Text }),
  /** "Full", "Hybrid" or "None". */
  remote: Text,
  global_remote: Schema.Boolean,
  salary: Text,
  /** Annual USD, the top of the stated range. */
  salary_usd: Schema.NullOr(Schema.Number),
  experience: Text,
  type: Text,
  description: Schema.String,
  skills: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      level: Text,
      keywords: Schema.Array(Schema.String),
    })
  ),
  qualifications: Schema.Array(Schema.String),
  responsibilities: Schema.Array(Schema.String),
  url: Schema.String,
  posted_at: Schema.String,
  facets: Schema.Record(Schema.String, Schema.Unknown),
  repost: Schema.NullOr(Schema.Struct({ months: Schema.Number })),
  similarity: Schema.Number,
  /** What lists are ordered by, 0 to 1. */
  score: Schema.Number,
  tier: Schema.NullOr(Schema.Literals(['strong', 'good', 'stretch'])),
  state: Text,
  has_dossier: Schema.Boolean,
});
export type V1Job = typeof V1Job.Type;

const JobList = Schema.Struct({
  jobs: Schema.Array(V1Job),
  total: Schema.Number,
});

const flag = Schema.optional(Schema.String);
const JobQuery = {
  top: flag,
  days: flag,
  remote: flag,
  global_remote: flag,
  min_salary: flag,
  search: flag,
  search_id: flag,
  rerank: flag,
  hyde: flag,
  include_unknown_salary: flag,
};
const id = { id: Schema.NumberFromString };

export class V1Api extends HttpApiGroup.make('v1')
  .add(
    HttpApiEndpoint.get('me', '/me', {
      success: Schema.Struct({
        username: Schema.String,
        resume: Schema.Unknown,
      }),
    }),
    HttpApiEndpoint.put('saveResume', '/resume', {
      payload: Schema.Unknown,
      success: Schema.Struct({
        username: Schema.String,
        message: Schema.String,
      }),
      error: V1BadRequest,
    }),
    HttpApiEndpoint.get('jobs', '/jobs', {
      query: JobQuery,
      success: JobList,
      error: [V1NotFound, V1NotYet],
    }),
    HttpApiEndpoint.get('job', '/jobs/:id', {
      params: id,
      success: V1Job,
      error: V1NotFound,
    }),
    HttpApiEndpoint.put('mark', '/jobs/:id', {
      params: id,
      payload: Schema.Struct({
        state: Schema.NullOr(Schema.String),
        feedback: Schema.optional(Schema.NullOr(Schema.String)),
      }),
      success: Schema.Struct({ id: Schema.Number, state: Text }),
      error: [V1NotFound, V1BadRequest],
    }),
    HttpApiEndpoint.patch('enrich', '/jobs/:id', {
      params: id,
      payload: Schema.Unknown,
      success: Schema.Struct({ updated: Schema.Boolean }),
    }),
    HttpApiEndpoint.get('dossier', '/jobs/:id/dossier', {
      params: id,
      error: V1NotFound,
    }),
    HttpApiEndpoint.put('saveDossier', '/jobs/:id/dossier', {
      params: id,
      payload: Schema.Unknown,
      error: V1NotYet,
    }),
    HttpApiEndpoint.get('searches', '/searches', {
      success: Schema.Struct({ searches: Schema.Array(Schema.Unknown) }),
    }),
    HttpApiEndpoint.post('createSearch', '/searches', {
      payload: Schema.Unknown,
      error: V1NotYet,
    })
  )
  .middleware(ApiKeyAuthentication)
  .prefix('/v1') {}

/** Matching a resume sent in the body, for the CLI's local mode: no key needed. */
export class V1PublicApi extends HttpApiGroup.make('v1Public')
  .add(
    HttpApiEndpoint.post('matchResume', '/jobs', {
      payload: Schema.Struct({
        resume: Schema.Unknown,
        top: Schema.optional(Schema.Unknown),
        days: Schema.optional(Schema.Unknown),
        remote: Schema.optional(Schema.Unknown),
        global_remote: Schema.optional(Schema.Unknown),
        min_salary: Schema.optional(Schema.Unknown),
        search: Schema.optional(Schema.Unknown),
      }),
      success: JobList,
      error: [V1BadRequest, V1TooMany],
    })
  )
  .prefix('/v1') {}
