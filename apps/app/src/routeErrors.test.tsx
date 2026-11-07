import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const captured = vi.hoisted((): unknown[] => []);
vi.mock('@repo/posthog/browser', () => ({
  captureError: (error: unknown) => void captured.push(error),
}));

const { routeErrors } = await import('./routeErrors');

describe('a page that crashes', () => {
  it('shows the error page and reports the error', async () => {
    const boom = new Error('menu exploded');
    const root = createRootRoute({
      component: () => {
        throw boom;
      },
    });
    const router = createRouter({
      routeTree: root,
      history: createMemoryHistory({ initialEntries: ['/'] }),
      ...routeErrors,
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<RouterProvider router={router} />);
    expect(
      await screen.findByRole('heading', { name: 'Something went wrong' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go home' })).toHaveAttribute(
      'href',
      '/'
    );
    expect(captured).toContain(boom);
  });
});
