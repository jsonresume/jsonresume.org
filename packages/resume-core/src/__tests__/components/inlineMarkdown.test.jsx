import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderHtml } from './renderHtml.jsx';
import { InlineMarkdown, renderInlineMarkdown } from '../../index.js';

describe('InlineMarkdown (component)', () => {
  it('renders the inline Markdown the schema allows', () => {
    const { html } = renderHtml(
      <InlineMarkdown text="Shipped **v2** with [Rust](https://rust-lang.org)" />
    );
    expect(html).toContain('<span>Shipped <strong>v2</strong> with ');
    expect(html).toContain('<a href="https://rust-lang.org">Rust</a>');
  });

  it('renders as another element, escaping what it is given', () => {
    const { html } = renderHtml(
      <ul>
        <InlineMarkdown as="li" className="x" text="<b>raw</b> *ok*" />
      </ul>
    );
    expect(html).toContain(
      '<li class="x">&lt;b&gt;raw&lt;/b&gt; <em>ok</em></li>'
    );
  });

  it('is the same renderer @jsonresume/utils exports', () => {
    expect(renderInlineMarkdown('`a`')).toBe('<code>a</code>');
  });
});
