import { act, fireEvent, render, screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { useNextHref } from './shared';
import { SignInPage } from './SignInPage';
import { SignUpPage } from './SignUpPage';

describe('SignInPage', () => {
  it('offers GitHub, then email and password, and keeps where to go next', () => {
    render(
      <SignInPage
        next="/dashboard/settings"
        signUpLink={<a href="/signup">Create an account</a>}
      />
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Sign in' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Continue with GitHub/ })
    ).toHaveAttribute(
      'href',
      '/api/auth/github?intent=signin&next=%2Fdashboard%2Fsettings'
    );
    expect(screen.getByLabelText(/Email/)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/Password/)).toHaveAttribute(
      'autocomplete',
      'current-password'
    );
  });

  it('explains a GitHub sign-in that came back with an error', () => {
    render(<SignInPage error="github-down" signUpLink={null} />);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'GitHub isn’t answering'
    );
  });
});

describe('a prerendered page, hydrated with ?next=', () => {
  // The prerendered HTML has no ?next=; hydration alone keeps that href.
  it('carries next on GitHub and on the link to the other form', async () => {
    const next = '/oauth/authorize?client_id=jrc_x';
    function Page() {
      const href = useNextHref('/signup', next);
      return (
        <SignInPage
          next={next}
          signUpLink={<a href={href}>Create an account</a>}
        />
      );
    }
    const container = document.createElement('div');
    container.innerHTML = renderToString(
      <SignInPage signUpLink={<a href="/signup">Create an account</a>} />
    );
    document.body.append(container);
    await act(async () => {
      hydrateRoot(container, <Page />, { onRecoverableError: () => {} });
    });
    const encoded = encodeURIComponent(next);
    expect(
      container.querySelector('a[href^="/api/auth/github"]')
    ).toHaveAttribute('href', `/api/auth/github?intent=signin&next=${encoded}`);
    expect(
      [...container.querySelectorAll('a')].find(
        (a) => a.textContent === 'Create an account'
      )
    ).toHaveAttribute('href', `/signup?next=${encoded}`);
    container.remove();
  });
});

describe('SignUpPage', () => {
  it('shows the page address and checks the username format as you type', () => {
    render(<SignUpPage signInLink={<a href="/signin">Sign in</a>} />);
    const username = screen.getByLabelText(/Username/);
    fireEvent.change(username, { target: { value: 'Ada-L' } });
    expect(username).toHaveValue('ada-l');
    expect(screen.getByText(/jsonresume.org\/@ada-l/)).toBeInTheDocument();
    fireEvent.change(username, { target: { value: 'ada--l' } });
    expect(screen.getByText(/single hyphens/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toHaveAttribute(
      'minlength',
      '10'
    );
  });
});

describe('safeNext', () => {
  it('keeps paths on this site and drops anything else', async () => {
    const { safeNext } = await import('./shared');
    expect(safeNext('/dashboard/resume', '/x')).toBe('/dashboard/resume');
    for (const bad of [
      'https://evil.example',
      '//evil.example',
      '/\\evil.example',
      undefined,
    ]) {
      expect(safeNext(bad, '/x')).toBe('/x');
    }
  });
});
