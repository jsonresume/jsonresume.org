import { decodePosting, postText, type Posting } from '@repo/jobs';
import { Cause, Effect, Option, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { openJob } from './openJob';
import {
  ReadFailed,
  RoleReader,
  ROLES_VERSION,
  type RoleRead,
} from './roleReader';
import { SkillCatalog } from './services';

export { refreshArchetypes } from './archetypeRefresh';

const Unread = Schema.Struct({
  id: Schema.Number,
  html: Schema.String,
  parsed: Schema.Unknown,
});
const rows = Schema.decodeUnknownEffect(Schema.Array(Unread));

/** Posts a call reads at once. */
const BATCH = 8;

/**
 * When the model finds no role in a post, the parsed posting stands in, so
 * the post isn't read again on every run.
 */
const fromPosting = (p: Posting): RoleRead => ({
  title: p.title,
  family: 'other_tech',
  seniority: p.seniority,
  summary: p.summary,
  requirements: p.skills.map((s) => ({
    skill: s.name,
    need: 'required',
    years: null,
  })),
});

/**
 * Reads the roles in open posts not yet read at ROLES_VERSION, and what
 * each requires, and stores them (replacing older readings). Without a
 * RoleReader (no OpenAI key) it does nothing.
 */
export const refreshRoles = Effect.fn('JobRoles.refreshRoles')(function* (
  options: { limit?: number; concurrency?: number } = {}
) {
  const sql = yield* SqlClient.SqlClient;
  const reader = yield* Effect.serviceOption(RoleReader);
  const catalog = yield* SkillCatalog;
  if (Option.isNone(reader)) {
    yield* Effect.logWarning('No RoleReader: job roles not read');
    return { candidates: 0, read: 0, roles: 0, failed: 0 };
  }
  const unread = yield* sql`
    SELECT j.id::float8 AS id, j.html, j.parsed FROM app.jobs j
    WHERE ${sql.literal(openJob)} AND NOT EXISTS (
      SELECT 1 FROM app.job_roles r WHERE r.job_id = j.id AND r.model = ${ROLES_VERSION})
    ORDER BY j.posted_at DESC LIMIT ${options.limit ?? 1000}
  `.pipe(Effect.flatMap(rows), Effect.orDie);
  const batches = Array.from(
    { length: Math.ceil(unread.length / BATCH) },
    (_, i) => unread.slice(i * BATCH, (i + 1) * BATCH)
  );

  /** Years asked, when it reads as years (models sometimes put a year or a salary there). */
  const yearsOf = (years: number | null) =>
    years !== null && years >= 0 && years <= 40 ? Math.round(years) : null;

  const store = (jobId: number, roles: ReadonlyArray<RoleRead>) =>
    Effect.gen(function* () {
      const names = [
        ...new Set(roles.flatMap((r) => r.requirements.map((q) => q.skill))),
      ];
      const skills = yield* catalog.resolve(names);
      yield* sql`DELETE FROM app.job_roles WHERE job_id = ${jobId}`;
      yield* Effect.forEach(
        roles,
        (role, idx) =>
          Effect.gen(function* () {
            yield* sql`
              INSERT INTO app.job_roles (job_id, idx, title, family, seniority, summary, model)
              VALUES (${jobId}, ${idx}, ${role.title}, ${role.family},
                      ${role.seniority}, ${role.summary}, ${ROLES_VERSION})
            `;
            // One row per skill: "required" wins over "nice".
            const needs = new Map<number, (typeof role.requirements)[number]>();
            for (const q of role.requirements) {
              const skill = skills.get(q.skill);
              const had = skill && needs.get(skill.id);
              if (skill && (!had || q.need === 'required'))
                needs.set(skill.id, q);
            }
            yield* Effect.forEach(
              [...needs],
              ([skillId, q]) => sql`
                INSERT INTO app.job_requirements (job_id, idx, skill_id, need, years)
                VALUES (${jobId}, ${idx}, ${skillId}, ${q.need},
                        ${yearsOf(q.years)})
              `,
              { discard: true }
            );
          }),
        { discard: true }
      );
    }).pipe(sql.withTransaction, Effect.orDie);

  const results = yield* Effect.forEach(
    batches,
    (batch) =>
      reader.value
        .read(batch.map((j) => ({ id: j.id, text: postText(j.html) })))
        .pipe(
          Effect.flatMap((found) =>
            Effect.forEach(batch, (job) => {
              const read = found.get(job.id);
              // Skipped: read again next run. No roles: the posting stands in.
              if (read === undefined) return Effect.succeed(0);
              const roles =
                read.length > 0
                  ? read
                  : Option.match(decodePosting(job.parsed), {
                      onNone: () => [],
                      onSome: (p) => [fromPosting(p)],
                    });
              // One post the database refuses doesn't stop the rest.
              return roles.length > 0
                ? Effect.as(store(job.id, roles), roles.length).pipe(
                    Effect.catchCause((cause) =>
                      Effect.as(
                        Effect.logWarning('Job roles not stored', {
                          job: job.id,
                          cause: Cause.pretty(cause),
                        }),
                        0
                      )
                    )
                  )
                : Effect.succeed(0);
            })
          ),
          Effect.catchTag('ReadFailed', (e: ReadFailed) =>
            Effect.as(
              Effect.logWarning('Job roles not read', { error: e.message }),
              null
            )
          )
        ),
    { concurrency: options.concurrency ?? 4 }
  );
  const stored = results.flatMap((r) => r ?? []);
  return {
    candidates: unread.length,
    read: stored.filter((n) => n > 0).length,
    roles: stored.reduce((a, b) => a + b, 0),
    failed: results.filter((r) => r === null).length,
  };
});
