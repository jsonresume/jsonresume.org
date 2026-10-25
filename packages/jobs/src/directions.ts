import type { Direction } from '@repo/api';
import { Predicate } from 'effect';
import type { Ranked } from './matcher';
import { companyOf, toSummary } from './summary';

/**
 * Kinds of role, by what a job title says, first match wins: from the most
 * specific (founding, management) to the broad (software engineer).
 */
const FAMILIES: ReadonlyArray<[name: string, pattern: RegExp]> = [
  ['Founding engineer', /\bfounding\b/i],
  [
    'Engineering leadership',
    /\b(manager|head of|director|vp|cto|lead engineer|tech lead|team lead)\b/i,
  ],
  [
    'Staff and principal engineer',
    /\b(staff|principal|distinguished|architect)\b/i,
  ],
  [
    'AI and machine learning',
    /\b(ai|ml|machine learning|llm|applied scientist|research (engineer|scientist)|computer vision|nlp)\b/i,
  ],
  [
    'Data engineering',
    /\b(data (engineer|platform|infrastructure)|analytics engineer|etl)\b/i,
  ],
  ['Data science and analytics', /\b(data scien|analyst|analytics|quant)/i],
  [
    'Infrastructure and DevOps',
    /\b(devops|sre|site reliability|platform|infrastructure|cloud|kubernetes)\b/i,
  ],
  ['Security', /\b(security|appsec|offensive)\b/i],
  ['Mobile', /\b(ios|android|mobile|react native|flutter)\b/i],
  ['Frontend', /\b(front[- ]?end|ui engineer|web engineer)\b/i],
  ['Backend', /\b(back[- ]?end|api|distributed systems)\b/i],
  [
    'Full-stack and product engineering',
    /\b(full[- ]?stack|product engineer)\b/i,
  ],
  [
    'Embedded and hardware',
    /\b(embedded|firmware|hardware|robotics|fpga|electrical)\b/i,
  ],
  ['Design', /\b(design|ux|ui\b)/i],
  ['Product management', /\b(product manager|product owner|pm\b)/i],
  [
    'Sales, success and operations',
    /\b(sales|account executive|customer|success|operations|recruit|marketing|growth)\b/i,
  ],
  ['Software engineering', /\b(engineer|developer|programmer|swe)\b/i],
];

export const familyOf = (title: string): string =>
  FAMILIES.find(([, pattern]) => pattern.test(title))?.[0] ?? 'Other roles';

const str = (v: unknown) =>
  Predicate.isString(v) ? v.trim().toLowerCase() : '';
const at = (o: unknown, key: string): unknown =>
  Predicate.isObject(o) ? (o as Record<string, unknown>)[key] : undefined;

/** Every skill and keyword the resume names, lower-cased. */
export const resumeSkills = (resume: unknown): Set<string> => {
  const skills = Array.isArray(at(resume, 'skills'))
    ? (at(resume, 'skills') as unknown[])
    : [];
  const words = skills.flatMap((s) => [
    str(at(s, 'name')),
    ...(Array.isArray(at(s, 'keywords'))
      ? (at(s, 'keywords') as unknown[]).map(str)
      : []),
  ]);
  return new Set(words.filter(Boolean));
};

const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] ?? null : null;
};

/** How many of the best-fitting jobs a direction is drawn from. */
const POOL = 150;

/**
 * The directions a resume could go now: the best-fitting open jobs grouped
 * by kind of role, each with how well it fits, what it pays, how often it's
 * remote, and the skills it asks for that the resume doesn't show.
 */
export const careerDirections = (
  ranked: ReadonlyArray<Ranked>,
  resume: unknown
): Direction[] => {
  const have = resumeSkills(resume);
  const groups = new Map<string, Ranked[]>();
  for (const r of [...ranked]
    .sort((a, b) => b.score - a.score)
    .slice(0, POOL)) {
    const family = familyOf(r.row.posting.title);
    groups.set(family, [...(groups.get(family) ?? []), r]);
  }
  return [...groups.entries()]
    .map(([name, jobs]): Direction => {
      const demand = new Map<string, { label: string; count: number }>();
      for (const { row } of jobs) {
        for (const skill of row.posting.skills) {
          const key = skill.name.toLowerCase();
          const entry = demand.get(key) ?? { label: skill.name, count: 0 };
          demand.set(key, { ...entry, count: entry.count + 1 });
        }
      }
      const skills = [...demand.entries()].sort(
        (a, b) => b[1].count - a[1].count
      );
      const pay = jobs.flatMap(({ row: { posting: p } }) =>
        p.salaryMax ?? p.salaryMin ? [p.salaryMax ?? p.salaryMin ?? 0] : []
      );
      const remote = jobs.filter(({ row }) =>
        ['remote_region', 'remote_global'].includes(row.posting.remote)
      ).length;
      return {
        name,
        jobs: jobs.length,
        bestFit: Math.max(...jobs.map((j) => j.score)),
        typicalFit: median(jobs.map((j) => j.score)) ?? 0,
        medianPay: median(pay),
        remoteShare: Math.round((100 * remote) / jobs.length),
        skillsAsked: skills.slice(0, 8).map(([, s]) => s.label),
        skillsToAdd: skills
          .filter(([key]) => !have.has(key))
          .slice(0, 5)
          .map(([, s]) => s.label),
        companies: [
          ...new Set(jobs.map((j) => companyOf(j.row.posting)).filter(Boolean)),
        ].slice(0, 4),
        examples: jobs
          .slice(0, 3)
          .map((j) => ({ ...toSummary(j.row), score: j.score, mark: j.mark })),
      };
    })
    .filter((d) => d.jobs >= 2)
    .sort(
      (a, b) =>
        b.bestFit + b.typicalFit + b.jobs - (a.bestFit + a.typicalFit + a.jobs)
    );
};
