import { TestDatabase } from '@repo/database/testing';
import { Effect, Layer } from 'effect';
import { SqlClient } from 'effect/sql';
import { describe, expect, it } from 'vitest';
import { WebhookSender, type Sent } from './send';
import { verifySignature } from './sign';
import { Webhooks } from './webhooks';

interface Call {
  url: string;
  body: string;
  headers: Record<string, string>;
}

/** Webhooks over a fresh database, with a sender that answers `status`. */
const setup = (answers: Array<Sent>) => {
  const calls: Call[] = [];
  const sender = Layer.succeed(
    WebhookSender,
    WebhookSender.of({
      send: (url, body, headers) =>
        Effect.sync(() => {
          calls.push({ url, body, headers });
          return answers.shift() ?? { status: 200 };
        }),
    })
  );
  const layer = Webhooks.layer.pipe(
    Layer.provide(sender),
    Layer.provideMerge(TestDatabase)
  );
  const run = <A, E>(e: Effect.Effect<A, E, Webhooks | SqlClient.SqlClient>) =>
    Effect.runPromise(Effect.provide(e, layer));
  return { run, calls };
};

/** An owner with an app, and Ada, who granted it `scope`. */
const seed = (scope: string) =>
  Effect.gen(function* () {
    const sql = yield* SqlClient.SqlClient;
    const [owner] = yield* sql<{ id: string }>`
      INSERT INTO app.users (email) VALUES ('maker@example.com') RETURNING id`;
    const [ada] = yield* sql<{ id: string }>`
      INSERT INTO app.users (email) VALUES ('ada@example.com') RETURNING id`;
    yield* sql`
      INSERT INTO app.oauth_clients (id, name, redirect_uris, owner_id)
      VALUES ('jrc_ats', 'Acme ATS', '["https://ats.example/cb"]', ${owner?.id})`;
    yield* sql`
      INSERT INTO app.oauth_tokens (client_id, user_id, access_hash, refresh_hash, scope,
        access_expires_at, refresh_expires_at)
      VALUES ('jrc_ats', ${ada?.id}, 'a', 'r', ${scope}, now(), now())`;
    return { owner: owner?.id ?? '', ada: ada?.id ?? '' };
  });

describe('Webhooks', () => {
  it('tells a subscribed app its reader changed their resume, signed', async () => {
    const { run, calls } = setup([]);
    const sub = await run(
      Effect.gen(function* () {
        const hooks = yield* Webhooks;
        const { owner, ada } = yield* seed('openid resume:read');
        const made = yield* hooks.subscribe(
          owner,
          'jrc_ats',
          'https://ats.example/hook'
        );
        yield* hooks.resumeUpdated(ada);
        expect(yield* hooks.deliverDue).toBe(1);
        expect(yield* hooks.deliverDue).toBe(0);
        return made;
      })
    );
    expect(sub.ok && sub.subscription?.secret).toMatch(/^whsec_/);
    const [call] = calls;
    expect(call?.url).toBe('https://ats.example/hook');
    expect(JSON.parse(call?.body ?? '{}')).toMatchObject({
      type: 'resume.updated',
      user: { sub: expect.any(String) },
    });
    const secret = sub.ok ? sub.subscription?.secret ?? '' : '';
    expect(
      verifySignature(
        secret,
        call?.body ?? '',
        call?.headers['jsonresume-signature'] ?? ''
      )
    ).toBe(true);
    expect(
      verifySignature(
        secret,
        `${call?.body} `,
        call?.headers['jsonresume-signature'] ?? ''
      )
    ).toBe(false);
  });

  it('skips apps without a resume grant, and retries failures later', async () => {
    const { run, calls } = setup([{ status: 500 }]);
    const rows = await run(
      Effect.gen(function* () {
        const hooks = yield* Webhooks;
        const sql = yield* SqlClient.SqlClient;
        const { owner, ada } = yield* seed('openid email');
        yield* hooks.subscribe(owner, 'jrc_ats', 'https://ats.example/hook');
        yield* hooks.resumeUpdated(ada);
        expect(yield* hooks.deliverDue).toBe(0);
        yield* sql`UPDATE app.oauth_tokens SET scope = 'mcp'`;
        yield* hooks.resumeUpdated(ada);
        yield* hooks.deliverDue;
        return yield* sql`
          SELECT attempts, delivered_at IS NULL AS waiting, last_status,
                 next_attempt_at > now() AS later
          FROM app.webhook_deliveries`;
      })
    );
    expect(calls).toHaveLength(1);
    expect(rows).toEqual([
      { attempts: 1, waiting: true, last_status: 500, later: true },
    ]);
  });

  it('only lets an app’s owner subscribe it, to https', async () => {
    const { run } = setup([]);
    const [other, plain, off] = await run(
      Effect.gen(function* () {
        const hooks = yield* Webhooks;
        const { owner, ada } = yield* seed('mcp');
        return [
          yield* hooks.subscribe(ada, 'jrc_ats', 'https://ats.example/hook'),
          yield* hooks.subscribe(owner, 'jrc_ats', 'http://ats.example/hook'),
          yield* hooks.subscribe(owner, 'jrc_ats', null),
        ];
      })
    );
    expect(other).toEqual({ ok: false, reason: 'No such app of yours' });
    expect(plain).toMatchObject({ ok: false });
    expect(off).toEqual({ ok: true, subscription: null });
  });
});
