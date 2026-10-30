import { Embedder } from '@repo/jobs';
import { Duration, Effect, Layer, Option, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { SkillCatalog, type Skill } from './services';
import { placeByMeaning } from './skillMeaning';
import {
  fromBytes,
  isSkillKey,
  shorten,
  skillKey,
  toBytes,
} from './skillNames';

const Row = Schema.Struct({
  id: Schema.Number,
  key: Schema.String,
  name: Schema.String,
});
const AliasRow = Schema.Struct({ alias: Schema.String, ...Row.fields });
const Vector = Schema.Struct({ ...Row.fields, embedding: Schema.Uint8Array });
const rows = <S extends Schema.Constraint>(schema: S) =>
  Schema.decodeUnknownEffect(Schema.Array(schema));

/**
 * The shared skill vocabulary on Postgres. A name resolves by its alias,
 * then its key, then (with an Embedder) the nearest skill by meaning, else
 * becomes a new skill; every name it was seen as is kept as an alias.
 */
export const SkillCatalogLive = Layer.effect(
  SkillCatalog,
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const embedder = yield* Effect.serviceOption(Embedder);

    // Every skill's vector, for matching by meaning; reread now and then,
    // with the skills added since kept beside it.
    const stored = yield* Effect.cachedWithTTL(
      sql`SELECT id, key, name, embedding FROM app.skills WHERE embedding IS NOT NULL`.pipe(
        Effect.flatMap(rows(Vector)),
        Effect.map((found) =>
          found.map((r) => ({
            skill: { id: r.id, key: r.key, name: r.name },
            vector: fromBytes(r.embedding),
          }))
        ),
        Effect.orDie
      ),
      Duration.minutes(10)
    );
    const recent: Array<{ skill: Skill; vector: Float32Array }> = [];

    /** Shortened vectors for these names; none without an Embedder, or if it fails. */
    const embed = (names: ReadonlyArray<string>) =>
      Option.match(embedder, {
        onNone: () => Effect.succeed(undefined),
        onSome: (e) =>
          e.embedMany(names).pipe(
            Effect.map((all) => all.map(shorten)),
            Effect.catchTag('EmbedFailed', (err) =>
              Effect.logWarning('Skill embeddings failed', {
                error: err.message,
              }).pipe(Effect.as(undefined))
            )
          ),
      });

    const lookUp = (keys: ReadonlyArray<string>) =>
      Effect.gen(function* () {
        const found = new Map<string, Skill>();
        if (keys.length === 0) return found;
        const aliased = yield* sql`
          SELECT a.alias, s.id, s.key, s.name FROM app.skill_aliases a
          JOIN app.skills s ON s.id = a.skill_id WHERE a.alias IN ${sql.in(
            keys
          )}
        `.pipe(Effect.flatMap(rows(AliasRow)), Effect.orDie);
        for (const r of aliased)
          found.set(r.alias, { id: r.id, key: r.key, name: r.name });
        const rest = keys.filter((k) => !found.has(k));
        if (rest.length === 0) return found;
        const keyed = yield* sql`
          SELECT id, key, name FROM app.skills WHERE key IN ${sql.in(rest)}
        `.pipe(Effect.flatMap(rows(Row)), Effect.orDie);
        for (const r of keyed) found.set(r.key, r);
        return found;
      });

    const insert = (
      fresh: ReadonlyArray<{ key: string; name: string; vector?: Float32Array }>
    ) =>
      sql`
        INSERT INTO app.skills ${sql.insert(
          fresh.map((f) => ({
            key: f.key,
            name: f.name,
            embedding: f.vector ? toBytes(f.vector) : null,
          }))
        )}
        ON CONFLICT (key) DO UPDATE SET key = EXCLUDED.key
        RETURNING id, key, name
      `.pipe(Effect.flatMap(rows(Row)), Effect.orDie);

    const resolve = Effect.fn('SkillCatalog.resolve')(function* (
      names: ReadonlyArray<string>
    ) {
      const asked = new Map<string, string>();
      for (const name of names) {
        const key = skillKey(name);
        if (isSkillKey(key) && !asked.has(key)) asked.set(key, name.trim());
      }
      const keys = [...asked.keys()];
      const found = yield* lookUp(keys);
      const missing = keys.filter((k) => !found.has(k));
      const nameOf = (k: string) => asked.get(k) ?? k;
      const vectors =
        missing.length > 0 ? yield* embed(missing.map(nameOf)) : undefined;
      if (vectors) {
        const placed = placeByMeaning(
          missing.flatMap((key, i) => {
            const vector = vectors[i];
            return vector ? [{ key, vector }] : [];
          }),
          [...(yield* stored), ...recent]
        );
        for (const [k, s] of placed.known) found.set(k, s);
        if (placed.fresh.length > 0) {
          const made = yield* insert(
            placed.fresh.map((f) => ({ ...f, name: nameOf(f.key) }))
          );
          const vectorOf = new Map(placed.fresh.map((f) => [f.key, f.vector]));
          for (const r of made) {
            found.set(r.key, r);
            const vector = vectorOf.get(r.key);
            if (vector) recent.push({ skill: r, vector });
          }
        }
        for (const [k, twin] of placed.twins) {
          const s = found.get(twin);
          if (s) found.set(k, s);
        }
      } else if (missing.length > 0) {
        for (const r of yield* insert(
          missing.map((k) => ({ key: k, name: nameOf(k) }))
        ))
          found.set(r.key, r);
      }
      const aliases = keys.flatMap((k) => {
        const s = found.get(k);
        return s ? [{ alias: k, skill_id: s.id }] : [];
      });
      if (aliases.length > 0) {
        yield* sql`
          INSERT INTO app.skill_aliases ${sql.insert(
            aliases
          )} ON CONFLICT (alias) DO NOTHING
        `.pipe(Effect.orDie);
      }
      const out = new Map<string, Skill>();
      for (const name of names) {
        const s = found.get(skillKey(name));
        if (s) out.set(name, s);
      }
      return out as ReadonlyMap<string, Skill>;
    });

    const byIds = (ids: ReadonlyArray<number>) =>
      ids.length === 0
        ? Effect.succeed([] as ReadonlyArray<Skill>)
        : sql`SELECT id, key, name FROM app.skills WHERE id IN ${sql.in([
            ...ids,
          ])}`.pipe(Effect.flatMap(rows(Row)), Effect.orDie);

    return SkillCatalog.of({ resolve, byIds });
  })
);
