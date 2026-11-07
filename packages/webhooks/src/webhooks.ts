import { Clock, Context, Effect, Layer, Schedule, Schema } from 'effect';
import { SqlClient } from 'effect/sql';
import { WebhookSender } from './send';
import { newSigningSecret, signature } from './sign';

/** Minutes to wait before each retry: a day of tries in all. */
export const BACKOFF_MINUTES = [1, 5, 30, 120, 360, 720] as const;
const MAX_ATTEMPTS = BACKOFF_MINUTES.length + 1;

/** Grants that may read the resume: they get told when it changes. */
const READS = ['resume:read', 'resume:write', 'mcp'];

const Subscription = Schema.Struct({
  url: Schema.String,
  secret: Schema.String,
});
export type Subscription = typeof Subscription.Type;
const decodeSubs = Schema.decodeUnknownEffect(Schema.Array(Subscription));

const Due = Schema.Struct({
  id: Schema.String,
  url: Schema.String,
  secret: Schema.String,
  event: Schema.String,
  payload: Schema.String,
  attempts: Schema.Number,
});
const decodeDue = Schema.decodeUnknownEffect(Schema.Array(Due));

const isHttps = (url: string) => /^https:\/\/[^\s/]+\S*$/.test(url);

/** Subscriptions, the queue of deliveries, and sending what is due. */
export class Webhooks extends Context.Service<
  Webhooks,
  Effect.Success<typeof make>
>()('@repo/webhooks/Webhooks') {
  /** Needs a SqlClient and a WebhookSender; delivers when deliverDue runs. */
  static readonly layer = Layer.effect(
    Webhooks,
    Effect.suspend(() => make)
  );
  /** As layer, and delivers what is due every minute while it lives. */
  static readonly running = Layer.effectDiscard(
    Effect.gen(function* () {
      const hooks = yield* Webhooks;
      yield* Effect.forkScoped(
        hooks.deliverDue.pipe(Effect.repeat(Schedule.spaced('1 minute')))
      );
    })
  ).pipe(Layer.provideMerge(Webhooks.layer));
}

const make = Effect.gen(function* () {
  const sql = yield* SqlClient.SqlClient;
  const sender = yield* WebhookSender;

  /** An app's subscription; only its owner may see or change it. */
  const subscription = (ownerId: string, clientId: string) =>
    sql`
      SELECT s.url, s.secret FROM app.webhook_subscriptions s
      JOIN app.oauth_clients c ON c.id = s.client_id
      WHERE s.client_id = ${clientId} AND c.owner_id = ${ownerId}
    `.pipe(
      Effect.flatMap(decodeSubs),
      Effect.map((rows) => rows[0] ?? null),
      Effect.orDie
    );

  /** Set the URL (a new secret only when there was none), or null to stop. */
  const subscribe = Effect.fn('Webhooks.subscribe')(function* (
    ownerId: string,
    clientId: string,
    url: string | null
  ) {
    const [owned] = yield* sql`
      SELECT 1 FROM app.oauth_clients WHERE id = ${clientId} AND owner_id = ${ownerId}
    `.pipe(Effect.orDie);
    if (!owned) return { ok: false as const, reason: 'No such app of yours' };
    if (url === null) {
      yield* sql`DELETE FROM app.webhook_subscriptions WHERE client_id = ${clientId}`.pipe(
        Effect.orDie
      );
      return { ok: true as const, subscription: null };
    }
    const trimmed = url.trim();
    if (!isHttps(trimmed))
      return { ok: false as const, reason: 'The webhook URL must be https' };
    yield* sql`
      INSERT INTO app.webhook_subscriptions (client_id, url, secret)
      VALUES (${clientId}, ${trimmed}, ${newSigningSecret()})
      ON CONFLICT (client_id) DO UPDATE SET url = EXCLUDED.url
    `.pipe(Effect.orDie);
    return {
      ok: true as const,
      subscription: yield* subscription(ownerId, clientId),
    };
  });

  /** Queue resume.updated for every subscribed app this person granted. */
  const resumeUpdated = (userId: string) =>
    sql`
      INSERT INTO app.webhook_deliveries (client_id, user_id, event, payload)
      SELECT DISTINCT s.client_id, ${userId}::uuid, 'resume.updated',
        jsonb_build_object(
          'type', 'resume.updated',
          'created_at', now(),
          'user', jsonb_build_object(
            'sub', ${userId}::text,
            'username', (SELECT p.username FROM app.profiles p
                         WHERE p.user_id = ${userId}::uuid AND p.kind = 'account' LIMIT 1)))
      FROM app.webhook_subscriptions s
      JOIN app.oauth_tokens t ON t.client_id = s.client_id
      WHERE t.user_id = ${userId}::uuid
        AND string_to_array(t.scope, ' ') && ${`{${READS.join(',')}}`}::text[]
    `.pipe(Effect.asVoid, Effect.orDie);

  /** Send every delivery that is due; failures wait for their next try. */
  const deliverDue = Effect.gen(function* () {
    const due = yield* sql`
      SELECT d.id::text AS id, s.url, s.secret, d.event, d.payload::text AS payload, d.attempts
      FROM app.webhook_deliveries d JOIN app.webhook_subscriptions s ON s.client_id = d.client_id
      WHERE d.delivered_at IS NULL AND d.attempts < ${MAX_ATTEMPTS} AND d.next_attempt_at <= now()
      ORDER BY d.next_attempt_at LIMIT 50
    `.pipe(Effect.flatMap(decodeDue), Effect.orDie);
    for (const d of due) {
      const body = JSON.stringify({ id: d.id, ...JSON.parse(d.payload) });
      const at = Math.floor((yield* Clock.currentTimeMillis) / 1000);
      const sent = yield* sender.send(d.url, body, {
        'jsonresume-event': d.event,
        'jsonresume-delivery': d.id,
        'jsonresume-signature': signature(d.secret, body, at),
      });
      const ok = 'status' in sent && sent.status >= 200 && sent.status < 300;
      const wait = BACKOFF_MINUTES.at(d.attempts) ?? 0;
      yield* sql`
        UPDATE app.webhook_deliveries SET
          attempts = attempts + 1,
          delivered_at = ${ok ? sql`now()` : sql`NULL`},
          last_status = ${'status' in sent ? sent.status : null},
          last_error = ${'error' in sent ? sent.error.slice(0, 200) : null},
          next_attempt_at = now() + make_interval(mins => ${wait})
        WHERE id = ${d.id}::uuid
      `.pipe(Effect.orDie);
    }
    return due.length;
  });

  return { subscription, subscribe, resumeUpdated, deliverDue };
});
