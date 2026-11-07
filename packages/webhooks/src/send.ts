import { mayLoad } from '@repo/resume-pdf/policy';
import { Context, Effect, Layer } from 'effect';

/** How a try went: the status code, or why there was none. */
export type Sent = { status: number } | { error: string };

/** POSTs a delivery. Real HTTP in the app; a fake in tests. */
export class WebhookSender extends Context.Service<
  WebhookSender,
  {
    send(
      url: string,
      body: string,
      headers: Record<string, string>
    ): Effect.Effect<Sent>;
  }
>()('@repo/webhooks/WebhookSender') {
  /** Public HTTPS only (no private or local addresses), no redirects, 10s. */
  static readonly layer = Layer.succeed(
    WebhookSender,
    WebhookSender.of({
      send: (url, body, headers) =>
        Effect.tryPromise(async (): Promise<Sent> => {
          if (!url.startsWith('https://') || !(await mayLoad(url)))
            return { error: 'not a public https address' };
          const response = await fetch(url, {
            method: 'POST',
            body,
            headers: { 'content-type': 'application/json', ...headers },
            redirect: 'manual',
            signal: AbortSignal.timeout(10_000),
          });
          return { status: response.status };
        }).pipe(
          Effect.catch((e) => Effect.succeed<Sent>({ error: String(e) }))
        ),
    })
  );
}
