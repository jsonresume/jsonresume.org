import { Effect, Schema } from 'effect';
import type { SqlClient } from 'effect/sql';
import { randomBytes } from 'node:crypto';
import { hashToken, newToken } from './crypto';
import * as O from './oauthUris';

/** A person may register this many apps. */
export const MAX_APPS = 10;

const AppRow = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  homepage: Schema.NullOr(Schema.String),
  redirect_uris: Schema.Array(Schema.String),
  created_at: Schema.Date,
  users: Schema.Number,
});
const decode = Schema.decodeUnknownEffect(Schema.Array(AppRow));

export interface OAuthAppRecord {
  id: string;
  name: string;
  homepage: string | null;
  redirectUris: ReadonlyArray<string>;
  createdAt: Date;
  /** People with the app connected now. */
  users: number;
}

export interface OAuthAppInput {
  name: string;
  homepage?: string | undefined;
  redirectUris: ReadonlyArray<string>;
}

const newSecret = () => `jrs_${newToken()}`;

const checkInput = (input: OAuthAppInput) =>
  Effect.gen(function* () {
    const name = input.name.trim().slice(0, 80);
    if (!name) return yield* O.fail('invalid_client_metadata', 'Name the app');
    const homepage = input.homepage?.trim() || null;
    if (homepage && !/^https?:\/\/[^\s]+$/.test(homepage)) {
      return yield* O.fail(
        'invalid_client_metadata',
        'The homepage must be an http(s) URL'
      );
    }
    const uris = [...new Set(input.redirectUris.map((u) => u.trim()))].filter(
      Boolean
    );
    if (
      uris.length === 0 ||
      uris.length > 10 ||
      !uris.every(O.allowedRedirect)
    ) {
      return yield* O.fail(
        'invalid_redirect_uri',
        'Give 1 to 10 redirect URIs: https, loopback http, or an app scheme'
      );
    }
    return { name, homepage, uris };
  });

/**
 * The OAuth apps a person registers for their own product (an ATS, a job
 * board): each has a secret, shown once, and the users who connected it.
 */
export const appQueries = (sql: SqlClient.SqlClient) => {
  const list = (ownerId: string, id?: string) =>
    sql`
      SELECT c.id, c.name, c.homepage, c.redirect_uris, c.created_at,
             (SELECT count(DISTINCT t.user_id)::int FROM app.oauth_tokens t WHERE t.client_id = c.id) AS users
      FROM app.oauth_clients c
      WHERE c.owner_id = ${ownerId} ${id ? sql`AND c.id = ${id}` : sql``}
      ORDER BY c.created_at DESC
    `.pipe(
      Effect.flatMap(decode),
      Effect.map((rows) => rows.map(toRecord)),
      Effect.orDie
    );

  const createApp = Effect.fn('OAuth.createApp')(function* (
    ownerId: string,
    input: OAuthAppInput
  ) {
    const { name, homepage, uris } = yield* checkInput(input);
    if ((yield* list(ownerId)).length >= MAX_APPS) {
      return yield* O.fail(
        'too_many_apps',
        `You can register ${MAX_APPS} apps`
      );
    }
    const id = `jrc_${randomBytes(16).toString('base64url')}`;
    const secret = newSecret();
    yield* sql`
      INSERT INTO app.oauth_clients (id, name, redirect_uris, owner_id, secret_hash, homepage)
      VALUES (${id}, ${name}, ${JSON.stringify(
      uris
    )}::jsonb, ${ownerId}, ${hashToken(secret)}, ${homepage})
    `.pipe(Effect.orDie);
    const [app] = yield* list(ownerId, id);
    return { app: app as OAuthAppRecord, secret };
  });

  const updateApp = Effect.fn('OAuth.updateApp')(function* (
    ownerId: string,
    id: string,
    input: OAuthAppInput
  ) {
    const { name, homepage, uris } = yield* checkInput(input);
    yield* sql`
      UPDATE app.oauth_clients SET name = ${name}, homepage = ${homepage}, redirect_uris = ${JSON.stringify(
      uris
    )}::jsonb
      WHERE id = ${id} AND owner_id = ${ownerId}
    `.pipe(Effect.orDie);
    const [app] = yield* list(ownerId, id);
    return app ?? (yield* O.fail('invalid_client', 'No such app'));
  });

  /** A new secret; the old one stops working at once. */
  const rotateSecret = Effect.fn('OAuth.rotateSecret')(function* (
    ownerId: string,
    id: string
  ) {
    const secret = newSecret();
    const rows = yield* sql`
      UPDATE app.oauth_clients SET secret_hash = ${hashToken(secret)}
      WHERE id = ${id} AND owner_id = ${ownerId} RETURNING id
    `.pipe(Effect.orDie);
    if (rows.length === 0)
      return yield* O.fail('invalid_client', 'No such app');
    return secret;
  });

  /** Deleting an app disconnects everyone who connected it. */
  const deleteApp = (ownerId: string, id: string) =>
    sql`DELETE FROM app.oauth_clients WHERE id = ${id} AND owner_id = ${ownerId}`.pipe(
      Effect.asVoid,
      Effect.orDie
    );

  return {
    apps: (ownerId: string) => list(ownerId),
    createApp,
    updateApp,
    rotateSecret,
    deleteApp,
  };
};

const toRecord = (row: typeof AppRow.Type): OAuthAppRecord => ({
  id: row.id,
  name: row.name,
  homepage: row.homepage,
  redirectUris: row.redirect_uris,
  createdAt: row.created_at,
  users: row.users,
});
