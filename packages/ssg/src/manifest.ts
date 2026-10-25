import { rootRouteId, type Manifest } from '@tanstack/react-router';

/** One entry of Vite's build manifest (dist/client/.vite/manifest.json). */
export interface ViteManifestChunk {
  file: string;
  src?: string;
  isEntry?: boolean;
  css?: string[];
  imports?: string[];
}

export type ViteManifest = Record<string, ViteManifestChunk>;

/**
 * Turn Vite's client build manifest into the router manifest TanStack
 * Router's SSR injects: the entry's stylesheets as <link>s via <HeadContent />
 * and the entry script (plus modulepreloads for its imports) via <Scripts />,
 * all on the root route.
 */
export function routerManifestFromVite(
  vite: ViteManifest,
  entry: string,
  base = '/'
): Manifest {
  const chunk = vite[entry];
  if (!chunk) throw new Error(`Vite manifest has no entry for ${entry}`);
  const url = (file: string) => `${base}${file}`;

  const seen = new Set<string>();
  const imports: string[] = [];
  const css = new Set(chunk.css ?? []);
  const walk = (key: string) => {
    for (const dep of vite[key]?.imports ?? []) {
      if (seen.has(dep)) continue;
      seen.add(dep);
      const depChunk = vite[dep];
      if (!depChunk) continue;
      imports.push(depChunk.file);
      depChunk.css?.forEach((file) => css.add(file));
      walk(dep);
    }
  };
  walk(entry);

  return {
    routes: {
      [rootRouteId]: {
        css: [...css].map(url),
        preloads: imports.map(url),
        scripts: [{ attrs: { type: 'module', src: url(chunk.file) } }],
      },
    },
  };
}

/** The manifest for `vite dev`: Vite's client, React refresh, and the source entry. */
export function devRouterManifest(entry: string): Manifest {
  const refreshPreamble = [
    "import RefreshRuntime from '/@react-refresh';",
    'RefreshRuntime.injectIntoGlobalHook(window);',
    'window.$RefreshReg$ = () => {};',
    'window.$RefreshSig$ = () => (type) => type;',
    'window.__vite_plugin_react_preamble_installed__ = true;',
  ].join('\n');
  return {
    routes: {
      [rootRouteId]: {
        scripts: [
          { attrs: { type: 'module' }, children: refreshPreamble },
          { attrs: { type: 'module', src: '/@vite/client' } },
          { attrs: { type: 'module', src: `/${entry}` } },
        ],
      },
    },
  };
}
