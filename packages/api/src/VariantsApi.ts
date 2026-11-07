import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { Authentication } from './Authentication';
import { InvalidResume, NoResume } from './errors';

/** A variant, without its resume: for lists. */
export const VariantSummary = Schema.Struct({
  slug: Schema.String,
  name: Schema.String,
  /** The job it was made for (/jobs/:id), if any. */
  jobId: Schema.NullOr(Schema.Number),
  /** Its page: /@username/<slug>. */
  path: Schema.String,
  updatedAt: Schema.String,
});
export type VariantSummary = typeof VariantSummary.Type;

export const Variant = Schema.Struct({
  ...VariantSummary.fields,
  resume: Schema.Unknown,
});
export type Variant = typeof Variant.Type;

/** No variant with that slug on the signed-in account. */
export class VariantNotFound extends Schema.TaggedError<VariantNotFound>()(
  'VariantNotFound',
  {},
  { httpApiStatus: 404 }
) {}

const slug = { slug: Schema.String };

/**
 * Variants of the signed-in account's resume: named copies, each at
 * /@username/<slug>, for a job or an audience. The resume itself is never
 * changed by them. A new one copies the resume unless given one.
 */
export class VariantsApi extends HttpApiGroup.make('variants')
  .add(
    HttpApiEndpoint.get('list', '/', {
      success: Schema.Array(VariantSummary),
    }),
    HttpApiEndpoint.post('create', '/', {
      payload: Schema.Struct({
        name: Schema.String,
        jobId: Schema.optional(Schema.NullOr(Schema.Number)),
        resume: Schema.optional(Schema.Unknown),
      }),
      success: Variant,
      error: [InvalidResume, NoResume],
    }),
    HttpApiEndpoint.get('get', '/:slug', {
      params: slug,
      success: Variant,
      error: VariantNotFound,
    }),
    HttpApiEndpoint.put('save', '/:slug', {
      params: slug,
      payload: Schema.Struct({ resume: Schema.Unknown }),
      success: Variant,
      error: [VariantNotFound, InvalidResume],
    }),
    HttpApiEndpoint.delete('delete', '/:slug', {
      params: slug,
      error: VariantNotFound,
    })
  )
  .middleware(Authentication)
  .prefix('/resume/variants') {}
