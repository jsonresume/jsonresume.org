import type { DecisionReason, JobPreferences, Seniority } from '@repo/api';
import type { Eligibility } from '../eligibility';
import type { CompanyFacts } from '../facts';
import type { Posting } from '../posting';

/** A skill the job's role asks for, by its skillKey. */
export interface Need {
  key: string;
  name: string;
  need: 'required' | 'nice';
  years: number | null;
}

/** A skill the resume shows: how strongly (0 to 1, depth and recency) and for how many years. */
export interface Shown {
  weight: number;
  years: number;
}

/** Everything one job's decision is made from. */
export interface DecisionInput {
  posting: Posting;
  facts: CompanyFacts;
  eligible: Eligibility;
  /** The candidate's country is known, so where a job is can be judged. */
  placed: boolean;
  /** The model's fit, 0 to 100, once it has judged the post. */
  fit: number | null;
  cosine: number;
  /** Retrieval order: the cosine, nudged by the person's marks. */
  order: number;
  /** What the fitting role asks for; null until the post's roles are read. */
  needs: ReadonlyArray<Need> | null;
  /** Skills the resume shows, by skillKey. */
  have: ReadonlyMap<string, Shown>;
  level: Seniority;
  preferences: JobPreferences;
  /**
   * How much closer the job is to where they want to go than the other
   * open jobs, in standard deviations (a z-score of the cosines), when
   * they've said.
   */
  direction: number | null;
}

/** A reason with how much it weighed, for ordering. */
export interface Weighed extends DecisionReason {
  weight: number;
}

export const clamp = (n: number, low = 0, high = 1) =>
  Math.min(high, Math.max(low, n));

export const usd = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : `$${Math.round(n / 1000)}k`;

/** "a, b and c". */
export const listText = (items: ReadonlyArray<string>) =>
  items.length <= 1
    ? items[0] ?? ''
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

export const SENIORITY: ReadonlyArray<Seniority> = [
  'intern',
  'junior',
  'mid',
  'senior',
  'staff_plus',
  'lead_management',
];

/** How many levels the job sits above (+) or below (−) the candidate; 0 when unknown. */
export const levelGap = (job: Seniority, candidate: Seniority) => {
  if (job === 'unspecified' || candidate === 'unspecified') return 0;
  // Leads and managers sit beside staff engineers, not above them.
  const rank = (s: Seniority) =>
    s === 'lead_management'
      ? SENIORITY.indexOf('staff_plus')
      : SENIORITY.indexOf(s);
  return rank(job) - rank(candidate);
};

/** Each value as standard deviations from the mean of them all. */
export const zScores = (values: ReadonlyArray<number>): number[] => {
  const n = values.length;
  if (n === 0) return [];
  const mean = values.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  return values.map((v) => (sd > 0 ? (v - mean) / sd : 0));
};
