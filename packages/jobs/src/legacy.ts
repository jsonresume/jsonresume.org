import { Option, Predicate, Schema } from 'effect';
import { EmploymentType, RemoteScope, Seniority } from '@repo/api';
import type { Posting } from './posting';

/** The registry's gpt_content: loosely shaped, from several prompt versions. */
const Legacy = Schema.Struct({
  title: Schema.optional(Schema.NullOr(Schema.String)),
  company: Schema.optional(Schema.NullOr(Schema.String)),
  description: Schema.optional(Schema.NullOr(Schema.String)),
  location: Schema.optional(Schema.Unknown),
  remote: Schema.optional(Schema.NullOr(Schema.String)),
  salary: Schema.optional(Schema.Unknown),
  salary_structured: Schema.optional(Schema.Unknown),
  experience: Schema.optional(Schema.NullOr(Schema.String)),
  type: Schema.optional(Schema.NullOr(Schema.String)),
  visa_sponsorship: Schema.optional(Schema.NullOr(Schema.String)),
  equity: Schema.optional(Schema.NullOr(Schema.String)),
  application: Schema.optional(Schema.NullOr(Schema.String)),
  responsibilities: Schema.optional(Schema.Unknown),
  qualifications: Schema.optional(Schema.Unknown),
  skills: Schema.optional(Schema.Unknown),
  facets: Schema.optional(Schema.Unknown),
});

const str = (v: unknown): string | null =>
  Predicate.isString(v) && v.trim() !== '' ? v.trim() : null;
const num = (v: unknown): number | null =>
  Predicate.isNumber(v) && Number.isFinite(v) && v > 0 ? Math.round(v) : null;
const field = (o: unknown, key: string): unknown =>
  Predicate.isObject(o) ? (o as Record<string, unknown>)[key] : undefined;
const strings = (v: unknown): string[] =>
  Array.isArray(v) ? v.flatMap((s) => str(s) ?? []) : [];
const oneOf = <A extends string>(
  schema: Schema.Literals<ReadonlyArray<A>>,
  v: unknown,
  fallback: A
): A => Option.getOrElse(Schema.decodeUnknownOption(schema)(v), () => fallback);

const legacyRemote = (remote: string | null | undefined): Posting['remote'] =>
  remote === 'Full'
    ? 'remote_region'
    : remote === 'Hybrid'
    ? 'hybrid'
    : remote === 'None'
    ? 'onsite'
    : 'unspecified';

const legacyEmployment = (type: string | null | undefined) => {
  const t = (type ?? '').toLowerCase();
  if (t.includes('full')) return 'full_time';
  if (t.includes('part')) return 'part_time';
  if (t.includes('contract')) return 'contract';
  if (t.includes('intern')) return 'internship';
  return 'unspecified';
};

/** A registry job's parsed JSON as a Posting; none when it lacks a title or company. */
export const fromLegacy = (json: string): Option.Option<Posting> => {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return Option.none();
  }
  return Schema.decodeUnknownOption(Legacy)(raw).pipe(
    Option.flatMap((j) => {
      const title = str(j.title);
      const company = str(j.company);
      if (!title || !company) return Option.none();
      const facets = j.facets;
      const stated = field(facets, 'salary_provenance') === 'stated';
      const visa = (j.visa_sponsorship ?? '').toLowerCase();
      return Option.some({
        title,
        company,
        summary: str(j.description) ?? '',
        city: str(field(j.location, 'city')),
        region: str(field(j.location, 'region')),
        countryCode: str(field(j.location, 'countryCode')),
        remote: oneOf(
          RemoteScope,
          field(facets, 'remote_scope'),
          legacyRemote(j.remote)
        ),
        remoteRegions: strings(field(facets, 'remote_regions')),
        timezones: str(field(facets, 'timezone_range')),
        seniority: oneOf(Seniority, field(facets, 'seniority'), 'unspecified'),
        employmentType: oneOf(
          EmploymentType,
          field(facets, 'employment_type'),
          legacyEmployment(j.type)
        ),
        salary: str(j.salary),
        salaryMin: stated ? num(field(j.salary_structured, 'min')) : null,
        salaryMax: stated ? num(field(j.salary_structured, 'max')) : null,
        visa: visa === 'yes' ? 'yes' : visa === 'no' ? 'no' : 'unspecified',
        equity: str(j.equity),
        skills: Array.isArray(j.skills)
          ? j.skills.flatMap((s: unknown) => {
              const name = str(field(s, 'name'));
              return name
                ? [{ name, keywords: strings(field(s, 'keywords')) }]
                : [];
            })
          : [],
        responsibilities: strings(j.responsibilities),
        qualifications: strings(j.qualifications),
        apply: str(j.application),
      } satisfies Posting);
    })
  );
};
