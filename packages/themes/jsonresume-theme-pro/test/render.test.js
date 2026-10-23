import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { runThemeRenderQa } from '@jsonresume/theme-kit/qa';
import { render, renderWithDiagnostics } from '../src/index.js';
import { generate } from '../scripts/embed-fonts.mjs';

const fixture = (name) =>
  JSON.parse(
    readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), 'utf8')
  );
const FIXTURES = readdirSync(new URL('./fixtures', import.meta.url)).map((f) =>
  f.replace(/\.json$/, '')
);

// Visible text in document order, as a reader or extractor sees it on screen.
function visibleText(html) {
  return html
    .replace(/<style>[\s\S]*?<\/style>/g, '')
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    .replace(/<bdi class="pro-print">[\s\S]*?<\/bdi>/g, '')
    .replace(/<br>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

const body = (html) => html.slice(html.indexOf('<main'));

describe('Pro theme', () => {
  it('passes the registry render and section-coverage gate', async () => {
    const coverage = await runThemeRenderQa({ render, name: 'pro', expect });
    expect(Object.values(coverage).every(Boolean)).toBe(true);
  });

  it.each(FIXTURES)(
    '%s renders without artifacts or input mutation',
    (name) => {
      const resume = fixture(name);
      const before = JSON.stringify(resume);
      const html = render(resume);
      expect(JSON.stringify(resume)).toBe(before);
      expect(html).not.toMatch(
        /\bundefined\b|\bNaN\b|\[object Object\]|Invalid Date/i
      );
      expect(render(resume)).toBe(html);
    }
  );

  it('renders every supplied content field of the coverage fixture', () => {
    const resume = fixture('coverage');
    const html = render(resume);
    const shown = visibleText(body(html));
    // Documented display exclusions, and fields shown in another form.
    const excluded = [
      /^basics\.image$/,
      /^basics\.location\.(address|postalCode|countryCode)$/,
      /^meta\./,
      /^x-internal\./,
      /\.url$/,
      /\.identifiers\.doi$/,
    ];
    const missing = [];
    const walk = (value, path) => {
      if (Array.isArray(value))
        value.forEach((v, i) => walk(v, `${path}[${i}]`));
      else if (value && typeof value === 'object') {
        for (const [k, v] of Object.entries(value))
          walk(v, path ? `${path}.${k}` : k);
      } else if (typeof value === 'string' && value.trim()) {
        const key = path.replace(/\[\d+\]/g, '');
        if (excluded.some((re) => re.test(key))) return;
        if (key.endsWith('countryCode')) return; // written out as a name
        const expected = value
          .replace(/^[•◦▪▸►‣·∙*-]\s+/u, '')
          .replace(/\s+/g, ' ')
          .trim();
        const isDate = /Date$|^.*\.date$/.test(key);
        // Known networks get their display name ("linkedin" -> "LinkedIn").
        const found = key.endsWith('.network')
          ? shown.toLowerCase().includes(expected.toLowerCase())
          : shown.includes(expected);
        if (!isDate && !found) missing.push(`${path}: ${value}`);
      }
    };
    walk(resume, '');
    expect(missing).toEqual([]);
    expect(shown).toContain('Brisbane, Australia');
    expect(html).toContain('href="https://doi.org/10.1000/182"');
  });

  it('renders each piece of prose once, even when aliased', () => {
    const shown = visibleText(body(render(fixture('coverage'))));
    expect(shown.split('Plain-text clinical notes.').length).toBe(2);
    const reference = fixture('reference');
    const refShown = visibleText(body(render(reference)));
    for (const w of reference.work) {
      expect(refShown.split(w.summary.replace(/\s+/g, ' ')).length).toBe(2);
    }
  });

  it('leaves no scaffolding for missing data', () => {
    for (const name of FIXTURES) {
      const html = body(render(fixture(name)));
      expect(html).not.toMatch(/<(p|span|li|ul|div|h[1-3])[^>]*>\s*<\/\1>/);
      expect(html).not.toMatch(
        /·\s*<\/span><\/p>|<p class="pro-context-line"><span class="pro-sep"/
      );
    }
    const sparse = body(render(fixture('sparse')));
    expect(sparse).not.toContain('pro-section--skills');
    expect(sparse).not.toContain('pro-section--awards');
    expect(sparse).not.toContain('pro-section--interests');
    expect(sparse).not.toContain('pro-summary');
  });

  it('does not fabricate an identity when the name is absent', () => {
    const html = render({ work: [{ position: 'Cook' }] });
    expect(html).toContain('<title>Résumé</title>');
    expect(html).toContain('<h1 class="pro-sr">Résumé</h1>');
    expect(render({})).toContain('<main class="pro">');
    expect(render(null)).toContain('<main class="pro">');
  });

  it('applies settings without rendering them', () => {
    const coverage = fixture('coverage');
    const { html, diagnostics } = renderWithDiagnostics(coverage);
    const order = [...html.matchAll(/pro-section--(\w+)/g)].map((m) => m[1]);
    expect(order.slice(0, 3)).toEqual(['skills', 'work', 'projects']);
    expect(order).toContain('references');
    expect(diagnostics).toContain('Ignored sectionOrder entry "bogus"');
    expect(html).not.toContain('rosa.jpg');
    expect(html).not.toContain('12 Fig Tree Lane');
    expect(html).not.toContain('sectionOrder');

    const shown = render({
      ...coverage,
      meta: { pro: { showPortrait: true, showFullAddress: true } },
    });
    expect(shown).toContain(
      '<img class="pro-portrait" src="https://example.com/rosa.jpg" alt="Rosa Fielding">'
    );
    expect(shown).toContain('12 Fig Tree Lane, Brisbane, QLD 4000, Australia');
  });

  it('escapes text and rejects executable links', () => {
    const html = render({
      basics: {
        name: '<script>alert(1)</script>',
        url: 'javascript:alert(1)',
        profiles: [{ network: 'x', username: 'a"b', url: 'data:text/html,hi' }],
      },
      work: [
        {
          position: 'Dev',
          url: 'vbscript:x',
          summary: '<img src=x onerror=alert(1)>',
        },
      ],
    });
    expect(html).not.toContain('<script>alert');
    expect(html).not.toContain('<img src=x');
    expect(html).not.toMatch(/href="(javascript|data|vbscript):/);
    expect(html).toContain('&lt;script&gt;');
  });

  it('derives contact links without inventing details', () => {
    const html = render({
      basics: {
        email: 'not an email',
        phone: '+61 (0)7 1234 5678',
        profiles: [{ network: 'Unknown', username: 'someone' }],
      },
    });
    expect(html).not.toContain('mailto:');
    expect(html).toContain('href="tel:+61712345678"');
    expect(html).toContain('+61 (0)7 1234 5678');
    expect(html).toContain('Unknown: someone');
    expect(html).not.toMatch(/href="https?:\/\/[^"]*someone/);
  });

  it('keeps the embedded fonts in sync with fonts/', () => {
    const current = readFileSync(
      new URL('../src/fonts.generated.js', import.meta.url),
      'utf8'
    );
    expect(current).toBe(generate());
  });
});
