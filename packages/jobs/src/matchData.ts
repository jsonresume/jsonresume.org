import { Duration, Effect, Option, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { createHash } from 'node:crypto';
import { openJobs } from './board';
import { Embedder } from './embedder';
import { decodePosting } from './posting';
import { postText } from './postText';
import type { JobRow } from './summary';
import { fromBytes, toBytes } from './vectors';

const Open = Schema.Struct({
  id: Schema.Number,
  parsed: Schema.Unknown,
  posted_at: Schema.Date,
  family_months: Schema.Number,
  html: Schema.String,
  embedding: Schema.Uint8Array,
});
const Cached = Schema.Struct({ embedding: Schema.Uint8Array });
const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

/** What matching compares: the open jobs' vectors and text, and a resume's vector. */
export const matchData = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const embedder = yield* Embedder;

  // Every open job and its vector: a few MB, read at most every 5 minutes.
  const openJobRows = yield* Effect.cachedWithTTL(
    sql`
      SELECT j.id::float8 AS id, j.parsed, j.posted_at,
             j.family_months::float8 AS family_months, j.html, j.embedding
      FROM app.jobs j WHERE ${sql.literal(openJobs)} AND j.embedding IS NOT NULL
    `.pipe(
      Effect.flatMap(rows(Open)),
      Effect.map((open) =>
        open.flatMap((r) =>
          Option.match(decodePosting(r.parsed), {
            onNone: () => [],
            onSome: (posting) => [
              {
                row: {
                  id: r.id,
                  posting,
                  postedAt: r.posted_at,
                  months: r.family_months,
                } satisfies JobRow,
                vector: fromBytes(r.embedding),
                text: postText(r.html),
              },
            ],
          })
        )
      ),
      Effect.orDie
    ),
    Duration.minutes(5)
  );

  /** A resume's vector, embedded once per distinct text. */
  const resumeVector = Effect.fn('JobMatcher.resumeVector')(function* (
    text: string
  ) {
    const hash = createHash('sha256').update(text).digest('hex');
    const [cached] = yield* sql`
      SELECT embedding FROM app.embeddings WHERE text_hash = ${hash}
    `.pipe(Effect.flatMap(rows(Cached)), Effect.orDie);
    if (cached) return fromBytes(cached.embedding);
    const vector = yield* embedder.embed(text).pipe(Effect.orDie);
    yield* sql`
      INSERT INTO app.embeddings (text_hash, embedding) VALUES (${hash}, ${toBytes(
      vector
    )})
      ON CONFLICT (text_hash) DO NOTHING
    `.pipe(Effect.orDie);
    return vector;
  });

  return { openJobRows, resumeVector };
});
