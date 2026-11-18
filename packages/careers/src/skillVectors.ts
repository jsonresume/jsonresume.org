import { Embedder } from '@repo/jobs';
import { Effect, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { isSkillKey, shorten, toBytes } from './skillNames';

const Row = Schema.Struct({
  id: Schema.Number,
  key: Schema.String,
  name: Schema.String,
});

/** Names embedded per request. */
const BATCH = 500;

/**
 * Gives skills stored without a vector one, so names read later can match
 * them by meaning (SkillCatalog.resolve) rather than becoming another
 * skill: "Agent Harness" was stored apart from "Agent harnesses", made
 * before skills had vectors. Only names that are skills: qualifications
 * and kinds of work never become something to match. Idempotent; a failed
 * embedding leaves the rest for the next run. Needs an Embedder.
 */
export const embedSkills = Effect.fn('SkillCatalog.embedMissing')(
  function* () {
    const sql = yield* SqlClient.SqlClient;
    const embedder = yield* Embedder;
    const found = yield* sql`
      SELECT id, key, name FROM app.skills WHERE embedding IS NULL ORDER BY id
    `.pipe(
      Effect.flatMap(Schema.decodeUnknownEffect(Schema.Array(Row))),
      Effect.orDie
    );
    const skills = found.filter((s) => isSkillKey(s.key));
    let embedded = 0;
    for (let at = 0; at < skills.length; at += BATCH) {
      const batch = skills.slice(at, at + BATCH);
      const vectors = yield* embedder.embedMany(batch.map((s) => s.name));
      yield* Effect.forEach(
        batch,
        (s, i) => {
          const v = vectors[i];
          return v
            ? sql`
                UPDATE app.skills SET embedding = ${toBytes(shorten(v))}
                WHERE id = ${s.id} AND embedding IS NULL
              `.pipe(Effect.orDie)
            : Effect.void;
        },
        { discard: true }
      );
      embedded += batch.length;
    }
    return { embedded, notSkills: found.length - skills.length };
  },
  Effect.catchTag('EmbedFailed', (err) =>
    Effect.logWarning('Skill vectors not made', { error: err.message }).pipe(
      Effect.as({ embedded: 0, notSkills: 0 })
    )
  )
);
