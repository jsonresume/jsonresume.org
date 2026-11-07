/**
 * For tests: reading back what Chromium printed (its text, where each run
 * of it sits, a small picture of a page) and whether Chromium is here.
 */
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

/** Whether this machine can print: Playwright's Chromium is installed. */
export const chromiumInstalled = async () => {
  const { chromium } = await import('playwright-core');
  return chromium
    .launch({ headless: true })
    .then((browser) => browser.close().then(() => true))
    .catch(() => false);
};

export interface PrintedRun {
  page: number;
  text: string;
  /** The run's box, in points from the page's bottom left corner. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PrintedPdf {
  pages: { width: number; height: number }[];
  runs: PrintedRun[];
  /** Every run in drawing order: runs drawn side by side join up. */
  text: string;
}

const open = (pdf: Uint8Array) =>
  getDocument({ data: pdf.slice(), isEvalSupported: false }).promise;

/** The text layer of a PDF, as a tracking system would extract it. */
export const readPdf = async (pdf: Uint8Array): Promise<PrintedPdf> => {
  const doc = await open(pdf);
  const out: PrintedPdf = { pages: [], runs: [], text: '' };
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const { width, height } = page.getViewport({ scale: 1 });
    out.pages.push({ width, height });
    let end = { x: Number.NaN, y: Number.NaN };
    for (const item of (await page.getTextContent()).items) {
      if (!('str' in item) || item.str === '') continue;
      const [, , , , x = 0, y = 0] = item.transform;
      const joins = Math.abs(y - end.y) < 1 && Math.abs(x - end.x) < 1.5;
      out.text += (joins ? '' : ' ') + item.str + (item.hasEOL ? '\n' : '');
      end = { x: x + item.width, y };
      if (item.str.trim())
        out.runs.push({
          page: n,
          text: item.str,
          x,
          y,
          width: item.width,
          height: item.height,
        });
    }
    out.text += '\n';
  }
  await doc.destroy();
  return out;
};

/** A page drawn small, in grey: enough to see the layout move. */
export interface Thumbnail {
  width: number;
  height: number;
  grey: Uint8Array;
}

const greyOf = (rgba: Uint8ClampedArray) => {
  const grey = new Uint8Array(rgba.length / 4);
  for (let i = 0; i < grey.length; i++)
    grey[i] = Math.round(
      0.299 * (rgba[i * 4] ?? 0) +
        0.587 * (rgba[i * 4 + 1] ?? 0) +
        0.114 * (rgba[i * 4 + 2] ?? 0)
    );
  return grey;
};

/** Page `n` of a PDF drawn `width` pixels wide, and that drawing as a PNG. */
export const drawPage = async (pdf: Uint8Array, n: number, width: number) => {
  const doc = await open(pdf);
  const page = await doc.getPage(n);
  const viewport = page.getViewport({ scale: width / page.view[2] });
  const canvas = createCanvas(width, Math.round(viewport.height));
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({
    canvas: null,
    canvasContext: context as unknown as CanvasRenderingContext2D,
    viewport,
  }).promise;
  await doc.destroy();
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const thumbnail: Thumbnail = {
    width: canvas.width,
    height: canvas.height,
    grey: greyOf(data),
  };
  return { thumbnail, png: canvas.toBuffer('image/png') };
};

/** A PNG made by drawPage, read back. */
export const readThumbnail = async (png: Uint8Array): Promise<Thumbnail> => {
  const image = await loadImage(Buffer.from(png));
  const canvas = createCanvas(image.width, image.height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, image.width, image.height);
  return { width: image.width, height: image.height, grey: greyOf(data) };
};

/**
 * How far apart two thumbnails are: the mean difference of their pixels and
 * the share that differ by more than a quarter, from 0 to 1. Different
 * sizes are as far apart as can be.
 */
export const difference = (a: Thumbnail, b: Thumbnail) => {
  if (a.width !== b.width || a.height !== b.height)
    return { mean: 1, changed: 1 };
  let total = 0;
  let changed = 0;
  for (let i = 0; i < a.grey.length; i++) {
    const d = Math.abs((a.grey[i] ?? 0) - (b.grey[i] ?? 0));
    total += d;
    if (d > 64) changed++;
  }
  return {
    mean: total / a.grey.length / 255,
    changed: changed / a.grey.length,
  };
};
