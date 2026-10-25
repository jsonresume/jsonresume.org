import type { AnyRouter, Manifest } from '@tanstack/react-router';
import {
  createRequestHandler,
  renderRouterToString,
  RouterServer,
} from '@tanstack/react-router/ssr/server';

export interface RendererOptions<R extends AnyRouter, C> {
  /**
   * A fresh router per request, given what the caller passed to render (for
   * router context). Do not pass a history; the handler sets one.
   */
  createRouter: (context?: C) => R;
  /** Assets to inject (see routerManifestFromVite / devRouterManifest). */
  manifest: Manifest | (() => Manifest | Promise<Manifest>);
}

/**
 * Server rendering with TanStack Router's SSR: Request in, full HTML Response
 * out (status 404 for unmatched routes and notFound() loaders, redirects as
 * redirects). Loader data and the manifest are dehydrated into the page for
 * RouterClient to hydrate. Used live by the server and by prerender().
 * `context` goes to createRouter, so a live render can hand the page data
 * the server already has (it is dehydrated like any loader data).
 */
export function createRenderer<R extends AnyRouter, C = never>({
  createRouter,
  manifest,
}: RendererOptions<R, C>) {
  const getRouterManifest =
    typeof manifest === 'function' ? manifest : () => manifest;
  return (request: Request, context?: C): Promise<Response> =>
    createRequestHandler({
      request,
      createRouter: () => createRouter(context),
      getRouterManifest,
    })(({ router, responseHeaders }) =>
      renderRouterToString({
        router,
        responseHeaders,
        children: <RouterServer router={router} />,
      })
    );
}
