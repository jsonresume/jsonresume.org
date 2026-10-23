import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import {
  Button,
  ErrorBoundary,
  PageState,
  ScoreMeter,
  SignInGate,
  StatusToggle,
} from '../index';
import { axeViolations } from '../test/axe';

describe('PageState', () => {
  it('renders each kind with sensible defaults', async () => {
    const onRetry = vi.fn();
    const { rerender, container } = render(
      <PageState
        kind="not-found"
        code="404"
        actions={<Button>Go home</Button>}
      />
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Page not found' })
    ).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
    rerender(
      <PageState
        kind="error"
        onRetry={onRetry}
        details="TypeError: x is undefined"
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledOnce();
    rerender(<PageState kind="loading" title="Loading jobs" />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading jobs');
  });
});

describe('ErrorBoundary', () => {
  it('shows the fallback when a child throws, and recovers on Try again', async () => {
    const onError = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    function Flaky() {
      const [broken, setBroken] = useState(true);
      return (
        <ErrorBoundary
          onError={onError}
          fallback={(e, reset) => (
            <div>
              <p>Failed: {e.message}</p>
              <button
                type="button"
                onClick={() => {
                  setBroken(false);
                  reset();
                }}
              >
                Retry
              </button>
            </div>
          )}
        >
          <Child broken={broken} />
        </ErrorBoundary>
      );
    }
    function Child({ broken }: { broken: boolean }) {
      if (broken) throw new Error('boom');
      return <p>Recovered</p>;
    }
    render(<Flaky />);
    expect(screen.getByText('Failed: boom')).toBeInTheDocument();
    expect(onError).toHaveBeenCalledOnce();
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByText('Recovered')).toBeInTheDocument();
    vi.mocked(console.error).mockRestore();
  });

  it('uses the default error state and resets when resetKeys change', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const Boom = ({ fail }: { fail: boolean }) => {
      if (fail) throw new Error('nope');
      return <p>Fine</p>;
    };
    const { rerender } = render(
      <ErrorBoundary resetKeys={['a']}>
        <Boom fail />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    rerender(
      <ErrorBoundary resetKeys={['b']}>
        <Boom fail={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Fine')).toBeInTheDocument();
    vi.mocked(console.error).mockRestore();
  });
});

describe('SignInGate', () => {
  it('offers sign in as a link or a button', async () => {
    const onSignIn = vi.fn();
    const { rerender, container } = render(
      <SignInGate
        title="Track your applications"
        signInHref="/login"
        features={['Save jobs']}
      />
    );
    expect(
      screen.getByRole('link', { name: 'Sign in with GitHub' })
    ).toHaveAttribute('href', '/login');
    expect(await axeViolations(container)).toEqual([]);
    rerender(
      <SignInGate title="Track your applications" onSignIn={onSignIn} />
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Sign in with GitHub' })
    );
    expect(onSignIn).toHaveBeenCalledOnce();
  });
});

describe('ScoreMeter', () => {
  it('is a meter with a value text that includes the band', async () => {
    const { rerender, container } = render(
      <ScoreMeter label="ATS score" value={84} />
    );
    const meter = screen.getByRole('meter', { name: 'ATS score' });
    expect(meter).toHaveAttribute('aria-valuenow', '84');
    expect(meter).toHaveAttribute('aria-valuetext', '84 out of 100, Strong');
    expect(await axeViolations(container)).toEqual([]);
    rerender(<ScoreMeter label="Readiness" value={130} variant="bar" />);
    expect(screen.getByRole('meter', { name: 'Readiness' })).toHaveAttribute(
      'aria-valuenow',
      '100'
    );
    rerender(<ScoreMeter label="Match" value={42} />);
    expect(screen.getByRole('meter')).toHaveAttribute(
      'aria-valuetext',
      '42 out of 100, Needs work'
    );
  });
});

describe('StatusToggle', () => {
  it('presses one status at a time and clears when pressed again', async () => {
    function Harness() {
      const [v, setV] = useState<string | null>(null);
      return (
        <StatusToggle
          label="Status for Senior Engineer"
          value={v}
          onValueChange={setV}
          options={[
            { value: 'interested', label: 'Interested' },
            { value: 'hidden', label: 'Hide' },
          ]}
        />
      );
    }
    const { container } = render(<Harness />);
    const interested = screen.getByRole('button', { name: 'Interested' });
    await userEvent.click(interested);
    expect(interested).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Hide' }));
    expect(interested).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(screen.getByRole('button', { name: 'Hide' }));
    expect(screen.getByRole('button', { name: 'Hide' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    expect(await axeViolations(container)).toEqual([]);
  });
});
