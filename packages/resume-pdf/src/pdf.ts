import { Clock, Context, Effect, Layer, Schema, Semaphore } from 'effect';
import { createHash } from 'node:crypto';
import type { Browser } from 'playwright-core';
import { fitOnePage } from './fit.ts';
import { mayLoad, type Paper } from './policy.ts';

/** The browser could not print the page. */
export class PdfFailed extends Schema.TaggedError<PdfFailed>()('PdfFailed', {
  message: Schema.String,
}) {}

/** Prints at a time: each holds a Chromium page, a few hundred MB at worst. */
const CONCURRENT = 2;
/** The same page printed again within this long comes from memory. */
const CACHE_MS = 5 * 60_000;
const CACHE_SIZE = 40;

/** How to print: `fit` shrinks a page that runs slightly over onto one. */
export interface PrintOptions {
  readonly fit?: boolean;
}

/**
 * Prints a resume's themed page to PDF with headless Chromium, as a reader
 * would with "Save as PDF": backgrounds on, the theme's print styles, no
 * scripts. One browser serves every print, launched on first use and again
 * if it dies; prints wait their turn.
 */
export class ResumePdf extends Context.Service<
  ResumePdf,
  {
    print(
      html: string,
      paper: Paper,
      options?: PrintOptions
    ): Effect.Effect<Uint8Array<ArrayBuffer>, PdfFailed>;
  }
>()('@repo/resume-pdf/ResumePdf') {
  static readonly layer = Layer.effect(
    ResumePdf,
    Effect.gen(function* () {
      const turns = yield* Semaphore.make(CONCURRENT);
      const launching = yield* Semaphore.make(1);
      let browser: Browser | undefined;
      const cache = new Map<
        string,
        { pdf: Uint8Array<ArrayBuffer>; at: number }
      >();

      yield* Effect.addFinalizer(() =>
        Effect.promise(async () => browser?.close())
      );

      const open = launching.withPermits(1)(
        Effect.tryPromise({
          try: async () => {
            if (browser?.isConnected()) return browser;
            const { chromium } = await import('playwright-core');
            browser = await chromium.launch({ headless: true });
            return browser;
          },
          catch: (e) => new PdfFailed({ message: `launch: ${String(e)}` }),
        })
      );

      const attempt = <A>(what: string, f: () => Promise<A>) =>
        Effect.tryPromise({
          try: f,
          catch: (e) => new PdfFailed({ message: `${what}: ${String(e)}` }),
        });

      const render = (html: string, paper: Paper, fit: boolean) =>
        Effect.acquireUseRelease(
          Effect.flatMap(open, (chrome) =>
            attempt('context', () =>
              chrome.newContext({ javaScriptEnabled: false })
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
              // Insert before loading: style onload callbacks do not run with
              // scripts disabled. The requested sheet beats template defaults.
              const sizedHtml = html.replace(
                /<\/head>/i,
                `<style>@page{size:${
                  paper === 'letter' ? 'Letter' : 'A4'
                }!important}</style></head>`
              );
              // Fonts and images get a while to arrive, then it prints with
              // what it has.
              yield* attempt('load', () =>
                page.setContent(sizedHtml, {
                  waitUntil: 'networkidle',
                  timeout: 15_000,
                })
              ).pipe(Effect.ignore);
              yield* attempt('fonts', () =>
                page.evaluate(() => document.fonts.ready.then(() => undefined))
              ).pipe(
                Effect.timeoutOrElse({
                  duration: '5 seconds',
                  orElse: () => Effect.succeed(undefined),
                }),
                Effect.ignore
              );
              const at = (scale: number) =>
                attempt('print', () =>
                  page.pdf({
                    format: paper === 'letter' ? 'Letter' : 'A4',
                    printBackground: true,
                    preferCSSPageSize: false,
                    scale,
                  })
                ).pipe(Effect.map((pdf) => new Uint8Array(pdf)));
              return yield* fit ? fitOnePage(at) : at(1);
            }),
          (context) => Effect.promise(() => context.close()).pipe(Effect.ignore)
        ).pipe(
          Effect.timeoutOrElse({
            duration: '40 seconds',
            orElse: () => Effect.fail(new PdfFailed({ message: 'timed out' })),
          })
        );

      const print = (html: string, paper: Paper, options?: PrintOptions) =>
        Effect.gen(function* () {
          const fit = options?.fit === true;
          const key = createHash('sha256')
            .update(`${paper}:${fit ? 'fit' : 'full'}:`)
            .update(html)
            .digest('hex');
          const now = yield* Clock.currentTimeMillis;
          const hit = cache.get(key);
          if (hit && now - hit.at < CACHE_MS) return hit.pdf;
          const pdf = yield* turns.withPermits(1)(render(html, paper, fit));
          if (cache.size >= CACHE_SIZE) {
            const oldest = cache.keys().next().value;
            if (oldest !== undefined) cache.delete(oldest);
          }
          cache.set(key, { pdf, at: now });
          return pdf;
        });

      return ResumePdf.of({ print });
    })
  );
}
