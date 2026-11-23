import { describe, expect, it } from 'vitest';
import { securityTxt, securityTxtRoute } from './securityTxt';

describe('security.txt', () => {
  const text = securityTxt(
    'https://jsonresume.org',
    new Date('2026-11-23T00:00:00Z')
  );

  it('names a contact, a policy and its canonical URL', () => {
    expect(text).toMatch(
      /^Contact: https:\/\/github\.com\/.+\/security\/advisories\/new$/m
    );
    expect(text).toMatch(/^Policy: https:\/\/.+SECURITY\.md$/m);
    expect(text).toContain(
      'Canonical: https://jsonresume.org/.well-known/security.txt'
    );
  });

  it('expires less than a year after it was made', () => {
    const expires = /^Expires: (.+)$/m.exec(text)?.[1] ?? '';
    expect(expires).toBe('2027-05-22T00:00:00Z');
  });

  it('is served as plain text', async () => {
    const res = await securityTxtRoute('https://jsonresume.org').fetch();
    expect(res.headers.get('content-type')).toContain('text/plain');
    expect(await res.text()).toContain('Contact: ');
  });
});
