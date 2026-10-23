import type { AnyRouter } from '@tanstack/react-router';
import { RouterClient } from '@tanstack/react-router/ssr/client';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

/**
 * Hydrate a server-rendered (or prerendered) TanStack Router document. The
 * root route renders <html>, so React hydrates the whole document; loader
 * data and assets come from the state the server dehydrated into the page.
 */
export function hydrateRouter(router: AnyRouter): void {
  hydrateRoot(
    document,
    <StrictMode>
      <RouterClient router={router} />
    </StrictMode>
  );
}
