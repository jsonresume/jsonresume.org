import { Schema } from 'effect';
import { HttpApiEndpoint, HttpApiGroup } from 'effect/http-api';
import { JobSummary } from './JobsApi';

const Text = Schema.String;

/** No company of that name has jobs on the board. */
export class CompanyNotFound extends Schema.TaggedError<CompanyNotFound>()(
  'CompanyNotFound',
  {},
  { httpApiStatus: 404 }
) {}

/**
 * A company as a company-schema document
 * (`@jsonresume/schema/company-schema.json`), built from its posts on the
 * board: only what the posts state, so most fields are often absent.
 */
export const CompanyDocument = Schema.Struct({
  $schema: Text,
  name: Text,
  url: Schema.optionalKey(Text),
  remote: Schema.optionalKey(Schema.Literals(['Full', 'Hybrid', 'None'])),
  locations: Schema.optionalKey(
    Schema.Array(
      Schema.Struct({
        city: Schema.optionalKey(Text),
        region: Schema.optionalKey(Text),
        countryCode: Schema.optionalKey(Text),
      })
    )
  ),
  technologies: Schema.optionalKey(Schema.Array(Text)),
  meta: Schema.Struct({ canonical: Text, lastModified: Text }),
});
export type CompanyDocument = typeof CompanyDocument.Type;

/** A company and its open jobs on the board. */
export const CompanyProfile = Schema.Struct({
  slug: Text,
  company: CompanyDocument,
  jobs: Schema.Array(JobSummary),
});
export type CompanyProfile = typeof CompanyProfile.Type;

/** Companies hiring on the job board, open to everyone. */
export class CompaniesApi extends HttpApiGroup.make('companies')
  .add(
    HttpApiEndpoint.get('company', '/:slug', {
      params: { slug: Text },
      success: CompanyProfile,
      error: CompanyNotFound,
    }),
    /** Just the company-schema document. */
    HttpApiEndpoint.get('document', '/:slug/document', {
      params: { slug: Text },
      success: CompanyDocument,
      error: CompanyNotFound,
    })
  )
  .prefix('/companies') {}
