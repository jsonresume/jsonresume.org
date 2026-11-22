import { Schema } from 'effect';
import { EmploymentType, RemoteScope, Seniority } from './jobFacets';

const Text = Schema.String;

/**
 * A job as a job-schema v1 document (`@jsonresume/schema/job-schema.json`,
 * #353): the post's display text plus the facets tools filter on. Pay stays
 * the post's own words in `salary`; the board's USD figures are derived and
 * not part of the document.
 */
export const JobDocument = Schema.Struct({
  $schema: Text,
  title: Schema.optionalKey(Text),
  company: Schema.optionalKey(Text),
  type: Schema.optionalKey(Text),
  date: Text,
  description: Schema.optionalKey(Text),
  location: Schema.optionalKey(
    Schema.Struct({
      city: Schema.optionalKey(Text),
      region: Schema.optionalKey(Text),
      countryCode: Schema.optionalKey(Text),
    })
  ),
  remote: Schema.optionalKey(Schema.Literals(['Full', 'Hybrid', 'None'])),
  salary: Schema.optionalKey(Text),
  experience: Schema.optionalKey(Text),
  facets: Schema.Struct({
    remoteScope: RemoteScope,
    remoteRegions: Schema.optionalKey(Schema.Array(Text)),
    timezoneRange: Schema.optionalKey(Text),
    seniority: Seniority,
    employmentType: EmploymentType,
    visaSponsorship: Schema.Literals(['yes', 'no', 'unspecified']),
    salaryProvenance: Schema.Literals(['stated', 'inferred', 'absent']),
  }),
  responsibilities: Schema.Array(Text),
  qualifications: Schema.Array(Text),
  skills: Schema.Array(
    Schema.Struct({ name: Text, keywords: Schema.Array(Text) })
  ),
  meta: Schema.Struct({ canonical: Text, lastModified: Text }),
});
export type JobDocument = typeof JobDocument.Type;
