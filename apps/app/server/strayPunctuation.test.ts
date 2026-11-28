import { describe, expect, it } from 'vitest';
import { strayPunctuation } from './strayPunctuation';

const visit = (path: string, method = 'GET') =>
  strayPunctuation(new Request(`https://jsonresume.org${path}`, { method }));

describe('strayPunctuation', () => {
  it('drops what a sentence left on the end of a link', () => {
    const cases: ReadonlyArray<readonly [string, string]> = [
      ['/schema).', '/schema'],
      ['/schema/%29', '/schema/'],
      ['/mcp).', '/mcp'],
      ['/@radarmakers,', '/@radarmakers'],
      ['/getting-started)', '/getting-started'],
      ['/@thomasdavis%E2%80%9D', '/@thomasdavis'],
      ['/themes/flat%22', '/themes/flat'],
      ['/]', '/'],
    ];
    for (const [from, to] of cases) {
      const moved = visit(from);
      expect(moved?.status, from).toBe(301);
      expect(moved?.headers.get('location'), from).toBe(to);
    }
  });

  it('keeps the query', () => {
    expect(visit('/@kbsali.?theme=flat')?.headers.get('location')).toBe(
      '/@kbsali?theme=flat'
    );
  });

  it('leaves everything else to the 404', () => {
    expect(visit('/nobody')).toBeUndefined();
    expect(visit('/[LinkedIn%20URL]')).toBeUndefined();
    expect(visit('/target=%22_blank%22')).toBeUndefined();
    expect(visit('/schema).', 'POST')).toBeUndefined();
    expect(visit('/%E0%A4%A')).toBeUndefined();
  });
});
