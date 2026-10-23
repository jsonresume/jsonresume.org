import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Markdown } from '../index';

describe('Markdown renderLink', () => {
  it('lets the caller render same-site links and falls back for the rest', () => {
    render(
      <Markdown
        renderLink={({ href, children }) =>
          href.startsWith('/') ? (
            <a href={href} data-router="">
              {children}
            </a>
          ) : undefined
        }
      >
        {'See [the schema](/schema) or [GitHub](https://github.com).'}
      </Markdown>
    );
    expect(screen.getByRole('link', { name: 'the schema' })).toHaveAttribute(
      'data-router'
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).not.toHaveAttribute(
      'data-router'
    );
  });
});
