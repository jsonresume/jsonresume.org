import type { V1Job } from '@repo/api';
import { Predicate } from 'effect';
import type { Ranked } from './matcher';
import { companyOf, type JobRow } from './summary';

/** The registry API's options, from a query string or a JSON body. */
export interface V1Options {
  top: number;
  days: number;
  remote: boolean;
  globalRemote: boolean;
  /** Thousands of USD a year, as the CLI sends it. */
  minSalary: number;
  search: string;
}

const int = (v: unknown, fallback: number) => {
  const n = Predicate.isNumber(v) ? v : Number.parseInt(String(v ?? ''), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};
const yes = (v: unknown) => v === true || v === 'true';

/** Defaults and caps as the registry had them. */
export const v1Options = (
  raw: Record<string, unknown>,
  caps: { top: number; days: number } = { top: 500, days: 120 }
): V1Options => ({
  top: Math.min(int(raw.top, 20), caps.top),
  days: Math.min(int(raw.days, 90), caps.days),
  remote: yes(raw.remote),
  globalRemote: yes(raw.global_remote),
  minSalary: int(raw.min_salary, 0),
  search: Predicate.isString(raw.search) ? raw.search.toLowerCase() : '',
});

const legacyRemote = (r: JobRow['posting']['remote']) =>
  r === 'remote_global' || r === 'remote_region'
    ? 'Full'
    : r === 'hybrid'
    ? 'Hybrid'
    : r === 'onsite'
    ? 'None'
    : null;

const tier = (score: number) =>
  score >= 70
    ? 'strong'
    : score >= 50
    ? 'good'
    : score >= 35
    ? 'stretch'
    : null;

/** Ranked jobs the options allow, best first, `top` of them. */
export const v1Select = (
  ranked: ReadonlyArray<Ranked>,
  o: V1Options,
  now = Date.now()
): Ranked[] => {
  const since = now - o.days * 86_400_000;
  const words = o.search.split(/\s+/).filter(Boolean);
  const fits = ranked.filter(({ row: { posting: p, postedAt } }) => {
    if (postedAt.getTime() < since) return false;
    if (o.remote || o.globalRemote) {
      if (p.remote !== 'remote_region' && p.remote !== 'remote_global')
        return false;
    }
    const pay = p.salaryMax ?? p.salaryMin;
    if (o.minSalary > 0 && (pay === null || pay < o.minSalary * 1000))
      return false;
    const text = [p.title, p.company, p.summary, ...p.skills.map((s) => s.name)]
      .join(' ')
      .toLowerCase();
    return words.every((w) => text.includes(w));
  });
  // Global remote is a preference: those first, other remote jobs after.
  const ordered = o.globalRemote
    ? [
        ...fits.filter((r) => r.row.posting.remote === 'remote_global'),
        ...fits.filter((r) => r.row.posting.remote !== 'remote_global'),
      ]
    : fits;
  return ordered.slice(0, o.top);
};

/** A job in the registry API's shape. */
export const toV1Job = ({ row, cosine, score, mark }: Ranked): V1Job => {
  const p = row.posting;
  return {
    id: row.id,
    uuid: String(row.id),
    title: p.title,
    company: companyOf(p),
    location: { city: p.city, region: p.region, countryCode: p.countryCode },
    remote: legacyRemote(p.remote),
    global_remote: p.remote === 'remote_global',
    salary: p.salary,
    salary_usd: p.salaryMax ?? p.salaryMin,
    experience: p.seniority === 'unspecified' ? null : p.seniority,
    type: p.employmentType === 'unspecified' ? null : p.employmentType,
    description: p.summary,
    skills: p.skills.map((s) => ({ ...s, level: null })),
    qualifications: p.qualifications,
    responsibilities: p.responsibilities,
    url: `https://news.ycombinator.com/item?id=${row.id}`,
    posted_at: row.postedAt.toISOString(),
    facets: {
      remote_scope: p.remote,
      remote_regions: p.remoteRegions,
      timezone_range: p.timezones,
      seniority: p.seniority,
      salary_provenance: p.salaryMin ?? p.salaryMax ? 'stated' : 'absent',
      visa_sponsorship: p.visa,
      employment_type: p.employmentType,
    },
    repost: row.months > 1 ? { months: row.months } : null,
    similarity: Math.round(cosine * 1000) / 1000,
    score: score / 100,
    tier: tier(score),
    state: mark,
    has_dossier: false,
  };
};
