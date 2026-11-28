import type { ExploreResults, ResumeListing } from '@repo/api';
import { parseHandle, reservedUsernames } from '@repo/profiles';
import { Context, Effect, Layer, Ref, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { dropTemplates, toEntry, type Entry, type Row } from './listing';
import { popularSkills, search } from './search';

/** How long a built index serves searches before it is read again. */
const FRESH = '10 minutes';

const Rows = Schema.Array(
  Schema.Struct({
    username: Schema.String,
    resume: Schema.Unknown,
    updated_at: Schema.NullOr(Schema.Date),
  })
);
const Listed = Schema.Array(Schema.Struct({ listed: Schema.Boolean }));

interface Index {
  index: ReadonlyArray<Entry>;
  popular: ReadonlyArray<string>;
}

/** Only what Explore reads of a resume, so rows stay small. */
const part = (column: string) =>
  `jsonb_build_object('basics', ${column}->'basics', 'skills', ${column}->'skills', 'work', ${column}->'work', 'meta', jsonb_build_object('lastModified', ${column}->'meta'->'lastModified'))`;

/**
 * Explore: every public resume, searchable. Listed are ghosts (gists
 * mirrored here) and verified accounts that haven't opted out: only pages
 * that open. The registry's copies (public.resumes) are not listed, as most
 * of their gists are gone (53 of 60 sampled on 2026-11-24 no longer
 * rendered); a live one becomes a ghost when its page is visited. Searches
 * run on an index in memory, rebuilt in the background every ten minutes
 * and at once when someone opts in or out.
 */
export class Explore extends Context.Service<
  Explore,
  {
    search(query: string, page: number): Effect.Effect<ExploreResults>;
    /** Everyone listed (what the sitemap offers search engines). */
    readonly listings: Effect.Effect<ReadonlyArray<ResumeListing>>;
    listed(userId: string): Effect.Effect<boolean>;
    setListed(userId: string, listed: boolean): Effect.Effect<boolean>;
  }
>()('@repo/explore/Explore') {
  static readonly layer = Layer.effect(
    Explore,
    Effect.gen(function* () {
      const sql = yield* SqlClient.SqlClient;
      const decodeRows = Schema.decodeUnknownEffect(Rows);

      const here = sql.unsafe(`
        SELECT p.username,
               ${part(
                 "CASE WHEN p.kind = 'account' AND p.source = 'stored' THEN p.stored_resume ELSE p.resume END"
               )} AS resume,
               -- A save here, or the gist's own updated_at; never a fetch time.
               CASE WHEN p.kind = 'account' AND p.source = 'stored' THEN p.stored_at
                    ELSE p.gist_updated_at END
                 AS updated_at
        FROM app.profiles p
        LEFT JOIN app.users u ON u.id = p.user_id
        WHERE p.listed AND (p.kind = 'ghost' OR (p.kind = 'account'
          AND NOT u.page_private
          AND (u.email_verified_at IS NOT NULL OR u.github_id IS NOT NULL)))`);
      const build: Effect.Effect<Index> = Effect.gen(function* () {
        const rows = yield* Effect.flatMap(here, decodeRows);
        const seen = new Set<string>();
        const index: Entry[] = [];
        for (const r of rows) {
          const handle = parseHandle(`@${r.username}`);
          const name = handle?.username;
          if (!name || seen.has(name) || reservedUsernames.has(name)) continue;
          seen.add(name);
          const row: Row = {
            username: name,
            resume: r.resume,
            updatedAt: r.updated_at,
          };
          const entry = toEntry(row);
          if (entry) index.push(entry);
        }
        const people = dropTemplates(index);
        yield* Effect.logInfo('explore index built', { people: people.length });
        return { index: people, popular: popularSkills(people) };
      }).pipe(Effect.orDie);

      // Searches read the latest index, rebuilt in the background, so
      // only searches before the first build wait (and build it).
      const latest = yield* Ref.make<Index | undefined>(undefined);
      const rebuild = Effect.tap(build, (index) => Ref.set(latest, index));
      const current = Effect.flatMap(Ref.get(latest), (index) =>
        index ? Effect.succeed(index) : rebuild
      );
      yield* rebuild.pipe(
        Effect.catchCause((cause) =>
          Effect.logError('explore index failed', cause)
        ),
        Effect.andThen(Effect.sleep(FRESH)),
        Effect.forever,
        Effect.forkScoped
      );

      const listed = (userId: string) =>
        sql`
          SELECT listed FROM app.profiles
          WHERE user_id = ${userId} AND kind = 'account'`.pipe(
          Effect.flatMap(Schema.decodeUnknownEffect(Listed)),
          Effect.map((rows) => rows[0]?.listed ?? true),
          Effect.orDie
        );

      return Explore.of({
        search: (query, page) =>
          Effect.map(current, ({ index, popular }) =>
            search(index, popular, query, page)
          ),
        listings: Effect.map(current, ({ index }) =>
          index.map((entry) => entry.listing)
        ),
        listed,
        setListed: (userId, value) =>
          sql`
            UPDATE app.profiles SET listed = ${value}
            WHERE user_id = ${userId} AND kind = 'account'`.pipe(
            Effect.orDie,
            Effect.andThen(rebuild),
            Effect.andThen(listed(userId))
          ),
      });
    })
  );
}
