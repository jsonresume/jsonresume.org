import type { Seniority } from '@repo/api';
import { Context, type Effect } from 'effect';
import type { Family } from './families';

/* The contracts between the career graph's parts. Each is a service whose
   live layer lives in its own file; tests swap in fakes. */

/** One skill in the shared vocabulary (app.skills). */
export interface Skill {
  id: number;
  key: string;
  name: string;
}

/**
 * The shared skill vocabulary: names as resumes and posts write them,
 * resolved to one skill each ("Postgres", "PostgreSQL" and "PG" are one),
 * by alias, then by meaning (embeddings), else a new skill.
 */
export class SkillCatalog extends Context.Service<
  SkillCatalog,
  {
    /** Each name to its skill, adding skills and aliases as needed. */
    resolve(
      names: ReadonlyArray<string>
    ): Effect.Effect<ReadonlyMap<string, Skill>>;
    byIds(ids: ReadonlyArray<number>): Effect.Effect<ReadonlyArray<Skill>>;
  }
>()('@repo/careers/SkillCatalog') {}

/** A resume section entry, keyed like "work:0", "projects:3", "education:1". */
export interface ResumeEntry {
  key: string;
  section:
    | 'work'
    | 'projects'
    | 'volunteer'
    | 'education'
    | 'certificates'
    | 'publications'
    | 'awards';
  label: string;
  detail: string | null;
  startYear: number | null;
  /** null while it's current. */
  endYear: number | null;
  family: Family | null;
  seniority: Seniority | null;
}

/** That an entry shows a skill: how strongly (1 mention, 2 used, 3 led or built it) and where. */
export interface Evidence {
  entry: string;
  skill: Skill;
  strength: 1 | 2 | 3;
  lastYear: number | null;
  /** The resume's own words for it. */
  quote: string;
}

/** What the resume shows most: a theme across entries. */
export interface Strength {
  name: string;
  summary: string;
  entries: ReadonlyArray<string>;
  skills: ReadonlyArray<number>;
}

/** Education, certificates, languages: what the rest stands on. */
export interface Foundation {
  key: string;
  kind: 'education' | 'certificate' | 'language';
  label: string;
  detail: string | null;
}

export interface ResumeInsight {
  /** Hash of the resume and the extraction version (app.resume_insights). */
  key: string;
  level: Seniority;
  entries: ReadonlyArray<ResumeEntry>;
  evidence: ReadonlyArray<Evidence>;
  strengths: ReadonlyArray<Strength>;
  foundations: ReadonlyArray<Foundation>;
  /** True while the AI reading is still running: entries and foundations are there, evidence may be partial. */
  pending: boolean;
}

/**
 * What a resume shows, read once per version by a model (evidence for each
 * skill with a quote, strengths, each entry's role family) and cached.
 */
export class ResumeInsights extends Context.Service<
  ResumeInsights,
  { insight(resume: unknown): Effect.Effect<ResumeInsight> }
>()('@repo/careers/ResumeInsights') {}

export interface Requirement {
  skill: Skill;
  need: 'required' | 'nice';
  years: number | null;
}

/** One role in a job post (posts often list several). */
export interface JobRole {
  jobId: number;
  index: number;
  title: string;
  family: Family;
  seniority: Seniority;
  summary: string;
  requirements: ReadonlyArray<Requirement>;
}

/** A role family as the open jobs show it (app.role_archetypes). */
export interface Archetype {
  family: Family;
  name: string;
  summary: string;
  /** The skills its roles ask for most, with the share of roles asking. */
  skills: ReadonlyArray<{ skill: Skill; share: number }>;
  roles: number;
  payP50: number | null;
  remoteShare: number;
}

/**
 * The roles in each job post and what each requires, read by a model when a
 * post is parsed (and backfilled), and the role families they make up.
 */
export class JobRoles extends Context.Service<
  JobRoles,
  {
    rolesOf(
      jobIds: ReadonlyArray<number>
    ): Effect.Effect<ReadonlyMap<number, ReadonlyArray<JobRole>>>;
    archetypes: Effect.Effect<ReadonlyArray<Archetype>>;
  }
>()('@repo/careers/JobRoles') {}

export interface Move {
  family: Family;
  seniority: Seniority;
  people: number;
  /** Of the people who held the role they came from, the share who moved here next. */
  share: number;
  medianYears: number | null;
}

/**
 * Where people go next, learned from every public resume: titles read into
 * role families once (app.title_families), consecutive roles counted
 * (app.career_moves).
 */
export class CareerMoves extends Context.Service<
  CareerMoves,
  {
    /** The most common next roles from this one, best first. */
    from(
      family: Family,
      seniority: Seniority
    ): Effect.Effect<ReadonlyArray<Move>>;
    /** Titles to families, reading new ones with the model. */
    familiesOf(
      titles: ReadonlyArray<string>
    ): Effect.Effect<
      ReadonlyMap<string, { family: Family; seniority: Seniority }>
    >;
  }
>()('@repo/careers/CareerMoves') {}
