import { Context, Effect, Layer, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { diffResumes, type Change } from './diff';
import type { Actor } from './versions';

/** Pending proposals a person may have at once; older ones are dropped. */
export const MAX_PENDING = 20;

const Row = Schema.Struct({
  id: Schema.String,
  actor_kind: Schema.String,
  actor_id: Schema.NullOr(Schema.String),
  actor_name: Schema.NullOr(Schema.String),
  note: Schema.NullOr(Schema.String),
  resume: Schema.Unknown,
  created_at: Schema.Date,
});
const decode = Schema.decodeUnknownEffect(Schema.Array(Row));

export interface Proposal {
  id: string;
  /** Who proposed it: an app or an assistant, by name. */
  by: { kind: string; id: string | null; name: string | null };
  note: string | null;
  /** The whole resume as it would be. */
  resume: unknown;
  createdAt: Date;
}

/** Who proposed it, as the version it becomes records them. */
export const proposerOf = (p: Proposal): Actor => ({
  kind: p.by.kind === 'assistant' ? 'assistant' : 'app',
  id: p.by.id,
  name: p.by.name,
});

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const toProposal = (r: typeof Row.Type): Proposal => ({
  id: r.id,
  by: { kind: r.actor_kind, id: r.actor_id, name: r.actor_name },
  note: r.note,
  resume: r.resume,
  createdAt: r.created_at,
});

/**
 * Proposals: changes an app or assistant suggests instead of saving, for
 * the person to accept (saved as a version by that app) or reject.
 */
export class Proposals extends Context.Service<
  Proposals,
  Effect.Success<typeof make>
>()('@repo/resume-versions/Proposals') {
  /** Needs a SqlClient. */
  static readonly layer = Layer.effect(
    Proposals,
    Effect.suspend(() => make)
  );
}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;

  const pending = (userId: string, id?: string) =>
    id !== undefined && !UUID.test(id)
      ? Effect.succeed<Proposal[]>([])
      : list(userId, id);
  const list = (userId: string, id?: string) =>
    sql`
      SELECT id::text AS id, actor_kind, actor_id, actor_name, note, resume, created_at
      FROM app.change_proposals
      WHERE user_id = ${userId} AND state = 'pending' ${
      id ? sql`AND id = ${id}::uuid` : sql``
    }
      ORDER BY created_at DESC
    `.pipe(
      Effect.flatMap(decode),
      Effect.map((rows) => rows.map(toProposal)),
      Effect.orDie
    );

  /** Keep a proposal; beyond MAX_PENDING the oldest pending is dropped. */
  const propose = Effect.fn('Proposals.propose')(function* (
    userId: string,
    resume: unknown,
    by: Actor,
    note: string | null
  ) {
    const [row] = yield* sql<{ id: string }>`
      INSERT INTO app.change_proposals (user_id, actor_kind, actor_id, actor_name, note, resume)
      VALUES (${userId}, ${by.kind}, ${by.id}, ${by.name}, ${
      note?.slice(0, 500) ?? null
    },
              ${JSON.stringify(resume)}::json)
      RETURNING id::text AS id
    `.pipe(Effect.orDie);
    yield* sql`
      UPDATE app.change_proposals SET state = 'dropped'
      WHERE user_id = ${userId} AND state = 'pending' AND id NOT IN (
        SELECT id FROM app.change_proposals
        WHERE user_id = ${userId} AND state = 'pending'
        ORDER BY created_at DESC LIMIT ${MAX_PENDING})
    `.pipe(Effect.orDie);
    return row?.id ?? '';
  });

  /** Mark a pending proposal decided; the proposal, if it was pending. */
  const decide = Effect.fn('Proposals.decide')(function* (
    userId: string,
    id: string,
    state: 'accepted' | 'rejected'
  ) {
    const [found] = yield* pending(userId, id);
    if (!found) return undefined;
    yield* sql`
      UPDATE app.change_proposals SET state = ${state}, decided_at = now()
      WHERE id = ${id}::uuid AND user_id = ${userId}
    `.pipe(Effect.orDie);
    return found;
  });

  /** What a proposal changes, against the resume as it is now. */
  const changes = (current: unknown, p: Proposal): Change[] =>
    diffResumes(current, p.resume);

  return { pending, propose, decide, changes };
});
