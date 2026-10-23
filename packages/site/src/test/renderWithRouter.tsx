import { RegistryProvider } from '@effect/atom-react';
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { act, render } from '@testing-library/react';
import type { ReactNode } from 'react';

/** Render a tree inside a minimal router (and atom registry) at `path`. */
export async function renderWithRouter(ui: ReactNode, path = '/') {
  const rootRoute = createRootRoute({ component: () => <>{ui}</> });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  await router.load();
  let result!: ReturnType<typeof render>;
  await act(async () => {
    result = render(
      <RegistryProvider>
        <RouterProvider router={router} />
      </RegistryProvider>
    );
  });
  return { ...result, router };
}
