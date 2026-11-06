import { resumeLevel } from '@repo/jobs';
import { Clock, Duration, Effect, Fiber, Layer, Option } from 'effect';
import { SqlClient } from 'effect/sql';
import {
  listedEvidence,
  readEvidence,
  readRoles,
  readStrengths,
  type Found,
} from './evidence';
import { isFamily } from './families';
import { InsightReader } from './insightReader';
import { insightStore, type Stored } from './insightStore';
import { resumeEntries, resumeFoundations, resumeKey } from './resumeEntries';
import {
  ResumeInsights,
  SkillCatalog,
  type Evidence,
  type ResumeEntry,
} from './services';

/** How long a request waits for the reader before answering without it. */
const WAIT = Duration.seconds(40);
/** Marks insights read without a model: a reader, once there, reads again. */
const NO_MODEL = 'none';
const MODEL = 'gpt-5-mini';

/**
 * What a resume shows, per version: entries and foundations straight from
 * the resume; evidence, strengths and each entry's role from the reader,
 * once per version, kept in Postgres. Without a reader, the skills section
 * matched to the entries that name each skill.
 */
export const ResumeInsightsLive = Layer.effect(
  ResumeInsights,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const catalog = yield* SkillCatalog;
    const reader = yield* Effect.serviceOption(InsightReader);
    const store = insightStore(sql);
    // One reading per resume version at a time, shared by concurrent requests.
    const running = new Map<string, Fiber.Fiber<void>>();

    const resolved = (found: ReadonlyArray<Found>) =>
      Effect.map(catalog.resolve(found.map((f) => f.name)), (skills) =>
        found.flatMap((f): Evidence[] => {
          const skill = skills.get(f.name);
          return skill ? [{ ...f, skill }] : [];
        })
      );

    const thisYear = Effect.map(Clock.currentTimeMillis, (ms) =>
      new Date(ms).getUTCFullYear()
    );

    /** Reads with the model and keeps the result; failures are logged, not kept. */
    const read = (
      key: string,
      resume: unknown,
      entries: ReadonlyArray<ResumeEntry>
    ) =>
      Option.match(reader, {
        onNone: () => Effect.void,
        onSome: (r) =>
          Effect.gen(function* () {
            const reading = yield* r.read(resume, entries);
            const year = yield* thisYear;
            const found = readEvidence(reading, entries, year);
            const evidence = yield* resolved([
              ...found,
              ...listedEvidence(resume, entries, year, found),
            ]);
            const strengths = readStrengths(
              reading,
              evidence.map((e) => ({
                entry: e.entry,
                skillId: e.skill.id,
                strength: e.strength,
              }))
            );
            yield* store.save(key, {
              model: MODEL,
              level: resumeLevel(resume, yield* Clock.currentTimeMillis),
              strengths,
              roles: readRoles(reading),
              foundations: resumeFoundations(resume),
              evidence,
            });
          }).pipe(
            Effect.catchTag('ReadFailed', (e) =>
              Effect.logWarning('Resume reading failed', { error: e.message })
            )
          ),
      });

    /** The stored reading, unless it was made without a model and one is here now. */
    const usable = (key: string) =>
      Effect.map(store.load(key), (found) =>
        Option.filter(
          found,
          (s) => s.model !== NO_MODEL || Option.isNone(reader)
        )
      );

    const insight = Effect.fn('ResumeInsights.insight')(function* (
      resume: unknown
    ) {
      const key = resumeKey(resume);
      const entries = resumeEntries(resume);
      const foundations = resumeFoundations(resume);
      const level = resumeLevel(resume, yield* Clock.currentTimeMillis);
      const answer = (stored: Stored, pending: boolean) => ({
        key,
        level: stored.level,
        entries: entries.map((e) => {
          const role = stored.roles[e.key];
          return role && isFamily(role.family)
            ? {
                ...e,
                family: role.family,
                seniority:
                  role.seniority === 'unspecified' ? null : role.seniority,
              }
            : e;
        }),
        evidence: stored.evidence,
        strengths: stored.strengths,
        foundations,
        pending,
      });
      const withoutModel = Effect.gen(function* () {
        const evidence = yield* resolved(
          listedEvidence(resume, entries, yield* thisYear)
        );
        return {
          model: NO_MODEL,
          level,
          strengths: [],
          roles: {},
          evidence,
        } satisfies Stored;
      });

      const have = yield* usable(key);
      if (Option.isSome(have)) return answer(have.value, false);
      if (Option.isNone(reader)) {
        const made = yield* withoutModel;
        yield* store.save(key, { ...made, foundations });
        return answer(made, false);
      }
      let fiber = running.get(key);
      if (!fiber) {
        const started = yield* read(key, resume, entries).pipe(
          Effect.ensuring(Effect.sync(() => running.delete(key))),
          Effect.forkDetach
        );
        running.set(key, started);
        fiber = started;
      }
      const done = yield* Fiber.join(fiber).pipe(Effect.timeoutOption(WAIT));
      const after = yield* usable(key);
      if (Option.isSome(after)) return answer(after.value, false);
      // Still reading (or the reading failed): what the resume shows without it.
      return answer(yield* withoutModel, Option.isNone(done));
    });

    return ResumeInsights.of({ insight });
  })
);
