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
 * on the root route. `routes` maps a route id to the module of its lazy page
 * (as Vite keys it, e.g. 'src/routes/home.lazy.tsx'): a page then arrives
 * with its own stylesheets and modulepreloads, fetched alongside the entry
 * instead of after it has run.
 */
export function routerManifestFromVite(
  vite: ViteManifest,
  entry: string,
  base = '/',
  routes: Readonly<Record<string, string>> = {}
): Manifest {
  const chunk = vite[entry];
  if (!chunk) throw new Error(`Vite manifest has no entry for ${entry}`);
  const url = (file: string) => `${base}${file}`;

  /** A chunk's static imports, depth first, skipping those in `seen`. */
  const collect = (key: string, seen: Set<string>) => {
    const files: string[] = [];
    const css = new Set<string>();
    const walk = (from: string) => {
      for (const dep of vite[from]?.imports ?? []) {
        if (seen.has(dep)) continue;
        seen.add(dep);
        const depChunk = vite[dep];
        if (!depChunk) continue;
        files.push(depChunk.file);
        depChunk.css?.forEach((file) => css.add(file));
        walk(dep);
      }
    };
    walk(key);
    return { files, css };
  };

  const shell = new Set([entry]);
  const root = collect(entry, shell);
  const rootCss = new Set([...(chunk.css ?? []), ...root.css]);
  const pages = Object.entries(routes).flatMap(([routeId, key]) => {
    const page = vite[key];
    if (!page) return [];
    const deps = collect(key, new Set(shell));
    const css = [...(page.css ?? []), ...deps.css].filter(
      (file) => !rootCss.has(file)
    );
    return [
      [
        routeId,
        {
          css: [...new Set(css)].map(url),
          preloads: [page.file, ...deps.files].map(url),
        },
      ] as const,
    ];
  });

  return {
    routes: {
      [rootRouteId]: {
        css: [...rootCss].map(url),
        preloads: root.files.map(url),
        scripts: [{ attrs: { type: 'module', src: url(chunk.file) } }],
      },
      ...Object.fromEntries(pages),
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
