import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { authHintScript, HeaderAuth } from './HeaderAuth';

afterEach(() => {
  document.cookie = 'jr_signed_in=; max-age=0';
  delete document.documentElement.dataset['auth'];
});

describe('HeaderAuth', () => {
  it('marks the page signed in before it paints, from the hint cookie', () => {
    new Function(authHintScript)();
    expect(document.documentElement.dataset['auth']).toBeUndefined();
    document.cookie = 'jr_signed_in=1';
    new Function(authHintScript)();
    expect(document.documentElement.dataset['auth']).toBe('in');
  });

  it('renders both choices, so the first paint never has to change', () => {
    render(<HeaderAuth />);
    for (const name of ['Sign in', 'Sign up', 'Dashboard'])
      expect(screen.getByRole('link', { name })).toBeInTheDocument();
    expect(document.documentElement.dataset['auth']).toBe('out');
  });
});
