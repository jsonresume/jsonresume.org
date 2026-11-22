import { describe, expect, it } from 'vitest';
import { renderInlineMarkdown, stripInlineMarkdown } from '../markdown.js';

describe('renderInlineMarkdown', () => {
  it('renders strong, emphasis, code and links', () => {
    expect(
      renderInlineMarkdown(
        'Cut costs **40%** with *careful* `SQL` and [Rust](https://rust-lang.org)'
      )
    ).toBe(
      'Cut costs <strong>40%</strong> with <em>careful</em> <code>SQL</code> and <a href="https://rust-lang.org">Rust</a>'
    );
    expect(renderInlineMarkdown('__bold__ and _soft_')).toBe(
      '<strong>bold</strong> and <em>soft</em>'
    );
    expect(renderInlineMarkdown('[**big** win](mailto:a@b.co)')).toBe(
      '<a href="mailto:a@b.co"><strong>big</strong> win</a>'
    );
  });

  it('leaves text that only looks like Markdown as written', () => {
    expect(renderInlineMarkdown('snake_case_name and file_name.txt')).toBe(
      'snake_case_name and file_name.txt'
    );
    expect(renderInlineMarkdown('5 * 3 * 2 = 30')).toBe('5 * 3 * 2 = 30');
    expect(renderInlineMarkdown('\\*not emphasis\\*')).toBe('*not emphasis*');
    expect(renderInlineMarkdown('`**not bold**`')).toBe(
      '<code>**not bold**</code>'
    );
    // Block syntax isn't part of the format: it stays text.
    expect(renderInlineMarkdown('# Heading')).toBe('# Heading');
  });

  it('is safe with text from anyone', () => {
    expect(renderInlineMarkdown('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    );
    expect(renderInlineMarkdown('[click](javascript:alert(1))')).toBe('click)');
    expect(renderInlineMarkdown('[<img onerror=x>](https://a.co)')).toBe(
      '<a href="https://a.co">&lt;img onerror=x&gt;</a>'
    );
    expect(renderInlineMarkdown('[x](https://a.co/"onmouseover=1)')).toBe(
      '<a href="https://a.co/&quot;onmouseover=1">x</a>'
    );
    expect(renderInlineMarkdown('[a](https://x.co/a*b*)')).toBe(
      '<a href="https://x.co/a*b*">a</a>'
    );
    expect(renderInlineMarkdown('\uE0000\uE000 fake')).toBe('0 fake');
    expect(renderInlineMarkdown(42)).toBe('');
  });
});

describe('stripInlineMarkdown', () => {
  it('keeps the words and drops the marks', () => {
    expect(
      stripInlineMarkdown(
        'Cut costs **40%** with *careful* `SQL` and [Rust](https://rust-lang.org)'
      )
    ).toBe('Cut costs 40% with careful SQL and Rust');
    expect(stripInlineMarkdown('snake_case stays, \\*literal\\*')).toBe(
      'snake_case stays, *literal*'
    );
    expect(stripInlineMarkdown('<b>not html</b>')).toBe('<b>not html</b>');
    expect(stripInlineMarkdown(null)).toBe('');
  });
});
