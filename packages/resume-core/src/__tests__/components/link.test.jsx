import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHtml } from './renderHtml.jsx';
import { Link, safeUrl, isExternalUrl, getLinkRel } from '../../index.js';

describe('Link (component)', () => {
  it('renders a safe https anchor with the resume-link class', () => {
    const { html } = renderHtml(<Link href="https://example.com">Visit</Link>);
    expect(html).toContain('<a');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('Visit');
    expect(html).toContain('resume-link');
  });

  it('marks external links with target=_blank and rel', () => {
    const { html } = renderHtml(
      <Link href="https://external.example.com">Out</Link>
    );
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('downgrades a dangerous javascript: URL to a plain span', () => {
    const { html } = renderHtml(<Link href="javascript:alert(1)">click</Link>);
    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('<a');
    expect(html).toContain('<span');
    expect(html).toContain('click');
  });

  it('renders a span (no anchor) when href is missing', () => {
    const { html } = renderHtml(<Link>no href</Link>);
    expect(html).toContain('<span');
    expect(html).not.toContain('<a');
    expect(html).toContain('no href');
  });

  it('preserves the className on the fallback span', () => {
    const { html } = renderHtml(
      <Link href="" className="fallback">
        x
      </Link>
    );
    expect(html).toContain('<span');
    expect(html).toContain('fallback');
  });

  it('does not add target/rel for relative (internal) links', () => {
    const { html } = renderHtml(<Link href="/about">About</Link>);
    expect(html).toContain('href="/about"');
    expect(html).not.toContain('target="_blank"');
  });
});

describe('safeUrl', () => {
  it('passes through http(s), mailto, and tel', () => {
    expect(safeUrl('https://x.com')).toBe('https://x.com');
    expect(safeUrl('mailto:a@b.com')).toBe('mailto:a@b.com');
    expect(safeUrl('tel:123')).toBe('tel:123');
  });

  it.each([
    'javascript:alert(1)',
    'data:text/html,<script>',
    'vbscript:msgbox',
    'file:///etc/passwd',
    'about:blank',
  ])('blocks dangerous scheme %s', (url) => {
    expect(safeUrl(url)).toBeNull();
  });

  it('returns null for non-string / empty input', () => {
    expect(safeUrl(null)).toBeNull();
    expect(safeUrl(undefined)).toBeNull();
    expect(safeUrl(123)).toBeNull();
    expect(safeUrl('')).toBeNull();
  });

  it('keeps relative URLs', () => {
    expect(safeUrl('/about')).toBe('/about');
    expect(safeUrl('./rel')).toBe('./rel');
  });

  it('upgrades bare www. and bare domains to https', () => {
    expect(safeUrl('www.example.com')).toBe('https://www.example.com');
    expect(safeUrl('example.com')).toBe('https://example.com');
  });
});

describe('isExternalUrl', () => {
  it('treats relative, hash, mailto, tel as internal', () => {
    expect(isExternalUrl('/about')).toBe(false);
    expect(isExternalUrl('#section')).toBe(false);
    expect(isExternalUrl('mailto:a@b.com')).toBe(false);
    expect(isExternalUrl('tel:123')).toBe(false);
  });

  it('compares origin when one is provided', () => {
    expect(isExternalUrl('https://other.com/x', 'https://site.com')).toBe(true);
    expect(isExternalUrl('https://site.com/x', 'https://site.com')).toBe(false);
  });

  it('returns false for non-string input', () => {
    expect(isExternalUrl(null)).toBe(false);
  });
});

describe('getLinkRel', () => {
  it('adds rel only for http(s) links opening in a new tab', () => {
    expect(getLinkRel('https://x.com', true)).toBe('noopener noreferrer');
    expect(getLinkRel('https://x.com', false)).toBe('');
    expect(getLinkRel('mailto:a@b.com', true)).toBe('');
    expect(getLinkRel(null, true)).toBe('');
  });
});
