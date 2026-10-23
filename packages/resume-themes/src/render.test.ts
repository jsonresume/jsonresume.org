import { Effect, Schema } from 'effect';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { ensureHtmlCharset } from './charset.ts';
import { renderTheme, ResumeDocument, themeSlugs } from './render.ts';

const resume = Schema.decodeUnknownSync(ResumeDocument)(
  createRequire(import.meta.url)('@jsonresume/sample-data/complete-resume.json')
);

const render = (theme: string) => Effect.runPromise(renderTheme(theme, resume));
const name = 'Jane Developer';

describe('renderTheme', () => {
  it('knows every gallery theme', () => {
    expect(themeSlugs).toHaveLength(67);
    expect(themeSlugs).toContain('elegant');
  });

  it.each(themeSlugs)('renders %s', { timeout: 30_000 }, async (theme) => {
    const html = await render(theme);
    expect(html).toMatch(/<meta[^>]+charset/i);
    expect(html).toContain(name);
  });

  it.each(themeSlugs)('renders %s with only a name', async (theme) => {
    const html = await Effect.runPromise(
      renderTheme(theme, { basics: { name: 'Ada Lovelace' } })
    );
    expect(html).toContain('Ada Lovelace');
  });

  it('renders Handlebars themes again after others load', async () => {
    await render('macchiato');
    await render('pumpkin');
    expect(await render('macchiato')).toContain(name);
  });

  it('fails for an unknown theme', async () => {
    const error = await Effect.runPromise(
      Effect.flip(renderTheme('nope', resume))
    );
    expect(error._tag).toBe('ThemeNotFound');
  });
});

describe('ensureHtmlCharset', () => {
  it('adds a charset inside <head>', () => {
    expect(
      ensureHtmlCharset('<html><head><title>x</title></head></html>')
    ).toBe('<html><head><meta charset="utf-8"><title>x</title></head></html>');
  });

  it('leaves a declared charset alone', () => {
    const html = '<head><meta charset="iso-8859-1"></head>';
    expect(ensureHtmlCharset(html)).toBe(html);
  });
});
