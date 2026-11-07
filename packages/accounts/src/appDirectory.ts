import { Effect, Schema } from 'effect';
import type { SqlClient } from 'effect/sql';
import * as O from './oauthUris';

const Listing = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  description: Schema.String,
  homepage: Schema.String,
  users: Schema.Number,
});
export type AppListing = typeof Listing.Type;
const decode = Schema.decodeUnknownEffect(Schema.Array(Listing));

/** The longest line about an app the directory shows. */
export const MAX_DESCRIPTION = 160;

/**
 * The apps directory: OAuth apps people registered and chose to list, each
 * with a homepage and a line saying what it does, most used first.
 */
export const directoryQueries = (sql: SqlClient.SqlClient) => ({
  directory: () =>
    sql`
      SELECT c.id, c.name, c.description, c.homepage,
             (SELECT count(DISTINCT t.user_id)::int FROM app.oauth_tokens t WHERE t.client_id = c.id) AS users
      FROM app.oauth_clients c
      WHERE c.listed AND c.owner_id IS NOT NULL
        AND c.homepage IS NOT NULL AND c.description IS NOT NULL
      ORDER BY users DESC, c.created_at
    `.pipe(Effect.flatMap(decode), Effect.orDie),

  setListing: Effect.fn('OAuth.setListing')(function* (
    ownerId: string,
    id: string,
    input: { listed: boolean; description: string }
  ) {
    const description = input.description.trim().slice(0, MAX_DESCRIPTION);
    const [app] = yield* sql<{ homepage: string | null }>`
      SELECT homepage FROM app.oauth_clients WHERE id = ${id} AND owner_id = ${ownerId}
    `.pipe(Effect.orDie);
    if (!app) return yield* O.fail('invalid_client', 'No such app');
    if (input.listed && (!app.homepage || !description))
      return yield* O.fail(
        'invalid_client_metadata',
        'A listed app needs a homepage and a line saying what it does'
      );
    yield* sql`
      UPDATE app.oauth_clients
      SET listed = ${input.listed}, description = ${description || null}
      WHERE id = ${id} AND owner_id = ${ownerId}
    `.pipe(Effect.orDie);
  }),
});
