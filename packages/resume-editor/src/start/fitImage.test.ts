import { describe, expect, it } from 'vitest';
import { extensionOf, fitImage } from './fitImage';

describe('fitImage', () => {
  it('leaves files under the limit, and anything not an image, alone', async () => {
    const small = new File(['x'], 'cv.png', { type: 'image/png' });
    const pdf = new File(['xxxx'], 'cv.pdf', { type: 'application/pdf' });
    expect(await fitImage(small, 10)).toBe(small);
    expect(await fitImage(pdf, 1)).toBe(pdf);
  });

  it('returns an image it cannot decode as it is, for the size check', async () => {
    const heic = new File(['xxxx'], 'cv.heic', { type: 'image/heic' });
    expect(await fitImage(heic, 1)).toBe(heic);
  });
});

describe('extensionOf', () => {
  it('gives the extension only, lower case', () => {
    expect(extensionOf(new File([''], 'My CV 2026.HEIC'))).toBe('heic');
    expect(extensionOf(new File([''], 'resume'))).toBe('none');
  });
});
