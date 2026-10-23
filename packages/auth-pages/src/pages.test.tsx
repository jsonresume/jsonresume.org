import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
