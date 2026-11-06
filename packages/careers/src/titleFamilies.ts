import { Seniority } from '@repo/api';
import { Effect, Option, Schema } from 'effect';
import type { SqlClient } from 'effect/sql';
import { isFamily, type Family } from './families';
import {
  TITLES_VERSION,
  type TitleInput,
  type TitleReaderShape,
} from './titleReader';

export interface Role {
  family: Family;
  seniority: Seniority;
}

/** A title as stored: lower-case, trimmed, one space between words. */
export const titleKey = (title: string) =>
  title.toLowerCase().trim().replace(/\s+/g, ' ').slice(0, 200);

/** Without a model: the family and seniority a title's words suggest. */
const FALLBACK: ReadonlyArray<[Family, RegExp]> = [
  ['founder', /\bfounder\b/],
  ['eng_executive', /\b(cto|vp|vice president|head of engineering)\b/],
  [
    'eng_manager',
    /\b(engineering manager|director of engineering|team lead)\b/,
  ],
  ['product', /\b(product manager|product owner)\b/],
  ['design', /\b(designer|ux|ui designer)\b/],
  ['data_science', /\b(data scien|analyst)/],
  ['data_engineering', /\bdata engineer/],
  ['ml', /\b(machine learning|ml engineer)\b/],
  ['ai', /\b(ai|llm|agents?)\b/],
  ['research', /\b(research|scientist)\b/],
  ['security', /\bsecurity\b/],
  ['sre', /\b(sre|site reliability)\b/],
  ['platform', /\b(devops|platform|infrastructure|cloud)\b/],
  ['mobile', /\b(ios|android|mobile)\b/],
  ['frontend', /\b(front[- ]?end|ui engineer)\b/],
  ['backend', /\b(back[- ]?end)\b/],
  ['embedded', /\b(embedded|firmware|hardware)\b/],
  ['qa', /\b(qa|test|quality)\b/],
  ['student', /\b(intern|student)\b/],
  ['educator', /\b(teacher|lecturer|instructor|tutor)\b/],
  ['consultant', /\b(consultant|freelance)/],
  ['fullstack', /\b(engineer|developer|programmer)\b/],
];
const LEVELS: ReadonlyArray<[Seniority, RegExp]> = [
  ['intern', /\bintern\b/],
  ['lead_management', /\b(founder|cto|vp|head|director|manager|chief)\b/],
  ['staff_plus', /\b(staff|principal|distinguished|architect)\b/],
  ['senior', /\b(senior|sr\.?|lead)\b/],
  ['junior', /\b(junior|jr\.?|graduate|entry)\b/],
];

export const fallbackRole = (title: string): Role => {
  const t = titleKey(title);
  return {
    family: FALLBACK.find(([, p]) => p.test(t))?.[0] ?? 'non_tech',
    seniority: LEVELS.find(([, p]) => p.test(t))?.[0] ?? 'unspecified',
  };
};

const Stored = Schema.Struct({
  title_key: Schema.String,
  family: Schema.String,
  seniority: Seniority,
});
const rows = Schema.decodeUnknownEffect(Schema.Array(Stored));
const BATCH = 1000;
const chunks = <A>(items: ReadonlyArray<A>, size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, (i + 1) * size)
  );

/**
 * Titles to roles: stored readings first, the model for the rest (stored
 * for next time). Without the model, or if it fails, the fallback answers
 * and nothing is stored, so a later run with the model reads them.
 */
export const titleRoles = Effect.fn('CareerMoves.titleRoles')(function* (
  sql: SqlClient.SqlClient,
  reader: Option.Option<TitleReaderShape>,
  titles: ReadonlyArray<TitleInput>
) {
  const byKey = new Map<string, TitleInput>();
  for (const t of titles) {
    const key = titleKey(t.title);
    if (key && !byKey.has(key)) byKey.set(key, t);
  }
  const known = new Map<string, Role>();
  for (const keys of chunks([...byKey.keys()], BATCH)) {
    const found = yield* sql`
      SELECT title_key, family, seniority FROM app.title_families
      WHERE title_key IN ${sql.in(keys)}
    `.pipe(Effect.flatMap(rows), Effect.orDie);
    for (const r of found) {
      if (isFamily(r.family))
        known.set(r.title_key, { family: r.family, seniority: r.seniority });
    }
  }
  const missing = [...byKey].filter(([k]) => !known.has(k));
  let read = 0;
  if (missing.length > 0 && Option.isSome(reader)) {
    const answers = yield* reader.value
      .read(missing.map(([key, t]) => ({ ...t, title: key })))
      .pipe(
        Effect.catchTag('TitleReadFailed', (e) =>
          Effect.as(Effect.logWarning('Reading titles failed', e.message), [])
        )
      );
    for (const batch of chunks(answers, BATCH)) {
      yield* sql`
        INSERT INTO app.title_families ${sql.insert(
          batch.map((a) => ({
            title_key: a.title,
            family: a.family,
            seniority: a.seniority,
            model: TITLES_VERSION,
          }))
        )}
        ON CONFLICT (title_key) DO NOTHING
      `.pipe(Effect.orDie);
      for (const a of batch)
        known.set(a.title, { family: a.family, seniority: a.seniority });
    }
    read = answers.length;
  }
  const roles = new Map<string, Role>();
  for (const t of titles) {
    const key = titleKey(t.title);
    if (key) roles.set(t.title, known.get(key) ?? fallbackRole(key));
  }
  return { roles, read };
});
