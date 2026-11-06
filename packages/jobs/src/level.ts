import type { Seniority } from '@repo/api';
import { Predicate } from 'effect';
import type { Eligibility } from './eligibility';
import type { Posting } from './posting';

const ORDER: ReadonlyArray<Seniority> = [
  'intern',
  'junior',
  'mid',
  'senior',
  'staff_plus',
  'lead_management',
];
const rank = (s: Seniority) => ORDER.indexOf(s);

const YEAR = 365.25 * 24 * 60 * 60 * 1000;
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const at = (o: unknown, key: string): unknown =>
  Predicate.isObject(o) ? (o as Record<string, unknown>)[key] : undefined;

/**
 * A resume's level, from its titles and how long ago its first job began:
 * principal, staff, CTO or 12+ years is staff_plus; lead, senior or 6+
 * years is senior.
 */
export const resumeLevel = (resume: unknown, now: number): Seniority => {
  const work = list(at(resume, 'work'));
  const starts = work
    .map((w) => at(w, 'startDate'))
    .filter(Predicate.isString)
    .map((d) => Date.parse(d))
    .filter(Number.isFinite);
  const years = starts.length > 0 ? (now - Math.min(...starts)) / YEAR : 0;
  const titles = work
    .map((w) => at(w, 'position'))
    .filter(Predicate.isString)
    .join(' ')
    .toLowerCase();
  if (/\b(cto|chief|vp|head of|director|principal|staff)\b/.test(titles))
    return 'staff_plus';
  if (years >= 12) return 'staff_plus';
  if (/\b(lead|senior|sr)\b/.test(titles) || years >= 6) return 'senior';
  if (years >= 2) return 'mid';
  return 'junior';
};

/** Least yearly pay (USD) a level should be offered before it reads as low. */
const PAY_FLOOR: Partial<Record<Seniority, number>> = {
  senior: 70_000,
  staff_plus: 100_000,
  lead_management: 100_000,
};

/**
 * The most a job can score for this candidate, with the reasons: what the
 * fit can't see (pay, level, where the job is) caps it.
 */
export const fitLimit = (
  posting: Posting,
  level: Seniority,
  eligible: Eligibility
): { cap: number; notes: string[] } => {
  const notes: string[] = [];
  let cap = 100;
  const limit = (most: number, note: string) => {
    cap = Math.min(cap, most);
    notes.push(note);
  };
  const job = rank(posting.seniority);
  if (posting.seniority !== 'unspecified') {
    if (rank(level) >= rank('senior') && job <= rank('junior')) {
      limit(30, 'a junior role');
    } else if (rank(level) >= rank('staff_plus') && job === rank('mid')) {
      limit(55, 'a mid-level role');
    }
  }
  const floor = PAY_FLOOR[level];
  const top = posting.salaryMax ?? posting.salaryMin;
  if (floor !== undefined && top !== null && top < floor) {
    limit(40, 'pay below your level');
  }
  if (
    eligible === 'unclear' &&
    (posting.remote === 'onsite' || posting.remote === 'hybrid')
  ) {
    limit(50, 'in an office; check where');
  }
  return { cap, notes };
};
