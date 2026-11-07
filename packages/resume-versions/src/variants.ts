import { Context, Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';

/** A person may keep this many variants. */
export const MAX_VARIANTS = 40;

/** Names /@name/<slug> can't take: other pages live there. */
const RESERVED = new Set(['timeline']);

const Row = Schema.Struct({
  slug: Schema.String,
  name: Schema.String,
  job_id: Schema.NullOr(Schema.Number),
  resume: Schema.Unknown,
  updated_at: Schema.Date,
});
const decode = Schema.decodeUnknownEffect(Schema.Array(Row));

export interface Variant {
  slug: string;
  name: string;
  /** The job it was made for (app.jobs), if any. */
  jobId: number | null;
  resume: unknown;
  updatedAt: Date;
}

const toVariant = (r: typeof Row.Type): Variant => ({
  slug: r.slug,
  name: r.name,
  jobId: r.job_id,
  resume: r.resume,
  updatedAt: r.updated_at,
});

/** "Acme — Senior Engineer" → "acme-senior-engineer", at most 40 long. */
export const slugOf = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '') || 'variant';

export type VariantFailure = { reason: string };

/**
 * Variants: named copies of a resume for a job or an audience, each at
 * /@name/<slug> with its own theme (meta.theme). The resume itself (its
 * versions, its page) is never changed by them.
 */
export class Variants extends Context.Service<
  Variants,
  Effect.Success<typeof make>
>()('@repo/resume-versions/Variants') {
  /** Needs a SqlClient. */
  static readonly layer = Layer.effect(
    Variants,
    Effect.suspend(() => make)
  );
}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const select = (userId: string, slug?: string) =>
    sql`
      SELECT slug, name, job_id::float8 AS job_id, resume, updated_at
      FROM app.resume_variants
      WHERE user_id = ${userId} ${slug ? sql`AND slug = ${slug}` : sql``}
      ORDER BY updated_at DESC
    `.pipe(
      Effect.flatMap(decode),
      Effect.map((rows) => rows.map(toVariant)),
      Effect.orDie
    );

  const list = (userId: string) => select(userId);
  const get = (userId: string, slug: string) =>
    Effect.map(select(userId, slug), (rows) => rows[0]);
  /** The row just written: there by construction. */
  const written = (userId: string, slug: string) =>
    Effect.flatMap(get(userId, slug), (v) =>
      v ? Effect.succeed(v) : Effect.die(`variant ${slug} vanished`)
    );

  /** A new variant of `resume`, its slug from the name, made unique. */
  const create = Effect.fn('Variants.create')(function* (
    userId: string,
    input: { name: string; resume: unknown; jobId?: number | null }
  ) {
    const name = input.name.trim().slice(0, 80);
    if (!name) return yield* Effect.fail<VariantFailure>({ reason: 'Name it' });
    const taken = new Set((yield* list(userId)).map((v) => v.slug));
    if (taken.size >= MAX_VARIANTS)
      return yield* Effect.fail<VariantFailure>({
        reason: `You can keep ${MAX_VARIANTS} variants; delete one first`,
      });
    const base = slugOf(name);
    let slug = RESERVED.has(base) ? `${base}-1` : base;
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
    yield* sql`
      INSERT INTO app.resume_variants (user_id, slug, name, job_id, resume)
      VALUES (${userId}, ${slug}, ${name}, ${input.jobId ?? null},
              ${JSON.stringify(input.resume)}::json)
    `.pipe(Effect.orDie);
    return yield* written(userId, slug);
  });

  /** Replace a variant's resume (its theme is its meta.theme). */
  const save = Effect.fn('Variants.save')(function* (
    userId: string,
    slug: string,
    resume: unknown
  ) {
    const rows = yield* sql`
      UPDATE app.resume_variants
      SET resume = ${JSON.stringify(resume)}::json, updated_at = now()
      WHERE user_id = ${userId} AND slug = ${slug} RETURNING slug
    `.pipe(Effect.orDie);
    if (rows.length === 0)
      return yield* Effect.fail<VariantFailure>({ reason: 'No such variant' });
    return yield* written(userId, slug);
  });

  const remove = (userId: string, slug: string) =>
    sql`
      DELETE FROM app.resume_variants WHERE user_id = ${userId} AND slug = ${slug}
      RETURNING slug
    `.pipe(
      Effect.map((rows) => rows.length > 0),
      Effect.orDie
    );

  return { list, get, create, save, remove };
});
