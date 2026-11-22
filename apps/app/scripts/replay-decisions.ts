/**
 * Replays one person's past job decisions (the jobs CLI's
 * public.pathways_job_feedback, mapped to app.jobs) against today's ranking
 * and the decision model, and prints how well each orders the jobs they
 * wanted above the ones they passed on. Writes nothing: DATABASE_URL is
 * opened read-only (pgReadOnly, checked before anything runs) and never
 * migrated.
 * Calls the models in memory (fits, company facts, roles).
 *
 *   vite build --ssr scripts/replay-decisions.ts --outDir <dir> && node <dir>/replay-decisions.js
 *
 * REPLAY_USER: the legacy user_id and username (default thomasdavis).
 * docs/jobs-ranking/DECISIONS-REPLAY-2026-11.md has the November run.
 */
import { NodeRuntime } from '@effect/platform-node';
import { writeFileSync } from 'node:fs';
import type { JobPreferences } from '@repo/api';
import {
  insightStore,
  isSkillKey,
  resumeEntries,
  resumeKey,
  skillsShown,
  withMentions,
} from '@repo/careers/replay';
import { ensureReadOnly, pgReadOnly } from '@repo/database';
import {
  candidateText,
  decide,
  eligibility,
  Embedder,
  fitLimit,
  fitScore,
  JobFitter,
  noFacts,
  noPreferences,
  resumeCountry,
  resumeLevel,
  resumeMentions,
  resumeText,
  skillKey,
  zScores,
} from '@repo/jobs';
import { Config, Effect, Layer, Option } from 'effect';
import { FetchHttpClient, HttpClient } from 'effect/http';
import { SqlClient } from 'effect/sql';
import { decisionsOf, dot, Models, readPosts } from './replayData';
import { report, type Row } from './replayReport';

/** What the July roadmap wrote down for this candidate (docs/jobs-ranking/ROADMAP.md §1). */
const STATED: JobPreferences = {
  ...noPreferences,
  workplaces: ['remote_global', 'remote_region'],
  payFloor: 150_000,
  payTarget: 180_000,
  direction:
    'Senior AI and TypeScript engineering: agents, developer tools, open source',
};

const main = Effect.gen(function* () {
  yield* ensureReadOnly;
  const user = yield* Config.String('REPLAY_USER').pipe(
    Config.withDefault('thomasdavis')
  );
  const sql = yield* SqlClient.SqlClient;
  const http = yield* HttpClient.HttpClient;
  const resume: unknown = yield* http
    .get(`https://jsonresume.org/@${user}.json`)
    .pipe(Effect.flatMap((r) => r.json));
  const jobs = yield* decisionsOf(user);
  yield* Effect.logInfo(`replaying ${jobs.length} decisions`);

  const embedder = yield* Embedder;
  const [base, direction] = yield* embedder.embedMany([
    resumeText(resume),
    STATED.direction,
  ]);
  const posts = jobs.map((j) => ({
    id: j.id,
    company: j.posting.company,
    text: j.text,
  }));
  const fits = new Map(
    (yield* (yield* JobFitter).fit(candidateText(resume), posts)).map((f) => [
      f.id,
      f,
    ])
  );
  const { facts, roles } = yield* readPosts(posts);

  const stored = yield* insightStore(sql).load(resumeKey(resume));
  const year = new Date().getUTCFullYear();
  const insight = {
    key: resumeKey(resume),
    level: Option.match(stored, {
      onNone: () => resumeLevel(resume, Date.now()),
      onSome: (s) => s.level,
    }),
    entries: resumeEntries(resume),
    evidence: Option.match(stored, {
      onNone: () => [],
      onSome: (s) => s.evidence,
    }),
    strengths: [],
    foundations: [],
    pending: false,
  };
  const country = resumeCountry(resume);
  const level = resumeLevel(resume, Date.now());

  const toward = zScores(
    jobs.map((j) => (direction ? dot(direction, j.vec) : 0))
  );
  const needsFor = (id: number) => {
    const fit = fits.get(id);
    const read = roles.get(id) ?? [];
    const role =
      read.find(
        (r) => fit && r.title.toLowerCase() === fit.role.toLowerCase()
      ) ?? read[0];
    // As needsOf: kinds of work and qualifications aren't skills.
    const asked = (role?.requirements ?? [])
      .map((r) => ({
        key: skillKey(r.skill),
        name: r.skill,
        need: r.need,
        years: r.years,
      }))
      .filter((n) => isSkillKey(n.key));
    return asked.length > 0 ? asked : null;
  };
  // As decideRanked: skills the text names count as mentions.
  const have = withMentions(
    skillsShown(insight, resume, year),
    jobs.flatMap((j) => needsFor(j.id) ?? []),
    resumeMentions(resume)
  );
  const scored: Row[] = jobs.map((j, at) => {
    const fit = fits.get(j.id) ?? null;
    const cosine = base && j.vec.length ? dot(base, j.vec) : 0;
    const eligible = eligibility(j.posting, country);
    const cap = fitLimit(j.posting, level, country ? eligible : 'yes').cap;
    const needs = needsFor(j.id);
    const inputFor = (preferences: JobPreferences) => ({
      posting: j.posting,
      facts: facts.get(j.id) ?? noFacts,
      eligible,
      placed: country !== undefined,
      fit: fit?.score ?? null,
      cosine,
      // No marks: they are what's being predicted.
      marks: null,
      needs,
      have,
      level,
      preferences,
      direction: direction && preferences.direction ? toward[at] ?? 0 : null,
    });
    return {
      id: j.id,
      company: j.posting.company,
      title: j.posting.title,
      liked: j.sentiment !== 'not_interested',
      cosine,
      engine: Math.min(fit ? fit.score : fitScore(cosine), cap),
      toward: toward[at] ?? 0,
      plain: decide(inputFor({ ...noPreferences })),
      stated: decide(inputFor(STATED)),
    };
  });
  const dump = yield* Config.option(Config.String('REPLAY_DUMP'));
  yield* Effect.sync(() => {
    process.stdout.write(report(scored, user, have.size));
    if (Option.isSome(dump)) writeFileSync(dump.value, JSON.stringify(scored));
  });
});

NodeRuntime.runMain(
  main.pipe(
    Effect.provide(
      Layer.mergeAll(Models, FetchHttpClient.layer).pipe(
        // Read-only from the handshake, never migrated: production is safe.
        Layer.provideMerge(
          Layer.unwrap(Effect.map(Config.Redacted('DATABASE_URL'), pgReadOnly))
        )
      )
    )
  )
);
