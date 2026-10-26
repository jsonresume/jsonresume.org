import { relative } from 'node:path';
import type { Plugin } from 'vite';

/** Where the client build records which module holds each lazy route. */
export const LAZY_ROUTES_FILE = '.vite/lazy-routes.json';

const LAZY_ROUTE = /createLazyRoute\(\s*(['"`])([^'"`]+)\1/g;

/** The route ids a module declares with createLazyRoute('<id>'). */
export const lazyRouteIds = (code: string) =>
  [...code.matchAll(LAZY_ROUTE)].flatMap((match) =>
    match[2] === undefined ? [] : [match[2]]
  );

/**
 * Writes `.vite/lazy-routes.json` in the client build: each route id a
 * `.lazy.tsx` module declares, keyed to that module as Vite's manifest keys
 * it. routerManifestFromVite takes it as `routes`, so a page's HTML preloads
 * its own chunk and stylesheets. Router types check the ids themselves.
 */
export function lazyRoutes(): Plugin {
  let root = process.cwd();
  return {
    name: 'ssg-lazy-routes',
    apply: 'build',
    configResolved(config) {
      root = config.root;
    },
    generateBundle(_, bundle) {
      if (this.environment?.config.consumer === 'server') return;
      const routes: Record<string, string> = {};
      for (const chunk of Object.values(bundle)) {
        const facade = chunk.type === 'chunk' ? chunk.facadeModuleId : null;
        if (!facade?.endsWith('.lazy.tsx')) continue;
        const code = this.getModuleInfo(facade)?.code ?? '';
        const key = relative(root, facade);
        for (const id of lazyRouteIds(code)) routes[id] = key;
      }
      this.emitFile({
        type: 'asset',
        fileName: LAZY_ROUTES_FILE,
        source: JSON.stringify(routes, null, 2),
      });
    },
  };
}
