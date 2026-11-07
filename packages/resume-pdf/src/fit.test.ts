import sample from '@jsonresume/sample-data/complete-resume.json';
import { renderTheme } from '@repo/resume-themes';
import { Effect, Layer, ManagedRuntime } from 'effect';
import { afterAll, describe, expect, it } from 'vitest';
import { fitOnePage, MIN_SCALE, pageCount } from './fit';
import { ResumePdf } from './pdf';
import { chromiumInstalled, readPdf } from './testing';

/** A stand-in PDF: its pages, and the scale it was printed at. */
const fake = (pages: number, scale: number) =>
  new TextEncoder().encode(
    `%PDF-1.4 /Type /Pages /Count ${pages} ${'<< /Type /Page >> '.repeat(
      pages
    )}%scale=${scale}`
  );

/** Prints a resume `height` pages long at full size, counting the prints. */
const printer = (height: number) => {
  const scales: number[] = [];
  const print = (scale: number) =>
    Effect.sync(() => {
      scales.push(scale);
      return fake(Math.ceil(height * scale - 1e-9), scale);
    });
  return { scales, print };
};

const scaleOf = (pdf: Uint8Array) =>
  Number(/%scale=([\d.]+)/.exec(new TextDecoder().decode(pdf))?.[1]);

describe('pageCount', () => {
  it('counts page objects, not the page tree', () => {
    expect(pageCount(fake(3, 1))).toBe(3);
    expect(pageCount(new TextEncoder().encode('/Type/Page /Type /Pages'))).toBe(
      1
    );
    expect(pageCount(new Uint8Array())).toBe(0);
  });
});

describe('fitOnePage', () => {
  it('leaves one page alone, after one print', async () => {
    const { scales, print } = printer(0.8);
    expect(scaleOf(await Effect.runPromise(fitOnePage(print)))).toBe(1);
    expect(scales).toEqual([1]);
  });

  it('shrinks a slight overflow no more than it must', async () => {
    const { scales, print } = printer(1.1);
    const pdf = await Effect.runPromise(fitOnePage(print));
    expect(pageCount(pdf)).toBe(1);
    // 1 / 1.1 = 0.909: the largest tried scale that fits, within 2%.
    expect(scaleOf(pdf)).toBeGreaterThan(0.89);
    expect(scaleOf(pdf)).toBeLessThanOrEqual(1 / 1.1);
    expect(scales).toHaveLength(5);
    expect(Math.min(...scales)).toBe(MIN_SCALE);
  });

  it('prints at full size what would need more than a 15% shrink', async () => {
    for (const height of [1.3, 2.5]) {
      const { print } = printer(height);
      const pdf = await Effect.runPromise(fitOnePage(print));
      expect(scaleOf(pdf)).toBe(1);
      expect(pageCount(pdf)).toBe(Math.ceil(height));
    }
  });
});

const runtime = ManagedRuntime.make(Layer.fresh(ResumePdf.layer));
const run = await chromiumInstalled();

describe.runIf(run)('?fit=1 in Chromium', () => {
  afterAll(() => runtime.dispose());
  const print = (resume: Record<string, unknown>, fit: boolean) =>
    runtime.runPromise(
      Effect.gen(function* () {
        const html = yield* renderTheme('pro', resume);
        return yield* (yield* ResumePdf).print(html, 'a4', { fit });
      })
    );

  it(
    'fits a resume a little over one page onto one, every word kept',
    {
      timeout: 60_000,
    },
    async () => {
      const { basics, work, education, skills } = sample;
      const short = { basics, work, education, skills };
      const full = await print(short, false);
      const fitted = await print(short, true);
      expect(pageCount(full)).toBe(2);
      expect(pageCount(fitted)).toBe(1);
      const words = (pdf: Uint8Array) =>
        readPdf(pdf).then((p) => p.text.split(/\s+/).filter(Boolean).sort());
      expect(await words(fitted)).toEqual(await words(full));
    }
  );

  it('leaves a long resume as it is', { timeout: 60_000 }, async () => {
    const resume: Record<string, unknown> = sample;
    expect(pageCount(await print(resume, true))).toBe(
      pageCount(await print(resume, false))
    );
  });
});
