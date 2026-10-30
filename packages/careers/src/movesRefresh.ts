import { Effect, Predicate, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { titleKey, titleRoles, type Role } from './titleFamilies';
import { TitleReader, type TitleInput } from './titleReader';

const YEAR = 365.25 * 24 * 60 * 60 * 1000;
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const at = (o: unknown, key: string): unknown =>
  Predicate.isObject(o) ? (o as Record<string, unknown>)[key] : undefined;
const str = (v: unknown) => (Predicate.isString(v) ? v.trim() : '');

interface Entry extends TitleInput {
  start: number;
}

/** A start date as resumes write it ("2019", "2019-06", "2019-06-01"); null if unreadable. */
export const startOf = (value: unknown, now = Date.now()): number | null => {
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(str(value));
  if (!m) return null;
  const time = Date.UTC(Number(m[1]), Number(m[2] ?? 1) - 1, Number(m[3] ?? 1));
  return time >= Date.UTC(1950, 0, 1) && time <= now + YEAR ? time : null;
};

/** A resume's dated jobs, oldest first; undated or untitled ones are left out. */
export const datedWork = (work: unknown): Entry[] =>
  list(work)
    .flatMap((w) => {
      const title = str(at(w, 'position'));
      const start = startOf(at(w, 'startDate'));
      const company = str(at(w, 'name')) || str(at(w, 'company')) || null;
      return title && start !== null ? [{ title, company, start }] : [];
    })
    .sort((a, b) => a.start - b.start);

const Profile = Schema.Struct({
  username: Schema.String,
  work: Schema.Unknown,
});
const Registry = Schema.Struct({
  username: Schema.String,
  resume: Schema.NullOr(Schema.String),
});

/** Everyone's work history: accounts, then ghosts, then the registry's copy, one per username. */
const histories = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const people = new Map<string, unknown>();
  const add = (username: string, work: unknown) => {
    const key = username.toLowerCase();
    if (!people.has(key)) people.set(key, work);
  };
  const profiles = yield* sql`
    SELECT username,
           (CASE WHEN source = 'stored' THEN stored_resume ELSE resume END) -> 'work' AS work
    FROM app.profiles WHERE kind IN ('account', 'ghost')
    ORDER BY (kind = 'account') DESC, username
  `.pipe(
    Effect.flatMap(Schema.decodeUnknownEffect(Schema.Array(Profile))),
    Effect.orDie
  );
  for (const p of profiles) add(p.username, p.work);
  const [registry] = yield* sql<{ found: boolean }>`
    SELECT EXISTS (SELECT 1 FROM information_schema.tables
                   WHERE table_schema = 'public' AND table_name = 'resumes') AS found
  `.pipe(Effect.orDie);
  if (registry?.found) {
    // Text, not jsonb: some rows hold \u0000, which jsonb refuses.
    const rows = yield* sql`SELECT username, resume FROM public.resumes`.pipe(
      Effect.flatMap(Schema.decodeUnknownEffect(Schema.Array(Registry))),
      Effect.orDie
    );
    for (const r of rows) {
      try {
        add(r.username, at(JSON.parse(r.resume ?? 'null'), 'work'));
      } catch {
        // An unreadable resume adds nothing.
      }
    }
  }
  return [...people.values()].map(datedWork);
});

const median = (values: number[]) => {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length === 0
    ? null
    : s.length % 2
    ? s[mid] ?? null
    : ((s[mid - 1] ?? 0) + (s[mid] ?? 0)) / 2;
};

/** One person's moves: each change of role (family or seniority), and the years from one start to the next. */
export const movesOf = (
  work: ReadonlyArray<Entry>,
  roles: ReadonlyMap<string, Role>
) => {
  const path: { role: Role; start: number }[] = [];
  for (const e of work) {
    const role = roles.get(e.title);
    if (!role) continue;
    const last = path[path.length - 1];
    if (
      last &&
      last.role.family === role.family &&
      last.role.seniority === role.seniority
    )
      continue;
    path.push({ role, start: e.start });
  }
  return path.slice(1).flatMap((to, i) => {
    const from = path[i];
    return from
      ? [
          {
            from: from.role,
            to: to.role,
            years: (to.start - from.start) / YEAR,
          },
        ]
      : [];
  });
};

/**
 * Learns where people go next from every public resume: reads all their
 * job titles into role families (the model for titles not read before),
 * counts each person's changes of role once, and replaces app.career_moves.
 */
export const refreshMoves = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const reader = yield* Effect.serviceOption(TitleReader);
  const people = yield* histories;
  const titles = new Map<string, TitleInput>();
  for (const e of people.flat()) {
    if (!titles.has(e.title))
      titles.set(e.title, { title: e.title, company: e.company });
  }
  const { roles, read } = yield* titleRoles(sql, reader, [...titles.values()]);
  const counts = new Map<string, { people: number; years: number[] }>();
  let withMoves = 0;
  for (const work of people) {
    const seen = new Set<string>();
    for (const m of movesOf(work, roles)) {
      const key = [
        m.from.family,
        m.from.seniority,
        m.to.family,
        m.to.seniority,
      ].join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      const c = counts.get(key) ?? { people: 0, years: [] };
      counts.set(key, { people: c.people + 1, years: [...c.years, m.years] });
    }
    if (seen.size > 0) withMoves++;
  }
  const rows = [...counts].map(([key, c]) => {
    const [
      from_family = '',
      from_seniority = '',
      to_family = '',
      to_seniority = '',
    ] = key.split('|');
    return {
      from_family,
      from_seniority,
      to_family,
      to_seniority,
      people: c.people,
      median_years: median(c.years),
    };
  });
  yield* Effect.gen(function* () {
    yield* sql`DELETE FROM app.career_moves`;
    for (let i = 0; i < rows.length; i += 500) {
      yield* sql`INSERT INTO app.career_moves ${sql.insert(
        rows.slice(i, i + 500)
      )}`;
    }
  }).pipe(sql.withTransaction, Effect.orDie);
  const stats = {
    people: people.length,
    withMoves,
    moves: rows.length,
    titles: new Set([...titles.keys()].map(titleKey)).size,
    read,
  };
  yield* Effect.logInfo('Career moves refreshed', stats);
  return stats;
});
