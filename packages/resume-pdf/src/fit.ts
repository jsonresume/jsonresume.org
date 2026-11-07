import { Effect } from 'effect';

/** The pages in a PDF Chromium printed: one `/Type /Page` object each. */
export const pageCount = (pdf: Uint8Array): number =>
  Buffer.from(pdf.buffer, pdf.byteOffset, pdf.byteLength)
    .toString('latin1')
    .match(/\/Type\s*\/Page(?![A-Za-z])/g)?.length ?? 0;

/** The smallest a fitted page is printed: 85% of its size. */
export const MIN_SCALE = 0.85;

/** Halvings between MIN_SCALE and full size: to within 2%. */
const STEPS = 3;

/**
 * Fit a resume that runs slightly over one page onto one. It is printed at
 * full size first, which measures it: one page is done, and more than two
 * can't fit within MIN_SCALE. Two pages are printed at MIN_SCALE; if that
 * still takes two, the full-size print stands. Otherwise the largest scale
 * that fits is found by halving the range between, so text shrinks no more
 * than it must.
 */
export const fitOnePage = <E>(
  print: (scale: number) => Effect.Effect<Uint8Array<ArrayBuffer>, E>
) =>
  Effect.gen(function* () {
    const full = yield* print(1);
    if (pageCount(full) !== 2) return full;
    let best = yield* print(MIN_SCALE);
    if (pageCount(best) !== 1) return full;
    let [fits, overflows] = [MIN_SCALE, 1];
    for (let step = 0; step < STEPS; step++) {
      const scale = (fits + overflows) / 2;
      const pdf = yield* print(scale);
      if (pageCount(pdf) === 1) [fits, best] = [scale, pdf];
      else overflows = scale;
    }
    return best;
  });
