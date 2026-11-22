import type { CompanyDocument } from '@repo/api';
import { homepageOf } from './postLinks';
import { skillKey } from './skillNames';
import { companyOf, type JobRow } from './summary';

const SCHEMA =
  'https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema/company-schema.json';

/** How many technologies a company document lists, most asked for first. */
const TOP_TECHNOLOGIES = 15;

export interface CompanyPost {
  readonly row: JobRow;
  readonly html: string;
}

const remote = {
  onsite: 'None',
  hybrid: 'Hybrid',
  remote_region: 'Full',
  remote_global: 'Full',
} as const;

const mostCommon = (values: readonly string[]): string | undefined => {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0];
};

/** The one policy every post states, or nothing when they differ or are silent. */
const policyOf = (posts: readonly CompanyPost[]) => {
  const stated = new Set(
    posts.map(({ row }) =>
      row.posting.remote === 'unspecified'
        ? undefined
        : remote[row.posting.remote]
    )
  );
  const [only] = stated;
  return stated.size === 1 ? only : undefined;
};

type Place = NonNullable<CompanyDocument['locations']>[number];

const placesOf = (posts: readonly CompanyPost[]): Place[] => {
  const seen = new Map<string, Place>();
  for (const { row } of posts) {
    const { city, region, countryCode } = row.posting;
    if (!city && !countryCode) continue;
    const place: Place = Object.fromEntries(
      Object.entries({ city, region, countryCode }).filter(([, v]) => v)
    );
    seen.set(JSON.stringify(place), place);
  }
  return [...seen.values()];
};

const technologiesOf = (posts: readonly CompanyPost[]) => {
  const counts = new Map<string, { name: string; count: number }>();
  for (const { row } of posts)
    for (const { name } of row.posting.skills) {
      const key = skillKey(name);
      const entry = counts.get(key) ?? { name, count: 0 };
      counts.set(key, { ...entry, count: entry.count + 1 });
    }
  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_TECHNOLOGIES)
    .map((t) => t.name);
};

/**
 * A company as a company-schema document, from its posts on the board. It
 * states only what the posts say: the name they use, the site their header
 * links, where the jobs are, a remote policy when every post agrees, and the
 * skills they ask for. Posts must be newest first.
 */
export const toCompanyDocument = (
  posts: readonly CompanyPost[],
  canonical: string
): CompanyDocument => {
  const name = mostCommon(posts.map(({ row }) => companyOf(row.posting))) ?? '';
  const url = mostCommon(posts.flatMap(({ html }) => homepageOf(html) ?? []));
  const locations = placesOf(posts);
  const technologies = technologiesOf(posts);
  const policy = policyOf(posts);
  const newest = posts[0]?.row.postedAt ?? new Date(0);
  return {
    $schema: SCHEMA,
    name,
    ...(url ? { url } : {}),
    ...(policy ? { remote: policy } : {}),
    ...(locations.length > 0 ? { locations } : {}),
    ...(technologies.length > 0 ? { technologies } : {}),
    meta: { canonical, lastModified: newest.toISOString() },
  };
};
