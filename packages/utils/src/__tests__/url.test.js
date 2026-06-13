import { describe, it, expect, vi } from 'vitest';
import {
  safeUrl,
  getLinkRel,
  sanitizeHtml,
  isExternalUrl,
  formatUrlForDisplay,
} from '../url.js';

describe('safeUrl', () => {
  it('passes through safe protocols', () => {
    expect(safeUrl('https://example.com')).toBe('https://example.com');
    expect(safeUrl('mailto:a@b.com')).toBe('mailto:a@b.com');
    expect(safeUrl('tel:+123')).toBe('tel:+123');
  });

  it('blocks dangerous schemes (returns null)', () => {
    expect(safeUrl('javascript:alert(1)')).toBeNull();
    expect(safeUrl('data:text/html,<script>')).toBeNull();
    expect(safeUrl('vbscript:msgbox')).toBeNull();
    expect(safeUrl('file:///etc/passwd')).toBeNull();
    expect(safeUrl('about:blank')).toBeNull();
  });

  it('keeps relative URLs as-is', () => {
    expect(safeUrl('/about')).toBe('/about');
    expect(safeUrl('./x')).toBe('./x');
  });

  it('prefixes https for bare www and bare domains', () => {
    expect(safeUrl('www.example.com')).toBe('https://www.example.com');
    expect(safeUrl('example.com')).toBe('https://example.com');
  });

  it('returns null for falsy / non-string input', () => {
    expect(safeUrl('')).toBeNull();
    expect(safeUrl(null)).toBeNull();
    expect(safeUrl(undefined)).toBeNull();
    expect(safeUrl(42)).toBeNull();
  });

  it('does not write to the console for blocked or uncertain URLs', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    safeUrl('javascript:alert(1)');
    safeUrl('some uncertain value');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('getLinkRel', () => {
  it('adds noopener noreferrer for http(s) opening in a new tab', () => {
    expect(getLinkRel('https://example.com', true)).toBe('noopener noreferrer');
  });

  it('returns empty otherwise', () => {
    expect(getLinkRel('https://example.com', false)).toBe('');
    expect(getLinkRel('mailto:a@b.com', true)).toBe('');
    expect(getLinkRel('', true)).toBe('');
  });
});

describe('sanitizeHtml', () => {
  it('escapes HTML-significant characters', () => {
    expect(sanitizeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    );
    expect(sanitizeHtml(`"&'`)).toBe('&quot;&amp;&#039;');
  });

  it('returns empty string for falsy / non-string input', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(null)).toBe('');
  });
});

describe('isExternalUrl', () => {
  it('treats relative, hash, mailto, tel as not external', () => {
    expect(isExternalUrl('/about')).toBe(false);
    expect(isExternalUrl('#top')).toBe(false);
    expect(isExternalUrl('mailto:a@b.com')).toBe(false);
  });

  it('compares origins when one is provided', () => {
    expect(isExternalUrl('https://other.com/x', 'https://me.com')).toBe(true);
    expect(isExternalUrl('https://me.com/x', 'https://me.com')).toBe(false);
  });

  it('returns false for falsy / non-string input', () => {
    expect(isExternalUrl('')).toBe(false);
    expect(isExternalUrl(null)).toBe(false);
  });
});

describe('formatUrlForDisplay', () => {
  it('strips protocol and trailing slash', () => {
    expect(formatUrlForDisplay('https://example.com/')).toBe('example.com');
    expect(formatUrlForDisplay('http://example.com/blog')).toBe(
      'example.com/blog'
    );
    expect(formatUrlForDisplay('https://example.com///')).toBe('example.com');
  });

  it('leaves protocol-less URLs alone (minus trailing slash)', () => {
    expect(formatUrlForDisplay('example.com/')).toBe('example.com');
  });

  it('returns empty string for falsy / non-string input', () => {
    expect(formatUrlForDisplay('')).toBe('');
    expect(formatUrlForDisplay(null)).toBe('');
    expect(formatUrlForDisplay(123)).toBe('');
  });
});
