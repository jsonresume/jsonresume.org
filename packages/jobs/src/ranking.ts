import type { JobMark, Seniority } from '@repo/api';
import { companyKey } from './families';
import { eligibility, type Eligibility } from './eligibility';
import { fitLimit } from './level';
import type { JobRow } from './summary';
import { dot } from './vectors';

/** An open job against a resume: how well it fits, and why. */
export interface Ranked {
  row: JobRow;
  /** Cosine between the resume and the job. */
  cosine: number;
  /** Retrieval order: the cosine, nudged by the user's marks. */
  order: number;
  /** The fit, 0 to 100: the model's when judged, else from the cosine; capped. */
  score: number;
  mark: JobMark | null;
  eligible: Eligibility;
  /** The post's role that fits best, when the model judged it. */
  role: string | null;
  /** Why it fits (or doesn't), when the model judged it. */
  why: string | null;
  /** What capped the score: pay, level, where it is. */
  limits: ReadonlyArray<string>;
}

/** An open job as matching reads it. */
export interface OpenJob {
  row: JobRow;
  vector: Float32Array;
  text: string;
}

export interface JudgedFit {
  score: number;
  role: string;
  why: string;
}

/** Jobs the model judges per resume: the best this many by retrieval. */
export const POOL = 150;

/**
 * Cosine between a resume and a job, as a 0 to 100 fit. Measured on the
 * October 2026 board: a resume's best jobs sit near 0.6 (85 to 90), its
 * 50th near 0.52 (about 55).
 */
const FLOOR = 0.35;
const CEILING = 0.65;
export const fitScore = (cosine: number) =>
  Math.round(
    100 * Math.min(1, Math.max(0, (cosine - FLOOR) / (CEILING - FLOOR)))
  );

/**
 * Every job the candidate could take (none the post rules out for their
 * country), in retrieval order: the jobs worth asking the model about.
 */
export const retrieve = (
  open: ReadonlyArray<OpenJob>,
  base: Float32Array,
  query: Float32Array,
  country: string | undefined
) =>
  open
    .map((job) => ({
      job,
      cosine: dot(base, job.vector),
      order: dot(query, job.vector),
      eligible: eligibility(job.row.posting, country),
      // Without the candidate's country, nothing is capped for where it is.
      placed: country !== undefined,
    }))
    .filter((r) => r.eligible !== 'no')
    .sort((a, b) => b.order - a.order);

/**
 * The final list: the model's fit where it judged the job (else the
 * cosine's), capped by pay, level and place, nudged by the user's marks,
 * best first. A role posted twice (a new post, same company and role)
 * shows once.
 */
export const finish = (
  retrieved: ReturnType<typeof retrieve>,
  fits: ReadonlyMap<number, JudgedFit>,
  level: Seniority,
  markOf: ReadonlyMap<number, JobMark>
): Ranked[] => {
  const ranked = retrieved.map(({ job, cosine, order, eligible, placed }) => {
    const fit = fits.get(job.row.id);
    const { cap, notes } = fitLimit(
      job.row.posting,
      level,
      placed ? eligible : 'yes'
    );
    const score = Math.min(fit ? fit.score : fitScore(cosine), cap);
    // Marks move a job a few points: the fit stays the resume's own.
    const nudge = Math.max(-8, Math.min(8, 100 * (order - cosine)));
    return {
      sortBy: score + nudge,
      ranked: {
        row: job.row,
        cosine,
        order,
        score,
        mark: markOf.get(job.row.id) ?? null,
        eligible,
        role: fit?.role ?? null,
        why: fit?.why ?? null,
        limits: notes,
      } satisfies Ranked,
    };
  });
  ranked.sort((a, b) => b.sortBy - a.sortBy);
  const seen = new Set<string>();
  return ranked.flatMap(({ ranked: r }) => {
    const p = r.row.posting;
    const key = `${companyKey(p.company)}\n${(
      r.role ?? p.title
    ).toLowerCase()}`;
    if (seen.has(key) && r.mark === null) return [];
    seen.add(key);
    return [r];
  });
};
