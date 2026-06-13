import { describe, it, expect } from 'vitest';
import React from 'react';
import styled from 'styled-components';
import { renderResumeDocument, googleFontsLinks } from '../../ssr/index.js';

const Box = styled.div`
  color: rgb(1, 2, 3);
`;

describe('googleFontsLinks', () => {
  it('returns empty string for no fonts', () => {
    expect(googleFontsLinks()).toBe('');
    expect(googleFontsLinks([])).toBe('');
    expect(googleFontsLinks(null)).toBe('');
  });

  it('builds a single css2 request from family names', () => {
    const out = googleFontsLinks(['Inter', 'IBM Plex Sans']);
    expect(out).toContain('rel="preconnect"');
    expect(out).toContain('fonts.gstatic.com');
    expect(out).toContain(
      'https://fonts.googleapis.com/css2?family=Inter&family=IBM+Plex+Sans&display=swap'
    );
  });

  it('preserves axis/weight specs on a family name', () => {
    const out = googleFontsLinks(['Inter:wght@400;700']);
    expect(out).toContain('family=Inter:wght@400;700');
  });

  it('passes through a ready-made href', () => {
    const href = 'https://fonts.googleapis.com/css2?family=Roboto&display=swap';
    const out = googleFontsLinks([href]);
    expect(out).toContain(`<link href="${href}" rel="stylesheet">`);
    // No css2 family= request was synthesised on top of the href.
    expect(out).not.toContain('family=Roboto&family');
  });

  it('passes through a ready-made <link> tag verbatim', () => {
    const tag = '<link href="https://example.com/f.css" rel="stylesheet">';
    expect(googleFontsLinks([tag])).toContain(tag);
  });
});

describe('renderResumeDocument', () => {
  it('emits a doctype, the element markup, and the collected styles', () => {
    const out = renderResumeDocument(<Box>Hello</Box>);
    expect(out.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(out).toContain('Hello');
    // styled-components injected a <style> tag with the declared color.
    expect(out).toContain('<style');
    expect(out).toContain('color:rgb(1, 2, 3)');
    expect(out.trimEnd().endsWith('</html>')).toBe(true);
  });

  it('includes the font links when fonts are given', () => {
    const out = renderResumeDocument(<Box>Hi</Box>, { fonts: ['Inter'] });
    expect(out).toContain(
      'https://fonts.googleapis.com/css2?family=Inter&display=swap'
    );
  });

  it('links the @jsonresume/core tokens.css by default', () => {
    const out = renderResumeDocument(<Box>Hi</Box>);
    expect(out).toContain('@jsonresume/core/dist/tokens.css');
  });

  it('omits tokens.css when includeTokensCss is false', () => {
    const out = renderResumeDocument(<Box>Hi</Box>, {
      includeTokensCss: false,
    });
    expect(out).not.toContain('tokens.css');
  });

  it('honours title, lang and dir options', () => {
    const out = renderResumeDocument(<Box>Hi</Box>, {
      title: 'Jane Developer',
      lang: 'ar',
      dir: 'rtl',
    });
    expect(out).toContain('<title>Jane Developer</title>');
    expect(out).toContain('<html lang="ar" dir="rtl">');
  });

  it('omits the title tag when no title is given', () => {
    const out = renderResumeDocument(<Box>Hi</Box>);
    expect(out).not.toContain('<title>');
  });

  it('includes the minimal reset only when reset is true', () => {
    const withReset = renderResumeDocument(<Box>Hi</Box>, { reset: true });
    expect(withReset).toContain('box-sizing:border-box');
    const without = renderResumeDocument(<Box>Hi</Box>);
    expect(without).not.toContain('box-sizing:border-box');
  });

  it('injects extra head HTML and a body class', () => {
    const out = renderResumeDocument(<Box>Hi</Box>, {
      head: '<meta name="robots" content="noindex">',
      bodyClass: 'theme-foo',
    });
    expect(out).toContain('<meta name="robots" content="noindex">');
    expect(out).toContain('<body class="theme-foo">');
  });

  it('places head before, and headAfterStyles after, the styled-components tags', () => {
    const out = renderResumeDocument(<Box>Hi</Box>, {
      head: '<style id="before">:root{--x:1}</style>',
      headAfterStyles: '<style id="after">@page{margin:1cm}</style>',
    });
    const before = out.indexOf('id="before"');
    const styled = out.indexOf('data-styled');
    const after = out.indexOf('id="after"');
    expect(before).toBeGreaterThan(-1);
    expect(after).toBeGreaterThan(-1);
    // cascade order: head -> styled-components -> headAfterStyles
    expect(before).toBeLessThan(styled);
    expect(styled).toBeLessThan(after);
  });

  it('omits headAfterStyles when not provided', () => {
    const out = renderResumeDocument(<Box>Hi</Box>);
    expect(out).not.toContain('id="after"');
  });

  it('always seals the sheet — styles do not leak across calls', () => {
    // Two different styled components rendered in separate calls. If the sheet
    // were not sealed, the second document would carry the first's rules.
    const A = styled.div`
      color: rgb(10, 20, 30);
    `;
    const B = styled.div`
      color: rgb(40, 50, 60);
    `;
    const first = renderResumeDocument(<A>a</A>);
    const second = renderResumeDocument(<B>b</B>);
    expect(first).toContain('color:rgb(10, 20, 30)');
    expect(first).not.toContain('color:rgb(40, 50, 60)');
    expect(second).toContain('color:rgb(40, 50, 60)');
    expect(second).not.toContain('color:rgb(10, 20, 30)');
  });
});
