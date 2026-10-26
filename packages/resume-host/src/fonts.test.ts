import { describe, expect, it } from 'vitest';
import { externalizeFonts, themeFont } from './fonts';

const big = Buffer.alloc(9000, 7).toString('base64');
const page = (data: string) =>
  `<style>@font-face { src: url(data:font/woff2;base64,${data}) format('woff2'); }</style>`;

describe('externalizeFonts', () => {
  it('serves large inline fonts from /_fonts, cached for good', async () => {
    const html = externalizeFonts(page(big));
    const url = /url\((\/_fonts\/[\w-]+\.woff2)\)/.exec(html)?.[1];
    expect(url).toBeDefined();
    expect(html).not.toContain('base64');
    const res = await themeFont(new Request(`https://jsonresume.org${url}`));
    expect(res?.headers.get('content-type')).toBe('font/woff2');
    expect(res?.headers.get('cache-control')).toContain('immutable');
    expect(
      Buffer.from(await (res?.arrayBuffer() ?? new ArrayBuffer(0)))
    ).toEqual(Buffer.alloc(9000, 7));
  });

  it('names a font by its content, so pages share it', () => {
    expect(externalizeFonts(page(big))).toBe(externalizeFonts(page(big)));
  });

  it('leaves small fonts inline', () => {
    const small = page(Buffer.alloc(100).toString('base64'));
    expect(externalizeFonts(small)).toBe(small);
  });

  it('knows nothing it has not served', async () => {
    const req = new Request('https://jsonresume.org/_fonts/nope.woff2');
    expect(await themeFont(req)).toBeUndefined();
  });
});
