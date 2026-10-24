import { expect, it } from 'vitest';
import type { Ranked } from './matcher';
import { posting } from './test/fixtures';
import { toV1Job, v1Options, v1Select } from './v1';

const now = Date.parse('2026-10-24T00:00:00Z');
const ranked = (id: number, days: number, p = {}): Ranked => ({
  row: {
    id,
    posting: posting(p),
    postedAt: new Date(now - days * 86_400_000),
    months: 1,
  },
  cosine: 0.5,
  score: 67,
  mark: null,
});
const jobs = [
  ranked(1, 5, {
    remote: 'remote_region',
    remoteRegions: ['US'],
    salaryMax: 200_000,
  }),
  ranked(2, 10, { remote: 'remote_global', title: 'Rust Engineer' }),
  ranked(3, 40, { remote: 'onsite' }),
];

it('reads the registry options with its defaults and caps', () => {
  expect(v1Options({})).toMatchObject({ top: 20, days: 90, remote: false });
  expect(
    v1Options({ top: '900', days: '7', min_salary: '150', remote: 'true' })
  ).toMatchObject({ top: 500, days: 7, minSalary: 150, remote: true });
});

it('filters by age, remote, pay and words, global remote first', () => {
  const ids = (raw: Record<string, unknown>) =>
    v1Select(jobs, v1Options(raw), now).map((r) => r.row.id);
  expect(ids({})).toEqual([1, 2, 3]);
  expect(ids({ days: '30' })).toEqual([1, 2]);
  expect(ids({ remote: 'true' })).toEqual([1, 2]);
  expect(ids({ global_remote: 'true' })).toEqual([2, 1]);
  expect(ids({ min_salary: '150' })).toEqual([1]);
  expect(ids({ search: 'rust' })).toEqual([2]);
});

it('answers in the registry API’s shape', () => {
  const job = toV1Job(jobs[0] as Ranked);
  expect(job).toMatchObject({
    id: 1,
    uuid: '1',
    remote: 'Full',
    global_remote: false,
    salary_usd: 200_000,
    url: 'https://news.ycombinator.com/item?id=1',
    score: 0.67,
    tier: 'good',
    facets: { remote_scope: 'remote_region', remote_regions: ['US'] },
  });
});
