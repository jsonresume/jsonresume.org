import { describe, it, expect } from 'vitest';
import { ensureHtmlCharset } from './ensureHtmlCharset';

describe('ensureHtmlCharset', () => {
  it('injects meta charset right after <head>', () => {
    const html = '<!DOCTYPE html><html><head><title>x</title></head></html>';

    expect(ensureHtmlCharset(html)).toBe(
      '<!DOCTYPE html><html><head><meta charset="utf-8"><title>x</title></head></html>'
    );
  });

  it('injects after <head> with attributes', () => {
    const html = '<html><head lang="en"><title>x</title></head></html>';

    expect(ensureHtmlCharset(html)).toBe(
      '<html><head lang="en"><meta charset="utf-8"><title>x</title></head></html>'
    );
  });

  it('injects after <html> when there is no head', () => {
    const html = '<html><body>é</body></html>';

    expect(ensureHtmlCharset(html)).toBe(
      '<html><meta charset="utf-8"><body>é</body></html>'
    );
  });

  it('injects after doctype when there is no head or html tag', () => {
    const html = '<!DOCTYPE html><body>é</body>';

    expect(ensureHtmlCharset(html)).toBe(
      '<!DOCTYPE html><meta charset="utf-8"><body>é</body>'
    );
  });

  it('prepends for bare fragments', () => {
    expect(ensureHtmlCharset('<div>é</div>')).toBe(
      '<meta charset="utf-8"><div>é</div>'
    );
  });

  it('leaves html5 charset declarations untouched', () => {
    const html = '<html><head><meta charset="UTF-8"></head></html>';

    expect(ensureHtmlCharset(html)).toBe(html);
  });

  it('leaves http-equiv content-type declarations untouched', () => {
    const html =
      '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head></html>';

    expect(ensureHtmlCharset(html)).toBe(html);
  });

  it('passes through non-string content unchanged', () => {
    expect(ensureHtmlCharset(undefined)).toBe(undefined);
    expect(ensureHtmlCharset(null)).toBe(null);
    expect(ensureHtmlCharset(42)).toBe(42);
  });

  it('preserves multi-byte characters around the injection point', () => {
    const html =
      '<html><head></head><body>données métier ça œuvre</body></html>';

    expect(ensureHtmlCharset(html)).toContain('données métier ça œuvre');
    expect(ensureHtmlCharset(html)).toContain('<meta charset="utf-8">');
  });
});
