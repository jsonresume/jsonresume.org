import { Config, Context, Effect, Layer, Option } from 'effect';
import { PostHog } from 'posthog-node';

/** What the server reports, each under the account's id. */
export type ProductEventName =
  | 'user_signed_up'
  | 'user_signed_in'
  | 'email_verified'
  | 'resume_saved'
  | 'resume_source_changed'
  | 'username_changed'
  | 'account_deleted'
  | 'api_key_created'
  | 'oauth_app_created'
  | 'oauth_access_granted'
  | 'mcp_tool_called'
  | 'import_started'
  | 'import_finished';

/** Plain values only: never an email, a name or resume text. */
export type ProductEventProperties = Readonly<
  Record<string, string | number | boolean | null>
>;

/** Server-side events in PostHog; never fails, never slows a request. */
export class ProductEvents extends Context.Service<
  ProductEvents,
  {
    capture(
      accountId: string,
      event: ProductEventName,
      properties?: ProductEventProperties
    ): Effect.Effect<void>;
  }
>()('@repo/posthog/ProductEvents') {
  /** Drops every event: tests, and servers without POSTHOG_PROJECT_TOKEN. */
  static readonly off = Layer.succeed(
    ProductEvents,
    ProductEvents.of({ capture: () => Effect.void })
  );

  static readonly layer = Layer.unwrap(
    Effect.gen(function* () {
      const token = yield* Config.option(
        Config.String('POSTHOG_PROJECT_TOKEN')
      );
      const host = yield* Config.String('POSTHOG_HOST').pipe(
        Config.withDefault('https://us.i.posthog.com')
      );
      if (Option.isNone(token)) {
        yield* Effect.logWarning(
          'Product events off: POSTHOG_PROJECT_TOKEN is not set'
        );
        return ProductEvents.off;
      }
      return Layer.effect(
        ProductEvents,
        Effect.gen(function* () {
          // Batched in the background; flushed when the server stops.
          const client = yield* Effect.acquireRelease(
            Effect.sync(() => new PostHog(token.value, { host })),
            (c) => Effect.promise(() => c.shutdown())
          );
          return ProductEvents.of({
            capture: (accountId, event, properties) =>
              Effect.sync(() =>
                client.capture({ distinctId: accountId, event, properties })
              ),
          });
        })
      );
    })
  );
}

/** Reports an event where ProductEvents is provided, and does nothing elsewhere. */
export const track = (
  accountId: string,
  event: ProductEventName,
  properties?: ProductEventProperties
) =>
  Effect.flatMap(
    Effect.serviceOption(ProductEvents),
    Option.match({
      onNone: () => Effect.void,
      onSome: (events) => events.capture(accountId, event, properties),
    })
  );

/**
 * track, bound when a layer is built: for plain routes and middleware, whose
 * requests don't carry the services the layer was given.
 */
export const tracker = Effect.map(
  Effect.serviceOption(ProductEvents),
  (events) =>
    (
      accountId: string,
      event: ProductEventName,
      properties?: ProductEventProperties
    ): Effect.Effect<void> =>
      Option.isSome(events)
        ? events.value.capture(accountId, event, properties)
        : Effect.void
);
