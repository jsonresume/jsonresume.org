import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { RouteProgress } from '../../index';

describe('RouteProgress', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows only for slow loads, then finishes', () => {
    const { container, rerender } = render(<RouteProgress active={false} />);
    const bar = () => container.firstElementChild;
    expect(bar()).toHaveAttribute('aria-hidden', 'true');
    rerender(<RouteProgress active />);
    act(() => vi.advanceTimersByTime(100));
    expect(bar()).toHaveAttribute('data-phase', 'idle');
    act(() => vi.advanceTimersByTime(100));
    expect(bar()).toHaveAttribute('data-phase', 'loading');
    rerender(<RouteProgress active={false} />);
    expect(bar()).toHaveAttribute('data-phase', 'done');
  });

  it('never shows for a fast load', () => {
    const { container, rerender } = render(<RouteProgress active />);
    act(() => vi.advanceTimersByTime(50));
    rerender(<RouteProgress active={false} />);
    act(() => vi.advanceTimersByTime(500));
    expect(container.firstElementChild).toHaveAttribute('data-phase', 'idle');
  });
});
