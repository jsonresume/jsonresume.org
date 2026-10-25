import { describe, expect, it } from 'vitest';
import { mayFetch, mayLoad, paperFor } from './policy';

describe('mayFetch', () => {
  it('lets the page load from the public web and inline data', () => {
    for (const url of [
      'https://fonts.googleapis.com/css2?family=Inter',
      'http://example.com/me.jpg',
      'https://93.184.216.34/a.png',
      'data:image/png;base64,AAAA',
      'about:blank',
    ])
      expect(mayFetch(url), url).toBe(true);
  });

  it('refuses this machine, private networks and other schemes', () => {
    for (const url of [
      'http://127.0.0.1:3003/api/me',
      'http://localhost:5432',
      'http://10.0.0.5/',
      'http://172.20.1.1/',
      'http://192.168.1.1/',
      'http://169.254.169.254/latest/meta-data',
      'http://100.64.0.1/',
      'http://[::1]/',
      'http://[fd00::1]/',
      'http://[::ffff:127.0.0.1]/',
      'http://0.0.0.0/',
      'http://printer.local/',
      'http://intranet/',
      'file:///etc/passwd',
      'ftp://example.com/x',
      'not a url',
    ])
      expect(mayFetch(url), url).toBe(false);
  });
});

describe('mayLoad', () => {
  it('refuses names that resolve to this machine', async () => {
    expect(await mayLoad('http://localhost.:3003/')).toBe(false);
    expect(await mayLoad('http://[::1]/')).toBe(false);
    expect(await mayLoad('data:text/css,')).toBe(true);
  });
});

describe('paperFor', () => {
  it('takes ?paper= first, then where the person lives, then A4', () => {
    expect(paperFor('LETTER', 'GB')).toBe('letter');
    expect(paperFor('a4', 'US')).toBe('a4');
    expect(paperFor(null, 'us')).toBe('letter');
    expect(paperFor('tabloid', 'AU')).toBe('a4');
    expect(paperFor(undefined, undefined)).toBe('a4');
  });
});
