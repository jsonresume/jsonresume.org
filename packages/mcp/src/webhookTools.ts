import { WebhookSettings } from '@repo/api';
import { Webhooks } from '@repo/webhooks';
import { Effect, Schema } from 'effect';
import { Tool, Toolkit } from 'effect/ai';
import { caller, describe, failing, failWith, hints } from './context';

export const WebhookToolkit = Toolkit.make(
  Tool.make('set_app_webhook', {
    description: describe('set_app_webhook'),
    parameters: Schema.Struct({
      client_id: Schema.String.annotate({
        description: 'Your app’s client_id',
      }),
      url: Schema.NullOr(Schema.String).annotate({
        description: 'An https URL to POST resume.updated to, or null to stop',
      }),
    }),
    success: Schema.Struct({ webhook: Schema.NullOr(WebhookSettings) }),
    ...failing,
  }).annotateMerge(hints('set_app_webhook', true))
);

/** Needs Webhooks. */
export const WebhookHandlers = WebhookToolkit.toLayer(
  Effect.gen(function* () {
    const hooks = yield* Webhooks;
    return {
      set_app_webhook: ({ client_id, url }) =>
        Effect.gen(function* () {
          const user = yield* caller;
          const made = yield* hooks.subscribe(user.id, client_id, url);
          if (!made.ok) return yield* failWith(made.reason);
          return { webhook: made.subscription };
        }),
    };
  })
);
