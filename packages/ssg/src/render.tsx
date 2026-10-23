import type { AnyRouter, Manifest } from '@tanstack/react-router';
import {
  createRequestHandler,
  renderRouterToString,
  RouterServer,
} from '@tanstack/react-router/ssr/server';

export interface RendererOptions<R extends AnyRouter> {
  /** A fresh router per request. Do not pass a history; the handler sets one. */
  createRouter: () => R;
  /** Assets to inject (see routerManifestFromVite / devRouterManifest). */
  manifest: Manifest | (() => Manifest | Promise<Manifest>);
}

/**
 * Server rendering with TanStack Router's SSR: Request in, full HTML Response
 * out (status 404 for unmatched routes and notFound() loaders, redirects as
 * redirects). Loader data and the manifest are dehydrated into the page for
 * RouterClient to hydrate. Used live by the server and by prerender().
 */
export function createRenderer<R extends AnyRouter>({
  createRouter,
  manifest,
}: RendererOptions<R>) {
  const getRouterManifest =
    typeof manifest === 'function' ? manifest : () => manifest;
  return (request: Request): Promise<Response> =>
    createRequestHandler({ request, createRouter, getRouterManifest })(
      ({ router, responseHeaders }) =>
        renderRouterToString({
          router,
          responseHeaders,
          children: <RouterServer router={router} />,
        })
    );
}
