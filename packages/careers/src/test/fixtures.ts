import type { Posting } from '@repo/jobs';
import { Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { RoleReader, type RoleRead } from '../roleReader';
import { SkillCatalog, type Skill } from '../services';

export const posting = (overrides: Partial<Posting> = {}): Posting => ({
  title: 'Software Engineer',
  company: 'Acme',
  summary: 'Acme builds rockets.',
  city: null,
  region: null,
  countryCode: null,
  remote: 'remote_global',
  remoteRegions: [],
  timezones: null,
  seniority: 'senior',
  employmentType: 'full_time',
  salary: null,
  salaryMin: null,
  salaryMax: null,
  visa: 'unspecified',
  equity: null,
  skills: [{ name: 'TypeScript', keywords: [] }],
  responsibilities: [],
  qualifications: [],
  apply: null,
  ...overrides,
});

/** An open job in app.jobs, posted a day ago. */
export const insertJob = (id: number, html: string, p: Posting) =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    yield* sql`
      INSERT INTO app.jobs (id, thread_id, author, html, posted_at, parsed, parsed_at)
      VALUES (${id}, 1, 'hn', ${html}, now() - interval '1 day',
              ${JSON.stringify(p)}::jsonb, now())
    `;
  });

const SkillRow = Schema.Struct({
  id: Schema.Number,
  key: Schema.String,
  name: Schema.String,
});
const skillRows = Schema.decodeUnknownEffect(Schema.Array(SkillRow));

/** Skills by lower-cased name, kept in app.skills (job_requirements points there). */
export const TestCatalog = Layer.effect(
  SkillCatalog,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    return SkillCatalog.of({
      resolve: (names) =>
        Effect.forEach(names, (name) =>
          sql`
            INSERT INTO app.skills (key, name) VALUES (${name.toLowerCase()}, ${name})
            ON CONFLICT (key) DO UPDATE SET name = app.skills.name
            RETURNING id::float8 AS id, key, name
          `.pipe(
            Effect.flatMap(skillRows),
            Effect.map((found) => [name, found[0]] as const)
          )
        ).pipe(
          Effect.map(
            (pairs) =>
              new Map(
                pairs.flatMap(([n, s]): [string, Skill][] =>
                  s ? [[n, s]] : []
                )
              )
          ),
          Effect.orDie
        ),
      byIds: (ids) =>
        ids.length === 0
          ? Effect.succeed([])
          : sql`
              SELECT id::float8 AS id, key, name FROM app.skills WHERE id IN ${sql.in(
                ids
              )}
            `.pipe(Effect.flatMap(skillRows), Effect.orDie),
    });
  })
);

/** A reader answering from a table of roles by job id; ids missing from it are skipped. */
export const fakeReader = (
  roles: ReadonlyMap<number, ReadonlyArray<RoleRead>>,
  calls: { read: number[]; summarize: string[] }
) =>
  Layer.succeed(
    RoleReader,
    RoleReader.of({
      read: (posts) =>
        Effect.sync(() => {
          calls.read.push(...posts.map((p) => p.id));
          return new Map(
            posts.flatMap((p) => {
              const found = roles.get(p.id);
              return found ? [[p.id, found] as const] : [];
            })
          );
        }),
      summarize: (family, list) =>
        Effect.sync(() => {
          calls.summarize.push(family);
          return `${family}: ${list.length} roles`;
        }),
    })
  );
