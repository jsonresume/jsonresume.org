import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { withTracking } from './script';
import { browser, device, isBot, referrerHost } from './visitor';

const page = (html: string) => {
  const sent: Array<{ path: string; body: unknown }> = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'https://jsonresume.org/@ada',
    beforeParse(window) {
      // No sendBeacon in jsdom, so the script falls back to fetch.
      Object.defineProperty(window, 'fetch', {
        value: (path: string, init: { body: string }) => {
          sent.push({ path, body: JSON.parse(init.body) });
          return Promise.resolve();
        },
      });
      Object.defineProperty(window, 'crypto', {
        value: { randomUUID: () => '11111111-2222-4333-8444-555555555555' },
      });
    },
  });
  return { dom, sent };
};

describe('withTracking', () => {
  it('goes just before </body>, or at the end without one', () => {
    expect(
      withTracking('<html><body><p>x</p></body></html>', 'ada', null)
    ).toMatch(/<p>x<\/p><script>.*<\/script><\/body><\/html>$/);
    expect(withTracking('<p>x</p>', 'ada', null)).toMatch(/^<p>x<\/p><script>/);
  });

  it('reports the view on load and the time when the page is hidden', async () => {
    const { dom, sent } = page(
      withTracking('<html><body><h1>Ada</h1></body></html>', 'ada', 'elegant')
    );
    Object.defineProperty(dom.window.document, 'visibilityState', {
      value: 'hidden',
      configurable: true,
    });
    dom.window.document.dispatchEvent(new dom.window.Event('visibilitychange'));
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(sent[0]).toEqual({
      path: '/api/events/view',
      body: {
        viewId: '11111111-2222-4333-8444-555555555555',
        username: 'ada',
        theme: 'elegant',
        referrer: null,
        width: dom.window.innerWidth,
      },
    });
    expect(sent[1]).toMatchObject({
      path: '/api/events/ping',
      body: { viewId: '11111111-2222-4333-8444-555555555555' },
    });
    dom.window.close();
  });

  it('keeps a username that looks like code inert', () => {
    const html = withTracking(
      '<body></body>',
      '"</script><script>alert(1)//',
      null
    );
    expect(html.match(/<script>/g)).toHaveLength(1);
  });
});

describe('visitor details', () => {
  const iphone =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1';
  const chrome =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36';
  it('reads device, browser and bots from the user agent', () => {
    expect([device(iphone), browser(iphone)]).toEqual(['mobile', 'Safari']);
    expect([device(chrome), browser(chrome), device(chrome, 500)]).toEqual([
      'desktop',
      'Chrome',
      'mobile',
    ]);
    expect([isBot('Googlebot/2.1'), isBot(''), isBot(chrome)]).toEqual([
      true,
      true,
      false,
    ]);
  });

  it('keeps only other sites as referrers', () => {
    expect(
      referrerHost('https://www.linkedin.com/in/x', 'jsonresume.org')
    ).toBe('linkedin.com');
    expect(
      referrerHost('https://jsonresume.org/themes', 'jsonresume.org')
    ).toBeNull();
    expect(referrerHost('not a url', 'jsonresume.org')).toBeNull();
  });
});
