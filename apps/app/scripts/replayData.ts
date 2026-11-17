import { OpenAiClient } from '@effect/ai-openai';
import { RoleReader, RoleReaderLive } from '@repo/careers/roles';
import {
  decodePosting,
  Embedder,
  FactsReader,
  JobFitter,
  noFacts,
  postText,
} from '@repo/jobs';
import { Config, Effect, Layer, Option, Schema } from 'effect';
import { FetchHttpClient } from 'effect/http';
import { SqlClient } from 'effect/sql';

/* What replay-decisions.ts reads: the person's past decisions with their
   jobs, and the models' reading of those posts, all in memory. */

const Decided = Schema.Struct({
  id: Schema.Number,
  sentiment: Schema.String,
  parsed: Schema.Unknown,
  html: Schema.String,
  embedding: Schema.Uint8Array,
});

export const vector = (bytes: Uint8Array) =>
  new Float32Array(
    bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
  );
export const dot = (a: Float32Array, b: Float32Array) =>
  a.reduce((sum, v, i) => sum + v * (b[i] ?? 0), 0);

/** A person's latest decision on each job the CLI saw that app.jobs still has. */
export const decisionsOf = (user: string) =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const rows = yield* sql`
      SELECT DISTINCT ON (aj.id) aj.id::float8 AS id, f.sentiment, aj.parsed, aj.html, aj.embedding
      FROM public.pathways_job_feedback f
      JOIN public.jobs pj ON pj.id::text = f.job_id
      JOIN app.jobs aj ON aj.id::text = pj.uuid::text
      WHERE f.user_id = ${user} AND f.sentiment IN ('interested', 'applied', 'not_interested')
        AND aj.parsed IS NOT NULL AND aj.embedding IS NOT NULL
      ORDER BY aj.id, f.created_at DESC
    `.pipe(Effect.flatMap(Schema.decodeUnknownEffect(Schema.Array(Decided))));
    const jobs = rows.flatMap((r) =>
      Option.match(decodePosting(r.parsed), {
        onNone: () => [],
        onSome: (posting) => [
          { ...r, posting, text: postText(r.html), vec: vector(r.embedding) },
        ],
      })
    );
    return jobs;
  });

export interface ReadRole {
  title: string;
  requirements: ReadonlyArray<{
    skill: string;
    need: 'required' | 'nice';
    years: number | null;
  }>;
}

/** Company facts and roles for these posts, eight a call, as the roles refresh reads them. */
export const readPosts = (posts: ReadonlyArray<{ id: number; text: string }>) =>
  Effect.gen(function* () {
    const facts = new Map<number, typeof noFacts>();
    const roles = new Map<number, ReadonlyArray<ReadRole>>();
    // Eight posts a call, as the roles refresh reads them.
    for (let i = 0; i < posts.length; i += 8) {
      const batch = posts.slice(i, i + 8);
      const [read, rolesRead] = yield* Effect.all(
        [(yield* FactsReader).read(batch), (yield* RoleReader).read(batch)],
        { concurrency: 2 }
      );
      for (const [id, f] of read) facts.set(id, f);
      for (const [id, r] of rolesRead) roles.set(id, r);
    }
    return { facts, roles };
  });

export /** The models, on OpenAI with OPENAI_API_KEY. */
const Models = Layer.unwrap(
  Effect.map(Config.Redacted('OPENAI_API_KEY'), (apiKey) =>
    Layer.mergeAll(
      Embedder.layer,
      JobFitter.layer,
      FactsReader.layer,
      RoleReaderLive
    ).pipe(
      Layer.provide(OpenAiClient.layer({ apiKey })),
      Layer.provide(FetchHttpClient.layer)
    )
  )
);
