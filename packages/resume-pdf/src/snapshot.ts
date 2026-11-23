import { Effect, type Semaphore } from 'effect';
import type { Browser } from 'playwright-core';
import { PdfFailed } from './errors.ts';
import { mayLoad } from './policy.ts';

type Attempt = <A>(
  what: string,
  f: () => Promise<A>
) => Effect.Effect<A, PdfFailed>;

/**
 * ResumePdf.snapshot: a PNG of a page at a fixed size, with the same rules
 * as printing (no scripts, only the public web) and the same turns.
 */
export const makeSnapshot =
  (
    open: Effect.Effect<Browser, PdfFailed>,
    attempt: Attempt,
    turns: Semaphore.Semaphore
  ) =>
  (html: string, size: { width: number; height: number }) =>
    turns.withPermits(1)(
      Effect.acquireUseRelease(
        Effect.flatMap(open, (chrome) =>
          attempt('context', () =>
            chrome.newContext({ javaScriptEnabled: false, viewport: size })
          )
        ),
        (context) =>
          Effect.gen(function* () {
            yield* attempt('route', () =>
              context.route('**/*', async (route) =>
                (await mayLoad(route.request().url()))
                  ? route.continue()
                  : route.abort('blockedbyclient')
              )
            );
            const page = yield* attempt('page', () => context.newPage());
            yield* attempt('load', () =>
              page.setContent(html, {
                waitUntil: 'networkidle',
                timeout: 10_000,
              })
            ).pipe(Effect.ignore);
            const png = yield* attempt('snapshot', () =>
              page.screenshot({ type: 'png' })
            );
            return new Uint8Array(png);
          }),
        (context) => Effect.promise(() => context.close()).pipe(Effect.ignore)
      ).pipe(
        Effect.timeoutOrElse({
          duration: '25 seconds',
          orElse: () => Effect.fail(new PdfFailed({ message: 'timed out' })),
        })
      )
    );
